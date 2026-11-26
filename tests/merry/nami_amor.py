"""6.31 · Romance con Nami: Relación ♥, frases propias, abrazo/beso con animaciones, pareja, boda bloqueada en el mar
e hijos con su pelo naranja. Uso: python3 tests/merry/nami_amor.py file://$PWD/dist/test.html [salida]"""
import sys, json, pathlib
from playwright.sync_api import sync_playwright
URL = sys.argv[1]; OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'tests/merry/out'); OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--allow-file-access-from-files']); pg = b.new_page(viewport={'width': 960, 'height': 540}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'hook ' in m.text else None)
    pg.goto(URL); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_selector('#ccName', timeout=30000); pg.fill('#ccName', 'Amor'); pg.click('#ccGo'); pg.wait_for_selector('#introOk:visible', timeout=60000); pg.click('#introOk'); pg.wait_for_timeout(500)
    js = pg.evaluate
    js("""()=>{const P=G.P;P.lv=640;calcStats(P);P.dawnCrewJoined=1;P.syrupUsopp=1;P.baratieSanji=1;giveItem('dawn_fruta_diablo',1);
      const M=makeDawn();let at=null;for(let r=60;r<900&&!at;r+=20)for(let a=0;a<6.28&&!at;a+=0.4){const X=dawnPx(SHIMO_MOOR)[0]+Math.cos(a)*r,Y=dawnPx(SHIMO_MOOR)[1]+60+Math.sin(a)*r;if(dawnSurface(M,X,Y,60))at=[X,Y];}
      P.dawnHelm=dawnHelm('skiff',{x:at[0],y:at[1]});setMap(M,at[0],at[1],'right');G.fading=false;hurtPlayer=function(){};MR.nextLand=G.t+9999;MR.nextSea=G.t+9999;NV.nextKing=G.t+9999;NV.nextPir=G.t+9999;NV.nextStorm=G.t+9999;}""")
    pg.wait_for_timeout(1200); js("()=>{if(!document.querySelector('#modal').hidden)closeModal()}")
    js("()=>mbGoDown()"); pg.wait_for_timeout(1800)
    nami = js("()=>{const n=(G.map.mbCrew||[]).find(e=>e.id===ORANGE_NAMI);G.P.x=n.x-20;G.P.y=n.y;openDialog(n);return !!n}")
    pg.wait_for_timeout(500)
    rel_opt = js("()=>{const b=[...document.querySelectorAll('#dopts .dopt')].find(b=>/Relación/.test(b.textContent));if(b){b.click();return 1}return 0}"); pg.wait_for_timeout(400)
    js("()=>{const b=[...document.querySelectorAll('#dopts .dopt')].find(b=>/Charlar con cariño/.test(b.textContent));b&&b.click()}"); pg.wait_for_timeout(1500)
    talk = js("()=>document.querySelector('#dmsg').textContent"); pg.screenshot(path=str(OUT / 'nami_relacion.png'))
    js("()=>{const R=rel(ORANGE_NAMI);R.t=900;R.a=950;giveItem('colgante_amor',1);const n=G.map.mbCrew.find(e=>e.id===ORANGE_NAMI);romanceMenu(n)}"); pg.wait_for_timeout(300)
    js("()=>{const b=[...document.querySelectorAll('#dopts .dopt')].find(b=>/Dar un beso/.test(b.textContent));b&&b.click()}"); pg.wait_for_timeout(900)
    kiss = js("()=>SCENE&&{kind:SCENE.kind,anim:SCENE.e.anim,hug:SCENE.e.atlas&&SCENE.e.atlas.idx&&SCENE.e.atlas.idx.kiss!==undefined}"); pg.screenshot(path=str(OUT / 'nami_beso.png'))
    pg.wait_for_timeout(2600)
    js("()=>{const n=G.map.mbCrew.find(e=>e.id===ORANGE_NAMI);openDialog(n);romanceMenu(n);const b=[...document.querySelectorAll('#dopts .dopt')].find(b=>/Pedir ser tu pareja/.test(b.textContent));b&&b.click()}"); pg.wait_for_timeout(3500)
    partner = js("()=>G.P.partner")
    walk = js("()=>{const n=G.map.mbCrew.find(e=>e.id===ORANGE_NAMI);startComp(n,true);return !!COMP}")
    wed = js("()=>{giveItem('anillo_boda',1);const n=G.map.mbCrew.find(e=>e.id===ORANGE_NAMI);startWedding(n,TOWNS[0]);return {wed:!!WED,ring:countItem('anillo_boda')}}")
    kid = js("()=>{const a=partnerApp(ORANGE_NAMI);return a}")
    mix = js("()=>{const out=mixApps('f',6);return out.map(a=>[a.hair,a.hair2||''])}")
    lupa = js("()=>{const e=LUPA_DAWN.find(e=>e[0]==='nami631');return e&&e[2]().length}")
    out = {'nami': nami, 'rel': rel_opt, 'talk': talk, 'kiss': kiss, 'partner': partner, 'walk': walk, 'wed': wed, 'kid': kid, 'mix': mix, 'lupa': lupa, 'errors': errs}
    print(json.dumps(out, ensure_ascii=False, indent=1))
    assert nami and rel_opt and kiss and kiss['kind'] == 'kiss' and kiss['hug'] and partner == 'orange_nami' and not walk and not wed['wed'] and wed['ring'] == 1, out
    assert kid['hair'] == 'naranja' and any('naranja' in (h, h2) for h, h2 in mix) and lupa and not errs, out
    print('OK'); b.close()
