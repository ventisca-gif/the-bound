from PIL import Image
import numpy as np, json
A='/mnt/user-data/attachments/f6a194c5-eb1e-569f-801a-9f1ea20f1ec4/'
F=['e011c4b0','3e033710','53f796ea','ee902b1d','c7c944f7','9f8e2075','9ac5bf26','9e96d39b','077123b4','a0474e68','fd8eada1']
out={}
for f in F:
    im=np.asarray(Image.open(A+f+'-image.png').convert('RGB')).astype(int)
    H,W,_=im.shape; mx=im.max(2); mn=im.min(2)
    m=(mx>110)  # bright pixels
    runs=[]
    for y in range(H):
        r=m[y]; x=0
        # find runs
        d=np.diff(np.concatenate([[0],r.astype(int),[0]])); st=np.where(d==1)[0]; en=np.where(d==-1)[0]
        for a,b in zip(st,en):
            if b-a>=110: runs.append((y,int(a),int(b)))
    # long lines (panel edges): length > 0.6W
    longy=sorted(set(y for y,a,b in runs if b-a>0.6*W))
    grp=[]
    for y in longy:
        if grp and y-grp[-1][-1]<=4: grp[-1].append(y)
        else: grp.append([y])
    lines=[(g[0],g[-1]) for g in grp]
    # header boxes: runs 110..330 long, cluster by y
    hb={}
    for y,a,b in runs:
        if 110<=b-a<=330: hb.setdefault(y,[]).append(((a+b)/2,b-a))
    hdr=[(y,sorted(v)) for y,v in hb.items() if len(v)>=5]
    hy=[]
    for y,v in sorted(hdr):
        if hy and y-hy[-1][0]<=6: continue
        hy.append((y,[round(c) for c,_ in v]))
    out[f]={'lines':lines,'hdr':hy}
    print(f, 'lines', lines)
    for y,v in hy: print('   hdr', y, v)
json.dump(out,open('detect.json','w'))
