"""Extract the two approved boards; keep their actual pixels and silhouette."""
from pathlib import Path
from PIL import Image,ImageDraw
from collections import deque
import base64,io,json
R=Path(__file__).resolve().parents[2];ref=R/'tools/dev/ado_ref';out=R/'tests/ado/assets';out.mkdir(exist_ok=True)
def url(im):
 b=io.BytesIO();im.save(b,format='PNG',optimize=True);return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
def extract(im,box,classic=False):
 q=im.crop(box).convert('RGBA');w,h=q.size;p=q.load();seen=set();todo=deque([(x,y)for x in range(w)for y in [0,h-1]]+[(x,y)for y in range(h)for x in [0,w-1]])
 while todo:
  x,y=todo.popleft()
  if (x,y)in seen or not(0<=x<w and 0<=y<h):continue
  seen.add((x,y));r,g,b,a=p[x,y]
  bg= (20<r<52 and 25<g<60 and 40<b<90 and 0<=g-r<=13 and 14<b-r<43) if classic else (24<r<45 and 28<g<51 and 52<b<80 and 0<=g-r<=11 and 21<b-r<43)
  if not bg:continue
  p[x,y]=(0,0,0,0);todo.extend([(x-1,y),(x+1,y),(x,y-1),(x,y+1)])
 # Remove disconnected background remnants: retain largest foreground component.
 a=q.getchannel('A');pix=a.load();visited=set();groups=[]
 for y in range(h):
  for x in range(w):
   if not pix[x,y]or(x,y)in visited:continue
   st=[(x,y)];group=[];visited.add((x,y))
   while st:
    z,t=st.pop();group.append((z,t))
    for xx,yy in [(z-1,t),(z+1,t),(z,t-1),(z,t+1)]:
     if 0<=xx<w and 0<=yy<h and pix[xx,yy]and(xx,yy)not in visited:visited.add((xx,yy));st.append((xx,yy))
   groups.append(group)
 for group in sorted(groups,key=len,reverse=True)[1:]:
  for x,y in group:p[x,y]=(0,0,0,0)
 return q
specs={'detail':('detallada.png',[(48,76,300,564),(350,76,603,564),(667,76,924,564),(957,76,1220,564)],80),'classic':('clasica.png',[(184,128,408,447),(508,128,741,447),(798,128,1064,447),(1114,128,1380,447)],72)}
data={}
raw={}
for style,(file,boxes,height)in specs.items():
 im=Image.open(ref/file);frames=[];raw[style]=[]
 for i,box in enumerate(boxes):
  q=extract(im,box,style=='classic');raw[style].append(q);q.save(out/(style+'_'+str(i)+'_raw.png'));q=q.crop(q.getbbox());q=q.resize((round(q.width*height/q.height),height),Image.Resampling.NEAREST)
  c=Image.new('RGBA',(96,112));c.alpha_composite(q,((96-q.width)//2,108-height));frames.append(url(c));c.resize((384,448),Image.Resampling.NEAREST).save(out/(style+'_'+str(i)+'.png'))
 data[style]=frames
im=Image.open(ref/'detallada.png');data['portrait']=url(im.crop((115,697,466,1129)).resize((96,112),Image.Resampling.NEAREST))
# Hair polygons follow the four approved silhouettes. Eyes, face, clothes and microphone never enter the hairstyle layer.
polys=[[(99,149),(109,109),(158,79),(217,84),(249,118),(249,189),(267,255),(279,333),(277,371),(247,420),(233,391),(217,348),(217,264),(202,225),(201,210),(157,208),(133,224),(111,253),(110,301),(116,333),(101,359),(79,335),(62,307),(56,275),(68,230),(94,191)],[(368,206),(379,121),(417,83),(470,80),(514,99),(533,147),(539,208),(555,255),(562,299),(576,342),(586,365),(569,388),(555,400),(541,389),(537,354),(517,364),(505,379),(480,390),(453,379),(435,367),(418,391),(400,399),(385,378),(376,355),(384,305),(379,255)],[(708,171),(705,139),(724,102),(771,81),(810,92),(836,121),(848,160),(855,214),(871,263),(890,304),(906,335),(893,372),(868,395),(847,389),(826,355),(818,310),(806,276),(792,234),(779,216),(775,197),(755,192),(736,179)],[(985,173),(985,130),(1006,94),(1055,80),(1100,95),(1129,129),(1138,180),(1144,221),(1166,267),(1193,309),(1199,342),(1181,374),(1152,389),(1137,379),(1124,350),(1114,307),(1105,267),(1089,233),(1076,209),(1054,199),(1043,180),(1028,173)]]
# Per-view head anchor measured on the source board; retained in RGB masks for native body anchoring.
anchors=[(176,159,60),(454,158,64),(758,157,52),(1040,155,54)];hair={}
for i,(poly,anchor)in enumerate(zip(polys,anchors)):
 mask=Image.new('L',im.size);ImageDraw.Draw(mask).polygon(poly,fill=255)
 # Only blue/black hair pigment; skin, eye whites and cloth highlights are excluded.
 q=im.convert('RGBA');px=q.load();m=mask.load()
 for y in range(im.height):
  for x in range(im.width):
   r,g,b,a=px[x,y]
   if not m[x,y]or not(b>r*1.12 and b>g*1.08 and r<123 and g<133):px[x,y]=(0,0,0,0)
 box=mask.getbbox();q=q.crop(box);fac=2;w=(q.width+1)//2;h=(q.height+1)//2;q=q.resize((w,h),Image.Resampling.NEAREST)
 q=q.quantize(colors=96,method=Image.Quantize.FASTOCTREE,dither=Image.Dither.NONE).convert('RGBA');q.save(out/('hair_'+str(i)+'.png'));colors=['#000000'];idx={};runs=[];last=None;n=0
 for r,g,b,a in q.getdata():
  c='#%02x%02x%02x'%(r,g,b)if a else '#000000'
  if c not in idx:idx[c]=len(colors);colors.append(c)
  k=idx[c]if a else 0
  if k==last and n<255:n+=1
  else:
   if last is not None:runs.extend([n,last,1 if last else 0])
   last=k;n=1
 runs.extend([n,last,1 if last else 0]);assert len(colors)<256,len(colors)
 hair['ado_'+str(i)]={'w':w,'h':h,'cx':(anchor[0]-box[0])/2,'hy':(anchor[1]-box[1])/2,'radius':anchor[2]/2,'pal':colors,'rle':base64.b64encode(bytes(runs)).decode()}
(R/'src/6zz9zz0_ado_data.js').write_text('// Extracted from the two approved Ado boards, stored with this repository.\nconst ADO_ART='+json.dumps(data,separators=(',',':'))+';\nObject.assign(R8_HD_DATA,'+json.dumps(hair,separators=(',',':'))+');\n')
print('Extracted approved sprites and anchored RGB hair masks')
