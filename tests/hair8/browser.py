"""Run the production hairstyle checks in Chromium, and export actual engine previews."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64,json,sys
ROOT=Path(__file__).resolve().parents[2]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--allow-file-access-from-files','--no-sandbox'])
 page=b.new_page(viewport={'width':900,'height':500});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto((ROOT/'dist/test.html').as_uri());page.wait_for_timeout(1500)
 result=page.evaluate((ROOT/'tests/hair8/check.js').read_text());assert result['ok'],result
 assert not errors,errors
 images=page.evaluate((ROOT/'tests/hair8/preview.js').read_text())['images']
 for name,data in images.items():(ROOT/'docs/sprites'/name).write_bytes(base64.b64decode(data.split(',')[1]))
 (ROOT/'tests/hair8/result.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
 b.close()
