from pathlib import Path
from playwright.sync_api import sync_playwright
import json,base64,hashlib
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'tests/armor_review/out';OUT.mkdir(exist_ok=True)
report={'errors':[]}
DRAW=r'''D=>{
 const cols=D.cols,rows=D.rows,S=4,CW=48,CH=52,LW=180,TH=60;
 const c=document.createElement('canvas');c.width=LW+cols.length*CW*S;c.height=TH+rows.length*CH*S;
 const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle='#20212c';x.fillRect(0,0,c.width,c.height);
 x.fillStyle='#eee6ce';x.font='bold 18px sans-serif';x.fillText(D.title,12,24);x.font='14px sans-serif';
 cols.forEach((v,i)=>x.fillText(v,LW+i*CW*S+8,TH-12));
 for(let j=0;j<rows.length;j++){
  x.fillStyle=j%2?'#282a36':'#242531';x.fillRect(0,TH+j*CH*S,c.width,CH*S);
  x.fillStyle='#ddd6ca';x.fillText(rows[j].label,10,TH+j*CH*S+35);
  for(let i=0;i<cols.length;i++){
   const cell=D.cells[j][i],app={...DEF_APP,g:cell.g,bt:cell.bt||0,hs:cell.g==='m'?0:6,hair:'negro',eyes:'azul'};
   const gear={body:cell.t,legs:cell.t,feet:cell.t,head:cell.t,weapon:cell.t};
   const L=heroLook(cell.cls,app,gear,cell.cos||{},{});L.weapon=null;
   const A=buildAtlas(L,['idle'],drawHero),row=DIRS.indexOf(cell.dir||'down');
   const hd=hdEnsure(A,0,row,true);
   if(!hd)throw Error('HD render failed '+JSON.stringify(cell));
   const px=LW+i*CW*S+(CW-A.fw)*S/2,py=TH+j*CH*S+(CH-A.fh)*S;
   x.drawImage(A.hd,0,row*A.fh*2,A.fw*2,A.fh*2,px,py,A.fw*S,A.fh*S);
  }
 }
 return c.toDataURL('image/png').split(',')[1];
}'''
with sync_playwright()as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--allow-file-access-from-files'])
 pg=b.new_page(viewport={'width':1200,'height':800});pg.on('pageerror',lambda e:report['errors'].append(str(e)))
 pg.route('https://**/*',lambda r:r.abort())
 try:
  pg.goto((ROOT/'update/thebound.html').as_uri());pg.wait_for_timeout(2000)
  report['inventory']=pg.evaluate('''()=>({
   armor:Object.entries(ITEMS).filter(([id,v])=>v.t==='armor').map(([id,v])=>({id,n:v.n,slot:v.slot,tier:v.tier,lv:v.lv})),
   tiers:TIER.map((v,i)=>v?{tier:i,name:ITEMS['b_'+i]?.n||v.f,lv:v.lv}:null).filter(Boolean),
   classes:Object.entries(CLASSES).map(([id,v])=>({id,name:v.n})),
   bodies:BODY_T,
   cosmetics:Object.entries(COSM).filter(([id,v])=>['head','body','legs','feet','back'].includes(v.slot)).map(([id,v])=>{let look;try{look=v.vis(DEF_APP)}catch(e){look={error:String(e)}}return{id,n:v.n,slot:v.slot,look}}),
   visuals:Object.keys(CLASSES).flatMap(cls=>TIER.map((v,t)=>v?{cls,t,head:gearVis(cls,'head',t),body:gearVis(cls,'body',t),legs:gearVis(cls,'legs',t),feet:gearVis(cls,'feet',t)}:null).filter(Boolean))
  })''')
  inv=report['inventory'];classes=inv['classes'];tiers=inv['tiers'];report['renderedFrontLooks']=0
  def draw(name,spec):
   (OUT/name).write_bytes(base64.b64decode(pg.evaluate(DRAW,spec)))
  for g in ['m','f']:
   for start in range(0,len(tiers),6):
    subset=tiers[start:start+6]
    draw(f'catalogo_{g}_{start+1:02}_{start+len(subset):02}.png',{'title':f'THE BOUND 5.00 · armaduras actuales · {g}', 'cols':[v['name']for v in classes],'rows':[{'label':f"T{v['tier']:02} {v['name']}"}for v in subset],'cells':[[{'cls':c['id'],'t':v['tier'],'g':g}for c in classes]for v in subset]})
    report['renderedFrontLooks']+=len(subset)*len(classes)
  chosen=[('guerrero',3,'Hierro'),('guerrero',10,'Draconica'),('guerrero',22,'Lobo nocturno'),('guerrero',23,'Sepulcral'),('guerrero',24,'Velo roto'),('guerrero',25,'Eclipsada'),('guerrero',26,'Luna sonriente'),('guerrero',30,'Lienzo')]
  for g in ['m','f']:
   draw(f'referencia_armaduras_{g}.png',{'title':'Armaduras actuales equipadas · cuatro direcciones','cols':['Frente','Izquierda','Derecha','Espalda'],'rows':[{'label':n}for cls,t,n in chosen],'cells':[[{'cls':cls,'t':t,'g':g,'dir':dr}for dr in ['down','left','right','up']]for cls,t,n in chosen]})
  draw('referencia_clases_lienzo.png',{'title':'T30 Lienzo · aspecto actual equipado','cols':[v['name']for v in classes],'rows':[{'label':'Masculino frente'},{'label':'Femenino frente'},{'label':'Masculino espalda'},{'label':'Femenino espalda'}],'cells':[[{'cls':c['id'],'t':30,'g':g,'dir':dr}for c in classes]for g,dr in [('m','down'),('f','down'),('m','up'),('f','up')]]})
  cos=[v for v in inv['cosmetics']if v['slot']=='body'and(v['look'].get('k')=='plate'or'armadura'in v['n'].lower())]
  if cos:
   draw('referencia_cosmeticas.png',{'title':'Armaduras cosmeticas actuales','cols':['Masculino frente','Femenino frente','Masculino espalda','Femenino espalda'],'rows':[{'label':v['n']}for v in cos],'cells':[[{'cls':'guerrero','t':3,'g':g,'dir':dr,'cos':{'body':v['id']}}for g,dr in [('m','down'),('f','down'),('m','up'),('f','up')]]for v in cos]})
  v=json.loads((ROOT/'update/version.json').read_text());assert hashlib.sha256((ROOT/'update/thebound.html').read_bytes()).hexdigest()==v['sha256'];report['version']=v
  assert not report['errors'],report['errors']
 finally:
  (OUT/'inventario.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));b.close()
