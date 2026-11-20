from pathlib import Path
import json,os
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[2];O=R/'tests/dawn/out';O.mkdir(exist_ok=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=os.environ.get('CHROME','/usr/bin/google-chrome'),args=['--no-sandbox','--allow-file-access-from-files','--autoplay-policy=no-user-gesture-required'])
 p=b.new_page(viewport={'width':1280,'height':760},device_scale_factor=2);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 try:
  p.goto((R/'dist/test.html').as_uri());p.wait_for_timeout(1400);p.click('#tNew');p.wait_for_timeout(300);p.fill('#ccName','Ventisca');p.click('#ccGo');p.wait_for_timeout(1500);p.click('#introOk');p.wait_for_timeout(300)
  p.evaluate('G.paused=true;G.noSave=true;SETTINGS.sfx=0;setHD(true)')
  result=p.evaluate((R/'tests/dawn/check.js').read_text());print(json.dumps(result),flush=True)
  p.evaluate("()=>{G.P.lv=500;G.P.x=229*16+8;G.P.y=131*16;updateCamera(0,true);openDialog(G.ents.find(e=>e.type==='npc'&&e.id==='marina'&&e.map==='world'));}")
  p.wait_for_timeout(300);p.get_by_role('button',name='Isla Dawn · viaje cerrado',exact=True).click();p.wait_for_timeout(450);p.locator('#dmsg').click();p.screenshot(path=str(O/'01_marina_viaje_cerrado.png'));assert p.evaluate("G.P.map==='world'&&G.map.id==='world'")
  # Internal render inspection, without opening a travel gate or changing the production flag.
  p.evaluate("()=>{closeDialog();const M=makeDawn();G.map=M;G.P.map='dawn';G.P.inside='dawn';G.P.x=526*16;G.P.y=257*16;G.P.L=0;dawnSpawnPeople(M);G.time=12*60;G.paused=false;updateCamera(0,true);}")
  p.wait_for_timeout(1300);p.screenshot(path=str(O/'02_foosha_tripulacion.png'))
  p.evaluate("()=>{G.paused=true;const M=makeDawn(),C=M.camps[0];G.P.x=C.x*16;G.P.y=C.y*16;const e=spawnMob('dawn_pirata',500,G.P.x+45,G.P.y,0,C);e.map='dawn';C.alive.push(e);updateCamera(0,true);}")
  p.wait_for_timeout(500);p.screenshot(path=str(O/'03_piratas_nivel500.png'))
  assert not errors,errors;result['errors']=errors;(O/'result.json').write_text(json.dumps(result,indent=2))
 finally:b.close()
