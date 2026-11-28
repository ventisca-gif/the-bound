"""Integration test: original-proposal art, both piers, Grand Line, persistence and return."""
from pathlib import Path
import json,sys
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'tests/grandline664/out';OUT.mkdir(exist_ok=True)
URL=sys.argv[1] if len(sys.argv)>1 else (ROOT/'dist/test.html').as_uri()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--allow-file-access-from-files','--autoplay-policy=no-user-gesture-required'])
 c=b.new_context(viewport={'width':1280,'height':720},device_scale_factor=1);c.route('https://raw.githubusercontent.com/**/update/version.json*',lambda r:r.abort())
 page=c.new_page();errors=[];warnings=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:warnings.append(m.text) if m.type=='warning' and 'hook ' in m.text else None)
 page.goto(URL);page.locator('#tNew').click();page.locator('#ccName').fill('Prueba');page.locator('#ccGo').click();page.locator('#introOk').click();page.wait_for_timeout(500)
 def js(s):return page.evaluate(s)
 def check(s,msg):
  assert js(s),msg
  print('PASS',msg,flush=True)
 def act():js('doInteract(interactTarget());1');page.wait_for_timeout(1400)
 js("""(()=>{const P=G.P;P.lv=700;calcStats(P);P.hp=P.S.maxhp;P.mp=P.S.maxmp;P.dawnCrewJoined=true;P.syrupUsopp=true;P.baratieSanji=true;P.rmDone=1;P.logueArcN=1;P.rmVisual=2;P.dawnHelm=dawnHelm('skiff',{x:P.x,y:P.y});setMap(makeDawn(),...dawnPx(rmaAt(0,[300,492])),'up');NV.nextPir=NV.nextKing=NV.nextStorm=G.t+10000;return 1;})()""")
 page.wait_for_timeout(1800);page.screenshot(path=str(OUT/'01_reverse_mountain.png'))
 check("RMA_ART.scene(0).width===960 && RMA_ART.scene(1).height===720",'original HTML art cached at exact resolution')
 js('[G.P.x,G.P.y]=dawnPx(RMA_MOUNT_EXIT);1');check("interactTarget()?.o?.xact==='rmc_down'",'descent action at original mountain exit');act()
 check("G.map.id==='dawn' && Math.hypot(G.P.x-dawnPx(RMA_CAPE_ENTRY)[0],G.P.y-dawnPx(RMA_CAPE_ENTRY)[1])<40",'descent arrives at Twin Cape')
 js('[G.P.x,G.P.y]=dawnPx(RMA_CAPE_UP);1');act();check("Math.hypot(G.P.x-dawnPx(RMA_MOUNT_RETURN)[0],G.P.y-dawnPx(RMA_MOUNT_RETURN)[1])<40",'reverse mountain route works both ways')
 js('[G.P.x,G.P.y]=dawnPx(RMC_MOOR);1');check("interactTarget()?.o?.xact==='rmc_land'",'west landing');act();check("!G.P.dawnHelm&&G.P.dawnBoat.rmcape",'native west dock')
 check("G.ents.some(e=>e.id==='rm_crocus'&&e.map==='dawn'&&!e.remove)",'Crocus is a live NPC')
 js("[G.P.x,G.P.y]=dawnPx([RMC_CROCUS[0]+4,RMC_CROCUS[1]+2]);updateCamera(0,true);1");page.wait_for_timeout(800);page.screenshot(path=str(OUT/'02_cabos_gemelos.png'))
 js("window.__gold=G.P.gold;window.__foot=serializeP(G.P);startGame(window.__foot,false);1");page.wait_for_timeout(1600)
 check("G.map.id==='dawn'&&!G.P.dawnHelm&&G.P.dawnBoat?.rmcape&&G.P.rmDone===1&&G.P.gold===window.__gold",'foot save restores the correct dock and progress')
 js('[G.P.x,G.P.y]=dawnPx(RMC_PIER);1');act();check("G.P.dawnHelm?.kind==='skiff'",'return to native Merry')
 js('[G.P.x,G.P.y]=dawnPx(RMA_EAST_MOOR);1');act();check("!G.P.dawnHelm&&G.P.dawnBoat?.rmcapeEast",'east lighthouse landing')
 js('[G.P.x,G.P.y]=dawnPx(RMA_EAST_PIER);1');act();check("G.P.dawnHelm?.kind==='skiff'",'east lighthouse return to ship')
 js('[G.P.x,G.P.y]=dawnPx(RMC_EXIT);1');check("interactTarget()?.o?.xact==='rmc_exit'",'Grand Line departure action');act()
 check("G.map.id==='grand_line'&&G.P.dawnHelm?.kind==='skiff'",'separate Grand Line sea entered with same ship')
 check("G.map.objs.some(o=>o.xact==='glp_bell')&&G.map.camps.length===0&&G.map.ter[G.map.I(48,360)]===T.DEEP",'Grand Line has a native port and open sea at the entrance')
 js("(()=>{for(let i=0;i<100;i++){G.t+=10;v33Tick(.016);}return 1;})()");check("!MR.boat&&!NV.foes.length&&!ARC.foes.length&&!G.ents.some(e=>e.map==='grand_line'&&e.type==='mob')",'Dawn encounters cannot leak into empty Grand Line')
 check("(()=>{const x=G.P.x;inp.jx=1;updatePlayer(.05);inp.jx=0;return G.P.x>x;})()",'native sailing controls work in new sea')
 js("openPanel('map');1");page.wait_for_timeout(500);js('closePanel();1')
 page.screenshot(path=str(OUT/'03_grand_line_sea.png'))
 js('window.__sea=serializeP(G.P);startGame(window.__sea,false);1');page.wait_for_timeout(1600)
 check("G.map.id==='grand_line'&&G.P.dawnHelm?.kind==='skiff'&&G.P.gold===window.__gold",'save restores Grand Line without moving to world')
 js('mbGoDown();1');page.wait_for_timeout(1400);check("G.map.merryBajo&&G.P._mbTrip.m==='grand_line'",'native Merry interior remembers new sea')
 js('mbGoUp();1');page.wait_for_timeout(1400);check("G.map.id==='grand_line'",'leaving Merry interior returns to correct sea')
 js('[G.P.x,G.P.y]=dawnPx(GL_PORT_MOOR);G.P.lv=619;1')
 check("interactTarget()?.o?.xact==='glp_locked'",'port entry requires level 620')
 js('G.P.lv=620;calcStats(G.P);G.P.hp=G.P.S.maxhp;[G.P.x,G.P.y]=dawnPx(GL_PORT_MOOR);1')
 page.wait_for_function("interactTarget()?.o?.xact==='glp_land'",timeout=5000)
 check("Array.from({length:26},(_,i)=>385+i).every(y=>dawnSurface(G.map,...dawnPx([178,y]),18))",'channel is clear for the native ship')
 act()
 check("glpOnFoot()&&G.P.dawnBoat.h.kind==='skiff'",'native landing retains the ship')
 check("""(()=>{const M=G.map,Q=[GL_PORT_PIER],seen=new Set();
   for(let i=0;i<Q.length;i++){const [x,y]=Q[i];if(x<123||x>233||y<316||y>408)continue;
     const k=M.I(x,y);if(seen.has(k)||SOLID_T[M.ter[k]]||M.solidO[k])continue;
     seen.add(k);for(const [dx,dy] of [[0,1],[0,-1],[1,0],[-1,0]])Q.push([x+dx,y+dy]);}
   return [GL_PORT_PLAZA,GL_PORT_ARCHIVE,GL_PORT_BELL].every(([x,y])=>seen.has(M.I(x,y)));
 })()""",'both shores and the bell are walkable from the pier')
 check("""GL_PORT_FOES.every(([id,lv])=>{
   const fresh=mobStats(BOSSES[id],lv,true),old=mobStats(BOSSES.alvida_sube,618,true);
   return fresh.hp>old.hp&&fresh.atk>old.atk;
 })""",'both bosses are stronger than Alvida level 618')
 for key, spot in [('glp_ledger','GL_PORT_PLAZA'),('glp_tides','GL_PORT_ARCHIVE')]:
  js(f'[G.P.x,G.P.y]=dawnPx({spot});updateCamera(0,true);1')
  page.wait_for_function(f"interactTarget()?.o?.xact==='{key}'",timeout=5000)
  act()
 check('G.P.glPortQuest.clues===3','both clues recorded')
 js("window.__port=serializeP(G.P);startGame(window.__port,false);1");page.wait_for_timeout(1600)
 check("glpOnFoot()&&G.P.glPortQuest.clues===3",'restore keeps the player ashore with both clues')
 js('[G.P.x,G.P.y]=dawnPx(GL_PORT_PLAZA);updateCamera(0,true);1');page.wait_for_timeout(500)
 page.screenshot(path=str(OUT/'04_campanas_plaza.png'))
 js('[G.P.x,G.P.y]=dawnPx(GL_PORT_BELL);updateCamera(0,true);1')
 for boss in ['glp_broker','glp_warden']:
  page.wait_for_function("interactTarget()?.o?.xact==='glp_bell'",timeout=5000)
  js('doInteract(interactTarget());1')
  check(f"G.ents.some(e=>e.mid==='{boss}'&&e.hp>0&&e.atlas.idx.atk!==undefined)",'correct boss with attack frames')
  js(f"killMob(G.ents.find(e=>e.mid==='{boss}'&&e.hp>0));1")
 check('G.P.glPortQuest.done&&G.P.glPortQuest.beaten===3','port chapter resolves after both fights')
 result=js("(()=>{const P=G.P;[P.x,P.y]=dawnPx(GL_PORT_PIER);IT_CACHE=null;return [glpDockAction(),interactTarget()?.o?.xact,P.map,P.dead,!!G.fading,P.dawnHelm?.kind,P.dawnBoat?.bellhaven,P.hp];})()")
 assert result[1]=='glp_sail', result
 act()
 check("G.P.dawnHelm?.kind==='skiff'&&G.P.glPortQuest.done",'departure preserves chapter completion')
 js('window.__gold=G.P.gold;1')
 js('[G.P.x,G.P.y]=dawnPx(GL_RETURN);1');check("interactTarget()?.o?.xact==='rmc_return'",'return action in Grand Line');act()
 check("G.map.id==='dawn'&&G.P.rmDone===1&&G.P.gold===window.__gold",'return to Dawn preserves progress and reward')
 # Migration of an old 6.63 dock/ship position cannot leave a hero embedded in new rock.
 js("G.P.rmVisual=0;G.P.dawnHelm=null;G.P.dawnBoat={h:dawnHelm('skiff',{x:1800,y:2400}),rmcape:true};setMap(makeDawn(),1553*16+8,1300*16+8,'down');1")
 check("G.P.rmVisual===2&&!G.P.dawnHelm&&Math.hypot(G.P.x-dawnPx(RMC_PIER)[0],G.P.y-dawnPx(RMC_PIER)[1])<20",'6.63 dock saves migrate to the new west pier')
 assert not errors,errors;assert not warnings,warnings
 print(json.dumps({'page_errors':errors,'hook_warnings':warnings,'result':'PASS'},ensure_ascii=False),flush=True);b.close()
