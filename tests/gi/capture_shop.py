from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]
out=ROOT/'shop-captures';out.mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--allow-file-access-from-files','--no-sandbox'])
 page=b.new_page(viewport={'width':1100,'height':700},device_scale_factor=1);errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto((ROOT/'update/thebound.html').as_uri());page.wait_for_timeout(1600)
 page.click('#tNew');page.wait_for_timeout(400);page.fill('#ccName','Ventisca');page.click('#ccGo');page.wait_for_timeout(1200);page.click('#introOk');page.wait_for_timeout(400)
 page.evaluate("""()=>{closeModal();closePanel();const M=makeComicsIn();G.P.inside=M.id;G.P.gold=24000;setMap(M,9*16+8,10*16+8,'up');window.hurtPlayer=()=>{};for(const e of G.ents)if(e.map===M.id)e.wander=0;updateCamera(0,true);}""")
 page.wait_for_timeout(2200)
 page.screenshot(path=str(out/'tendero_tienda_akihabara.png'))
 page.evaluate("""()=>{const n=G.ents.find(e=>e.id==='jp_comic_st'&&e.map==='jp_comics_in');if(!n)throw Error('Shopkeeper missing');openDialog(n);}""")
 page.wait_for_timeout(4000)
 assert page.locator('#dopts').inner_text().find('Gi naranja completo')>=0
 assert page.locator('#dopts').inner_text().find('24,000')>=0 or page.locator('#dopts').inner_text().find('24.000')>=0
 page.screenshot(path=str(out/'tendero_interfaz_completa.png'))
 page.locator('#dialog').screenshot(path=str(out/'tendero_menu_gi_naranja.png'))
 assert not errors,errors
 print('Captured published build',page.evaluate('GAME_BUILD'),'shopkeeper and real dialogue',errors)
 b.close()
