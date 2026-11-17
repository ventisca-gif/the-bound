"""Pack imagegen-isolated approved art for the visual-only monster renderer.

Input: tools/dev/r143/sources.json [{sheet,path}]. Body and VFX stay separate.
The source alpha was created by imagegen; this tool slices/encodes the sprite cells.
"""
from pathlib import Path
import json,io,base64,hashlib
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT=Path(__file__).resolve().parents[3]
HERE=Path(__file__).parent
CELL=144

def clusters(values,weights,n,initial=None):
    centers=np.linspace(np.percentile(values,3),np.percentile(values,97),n) if initial is None else initial.copy()
    for _ in range(60):
        labels=np.abs(values[:,None]-centers[None,:]).argmin(1)
        new=np.array([np.average(values[labels==i],weights=weights[labels==i]) if np.any(labels==i) else centers[i] for i in range(n)])
        if np.max(abs(new-centers))<.01:break
        centers=new
    return np.sort(centers)

def grid(im,rows):
    a=np.asarray(im);m=a[:,:,3]>160
    lab,n=ndi.label(m,np.ones((3,3)));objects=ndi.find_objects(lab)
    points=[]
    sizes=np.bincount(lab.ravel())
    for k,sl in enumerate(objects,1):
        if sl is None or sizes[k]<120:continue
        yy,xx=sl
        if yy.stop-yy.start<8 or xx.stop-xx.start<6:continue
        points.append(((xx.start+xx.stop)/2,(yy.start+yy.stop)/2,float(sizes[k])))
    p=np.array(points)
    body=p[p[:,0]<im.width*.79]
    xs=clusters(body[:,0],body[:,2],5,np.linspace(.17,.69,5)*im.width)
    fx_start=min(im.width-10,int(xs[-1]+np.median(np.diff(xs))*.58))
    body=p[p[:,0]<fx_start]
    ys=clusters(body[:,1],body[:,2],rows)
    xb=[max(0,int(xs[0]-(xs[1]-xs[0])*.55))]+[int((xs[i]+xs[i+1])/2) for i in range(4)]+[fx_start,im.width]
    yb=[max(0,int(ys[0]-(ys[1]-ys[0])*.6))]+[int((ys[i]+ys[i+1])/2) for i in range(rows-1)]+[min(im.height,int(ys[-1]+(ys[-1]-ys[-2])*.65))]
    return xb,yb

def crop(im,box):
    x0,y0,x1,y1=box;pad=0
    area=(x0,max(0,y0-pad),x1,min(im.height,y1+pad))
    a=np.array(im.crop(area));a[a[:,:,3]<96]=0
    # Identify the body in a padded row, recovering horns/feet while rejecting neighboring rows.
    lab,n=ndi.label(a[:,:,3]>=96,np.ones((3,3)));sizes=np.bincount(lab.ravel());objects=ndi.find_objects(lab)
    cy=(y0+y1)/2-area[1];cx=(x1-x0)/2
    candidates=[]
    for k,sl in enumerate(objects,1):
        if sl is None or sizes[k]<24:continue
        yy,xx=sl;dy=abs((yy.start+yy.stop)/2-cy)/(y1-y0);dx=abs((xx.start+xx.stop)/2-cx)/(x1-x0)
        candidates.append((sizes[k]/(1+dy*5+dx*2),k))
    if not candidates:raise ValueError('No body '+str(box))
    main=max(candidates)[1];yy=objects[main-1][0];keep=[main]
    for k,sl in enumerate(objects,1):
        if sl is None or k==main or sizes[k]<10:continue
        mid=(sl[0].start+sl[0].stop)/2
        if yy.start<=mid<yy.stop:keep.append(k)
    a[~np.isin(lab,keep)]=0
    # Exact binary alpha is used for a crisp pixel sprite, without source matte halos.
    a[:,:,3]=np.where(a[:,:,3]>=96,255,0)
    o=Image.fromarray(a);bb=o.getbbox()
    if not bb:raise ValueError('Empty cell '+str(box))
    return o.crop(bb)

