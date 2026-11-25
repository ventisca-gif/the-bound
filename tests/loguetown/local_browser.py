"""Check the actual Dawn Sea island, paths, map markers, ship round trips and rendering."""
import json, pathlib
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/'tests/loguetown/out';OUT.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--allow-file-access-from-files'])
    page=browser.new_page(viewport={'width':1280,'height':720})
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('console',lambda m:errors.append(m.text) if m.type=='error' and 'hook ' in m.text else None)
    page.goto((ROOT/'dist/test.html').as_uri());page.wait_for_timeout(2500)
    page.click('#tNew');page.wait_for_timeout(400);page.fill('#ccName','Ventisca');page.click('#ccGo');page.wait_for_timeout(1500);page.click('#introOk');page.wait_for_timeout(500)
    result=page.evaluate(r'''()=>{
      const M=makeDawn(),P=G.P,check=(v,s)=>{if(!v)throw Error(s);};
      check(M.logue,'island absent');check(LOGUE_X+LOGUE_W<=M.w&&LOGUE_Y+LOGUE_H<=M.h,'bounds');
      const n=M.objs.length;makeDawn();check(n===M.objs.length,'island duplicated');
      const seen=new Set(),queue=[LOGUE_PIER],key=(x,y)=>x+','+y;
      for(let n=0;n<queue.length;n++){
        const [x,y]=queue[n],k=key(x,y);if(seen.has(k)||x<LOGUE_X||y<LOGUE_Y||x>=LOGUE_X+LOGUE_W||y>=LOGUE_Y+LOGUE_H)continue;
        const i=M.I(x,y);if(M.ter[i]===T.DEEP||M.ter[i]===T.WATER||SOLID_T[M.ter[i]]||M.solidO[i])continue;
        seen.add(k);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])queue.push([x+dx,y+dy]);
      }
      for(const [at,name] of LOGUE_PLACES){
        check(seen.has(key(...at)),name+' unreachable');const sign=M.objs.find(o=>o.xact==='logue_info_'+at[0]+'_'+at[1]);
        check(sign&&XACT[sign.xact]&&seen.has(key(sign.tx,sign.ty)),name+' sign');
      }
      check(!M.solidO[M.I(...LOGUE_GATE)],'gate blocked');
      for(const kind of ['skiff','galleon'])check(dawnSurface(M,...dawnPx(LOGUE_MOOR),dawnShipRadius(P,{kind})),'ship clearance '+kind);
      check(otherPOI(M).filter(p=>p.t.includes('Loguetown')).length>=2,'map markers');
      for(const o of M.objs.filter(o=>o.k==='logue')){const s=objSprite(o);check(s&&s.c.width&&s.c.height,'missing sprite '+o.part);check(s===objSprite(o),'uncached sprite');}
      P.dawnHelm=dawnHelm('skiff',{x:P.x,y:P.y});setMap(M,...dawnPx(LOGUE_MOOR),'up');
      check(G.map===M,'Dawn entry');
      giveItem('dawn_fruta_diablo',1);
      return {walkable:seen.size,buildings:M.objs.filter(o=>o.k==='logue').length,points:LOGUE_PLACES.length,ver:GAME_VER};
    }''')
    for kind in ['skiff','galleon']:
        page.evaluate("kind=>{const P=G.P;P.dawnHelm=dawnHelm(kind,{x:P.x,y:P.y});P.dawnBoat=null;[P.x,P.y]=dawnPx(LOGUE_MOOR);G.fading=false;if(logueDockKey()!=='logue_land')throw Error('dock action '+logueDockKey());XACT.logue_land[2]();}",kind)
        page.wait_for_timeout(1500)
        assert page.evaluate("!G.P.dawnHelm&&G.P.dawnBoat.logue&&logueDockKey()==='logue_sail'")
        page.evaluate("XACT.logue_sail[2]()");page.wait_for_timeout(1500)
        assert page.evaluate("G.P.dawnHelm.kind")==kind
    page.evaluate("()=>{G.P.dawnHelm=null;G.P.dawnBoat=null;[G.P.x,G.P.y]=dawnPx(LOGUE_PLAZA);G.P.y-=60;G.P.x-=110;updateCamera(0,true);prewarm(G.map);}")
    page.wait_for_timeout(1000);page.screenshot(path=str(OUT/'plaza.png'))
    page.evaluate("()=>{[G.P.x,G.P.y]=dawnPx(LOGUE_GATE);G.P.y-=20;updateCamera(0,true);prewarm(G.map);}")
    page.wait_for_timeout(1000);page.screenshot(path=str(OUT/'entrada.png'))
    for at,name in [('LOGUE_PIER','puerto'),('logueAt(76,160)','armeria')]:
        page.evaluate("()=>{[G.P.x,G.P.y]=dawnPx("+at+");updateCamera(0,true);prewarm(G.map);}")
        page.wait_for_timeout(600);page.screenshot(path=str(OUT/(name+'.png')))
    result['errors']=errors;(OUT/'report.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
    print(json.dumps(result,ensure_ascii=False));assert not errors,errors
    browser.close()
