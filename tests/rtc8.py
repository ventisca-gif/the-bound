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
    for pg in (A,B): pg.evaluate("(window.hurtPlayer=()=>{}, G.P.lv=80, calcStats(G.P), giveItem('log1',99), 1)")
    spot=A.evaluate("(()=>{ const W=G.world, t=TOWNS[0]; for(let y=t.y0-12;y<t.y1+12;y++) for(let x=t.x0-12;x<t.x1+12;x++){ let ok=true; for(let dx=0;dx<6&&ok;dx++) for(let dy=0;dy<3&&ok;dy++) if(!bldCanPlace(W,'w_wood',x+dx,y+dy)) ok=false; if(ok) return [x,y]; } return null; })()")
    print('spot', spot)
    for pg in (A,B): pg.evaluate("(s=>{ G.P.x=s[0]*16+8; G.P.y=(s[1]+4)*16+8; return 1; })(%s)" % json.dumps(spot))
    print('A place', A.evaluate("(s=>{ bkCraft('w_wood',6); const r=[]; for(let dx=0;dx<6;dx++) r.push(bldPlace('w_wood', s[0]+dx, s[1])); return r.join(','); })(%s)" % json.dumps(spot)))
    A.wait_for_timeout(5000)
    print('B sees', B.evaluate("(s=>{ const W=G.world; const r=[]; for(let dx=0;dx<6;dx++){ const i=tileAt(W,s[0]+dx,s[1]); const o=W.objAt[i]>=0?W.objs[W.objAt[i]]:null; r.push(o?o.k+(o.bremote?':remote':''):'none'); } return [BLD.rem.size, r.join(',')]; })(%s)" % json.dumps(spot)))
    print('B remove', B.evaluate("(s=>{ bldRemoveAt(s[0], s[1]); const W=G.world, i=tileAt(W,s[0],s[1]); return W.objAt[i]>=0 && !W.objs[W.objAt[i]].hidden; })(%s)" % json.dumps(spot)))
    print('B blocked', B.evaluate("(s=>blockedFor(G.world, s[0], s[1], 0))(%s)" % json.dumps(spot)))
    A.screenshot(path=out.replace('.png','_A.png')); B.screenshot(path=out.replace('.png','_B.png'))
    for l in logs[:30]: print(l)
    b.close()
