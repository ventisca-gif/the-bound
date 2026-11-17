from pathlib import Path
from playwright.sync_api import sync_playwright
import json,base64,hashlib
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'tests/armor/out';OUT.mkdir(exist_ok=True)
SNAP=r'''()=>JSON.stringify({items:Object.entries(ITEMS).map(([id,v])=>{v={...v};delete v.icon;return[id,v]}),classes:CLASSES,mobs:MOBS,bosses:BOSSES,recipes:RECIPES,bodies:BODY_T,anims:ANIMS})'''
with sync_playwright()as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--allow-file-access-from-files'])
 old=b.new_page();old.goto((ROOT/'update/thebound.html').as_uri());old.wait_for_timeout(1500);before=old.evaluate(SNAP);old.close()
 pg=b.new_page(viewport={'width':1200,'height':850});errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
 try:
  pg.goto((ROOT/'dist/test.html').as_uri());pg.wait_for_timeout(1800)
  after=pg.evaluate(SNAP);assert before==after,'gameplay, items, progression, bodies or animation definitions changed'
  result=pg.evaluate((ROOT/'tests/armor/check.js').read_text());print(json.dumps(result),flush=True)
  result['unchangedDataSha256']=hashlib.sha256(before.encode()).hexdigest()
  pg.click('#tNew');pg.wait_for_timeout(400);pg.fill('#ccName','Armaduras');pg.click('#ccGo');pg.wait_for_timeout(1200);pg.click('#introOk');pg.wait_for_timeout(300)
  pg.evaluate("window.hurtPlayer=()=>{};G.paused=true;G.P.lv=400;G.P.cls='guerrero';G.P.app={...DEF_APP,g:'f',bt:4,hs:HS_F.findIndex(v=>v.r8HD==='frieren')};G.P.equip={body:{id:'b_30'},legs:{id:'l_30'},feet:{id:'f_30'},head:{id:'h_30'}};G.P.cos={};calcStats(G.P);encTab='armor';encCls='guerrero';encSel='b_30';openPanel('best')")
  pg.wait_for_timeout(300);pg.screenshot(path=str(OUT/'bestiario_armaduras.png'))
  ui=pg.evaluate('''()=>{const B=document.querySelector('#pbody'),section=document.querySelector('.ap-equipped');if(!section)throw Error('equipped preview missing');const p=section.querySelector('canvas');if(p.width!==384||!p.getContext('2d').getImageData(0,0,p.width,p.height).data.some(v=>v))throw Error('equipped preview empty');return{rows:document.querySelectorAll('[data-eit]').length,preview:!!p};}''')
  assert ui['rows']==125,ui
  pg.click('[data-ecls="mago"]');pg.wait_for_timeout(100);pg.click('[data-eit="b_10"]');pg.wait_for_timeout(150);pg.screenshot(path=str(OUT/'bestiario_mago.png'))
  pg.evaluate("closePanel();G.paused=true")
  images=pg.evaluate((ROOT/'tests/armor/preview.js').read_text())
  for name,data in images.items():(OUT/name).write_bytes(base64.b64decode(data.split(',')[1]))
  # La apariencia equipada y el peinado sobreviven al guardado original.
  pg.evaluate('saveGame(true)');pg.wait_for_timeout(200);pg.reload();pg.wait_for_timeout(1500);pg.click('[data-slot]');pg.wait_for_timeout(1200)
  pg.evaluate("()=>{const P=G.P;if(P.equip.body.id!=='b_30'||P.app.bt!==4||HS_F[P.app.hs].r8HD!=='frieren')throw Error('equipped appearance or hairstyle lost');}")
  assert not errors,errors;result.update({'errors':errors,'encyclopedia':ui,'saveReload':'passed'})
  (OUT/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
 finally:
  if errors:(OUT/'errors.json').write_text(json.dumps(errors))
  b.close()
