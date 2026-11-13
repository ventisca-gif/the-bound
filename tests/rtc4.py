import sys, json
from playwright.sync_api import sync_playwright
url=sys.argv[1]; out=sys.argv[2]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--allow-file-access-from-files','--autoplay-policy=no-user-gesture-required'])
    pages=[]; logs=[]
    for i,(nm,cl) in enumerate([('Ana','invocador'),('Beto','bardo')]):
        ctx=b.new_context(viewport={'width':844,'height':390},device_scale_factor=1,has_touch=True)
        pg=ctx.new_page(); pg.on('pageerror',lambda e,i=i: logs.append(f'{i} PAGEERROR: {e}')); pg.on('console',lambda m,i=i: logs.append(f'{i} {m.type}: {m.text}') if m.type in('error',) else None)
        pg.goto(url); pg.wait_for_timeout(2500)
        pg.click('#tNew'); pg.wait_for_timeout(400); pg.click(f'[data-c="{cl}"]'); pg.wait_for_timeout(200); pg.fill('#ccName',nm); pg.click('#ccGo'); pg.wait_for_timeout(1300); pg.click('#introOk'); pg.wait_for_timeout(300)
        pages.append(pg)
    A,B=pages
    A.evaluate("openParty()"); A.wait_for_timeout(300); A.click('#rtcHost'); A.wait_for_timeout(5000)
    code=A.evaluate("rtcUI.code")
    B.evaluate("openParty()"); B.wait_for_timeout(300); B.click('#rtcJoin'); B.wait_for_timeout(300); B.fill('#rtcIn', code); B.click('#rtcGo'); B.wait_for_timeout(5000)
    ans=B.evaluate("rtcUI.code")
    A.fill('#rtcIn', ans); A.click('#rtcGo'); A.wait_for_timeout(4000)
    for pg in (A,B): pg.evaluate("closeModal()")
    A.wait_for_timeout(1500)
    A.evaluate("(()=>{ window.hurtPlayer0=hurtPlayer; G.P.x=118*16; G.P.y=150*16; givePet('perro',true); setPet('perro'); return 1; })()")
    B.evaluate("(()=>{ G.P.x=118*16+20; G.P.y=150*16; return 1; })()")
    A.evaluate("(PVP.on=true, netPresence(true), 1)"); B.evaluate("(PVP.on=true, netPresence(true), 1)")
    A.wait_for_timeout(1500)
    hb=B.evaluate("G.P.hp")
    for i in range(6):
        A.evaluate("(()=>{ G.P.atkCd=0; G.P.busy=0; G.P.dir='right'; basicAttack(); return 1; })()"); A.wait_for_timeout(350)
    B.wait_for_timeout(1200)
    print('B hp', hb, '->', B.evaluate("G.P.hp"), 'A sees B pvp', A.evaluate("[...G.remote.values()].map(r=>r.pvp)"))
    B.evaluate("(()=>{ G.P.hp=1; hurtPlayer(99999); return [G.P.dead, !!G.P.downed]; })()")
    A.wait_for_timeout(1500)
    print('A sees B down', A.evaluate("[...G.remote.values()].map(r=>r.dn)"), 'B downed', B.evaluate("!!G.P.downed"))
    A.evaluate("(()=>{ const r=[...G.remote.values()][0]; G.P.x=r.x+10; G.P.y=r.y; const t=interactTarget(); doInteract(); return t&&t.label; })()")
    A.wait_for_timeout(3500)
    print('B after revive', B.evaluate("[!!G.P.downed, G.P.dead, Math.round(G.P.hp)]"))
    print('B sees A pet', B.evaluate("G.ents.filter(e=>e.type==='rpet').map(e=>e.pid)"))
    A.evaluate("(()=>{ G.P.dances=['clasico','floss']; doDance('floss'); return 1; })()"); A.wait_for_timeout(1500)
    print('B sees A dance', B.evaluate("[...G.remote.values()].map(r=>r.anim+':'+r.dk)"))
    A.screenshot(path=out.replace('.png','_A.png')); B.screenshot(path=out.replace('.png','_B.png'))
    for l in logs[:30]: print(l)
    b.close()
