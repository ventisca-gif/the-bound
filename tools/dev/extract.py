from PIL import Image
import numpy as np, json, sys
A='/mnt/user-data/attachments/f6a194c5-eb1e-569f-801a-9f1ea20f1ec4/'
FILES={'madera':'8c6aca23-image.png','hierro':'b69eb69a-image.png','acero':'bf3bfad3-image.png','plata':'f71c68ec-image.png','oro':'84aaab9a-image.png'}
ROWS=[(100,218),(229,344),(354,468),(478,585),(595,702),(713,833),(844,974)]
COLS={'icon':(60,131),'prep':(350,570),'a1':(575,790),'a2':(795,1020),'a3':(1025,1290),'hit':(1295,1505)}
def key(cell, t0=30, t1=100, darkhalf=False):
    h,w,_=cell.shape; b=np.concatenate([cell[:4].reshape(-1,3),cell[-4:].reshape(-1,3),cell[:,:4].reshape(-1,3),cell[:,-4:].reshape(-1,3)])
    bg=np.median(b,axis=0)
    d=np.sqrt(((cell-bg)**2).sum(2))
    a=np.clip((d-t0)/(t1-t0),0,1)
    if darkhalf:
        lum=cell.mean(2); a=np.where(lum<bg.mean()-4, a*0.45, a)
    a=np.where(a<0.12,0,a)
    rgb=bg+(cell-bg)/np.maximum(a,1e-3)[:,:,None]
    rgb=np.clip(rgb,0,255)
    out=np.dstack([rgb,a*255]).astype(np.uint8)
    ys,xs=np.where(a>0.08)
    if len(ys)==0: return None
    return out[max(0,ys.min()-1):ys.max()+2, max(0,xs.min()-1):xs.max()+2]
res={}
for tk,f in FILES.items():
    im=np.asarray(Image.open(A+f).convert('RGB')).astype(float)
    for ri,(y0,y1) in enumerate(ROWS):
        for ck,(x0,x1) in COLS.items():
            cell=im[y0+(13 if ck=='icon' else 6):y1-(13 if ck=='icon' else 6), x0:x1]
            k=key(cell, darkhalf=ck in ('a1','a2','a3','hit'))
            if k is None: print('empty',tk,ri,ck); continue
            Image.fromarray(k,'RGBA').save(f'raw_{tk}_{ri}_{ck}.png'); res[f'{tk}_{ri}_{ck}']=k.shape[:2]
json.dump({k:list(v) for k,v in res.items()},open('sizes.json','w'))
print(len(res))
