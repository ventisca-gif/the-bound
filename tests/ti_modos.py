"""Prueba de los modos de la Torre Infinita (6.44): equipo de 4 con IA y en línea simulado. Uso: python3 tests/ti_modos.py file://$PWD/dist/test.html"""
import sys, json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--allow-file-access-from-files']); pg=b.new_page(viewport={'width':1200,'height':800}); errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)[:300])); pg.on('console', lambda m: m.type in ('error','warning') and ('hook' in m.text or 'TypeError' in m.text or 'tio' in m.text) and errs.append(m.text[:300]))
    pg.goto(sys.argv[1]); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName','Sergio'); pg.click('#ccGo'); pg.wait_for_timeout(1500)
    try: pg.click('#introOk',timeout=2000)
    except Exception: pass
    r=pg.evaluate("""(async()=>{ const w=ms=>new Promise(r=>setTimeout(r,ms)), P=G.P, out={}; try{ const ca=()=>{try{closeModal();closeDialog();}catch(e){} G.paused=false;}; ca();
      P.lv=300; calcStats(P); const god=setInterval(()=>{P.hp=P.S.maxhp;P.dead=false;P.ifr=5;},50);
      const T0=makeTower(); setMap(T0,(T0.w>>1)*16+8,(T0.h-3)*16,'up'); await w(300);
      tiOpen(); out.btns=[...document.querySelectorAll('#mbody button')].map(b=>b.id); ca();
      // equipo de 4
      tiStart(1,'team'); await w(2800); ca(); out.team={mode:TI.mode, allies:HUNT.allies.map(a=>a.name+':'+(a.id.startsWith('aih_')?'JC':'HN'))};
      await w(6000); out.teamFight={alive:tiAlive(), kills:TI.kills, alliesHp:HUNT.allies.map(a=>a.hp>0)};
      for(const e of G.ents.slice()) if(e.type==='mob'&&e.ti&&!e.dying) killMob(e); await w(700); ca(); tiNext(); await w(2800); ca(); out.team2={floor:TI.floor, allies:HUNT.allies.length};
      tiEnd('left'); await w(1500); ca(); out.teamEnd={allies:HUNT.allies.length, best4:P.ti.best4};
      // en línea (simulado): líder remoto en tu grupo
      const lid='lidr1234'; PARTY.id=lid; const pres=(f,kd)=>({peer:'peer1', presence:{n:'Zoe',c:'mago',a:{g:'f'},g:{},cs:{},l:300,m:'torre_portales',x:P.x+20,y:P.y,d:'down',s:'idle', id:lid, pt:lid, tio:{k:'lidr1234:abc',h:lid,m:4,f,kd}}});
      upsertRemote(pres(1,[])); await w(300); out.invite=!!document.querySelector('#tioJ'); document.querySelector('#tioJ')&&document.querySelector('#tioJ').click(); await w(2800); ca();
      out.joined={mode:TI&&TI.mode, k:TIO&&TIO.k, floor:TI&&TI.floor, alive:tiAlive(), hp:(G.ents.find(e=>e.ti&&e.type==='mob')||{}).maxhp};
      const p2=pres(1,[0,1]); p2.presence.m='torre_infinita'; upsertRemote(p2); await w(200); out.synced={alive:tiAlive(), kd:TIO.kd};
      const p3=pres(2,[]); p3.presence.m='torre_infinita'; upsertRemote(p3); await w(2800); ca(); out.follow={floor:TI.floor};
      const o={}; extraPresence(o); out.myPres=o.tio;
      clearInterval(god); P.hp=1; playerDie(); await w(1500); out.die={ti:!!TI, tio:TIO, map:G.map.id, txt:(document.querySelector('#mbody')||{}).innerText.slice(0,200)};
      }catch(e){out.ERR=String(e.stack||e).slice(0,600);} return out; })()""")
    print(json.dumps(r,ensure_ascii=False,indent=1)); print('ERRS',errs[:8]); b.close()
