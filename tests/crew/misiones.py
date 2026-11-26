"""6.27 · Misiones de la tripulación, ataque combinado, cartel de Sanji y periódico.
Uso: python3 tests/crew/misiones.py file://$PWD/dist/test.html [carpeta_salida]"""
import sys, json, pathlib
from playwright.sync_api import sync_playwright
URL = sys.argv[1]; OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'tests/crew/out'); OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--allow-file-access-from-files']); pg = b.new_page(viewport={'width': 960, 'height': 540}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'hook ' in m.text else None)
    pg.goto(URL); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName', 'Capitana'); pg.click('#ccGo'); pg.wait_for_selector('#introOk:visible', timeout=60000); pg.click('#introOk'); pg.wait_for_timeout(500)
    js = pg.evaluate
    js("""()=>{const P=G.P;P.lv=620;P.bossKills={};P.bossKills[MORGAN_ID]=1;P.bossKills.baratie_krieg=1;P.dawnCrewJoined=1;P.syrupUsopp=1;P.baratieSanji=1;calcStats(P);P.hp=P.S.maxhp;
      P.dawnCrewAshore=null;const M=makeDawn();P.dawnHelm=dawnHelm('skiff',{x:P.x,y:P.y});setMap(M,...dawnPx(LOGUE_MOOR),'up');giveItem('dawn_fruta_diablo',1);G.fading=false;}""")
    pg.wait_for_timeout(800); js("()=>{const P=G.P;P.dawnBoat=null;[P.x,P.y]=dawnPx(LOGUE_MOOR);G.fading=false;XACT.logue_land[2]();}"); pg.wait_for_timeout(1500); js("()=>{const P=G.P;[P.x,P.y]=dawnPx(logueAt(110,200));P.dir='down';updateCamera(0,true)}"); pg.wait_for_timeout(2500)
    # oferta en el diálogo de Zoro (te sigue)
    offer = js("()=>{const z=G.map.rare.crew.find(e=>e&&e.id===SHELLS_CAST_IDS.zoro);openDialog(z);const t=[...document.querySelectorAll('#dialog button')].map(b=>b.textContent);closeDialog();return [t.filter(x=>/Kuina/.test(x)),canOffer('cq_zoro'),canOffer('cq_sanji'),NPCS[SHELLS_CAST_IDS.zoro].quests]}")
    # Zoro: aceptar y cumplir pasos
    C=lambda tag: None
    js("()=>acceptQuest('cq_zoro')"); C('accept')
    wp = js("()=>G.P.wp&&G.P.wp.t")
    js("()=>{ACT.k='mbtrain';ACT.tk='zoro';ACT.score=12;ACT.miss=0;ACT.t=0;mbTrainEnd()}"); C('train')
    js("()=>questEvent('talk',{npc:'logue_ippon'})"); C('talk')
    js("()=>crewDuelStart(SHELLS_CAST_IDS.zoro,null)"); pg.wait_for_timeout(500); js("()=>{const m=CREW_DUEL.m;m.hp=1;hitMob(m,1e7)}"); pg.wait_for_timeout(400); C('duel')
    ready = js("()=>[questReady('cq_zoro'),G.P.quests.active.cq_zoro&&G.P.quests.active.cq_zoro.p]")
    js("()=>{hurtPlayer=function(){};const P=G.P;P.hp=P.S.maxhp;P.dead=false}")
    js("()=>completeQuest('cq_zoro')"); C('done0'); pg.wait_for_timeout(300); C('done1'); combo = js("()=>G.P.crewCombo")
    # combo: barra llena, Zoro cerca, un mob delante
    pg.wait_for_timeout(1500)
    res = js("""()=>{const P=G.P;P.crewComboE=30;const m=spawnMob('dawn_marine',600,P.x+40,P.y,0,null,false);P.target=m;const hp0=m.hp;comboFire();return {hp0,btn:!!document.querySelector('#bCombo')&&!document.querySelector('#bCombo').hidden,e:P.crewComboE,mid:m.mid}}""")
    pg.wait_for_timeout(900); pg.screenshot(path=str(OUT / 'combo.png'))
    after = js("()=>{const m=G.ents.find(e=>e.mid==='dawn_marine'&&e.type==='mob');return m?{hp:m.hp,dying:!!m.dying}:'gone'}")
    # cartel de Sanji
    sanji = js("()=>({met:crewMet(G.P).map(c=>c[1]),bty:(G.P.crewBty||{}).sanji})")
    js("()=>crewPoster('sanji')"); pg.wait_for_timeout(400); pg.screenshot(path=str(OUT / 'cartel_sanji.png')); js("()=>closeModal()")
    # periódico
    js("()=>{G.P.newsDay=-5}"); pg.wait_for_timeout(4200)
    news = js("()=>({day:G.P.newsDay,lines:LUPA_DAWN.find(x=>x[0]==='news627')[2]()})")
    # Nami premio: navegar más rápido
    out = {'offer': offer, 'wp': wp, 'ready': ready, 'combo': combo, 'fire': res, 'after': after, 'sanji': sanji, 'news': news, 'errors': errs}
    print(json.dumps(out, ensure_ascii=False, indent=1))
    assert offer[0] and offer[1] and ready[0] and combo and combo.get('zoro') and res['e'] == 0 and res['btn'] and sanji['bty'] and 'Sanji' in sanji['met'] and news['day'] >= 0 and len(news['lines']) > 3 and not errs, out
    print('OK'); b.close()
