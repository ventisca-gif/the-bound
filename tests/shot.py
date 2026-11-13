import sys, asyncio
from playwright.sync_api import sync_playwright
url=sys.argv[1]; out=sys.argv[2]; w=int(sys.argv[3]) if len(sys.argv)>3 else 1100; h=int(sys.argv[4]) if len(sys.argv)>4 else 800
wait=int(sys.argv[5]) if len(sys.argv)>5 else 1500
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--allow-file-access-from-files','--disable-web-security'])
    pg=b.new_page(viewport={'width':w,'height':h})
    logs=[]
    pg.on('console',lambda m: logs.append(m.type+': '+m.text))
    pg.on('pageerror',lambda e: logs.append('PAGEERROR: '+str(e)))
    pg.goto(url); pg.wait_for_timeout(wait)
    pg.screenshot(path=out,full_page=True)
    for l in logs[:40]: print(l)
    b.close()
