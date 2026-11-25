// Original harbor side quests, using the supplied directional character sheets.
const LOGUE_SHEETS={};
for(const [id,url] of Object.entries(LOGUE_IMAGES)){
 const im=new Image();LOGUE_SHEETS[id]=im;im.src=url;
 im.addEventListener('load',()=>{for(const e of G.ents||[])if(e.type==='npc'&&LOGUE_CAST[e.id]?.[1]===id)e.atlas=logueActorAtlas(id);});
}
function logueActorAtlas(id){
 const im=LOGUE_SHEETS[id],atk=LOGUE_SHEETS.smoker_atk;
 if(!im?.naturalWidth)return null;
 return getAtlas('logue_actor_'+id,()=>{
  const a=dawnPixelAtlas(80,72,{idle:0,walk:1,atk:3,hurt:7,dead:7},8,(g,c,r)=>{
   const attack=id==='smoker'&&c>=3&&c<=6&&atk.naturalWidth;
   const source=attack?atk:im,frame=attack?c-3:c===1?1:c===2?2:0;
   g.drawImage(source,frame*160,r*144,160,144,0,0,160,144);
  });
  a.frames={idle:1,walk:2,atk:4,hurt:1,dead:1};return a;
 });
}
const LOGUE_CAST={
 logue_merchant:['Ipponmatsu','merchant',74,163,'Las cajas del puerto no llegaron a mi taller. ¿Puedes averiguar qué pasó?','The harbor crates never reached my workshop. Can you find out what happened?'],
 logue_alvida:['Alvida','alvida',124,179,'Hay mercancía desaparecida. No me interesa un cargamento vacío.','Cargo has gone missing. An empty shipment is no use to me.'],
 logue_bart:['Bartolomeo','bart',110,133,'Vi unas sombras cerca del mercado. Busca a los contrabandistas.','I saw shadows near the market. Look for the smugglers.'],
 logue_officer:['Smoker','smoker',146,81,'El puerto necesita orden. Si quieres ayudar, demuestra tu fuerza en el patio.','The harbor needs order. If you want to help, prove your strength in the yard.'],
 logue_memory:['Gol D. Roger','roger',99,119,'Un recuerdo de los navegantes que dejaron su huella en esta plaza.','A memory of the sailors who left their mark on this square.']
};
for(const [id,[n,art,,,es,en]] of Object.entries(LOGUE_CAST)){
 NPCS[id]={n,title:L2('Puerto de Loguetown','Loguetown harbor'),lines:[L2(es,en)],look:{},atlas:()=>logueActorAtlas(art)};
}
SAVEKEYS.push('logueHarborDone');
const LOGUE_TRIALS=[
 ['logue_smuggler',610,L2('Contrabandista','Smuggler'),124,180,42,3.7],
 ['logue_guard',612,L2('Vigía del muelle','Dock lookout'),104,185,49,4.0],
 ['logue_captain',615,L2('Capitán de la patrulla','Patrol captain'),146,81,68,4.3]
];
for(const [id,lv,n,,,hp,atk] of LOGUE_TRIALS){
 BOSSES[id]={n,lv,hp,atk,def:3.85,spd:82,r:34,where:'Loguetown',art:['logue_actor','smoker'],moves:[],drops:[]};
}
hookAround('mobAtlasFor',(next,art)=>art[0]==='logue_actor'?(logueActorAtlas(art[1])||next(['hum','guard'])):next(art));
function logueActive(P,M){return !!(P&&M?.logue&&!P.dead&&!P.dawnHelm&&logueTile((P.x>>4)-LOGUE_X,(P.y>>4)-LOGUE_Y));}
function logueClear(M){
 const s=M?.logueActors;if(!s)return;
 for(const e of s.cast)e.remove=true;
 if(s.trial){s.trial.remove=true;if(G.bossBar===s.trial)showBoss(null);}
 M.logueActors=null;
}
V33_TICKS.push(()=>{
 const M=G.map,P=G.P;if(!M?.logue)return;
 if(!logueActive(P,M)){logueClear(M);return;}
 if(M.logueActors?.owner!==P){logueClear(M);M.logueActors={owner:P,cast:Object.entries(LOGUE_CAST).map(([id,[,,x,y]])=>spawnNPC(id,...dawnPx(logueAt(x,y)),M.id,{hgt:66,wander:id==='logue_bart'?1:0}))};}
});
hookAfter('setMap',()=>{for(const M of Object.values(G.maps||{}))if(M!==G.map&&M.logueActors)logueClear(M);});
DLG_HOOKS.push((npc,opts)=>{
 if(!npc||!logueActive(G.P,G.map)||npc.id!=='logue_officer')return;
 const P=G.P,S=G.map.logueActors,i=Math.min(3,P.logueHarborDone||0);
 if(!S||S.trial||i>=3)return;
 const [id,lv,n,,,]=LOGUE_TRIALS[i];
 opts.unshift({label:L2('Desafío del puerto · Nv. ','Harbor challenge · Lv. ')+lv,icon:['talk'],fn:()=>{
  closeDialog();if(!logueActive(P,G.map)||S.trial||P.lv<lv){toast(L2('Necesitas nivel ','Required level ')+lv,'info');return;}
  const x=P.x,y=P.y-48;S.trial=spawnMob(id,lv,x,y,0,null,true);S.trial.state='fight';
 }});
});
hookAfter('killMob',(_r,m)=>{
 const S=G.map?.logueActors,P=G.P;if(!S||m!==S.trial||S.owner!==P)return;
 S.trial=null;P.logueHarborDone=Math.min(3,(P.logueHarborDone||0)+1);markDirty(true);
 toast(L2('Desafío del puerto completado ','Harbor challenge completed ')+P.logueHarborDone+'/3','info');
});
