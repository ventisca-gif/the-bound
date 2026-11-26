"""6.28 · Arcos nuevos del Mar de Dawn: Alvida (Sube Sube), Nezumi, Johnny y Yosaku, Montaña del Revés / Laboon e
Isla del Barco de Guerra (escolta de Apis).
Uso: python3 tests/mar/arcos.py file://$PWD/dist/test.html [carpeta_salida]"""
import sys, json, pathlib
from playwright.sync_api import sync_playwright
URL = sys.argv[1]; OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'tests/mar/out'); OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--allow-file-access-from-files']); pg = b.new_page(viewport={'width': 960, 'height': 540}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'hook ' in m.text else None)
    pg.goto(URL); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_selector('#ccName', timeout=30000); pg.fill('#ccName', 'Arcos'); pg.click('#ccGo'); pg.wait_for_selector('#introOk:visible', timeout=60000); pg.click('#introOk'); pg.wait_for_timeout(500)
    js = pg.evaluate
    js("""()=>{const P=G.P;P.lv=630;P.bossKills={dawn_alvida:1,con_arlong:1};P.bossKills[MORGAN_ID]=1;P.dawnCrewJoined=1;P.syrupUsopp=1;P.baratieSanji=1;P.dawnCrewAshore=null;calcStats(P);
      const M=makeDawn();P.dawnHelm=dawnHelm('skiff',{x:P.x,y:P.y});setMap(M,...dawnPx(LOGUE_MOOR),'up');giveItem('dawn_fruta_diablo',1);G.fading=false;}""")
    pg.wait_for_timeout(800); js("()=>{const P=G.P;P.dawnBoat=null;[P.x,P.y]=dawnPx(LOGUE_MOOR);G.fading=false;XACT.logue_land[2]();}"); pg.wait_for_timeout(1500)
    js("()=>{const P=G.P;[P.x,P.y]=dawnPx(logueAt(124,184));P.dir='down';updateCamera(0,true);hurtPlayer=function(){};MR.nextLand=G.t+9999;MR.nextSea=G.t+9999;}"); pg.wait_for_timeout(2500)
    # 9) Alvida
    alv = js("""()=>{const a=G.map.logueActors&&G.map.logueActors.cast.find(e=>e.id==='logue_alvida');openDialog(a);const b=[...document.querySelectorAll('#dialog button')].find(b=>/Sube Sube|Slip-Slip/.test(b.textContent));const t=b&&b.textContent;if(b)b.click();const m=ARC.alvida;
      if(!m)return {t};m.slickOn=true;m.slick=G.t+99;const h0=m.hp;let slips=0;for(let i=0;i<20;i++){if(hitMob(m,1000)===0)slips++;}const h1=m.hp;m.slickOn=false;m.dizzy=G.t+9;const d=hitMob(m,1000);return {t,slips,h0,h1,dizzyDmg:d}}""")
    pg.wait_for_timeout(300); pg.screenshot(path=str(OUT / 'alvida.png'))
    js("()=>{const m=ARC.alvida;if(m){m.slickOn=false;m.hp=1;hitMob(m,1e7)}}"); pg.wait_for_timeout(900); js("()=>{closeModal()}"); pg.wait_for_timeout(3000); js("()=>{closeModal()}")
    alv2 = js("()=>({n:G.P.arcAlvida,acc:(G.P.inv||[]).some(s=>s&&s.id==='acc_sube')})")
    # 10) Nezumi (Nojiko traída aquí para la prueba)
    js("()=>{const n=spawnNPC('con_nojiko',G.P.x+20,G.P.y-20,'dawn',{});openDialog(n);const b=[...document.querySelectorAll('#dialog button')].find(b=>/Nezumi/.test(b.textContent));if(b)b.click()}"); pg.wait_for_timeout(600)
    nz = js("()=>ARC.nez&&ARC.nez.mobs.length"); pg.screenshot(path=str(OUT / 'nezumi.png'))
    js("()=>{for(const m of ARC.nez.mobs){m.hp=1;hitMob(m,1e7)}}"); pg.wait_for_timeout(900); js("()=>closeModal()"); pg.wait_for_timeout(3000); js("()=>closeModal()"); pg.wait_for_timeout(500)
    nz2 = js("()=>G.P.arcNezumi")
    # 11) Johnny y Yosaku
    js("()=>{const n=spawnNPC('con_johnny',G.P.x-20,G.P.y-20,'dawn',{});openDialog(n);const b=[...document.querySelectorAll('#dialog button')].find(b=>/cazarrecompensas|Bounty/.test(b.textContent));if(b)b.click()}"); pg.wait_for_timeout(400)
    job = js("()=>G.P.jyJob&&{n:G.P.jyJob.n,isle:G.P.jyJob.isle,wp:G.P.wp&&G.P.wp.t}")
    js("()=>{G.P.jyJob.at=[G.P.x>>4,G.P.y>>4]}"); pg.wait_for_timeout(800)
    js("()=>closeModal()"); pg.wait_for_timeout(600); jyb = js("()=>!!ARC.jy"); js("()=>{const m=ARC.jy;if(m){m.hp=1;hitMob(m,1e7)}}"); pg.wait_for_timeout(800); js("()=>closeModal()"); pg.wait_for_timeout(3000); js("()=>closeModal()")
    jy2 = js("()=>({done:G.P.jyDone,job:G.P.jyJob})")
    # 12) Montaña del Revés: al timón cerca de la montaña
    js("""()=>{const P=G.P;P.logueArcN=1;const M=G.map;const [x,y]=dawnPx(RM_AT);let at=null;for(let r=300;r<500&&!at;r+=20)for(let a=0;a<6.28&&!at;a+=0.3){const X=x+Math.cos(a)*r,Y=y+Math.sin(a)*r;if(dawnSurface(M,X,Y,30))at=[X,Y];}
      P.dawnHelm=dawnHelm('skiff',{x:at[0],y:at[1]});P.x=at[0];P.y=at[1];updateCamera(0,true);NV.nextKing=G.t+999;NV.nextPir=G.t+999;NV.nextStorm=G.t+999;ARC.nextWi=G.t+999;}""")
    js("()=>closeModal()"); pg.wait_for_timeout(800); pg.screenshot(path=str(OUT / 'montana.png'))
    rmc = js("()=>[CINE.on,ARC.rm&&ARC.rm.ph]"); js("()=>cineEnd()"); pg.wait_for_timeout(600)
    lab = js("()=>ARC.foes.map(f=>f.k)"); pg.screenshot(path=str(OUT / 'laboon.png'))
    for i in range(30):
        js("()=>{if(!document.querySelector('#modal').hidden)closeModal();const f=ARC.foes.find(f=>f.k==='laboon');if(f){f.x=G.P.x+260;f.y=G.P.y;f.hp=Math.min(f.hp,2);}basicAttack()}"); pg.wait_for_timeout(300)
        if js("()=>!ARC.foes.some(f=>f.k==='laboon')"): break
    js("()=>{if(CINE.on)cineEnd()}"); pg.wait_for_timeout(300)
    rm2 = js("()=>({done:G.P.rmDone,lp:(G.P.inv||[]).some(s=>s&&s.id==='rm_logpose')})")
    # 13) Isla del Barco de Guerra
    js("()=>{closeModal();ARC.nextWi=1}"); pg.wait_for_timeout(600)
    wi = js("()=>!!ARC.wi")
    for i in range(80):
        js("()=>{if(!document.querySelector('#modal').hidden)closeModal();const W=ARC.wi;if(!W)return;W.raft.hp=60;W.next=0;const f=ARC.foes.find(f=>f.k==='wimarina');for(const g of ARC.foes)if(g.k==='wimarina'){g.cd=99;g.hp=Math.min(g.hp,1);g.vx=g.vy=0;}basicAttack()}"); pg.wait_for_timeout(250)
        if i == 6: pg.screenshot(path=str(OUT / 'apis.png'))
        if js("()=>!ARC.wi"): break
    js("()=>{if(CINE.on)cineEnd()}"); pg.wait_for_timeout(300)
    wi2 = js("()=>({done:G.P.wiDone,scale:(G.P.inv||[]).some(s=>s&&s.id==='wi_escama')})")
    out = {'alvida': alv, 'alvida2': alv2, 'nezumi': nz, 'nezumi2': nz2, 'job': job, 'jyBoss': jyb, 'jy2': jy2, 'rmCine': rmc, 'laboon': lab, 'rm2': rm2, 'wi': wi, 'wi2': wi2, 'errors': errs}
    print(json.dumps(out, ensure_ascii=False, indent=1))
    assert alv.get('t') and alv['slips'] >= 8 and alv['dizzyDmg'] > 0 and alv2['n'] == 1 and alv2['acc'] and nz and nz2 and job and jyb and jy2['done'] == 1 and not jy2['job'], out
    assert rmc[0] and 'laboon' in lab and rm2['done'] and rm2['lp'] and wi and wi2['done'] and wi2['scale'] and not errs, out
    print('OK'); b.close()
