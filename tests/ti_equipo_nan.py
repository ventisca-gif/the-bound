"""Prueba 6.45: equipo de 4 con jugadores cazadores sin NaN y supervivencia (esquivar, pociones). Uso: python3 tests/ti_equipo_nan.py file://$PWD/dist/test.html"""
import sys, json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--allow-file-access-from-files']); pg=b.new_page(viewport={'width':1200,'height':560}); errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)[:300]))
    pg.goto(sys.argv[1]); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName','Sergio'); pg.click('#ccGo'); pg.wait_for_timeout(1500)
    try: pg.click('#introOk',timeout=2000)
    except Exception: pass
    r=pg.evaluate("""(async()=>{ const w=ms=>new Promise(r=>setTimeout(r,ms)), P=G.P, out={}; try{ const ca=()=>{try{closeModal();closeDialog();}catch(e){} G.paused=false;}; ca();
      P.lv=139; calcStats(P); P.hp=P.S.maxhp; const T0=makeTower(); setMap(T0,(T0.w>>1)*16+8,(T0.h-3)*16,'up'); await w(300);
      // forzar 2 jugadores cazadores en el equipo
      const _hp=huntPick; huntPick=()=>_hp().slice(0,1); tiStart(1,'team'); await w(2800); ca(); huntPick=_hp;
      out.allies=HUNT.allies.map(a=>({n:a.name,jc:!!a.h.aih,hp:a.hp,max:a.maxhp,atk:a.S&&a.S.atk}));
      let nanP=0, nanM=0, floors=1; const god=setInterval(()=>{ if(P.hp<P.S.maxhp*0.5) P.hp=P.S.maxhp; P.dead=false; },100);
      for(let i=0;i<120;i++){ await w(500); ca(); if(!isFinite(P.hp)) nanP++; if(G.ents.some(e=>e.type==='mob'&&e.ti&&!isFinite(e.hp))) nanM++; if(TI&&TI.cleared){ tiNext(); floors++; await w(2800); ca(); } if(floors>=4) break; }
      clearInterval(god); out.res={nanP, nanM, floors, floor:TI&&TI.floor, kills:TI&&TI.kills, allies:HUNT.allies.map(a=>[a.name,Math.round(a.hp),a.maxhp,a.down?'down':'ok'])};
      // instinto de supervivencia en el mundo
      tiEnd('left'); await w(1500); ca(); const W=G.world, c=W.camps.filter(c=>c.lv>=20&&c.lv<=40)[0]; setMap(W,c.x*16+8+200,c.y*16+8,'down'); await w(500); ca();
      const e=AIH_LIST[0]; let dodges=0; const _ft=floatText; floatText=function(x,y,t){ if(t==='ESQUIVA'||t==='DODGE') dodges++; return _ft.apply(this,arguments); };
      for(let i=0;i<40;i++) aihHurt(e, 5, {x:e.x+10,y:e.y}); floatText=_ft; out.surv={dodges, pots:e.ai.pots, st:e.ai.st, hp:+e.ai.hp.toFixed(2)};
      }catch(e){out.ERR=String(e.stack||e).slice(0,500);} return out; })()""")
    print(json.dumps(r,ensure_ascii=False,indent=1)); print('ERRS',errs[:5]); b.close()