def movement(x):
    s=(x['id']+' '+x['name']).lower()
    if any(v in s for v in ['arp','grifo','polilla','halc','colibr','angel','alado','serafin','coatl','quetzal']):return 'wing'
    if any(v in s for v in ['lobo','huargo','jaguar','ciervo','alce','colmillo','yeti','yarak','draco','ignaroth','lagarto_igneo']):return 'beast'
    if any(v in s for v in ['morena','martillo','leviatan','kraken','serp','sierpe','pez','manta','medusa']):return 'swim'
    if any(v in s for v in ['slime','hongo','fung','micelio','babosa','borron','nihilito','chispa','nube','wisp','fatuo','ojo_','espectro','sombra','elemental','fragmento','lienzo_blanco']):return 'float'
    if any(v in s for v in ['arana','mantis','escarab']):return 'insect'
    return 'legs'

def run():
    sources=json.loads((HERE/'sources.json').read_text());targets=json.loads((HERE/'manifest.json').read_text());packs={};grids={}
    OUT=HERE/'packed';OUT.mkdir(exist_ok=True)
    for source in sources:
        n=source['sheet'];im=Image.open(source['path']).convert('RGBA');rows=2 if n==13 else 12
        xb,yb=grid(im,rows)
        if n==4:
            # Long jellyfish tentacles bias centroid clustering; use the actual gaps of the front silhouettes.
            yb=[120,227,327,432,529,644,759,868,972,1077,1191,1305,1450]
        grids[n]={'x':xb,'y':yb,'size':im.size,'sha256':hashlib.sha256(Path(source['path']).read_bytes()).hexdigest()}
        for S in [s for s in targets if s['sheet']==n]:
            row=S['row'];figs=[]
            for c in range(5):
                arr=np.asarray(im)[:,xb[c]+1:xb[c+1]-1,3]
                projection=np.convolve((arr>160).sum(1),np.ones(3)/3,mode='same')
                bounds=[yb[0]]
                for edge in yb[1:-1]:
                    lo=max(0,edge-30);hi=min(im.height,edge+31);ys=np.arange(lo,hi)
                    score=projection[lo:hi]+np.abs(ys-edge)*.015
                    bounds.append(int(ys[np.argmin(score)]))
                bounds.append(yb[-1])
                figs.append(crop(im,(xb[c]+1,bounds[row]+1,xb[c+1]-1,bounds[row+1]-1)))
            assert all(f.width>10 and f.height>10 for f in figs),S['id']
            scale=min(112/max(f.width for f in figs),116/max(f.height for f in figs))
            atlas=Image.new('RGBA',(CELL*5,CELL))
            for i,f in enumerate(figs):
                q=f.resize((max(1,round(f.width*scale)),max(1,round(f.height*scale))),Image.Resampling.NEAREST)
                atlas.alpha_composite(q,(i*CELL+(CELL-q.width)//2,132-q.height))
            # PNG palette encoding keeps the master pixels compact; no generated assets at runtime.
            q=atlas.quantize(colors=192,method=Image.Quantize.FASTOCTREE,dither=Image.Dither.NONE)
            buf=io.BytesIO();q.save(buf,'PNG',optimize=True);raw=buf.getvalue();(OUT/(S['id']+'.png')).write_bytes(raw)
            S['movement']=movement(S);S['cell']=CELL;S['bytes']=len(raw)
            S['fit']=[max(round(f.width*scale)for f in figs),max(round(f.height*scale)for f in figs)]
            S['image']='data:image/png;base64,'+base64.b64encode(raw).decode()
            packs.setdefault(n,[]).append(S)
    for n,items in packs.items():
        p=ROOT/'src'/f'6zz9zz0_r143_data_{n:02}.js'
        p.write_text('// Approved isolated body poses; generated by tools/dev/r143/prepare.py.\nconst R143_DATA_'+str(n)+'='+json.dumps(items,ensure_ascii=False,separators=(',',':'))+';\n')
    (HERE/'grids.json').write_text(json.dumps(grids,indent=2))
    print(json.dumps({'packed':sum(map(len,packs.values())),'bytes':sum(s['bytes']for items in packs.values() for s in items),'sheets':len(packs)}))

if __name__=='__main__':run()
