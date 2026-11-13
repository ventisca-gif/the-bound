# imprime los errores de la página con su pila: python3 tools/dev/errs.py URL
import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
    pg = b.new_page(); pg.on('pageerror', lambda e: print('ERR', e.message, '\n', (e.stack or '')[:900]))
    pg.goto(sys.argv[1]); pg.wait_for_timeout(2500); b.close()
