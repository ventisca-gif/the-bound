(()=>{
 const assert=(v,m)=>{if(!v)throw Error(m);},hash=p=>{let h=2166136261;for(const c of p.d)h=Math.imul(h^c,16777619)>>>0;return h;};
 assert(SV_OF.size===122,'122 active skills');let frames=0,hd=0,effects=0;const signatures=new Set();
 for(const D of SV_OF.values()){
  assert(SV_ART[D.id],D.id+' missing art direction');const sig=[];
  for(const dir of DIRS)for(let f=0;f<12;f+=2){const cv=svEffect(D.id,f,'cast',dir),a=cv.getContext('2d').getImageData(0,0,128,128).data;let h=2166136261;for(const c of a)h=Math.imul(h^c,16777619)>>>0;sig.push(h);assert(a.some(v=>v),'empty effect '+D.id);effects++;}
  const key=sig.join(':');assert(!signatures.has(key),'duplicate effect '+D.id);signatures.add(key);
  for(const g of['m','f'])for(let bt=0;bt<5;bt++){
   const app={...DEF_APP,g,bt,hs:g==='m'?0:6},L=heroLook(D.cls,app,{head:D.variant%2?3:0,body:30,legs:30,feet:30,weapon:5},{},{});L.svId=D.id;L.mirror=false;
   for(const dir of DIRS){const movement=[];for(let f=0;f<12;f++){const p=new Pix(48,48);p.t=new Uint8Array(2304);p.tg=0;drawHero(p,L,dir,'sv_skill',f);assert(p.d.some(v=>v>>>24),'empty sprite '+D.id);assert(p.meta.bt===bt,'body structure changed');assert(p.meta.tw===(p.meta.side?(L.btS?.sw||8):(L.btS?.tw||(g==='f'?9:10))),'torso width changed');
    const base={...L};delete base.svId;const ps=svPose(D,dir,f,L),original=SV_OLD_POSE; // Compare the exact same pose through the existing body renderer.
    heroPose=function(di,an,fr,look){return look===base?ps:original.apply(this,arguments);};const q=new Pix(48,48);q.t=new Uint8Array(2304);q.tg=0;
    try{drawHero(q,base,dir,'idle',0);}finally{heroPose=function(di,an,fr,look){const d=look?.svId&&SV_OF.get(look.svId);return an==='sv_skill'&&d?svPose(d,di,fr,look):original.apply(this,arguments);};}
    for(let i=0;i<p.d.length;i++)if(p.t[i]===5||p.t[i]===6)assert(p.d[i]===q.d[i],'face/hair changed '+D.id+dir);
    movement.push(hash(p));frames++;
    if(bt===4&&f===4){p.outline(OUTL,false);const hq=hdDetail(p,hdMats(L));hdOrn(hq,p,L);assert(hq.d.some(v=>v>>>24),'HD empty');hd++;}
   }assert(new Set(movement).size>1,'static pose '+D.id+dir);}
  }
 }
 assert(SV_ATLASES.size<=4&&SV_FX_CACHE.size<=96,'cache exceeded');
 return{ok:true,activeSkills:SV_OF.size,passiveSkills:Object.values(SK).filter(s=>s.type==='pas'&&AP_CLASSES.includes(s.cls)).length,frames,hdFrames:hd,effects,uniqueEffects:signatures.size,bodies:10,directions:4};
})()
