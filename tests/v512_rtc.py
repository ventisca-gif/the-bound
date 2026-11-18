# 5.12: dos jugadores por WebRTC real. Duelo y cambio de cartas, fiesta en casa (anfitrión y visita se ven),
# caza del tesoro en grupo (pistas distintas), relevos con compañero, metro elevado visible, cometa y animal visibles.
import sys, os
from playwright.sync_api import sync_playwright
url = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else 'rtc.png'
exe = '/usr/bin/google-chrome' if os.path.exists('/usr/bin/google-chrome') else None
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=exe, args=['--no-sandbox', '--allow-file-access-from-files'])
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
    for pg in (A, B): pg.evaluate("closeModal(); window.hurtPlayer=()=>{}; G.P.lv=60; G.P.gold=50000; calcStats(G.P); for (let k=0;k<8;k++) cardGiveRandom(30); 1")
    print('conectados', A.evaluate("mailOnline().map(r=>r.name)"), B.evaluate("mailOnline().map(r=>r.name)"))
    # duelo de cartas
    A.evaluate("pvcChallenge(mailOnline()[0])"); A.wait_for_timeout(2000)
    print('B reto', B.evaluate("JSON.stringify(BIT().mail.map(m=>m.k))"))
    B.evaluate("(openBitacora('buzon'), document.querySelector('#modal [data-xok]').click(), 1)"); B.wait_for_timeout(2500)
    print('duelo', A.evaluate("PVC.duel && PVC.duel.st"), B.evaluate("PVC.duel && PVC.duel.st"))
    for r in range(5):
        for pg in (A, B): pg.evaluate("(()=>{ const b=document.querySelector('#modal [data-pc]'); if(b) b.click(); return 1; })()")
        A.wait_for_timeout(1800)
    print('resultado A', A.evaluate("[PVC.duel.round, PVC.duel.me, PVC.duel.op]"), 'B', B.evaluate("[PVC.duel.round, PVC.duel.me, PVC.duel.op]"))
    for pg in (A, B): pg.evaluate("(PVC.duel=null, closeModal(), 1)")
    # cambio de cartas
    give = A.evaluate("Object.keys(BIT().cards)[0]")
    A.evaluate(f"pvcTrade(mailOnline()[0], '{give}')"); A.wait_for_timeout(2000)
    B.evaluate("(openBitacora('buzon'), document.querySelector('#modal [data-xok]').click(), 1)"); B.wait_for_timeout(500)
    got = B.evaluate("(()=>{ const t=document.querySelector('#modal [data-tg]'); const id=t.dataset.tg; t.click(); return id; })()"); B.wait_for_timeout(2500)
    print('cambio: B tiene la de A', B.evaluate(f"!!BIT().cards['{give}']"), '| A tiene la de B', A.evaluate(f"!!BIT().cards['{got}']"), A.evaluate("PVC.offers.size"))
    # fiesta: A invita, B entra, ambos se ven
    A.evaluate("(G.P.homes={casa_a3:{floor:1,f:{bed:'bigbed',table:'sofa'}}}, G.P.builds=[], BLD.P=null, 1)")
    A.evaluate("(()=>{ const P=G.P, M=makeHome('casa_a3'); P.retX=P.x; P.retY=P.y; P.inside='casa_a3'; setMap(M, 10*16+8, 9*16+8, 'up'); return 1; })()"); A.wait_for_timeout(800)
    A.evaluate("partyInvite()"); A.wait_for_timeout(2500)
    print('B fiesta', B.evaluate("JSON.stringify(BIT().mail.slice(0,3).map(m=>m.k))"), B.evaluate("!!VISIT.offer"))
    B.evaluate("(closeModal(), visitEnter(), 1)"); B.wait_for_timeout(3000)
    print('B dentro', B.evaluate("[G.map.id, partyOn(), mailOnline().map(r=>r.map)]"), '| A ve a B en', A.evaluate("[G.map.id, mailOnline().map(r=>r.map)]"))
    B.screenshot(path=out.replace('.png', '_fiesta.png'))
    B.evaluate("exitInterior()"); A.evaluate("exitInterior()"); A.wait_for_timeout(2500)
    # caza del tesoro en grupo
    for pg in (A, B): pg.evaluate("(PARTY.id='grupo1', netPresence(true), 1)")
    A.wait_for_timeout(1500)
    A.evaluate("(huntStart(), closeModal(), 1)"); A.wait_for_timeout(2000)
    print('tesoro A pistas', A.evaluate("HUNT2 && HUNT2.mine"), 'B pistas', B.evaluate("HUNT2 && HUNT2.mine"), 'mismo sitio', A.evaluate("[HUNT2.x,HUNT2.y]") == B.evaluate("[HUNT2.x,HUNT2.y]"))
    for pg in (A, B): pg.evaluate("(closeModal(), HUNT2=null, 1)")
    # relevos
    A.evaluate("(()=>{ const r=mailOnline()[0]; RELAY={ id:'rl1', mate:r.id, mateName:r.name, leg:1, rival:0 }; mailSend(r,{k:'relay', id:'rl1'}); return 1; })()"); A.wait_for_timeout(1500)
    print('B relevo', B.evaluate("RELAY && RELAY.leg"))
    A.evaluate("(()=>{ relayLeg1(20, 30); return 1; })()"); A.wait_for_timeout(2000)
    print('B corre', B.evaluate("!!MRACE"))
    B.evaluate("(()=>{ const R=MRACE; for (const r of R.rings) { G.P.x=r[0]; G.P.y=r[1]; mraceTick(0.1); } G.P.x=R.rings[0][0]; G.P.y=R.rings[0][1]; mraceTick(0.1); return 1; })()"); B.wait_for_timeout(2000)
    print('relevo fin A', A.evaluate("[RELAY, bitC('relayWin')]"), 'B', B.evaluate("[RELAY, bitC('relayWin')]"))
    # cometa y animal visibles
    A.evaluate("(KITE={h:40,v:0,wind:0,t:30,best:40}, BIT().tamed=['zorro'], BIT().fol='zorro', netPresence(true), 1)"); A.wait_for_timeout(1500)
    print('B ve cometa/animal', B.evaluate("JSON.stringify(mailOnline().map(r=>[r.kt, r.tm]))"))
    for l in logs[:30]: print(l)
    b.close()
