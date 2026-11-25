"""6.18 · Smoker con logia, su botín con pity (ropa, Jitte, Fruta Humo Humo) y las 4 técnicas de la fruta.
Uso: python3 tests/loguetown/smoker618.py file://$PWD/dist/test.html [carpeta_salida]"""
import sys, json, pathlib
from playwright.sync_api import sync_playwright
URL = sys.argv[1]; OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'tests/loguetown/out'); OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--allow-file-access-from-files']); page = b.new_page(viewport={'width': 960, 'height': 540})
    errs = []; page.on('pageerror', lambda e: errs.append(str(e)))
    page.on('console', lambda m: errs.append(m.text) if m.type == 'error' and ('hook ' in m.text or 'fit:' in m.text) else None)
    page.goto(URL); page.wait_for_timeout(2500)
    page.click('#tNew'); page.wait_for_timeout(400); page.fill('#ccName', 'Ventisca'); page.click('#ccGo'); page.wait_for_timeout(1500); page.click('#introOk'); page.wait_for_timeout(500)
    js = page.evaluate
    def shot(n, wait=0):
        if wait: page.wait_for_timeout(wait)
        js("()=>{const t=document.querySelector('#toasts');if(t)t.innerHTML='';}"); page.screenshot(path=str(OUT / f'{n}.png'))
    def heal(): js("()=>{if(!window._hpOrig){window._hpOrig=hurtPlayer;}const P=G.P;P.hp=P.S.maxhp;P.mp=P.S.maxmp||P.mp;P.dead=false;if(!document.querySelector('#modal').hidden)closeModal();}")
    js("""()=>{const P=G.P;P.lv=620;P.bossKills=P.bossKills||{};P.bossKills[MORGAN_ID]=1;P.dawnCrewJoined=1;P.syrupUsopp=1;P.baratieSanji=1;P.logueRoger=1;P.dawnCrewAshore=0;calcStats(P);P.hp=P.S.maxhp;
      const M=makeDawn();P.dawnHelm=dawnHelm('skiff',{x:P.x,y:P.y});setMap(M,...dawnPx(LOGUE_MOOR),'up');G.fading=false;giveItem('dawn_fruta_diablo',1);}""")
    page.wait_for_timeout(800)
    js("()=>{const P=G.P;P.dawnBoat=null;[P.x,P.y]=dawnPx(LOGUE_MOOR);G.fading=false;XACT.logue_land[2]();}"); page.wait_for_timeout(1500)
    js("()=>{const P=G.P;[P.x,P.y]=dawnPx(logueAt(104,140));P.dir='down';updateCamera(0,true);}"); page.wait_for_timeout(800)
    info = js("""()=>({jitte:[ITEMS.w_sm_jitte.lv,ITEMS.w_sm_jitte.atk,Math.max(...Object.values(ITEMS).filter(i=>i.t==='weapon'&&i.id!=='w_sm_jitte').map(i=>i.atk))],
      cos:['c_sm_chaqueta','c_sm_vaquero','c_sm_botas'].every(k=>COSM[k]&&ITEMS['cosi_'+k]),fruit:!!(DFR.moku&&ITEMS.df_moku&&DFS.moku.length===5),
      icon:[genIcon(['df_moku']).w,genIcon(['sm_jitte']).w],boss:[BOSSES.logue_arc_smoker.hp,BOSSES.logue_arc_smoker.atk,DAWN_RETO.logue_arc_smoker]})""")
    # ropa puesta y Jitte en la mano
    js("""()=>{const P=G.P;for(const k of ['c_sm_chaqueta','c_sm_vaquero','c_sm_botas'])giveCosmetic(k,true);P.cos=P.cos||{};P.cos.body='c_sm_chaqueta';P.cos.legs='c_sm_vaquero';P.cos.feet='c_sm_botas';
      giveItem('w_sm_jitte',1,true);const i=P.inv.findIndex(s=>s&&s.id==='w_sm_jitte');P.equip.weapon=P.inv[i];P.inv[i]=null;calcStats(P);P.hp=P.S.maxhp;if(typeof refreshLook==='function')refreshLook();else if(typeof rebuildPlayerAtlas==='function')rebuildPlayerAtlas();}""")
    page.wait_for_timeout(600)
    looks = js("()=>{const g=gearTiers(G.P);return {jit:g.jit,top:heroLook(G.P.cls,G.P.app,g,G.P.cos).top.k,wk:heroLook(G.P.cls,G.P.app,g,G.P.cos).weapon.k}}")
    # golpes con el Jitte contra un monstruo
    js("()=>{const P=G.P,m=spawnMob('dawn_marine',600,P.x,P.y+30,0,null,false);m.hp=m.maxhp=1e9;m.atk=0;m.spd=0;m.aggroT=0;window._tm=m;window._dmg=0;const oh=hitMob;hitMob=function(t,b){if(t===window._tm)window._dmg+=b;return oh.apply(this,arguments);};P.dir='down';window._hp0=hurtPlayer;hurtPlayer=function(){};}")
    hp0 = 0
    for i in range(4):
        js("()=>{G.P.atkCd=0;G.P.busy=0;basicAttack();}"); page.wait_for_timeout(170)
        if i == 3: shot('jitte_piedra_marina', 0)
        if i == 1: shot('jitte_golpe', 0)
        page.wait_for_timeout(250); heal()
    hp1 = -js("()=>window._dmg")
    # la fruta y sus 4 técnicas
    js("()=>{const P=G.P;P.fruit='moku';for(const id of DFS.moku)P.skills[id]=5;}")
    fr = {}
    for sid in ['moku_puno', 'moku_serpiente', 'moku_lanzador', 'moku_impulso', 'moku_logia']:
        js("()=>{const P=G.P,m=window._tm;[P.x,P.y]=[m.x,m.y-40];P.dir='down';P.busy=0;}")
        h0 = js("()=>window._dmg"); js(f"()=>dfCast('{sid}')"); page.wait_for_timeout({'moku_puno': 300, 'moku_serpiente': 600, 'moku_lanzador': 150, 'moku_impulso': 700, 'moku_logia': 600}[sid])
        shot('humo_' + sid.split('_')[1], 0); page.wait_for_timeout(900); heal()
        fr[sid] = js("()=>window._dmg") - h0
    # impulso caminando (muestra de las piernas de humo y la estela)
    js("()=>{const P=G.P,m=window._tm;[P.x,P.y]=[m.x-120,m.y+60];P.mokuUntil=0;P.mokuJetUntil=0;P.busy=0;P._mkTrail=[];dfCast('moku_impulso');updateCamera(0,true);}")
    page.keyboard.down('ArrowRight'); page.wait_for_timeout(900); shot('humo_impulso_andando'); page.keyboard.up('ArrowRight')
    js("()=>{const P=G.P;P.mokuJetUntil=0;dfCast('moku_logia');}"); page.wait_for_timeout(500); shot('humo_cuerpo')
    logia = js("""()=>{hurtPlayer=window._hp0;const P=G.P;const h=P.hp;hurtPlayer(5000,{dfPhysical:1,lv:600});const a=P.hp===h;hurtPlayer(5000,{lv:600});return {active:mokuLogia(P),dispersed:a,other:P.hp<h};}""")
    js("()=>{window._tm.remove=true;}"); heal()
    # pestaña de frutas
    js("()=>{openPanel&&openPanel('frutas')}"); page.wait_for_timeout(500)
    tab = js("()=>{const t=(document.querySelector('#panel')||{}).innerText||'';return /Humo Humo|Smoke-Smoke/.test(t)}")
    shot('frutas_tab'); js("()=>{try{closePanel()}catch(e){}}")
    # Smoker con logia y su botín
    js("()=>{const P=G.P;P.fruit=null;[P.x,P.y]=dawnPx(logueAt(104,124));updateCamera(0,true);}"); page.wait_for_timeout(800)
    js("()=>{const l=G.map.logueLife.find(e=>e.id==='logue_c_luffy');openDialog(l);const b=[...document.querySelectorAll('button')].find(b=>/Arco de Loguetown|Loguetown arc/.test(b.textContent));b.click();}")
    for i in range(20):
        page.wait_for_timeout(500); heal(); js("()=>{hurtPlayer=function(){}}")
        if js("()=>!!(G.map.logueArc&&G.map.logueArc.boss)"): break
    bar = js("()=>(document.querySelector('#bossbar .bdrops')||{}).textContent||''")
    js("()=>{const m=G.map.logueArc.boss;m.hp=Math.round(m.maxhp*0.6);}"); page.wait_for_timeout(700); heal()
    sl = js("()=>{const m=G.map.logueArc.boss,h=m.hp;hitMob(m,1e6,{});return {on:smLogiaOn(m),same:m.hp===h}}")
    js("()=>{const P=G.P,m=G.map.logueArc.boss;P.x=m.x+30;P.y=m.y+30;updateCamera(0,true);}"); shot('smoker_logia', 900)
    js("()=>{const P=G.P;P.smPity={};Math.random=()=>0;const m=G.map.logueArc.boss;m.smLogiaUntil=0;m.hp=1;killMob(m);}"); page.wait_for_timeout(3600); heal()
    loot = js("()=>{const P=G.P;return {jit:countItem('w_sm_jitte'),fruit:countItem('df_moku'),cos:['c_sm_chaqueta','c_sm_vaquero','c_sm_botas'].map(k=>(P.wardrobe||[]).includes(k))}}")
    out = {'info': info, 'looks': looks, 'jitteDmg': hp0 - hp1, 'fruit': fr, 'logia': logia, 'tab': tab, 'bossBar': bar, 'smokerLogia': sl, 'loot': loot, 'errors': errs}
    print(json.dumps(out, ensure_ascii=False, indent=1))
    assert info['jitte'][1] > info['jitte'][2] and info['cos'] and info['fruit'] and looks['jit'] == 1 and looks['wk'] == 'sm_jitte' and looks['top'] == 'sm_chaqueta'
    assert hp0 - hp1 > 0 and all(v > 0 for k, v in fr.items() if k not in ('moku_logia', 'moku_impulso')) and logia['active'] and logia['dispersed'] and logia['other']
    assert tab and bar and sl['on'] and sl['same'] and loot['fruit'] == 1 and all(loot['cos']) and not errs, out
    b.close()
