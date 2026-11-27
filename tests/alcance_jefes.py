"""Prueba 6.47: el golpe de las zonas circulares coincide con la elipse dibujada, daño del Devorador Carmesí y jefes intactos ante jugadores cazadores. Uso: python3 tests/alcance_jefes.py file://$PWD/dist/test.html salida.png"""
import sys, json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--allow-file-access-from-files']); pg=b.new_page(viewport={'width':1200,'height':700}); errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)[:300]))
    pg.goto(sys.argv[1]); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName','Sergio'); pg.click('#ccGo'); pg.wait_for_timeout(1500)
    try: pg.click('#introOk',timeout=2000)
    except Exception: pass
    r=pg.evaluate("""(async()=>{ const w=ms=>new Promise(r=>setTimeout(r,ms)), P=G.P, out={}; try{ const ca=()=>{try{closeModal();closeDialog();}catch(e){} G.paused=false;}; ca();
      P.lv=142; P.attr={str:590,int:58,dex:102,vit:311}; const best=s=>Object.keys(ITEMS).filter(id=>{const it=ITEMS[id]; return it.slot===s&&(!it.cls||it.cls===P.cls)&&(it.lv||1)<=142&&!it.cos&&!it.quest&&!it.curse&&!it.cursedW&&it.price>0;}).sort((a,b)=>(ITEMS[b].lv||1)-(ITEMS[a].lv||1))[0];
      for(const s of ['weapon','head','body','legs','feet','acc','neck']){ const id=best(s); if(id) P.equip[s]={id,up:5}; } calcStats(P); P.hp=P.S.maxhp;
      // zona de prueba: el mismo círculo r=60 centrado en un punto; jugador al lado (dentro), arriba/abajo a 45 px (fuera de la elipse dibujada) y dentro
      const res={}; for(const [k,dx,dy] of [['lado_50',50,0],['abajo_45',0,45],['arriba_45',0,-45],['abajo_30',0,30],['diag',30,25]]){ P.hp=P.S.maxhp; P.ifr=0; const h0=P.hp; let hit=false; telegraph({shape:'circle', x:P.x-dx, y:P.y-dy, r:60, dur:0.05, cb:f=>{ if(dist2(P.x,P.y,f.x,f.y)<f.r*f.r) hurtPlayer(500); }}); await w(300); res[k]=P.hp<h0?'golpe':'nada'; }
      out.zona=res;
      // el Devorador: golpes y daño
      const B=spawnMob('devorador_carmesi', evLevel('albor')+6, P.x+120, P.y, P.L, null, true); B.siege=1; B.noSafe=1; B.aggroR=260; B.maxhp=B.hp=Math.round(B.hp*1.4); B.stompT=G.t+4; SIEGE={town:'albor',round:4,left:1,wait:G.t+999,boss:B};
      const hits=[]; const _hp=hurtPlayer; hurtPlayer=function(){ const h0=P.hp; const r=_hp.apply(this,arguments); if(P.hp<h0) hits.push(+((h0-P.hp)/P.S.maxhp*100).toFixed(1)); if(P.hp<P.S.maxhp*0.3) P.hp=P.S.maxhp; P.dead=false; return r; };
      for(let t=0;t<75;t++){ await w(400); ca(); const a=Math.atan2(P.y-B.y,P.x-B.x); P.x=B.x+Math.cos(a)*45; P.y=B.y+Math.sin(a)*12; } hurtPlayer=_hp; out.devo={n:hits.length, porGolpe:hits.slice(0,20), max:Math.max(...hits), media:+(hits.reduce((a,b)=>a+b,0)/Math.max(1,hits.length)).toFixed(1), seg:30};
      // jefe y jugadores cazadores: no le quitan vida
      for(const m of G.ents) if(m.siege) m.remove=true; SIEGE=null; await w(200); const V=spawnMob('vael', 60, P.x+600, P.y, P.L, null, true); const e=AIH_LIST[0]; e.aih.lv=200; e.x=V.x-20; e.y=V.y; e.ai.st='fight'; e.ai.tgt=V; V._aih=e; V._aihT=G.t; P.x=V.x-900;
      const hp0=V.hp; for(let t=0;t<25;t++){ await w(400); ca(); P.hp=P.S.maxhp; } out.vael={hp0, hp:V.hp, virtual:V._aihV||0, hunterState:e.ai.st};
      }catch(e){out.ERR=String(e.stack||e).slice(0,500);} return out; })()""")
    print(json.dumps(r,ensure_ascii=False)); print('ERRS',errs[:5]); pg.screenshot(path=sys.argv[2]); b.close()
