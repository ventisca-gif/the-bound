(()=>{const assert=(ok,m)=>{if(!ok)throw Error(m);};let frames=0;const pictures={};
for(const [key,D] of Object.entries(R8_HD_DATA)){const [id,d]=key.split(/_(?=[0-3]$)/),F=r8HDFrame(id,['down','up','left','right'][+d]);assert(F.pixels.length===D.w*D.h,'decoded size '+key);const raw=atob(D.rle);let n=0;for(let i=0;i<raw.length;i+=3)n+=raw.charCodeAt(i);assert(n===D.w*D.h,'RLE coverage '+key);}
for(const g of ['f','m']){const H=g==='m'?HS_M:HS_F;assert(H.filter(h=>h.r8HD).length===8,'eight detailed entries '+g);assert(H.filter(h=>/^r8_/.test(h.ah||'')).length===8,'eight classic entries '+g);
for(let bt=0;bt<BODY_T[g].length;bt++)for(const [id]of REF8){const hs=H.findIndex(h=>h.r8HD===id),app={g,bt,hs,hair:'azul',hair2:'rosa',skin:2,eyes:'verde',top:[0,'gris'],bot:[0,'negro'],shoe:[0,'negro']};
const L=heroLook('mago',app,{}, {},{});L.weapon=null;assert(L.r8Original,'default original');assert(!L.mirror,'asymmetric independent views');
const restored=normApp(JSON.parse(JSON.stringify({...app,r8Dye:1})));assert(restored.r8Dye===1&&(restored.bt|0)===bt,'saved dye and body');const dye=heroLook('mago',restored,{}, {},{});dye.weapon=null;assert(!dye.r8Original,'custom mode');
for(const dir of DIRS)for(const [anim,f] of [['idle',0],['idle',1],['walk',0],['walk',1],['walk',2],['walk',3],['atk',0],['cast',0],['hurt',0],['kiss',0],['dance',1]]){
 for(const look of [L,dye]){const p=new Pix(48,48);p.t=new Uint8Array(48*48);p.tg=0;drawHero(p,look,dir,anim,f);assert(p._r8Bare,'overlay uses bare original body');assert(Number.isFinite(p.meta.hrx)&&Number.isFinite(p.meta.hy),'finite anchors');
 for(let y=Math.ceil(p.meta.torsoTop);dir!=='up'&&y<48;y++)for(let x=0;x<48;x++){const i=y*48+x;if(p._r8Bare[i])assert(p.d[i]===p._r8Bare[i],'preserve torso '+id+dir+anim);}
 const q=hdDetail(p,hdMats(look));assert(q.d.some(v=>v>>>24),'HD pixels present');frames++;
 }
}
}}
// Real shared-editor DOM handlers; the production game and existing wrappers have loaded.
edTab='pelo';const hs=HS_F.findIndex(h=>h.r8HD==='zero_two'),app=normApp({g:'f',hs,hair:'azul',hair2:'rosa'});const root=document.createElement('div');document.body.appendChild(root);root.innerHTML=appEditorHTML(app,[['pelo','Pelo']]);let refreshed=0;bindAppEditor(root,app,()=>{refreshed++;});
const hair=root.querySelector('[data-ek="hair"][data-ev="verde"]');assert(hair,'existing color selector');hair.click();assert(app.r8Dye===1&&app.hair==='verde','color click selects custom before refresh');root.querySelector('[data-r8tone="original"]').click();assert(!app.r8Dye&&app.hair==='verde'&&app.hair2==='rosa','original does not erase chosen dye');root.querySelector('[data-r8tone="custom"]').click();assert(app.r8Dye===1&&refreshed===3,'custom toggle');root.remove();
return {ok:true,frames,decodedViews:32,bodyStructures:BODY_T.f.length+BODY_T.m.length,editor:'real DOM passed'};
})()
