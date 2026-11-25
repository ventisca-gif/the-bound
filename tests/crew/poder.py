"""6.20 · Poder de la tripulación (sube con cada batalla y arco, también repetidos) y duelos al hablarles.
Uso: python3 tests/crew/poder.py file://$PWD/dist/test.html [carpeta_salida]"""
import sys, json, pathlib
from playwright.sync_api import sync_playwright
URL = sys.argv[1]; OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'tests/crew/out'); OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--allow-file-access-from-files']); page = b.new_page(viewport={'width': 960, 'height': 540})
    errs = []; page.on('pageerror', lambda e: errs.append(str(e)))
    page.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'hook ' in m.text else None)
    page.goto(URL); page.wait_for_timeout(2500)
    page.click('#tNew'); page.wait_for_timeout(400); page.fill('#ccName', 'Ventisca'); page.click('#ccGo'); page.wait_for_timeout(1500); page.click('#introOk'); page.wait_for_timeout(500)
    js = page.evaluate
    def shot(n, wait=0):
        if wait: page.wait_for_timeout(wait)
        page.screenshot(path=str(OUT / f'{n}.png'))
    js("""()=>{const P=G.P;P.lv=620;P.bossKills=P.bossKills||{};P.bossKills[MORGAN_ID]=1;P.dawnCrewJoined=1;P.syrupUsopp=1;P.baratieSanji=1;P.logueRoger=1;P.dawnCrewAshore=null;
      const best=(pred,L,score)=>Object.values(ITEMS).filter(i=>pred(i)&&(i.lv||0)<=L).sort((a,b)=>score(b)-score(a))[0],cls=P.cls,L=620;
      const C=CLASSES[cls];for(const k in C.base)P.attr[k]=Math.floor(C.base[k]+C.grow[k]*(L-1));P.attr[C.main]+=3*(L-1);
      const w=best(i=>i.slot==='weapon'&&i.cls===cls&&!i.leg&&!i.anc,L,i=>i.atk||0);if(w)P.equip.weapon={id:w.id,up:7};
      for(const s of ['head','body','legs','feet']){const a=best(i=>i.slot===s&&i.t==='armor',L,i=>(i.def||0)+(i.hpB||0)/10);if(a)P.equip[s]={id:a.id,up:7};}
      for(const s of ['acc','neck']){const a=best(i=>i.slot===s&&(!i.cls||i.cls===cls),L,i=>(i.atk||0)*2+(i.def||0)*1.5+(i.hpB||0)/10);if(a)P.equip[s]={id:a.id};}
      calcStats(P);P.hp=P.S.maxhp;
      const M=makeDawn();P.dawnHelm=dawnHelm('skiff',{x:P.x,y:P.y});setMap(M,...dawnPx(LOGUE_MOOR),'up');G.fading=false;giveItem('dawn_fruta_diablo',1);}""")
    page.wait_for_timeout(800)
    js("()=>{const P=G.P;P.dawnBoat=null;[P.x,P.y]=dawnPx(LOGUE_MOOR);G.fading=false;XACT.logue_land[2]();}"); page.wait_for_timeout(1500)
    js("()=>{const P=G.P;[P.x,P.y]=dawnPx(logueAt(110,200));P.dir='down';updateCamera(0,true);}"); page.wait_for_timeout(2500)
    # 1) poder: sin batallas, con 1 arco, con el arco repetido y con todos
    grow = js("""()=>{const P=G.P,id=SHELLS_CAST_IDS.zoro,r=[];const snap=()=>{const s=syrupCrewStats(P,id,605);return [Math.round(crewPowerInfo(P).bonus*100),s.hp,s.def,+s.boost.toFixed(3),crewPowerNum(P,id)]};
      P.bossKills={};r.push(snap());P.bossKills[MORGAN_ID]=1;r.push(snap());P.bossKills[MORGAN_ID]=2;r.push(snap());
      for(const k of CREW_POW_BOSSES)P.bossKills[k]=1;r.push(snap());P.logueArcN=1;r.push(snap());
      for(const k of CREW_POW_BOSSES)P.bossKills[k]=3;P.logueArcN=3;r.push(snap());for(const k of CREW_POW_BOSSES)P.bossKills[k]=50;P.logueArcN=50;r.push(snap());
      for(const k of CREW_POW_BOSSES)P.bossKills[k]=1;P.logueArcN=1;return r;}""")
    print('GROW [bonus%, hp, def, boost, poder]', grow)
    # 2) opción al hablar con un tripulante que te sigue
    page.wait_for_timeout(800)
    fol = js("()=>{const S=G.map.rare;return S&&S.crew?S.crew.filter(Boolean).map(e=>e.id):null}")
    opts = js("""()=>{const e=G.map.rare.crew.find(e=>e&&e.id===SHELLS_CAST_IDS.zoro);openDialog(e);return [...document.querySelectorAll('#dialog button')].map(b=>b.textContent).filter(t=>/Desafiar|Challenge|Poder|Power/i.test(t));}""")
    shot('1_opciones', 300)
    js("()=>{const b=[...document.querySelectorAll('#dialog button')].find(b=>/Poder de la tripulación|Crew power/.test(b.textContent));b&&b.click()}"); shot('2_hoja', 500)
    js("()=>closeModal()")
    js("()=>{G.P.hp=G.P.S.maxhp}")
    js("()=>{const e=G.map.rare.crew.find(e=>e&&e.id===SHELLS_CAST_IDS.zoro);openDialog(e);const b=[...document.querySelectorAll('#dialog button')].find(b=>/Desafiar|Challenge/.test(b.textContent));b.click()}")
    page.wait_for_timeout(1200)
    duel = js("()=>{const R=CREW_DUEL;return R&&{id:R.id,lv:R.m.lv,hp:R.m.maxhp,atk:R.m.atk,pow:R.pow,name:R.m.name,follow:G.map.rare.crew.filter(Boolean).map(e=>e.id),ashore:G.P.dawnCrewAshore}}")
    shot('3_duelo', 1500)
    # animaciones: caminata al acercarse y pose de técnica de lado
    anim = js("""async()=>{const m=CREW_DUEL.m,P=G.P;const seen={walk:0,atk:0,pose:0};
      P.x=m.x+150;P.y=m.y;updateCamera(0,true);CREW_DUEL.next=G.t+99;
      for(let i=0;i<30;i++){await new Promise(r=>setTimeout(r,50));if(m.anim==='walk')seen.walk++;}
      P.x=m.x+60;P.y=m.y;P.hp=P.S.maxhp;CREW_DUEL.next=0;
      for(let i=0;i<40;i++){await new Promise(r=>setTimeout(r,25));P.hp=P.S.maxhp;if(m.anim==='atk')seen.atk++;if(m.crewPose&&m.anim==='atk'&&G.t>m.crewPose.start+.16&&G.t<m.crewPose.end-.12&&(m.dir==='left'||m.dir==='right'))seen.pose++;if(seen.pose===3)break;}
      return seen;}""")
    shot('3b_pose')
    print('ANIM', anim)
    page.wait_for_timeout(3000); shot('4_tecnica')
    # medir: cuánto quita al jugador en 20 s y cuántos golpes básicos aguanta
    meas = js("()=>{const P=G.P;return {php:P.S.maxhp,patk:P.S.atk,rivalHp:CREW_DUEL&&CREW_DUEL.m.maxhp}}")
    js("()=>{const P=G.P;P.hp=P.S.maxhp;window._hl=0;window._big=0;window._lh=P.hp;V33_TICKS.push(()=>{const P=G.P;if(P.hp<window._lh)window._big=Math.max(window._big,(window._lh-P.hp)/P.S.maxhp);window._lh=P.hp;})}")

    for i in range(20):
        page.wait_for_timeout(1000); st=js("()=>{const P=G.P;window._hl+=Math.max(0,P.S.maxhp-P.hp);P.hp=P.S.maxhp;window._lh=P.hp;const R=CREW_DUEL;return R?[Math.round(R.m.hp),R.m.state,Math.round(Math.sqrt(d2(P,R.m))),G.map.id,P.dead]:['fin',P.dead,G.P.crewDuel]}")
        if st[0]=='fin': break
    meas['lost20s_pct'] = js("()=>Math.round(window._hl/G.P.S.maxhp*100)")
    meas['hitsToWin'] = js("()=>{const m=CREW_DUEL.m;let n=0,hp=m.hp;const d=G.P.S.atk*dmgRedM(m.df,m.lv);return Math.round(m.maxhp/d)}")
    meas['maxHitPct'] = js("()=>Math.round(window._big*100)")
    # 3) ganar: no muere, no da XP; restaura al que te sigue
    xp0 = js("()=>G.P.xp")
    js("()=>{const m=CREW_DUEL.m;m.hp=1;hitMob(m,1e9)}"); page.wait_for_timeout(600)
    win = js("()=>({duel:!!CREW_DUEL,xp:G.P.xp,rec:G.P.crewDuel,gold:G.P.gold,ashore:G.P.dawnCrewAshore,cd:G.P._cdAshore,zoroDead:G.ents.filter(e=>e.mid==='crew_rival_zoro'&&!e.remove).length})")
    win['xp0'] = xp0
    shot('5_gana', 300)
    # 4) perder: el jugador no muere
    page.wait_for_timeout(1500)
    js("()=>{G.P.hp=G.P.S.maxhp}")
    namiNo = js("()=>{crewDuelStart(ORANGE_NAMI,null);return !CREW_DUEL}")
    js("()=>crewDuelStart(SYRUP_USOPP,null)"); page.wait_for_timeout(800)
    namiOn = js("()=>CREW_DUEL&&CREW_DUEL.m.name")
    namiOpt = js("()=>{const l={id:'logue_c_nami',type:'npc'};const o=[];for(const h of DLG_HOOKS)try{h(l,o)}catch(e){};return o.map(x=>x.label)}")
    js("()=>{const P=G.P;P.hp=1;P.ifr=0;hurtPlayer(1e9,{lv:999})}"); page.wait_for_timeout(500)
    lose = js("()=>({duel:!!CREW_DUEL,dead:G.P.dead,hp:G.P.hp,rec:G.P.crewDuel})")
    # 5) duelo con Usopp desde la ciudad (Loguetown), luego cancelar al irse lejos
    js("()=>{const P=G.P;P.hp=P.S.maxhp;}")
    js("()=>crewDuelStart(BAR_SANJI,null)"); page.wait_for_timeout(800); shot('6_sanji', 1200)
    js("()=>{const P=G.P;P.x+=900;updateCamera(0,true)}"); page.wait_for_timeout(600)
    cancel = js("()=>({duel:!!CREW_DUEL,ashore:G.P.dawnCrewAshore,cd:G.P._cdAshore})")
    # 6) a bordo no se puede
    out = {'grow': grow, 'anim': anim, 'follow': fol, 'opts': opts, 'duel': duel, 'meas': meas, 'win': win, 'usopp': namiOn, 'namiNo': namiNo, 'namiOpt': namiOpt, 'lose': lose, 'cancel': cancel, 'errors': errs}
    print(json.dumps(out, ensure_ascii=False, indent=1))
    ok = grow[0][0] == 0 and grow[1][0] > 0 and grow[2] == grow[1] and grow[4][0] > grow[3][0] and grow[5] == grow[4] and grow[6] == grow[4] and anim['walk'] and anim['pose'] and len(opts) >= 2 and duel and \
        not win['duel'] and win['xp'] == xp0 and win['rec']['zoro']['w'] == 1 and win['cd'] is None and namiNo and namiOn and not any('Desafiar' in t or 'Challenge' in t for t in namiOpt) and not lose['dead'] and not lose['duel'] and not cancel['duel'] and cancel['cd'] is None and not errs
    assert ok, out
    print('OK')
    b.close()
