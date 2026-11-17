# 5.11: dos jugadores por WebRTC real. Notas, regalos (con confirmación), petición de visita, casa enviada y entrada,
# voto del concurso de cocina, marcador de carrera y pesca por equipos, muñecos de nieve visibles.
import sys, os
from playwright.sync_api import sync_playwright
url = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else 'rtc.png'
exe = '/usr/bin/google-chrome' if os.path.exists('/usr/bin/google-chrome') else None
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=exe, args=['--no-sandbox', '--allow-file-access-from-files']) if exe else p.chromium.launch(args=['--no-sandbox', '--allow-file-access-from-files'])
    pages = []; logs = []
    for i, (nm, cl) in enumerate([('Ana', 'guerrero'), ('Beto', 'bardo')]):
        ctx = b.new_context(viewport={'width': 844, 'height': 390}, device_scale_factor=1, has_touch=True)
        pg = ctx.new_page(); pg.on('pageerror', lambda e, i=i: logs.append(f'{i} PAGEERROR: {e}'))
        pg.goto(url); pg.wait_for_timeout(2500)
        pg.click('#tNew'); pg.wait_for_timeout(400); pg.click(f'[data-c="{cl}"]'); pg.wait_for_timeout(200); pg.fill('#ccName', nm); pg.click('#ccGo'); pg.wait_for_timeout(1300); pg.click('#introOk'); pg.wait_for_timeout(300)
        pages.append(pg)
    A, B = pages
    A.evaluate("openParty()"); A.wait_for_timeout(300); A.click('#rtcHost'); A.wait_for_timeout(5000)
    code = A.evaluate("rtcUI.code")
    B.evaluate("openParty()"); B.wait_for_timeout(300); B.click('#rtcJoin'); B.wait_for_timeout(300); B.fill('#rtcIn', code); B.click('#rtcGo'); B.wait_for_timeout(5000)
    ans = B.evaluate("rtcUI.code")
    A.fill('#rtcIn', ans); A.click('#rtcGo'); A.wait_for_timeout(4000)
    for pg in (A, B): pg.evaluate("closeModal(); window.hurtPlayer=()=>{}; G.P.lv=60; G.P.gold=50000; calcStats(G.P)")
    print('conectados', A.evaluate("mailOnline().map(r=>r.name)"), B.evaluate("mailOnline().map(r=>r.name)"))
    # nota
    A.evaluate("(()=>{ const r=mailOnline()[0]; mailSend(r,{k:'note',txt:'¡Hola Beto!'}); return 1; })()"); A.wait_for_timeout(2000)
    print('B nota', B.evaluate("JSON.stringify(BIT().mail.map(m=>[m.k,m.f,m.txt]))"))
    # regalo con acuse
    A.evaluate("(giveItem('log1',5), openBitacora('buzon'), document.querySelector('#modal [data-mto]').click(), 1)"); A.wait_for_timeout(300)
    A.evaluate("(()=>{ const b=[...document.querySelectorAll('#modal [data-gift]')].find(x=>G.P.inv[+x.dataset.gift.split('|')[0]].id==='log1' && x.dataset.gift.endsWith('|5')); b.click(); return 1; })()"); A.wait_for_timeout(3000)
    print('regalo: A log1', A.evaluate("countItem('log1')"), 'pendientes', A.evaluate("MAILQ.pend.size"), '| B log1', B.evaluate("countItem('log1')"))
    # visita: B pide, A acepta (A tiene casa), B entra
    A.evaluate("(G.P.homes={casa_a3:{floor:1,f:{bed:'bigbed',table:'sofa',deco1:'lamp'}}}, G.P.builds=[['casa_a3',21,10,1,'bit_trofeo',0,0]], BLD.P=null, 1)")
    B.evaluate("(()=>{ mailSend(mailOnline()[0],{k:'visreq'}); return 1; })()"); B.wait_for_timeout(2000)
    print('A peticion', A.evaluate("JSON.stringify(BIT().mail.map(m=>m.k))"))
    A.evaluate("(openBitacora('buzon'), document.querySelector('#modal [data-vok]').click(), 1)"); A.wait_for_timeout(2500)
    print('B oferta', B.evaluate("!!VISIT.offer && VISIT.offer.name"))
    B.evaluate("(closeModal(), visitEnter(), 1)"); B.wait_for_timeout(2000)
    print('B dentro', B.evaluate("[G.map.id, G.map.visit, G.map.objs.filter(o=>!o.hidden && o.f==='bit_trofeo').length, Object.keys(G.P.homes||{}).length]"))
    B.screenshot(path=out.replace('.png', '_visita.png'))
    B.evaluate("exitInterior()"); B.wait_for_timeout(2500)
    print('B fuera', B.evaluate("[G.map.id, !!G.maps.visita]"))
    # cocina: A cocina y B vota
    A.evaluate("(cookStart(), COOK.pick=[0,1,2], COOK.best=0.8, cookJudge(), 1)"); A.wait_for_timeout(1500)
    B.evaluate("(()=>{ const r=mailOnline()[0]; G.P.x=r.x+10; G.P.y=r.y; return 1; })()"); B.wait_for_timeout(500)
    print('B ve plato', B.evaluate("(()=>{ const it=interactTarget(); return it&&it.kind; })()"))
    B.evaluate("(()=>{ const it=interactTarget(); if(it) doInteract(it); return 1; })()"); B.wait_for_timeout(2500)
    print('A votos', A.evaluate("COOK && COOK.votes"))
    # carrera y pesca por equipos: el otro lo ve en su marcador
    A.evaluate("(closeModal(), COOK=null, mraceStart({}), MRACE.i=3, netPresence(true), 1)"); A.wait_for_timeout(1500)
    print('B ve carrera', B.evaluate("JSON.stringify(mailOnline().map(r=>r.mr))"))
    A.evaluate("(MRACE=null, mgHud(null), tfStart(), TF.n=3, netPresence(true), 1)"); B.evaluate("(tfStart(), TF.n=2, netPresence(true), 1)"); A.wait_for_timeout(1500)
    print('equipo A', A.evaluate("tfTeam().map(r=>r.name+':'+r.tf)"), 'B', B.evaluate("tfTeam().map(r=>r.name+':'+r.tf)"))
    # muñecos visibles
    A.evaluate("(TF=null, mgHud(null), SNOW.push({x:G.P.x+30,y:G.P.y,m:G.P.map,man:1,t:G.t}), netPresence(true), 1)"); A.wait_for_timeout(1500)
    print('B ve muñecos', B.evaluate("JSON.stringify(mailOnline().map(r=>r.sm))"))
    for l in logs[:30]: print(l)
    b.close()
