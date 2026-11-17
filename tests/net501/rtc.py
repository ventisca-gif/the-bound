# Dos teléfonos por WiFi (WebRTC real): A se equipa armadura/peinado/cosmético y B compara lo que ve.
import sys, json
from playwright.sync_api import sync_playwright
url=sys.argv[1]; out=sys.argv[2]; cfg=sys.argv[3] if len(sys.argv)>3 else "{}"
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--allow-file-access-from-files'])
    pages=[]; logs=[]
    for i,(nm,cl) in enumerate([('Ana','guerrero'),('Beto','bardo')]):
        ctx=b.new_context(viewport={'width':844,'height':390},device_scale_factor=2,has_touch=True)
        pg=ctx.new_page(); pg.on('pageerror',lambda e,i=i: logs.append(f'{i} PAGEERROR: {e}'))
        pg.goto(url); pg.wait_for_timeout(2500)
        pg.click('#tNew'); pg.wait_for_timeout(400); pg.click(f'[data-c="{cl}"]'); pg.wait_for_timeout(200); pg.fill('#ccName',nm); pg.click('#ccGo'); pg.wait_for_timeout(1300); pg.click('#introOk'); pg.wait_for_timeout(300)
        pages.append(pg)
    A,B=pages
    A.evaluate("openParty()"); A.wait_for_timeout(300); A.click('#rtcHost'); A.wait_for_timeout(5000)
    code=A.evaluate("rtcUI.code")
    B.evaluate("openParty()"); B.wait_for_timeout(300); B.click('#rtcJoin'); B.wait_for_timeout(300); B.fill('#rtcIn', code); B.click('#rtcGo'); B.wait_for_timeout(5000)
    ans=B.evaluate("rtcUI.code")
    A.fill('#rtcIn', ans); A.click('#rtcGo'); A.wait_for_timeout(4000)
    for pg in (A,B): pg.evaluate("closeModal(); window.hurtPlayer=()=>{}; G.P.lv=400; calcStats(G.P)")
    A.evaluate("(()=>{const P=G.P; for(const s of ['body','legs','feet','head']){const it=Object.values(ITEMS).find(i=>i.t==='armor'&&i.slot===s&&i.tier===30&&(!i.cls||i.cls===P.cls)); if(it){giveItem(it.id,1); equipFromInv(P.inv.findIndex(v=>v&&v.id===it.id));}} P.app.hs=HS_F.length-3; refreshLook(); })()")
    A.wait_for_timeout(2500)
    B.evaluate("(()=>{const r=[...G.remote.values()][0]; G.P.x=r.x-70; G.P.y=r.y; })()"); B.wait_for_timeout(1500)
    HD="(A=>{hdEnsure(A,0,0,true);const c=mkCanvas(A.fw*2,A.fh*2);c.getContext('2d').drawImage(A.hd,0,0,A.fw*2,A.fh*2,0,0,A.fw*2,A.fh*2);return c.toDataURL();})"
    ha=A.evaluate(HD+"(G.P.atlas)"); hb=B.evaluate(HD+"([...G.remote.values()][0].atlas)")
    print('same HD pixels', ha==hb)
    sk=A.evaluate("(()=>{const P=G.P;const id=Object.keys(SK).find(k=>SK[k].cls===P.cls&&SK[k].type==='act'&&SV_OF.has(k));P.mp=99999;P.skills[id]=5;P.busy=0;P.slots[0]=id;P.cds[id]=0;useSkill(0);return id;})()")
    print('A local', A.evaluate("JSON.stringify([G.P.svCast, NFX_OUT.map(x=>x.e.k), G.P.cds])"))
    B.evaluate("(()=>{window._svseen=[];const o=svStart;svStart=function(e,D,d){window._svseen.push(D.id);return o.apply(this,arguments)};const n=nfxPlay;nfxPlay=function(r,ev){window._svseen.push('ev:'+ev.k);return n.apply(this,arguments)};})()")
    A.wait_for_timeout(400)
    print('B events', B.evaluate("JSON.stringify(window._svseen)"))
    print('skill', sk, 'B sees cast', B.evaluate("(()=>{const r=[...G.remote.values()][0];return r.svCast?r.svCast.id:null})()"))
    print(B.evaluate("(()=>{const r=[...G.remote.values()][0]; return r?{gear:r.gear,app:r.app,cos:r.cos}:null})()"))
    print('A', A.evaluate("JSON.stringify({gear:gearTiers(G.P),app:normApp(G.P.app)})"))
    print('same key', A.evaluate("heroKey(G.P.cls,normApp(G.P.app),gearTiers(G.P),G.P.cos||{},G.P.hideHelm)")==B.evaluate("(()=>{const r=[...G.remote.values()][0];return heroKey(r.cls,r.app,r.gear,r.cos,r.hh)})()"))
    A.screenshot(path=out+'_A.png'); B.screenshot(path=out+'_B.png')
    for l in logs[:30]: print(l)
    b.close()
