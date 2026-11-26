"""6.31 · Vida a bordo del Going Merry (pesca en la popa, historias de Usopp, banquete, mapas de Nami, Den Den Mushi),
día/tarde/noche del Mar de Dawn y el mapa que cabe entero. Uso: python3 tests/merry/abordo.py file://$PWD/dist/test.html [salida]"""
import sys, json, pathlib
from playwright.sync_api import sync_playwright
URL = sys.argv[1]; OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'tests/merry/out'); OUT.mkdir(parents=True, exist_ok=True)
CLOSE = "()=>{if(!document.querySelector('#modal').hidden)closeModal()}"
with sync_playwright() as p:
    b = p.chromium.launch(args=['--allow-file-access-from-files']); pg = b.new_page(viewport={'width': 960, 'height': 540}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'hook ' in m.text else None)
    pg.goto(URL); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_selector('#ccName', timeout=30000); pg.fill('#ccName', 'Merry'); pg.click('#ccGo'); pg.wait_for_selector('#introOk:visible', timeout=60000); pg.click('#introOk'); pg.wait_for_timeout(500)
    js = pg.evaluate
    js("""()=>{const P=G.P;P.lv=640;calcStats(P);P.dawnCrewJoined=1;P.syrupUsopp=1;P.baratieSanji=1;P.bossKills={dawn_alvida:1,orange_buggy:1};P.bossKills[MORGAN_ID]=1;giveItem('dawn_fruta_diablo',1);
      const M=makeDawn();let at=null;for(let r=60;r<900&&!at;r+=20)for(let a=0;a<6.28&&!at;a+=0.4){const X=dawnPx(SHIMO_MOOR)[0]+Math.cos(a)*r,Y=dawnPx(SHIMO_MOOR)[1]+60+Math.sin(a)*r;if(dawnSurface(M,X,Y,60))at=[X,Y];}
      P.dawnHelm=dawnHelm('skiff',{x:at[0],y:at[1]});setMap(M,at[0],at[1],'right');G.fading=false;G.time=11*60;hurtPlayer=function(){};MR.nextLand=G.t+9999;MR.nextSea=G.t+9999;NV.nextKing=G.t+9999;NV.nextPir=G.t+9999;NV.nextStorm=G.t+9999;ARC.nextWi=G.t+9999;}""")
    pg.wait_for_timeout(1500); js(CLOSE)
    menu = js("()=>{dawnTalkAboard();return [...document.querySelectorAll('#modal button')].map(b=>b.textContent)}")
    pg.screenshot(path=str(OUT / 'menu_barco.png')); js(CLOSE)
    # 11 pesca
    js("()=>mpStart()"); pg.wait_for_timeout(600)
    for i in range(6):
        js("()=>{ACT.t=G.t-0.01}"); pg.wait_for_timeout(250)
        if i == 2: pg.screenshot(path=str(OUT / 'pesca_popa.png'))
        js("()=>{if(ACT.k==='mpesca'&&ACT.ph==='bite')mpAtk()}"); pg.wait_for_timeout(250)
    pg.wait_for_timeout(500); pesca = js("()=>({act:ACT.k,n:G.P.mpescaN})"); js(CLOSE)
    # 10 Usopp
    js("()=>usoppStory(0)"); pg.wait_for_timeout(1500); js("()=>document.querySelector('#dmsg').click()"); pg.wait_for_timeout(300)
    pg.screenshot(path=str(OUT / 'usopp.png'))
    g0 = js("()=>G.P.gold"); js("()=>{const b=[...document.querySelectorAll('#dopts .dopt')];b[usoppStory.last!==undefined&&USOPP_TALES[usoppStory.last][0]===1?0:1].click()}"); pg.wait_for_timeout(500)
    usopp = js("()=>({gold:G.P.gold,day:G.P.usoppDay})"); js("()=>closeDialog()")
    # 14 Den Den Mushi (Gaimon / ir a un sitio)
    js("()=>{ddmOpen.last='x';const r=Math.random;Math.random=()=>4/7+0.01;ddmOpen();Math.random=r}"); pg.wait_for_timeout(400); pg.screenshot(path=str(OUT / 'den_den_mushi.png'))
    js("()=>{const b=[...document.querySelectorAll('#modal button')].find(b=>/Aceptar|Accept/.test(b.textContent));b&&b.click()}"); pg.wait_for_timeout(300)
    ddm = js("()=>G.P.ddm&&G.P.ddm.k"); js("()=>{const C=ddmCall(G.P.ddm.k);const [x,y]=C[5]();G.P.x=x*16;G.P.y=y*16}"); pg.wait_for_timeout(1800)
    ddm2 = js("()=>({left:!!G.P.ddm,n:G.P.ddmN})"); js(CLOSE)
    # 12 banquete (bajo cubierta)
    js("()=>{const P=G.P;let at=null;const M=G.map;for(let r=60;r<900&&!at;r+=20)for(let a=0;a<6.28&&!at;a+=0.4){const X=dawnPx(SHIMO_MOOR)[0]+Math.cos(a)*r,Y=dawnPx(SHIMO_MOOR)[1]+60+Math.sin(a)*r;if(dawnSurface(M,X,Y,60))at=[X,Y];}[P.x,P.y]=at;P.feastReady=1;feastGo()}"); pg.wait_for_timeout(3500)
    pg.screenshot(path=str(OUT / 'banquete.png')); feast = js("()=>({map:G.map.id,act:ACT.k,crew:(ACT.crew||[]).length})")
    js("()=>{for(let i=0;i<3;i++)ACT.onAtk&&ACT.onAtk();ACT.end=G.t}"); pg.wait_for_timeout(800)
    feast2 = js("()=>({act:ACT.k,ready:G.P.feastReady,meal:mbMealOn()})"); js(CLOSE); js("()=>mbGoUp()"); pg.wait_for_timeout(1500)
    # 13 mapas de Nami: Shimotsuki a pie
    js("()=>{const P=G.P;P.shimoIntro=1;P.dawnHelm=null;P.dawnBoat={x:P.x,y:P.y,h:{kind:'skiff'},shimo:true};}")
    pts = js("()=>namiPoints(G.map,NAMI_ISLES.find(i=>i[0]==='shimo')).map(q=>[q.x,q.y])")
    for q in pts:
        js("([x,y])=>{closeDialog();if(!document.querySelector('#modal').hidden)closeModal();G.P.x=x*16+8;G.P.y=y*16+8+16}", q); pg.wait_for_timeout(1150)
    nami = js("()=>({done:(G.P.namiDone||{}).shimo,got:((G.P.namiMap||{}).shimo||[]).length})")
    # noche
    js("()=>{G.time=22*60;[G.P.x,G.P.y]=dawnPx(shimoAt(100,120))}"); pg.wait_for_timeout(1200); js(CLOSE); pg.wait_for_timeout(300)
    dark = js("()=>darkness()"); pg.screenshot(path=str(OUT / 'noche_shimotsuki.png'))
    js("()=>{G.time=17.2*60}"); pg.wait_for_timeout(500); pg.screenshot(path=str(OUT / 'tarde_shimotsuki.png'))
    # mapa del Mar de Dawn: cabe entero
    js("()=>openPanel('map')"); pg.wait_for_timeout(1000)
    mapa = js("()=>{const s=document.querySelector('#wmScroll'),c=document.querySelector('#wm');return {fits:c.getBoundingClientRect().height<=s.clientHeight+1,ta:s.style.touchAction}}")
    pg.screenshot(path=str(OUT / 'mapa_dawn.png'))
    lupa = js("()=>{const e=LUPA_DAWN.find(e=>e[0]==='merry631');return e&&e[2]().length}")
    out = {'menu': menu, 'pesca': pesca, 'usopp': usopp, 'ddm': ddm, 'ddm2': ddm2, 'feast': feast, 'feast2': feast2, 'pts': len(pts), 'nami': nami, 'dark': dark, 'mapa': mapa, 'lupa': lupa, 'errors': errs}
    print(json.dumps(out, ensure_ascii=False, indent=1))
    assert any('Pescar' in m for m in menu) and any('Den Den' in m for m in menu) and any('Usopp' in m for m in menu) and any('Nami' in m for m in menu), out
    assert pesca['act'] is None and pesca['n'] and pesca['n'] >= 1, out
    assert usopp['day'] and usopp['day']['n'] == 1 and ddm == 'gaimon' and not ddm2['left'] and ddm2['n'] == 1, out
    assert feast['map'] == 'merry_bajo' and feast['act'] == 'feast' and feast['crew'] >= 4 and feast2['act'] is None and feast2['ready'] == 0 and feast2['meal'], out
    assert len(pts) >= 3 and nami['done'] == 1 and dark > 0.5 and mapa['fits'] and mapa['ta'] == 'none' and lupa and not errs, out
    print('OK'); b.close()
