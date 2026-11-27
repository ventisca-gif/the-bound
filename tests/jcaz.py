"""Prueba de los jugadores cazadores (6.44): población, historia, perfil, formas en combate y atacarlos. Uso: python3 tests/jcaz.py file://$PWD/dist/test.html"""
import sys, json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--allow-file-access-from-files']); pg=b.new_page(viewport={'width':1200,'height':800}); errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)[:300])); pg.on('console', lambda m: m.type in ('error','warning') and ('hook' in m.text or 'TypeError' in m.text) and errs.append(m.text[:300]))
    pg.goto(sys.argv[1]); pg.wait_for_timeout(2500); pg.click('#tNew'); pg.wait_for_timeout(400); pg.fill('#ccName','Sergio'); pg.click('#ccGo'); pg.wait_for_timeout(1500)
    try: pg.click('#introOk',timeout=2000)
    except Exception: pass
    r=pg.evaluate("""(async()=>{ const w=ms=>new Promise(r=>setTimeout(r,ms)), P=G.P, out={}; try{ const ca=()=>{try{closeModal();closeDialog();}catch(e){} G.paused=false;}; ca();
      const god=setInterval(()=>{P.hp=P.S.maxhp;P.dead=false;P.ifr=5;},50);
      const W=G.world, c=W.camps.filter(c=>c.lv>=20&&c.lv<=40)[0]; setMap(W,c.x*16+8+200,c.y*16+8,'down'); await w(500); ca();
      out.pop={total:AIH_POP.length, homes:aihHomes().length, here:AIH_LIST.length};
      aihLife(30,true); out.story=AIH_POP.slice(0,3).map(h=>({n:h.name,m:h.W.m,r:h.W.r,j:h.W.j,f:h.W.f,s:h.W.s.map(aihStoryText)}));
      out.moved=AIH_POP.filter(h=>h.W.m!==h.home).length;
      // perfil
      aihProfile(AIH_LIST[0].aih); out.profile=document.querySelector('#mbody').innerText.slice(0,300); ca();
      // formas en combate
      const e=AIH_LIST.find(e=>e.aih.lv>=20)||AIH_LIST[0]; e.aih.W.f=['dragon','hielo']; e.aih.sr='dragon'; aihForm(e,true); await w(300); out.form={tf:e.aih.tf, atlas:e.atlas&&e.atlas._aihK}; aihForm(e,true); out.form2=e.aih.tf; aihForm(e,false);
      // atacarlo sin duelo
      for(const m of G.ents) if(m.type==='mob') m.remove=true; await w(100); P.x=e.x; P.y=e.y+12; P.dir='up'; basicAttack(); await w(300); const hm=G.ents.find(m=>m.aihSrc===e);
      out.hostile={mob:!!hm, hidden:e.hidden, name:hm&&hm.name, lv:hm&&hm.lv};
      if(hm){ hm.hp=Math.round(hm.maxhp*0.5); await w(500); out.hostileForm=e.aih.tf; killMob(hm); await w(300); out.after={hidden:e.hidden, st:e.ai.st, l:e.aih.W.l, story:aihStoryText(e.aih.W.s[e.aih.W.s.length-1])}; }
      // diálogo
      const e2=AIH_LIST.find(x=>!x.hidden); P.x=e2.x+10; P.y=e2.y; openDialog(e2); await w(200); out.dlg={name:document.querySelector('#dname').textContent, title:document.querySelector('#dtitle').textContent, text:(document.querySelector('#dtext')||{}).textContent}; ca();
      clearInterval(god); }catch(e){out.ERR=String(e.stack||e).slice(0,500);} return out; })()""")
    print(json.dumps(r,ensure_ascii=False,indent=1)); print('ERRS',errs[:8]); b.close()
