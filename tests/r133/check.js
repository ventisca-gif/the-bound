(()=>{const assert=(v,m)=>{if(!v)throw Error(m);},hash=p=>{let h=2166136261;for(const c of p.d)h=Math.imul(h^c,16777619)>>>0;return h;};
 assert(JSON.stringify(MOBS)===R133_ALL_BEFORE.mobs&&JSON.stringify(BOSSES)===R133_ALL_BEFORE.bosses,'all combat definitions preserved');
 assert(R133_DESIGNS.length===133,'133 exact designs');assert(R133_DESIGNS.filter(s=>s.boss).length===14,'14 bosses');
 let frames=0,effects=0;const duplicate=new Map(),sprites=[],unchanged=[];
 const stateFields=['hp','maxhp','atk','df','xp','gold','spd','range','rad','hgt','shR','hw','hh','aggroR','hum'];
 for(const S of R133_DESIGNS){const D=S.boss?BOSSES[S.id.slice(2)]:MOBS[S.id];assert(JSON.stringify(D)===R133_BEFORE[S.id],'definition changed beyond art tag: '+S.id);
 const A=mobAtlasFor(D.art),old=r133Legacy(S.originalArt);assert(A.fw===old.fw&&A.fh===old.fh&&A.ax===old.ax&&A.ay===old.ay,'atlas anchors '+S.id);assert(A.combatWidth===(old.combatWidth||old.fw),'combat width '+S.id);
 const pictures=[];
 for(const dir of ['down','left','right','up']){
  const idle=r133Paint(S,dir,'idle',0),walks=[],attacks=[];
  for(const anim of ['idle','walk','atk','hurt'])for(let f=0;f<(anim==='idle'?2:anim==='hurt'?1:4);f++){
   const p=r133Paint(S,dir,anim,f),h=hash(p);assert(p.d.some(c=>c>>>24),'empty '+S.id+dir+anim+f);
   if(anim==='walk')walks.push(h);if(anim==='atk')attacks.push(h);frames++;
  }
  assert(new Set(walks).size>1,'walk needs movement: '+S.id+dir);assert(new Set(attacks).size>1,'attack needs movement: '+S.id+dir);
  const row=DIRI[dir];for(let f=0;f<4;f++){const cv=r133Cell(A,A.idx.atk+Math.min(f,(S.originalArt[0]==='hum'?4:3)-1),row);assert(cv.width===A.fw*2,'HD frame');const fx=r133Effect(S,dir,f);assert(fx.getContext('2d').getImageData(0,0,96,96).data.some(v=>v),'empty VFX '+S.id);effects++;}
  pictures.push(hash(idle));
 }
 assert(pictures[0]!==pictures[3],'front and back must be drawn separately: '+S.id);
 const h=pictures[0];assert(!duplicate.has(h),'identical redesign: '+S.id+' / '+duplicate.get(h));duplicate.set(h,S.id);
 const lv=Array.isArray(D.lv)?D.lv[0]:D.lv,id=S.boss?S.id.slice(2):S.id;
 const saved=D.art;D.art=S.originalArt;const before=spawnMob(id,lv,64,64,0,null,S.boss);D.art=saved;const after=spawnMob(id,lv,64,64,0,null,S.boss);
 for(const k of stateFields)assert(before[k]===after[k],'combat changed '+S.id+'.'+k+': '+before[k]+' / '+after[k]);
 before.remove=true;unchanged.push(S.id);assert(after.atlas.r133===S.id,'spawn uses redesign '+S.id);
 // VFX-only renderer must not alter entity state or add gameplay effects.
 const snap=stateFields.map(k=>after[k]);after.anim='atk';after.af=1;const fxN=G.fx.length,entN=G.ents.length;r133DrawFx(after,0,0);assert(G.fx.length===fxN&&G.ents.length===entN,'VFX gameplay side effect '+S.id);assert(snap.every((v,i)=>v===after[stateFields[i]]),'VFX changed stats '+S.id);
 after.remove=true;
 sprites.push({id:S.id,name:S.name,family:S.family,oldArt:S.originalArt,width:A.fw,height:A.fh});
 }
 assert(r133FrameBytes<=R133_FRAME_MAX,'frame cache over budget');assert(r133AtlasBytes<=R133_ATLAS_MAX,'atlas cache over budget');
 return {ok:true,targets:133,enemies:119,bosses:14,frames,effects,combatUnchanged:unchanged.length,cacheBytes:{frames:r133FrameBytes,atlases:r133AtlasBytes},sprites};})()
