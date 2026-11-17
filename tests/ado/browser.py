from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import base64,json,os
R=Path(__file__).resolve().parents[2];O=R/'tests/ado/out';O.mkdir(exist_ok=True)
with sync_playwright()as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROME','/usr/bin/google-chrome'),args=['--no-sandbox','--allow-file-access-from-files','--autoplay-policy=no-user-gesture-required']);pg=b.new_page(viewport={'width':1280,'height':900},device_scale_factor=2);errors=[];pg.on('pageerror',lambda e:errors.append(e.stack or str(e)));result={}
 def shot(n):pg.screenshot(path=str(O/n))
 def textdone():pg.wait_for_timeout(300);pg.locator('#dmsg').click();pg.wait_for_timeout(150)
 try:
  pg.goto((R/'dist/test.html').as_uri());pg.wait_for_timeout(1500);pg.click('#tNew');pg.wait_for_timeout(400);pg.fill('#ccName','Ventisca');pg.click('#ccGo');pg.wait_for_timeout(1300);pg.click('#introOk');pg.wait_for_timeout(500)
  pg.evaluate("window.hurtPlayer=()=>{};G.paused=true;SETTINGS.sfx=0;setMap(makeLive(),248,180,'up');G.fade=0;G.fadeTarget=0;setHD(true)")
  pg.wait_for_function("()=>['jp_ado','jp_miku','jp_teto'].every(id=>STELLA_PARTNER_OUTFITS[id].every(s=>idolSocialAtlas(id,s).ready))")
  result=pg.evaluate((R/'tests/ado/check.js').read_text());result['hairFit']=pg.evaluate((R/'tests/ado/hair-fit.js').read_text());print(json.dumps(result),flush=True)
  for name,data in pg.evaluate((R/'tests/ado/preview.js').read_text()).items():(O/name).write_bytes(base64.b64decode(data.split(',')[1]))
  pg.evaluate("()=>{G.P.partner=null;G.P.pOut='normal';G.P.inside='jp_live_in';G.P.app={...DEF_APP,g:'m',bt:1,hair:'rojo',eyes:'verde'};G.P.atlas=playerAtlas(G.P);G.paused=false;G.P.x=248;G.P.y=150;updateCamera(0,true);for(const e of G.ents)if(e.type==='npc'){e.wander=0;e.wt=null;}const e=G.ents.find(e=>e.id==='jp_ado');e.x=360;e.y=184;e.home={x:360,y:184};e.atlas=npcAtlas(e.id);}")
  pg.wait_for_timeout(350);pg.evaluate("openDialog(G.ents.find(e=>e.id==='jp_prod'))");textdone();shot('01_akane_concierto_ado.png')
  pg.locator('#dopts button').filter(has_text='Ver concierto de Ado').click();pg.wait_for_timeout(700);shot('02_ado_concierto_detallado.png');pg.evaluate('adoStop()')
  pg.evaluate("()=>{const P=G.P;P.partner='jp_ado';P.pOut='normal';rel('jp_ado').t=1000;rel('jp_ado').a=1000;rel('jp_ado').cp=Date.now();P.x=335;P.y=184;P.dir='right';const e=G.ents.find(e=>e.id==='jp_ado');e.map=G.map.id;e.scene=0;e.dir='left';e.atlas=npcAtlas(e.id);updateCamera(0,true);openDialog(e);romanceMenu(e);}");textdone();shot('03_ado_romance.png')
  pg.evaluate('closeDialog();openPartnerWardrobe()');pg.wait_for_timeout(300);shot('04_ado_armario.png')
  pg.locator('[data-pt="ado_chibi"]').click();pg.wait_for_timeout(250);pg.evaluate('closeModal()');pg.wait_for_timeout(300);shot('05_ado_estilo_juego.png')
  pg.evaluate("()=>{G.P.pOut='normal';ptApply();const e=G.ents.find(e=>e.id==='jp_ado');romKiss(e);}");pg.wait_for_timeout(1100);shot('06_ado_beso_detallado.png');pg.wait_for_function('()=>!SCENE',timeout=8000)
  pg.evaluate("()=>{closeDialog();const e=G.ents.find(e=>e.id==='jp_ado');startComp(e,true);startCarry();G.P.dir='down';}");pg.wait_for_timeout(400);shot('07_ado_en_brazos.png');pg.evaluate('carryKiss()');pg.wait_for_timeout(200);shot('08_ado_beso_en_brazos.png');pg.evaluate('stopCarry();endComp(true)')
  pg.evaluate("closeDialog();openNaming('f')");pg.wait_for_timeout(400);shot('09_hijas_ojos_pelo.png');pg.locator('[data-kg="m"]').click();pg.wait_for_timeout(400);shot('10_hijos_ojos_pelo.png');pg.evaluate('closeModal()')
  for id in ['jp_miku','jp_teto']:
   pg.evaluate("id=>{G.P.partner=id;G.P.pOut='normal';const e=G.ents.find(e=>e.id===id);e.scene=0;e.map=G.map.id;e.x=G.P.x+14;e.y=G.P.y;e.atlas=npcAtlas(id);startComp(e,true);startCarry();G.P.dir='down';}",id);pg.wait_for_timeout(350);shot(id+'_en_brazos.png');pg.evaluate('stopCarry();endComp(true)')
  # Source-based animation strip, captured from the same HD atlas as the live NPCs.
  frames=pg.evaluate("()=>Array.from({length:8},(_,f)=>{const c=mkCanvas(480,260),x=c.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle='#242c3c';x.fillRect(0,0,480,260);for(let s=0;s<2;s++){const A=idolSocialAtlas('jp_ado',s?'ado_chibi':'normal');for(let d=0;d<4;d++)atlasBlit(x,A,A.idx.walk+f%4,d,10+d*115,s*125,A.fw*2,A.fh*2);}return c.toDataURL();})")
  ims=[Image.open(__import__('io').BytesIO(base64.b64decode(d.split(',')[1]))).convert('RGB')for d in frames];ims[0].save(O/'ado_dos_estilos_caminata.gif',save_all=True,append_images=ims[1:],duration=140,loop=0)
  assert not errors,errors
 finally:
  result['errors']=errors;(O/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));b.close()
