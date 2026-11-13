import sys, json
from playwright.sync_api import sync_playwright
url=sys.argv[1]; out=sys.argv[2]; w=int(sys.argv[3]); h=int(sys.argv[4]); script=sys.argv[5] if len(sys.argv)>5 else ''
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--allow-file-access-from-files','--autoplay-policy=no-user-gesture-required'])
    ctx=b.new_context(viewport={'width':w,'height':h},device_scale_factor=2,has_touch=True,is_mobile=False)
    pg=ctx.new_page(); logs=[]
    pg.on('console',lambda m: logs.append(m.type+': '+m.text))
    pg.on('pageerror',lambda e: logs.append('PAGEERROR: '+str(e)))
    pg.goto(url); pg.wait_for_timeout(2500)
    steps=[l for l in open(script[1:]).read().split('\n') if l.strip()] if script.startswith('@') else [s for s in script.split(';;') if s.strip()]
    steps=[x for st in steps for x in (st.split(';;') if not st.startswith('js ') else [st])]
    shot_i=0
    for st in steps:
        st=st.strip()
        if st.startswith('wait '): pg.wait_for_timeout(int(st[5:]))
        elif st.startswith('click '): pg.click(st[6:])
        elif st.startswith('tap '): pg.tap(st[4:])
        elif st.startswith('type '):
            sel,txt=st[5:].split('|',1); pg.fill(sel,txt)
        elif st.startswith('key '): pg.keyboard.press(st[4:])
        elif st.startswith('down '): pg.keyboard.down(st[5:])
        elif st.startswith('up '): pg.keyboard.up(st[3:])
        elif st.startswith('js '):
            r=pg.evaluate(st[3:]);
            if r is not None: print('JS>', json.dumps(r)[:1500])
        elif st.startswith('shot'):
            nm=out.replace('.png','_%d.png'%shot_i); pg.screenshot(path=nm); shot_i+=1; print('shot',nm)
    pg.screenshot(path=out)
    for l in logs[:60]: print(l)
    b.close()
