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
    print('A', A.evaluate("({cls:G.P.cls, party:PARTY.id, remotes:[...G.remote.values()].map(r=>[r.name,r.cls,r.pt])})"))
    print('B', B.evaluate("({cls:G.P.cls, party:PARTY.id, remotes:[...G.remote.values()].map(r=>[r.name,r.cls,r.pt])})"))
    # same spot
    A.evaluate("(()=>{ window.hurtPlayer=()=>{}; G.P.x=118*16; G.P.y=150*16; return 1; })()")
    B.evaluate("(()=>{ window.hurtPlayer=()=>{}; G.P.x=118*16+50; G.P.y=150*16; return 1; })()")
    # A: souls + summons + companion holding hands
    A.evaluate("(()=>{ const P=G.P; P.skills.i1=8; P.slots[0]='i1'; P.mp=999; P.souls=[{id:'a',mid:'lobo',lv:5,el:0,b:0},{id:'b',mid:'slime_v',lv:5,el:0,b:0},{id:'c',mid:'reyslime',lv:8,el:0,b:1}]; useSkill(0); const n=G.ents.find(e=>e.type==='npc'&&e.id==='lia'); return 1; })()")
    A.evaluate("(()=>{ const k=Object.keys(ROM)[0]; const e=G.ents.find(e=>e.type==='npc'&&relKey(e.id)===k)||G.ents.find(e=>e.type==='npc'&&ROM[relKey(e.id)]); e.map='world'; e.x=G.P.x+10; e.y=G.P.y; startComp(e, true); return e.id; })()")
    A.wait_for_timeout(3000)
    print('A summons', A.evaluate("SUMMONS.map(e=>e.mid)"), 'comp', A.evaluate("COMP&&[COMP.e.id,COMP.hand]"))
    print('B sees', B.evaluate("G.ents.filter(e=>e.type==='rsum'||e.type==='rcomp').map(e=>[e.type,e.mid||e.id,Math.round(e.x),Math.round(e.y),e.hand])"))
    # B bard heals party
    B.evaluate("(()=>{ const P=G.P; P.skills.d5=5; P.slots[0]='d5'; P.mp=999; P.skills.d11=5; P.slots[1]='d11'; return 1; })()")
    hp0=A.evaluate("(()=>{ G.P.hp=Math.round(G.P.S.maxhp*0.3); return G.P.hp; })()")
    B.evaluate("useSkill(0)"); B.wait_for_timeout(600); B.evaluate("(G.P.cds={}, G.P.busy=0, useSkill(1))")
    A.wait_for_timeout(2500)
    print('A hp', hp0, '->', A.evaluate("G.P.hp"), 'buffs', A.evaluate("G.P.buffs.map(b=>b.id)"))
    A.screenshot(path=out.replace('.png','_A.png')); B.screenshot(path=out.replace('.png','_B.png'))
    for l in logs[:30]: print(l)
    b.close()
