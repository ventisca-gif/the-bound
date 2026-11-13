import sys, json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--allow-file-access-from-files'])
    pg=b.new_page(); pg.goto(sys.argv[1]); pg.wait_for_timeout(2000)
    print(pg.evaluate(sys.argv[2]))
    b.close()
