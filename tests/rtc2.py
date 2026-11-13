import sys, json
from playwright.sync_api import sync_playwright
url=sys.argv[1]; out=sys.argv[2]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--allow-file-access-from-files','--autoplay-policy=no-user-gesture-required'])
    pages=[]; logs=[]
    for i,nm in enumerate(['Ana','Beto']):
        ctx=b.new_context(viewport={'width':844,'height':390},device_scale_factor=1,has_touch=True)
        pg=ctx.new_page(); pg.on('pageerror',lambda e,i=i: logs.append(f'{i} PAGEERROR: {e}')); pg.on('console',lambda m,i=i: logs.append(f'{i} {m.type}: {m.text}') if m.type in('error','warning') else None)
        pg.goto(url); pg.wait_for_timeout(2500)
        pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName',nm); pg.click('#ccGo'); pg.wait_for_timeout(1300); pg.click('#introOk'); pg.wait_for_timeout(300)
        pages.append(pg)
    A,B=pages
    print('supported', A.evaluate('rtcSupported()'))
    A.evaluate("openParty()"); A.wait_for_timeout(300); A.click('#rtcHost'); A.wait_for_timeout(5000)
    code=A.evaluate("rtcUI.code"); print('offer len', len(code))
    A.screenshot(path=out.replace('.png','_host.png'))
    B.evaluate("openParty()"); B.wait_for_timeout(300); B.click('#rtcJoin'); B.wait_for_timeout(300); B.fill('#rtcIn', code); B.click('#rtcGo'); B.wait_for_timeout(5000)
    ans=B.evaluate("rtcUI.code"); print('answer len', len(ans))
    B.screenshot(path=out.replace('.png','_join.png'))
    A.fill('#rtcIn', ans); A.click('#rtcGo'); A.wait_for_timeout(4000)
    for pg in (A,B): pg.evaluate("closeModal()")
    A.wait_for_timeout(1500)
    print('A', A.evaluate("({role:RTC.role, open:rtcOpen(), party:PARTY.id, my:NET.myId, remotes:[...G.remote.values()].map(r=>[r.name,r.pt,Math.round(r.x),Math.round(r.y)])})"))
    print('B', B.evaluate("({role:RTC.role, open:rtcOpen(), party:PARTY.id, my:NET.myId, remotes:[...G.remote.values()].map(r=>[r.name,r.pt,Math.round(r.x),Math.round(r.y)])})"))
    # mob sync: go to a camp together
    A.evaluate("(()=>{ window.hurtPlayer=()=>{}; const c=G.world.camps.find(c=>c.lv<6&&Math.abs(c.x-118)<40); G.P.x=c.x*16+40; G.P.y=c.y*16; window._c=[c.x,c.y]; return 1; })()")
    c=A.evaluate("window._c")
    B.evaluate(f"(()=>{{ window.hurtPlayer=()=>{{}}; G.P.x={c[0]}*16+60; G.P.y={c[1]}*16; return 1; }})()")
    A.wait_for_timeout(4000)
    print('A mobs', A.evaluate("G.ents.filter(e=>e.type==='mob'&&!e.dying&&Math.hypot(e.x-G.P.x,e.y-G.P.y)<460).map(e=>[e.nid,e.mid,Math.round(e.x),Math.round(e.y),Math.round(e.hp)]).slice(0,6)"))
    print('B sync', B.evaluate("syncActive()"), 'ghosts', B.evaluate("G.ents.filter(e=>e.type==='mob'&&!e.dying&&e.map==='world'&&Math.hypot(e.x-G.P.x,e.y-G.P.y)<700).map(e=>[e.ghost?'G':'L',e.nid,e.mid,Math.round(e.x),Math.round(e.y),Math.round(e.hp)]).slice(0,8)"))
    xb=B.evaluate("G.P.xp")
    B.evaluate("(()=>{ const g=[...GHOSTS.values()][0]; window._g=g.nid; for(let i=0;i<20;i++) hitMob(g, 50); return g.nid; })()")
    B.wait_for_timeout(2500)
    print('A target', A.evaluate("(()=>{ const m=G.ents.find(e=>e.nid===%s); return m? [m.hp, m.dying] : 'gone'; })()" % B.evaluate("window._g")))
    print('B xp', xb, '->', B.evaluate("G.P.xp"), B.evaluate("GHOSTS.size"))
    A.screenshot(path=out.replace('.png','_SA.png')); B.screenshot(path=out.replace('.png','_SB.png'))
    for l in logs[:30]: print(l)
    b.close()
