from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import json,struct
root=Path(__file__).resolve().parents[3]; rows=json.loads((root/'tools/dev/gi_preview/frames.json').read_text());dest=root/'docs/sprites/gi_preview';dest.mkdir(parents=True,exist_ok=True)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',18);title=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',23)
def sprite(r,d,f):
 a=next(a for a in r['frames'] if a['dir']==d and a['f']==f);return Image.frombytes('RGBA',(96,96),struct.pack('<9216I',*a['pixels'])).resize((192,192),Image.Resampling.NEAREST)
for g,label in [('m','MASCULINOS'),('f','FEMENINOS')]:
 R=[r for r in rows if r['g']==g];im=Image.new('RGB',(1110,950),'#202b3b');dr=ImageDraw.Draw(im);dr.text((24,16),'THE BOUND · GI NARANJA · '+label,font=title,fill='#fff0d3');dr.text((24,49),'Muestra del motor · 5 estructuras · traje sin mangas y fajín azul',font=font,fill='#bed0df')
 for k,r in enumerate(R):dr.text((110+k*198,87),r['name'],font=font,fill='#ffcc89')
 for j,(d,n) in enumerate([('down','Frente'),('left','Izquierda'),('right','Derecha'),('up','Espalda')]):
  dr.text((10,170+j*202),n,font=font,fill='#bed0df')
  for k,r in enumerate(R):im.paste(sprite(r,d,0),(110+k*198,110+j*202),sprite(r,d,0))
 im.save(dest/('gi_'+g+'_cinco_cuerpos.png'))
frames=[]
for f in range(4):
 im=Image.new('RGB',(1040,510),'#202b3b');dr=ImageDraw.Draw(im);dr.text((20,10),'THE BOUND · Prueba de caminata · 10 cuerpos',font=title,fill='#fff0d3')
 for j,g in enumerate(['m','f']):
  for k,r in enumerate(r for r in rows if r['g']==g):
   s=sprite(r,'down',f);im.paste(s,(20+k*202,60+j*224),s);dr.text((24+k*202,48+j*224),r['name'],font=font,fill='#ffcc89')
 frames.append(im)
frames[0].save(dest/'gi_caminata_diez_cuerpos.gif',save_all=True,append_images=frames[1:],duration=160,loop=0)
print(dest)
