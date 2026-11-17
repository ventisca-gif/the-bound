"""Full-game rendering, comic-shop purchase, actual wardrobe UI and reload persistence."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
ROOT=Path(__file__).resolve().parents[2]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--allow-file-access-from-files','--no-sandbox'])
 page=b.new_page(viewport={'width':1000,'height':650});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto((ROOT/'dist/test.html').as_uri());page.wait_for_timeout(1500)
 result=page.evaluate('''()=>{
 const assert=(v,m)=>{if(!v)throw Error(m);};let frames=0;
 assert(BODY_T.f.length===5&&BODY_T.m.length===5,'five bodies per sex');
 const fit=fitCheck('c_gi_ref_');assert(!fit.issues.length,JSON.stringify(fit.issues));
 for(const g of ['m','f'])for(let bt=0;bt<5;bt++){
 const H=g==='m'?HS_M:HS_F;
 for(const hs of [0,...H.map((h,i)=>h.r8HD?i:-1).filter(i=>i>=0)]){
 const L=heroLook('guerrero',{g,bt,hs,skin:2,hair:'negro',eyes:'azul',top:[0,'gris'],bot:[0,'gris'],shoe:[0,'gris']},{},GI_PARTS,{});L.weapon=null;L.back=null;
 for(const dir of DIRS)for(let f=0;f<4;f++){
 const pix=new Pix(48,48);pix.t=new Uint8Array(2304);pix.tg=0;drawHero(pix,L,dir,'walk',f);pix.outline(OUTL,false);const q=hdDetail(pix,hdMats(L));
 assert(q.d.some(c=>c>>>24),'HD sprite present');
 // The detail-hair path must retain costume sleeve/sash changes in its bare-body buffer.
 if(pix._r8Bare)for(let i=0;i<pix.d.length;i++)if(pix.t[i]===3&&L.skin.includes(pix.d[i]))assert(pix._r8Bare[i]===pix.d[i],'bare arms retained with detailed hair');
 frames++;
 }
 }
 }
 return {frames,fit:fit.stats,fitIssues:fit.issues.length};
 }''')
 page.click('#tNew');page.wait_for_timeout(400);page.fill('#ccName','Gi Test');page.click('#ccGo');page.wait_for_timeout(1200);page.click('#introOk');page.wait_for_timeout(300)
 sale=page.evaluate('''()=>{
 const P=G.P,ids=Object.values(GI_PARTS);window.hurtPlayer=()=>{};
 const opts=[];for(const hook of DLG_HOOKS)hook({id:'jp_comic_st'},opts);
 const buy=opts.find(o=>o.label.includes('Gi naranja completo'));if(!buy)throw Error('comic shop option missing');
 if(!opts.some(o=>o.label.includes('Cuéntame algo'))||!opts.some(o=>o.label.includes('2.500')))throw Error('existing comics/dialogue missing');
 P.gold=23999;buy.fn();if(P.gold!==23999||ids.some(id=>P.wardrobe.includes(id)))throw Error('insufficient-gold purchase');
 P.gold=24000;buy.fn();if(P.gold!==0||!ids.every(id=>P.wardrobe.includes(id)))throw Error('purchase not delivered');
 buy.fn();if(P.gold!==0||ids.some(id=>P.wardrobe.filter(x=>x===id).length!==1))throw Error('repeat purchase charged');
 return {price:GI_PRICE,parts:ids.length,existingComics:true};
 }''')
 page.evaluate("openPanel('wardrobe')")
 for slot in ['body','legs','feet']:
  page.click('[data-ws="'+slot+'"]');cid=page.evaluate('GI_PARTS.'+slot);page.click('[data-wv="'+cid+'"]')
 page.evaluate('closePanel();saveGame(true)');page.wait_for_timeout(300);page.reload();page.wait_for_timeout(1800);page.click('[data-slot]');page.wait_for_timeout(1500)
 page.evaluate("()=>{const P=G.P;for(const [slot,id]of Object.entries(GI_PARTS))if(!P.wardrobe.includes(id)||P.cos[slot]!==id)throw Error('wardrobe/equip save lost: '+slot);if(P.gold!==0)throw Error('purchase gold not saved');}")
 assert not errors,errors
 result.update({'shop':sale,'wardrobeUI':'passed','reloadPersistence':'passed','errors':errors})
 (ROOT/'tests/gi/result.json').write_text(json.dumps(result,indent=2));print(json.dumps(result));b.close()
