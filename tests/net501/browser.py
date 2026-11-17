import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']+['--allow-file-access-from-files']);pg=b.new_page(viewport={'width':1200,'height':850});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
 pg.goto((ROOT/'dist/test.html').as_uri()+(sys.argv[1] if len(sys.argv)>1 else ''));pg.wait_for_timeout(1800)
 pg.click('#tNew');pg.wait_for_timeout(400);pg.fill('#ccName','Red');pg.click('#ccGo');pg.wait_for_timeout(1200);pg.click('#introOk');pg.wait_for_timeout(300)
 pg.evaluate("window.hurtPlayer=()=>{};G.paused=true")
 r=pg.evaluate((ROOT/'tests/net501/check.js').read_text());r['errors']=errs
 print(json.dumps(r,ensure_ascii=False,indent=1));b.close()
