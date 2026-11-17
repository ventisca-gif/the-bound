from pathlib import Path
from playwright.sync_api import sync_playwright
import json,base64
ROOT=Path(__file__).resolve().parents[2];out=ROOT/'tests/r143/out';out.mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--allow-file-access-from-files','--no-sandbox'])
 page=b.new_page(viewport={'width':1100,'height':700});errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
 page.goto((ROOT/'dist/test.html').as_uri());page.wait_for_timeout(2000)
 page.click('#tNew');page.wait_for_timeout(400);page.fill('#ccName','Diseños');page.click('#ccGo');page.wait_for_timeout(1200);page.click('#introOk');page.wait_for_timeout(300)
 page.evaluate('window.hurtPlayer=()=>{};G.paused=true')
 result=page.evaluate((ROOT/'tests/r143/check.js').read_text());assert result['ok'];assert not errs,errs
 result['errors']=errs;(out/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps({k:v for k,v in result.items()if k!='sprites'}))
 previews=page.evaluate((ROOT/'tests/r143/preview.js').read_text())
 for name,data in previews.items():(out/name).write_bytes(base64.b64decode(data.split(',')[1]))
 b.close()
