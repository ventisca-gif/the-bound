from PIL import Image
import json, sys
meta=json.load(open('meta.json')); ids=[k for k,v in meta.items() if v in sys.argv[2:]]
cols=['icon','prep','a1','a2','a3','hit']; W,H=260,120
out=Image.new('RGBA',(W*6,H*len(ids)),(60,110,60,255))
for r,i in enumerate(ids):
  for c,ck in enumerate(cols):
    try: im=Image.open(f'raw_{i}_{ck}.png')
    except: continue
    im.thumbnail((W-6,H-6)); out.alpha_composite(im,(c*W+3,r*H+3))
out.save(sys.argv[1])
