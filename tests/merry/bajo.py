"""6.25 · Bajo cubierta del Going Merry: bajar desde el menú del barco, interior (cocina, comedor, salita y bodega)
con la tripulación, y subir de vuelta al timón en el mismo sitio.
Uso: python3 tests/merry/bajo.py file://$PWD/dist/test.html [carpeta_salida]"""
import sys, json, pathlib
from playwright.sync_api import sync_playwright
URL = sys.argv[1]; OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'tests/merry/out'); OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--allow-file-access-from-files']); pg = b.new_page(viewport={'width': 960, 'height': 540}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'hook ' in m.text else None)
    pg.goto(URL); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Merry'); pg.click('#ccGo'); pg.wait_for_selector('#introOk:visible', timeout=60000); pg.click('#introOk'); pg.wait_for_timeout(500)
    js = pg.evaluate
    js("""()=>{const P=G.P;P.lv=600;P.bossKills={};P.bossKills[MORGAN_ID]=1;P.dawnCrewJoined=1;P.syrupUsopp=1;P.baratieSanji=1;calcStats(P);P.hp=P.S.maxhp;
      const M=makeDawn();const [x,y]=dawnPx(ORANGE_MOORING);P.dawnHelm=dawnHelm('skiff',{x,y});setMap(M,x,y,'down');G.fading=false;giveItem('dawn_fruta_diablo',1);}""")
    pg.wait_for_timeout(1500)
    before = js("()=>[Math.round(G.P.x),Math.round(G.P.y),G.map.id,G.P.dawnHelm&&G.P.dawnHelm.kind]")
    js("()=>dawnTalkAboard()"); pg.wait_for_timeout(400)
    btns = js("()=>[...document.querySelectorAll('#modal button')].map(b=>b.textContent)")
    pg.screenshot(path=str(OUT / '0_menu.png'))
    js("()=>{const b=[...document.querySelectorAll('#modal button')].find(b=>/Bajar a la cocina|Go below/.test(b.textContent));b.click()}"); pg.wait_for_timeout(1800)
    inside = js("()=>({map:G.map.id,crew:(G.map.mbCrew||[]).map(e=>e.id),trip:!!G.P._mbTrip,helm:!!G.P.dawnHelm})")
    js("()=>{const P=G.P;P.x=14*16+8;P.y=6*16+8;updateCamera(0,true)}"); pg.wait_for_timeout(900); pg.screenshot(path=str(OUT / '1_comedor.png'))
    js("()=>{const P=G.P;P.x=6*16+8;P.y=8*16+8;updateCamera(0,true)}"); pg.wait_for_timeout(900); pg.screenshot(path=str(OUT / '2_cocina.png'))
    js("()=>{const P=G.P;P.x=22*16+8;P.y=8*16+8;updateCamera(0,true)}"); pg.wait_for_timeout(900); pg.screenshot(path=str(OUT / '3_salita.png'))
    js("()=>{const P=G.P;P.x=19*16+8;P.y=5*16+8;P.dir='up';updateCamera(0,true)}"); pg.wait_for_timeout(500)
    tgt = js("()=>{const t=interactTarget();return t&&(t.label||t.kind)}")
    js("()=>doInteract()"); pg.wait_for_timeout(1800)
    after = js("()=>[Math.round(G.P.x),Math.round(G.P.y),G.map.id,G.P.dawnHelm&&G.P.dawnHelm.kind,!!G.P._mbTrip]")
    out = {'before': before, 'menu': btns, 'inside': inside, 'ladder': tgt, 'after': after, 'errors': errs}
    print(json.dumps(out, ensure_ascii=False, indent=1))
    assert any('cocina' in x.lower() or 'galley' in x.lower() for x in btns) and inside['map'] == 'merry_bajo' and len(inside['crew']) == 5 and after[:4] == before and not after[4] and not errs, out
    print('OK'); b.close()
