(()=>{
 const check=(v,m)=>{if(!v)throw Error(m)},P=G.P,old={gold:P.gold,dances:P.dances,dk:P.dk,emote:P.emote,anim:P.anim,af:P.af,at:P.at,emoteT:P.emoteT,loop:P.loopAnim},dirtyFn=markDirty,netFn=netPresence,out={purchases:0,frames:0,clockFrames:0};
 let saves=0;markDirty=()=>saves++;netPresence=()=>{};
 try{
  check(Object.keys(DANCE_SHOP).length===10,'ten dances');P.dances=['clasico','macarena','marinera'];P.gold=0;
  check(!danceShopBuy('thriller')&&P.gold===0&&P.dances.length===3,'insufficient funds');check(!doDance('thriller'),'locked dance played');check(!danceShopBuy('__proto__')&&!danceShopBuy('unknown'),'invalid id');P.gold=1000000;const stats=JSON.stringify(P.S);
  for(const [k,D]of Object.entries(DANCE_SHOP)){const g=P.gold;check(danceShopBuy(k)&&P.gold===g-D.pr,'purchase '+k);check(P.dances.includes(k),'missing collection');const b=P.gold;check(danceShopBuy(k)&&b===P.gold,'double purchase');out.purchases++;check(doDance(k)&&P.dk===k&&P.anim==='dance','existing emote path');const seen=new Set();for(let i=0;i<64;i++){stepAnim(P,.08,7);seen.add(P.af)}check(seen.size===32,'animation stuck at four '+k);out.clockFrames+=seen.size;
   const r={type:'remote',hum:true,anim:'dance',dk:k,af:0,at:0,loopAnim:true};for(let i=0;i<17;i++)stepAnim(r,.08,7);check(r.af===17,'remote clock');const o={};socialPresence(o);check(o.dk===k,'network dance missing');check(emoPopHTML().includes('data-emd="'+k+'"'),'not in old button');
  }
  check(JSON.stringify(P.S)===stats,'stats changed');check(P.dances.includes('macarena')&&P.dances.includes('marinera'),'old dances lost');check(saves===10,'purchase not saved once');const data=serializeP(P);check(data.dances.length===13,'collection missing from save');const loaded=JSON.parse(JSON.stringify(data));danceCollection(loaded);check(loaded.dances.length===13,'reload lost purchase');const fresh={};danceCollection(fresh);check(fresh.dances.join(',')==='clasico','old save default');danceCollection({dances:['__proto__',null,'clasico']});
  const remote={type:'remote',hum:true,anim:'dance',dk:'macarena',af:0,at:0};check(animN(remote,'dance')===4,'old dance frames changed');
 }finally{markDirty=dirtyFn;netPresence=netFn;Object.assign(P,old);P.loopAnim=old.loop;}
 // Native HD poses, with current and future-compatible hair/body anchors.
 for(const g of ['f','m'])for(let bt=0;bt<5;bt++)for(const k of Object.keys(DANCE_SHOP)){
  const L=heroLook('guerrero',{...DEF_APP,g,bt,hs:g==='f'?ADO_HS.f:3,hair:'negro',eyes:'cafe'},{body:6,legs:6,feet:6},{},{});L.back=null;L.weapon=null;
  for(const dir of DIRS)for(const f of [0,4,8,12,16,20,24,28]){const p=new Pix(48,48);p.t=new Uint8Array(2304);p.tg=0;drawHero(p,L,dir,'dz_'+k,f);p.outline(OUTL,false);const q=hdDetail(p,hdMats(L));hdOrn(q,p,L);check(q.d.some(v=>v>>>24),'blank pose');check(q.d.every((v,i)=>!(v>>>24)||i>=q.w&&i<q.w*(q.h-1)),'clipped pose '+g+bt+k+dir+f);out.frames++;}
 }
 WDB.cache.clear();for(const k of Object.keys(DANCE_SHOP))dancePreviewAtlas(P,k);check(WDB.cache.size<=3,'preview cache not bounded');return{ok:true,...out,previewCache:WDB.cache.size};
})()
