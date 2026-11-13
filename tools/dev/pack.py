from PIL import Image, ImageOps
import numpy as np, base64, io, json, colorsys
TIERS={1:'madera',2:'cobre',3:'hierro',4:'acero',5:'plata',6:'oro'}
CLS=['guerrero','mago','arquero','asesino','bardo','invocador','pez']
COLS=['prep','a1','a2','a3','hit']; CW,CH=68,32
def load(tk,r,c):
    if tk=='cobre': im=load('hierro',r,c); return tint(im,(200,118,58))
    if tk=='plata' and r==6: im=load('acero',r,c); return tint(im,(225,228,240),0.75)
    im=Image.open(f'raw_{tk}_{r}_{c}.png').convert('RGBA')
    if c=='icon':
        a=np.asarray(im).copy(); h=a.shape[0]
        for y in list(range(0,7))+list(range(h-7,h)):
            if (a[y,:,3]>80).mean()>0.5: a[y,:,3]=0
        im=Image.fromarray(a,'RGBA'); bb=im.getbbox(); im=im.crop(bb)
    return im
def tint(im,col,k=1.0):
    a=np.asarray(im).astype(float); lum=(a[:,:,:3]@[0.3,0.59,0.11])/255.
    t=np.array(col,float)/255.; rgb=np.clip(lum[:,:,None]*t*1.35+lum[:,:,None]**3*0.35,0,1)*255
    rgb=a[:,:,:3]*(1-k)+rgb*k
    return Image.fromarray(np.dstack([rgb,a[:,:,3]]).astype(np.uint8),'RGBA')
def icon16(im):
    s=16/max(im.size); w,h=max(1,round(im.width*s)),max(1,round(im.height*s))
    sm=im.resize((w,h),Image.LANCZOS); a=np.asarray(sm).copy(); a[:,:,3]=np.where(a[:,:,3]>110,255,0)
    out=Image.new('RGBA',(16,16)); out.paste(Image.fromarray(a,'RGBA'),((16-w)//2,(16-h)//2)); return out
icons={}; atl={}; meta={}
for t,tk in TIERS.items():
    A=Image.new('RGBA',(CW*len(COLS),CH*7))
    for r,cls in enumerate(CLS):
        ic=icon16(load(tk,r,'icon')); icons[f'{cls}_{t}']=base64.b64encode(ic.tobytes()).decode(); ic.resize((64,64),Image.NEAREST).save(f'ic_{cls}_{t}.png')
        for ci,c in enumerate(COLS):
            im=load(tk,r,c); s=0.25; w,h=max(1,round(im.width*s)),max(1,round(im.height*s))
            if w>CW or h>CH: s2=min(CW/w,CH/h); w,h=int(w*s2),int(h*s2)
            fr=im.resize((w,h),Image.LANCZOS); A.paste(fr,(ci*CW+(CW-w)//2,r*CH+(CH-h)//2))
    b=io.BytesIO(); A.save(b,'PNG',optimize=True); atl[t]='data:image/png;base64,'+base64.b64encode(b.getvalue()).decode(); A.save(f'atlas_{t}.png')
# Espada Solar (plata, fila 6)
S=Image.new('RGBA',(CW*len(COLS),CH))
for ci,c in enumerate(COLS):
    im=Image.open(f'raw_plata_6_{c}.png').convert('RGBA'); w,h=round(im.width/4),round(im.height/4)
    if w>CW or h>CH: s2=min(CW/w,CH/h); w,h=int(w*s2),int(h*s2)
    S.paste(im.resize((w,h),Image.LANCZOS),(ci*CW+(CW-w)//2,(CH-h)//2))
b=io.BytesIO(); S.save(b,'PNG',optimize=True); solar='data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
solar_icon=base64.b64encode(icon16(load('plata',6,'icon')).tobytes()).decode()
js='// Generado por tools/dev (pack.py) desde las hojas de sprites de Sergio: iconos 16x16 RGBA y atlas de ataque (prep, a1, a2, a3, impacto) por tier\n'
js+='const WSPR_CW = %d, WSPR_CH = %d, WSPR_CLS = %s, WSPR_COLS = %s;\n'%(CW,CH,json.dumps(CLS),json.dumps(COLS))
js+='const WSPR_ICON = %s;\n'%json.dumps(icons)
js+='const WSPR_ATLAS = %s;\n'%json.dumps(atl)
js+='const WSPR_SOLAR = %s, WSPR_SOLAR_ICON = %s;\n'%(json.dumps(solar),json.dumps(solar_icon))
open('/home/claude/thebound/src/6zg_wspr_data.js','w').write(js)
print(len(js))
