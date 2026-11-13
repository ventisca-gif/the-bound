from PIL import Image
import numpy as np, json
A='/mnt/user-data/attachments/f6a194c5-eb1e-569f-801a-9f1ea20f1ec4/'
F=['e011c4b0','3e033710','53f796ea','ee902b1d','c7c944f7','9f8e2075','9ac5bf26','9e96d39b','077123b4','a0474e68','fd8eada1']
D=json.load(open('detect.json'))
res={}
for f in F:
    im=np.asarray(Image.open(A+f+'-image.png').convert('RGB')).astype(int); H,W,_=im.shape
    mx=im.max(2); bright=mx>90
    full=bright.mean(1)>0.45  # border-ish rows
    # column centers: first header row from detect
    cols=D[f]['hdr'][0][1] if D[f]['hdr'] else [527,740,962,1192,1426]
    x0,x1=cols[0]-95,cols[0]+95
    prof=bright[:,x0:x1].sum(1); prof[full]=0
    on=prof>3; cl=[]; y=0
    while y<H:
        if on[y]:
            s=y
            while y<H and (on[y] or (y+1<H and on[y+1]) or (y+2<H and on[y+2])): y+=1
            if y-s>=14: cl.append((s,y))
        y+=1
    res[f]={'cols':cols,'cl':cl}
    print(f, cols, [(a,b,b-a) for a,b in cl])
json.dump(res,open('rows.json','w'))
