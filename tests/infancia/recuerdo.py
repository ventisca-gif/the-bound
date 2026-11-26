"""6.30 · Casa de Dadan y recuerdo de los hermanos (Luffy, Ace y Sabo niños) en Villa Foosha.
Uso: python3 tests/infancia/recuerdo.py file://$PWD/dist/test.html [carpeta_salida]"""
import sys, json, pathlib
from playwright.sync_api import sync_playwright
URL = sys.argv[1]; OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'tests/infancia/out'); OUT.mkdir(parents=True, exist_ok=True)
SKIP = """()=>{if(!document.querySelector('#modal').hidden)closeModal();if(CINE.on)cineEnd();const b=[...document.querySelectorAll('#dopts .dopt')].find(b=>/Continuar|Continue/.test(b.textContent));if(b){document.querySelector('#dmsg').click();b.click();return 1}return 0}"""
with sync_playwright() as p:
    b = p.chromium.launch(args=['--allow-file-access-from-files']); pg = b.new_page(viewport={'width': 960, 'height': 540}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and ('hook ' in m.text or 'fit:' in m.text) else None)
    pg.goto(URL); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_selector('#ccName', timeout=30000); pg.fill('#ccName', 'Inf'); pg.click('#ccGo'); pg.wait_for_selector('#introOk:visible', timeout=60000); pg.click('#introOk'); pg.wait_for_timeout(500)
    js = pg.evaluate
    js("""()=>{const P=G.P;P.lv=620;calcStats(P);giveItem('dawn_fruta_diablo',1);SETTINGS.cine=true;const M=makeDawn();P.dawnHelm=dawnHelm('skiff',{x:P.x,y:P.y});setMap(M,...dawnPx(LOGUE_MOOR),'up');G.fading=false;
      setTimeout(()=>{P.dawnHelm=null;P.dawnBoat=null;[P.x,P.y]=infPx([362,146]);P.dir='up';updateCamera(0,true);G.fading=false;hurtPlayer=function(){};MR.nextLand=G.t+9999;MR.nextSea=G.t+9999;},600)}""")
    pg.wait_for_timeout(2500); js("()=>{if(!document.querySelector('#modal').hidden)closeModal()}"); pg.wait_for_timeout(400)
    js("()=>{[G.P.x,G.P.y]=infPx([362,140]);G.P.y+=4;updateCamera(0,true)}"); pg.wait_for_timeout(300)
    house = js("()=>{const M=G.map,o=M.infHouse;return {key:o&&o.dawnKey,solid:M.solidO[139*M.w+357]===1,dadan:G.ents.some(e=>e.id==='inf_dadan'&&!e.remove),kids:G.ents.filter(e=>e.infHome&&!e.remove).length,hint:G.P.infHint,wp:G.P.wp&&G.P.wp.t}}")
    pg.screenshot(path=str(OUT / 'casa_dadan.png'))
    door = js("()=>{const it=interactTarget();return it&&it.kind==='xact'?it.o.xact:(it&&it.kind)}")
    # diálogo con Dadan (retrato) y empezar el recuerdo
    js("()=>{const d=G.ents.find(e=>e.id==='inf_dadan'&&!e.remove);openDialog(d)}"); pg.wait_for_timeout(600); pg.screenshot(path=str(OUT / 'dialogo_dadan.png'))
    opt = js("()=>{const b=[...document.querySelectorAll('#dopts .dopt')].find(b=>/Recuerdo de los hermanos|Memory of the brothers/.test(b.textContent));if(b){b.click();return 1}return 0}")
    pg.wait_for_timeout(1500); pg.screenshot(path=str(OUT / 'cine_garp.png'))
    for i in range(30):
        js(SKIP); pg.wait_for_timeout(250)
        if js("()=>G.map.infArc&&G.map.infArc.phase==='chase'"): break
    pg.wait_for_timeout(1500); pg.screenshot(path=str(OUT / 'recuerdo_chase.png'))
    chase = js("()=>({phase:G.map.infArc.phase,kids:Object.keys(G.map.infArc.kids),wp:G.P.wp&&G.P.wp.t})")
    # al Gray Terminal: Sabo y Porchemy
    js("()=>{[G.P.x,G.P.y]=infPx([294,160]);updateCamera(0,true)}"); pg.wait_for_timeout(800)
    pg.screenshot(path=str(OUT / 'dialogo_sabo.png'))
    for i in range(20):
        js(SKIP); pg.wait_for_timeout(200)
        if js("()=>G.map.infArc.phase==='fight1'"): break
    pg.wait_for_timeout(2500); pg.screenshot(path=str(OUT / 'pelea_porchemy.png'))
    f1 = js("()=>G.map.infArc.foes.map(f=>f.mid)")
    def win(ph):
        for i in range(60):
            js("()=>{if(!document.querySelector('#modal').hidden)closeModal();const A=G.map.infArc;if(!A)return;for(const f of A.foes)if(!f.dying){f.hp=1;hitMob(f,1e9)}}"); pg.wait_for_timeout(250)
            if js("()=>!G.map.infArc||G.map.infArc.phase!=='%s'" % ph): break
        for i in range(20):
            js(SKIP); pg.wait_for_timeout(200)
            if not js("()=>!document.querySelector('#dialog').hidden"): break
    win('fight1'); hunt = js("()=>G.map.infArc&&[G.map.infArc.phase,G.P.wp&&G.P.wp.t]")
    js("()=>{[G.P.x,G.P.y]=infPx([400,136]);updateCamera(0,true)}"); pg.wait_for_timeout(2500); pg.screenshot(path=str(OUT / 'pelea_jabali.png'))
    f2 = js("()=>G.map.infArc&&G.map.infArc.foes.map(f=>f.mid)")
    win('fight2')
    js("()=>{[G.P.x,G.P.y]=infPx([294,160]);updateCamera(0,true)}"); pg.wait_for_timeout(1500)
    for i in range(20):
        js(SKIP); pg.wait_for_timeout(200)
        if js("()=>G.map.infArc&&G.map.infArc.phase==='fight3'"): break
    pg.wait_for_timeout(2500); pg.screenshot(path=str(OUT / 'pelea_bluejam_fuego.png'))
    f3 = js("()=>G.map.infArc&&G.map.infArc.foes.map(f=>f.mid)")
    g0 = js("()=>G.P.gold")
    for i in range(60):
        js("()=>{if(!document.querySelector('#modal').hidden)closeModal();const A=G.map.infArc;if(!A)return;for(const f of A.foes)if(!f.dying){f.hp=1;hitMob(f,1e9)}}"); pg.wait_for_timeout(250)
        if js("()=>CINE.on||!G.map.infArc"): break
    pg.wait_for_timeout(5000); pg.screenshot(path=str(OUT / 'cine_sake.png'))
    js("()=>{if(CINE.on)cineEnd()}"); pg.wait_for_timeout(2500); pg.screenshot(path=str(OUT / 'fin.png'))
    end = js("()=>({done:G.P.infDone,arc:!!G.map.infArc,gold:G.P.gold,wardrobe:(G.P.wardrobe||[]).filter(id=>/^c_inf_/.test(id))})")
    lupa = js("()=>{const r=LUPA_DAWN.find(e=>e[0]==='ruta')[2]();return [r.length,r.find(s=>/Recuerdo|Memory/.test(s))]}")
    out = {'house': house, 'door': door, 'opt': opt, 'chase': chase, 'f1': f1, 'hunt': hunt, 'f2': f2, 'f3': f3, 'end': end, 'gold': end['gold'] - g0, 'lupa': lupa, 'errors': errs}
    print(json.dumps(out, ensure_ascii=False, indent=1))
    assert house['key'] == 'dadan_house' and house['solid'] and house['dadan'] and house['kids'] == 3 and door == 'inf_door', out
    assert chase['phase'] == 'chase' and 'inf_porchemy' in f1 and f2 and 'inf_jabali' in f2 and f3 and 'inf_bluejam' in f3, out
    assert end['done'] == 1 and not end['arc'] and end['gold'] - g0 >= 200000 and lupa[1] and not errs, out
    assert sorted(end['wardrobe']) == ['c_inf_ace_camiseta', 'c_inf_luffy_sombrero', 'c_inf_sabo_sombrero'], out
    # repetir: pity por prenda (a las 8 repeticiones sin ella es segura)
    rep = js("()=>{const r=[];for(let i=0;i<8;i++){const n=(G.P.wardrobe||[]).length;infClothes(false);r.push((G.P.wardrobe||[]).length-n)}return {got:r,left:infMiss().length}}")
    print(rep); assert rep['left'] == 0, rep
    print('OK'); b.close()
