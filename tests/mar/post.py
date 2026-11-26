"""6.29 · Mar de Dawn después de la historia: mapas del tesoro de Buggy, buque de guerra de la Marina y asaltos semanales.
Uso: python3 tests/mar/post.py file://$PWD/dist/test.html [carpeta_salida]"""
import sys, json, pathlib
from playwright.sync_api import sync_playwright
URL = sys.argv[1]; OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'tests/mar/out'); OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--allow-file-access-from-files']); pg = b.new_page(viewport={'width': 960, 'height': 540}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'hook ' in m.text else None)
    pg.goto(URL); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_selector('#ccName', timeout=30000); pg.fill('#ccName', 'Post'); pg.click('#ccGo'); pg.wait_for_selector('#introOk:visible', timeout=60000); pg.click('#introOk'); pg.wait_for_timeout(500)
    js = pg.evaluate
    close = "()=>{if(!document.querySelector('#modal').hidden)closeModal()}"
    js("""()=>{const P=G.P;P.lv=640;P.bossKills={dawn_alvida:1,con_arlong:1,orange_buggy:1,baratie_krieg:1};P.bossKills[MORGAN_ID]=1;P.dawnCrewJoined=1;P.syrupUsopp=1;P.baratieSanji=1;P.dawnCrewAshore=null;calcStats(P);
      const M=makeDawn();P.dawnHelm=dawnHelm('skiff',{x:P.x,y:P.y});setMap(M,...dawnPx(LOGUE_MOOR),'up');giveItem('dawn_fruta_diablo',1);G.fading=false;}""")
    pg.wait_for_timeout(800); js("()=>{const P=G.P;P.dawnBoat=null;[P.x,P.y]=dawnPx(LOGUE_MOOR);G.fading=false;XACT.logue_land[2]();}"); pg.wait_for_timeout(1500)
    js("()=>{const P=G.P;[P.x,P.y]=dawnPx(logueAt(124,184));P.dir='down';updateCamera(0,true);hurtPlayer=function(){};MR.nextLand=G.t+9999;MR.nextSea=G.t+9999;}"); pg.wait_for_timeout(2000); js(close)
    # 14) mapa del tesoro
    js("()=>{giveItem('tm_mapa',1);const n=spawnNPC(ORANGE_NAMI,G.P.x+20,G.P.y-20,'dawn',{});openDialog(n);const b=[...document.querySelectorAll('#dialog button')].find(b=>/mapa de Buggy|Buggy’s map/.test(b.textContent));if(b)b.click()}"); pg.wait_for_timeout(500)
    tm = js("()=>G.P.tmMap&&{isle:G.P.tmMap.isle,wp:G.P.wp&&G.P.wp.t,left:(G.P.inv||[]).filter(s=>s&&s.id==='tm_mapa').length}")
    js("()=>{closeModal();G.P.tmMap.at=[G.P.x>>4,G.P.y>>4]}"); pg.wait_for_timeout(800)
    xs = js("()=>G.P.tmMap&&G.P.tmMap.x!=null"); js("()=>{const T=G.P.tmMap;G.P.x=T.x;G.P.y=T.y;updateCamera(0,true)}"); pg.wait_for_timeout(500); js(close); pg.wait_for_timeout(300)
    pg.screenshot(path=str(OUT / "tesoro.png")); dig = js("()=>ACT.k")
    g0 = js("()=>G.P.gold"); js("()=>{for(let i=0;i<6;i++)if(ACT.onAtk)ACT.onAtk()}"); pg.wait_for_timeout(500)
    tm2 = js("()=>({dug:G.P.tmDug,map:G.P.tmMap,act:ACT.k})"); g1 = js("()=>G.P.gold"); js(close)
    # 16) asalto: venganza de Buggy (aquí mismo)
    js("()=>{for(const R of RAIDS)R.at=[G.P.x>>4,G.P.y>>4];const n=spawnNPC('con_johnny',G.P.x-20,G.P.y-20,'dawn',{});openDialog(n);const b=[...document.querySelectorAll('#dialog button')].find(b=>/Asalto|Raid/.test(b.textContent));if(b)b.click();G.P.raidOn={k:'buggy',w:pdWeek()}}"); pg.wait_for_timeout(300); js(close); pg.wait_for_timeout(1200)
    rb = js("()=>PD.raid&&{k:PD.raid.k,n:PD.raid.mobs.length,boss:!!PD.raid.boss}"); pg.wait_for_timeout(3000); pg.screenshot(path=str(OUT / 'asalto_buggy.png'))
    marks = js("()=>PD.knives||0")
    js("()=>{for(const m of PD.raid.mobs){m.hp=1;hitMob(m,1e8)}}"); pg.wait_for_timeout(2000); js(close)
    rb2 = js("()=>({raid:!!PD.raid,week:G.P.raidWeek===pdWeek(),n:G.P.raidN})")
    # hombres-pez (repetición en la misma semana → premio pequeño)
    js("()=>{G.P.raidOn={k:'gyojin',w:pdWeek()}}"); pg.wait_for_timeout(1200); rg = js("()=>PD.raid&&PD.raid.mobs.map(m=>m.mid)"); pg.screenshot(path=str(OUT / 'asalto_gyojin.png'))
    gg0 = 0
    for i in range(30):
        js("()=>{if(!document.querySelector('#modal').hidden)closeModal();if(PD.raid)for(const m of PD.raid.mobs)if(!m.dying){m.hp=1;hitMob(m,1e8)}}"); pg.wait_for_timeout(300)
        if js("()=>!PD.raid"): break
    gg1 = js("()=>PD.lastPrize")
    # 15) buque de guerra en el mar (peligro 4) y 16) flota de Krieg
    js("""()=>{const P=G.P,M=G.map;P.bounty=7e7;P.bntTier=9;let at=null;for(let r=200;r<900&&!at;r+=20)for(let a=0;a<6.28&&!at;a+=0.3){const X=P.x+Math.cos(a)*r,Y=P.y+Math.sin(a)*r;if(dawnSurface(M,X,Y,30))at=[X,Y];}
      P.dawnHelm=dawnHelm('galleon',{x:at[0],y:at[1]});P.x=at[0];P.y=at[1];updateCamera(0,true);NV.nextKing=G.t+999;NV.nextPir=G.t+999;NV.nextStorm=G.t+999;ARC.nextWi=G.t+999;PD_NEXTBUQUE=1;const r0=Math.random;Math.random=()=>0.1;setTimeout(()=>Math.random=r0,400)}""")
    pg.wait_for_timeout(1200); js(close); bq = js("()=>ARC.foes.filter(f=>f.k==='buque').map(f=>f.hp)"); pg.screenshot(path=str(OUT / 'buque.png'))
    for i in range(40):
        js("()=>{if(!document.querySelector('#modal').hidden)closeModal();const f=ARC.foes.find(f=>f.k==='buque');if(f){f.x=G.P.x+260;f.y=G.P.y;f.hp=Math.min(f.hp,1);f.cd=99}basicAttack()}"); pg.wait_for_timeout(300)
        if js("()=>!ARC.foes.some(f=>f.k==='buque')"): break
    bq2 = js("()=>(G.P.nvStats||{}).buque||0")
    js("()=>{RAIDS[1].at=[G.P.x>>4,G.P.y>>4];G.P.raidOn={k:'krieg',w:pdWeek()};PD.raid=null}"); pg.wait_for_timeout(1200); js(close)
    rk = js("()=>PD.raid&&{foes:PD.raid.foes.length,ships:PD.raid.ships.length}"); pg.screenshot(path=str(OUT / 'asalto_krieg.png'))
    for i in range(60):
        js("()=>{if(!document.querySelector('#modal').hidden)closeModal();const S=PD.raid;if(!S)return;for(const f of [...S.foes,...S.ships])if(!f.dead&&(S.foes.includes(f)||NV.foes.includes(f))){if(S.ships.includes(f)){nvKill(f);break}f.x=G.P.x+260;f.y=G.P.y;f.hp=Math.min(f.hp,1);f.cd=99;break}basicAttack()}"); pg.wait_for_timeout(300)
        if js("()=>!PD.raid"): break
    rk2 = js("()=>({raid:!!PD.raid,n:G.P.raidN,left:PD.raid&&[...PD.raid.foes,...PD.raid.ships].map(f=>[f.k,f.hp,f.dead,NV.foes.includes(f)])})")
    lupa = js("()=>{const e=LUPA_DAWN.find(e=>e[0]==='post629');return e&&e[2]().length}")
    out = {'tm': tm, 'x': xs, 'dig': dig, 'tm2': tm2, 'chestGold': g1 - g0, 'raidBuggy': rb, 'knives': marks, 'rb2': rb2, 'gyojin': rg, 'repeatGold': gg1 - gg0, 'buque': bq, 'buque2': bq2, 'krieg': rk, 'krieg2': rk2, 'lupa': lupa, 'errors': errs}
    print(json.dumps(out, ensure_ascii=False, indent=1))
    assert tm and tm['wp'] and tm['left'] == 0 and xs and dig == 'tmdig' and tm2['dug'] == 1 and not tm2['map'] and not tm2['act'] and g1 > g0, out
    assert rb and rb['boss'] and rb['n'] >= 5 and marks > 0 and not rb2['raid'] and rb2['week'] and rb2['n'] == 1, out
    assert rg and len(rg) == 3 and 40000 <= gg1 - gg0 <= 60000, out
    assert bq and bq2 == 1 and rk and rk['foes'] == 1 and not rk2['raid'] and rk2['n'] == 3 and lupa == 3 and not errs, out
    print('OK'); b.close()
