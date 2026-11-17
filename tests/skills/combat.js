(()=>{
 const assert=(v,m)=>{if(!v)throw Error(m);},oldRandom=Math.random;let checked=0,success=0,failed=0;
 function setup(D){let seed=1987;Math.random=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
  const P=newPlayer('Prueba',D.cls,{...DEF_APP,g:'f',bt:4});G.P=P;P.lv=400;initPlayerRuntime(P);P.x=248;P.y=200;P.map=G.map.id;P.dir='down';P.hp=Math.floor(P.S.maxhp*.5);P.mp=1e6;P.slots=[D.id,null,null,null];P.skills={};for(const s of Object.values(SK))if(s.cls===D.cls)P.skills[s.id]=10;P.cds={};P.acts=[];P.busy=0;P.inv=[];P.souls=[{id:'fixture',mid:'slime',lv:400,el:0,b:0}];P.soulSet=['fixture'];SUMMONS=[];G.ents=[P];G.fx=[];G.parts=[];
  const m=spawnMob('slime',400,248,226,0,null,false);m.hp=m.maxhp=1e9;m.df=100;P.target=m;return{P,m};
 }
 function run(D,fn){const{P,m}=setup(D);fn(0);const schedules=P.acts.map(v=>v.t),casts=(P.cds[D.id]||0)>0;
  for(let n=0;n<160;n++){
   const acts=P.acts;P.acts=[];for(const a of acts){a.t-=.05;if(a.t<=0)a.fn();else P.acts.push(a);}
   for(const f of [...G.fx]){f.t+=.05;if(f.cbTick&&f.tick!==undefined){f._testTick=(f._testTick||0)+.05;if(f._testTick>=f.tick){f._testTick=0;f.cbTick(f);}}}G.fx=G.fx.filter(f=>f.t<f.dur);
   for(const e of [...G.ents])if(e.type==='proj'&&!e.remove)updateProj(e,.05);
  }
  const buffs=(P.buffs||[]).map(b=>{const q={...b};delete q.svId;return q});
  return{mp:P.mp,hp:P.hp,cds:P.cds,busy:P.busy,shield:P.shield,x:P.x,y:P.y,buffs,mhp:m.hp,stun:m.stun,slow:m.slow,poison:m.poison,burn:m.burn,freeze:m.freeze,summons:SUMMONS.map(s=>({mid:s.mid,atkM:s.atkM,dur:s.dur,scale:s.scale})),schedules,casts};
 }
 try{for(const D of SV_OF.values()){const a=run(D,SV_BASE_USE),b=run(D,useSkill);assert(JSON.stringify(a)===JSON.stringify(b),'combat changed '+D.id+' '+JSON.stringify({a,b}));checked++;if(b.casts)success++;else failed++;}
  // Fallos reales: sin maná, enfriamiento, muerto y sin almas no disparan nuevas animaciones.
  const D=SV_OF.get('m1');for(const mode of['mana','cooldown','dead']){const{P}=setup(D);if(mode==='mana')P.mp=0;if(mode==='cooldown')P.cds.m1=5;if(mode==='dead')P.dead=true;useSkill(0);assert(!P.svCast,'animation on rejected cast '+mode);}
  const I=SV_OF.get('i1'),{P}=setup(I);P.souls=[];P.soulSet=[];useSkill(0);assert(!P.svCast,'animation on missing souls');
  const remote={cls:'mago',type:'remote',app:DEF_APP,gear:{body:30},cos:{},dir:'down',x:200,y:200};nfxPlay(remote,{k:'sv',id:'m1',dir:'right'});assert(remote.svCast?.id==='m1','remote skill missing');const saved=remote.svCast;nfxPlay(remote,{k:'sv',id:'g1',dir:'left'});assert(remote.svCast===saved,'wrong-class network event accepted');
  return{checked,successfulCasts:success,rejectedCasts:failed,combat:'identical costs, cooldowns, damage, statuses, action times, summons and movement',network:'validated'};
 }finally{Math.random=oldRandom;}
})()
