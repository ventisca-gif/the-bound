"""6.26 · Batallas en el mar: cañones (⚔ al timón), barco pirata, Rey Marino, avisos rojos (daño/esquivar), tormenta,
reparación al atracar y Festín del Rey Marino en la cocina del Merry.
Uso: python3 tests/mar/batalla.py file://$PWD/dist/test.html [carpeta_salida]"""
import sys, json, pathlib
from playwright.sync_api import sync_playwright
URL = sys.argv[1]; OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'tests/mar/out'); OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--allow-file-access-from-files']); pg = b.new_page(viewport={'width': 960, 'height': 540}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'hook ' in m.text else None)
    pg.goto(URL); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Marinera'); pg.click('#ccGo'); pg.wait_for_selector('#introOk:visible', timeout=60000); pg.click('#introOk'); pg.wait_for_timeout(500)
    js = pg.evaluate
    js("""()=>{const P=G.P;P.lv=600;P.bossKills={};P.bossKills[MORGAN_ID]=1;P.dawnCrewJoined=1;P.syrupUsopp=1;P.baratieSanji=1;calcStats(P);P.hp=P.S.maxhp;
      const M=makeDawn();let at=null;const [ox,oy]=dawnPx(ORANGE_MOORING);for(let r=200;r<3000&&!at;r+=100)for(let a=0;a<6.28&&!at;a+=0.4){const x=ox+Math.cos(a)*r,y=oy+Math.sin(a)*r;let ok=true;for(let k=0;k<8;k++){const b=k*0.785;if(!dawnSurface(M,x+Math.cos(b)*260,y+Math.sin(b)*200,20))ok=false;}if(ok)at=[x,y];}
      P.dawnHelm=dawnHelm('skiff',{x:at[0],y:at[1]});setMap(M,at[0],at[1],'down');G.fading=false;NV.nextKing=G.t+999;NV.nextPir=G.t+999;NV.nextStorm=G.t+999;if(typeof MR!=='undefined'){MR.nextSea=G.t+999;MR.boat=null;}}""")
    pg.wait_for_timeout(1500)
    # barco pirata quieto cerca: disparar hasta hundirlo
    js("()=>{nvSpawnPirate(G.map,G.P);const f=NV.foes.find(f=>f.k==='pirata');f.x=G.P.x+150;f.y=G.P.y;f.cd=99;f.ang=Math.PI;}")
    g0 = js("()=>G.P.gold")
    for i in range(40):
        js("()=>{const f=NV.foes.find(f=>f.k==='pirata');if(f){f.x=G.P.x+150;f.y=G.P.y;f.vx=f.vy=0;f.cd=99;}basicAttack()}"); pg.wait_for_timeout(350)
        if js("()=>!NV.foes.some(f=>f.k==='pirata')"): break
        if i == 3: pg.screenshot(path=str(OUT / '1_pirata.png'))
    pir = js("()=>({stats:G.P.nvStats,gold:G.P.gold})"); pir['g0'] = g0
    # Rey Marino
    js("()=>{nvSpawnKing(G.map,G.P);const f=NV.foes.find(f=>f.k==='rey');f.x=G.P.x+120;f.y=G.P.y+10;f.ph='up';f.t=99;f.cd=99;}")
    pg.wait_for_timeout(500); pg.screenshot(path=str(OUT / '2_rey.png'))
    for i in range(60):
        js("()=>{const f=NV.foes.find(f=>f.k==='rey');if(f){f.ph='up';f.t=99;f.cd=99;f.x=G.P.x+120;f.y=G.P.y+10;}basicAttack()}"); pg.wait_for_timeout(300)
        if js("()=>!NV.foes.some(f=>f.k==='rey')"): break
    king = js("()=>({stats:G.P.nvStats,meat:(G.P.inv||[]).filter(s=>s&&s.id==='nv_carne_rey').reduce((a,s)=>a+(s.n||1),0)})")
    # aviso rojo: daño si te quedas, esquiva si te apartas
    js("()=>{G.P.merryHp=100;nvMark(G.P.x,G.P.y,30,0.4,15)}"); pg.wait_for_timeout(900); hit = js("()=>G.P.merryHp")
    js("()=>{nvMark(G.P.x+200,G.P.y,30,0.4,15)}"); pg.wait_for_timeout(900); dodge = js("()=>G.P.merryHp")
    pg.screenshot(path=str(OUT / '3_hud.png'))
    # tormenta encima: arrastra y cuenta como tocada; al acabar, sin premio
    js("()=>{nvStartStorm(G.map,G.P);NV.storm.x=G.P.x;NV.storm.y=G.P.y;NV.storm.wx=40;NV.storm.wy=0;}"); x0 = js("()=>G.P.x"); pg.wait_for_timeout(1500)
    pg.screenshot(path=str(OUT / '4_tormenta.png'))
    storm = js("()=>({in:nvInStorm(),hit:NV.storm&&NV.storm.hit,dx:Math.round(G.P.x-%s)})" % x0)
    js("()=>{NV.storm.t=0}"); pg.wait_for_timeout(400); stormEnd = js("()=>NV.storm")
    # bajar al Merry y cocinar el festín (gasta la carne)
    js("()=>mbGoDown()"); pg.wait_for_timeout(1800)
    repaired = js("()=>G.P.merryHp")
    feast = js("()=>{const S=G.map.mbCrew.find(e=>e.id===BAR_SANJI);openDialog(S);const b=[...document.querySelectorAll('#dialog button')].find(b=>/Festín|Feast/.test(b.textContent));const t=b&&b.textContent;if(b)b.click();return [t,ACT.k,(G.P.inv||[]).filter(s=>s&&s.id==='nv_carne_rey').length]}")
    js("()=>actEnd()")
    out = {'pirate': pir, 'king': king, 'hit': hit, 'dodge': dodge, 'storm': storm, 'stormEnd': stormEnd, 'hpBelow': repaired, 'feast': feast, 'errors': errs}
    print(json.dumps(out, ensure_ascii=False, indent=1))
    assert pir['stats'] and pir['stats'].get('pirata') == 1 and pir['gold'] > g0 and king['stats'].get('rey') == 1 and king['meat'] == 1, out
    assert hit < 100 and dodge == hit and storm['in'] and storm['hit'] and storm['dx'] > 0 and stormEnd is None and feast[0] and feast[1] == 'mbcook' and feast[2] == 0 and not errs, out
    print('OK'); b.close()
