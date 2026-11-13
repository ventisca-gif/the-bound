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
    # kill share: put B next to A, A kills a mob
    B.evaluate("(()=>{G.P.x+=20; return 1})()"); B.wait_for_timeout(800)
    xb=B.evaluate("G.P.xp")
    A.evaluate("(()=>{ const P=G.P; const m=spawnMob('slime_v', 3, P.x+30, P.y, 0, null, false); G.ents.push(m); hitMob(m, 99999); return m.mid; })()")
    A.wait_for_timeout(1500)
    print('B xp before/after', xb, B.evaluate("G.P.xp"), B.evaluate("G.P.best"))
    B.evaluate("doEmote('dance')"); B.wait_for_timeout(1200)
    print('A sees anim', A.evaluate("[...G.remote.values()].map(r=>r.anim)"))
    A.screenshot(path=out.replace('.png','_A.png'))
    B.screenshot(path=out.replace('.png','_B.png'))
    for l in logs[:30]: print(l)
    b.close()
