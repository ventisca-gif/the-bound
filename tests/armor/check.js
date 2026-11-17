(()=>{
 const check=(v,m)=>{if(!v)throw Error(m);};let frames=0,hdFrames=0,hairFrames=0,changed=0;
 const strip=L=>{for(const k of['top','bot','feet','head','back'])if(L[k]?.ap){L[k]={...L[k]};delete L[k].ap;}return L;};
 const pixel=(L,dir,anim,f,old=false)=>{const p=new Pix(48,48);p.t=new Uint8Array(2304);p.tg=0;(old?AP_OLD_DRAW:drawHero)(p,L,dir,anim,f);return p;};
 function compare(L,O,dir,anim,f,hd=false){const p=pixel(L,dir,anim,f),o=pixel(O,dir,anim,f,true),tag=dir+anim+f;
  for(const key of['cx','torsoTop','tx0','tw','th','legTop','base','hx','hy','hrx','hry','ey'])check(p.meta[key]===o.meta[key],'body anchor '+key+tag);
  let diff=0;for(let i=0;i<2304;i++){check((p.d[i]>>>24)===(o.d[i]>>>24),'silhouette changed '+tag+' pixel '+i);if(o.t[i]===5||o.t[i]===6)check(p.d[i]===o.d[i],'face/hair changed '+tag);if(p.d[i]!==o.d[i])diff++;}
  if(diff)changed++;frames++;
  if(hd){p.outline(OUTL,false);o.outline(OUTL,false);const q=hdDetail(p,hdMats(L)),oldq=hdDetail(o,AP_OLD_MATS(O));hdOrn(q,p,L);AP_OLD_ORN(oldq,o,O);
   for(let i=0;i<q.d.length;i++){check((q.d[i]>>>24)===(oldq.d[i]>>>24),'HD silhouette changed '+tag);if(oldq.t[i]===5||oldq.t[i]===6||oldq.t[i]===8)check(q.d[i]===oldq.d[i],'HD face/hair/weapon changed '+tag);}
   hdFrames++;
  }
 }
 check(BODY_T.m.length===5&&BODY_T.f.length===5,'all five bodies per sex');
 for(const cls of AP_CLASSES)for(let t=1;t<=30;t++)for(const g of['m','f'])for(let bt=0;bt<5;bt++){
  const app={...DEF_APP,g,bt,hs:g==='m'?0:6},gear={head:t,body:t,legs:t,feet:t};
  const L=heroLook(cls,app,gear,{},{}),O=strip(AP_OLD_HERO(cls,app,gear,{},{}));L.weapon=null;O.weapon=null;
  for(const dir of DIRS)for(const [an,f]of[['idle',0],['walk',0],['walk',1],['walk',2],['walk',3],['atk',1]])compare(L,O,dir,an,f,bt===4&&[3,10,22,23,24,25,26,30].includes(t));
 }
 // Cada casco con todos los peinados guardables, incluidas las dos familias detalladas.
 const helmets=new Map();for(const cls of AP_CLASSES)for(let t=1;t<=30;t++){const H=gearVis(cls,'head',t);if(H)helmets.set(H.k+':'+H.cover,{cls,t});}
 for(const g of['m','f']){const H=g==='m'?HS_M:HS_F;for(let hs=0;hs<H.length;hs++)for(const {cls,t}of helmets.values()){
  const app={...DEF_APP,g,bt:4,hs,hair:'azul',hair2:'rosa'},gear={head:t,body:3,legs:3,feet:3};const L=heroLook(cls,app,gear,{},{}),O=strip(AP_OLD_HERO(cls,app,gear,{},{}));L.weapon=null;O.weapon=null;
  for(const dir of DIRS){compare(L,O,dir,'idle',0,H[hs].r8HD&&[3,22].includes(t));hairFrames++;}
  const hidden=heroLook(cls,app,gear,{},{hideHelm:true});check(!hidden.head,'hide helmet must reveal original hairstyle');
 }}
 for(const id of AP_COS)for(const g of['m','f'])for(let bt=0;bt<5;bt++){
  const app={...DEF_APP,g,bt},cos={body:id},L=heroLook('guerrero',app,{},cos,{}),O=strip(AP_OLD_HERO('guerrero',app,{},cos,{}));L.weapon=null;O.weapon=null;
  for(const dir of DIRS)compare(L,O,dir,'walk',1,true);
 }
 check(changed>20000,'armor details missing');
 const armor=Object.values(ITEMS).filter(v=>v.t==='armor');check(armor.length===125,'125 armor pieces');let icons=0;
 for(const it of armor)for(const cls of AP_CLASSES){check(it.icon[0]==='ap_gear'&&it.icon[1]===it.id,'item icon '+it.id);const spec=['ap_gear',it.id,cls],p=genIcon(spec);check(p.d.some(v=>v>>>24),'empty icon '+it.id+cls);check(ICON.keys[iconKey(spec)]!==undefined,'icon not registered '+it.id+cls);check(genIcon(spec)===p,'icon cache '+it.id+cls);icons++;}
 let builds=0;const prior=hdBuild;hdBuild=function(){builds++;return prior.apply(this,arguments);};
 try{const L=heroLook('guerrero',DEF_APP,{body:30,legs:30,feet:30},{},{}),A=buildAtlas(L,['idle'],drawHero);check(hdEnsure(A,0,0,true),'HD atlas');const first=builds;for(let n=0;n<1000;n++)check(hdEnsure(A,0,0,true),'cached atlas');check(builds===first,'detail rebuilt every frame');}finally{hdBuild=prior;}
 return{ok:true,bodyStructures:10,equipmentTiers:30,classes:7,armorItems:armor.length,frames,changedFrames:changed,hdFrames,hairFrames,helmetKinds:helmets.size,icons,cachedRendering:'1000 blits without regeneration'};
})()
