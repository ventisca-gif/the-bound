import sys, asyncio
from playwright.async_api import async_playwright
async def main(url, out, w, h):
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': int(w), 'height': int(h)})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append('log:'+m.text) if m.type=='error' else None)
        await pg.goto(url); await pg.wait_for_timeout(1500)
        await pg.screenshot(path=out, full_page=True); print('errors', errs[:5]); await b.close()
asyncio.run(main(*sys.argv[1:5]))
