(async()=>{
 const assert=(v,m)=>{if(!v)throw Error(m);},hash=cv=>{let h=2166136261;for(const c of cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data)h=Math.imul(h^c,16777619)>>>0;return h;};
 assert(R143_DESIGNS.length===143,'143 authorized targets');assert(R143_DESIGNS.filter(s=>s.boss).length===57,'57 bosses');
 assert(JSON.stringify(MOBS)===R143_BEFORE.mobs&&JSON.stringify(BOSSES)===R143_BEFORE.bosses,'combat definitions must be unchanged');
 assert(drawHero===R143_PROTECTED.drawHero&&npcAtlas===R143_PROTECTED.npcAtlas&&heroLook===R143_PROTECTED.heroLook&&buildHeroAtlas===R143_PROTECTED.buildHeroAtlas,'player/NPC drawing functions changed');
 for(const[id,d,look]of R143_PROTECTED.npcs)assert(NPCS[id]===d&&NPCS[id].look===look,'NPC changed '+id);
 for(const id of R143_EXCLUDED){const D=id.startsWith('B_')?BOSSES[id.slice(2)]:MOBS[id],A=mobAtlasFor(D.art);assert(!D.art.r143&&!A.r143,'excluded target changed '+id);}
 const stateFields=['hp','maxhp','atk','df','xp','gold','spd','range','rad','hgt','shR','hw','hh','aggroR','hum'];let frames=0,effects=0,combatUnchanged=0;const seen=new Map(),sprites=[];
 for(const S of R143_DESIGNS){const D=S.boss?BOSSES[S.id.slice(2)]:MOBS[S.id],old=r143Legacy(S.originalArt),A=mobAtlasFor(D.art);assert(A.r143===S.id,'tag missing '+S.id);assert(A.fw===old.fw&&A.fh===old.fh&&A.ax===old.ax&&A.ay===old.ay,'anchors changed '+S.id);assert((A.combatWidth||A.fw)===(old.combatWidth||old.fw),'combat width '+S.id);
  if(!A.r143Mirror){const source=await r143Source(S).promise;assert(source.image.naturalWidth===S.cell*5&&source.image.naturalHeight===S.cell,'source layout '+S.id);const directions=[];
   for(const dir of ['down','left','right','up']){const row=DIRI[dir],idle=r143Warp(S,source,dir,'idle',0);assert(idle.getContext('2d').getImageData(0,0,S.cell,S.cell).data.some(v=>v),'empty idle '+S.id);directions.push(hash(idle));
    for(const anim of ['idle','walk','atk','hurt']){const hashes=[];for(let f=0;f<(anim==='idle'?2:anim==='hurt'?1:4);f++){hashes.push(hash(r143Warp(S,source,dir,anim,f)));frames++;}if(anim==='walk'||anim==='atk')assert(new Set(hashes).size>1,anim+' movement missing '+S.id+dir);}
    const c=r143Cell(A,A.idx.atk+1,row,source);assert(c&&c.width===A.fw*3,'HD frame missing '+S.id);
   }assert(directions[0]!==directions[3],'front/back duplicate '+S.id);assert(!seen.has(directions[0]),'duplicate source '+S.id+' '+seen.get(directions[0]));seen.set(directions[0],S.id);
  }else assert(A.img===old.img,'reflection must still copy player');
  for(const dir of ['down','left','right','up'])for(let f=0;f<4;f++){const fx=r143Effect(S,dir,f);assert(fx.getContext('2d').getImageData(0,0,192,192).data.some(v=>v),'empty effect '+S.id);effects++;}
  const id=S.boss?S.id.slice(2):S.id,lv=Array.isArray(D.lv)?D.lv[0]:D.lv,originalRandom=Math.random,saved=D.art;let before,after;
  try{Math.random=()=>.5;D.art=S.originalArt;before=spawnMob(id,lv,64,64,0,null,S.boss);Math.random=()=>.5;D.art=saved;after=spawnMob(id,lv,64,64,0,null,S.boss);}finally{Math.random=originalRandom;D.art=saved;}
  for(const k of stateFields)assert(before[k]===after[k],'combat changed '+S.id+'.'+k+': '+before[k]+' / '+after[k]);combatUnchanged++;
  const snap=stateFields.map(k=>after[k]),fxN=G.fx.length,entN=G.ents.length;after.anim='atk';after.af=1;r143DrawFx(after,0,0);assert(G.fx.length===fxN&&G.ents.length===entN,'VFX gameplay mutation '+S.id);assert(snap.every((v,i)=>v===after[stateFields[i]]),'VFX stat mutation '+S.id);
  before.remove=true;after.remove=true;G.ents=G.ents.filter(e=>e!==before&&e!==after);sprites.push({id:S.id,name:S.name,sourceBytes:S.bytes,movement:S.movement,mirror:!!A.r143Mirror,width:A.fw,height:A.fh});
 }
 for(const kind of Object.keys(R143_LIMIT))assert(R143_BYTES[kind]<=R143_LIMIT[kind],'cache budget '+kind);assert(r143FxBytes<=R143_FX_MAX,'FX cache budget');
 assert(JSON.stringify(MOBS)===R143_BEFORE.mobs&&JSON.stringify(BOSSES)===R143_BEFORE.bosses,'definitions changed during rendering');
 return{ok:true,targets:143,enemies:86,bosses:57,frames,effects,combatUnchanged,excluded:R143_EXCLUDED,playersAndNpcsPreserved:true,cacheBytes:{...R143_BYTES,fx:r143FxBytes},sprites};
})()
