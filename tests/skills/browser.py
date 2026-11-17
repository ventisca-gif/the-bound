from pathlib import Path
from playwright.sync_api import sync_playwright
import json,base64
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'tests/skills/out';OUT.mkdir(exist_ok=True)
with sync_playwright()as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--allow-file-access-from-files']);page=b.new_page(viewport={'width':1100,'height':750});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 try:
  baseline=b.new_page();baseline.goto((ROOT/'update/thebound.html').as_uri());baseline.wait_for_timeout(1500);snap='()=>JSON.stringify({skills:SK,classes:CLASSES,bodies:BODY_T,items:ITEMS})';before=baseline.evaluate(snap);baseline.close()
  page.goto((ROOT/'dist/test.html').as_uri());page.wait_for_timeout(1500);assert page.evaluate(snap)==before,'skill or equipment data changed'
  result=page.evaluate((ROOT/'tests/skills/check.js').read_text());print(json.dumps(result),flush=True)
  page.click('#tNew');page.wait_for_timeout(400);page.fill('#ccName','Habilidades');page.click('#ccGo');page.wait_for_timeout(1200);page.click('#introOk');page.wait_for_timeout(300);page.evaluate('G.paused=true;window.hurtPlayer=()=>{};setMap(makeLive(),248,200)')
  result['combat']=page.evaluate((ROOT/'tests/skills/combat.js').read_text());print(json.dumps(result['combat']),flush=True)
  page.evaluate("()=>{const P=G.P;P.dead=false;P.cls='guerrero';P.skills.g4=10;P.slots[0]='g4';P.mp=100000;P.cds={};P.busy=0;G.paused=false;useSkill(0);}");page.wait_for_timeout(150);page.screenshot(path=str(OUT/'habilidad_en_juego.png'));page.evaluate('G.paused=true')
  images=page.evaluate((ROOT/'tests/skills/preview.js').read_text())
  for name,data in images.items():(OUT/name).write_bytes(base64.b64decode(data.split(',')[1]))
  assert not errors,errors;result['errors']=errors;(OUT/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
 finally:
  if errors:(OUT/'errors.json').write_text(json.dumps(errors))
  b.close()
