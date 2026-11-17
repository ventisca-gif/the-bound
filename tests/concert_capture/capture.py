"""Real screenshots of the unmodified published package, in an ephemeral demo save."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,hashlib

ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'tests/concert_capture/out';OUT.mkdir(exist_ok=True)
version=json.loads((ROOT/'update/version.json').read_text());blob=(ROOT/'update/thebound.html').read_bytes()
assert hashlib.sha256(blob).hexdigest()==version['sha256']
report={'version':version['ver'],'build':version['build'],'packageSha256':version['sha256'],'demonstrationSave':True,'captures':[],'dialogs':{},'errors':[]}
with sync_playwright()as p:
 browser=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--allow-file-access-from-files','--autoplay-policy=no-user-gesture-required'])
 page=browser.new_page(viewport={'width':1200,'height':800},device_scale_factor=1)
 page.on('pageerror',lambda e:report['errors'].append(str(e)))
 page.route('https://**/*',lambda route:route.abort())
 def shot(name,description):
  page.screenshot(path=str(OUT/name));report['captures'].append({'file':name,'description':description,'state':page.evaluate('()=>({map:G.map?.id,partner:G.P?.partner,secondary:G.P?.partner2,scene:typeof SCENE!=="undefined"&&SCENE?{kind:SCENE.kind,t:SCENE.t}:null,show:jpGuestShow?{time:jpGuestShow.audio.currentTime,playing:!jpGuestShow.audio.paused,wardrobe:jpGuestShow.wardrobe}:null})')})
 def finish_text():
  page.wait_for_timeout(180)
  page.locator('#dmsg').click()
  page.wait_for_timeout(100)
 try:
  page.goto((ROOT/'update/thebound.html').as_uri());page.wait_for_timeout(1800)
  page.click('#tNew');page.wait_for_timeout(400);page.fill('#ccName','Ventisca');page.click('#ccGo');page.wait_for_timeout(1400);page.click('#introOk');page.wait_for_timeout(400)
  setup=page.evaluate('''()=>{
   window.hurtPlayer=()=>{};const P=G.P;P.ifr=1e8;P.partner='jp_miku';P.partner2='jp_teto';P.pOut='normal';P.inside='jp_live_in';
   for(const id of ['jp_miku','jp_teto']){const R=rel(id);R.t=1000;R.a=1000;R.cp=Date.now();}
   const M=makeLive();setMap(M,248,180,'up');G.paused=false;G.fade=0;G.fadeTarget=0;
   for(const e of G.ents)if(e.map===M.id&&e.type==='npc'){e.wander=0;e.wt=null;setAnim(e,'idle');}
   window.demoGuest=id=>G.ents.find(e=>e.id===id&&!e.remove);updateCamera(0,true);
   return{map:M.id,npcs:G.ents.filter(e=>e.map===M.id&&e.type==='npc').map(e=>({id:e.id,x:e.x,y:e.y})),hero:P.name};
  }''');report['setup']=setup
  page.wait_for_timeout(1000)
  page.evaluate("openDialog(demoGuest('jp_prod'))");finish_text();shot('01_productora_concierto.png','Akane ofrece el concierto especial de Miku y Teto')
  # Select the existing concert option; normal costumes are valid native wardrobe choices.
  page.evaluate('window._demoRandom=Math.random;Math.random=()=>0')
  page.locator('#dopts button').filter(has_text='Ver concierto de Miku y Teto').click()
  page.evaluate('Math.random=window._demoRandom;delete window._demoRandom')
  page.wait_for_function('()=>jpGuestShow&&jpGuestShow.audio.readyState>=2&&!jpGuestShow.audio.paused',timeout=15000)
  for t,file,desc in [(18,'02_concierto_miku.png','Miku canta en el primer acto'),(68,'03_concierto_teto.png','Teto canta en el segundo acto'),(128,'04_concierto_duo.png','Miku y Teto cantan juntas en STELLA☆LINK')]:
   page.evaluate('(t)=>{jpGuestShow.audio.currentTime=t;G.P.x=248;G.P.y=132;updateCamera(0,true)}',t);page.wait_for_timeout(450);shot(file,desc)
  page.evaluate('jpGuestStop();G.P.x=248;G.P.y=205;updateCamera(0,true)');page.wait_for_timeout(250)
  for id,label,start in [('jp_miku','Miku',5),('jp_teto','Teto',9)]:
   page.evaluate('''id=>{closeDialog();if(G.P.partner!==id)swapPartner(id);const e=demoGuest(id);e.map=G.map.id;e.scene=0;e.follow=0;e.wander=0;e.wt=null;e.x=260;e.y=207;e.home={x:260,y:207};e.dir='left';e.atlas=npcAtlas(id);setAnim(e,'idle');G.P.x=235;G.P.y=207;G.P.dir='right';rel(id).a=1000;rel(id).t=1000;rel(id).cp=Date.now();updateCamera(0,true);openDialog(e);romanceMenu(e);}''',id)
   finish_text();shot(f'{start:02}_{label.lower()}_pareja.png',f'{label} como pareja: corazones y opciones reales del romance')
   page.locator('#dopts button').filter(has_text='Te quiero').click();finish_text()
   report['dialogs'][id]={'partner':page.locator('#dmsg').inner_text()}
   shot(f'{start+1:02}_{label.lower()}_dialogo.png',f'Diálogo cariñoso propio de {label}')
   page.locator('#dopts button').filter(has_text='Dar un beso').click()
   page.wait_for_function('()=>SCENE&&SCENE.kind==="kiss"',timeout=4000)
   page.wait_for_timeout(1000);shot(f'{start+2:02}_{label.lower()}_beso.png',f'Animación de beso de {label} y el jugador, con los sprites del juego')
   page.wait_for_function('()=>!SCENE',timeout=7000);page.wait_for_timeout(120)
   report['dialogs'][id]['afterKiss']=page.locator('body').inner_text()[-4500:]
   shot(f'{start+3:02}_{label.lower()}_despues_beso.png',f'Reacción de {label} después del beso')
  assert not report['errors'],report['errors']
  assert len(report['captures'])==12
 except Exception as e:
  report['failure']=str(e)
  try:page.screenshot(path=str(OUT/'debug_failure.png'));report['dom']=page.locator('body').inner_text()[-10000:]
  except Exception:pass
  raise
 finally:
  (OUT/'result.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));browser.close()
