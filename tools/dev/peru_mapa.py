"""Mapa de Perú para el panel de mapas (v5.13).

Uso: python3 -I tools/dev/peru_mapa.py tools/dev/peru_ref/mapa_peru.jpg salida.png
Clasifica cada píxel de la imagen que mandó Sergio (mar, países vecinos, departamentos y líneas), quita el ruido del JPEG
y repinta con los colores del juego (departamentos más vivos y bordes oscuros). Luego se pasa a base64 en
src/6zz9zzj0_peru_data.js (PE_MAP_PNG). Lima está en (74, 151) de la imagen (PE_LIMA en 6zz9zzj_peru.js).
"""
from PIL import Image, ImageFilter
from collections import Counter
import sys
im=Image.open(sys.argv[1]).convert('RGB').filter(ImageFilter.MedianFilter(3))
W,H=im.size; px=im.load()
PAL={'green':((224,240,165),(132,196,88)),'yellow':((246,240,190),(236,206,104)),'orange':((246,208,160),(232,150,84)),'pink':((244,196,196),(222,108,118)),'purple':((226,200,240),(158,118,210))}
cls=[[None]*W for _ in range(H)]
for y in range(H):
  for x in range(W):
    r,g,b=px[x,y]; S=max(r,g,b)-min(r,g,b); L=(r+g+b)/3
    if b-r>22 and b>200 and g>200 and abs(g-b)<40: c='sea'
    elif S<20: c='land' if L>200 else 'line'
    else:
      c=min(PAL,key=lambda k:sum((PAL[k][0][i]-(r,g,b)[i])**2 for i in range(3)))
    cls[y][x]=c
def nb(c,x,y,r):
  return [c[yy][xx] for yy in range(max(0,y-r),min(H,y+r+1)) for xx in range(max(0,x-r),min(W,x+r+1))]
# lines -> majority neighbour (land/peru/sea)
for it in range(3):
  n=[row[:] for row in cls]
  for y in range(H):
    for x in range(W):
      if cls[y][x]=='line':
        cnt=Counter(v for v in nb(cls,x,y,2) if v!='line')
        if cnt: n[y][x]=cnt.most_common(1)[0][0]
  cls=n
# mode filter on peru classes
n=[row[:] for row in cls]
for y in range(H):
  for x in range(W):
    if cls[y][x] in PAL:
      cnt=Counter(v for v in nb(cls,x,y,2) if v in PAL); n[y][x]=cnt.most_common(1)[0][0]
cls=n
out=Image.new('RGB',(W,H)); o=out.load()
for y in range(H):
  for x in range(W):
    c=cls[y][x]
    if c=='sea': o[x,y]=(40,96,170) if (x*3+y)%11 else (64,128,200)
    elif c=='land': o[x,y]=(168,156,132) if (x+y*2)%13 else (156,144,120)
    else:
      col=PAL[c][1]
      edge=False
      for dx,dy in ((1,0),(0,1)):
        xx,yy=x+dx,y+dy
        if xx<W and yy<H and cls[yy][xx]!=c: edge=True
      if edge: col=(70,40,30) if any(cls[yy][xx] in('sea','land') for xx,yy in ((x+1,y),(x,y+1),(x-1,y),(x,y-1)) if 0<=xx<W and 0<=yy<H) else tuple(int(v*0.62) for v in col)
      o[x,y]=col
out.save(sys.argv[2])
