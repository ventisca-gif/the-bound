"""6.30 · Aldea Shimotsuki (dojo, Koshiro, Zoro niño y Kuina) y Cuartel General de la Marina (zonas de élite y Garp).
Uso: python3 tests/infancia/islas.py file://$PWD/dist/test.html [carpeta_salida]"""
import sys, json, pathlib
from playwright.sync_api import sync_playwright
URL = sys.argv[1]; OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'tests/infancia/out'); OUT.mkdir(parents=True, exist_ok=True)
SKIP = """()=>{if(!document.querySelector('#modal').hidden)closeModal();const b=[...document.querySelectorAll('#dopts .dopt')].find(b=>/Continuar|Continue/.test(b.textContent));if(b){document.querySelector('#dmsg').click();b.click();return 1}return 0}"""
KILL = "()=>{if(!document.querySelector('#modal').hidden)closeModal();for(const e of G.ents)if(e.type==='mob'&&!e.dying&&e.map===G.map.id&&(e.mid.startsWith('shimo_')||e.mid==='mhq_garp')){e.hp=1;hitMob(e,1e9)}}"
with sync_playwright() as p:
    b = p.chromium.launch(args=['--allow-file-access-from-files']); pg = b.new_page(viewport={'width': 960, 'height': 540}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'hook ' in m.text else None)
    pg.goto(URL); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_selector('#ccName', timeout=30000); pg.fill('#ccName', 'Islas'); pg.click('#ccGo'); pg.wait_for_selector('#introOk:visible', timeout=60000); pg.click('#introOk'); pg.wait_for_timeout(500)
    js = pg.evaluate
    js("""()=>{const P=G.P;P.lv=690;calcStats(P);giveItem('dawn_fruta_diablo',1);const M=makeDawn();P.dawnHelm=dawnHelm('skiff',{x:P.x,y:P.y});setMap(M,...dawnPx(SHIMO_MOOR),'up');G.fading=false;hurtPlayer=function(){};MR.nextLand=G.t+9999;MR.nextSea=G.t+9999;}""")
    pg.wait_for_timeout(1500); js("()=>{if(!document.querySelector('#modal').hidden)closeModal()}")
    land = js("()=>{[G.P.x,G.P.y]=dawnPx(SHIMO_MOOR);G.fading=false;return shimoDockKey()}")
    js("()=>XACT.shimo_land[2]()"); pg.wait_for_timeout(1500)
    js("()=>{[G.P.x,G.P.y]=dawnPx(shimoAt(100,62));G.P.dir='up';updateCamera(0,true)}"); pg.wait_for_timeout(1500)
    intro = js("()=>!document.querySelector('#dialog').hidden&&document.querySelector('#dname').textContent")
    pg.screenshot(path=str(OUT / 'shimo_intro.png'))
    for i in range(10): js(SKIP); pg.wait_for_timeout(200)
    pg.wait_for_timeout(800); pg.screenshot(path=str(OUT / 'shimo_dojo.png'))
    life = js("()=>(G.map.shimoLife||[]).map(e=>e.id)")
    # entrenamiento, Zoro y Kuina
    res = {}
    for kind in ['train', 'zoro', 'kuina']:
        js("()=>{closeModal();closeDialog()}"); js("(k)=>shimoFightStart(k)", kind); pg.wait_for_timeout(1200)
        if kind == 'kuina': pg.screenshot(path=str(OUT / 'shimo_kuina.png'))
        n = js("()=>G.map.shimoFight&&G.map.shimoFight.foes.length")
        for i in range(30):
            js(KILL); pg.wait_for_timeout(250)
            if not js("()=>!!G.map.shimoFight"): break
        pg.wait_for_timeout(500)
        if kind == 'kuina': pg.screenshot(path=str(OUT / 'shimo_promesa.png'))
        for i in range(10): js(SKIP); pg.wait_for_timeout(150)
        res[kind] = n
    done = js("()=>({t:G.P.shimoTrain,z:G.P.shimoZoro,k:G.P.shimoKuina})")
    # Cuartel de la Marina
    js("""()=>{closeModal();closeDialog();const P=G.P;XACT.shimo_sail&&(()=>{[P.x,P.y]=dawnPx(SHIMO_PIER);G.fading=false;XACT.shimo_sail[2]()})()}"""); pg.wait_for_timeout(1500)
    js("()=>{const P=G.P;G.fading=false;[P.x,P.y]=dawnPx(MHQ_MOOR);P.dawnHelm=P.dawnHelm||{kind:'skiff'}}"); pg.wait_for_timeout(300)
    mland = js("()=>mhqDockKey()"); js("()=>XACT.mhq_land[2]()"); pg.wait_for_timeout(1500)
    js("()=>{if(!document.querySelector('#modal').hidden)closeModal();[G.P.x,G.P.y]=dawnPx(mhqAt(120,112));G.P.dir='up';updateCamera(0,true)}"); pg.wait_for_timeout(1500)
    pg.screenshot(path=str(OUT / 'marina_cuartel.png'))
    js("()=>{[G.P.x,G.P.y]=dawnPx(mhqAt(46,112));updateCamera(0,true)}"); pg.wait_for_timeout(4000)
    elite = js("()=>(G.map.mhqElite||[])[0]&&G.map.mhqElite[0].alive.map(m=>m.lv)")
    pg.screenshot(path=str(OUT / 'marina_elite.png'))
    js("()=>{for(const z of G.map.mhqElite)for(const m of z.alive){m.remove=true}G.map.mhqElite=null;[G.P.x,G.P.y]=dawnPx(MHQ_DOOR);G.P.y+=10;XACT.mhq_in[2]()}"); pg.wait_for_timeout(2000)
    hall = js("()=>({id:G.map.id,cast:(G.map.mhqCast||[]).map(e=>e.id)})")
    js("()=>{const g=G.ents.find(e=>e.id==='mhq_garp'&&!e.remove);openDialog(g)}"); pg.wait_for_timeout(500); pg.screenshot(path=str(OUT / 'marina_garp.png'))
    js("()=>{closeDialog();mhqDuelStart()}"); pg.wait_for_timeout(1500); pg.screenshot(path=str(OUT / 'marina_duelo.png'))
    duel = js("()=>!!G.map.mhqDuel")
    for i in range(30):
        js(KILL); pg.wait_for_timeout(250)
        if not js("()=>!!G.map.mhqDuel"): break
    for i in range(6): js(SKIP); pg.wait_for_timeout(150)
    garp = js("()=>G.P.mhqGarp")
    dbg = js("()=>{closeDialog();closeModal();const r={f:G.fading,in:G.P.inside,m:!!G.P._mhq};XACT.mhq_out[2]();return r}"); pg.wait_for_timeout(2500)
    back = js("()=>({map:G.map.id,boat:!!(G.P.dawnBoat&&G.P.dawnBoat.mhq)})")
    lupa = js("()=>['shimo630','mhq630','infancia630','inf_ropa630'].map(k=>{const e=LUPA_DAWN.find(e=>e[0]===k);return e?e[2]().length:0})")
    out = {'land': land, 'intro': intro, 'life': len(life), 'res': res, 'done': done, 'mland': mland, 'elite': elite, 'hall': hall, 'duel': duel, 'garp': garp, 'back': back, 'lupa': lupa, 'errors': errs}
    print(json.dumps(out, ensure_ascii=False, indent=1))
    assert land == 'shimo_land' and intro and len(life) >= 12 and res == {'train': 4, 'zoro': 1, 'kuina': 1} and done == {'t': 1, 'z': 1, 'k': 1}, out
    assert mland == 'mhq_land' and elite and min(elite) >= 690 and hall['id'] == 'marina_hq' and 'mhq_garp' in hall['cast'] and duel and garp == 1 and back['map'] == 'dawn', out
    assert all(lupa) and not errs, out
    print('OK'); b.close()
