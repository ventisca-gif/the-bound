from PIL import Image
import numpy as np, json
A='/mnt/user-data/attachments/f6a194c5-eb1e-569f-801a-9f1ea20f1ec4/'
R=json.load(open('rows.json'))
# (sheet, [(y0,y1,itemId)])  y ranges taken from the prep-column clusters
S={
 'e011c4b0':[(79,130,'ws_lava'),(585,634,'w_guerrero_7'),(646,690,'w_mago_7'),(699,746,'w_arquero_7'),(755,799,'w_asesino_7'),(808,855,'w_bardo_7'),(862,916,'w_invocador_7'),(933,977,'w_pez_7')],
 '53f796ea':[(83,133,'ws_alanoche'),(581,633,'w_guerrero_8'),(636,691,'w_mago_8'),(697,749,'w_arquero_8'),(752,802,'w_asesino_8'),(809,865,'w_bardo_8'),(868,924,'w_invocador_8'),(940,987,'w_pez_8')],
 'ee902b1d':[(110,192,'ws_escarcha'),(225,306,'ws_dragon'),(335,407,'w_guerrero_9'),(434,510,'w_mago_9'),(530,609,'w_arquero_9'),(636,701,'w_asesino_9'),(728,811,'w_bardo_9'),(845,938,'w_invocador_9')],
 'c7c944f7':[(115,193,'ws_jade'),(349,424,'w_guerrero_10'),(450,524,'w_mago_10'),(548,623,'w_arquero_10'),(649,717,'w_asesino_10'),(737,809,'w_bardo_10'),(833,909,'w_invocador_10')],
 '9f8e2075':[(146,212,'w_pez_10'),(368,439,'ws_verdugo'),(590,663,'w_guerrero_11'),(690,765,'w_mago_11'),(790,865,'w_arquero_11'),(892,967,'w_asesino_11')],
 '9ac5bf26':[(111,186,'w_invocador_11'),(230,294,'w_pez_11'),(419,493,'ws_ignea'),(612,686,'w_guerrero_12'),(701,783,'w_mago_12'),(803,878,'w_arquero_12'),(901,981,'w_asesino_12')],
 '9e96d39b':[(93,161,'w_bardo_12'),(179,246,'w_invocador_12'),(268,325,'w_pez_12'),(432,493,'ws_aguijon'),(599,662,'ws_dentado'),(765,826,'w_guerrero_13'),(842,908,'w_mago_13'),(922,994,'w_arquero_13')],
 '077123b4':[(103,167,'w_asesino_13'),(188,256,'w_bardo_13'),(276,348,'w_invocador_13'),(373,433,'w_pez_13'),(548,617,'ws_fantasma'),(726,793,'w_guerrero_14'),(811,884,'w_mago_14'),(901,976,'w_arquero_14')],
 'a0474e68':[(103,161,'w_asesino_14'),(178,245,'w_bardo_14'),(261,324,'w_invocador_14'),(344,403,'w_pez_14'),(511,567,'ws_cosmica'),(675,740,'ws_abismo'),(849,910,'w_guerrero_15'),(926,996,'w_mago_15')],
 'fd8eada1':[(109,191,'w_arquero_15'),(216,279,'w_asesino_15'),(304,378,'w_bardo_15'),(400,472,'w_invocador_15'),(502,560,'w_pez_15'),(596,656,'ws_rosa'),(689,757,'lw_guerrero'),(890,968,'lw_mago')],
}
HALF={'prep':95,'a1':105,'a2':110,'a3':122,'hit':100}
def key(cell, t0=26, t1=110, edge=12):
    c=cell.copy(); h,w,_=c.shape; lum=c.max(2); cov=lum>38
    rc=cov.mean(1); cc=cov.mean(0)
    for y in range(h):
        if (y<edge or y>=h-edge) and rc[y]>0.55: c[max(0,y-1):y+2]=0
    for x in range(w):
        if (x<edge or x>=w-edge) and cc[x]>0.55: c[:,max(0,x-1):x+2]=0
    b=np.concatenate([c[:2].reshape(-1,3),c[-2:].reshape(-1,3),c[:,:2].reshape(-1,3),c[:,-2:].reshape(-1,3)]); bg=np.median(b,axis=0)
    d=np.sqrt(((c-bg)**2).sum(2)); a=np.clip((d-t0)/(t1-t0),0,1); a=np.where(a<0.1,0,a)
    rgb=np.clip(bg+(c-bg)/np.maximum(a,1e-3)[:,:,None],0,255)
    out=np.dstack([rgb,a*255]).astype(np.uint8)
    ys,xs=np.where(a>0.1)
    if len(ys)==0: return None
    return out[max(0,ys.min()-1):ys.max()+2, max(0,xs.min()-1):xs.max()+2]
def iconbox(im, y0, y1):
    reg=im[y0:y1, 15:200]; lum=reg.max(2); cov=(lum>45).mean(0)
    xs=[x for x in range(reg.shape[1]) if cov[x]>0.5]
    # agrupa líneas verticales: borde izq y der de la caja
    grp=[]
    for x in xs:
        if grp and x-grp[-1][-1]<=3: grp[-1].append(x)
        else: grp.append([x])
    if len(grp)>=2:
        L=grp[0][-1]+4+15; Rr=grp[1][0]-3+15
        if 40<=Rr-L<=150: return L,Rr
    return None
BOX={'e011c4b0':(48,115),'53f796ea':(31,134),'ee902b1d':(24,140),'c7c944f7':(36,131),'9f8e2075':(33,135),'9ac5bf26':(22,133),'9e96d39b':(19,133),'077123b4':(22,138),'a0474e68':(21,140),'fd8eada1':(19,127)}
meta={}
for sh,rows in S.items():
    im=np.asarray(Image.open(A+sh+'-image.png').convert('RGB')).astype(float); H,W,_=im.shape
    cols=R[sh]['cols']; prepH=[]
    for (y0,y1,iid) in rows:
        cy0,cy1=max(0,y0-6),min(H,y1+6)
        for ck,cx in zip(['prep','a1','a2','a3','hit'],cols):
            h=HALF[ck]; k=key(im[cy0:cy1, int(cx-h):int(cx+h)])
            if k is None: print('EMPTY',sh,iid,ck); continue
            Image.fromarray(k,'RGBA').save(f'raw_{iid}_{ck}.png')
            if ck=='prep': prepH.append(k.shape[0])
        # icono: caja a la izquierda
        bx=BOX[sh]; k=key(im[y0+2:y1-2, bx[0]:bx[1]], edge=6)
        if k is not None:
            # recorta a la parte con más masa (evita texto del nombre): la caja del icono ocupa x<~150
            Image.fromarray(k,'RGBA').save(f'raw_{iid}_icon.png')
        meta[iid]=sh
    print(sh, 'prep heights', sorted(prepH))
json.dump(meta,open('meta.json','w'))
