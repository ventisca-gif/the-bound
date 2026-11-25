"""6.17 · Arco de Loguetown: ciudad viva, armería por dentro (Ipponmatsu, Zoro, Tashigi), Smoker contra Luffy,
patíbulo con Buggy, horda de 2 minutos, rayo y Dragon. Repetible.
Uso: python3 tests/loguetown/arc.py file://$PWD/dist/test.html [carpeta_salida]"""
import sys, json, pathlib
from playwright.sync_api import sync_playwright
URL = sys.argv[1]; OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'tests/loguetown/out'); OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--allow-file-access-from-files']); page = b.new_page(viewport={'width': 960, 'height': 540})
    errs = []; page.on('pageerror', lambda e: errs.append(str(e)))
    page.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'hook ' in m.text else None)
    page.goto(URL); page.wait_for_timeout(2500)
    page.click('#tNew'); page.wait_for_timeout(400); page.fill('#ccName', 'Ventisca'); page.click('#ccGo'); page.wait_for_timeout(1500); page.click('#introOk'); page.wait_for_timeout(500)
    js = page.evaluate
    def shot(n, wait=0):
        if wait: page.wait_for_timeout(wait)
        js("()=>{const t=document.querySelector('#toasts');if(t)t.innerHTML='';}")
        page.screenshot(path=str(OUT / f'{n}.png'))
    def heal(): js("()=>{if(!window._hpOrig){window._hpOrig=hurtPlayer;hurtPlayer=function(){};}}"); js("()=>{const P=G.P;P.hp=P.S.maxhp;P.dead=false;if(!document.querySelector('#modal').hidden&&!(G.map.logueArc===null&&G.P.logueArcN))closeModal();}")
    js("""()=>{const P=G.P;P.lv=620;P.bossKills=P.bossKills||{};P.bossKills[MORGAN_ID]=1;P.dawnCrewJoined=1;P.syrupUsopp=1;P.baratieSanji=1;P.logueRoger=1;P.dawnCrewAshore=0;calcStats(P);P.hp=P.S.maxhp;
      const M=makeDawn();P.dawnHelm=dawnHelm('skiff',{x:P.x,y:P.y});setMap(M,...dawnPx(LOGUE_MOOR),'up');G.fading=false;giveItem('dawn_fruta_diablo',1);}""")
    page.wait_for_timeout(800)
    js("()=>{const P=G.P;P.dawnBoat=null;[P.x,P.y]=dawnPx(LOGUE_MOOR);G.fading=false;XACT.logue_land[2]();}"); page.wait_for_timeout(1500)
    js("()=>{const P=G.P;[P.x,P.y]=dawnPx(logueAt(104,221));P.dir='down';updateCamera(0,true);}"); page.wait_for_timeout(1500)
    life = js("""()=>{const M=G.map,bad=[];for(const e of M.logueLife||[]){const [x,y]=[e.home.x>>4,e.home.y>>4],i=M.I(x,y);if(M.ter[i]===T.DEEP||M.ter[i]===T.WATER||SOLID_T[M.ter[i]]||M.solidO[i])bad.push(e.id);}
      return {n:(M.logueLife||[]).length,bad,ids:(M.logueLife||[]).map(e=>e.id)};}""")
    shot('ciudad_muelle', 300)
    js("()=>{const P=G.P;[P.x,P.y]=dawnPx(logueAt(128,165));updateCamera(0,true);}"); shot('ciudad_mercado', 1500)
    # armería
    js("()=>{const P=G.P;[P.x,P.y]=dawnPx(logueAt(76,158));P.dir='up';updateCamera(0,true);}"); page.wait_for_timeout(600)
    door = js("()=>{const o=G.map.objs.find(o=>o.xact==='logue_shop_in');return !!o}")
    shot('armeria_puerta')
    js("()=>XACT.logue_shop_in[2]()"); page.wait_for_timeout(1500)
    shop = js("()=>({map:G.map.id,cast:G.map.lgScene&&G.map.lgScene.cast.map(e=>e.id)})")
    js("()=>{const P=G.P;P.x=13*16;P.y=11*16;updateCamera(0,true);}")
    shot('armeria_1', 1500)
    js("()=>{G.map.lgScene.t-=10.5}"); shot('armeria_kitetsu', 1300)
    js("()=>{G.map.lgScene.t-=3.6}"); shot('armeria_tashigi', 600)
    js("()=>XACT.logue_shop_out[2]()"); page.wait_for_timeout(1500)
    back = js("()=>[G.map.id,!!G.map.logue,logueActive(G.P,G.map),G.P.x>>4,G.P.y>>4,!!G.map.logueLife,G.P.dawnHelm,G.P.dawnBoat]"); print("BACK",back,life,shop)
    # arco
    js("()=>{const P=G.P;[P.x,P.y]=dawnPx(logueAt(104,124));updateCamera(0,true);}"); page.wait_for_timeout(1200)
    js("()=>{const l=G.map.logueLife.find(e=>e.id==='logue_c_luffy');openDialog(l);}"); page.wait_for_timeout(300)
    opt = js("()=>{const b=[...document.querySelectorAll('button')].find(b=>/Arco de Loguetown|Loguetown arc/.test(b.textContent));const t=b&&b.textContent;if(b)b.click();return t;}")
    page.wait_for_timeout(1800); heal(); shot('arco_1_encuentro', 1200)
    page.wait_for_timeout(5200); heal()
    st = js("()=>{const A=G.map.logueArc;return A&&{phase:A.phase,boss:!!A.boss}}")
    print("ST", st, opt, js("()=>[G.P.dead,G.P.hp,!!G.map.logueArc,G.map.id]")); page.wait_for_timeout(2500); heal(); shot("arco_2_pelea_smoker"); print("ST2", js("()=>[G.P.dead,G.P.hp,!!G.map.logueArc,G.map.id,G.P.x>>4,G.P.y>>4]"))
    js("()=>{const m=G.map.logueArc.boss;m.hp=1;killMob(m);}"); page.wait_for_timeout(2500); heal(); shot('arco_3_humo')
    page.wait_for_timeout(3500); heal(); shot('arco_4_patibulo')
    page.wait_for_timeout(3500); heal(); shot('arco_5_lo_siento')
    page.wait_for_timeout(3000); heal()
    horde = js("()=>{const A=G.map.logueArc;return A&&{phase:A.phase,crew:A.crew.map(e=>e.id)}}")
    for i in range(4): page.wait_for_timeout(1500); heal()
    shot('arco_6_horda')
    hf = js("()=>{const A=G.map.logueArc;return {foes:A.foes.length,timer:document.getElementById('logueTimer')&&document.getElementById('logueTimer').textContent}}")
    js("()=>{G.map.logueArc.t-=113}")
    for i in range(160):
        if js("()=>!!(G.map.logueArc&&G.map.logueArc.phase==='dragon')"): break
        page.wait_for_timeout(100); heal()
    dragon_phase = js("()=>G.map.logueArc&&G.map.logueArc.phase")
    page.wait_for_timeout(2600); shot('arco_6b_ultimas_palabras')
    for i in range(60):
        if js("()=>!!(G.map.logueArc&&G.map.logueArc.dragon)"): break
        page.wait_for_timeout(50)
    page.wait_for_timeout(60); shot('arco_7_rayo')
    page.wait_for_timeout(450); shot('arco_7_dragon')
    page.wait_for_timeout(1500); shot('arco_8_libre')
    page.wait_for_timeout(4000)
    end = js("()=>({n:G.P.logueArcN,arc:!!G.map.logueArc,modal:!document.querySelector('#modal').hidden,life:(G.map.logueLife||[]).filter(e=>!e.remove).length})")
    shot('arco_9_final')
    js("()=>closeModal()")
    again = js("()=>{const l=G.map.logueLife.find(e=>e.id==='logue_c_luffy');openDialog(l);const b=[...document.querySelectorAll('button')].find(b=>/Arco de Loguetown|Loguetown arc/.test(b.textContent));const t=b&&b.textContent;closeDialog();return t;}")
    out = {'life': life, 'door': door, 'shop': shop, 'back': back, 'opt': opt, 'fight': st, 'horde': horde, 'hordeState': hf, 'dragonPhase': dragon_phase, 'end': end, 'again': again, 'errors': errs}
    print(json.dumps(out, ensure_ascii=False, indent=1))
    assert not life['bad'] and door and shop['map'] == 'logue_armeria' and back[1] and opt and st['phase'] == 'fight' and horde and horde['phase'] == 'horde' and end['n'] == 1 and not end['arc'] and again and not errs, out
    b.close()
