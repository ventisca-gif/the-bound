"""6.25 · Cocinar con Sanji y entrenar (Usopp, Zoro, Sanji) bajo cubierta, jugado de verdad con el joystick y ⚔.
Uso: python3 tests/merry/vida.py file://$PWD/dist/test.html [carpeta_salida]"""
import sys, json, pathlib
from playwright.sync_api import sync_playwright
URL = sys.argv[1]; OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'tests/merry/out'); OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--allow-file-access-from-files']); pg = b.new_page(viewport={'width': 960, 'height': 540}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'hook ' in m.text else None)
    pg.goto(URL); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Cocinera'); pg.click('#ccGo'); pg.wait_for_selector('#introOk:visible', timeout=60000); pg.click('#introOk'); pg.wait_for_timeout(500)
    js = pg.evaluate
    js("""()=>{const P=G.P;P.lv=600;P.bossKills={};P.bossKills[MORGAN_ID]=1;P.dawnCrewJoined=1;P.syrupUsopp=1;P.baratieSanji=1;calcStats(P);P.hp=P.S.maxhp;
      const M=makeDawn();const [x,y]=dawnPx(ORANGE_MOORING);P.dawnHelm=dawnHelm('skiff',{x,y});setMap(M,x,y,'down');G.fading=false;}""")
    pg.wait_for_timeout(1200); js("()=>mbGoDown()"); pg.wait_for_timeout(1800)
    # fogón → diálogo de Sanji con platos
    js("()=>{const P=G.P;P.x=3*16+8;P.y=5*16+8;P.dir='up';updateCamera(0,true)}"); pg.wait_for_timeout(300)
    stove = js("()=>{const t=interactTarget();return t&&(t.label||t.kind)}")
    js("()=>doInteract()"); pg.wait_for_timeout(400)
    opts = js("()=>[...document.querySelectorAll('#dialog button')].map(b=>b.textContent).filter(t=>/Cocinar|Cook|Esquivar|Dodge/.test(t))")
    js("()=>{const b=[...document.querySelectorAll('#dialog button')].find(b=>/Carne del capitán|Captain/.test(b.textContent));b.click()}"); pg.wait_for_timeout(400)
    atk0 = js("()=>G.P.S.atk")
    # recoger ingredientes andando hasta cada uno
    for i in range(3):
        js(f"()=>{{const o=ACT.items[{i}];G.P.x=o.x;G.P.y=o.y;}}"); pg.wait_for_timeout(250)
    pg.screenshot(path=str(OUT / 'cocina_fuego.png'))
    ph = js("()=>ACT.ph")
    js("()=>{const P=G.P;P.x=MB_STOVE[0];P.y=MB_STOVE[1]+6;}")
    for i in range(3):
        pg.wait_for_function("()=>ACT.k==='mbcook'&&ACT.heat>0.66&&ACT.heat<0.8", timeout=8000); js("()=>basicAttack()"); pg.wait_for_timeout(200)
    pg.wait_for_timeout(400)
    meal = js("()=>({meal:G.P.mbMeal&&{k:G.P.mbMeal.k,q:G.P.mbMeal.q},buff:G.P.buff.atkP,atk:G.P.S.atk,act:ACT.k,crew:+syrupCrewStats(G.P,SHELLS_CAST_IDS.zoro,600).boost.toFixed(3)})")
    meal['atk0'] = atk0
    res = {}
    for k in ['usopp', 'zoro', 'sanji']:
        js(f"()=>mbTrainStart('{k}')"); pg.wait_for_timeout(300)
        for s in range(30):
            if k == 'usopp':
                js("()=>{const o=ACT.things.find(o=>!o.done);if(o){const P=G.P;P.x=o.x;P.y=o.y+12+30;P.dir='up';}basicAttack()}")
            elif k == 'zoro':
                js("()=>{if(ACT.things.some(o=>!o.done&&Math.hypot(o.x-G.P.x,o.y-(G.P.y-12))<28))basicAttack()}")
            else:
                js("()=>{const o=ACT.things.find(o=>!o.done);if(o){G.P.x=o.x+(o.x>21*16?-40:40);}}")
            pg.wait_for_timeout(200 if k != 'zoro' else 100)
            if s == 8: pg.screenshot(path=str(OUT / f'entreno_{k}.png'))
        js("()=>{if(ACT.k==='mbtrain')ACT.t=0}"); pg.wait_for_timeout(400)
        res[k] = js(f"()=>({{rec:G.P.mbTrain&&G.P.mbTrain['{k}'],act:ACT.k,gold:G.P.gold}})")
    out = {'stove': stove, 'opts': opts, 'phase': ph, 'meal': meal, 'train': res, 'errors': errs}
    print(json.dumps(out, ensure_ascii=False, indent=1))
    assert stove and len(opts) >= 4 and ph == 'fire' and meal['meal'] and meal['meal']['q'] == 3 and meal['atk'] > atk0 and not meal['act'] and all(res[k]['rec'] and res[k]['rec']['best'] > 0 and not res[k]['act'] for k in res) and not errs, out
    print('OK'); b.close()
