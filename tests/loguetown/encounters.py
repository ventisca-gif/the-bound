"""6.16 · Personajes del puerto de Loguetown (hojas de Sergio) y los 3 desafíos de Smoker.
Uso: python3 tests/loguetown/encounters.py file://$PWD/dist/test.html [carpeta_salida]"""
import sys, json, pathlib
from playwright.sync_api import sync_playwright
URL = sys.argv[1]; OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'tests/loguetown/out'); OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--allow-file-access-from-files']); page = b.new_page(viewport={'width': 960, 'height': 540})
    errs = []; page.on('pageerror', lambda e: errs.append(str(e)))
    page.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'hook ' in m.text else None)
    page.goto(URL); page.wait_for_timeout(2500)
    page.click('#tNew'); page.wait_for_timeout(400); page.fill('#ccName', 'Ventisca'); page.click('#ccGo'); page.wait_for_timeout(1500); page.click('#introOk'); page.wait_for_timeout(500)
    # Llega en barco al muelle, desembarca y camina a la plaza (como en la partida).
    page.evaluate("""()=>{const P=G.P,M=makeDawn();P.dawnHelm=dawnHelm('skiff',{x:P.x,y:P.y});setMap(M,...dawnPx(LOGUE_MOOR),'up');G.fading=false;giveItem('dawn_fruta_diablo',1);}""")
    page.wait_for_timeout(800)
    page.evaluate("""()=>{const P=G.P;P.dawnBoat=null;[P.x,P.y]=dawnPx(LOGUE_MOOR);G.fading=false;XACT.logue_land[2]();}""")
    page.wait_for_timeout(1500)
    # Primera vez en la plaza: cinemática de Roger (él no aparece como personaje)
    page.evaluate("""()=>{const P=G.P;[P.x,P.y]=dawnPx(LOGUE_PLAZA);updateCamera(0,true);}""")
    page.wait_for_timeout(1500)
    cine = page.evaluate("()=>({on:CINE.on,n:CINE.list.length,seen:G.P.logueRoger,npc:!!NPCS.logue_memory})")
    for i in range(4):
        page.wait_for_timeout(2600); page.screenshot(path=str(OUT / f'cine_roger_{i+1}.png'))
        page.evaluate("()=>{CINE.t=99;cineNext();}")
    page.evaluate("()=>{if(CINE.on)cineEnd(true)}"); page.wait_for_timeout(500)
    again = page.evaluate("()=>{const k='logue_info_'+LOGUE_PLAZA[0]+'_'+LOGUE_PLAZA[1];XACT[k][2]();const b=[...document.querySelectorAll('#modal button')].find(b=>/cinem|cutscene/i.test(b.textContent));b.click();const on=CINE.on;cineEnd(true);return on;}")
    assert cine['on'] and cine['n'] == 4 and cine['seen'] and not cine['npc'] and again, (cine, again)
    r = page.evaluate("""()=>{const S=G.map.logueActors,check=(v,s)=>{if(!v)throw Error(s);};
      check(S&&S.cast.length===3,'cast');
      const out={};for(const e of S.cast){const A=e.atlas;check(A&&A.dawnPixels,'sheet '+e.id);out[e.id]=[A.img.width,A.img.height];}
      check(Object.values(LOGUE_SHEETS).every(i=>i.naturalWidth>0),'sheets loaded');return out;}""")
    # Muestra: los cinco del puerto en la plaza
    page.evaluate("""()=>{const P=G.P,S=G.map.logueActors;[P.x,P.y]=dawnPx(logueAt(104,146));const x0=P.x-150;S.cast.forEach((e,i)=>{e.x=x0+i*75;e.y=P.y-10;e.home={x:e.x,y:e.y};e.wander=0;e.dir='down';});P.x+=0;P.y+=50;P.dir='up';updateCamera(0,true);}""")
    page.wait_for_timeout(800); page.screenshot(path=str(OUT / 'puerto_personajes.png'))
    # Caminata en las cuatro direcciones
    for d in ['down', 'left', 'right', 'up']:
        page.evaluate("d=>{for(const e of G.map.logueActors.cast){e.dir=d;e.anim='walk';e.af=0;e.forceAnim=1;}}", d)
        page.wait_for_timeout(300); page.screenshot(path=str(OUT / f'camina_{d}.png'))
    # Cada uno en su sitio del mapa
    for i, (eid, name) in enumerate([('logue_officer', 'smoker_base')]):
        page.evaluate("""([eid])=>{const P=G.P,e=G.map.logueActors.cast.find(e=>e.id===eid),[x,y]=dawnPx(LOGUE_CAST[eid].slice(2,4).length?logueAt(LOGUE_CAST[eid][2],LOGUE_CAST[eid][3]):[0,0]);e.x=x;e.y=y;e.dir='down';e.anim='idle';P.x=x+40;P.y=y+40;P.dir='left';updateCamera(0,true);}""", [eid])
        page.wait_for_timeout(600); page.screenshot(path=str(OUT / f'{name}.png'))
    # Desafíos de Smoker
    res = []
    for k in range(3):
        page.evaluate("""()=>{const P=G.P;P.lv=620;calcStats(P);P.hp=P.S.maxhp;const sm=G.map.logueActors.cast.find(e=>e.id==='logue_officer');P.x=sm.x;P.y=sm.y+24;openDialog(sm);}""")
        page.wait_for_timeout(300)
        lab = page.evaluate("""()=>[...document.querySelectorAll('#dlg button, .dlg button, button')].map(b=>b.textContent).filter(t=>/Desaf|challenge/i.test(t))""")
        page.evaluate("""()=>{const b=[...document.querySelectorAll('button')].find(b=>/Desaf|challenge/i.test(b.textContent));b.click();}""")
        page.wait_for_timeout(500)
        info = page.evaluate("""()=>{const m=G.map.logueActors.trial;return m&&{id:m.id,n:m.def.n,lv:m.lv,boss:!!m.boss,art:m.def.art}}""")
        if k == 2:
            page.evaluate("()=>{if(!$('#modal').hidden)closeModal();const m=G.map.logueActors.trial,P=G.P;m.x=P.x-34;m.y=P.y;m.anim='atk';m.af=2;m.at=0;m.dir='right';m.atkT=9;m.state='idle';m.frozen=9;P.hp=P.S.maxhp;P.dir='left';for(const e of G.ents)if(e.type==='npc'&&!LOGUE_CAST[e.id]&&Math.abs(e.x-P.x)<200)e.x+=400;document.querySelector('#toasts').innerHTML='';document.querySelector('#banner').innerHTML='';updateCamera(0,true);}"); page.wait_for_timeout(120)
            page.screenshot(path=str(OUT / 'smoker_desafio.png'))
        g0 = page.evaluate('G.P.gold')
        page.evaluate("()=>{const m=G.map.logueActors.trial;m.hp=1;killMob(m);}"); page.wait_for_timeout(400)
        res.append({'label': lab, 'boss': info, 'done': page.evaluate('G.P.logueHarborDone'), 'gold': page.evaluate('G.P.gold') - g0})
    page.evaluate("()=>{const sm=G.map.logueActors.cast.find(e=>e.id==='logue_officer');openDialog(sm);}"); page.wait_for_timeout(300)
    fin = page.evaluate("""()=>[...document.querySelectorAll('button')].map(b=>b.textContent).filter(t=>/Desaf|challenge/i.test(t))""")
    page.evaluate("()=>closeDialog()")
    saved = page.evaluate("()=>{saveGame&&saveGame();return SAVEKEYS.includes('logueHarborDone')}")
    # al salir de la isla los personajes se quitan
    gone = page.evaluate("()=>{const M=G.map;G.P.dawnHelm=dawnHelm('skiff',{x:G.P.x,y:G.P.y});for(let i=0;i<3;i++)V33_TICKS.forEach(f=>f(0.1));const ok=!M.logueActors;G.P.dawnHelm=null;return ok;}")
    out = {'cine': cine, 'atlas': r, 'trials': res, 'final': fin, 'saved': saved, 'cleared': gone, 'errors': errs}
    print(json.dumps(out, ensure_ascii=False, indent=1))
    assert all(t['done'] == i + 1 for i, t in enumerate(res)) and gone and saved and not errs, out
    b.close()
