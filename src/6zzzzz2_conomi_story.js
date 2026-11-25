const CON_FOES={
 con_hatchan:['Hatchan',601,45,3.79,CON_COURTS.hatchan,SHELLS_CAST_IDS.zoro,'swords'],
 con_kuroobi:['Kuroobi',603,51,4.02,CON_COURTS.kuroobi,BAR_SANJI,'wave'],
 con_chew:['Chew',602,46,3.89,CON_COURTS.chew,SYRUP_USOPP,'water'],
 con_arlong:['Arlong',605,68,4.3,CON_ROOM,SHELLS_CAST_IDS.luffy,'bite']
};
const CON_WINS=['con_hatchan','con_kuroobi','con_chew','con_arlong'];
const CON_INTRO={
 con_hatchan:["¡Seis espadas! ¿También puedes seguir seis brazos?","Six swords! Can you keep track of six arms?"],
 con_kuroobi:["A ver si aguantas el empuje del agua.","Let’s see if you can withstand the force of the water."],
 con_chew:["Corre si quieres. Mi chorro te va a alcanzar.","Run if you like. My shot will catch you."],
 con_arlong:["Este cuarto vale más que todo ese pueblo.","This room is worth more than that whole village."]
};
const CON_NAMES={
 con_nojiko:'Nojiko',con_genzo:'Genzo',con_nami:'Nami',con_nako:'Doctor Nako',con_nazumi:'Nezumi',
 con_bell:'Bell-mère',con_chabo:'Chabo',con_johnny:'Johnny',con_yosaku:'Yosaku'
};
const CON_LOCALS=[
 ['con_nojiko',CON_VILLAGE,'En el huerto aún están los árboles que cuidaba Bell-mère. Nami ha cargado sola con su promesa durante años.','Bell-mère’s trees are still in the orchard. Nami has carried that promise alone for years.'],
 ['con_genzo',conAt(98,106),'El pueblo conoce su trato con Arlong. Seguimos callados para que tuviera una salida.','The village knows about her bargain with Arlong. We kept quiet so she could still walk away.'],
 ['con_nako',conAt(93,109),'Si van al parque, recuerden que sus hombres son más rápidos en el agua.','If you go to the park, remember that his men are faster in the water.'],
 ['con_nazumi',conAt(120,105),'Tengo órdenes de confiscar ese dinero. Qué conveniente que nos avisaran justo dónde buscar.','I have orders to seize that money. How convenient that someone told us exactly where to look.'],
 ['con_bell',CON_ORCHARD,'Aquí crecen las mandarinas de Bell-mère. Nojiko sigue cuidándolas.','Bell-mère’s tangerines grow here. Nojiko still tends them.'],
 ['con_chabo',CON_GOSA,'Cuando volvimos, Gosa estaba en silencio. Diles en Cocoyashi que todavía hay gente aquí.','When we returned, Gosa was silent. Tell Cocoyashi that people are still here.'],
 ['con_nami',CON_PROMISE,'Creí que podía comprar la libertad del pueblo. Ahora sé que Arlong nunca pensó cumplir su parte.','I thought I could buy the village’s freedom. Now I know Arlong never planned to keep his word.'],
 ['con_johnny',conAt(38,79),'Esperaremos aquí con los vecinos. Mira bien las piscinas cuando atravieses la puerta.','We’ll wait here with the villagers. Watch the pools once you pass the gate.'],
 ['con_yosaku',conAt(42,80),'Si alguien cae al agua, nosotros tenemos la cuerda lista.','If someone falls in the water, we have the rope ready.']
];
const CON_STYLE={con_nojiko:{g:'f',hs:7,hair:'azul',top:[1,'celeste']},con_genzo:{g:'m',hs:1,top:[1,'marron']},con_nako:{g:'m',hs:4,hair:'gris',top:[1,'blanco']},con_nazumi:{g:'m',hs:1,top:[1,'blanco']},con_bell:{g:'f',hs:6,hair:'rojo',top:[1,'verde']},con_chabo:{g:'m',hs:1,top:[1,'verde']}};
for(const [id,,es,en] of CON_LOCALS){
 const borrowed={con_nami:ORANGE_NAMI,con_johnny:'baratie_johnny',con_yosaku:'baratie_yosaku'}[id];
 NPCS[id]={n:CON_NAMES[id],title:CONOMI_NAME,lines:[L2(es,en)],look:heroLook('guerrero',{...DEF_APP,...CON_STYLE[id]}, {},{},{}),atlas:borrowed?()=>npcAtlas(borrowed):undefined};
}
for(const [id,[n,lv,hp,atk]] of Object.entries(CON_FOES)){
 BOSSES[id]={n,lv,hp,atk,def:3.85,spd:id==='con_arlong'?110:81,r:36,where:'Arlong Park',art:['conomi',id],moves:[],drops:[]};
 DAWN_RETO[id]=id==='con_arlong'?2.03:1.85;
 NPCS[id]={n,title:'Arlong Park',look:{},lines:[L2('Hasta aquí llega tu camino.','Your journey ends here.')],atlas:()=>conomiAtlas(id)};
}
{const old=mobAtlasFor;mobAtlasFor=function(art){return art[0]==='conomi'?conomiAtlas(art[1]):old.apply(this,arguments);};}
{const old=bossWhere;bossWhere=function(id){return CON_FOES[id]?{loc:CON_GATE,where:'Arlong Park',m:'dawn'}:old.apply(this,arguments);};}
SAVEKEYS.push('conomiChapter','conomiCleared');
const conomiStep=P=>clamp(P.conomiChapter??(P.conomiCleared?7:0),0,7);
function conomiStoryStep(step,at,label){
 const P=G.P;P.conomiChapter=step;markDirty(true);
 if(at)setWp({loc:at,m:'dawn',t:label||CONOMI_NAME});
}
function conomiSetScene(M,kind,cast){
 M.conomi.scene={kind,at:G.t,beat:0,cast,owner:G.P};
}
function conomiActor(M,id,at,dx=0,dy=0,dir='down'){
 const [x,y]=dawnPx(at);return spawnNPC(id,x+dx,y+dy,M.id,{face:dir,scene:true,noTalk:true,hgt:62});
}
function conomiClear(M){
 const S=M?.conomi;if(!S)return;
 for(const e of [...S.locals,...(S.run?.crew||[]),...(S.run?.foes||[]),...(S.scene?.cast||[])])if(!e.dying)e.remove=true;
 if(S.run?.foes.includes(G.bossBar))showBoss(null);
 S.run=null;S.locals=[];S.scene=null;S.stage=null;
}
function conomiCast(M,P){
 const S=M.conomi,step=conomiStep(P);
 for(const e of S.locals)e.remove=true;
 S.locals=CON_LOCALS.filter(([id])=>id!=='con_nazumi'||step<2).map(([id,at])=>spawnNPC(id,...dawnPx(at),M.id,{face:'down',hgt:59}));
 const key=CON_WINS[step-2];
 if(key&&key!=='con_arlong')S.locals.push(spawnNPC(key,...dawnPx(CON_FOES[key][4]),M.id,{face:'down',hgt:73}));
 if(step===7)for(const e of S.locals)if(e.id==='con_nami'||e.id==='con_genzo'){
  e.def={...e.def,lines:[e.id==='con_nami'?L2('Cuando quieras, volvemos al mar. Esta vez yo trazo el rumbo.','Whenever you’re ready, we can sail. This time I chart the course.'):
   L2('Voy a girar el molinillo hacia el puerto. Que Nami lo vea desde el barco.','I’ll turn the pinwheel toward the harbor. Let Nami see it from the boat.')]};
 }
 if(step===7){
  const fallen=conomiActor(M,'con_arlong',conAt(39,55),0,0,'left');
  fallen.noTag=true;setAnim(fallen,'dead');S.locals.push(fallen);
 }
 if(step===5)S.locals.push(spawnNPC('con_arlong',...dawnPx(CON_ROOM),M.id,{face:'down',hgt:83}));
 S.stage=step;S.owner=P;
}
function conomiActive(R){
 return !!R&&G.map?.conomi?.run===R&&R.owner===G.P&&!G.P.dead;
}
function conomiAsk(){
 const M=G.map,P=G.P;
 if(!M?.conomi||M.conomi.scene||conomiStep(P)!==1)return;
 conomiMove(CON_PROMISE);P.y+=65;
 const nami=conomiActor(M,'con_nami',CON_PROMISE,0,0),luffy=conomiActor(M,SHELLS_CAST_IDS.luffy,CON_PROMISE,-60,10,'right');
 const local=M.conomi.locals.find(e=>e.id==='con_nami');if(local)local.remove=true;
 conomiSetScene(M,'promise',[nami,luffy]);
}
function conomiStart(id){
 const M=G.map,P=G.P,S=M?.conomi,def=CON_FOES[id];
 if(!S||P.dead||P.dawnHelm||S.run||S.scene||CON_WINS[conomiStep(P)-2]!==id)return;
 const [n,lv,,,at,ally]=def;
 if(!conomiNear(P,at,105))return;
 const [x,y]=dawnPx(at);
 conomiMove(at);P.y+=65;
 for(const e of S.locals)if(e.id===id)e.remove=true;
 const m=spawnMob(id,lv,x,y-16,0,null,true),e=conomiActor(M,ally,at,-59,37,'up');
 m.hgt=id==='con_arlong'?86:73;m.state='fight';m.cd=1.4;
 const a=syrupCrewStats(P,ally,lv);
 Object.assign(e,{hp:a.hp,maxhp:a.hp,shellsDefense:a.def,lv:a.lv,syrupReach:a.reach,syrupBoost:a.boost,nextAssist:G.t+.8});
 S.run={id,at,foes:[m],crew:[e],owner:P};
 shellsRescueSpeak(m,...CON_INTRO[id]);
 showBoss(m);sfx('boss');banner(n,L2('Nivel ','Level ')+lv);
}
function conomiStrike(R,m,mode,target){
 const M=G.map,dx=target.x-m.x,dy=target.y-m.y,a=Math.atan2(dy,dx);
 const travel=mode==='water'?142:mode==='bite'?105:76,r=mode==='wave'?62:mode==='swords'?53:27;
 const x=m.x+Math.cos(a)*Math.min(travel,Math.hypot(dx,dy)),y=m.y+Math.sin(a)*Math.min(travel,Math.hypot(dx,dy));
 const t=mode==='water'?.65:.85,col=mode==='swords'?'#eedbb5':'#6cdcf4';
 m.dir=dirFromVec(dx,dy);setAnim(m,'atk');m.actionLength=t+.28;m.actionUntil=G.t+t+.28;
 telegraph({shape:'circle',x,y,r,dur:t,col:col+'55'});
 addFx({type:'conomiStrike',mode,x:m.x,y:m.y-14,ex:x,ey:y-14,r,a,col,delay:t,dur:t+.36,tick:t,cbTick(f){
  if(f.fired||!conomiActive(R)||m.dying||m.remove)return;
  f.fired=true;
  for(const e of [G.P,...R.crew]){
   if(!e.hp||dist2(e.x,e.y,x,y)>r*r)continue;
   const dmg=m.atk*(mode==='bite'?1.18:1);
   if(e===G.P)hurtPlayer(dmg,{lv:m.lv,dawnReto:m});
   else shellsHurtAlly(e,dmg*(e.hp<e.maxhp/2?.40:.64),m.lv);
  }
  if(mode==='bite'){
   const d=Math.min(68,Math.hypot(dx,dy));
   for(let j=0;j<6;j++)moveEnt(M,m,Math.cos(a)*d/6,Math.sin(a)*d/6);
  }
  burst(x,y,mode==='wave'?23:12,{sp:110,up:21,g:60,life:.38,c:[col,'#eaf9f9']});
 }});
}
{const old=updateBoss;updateBoss=function(m,dt,d,dh,spd,moveTo){
 const def=CON_FOES[m.mid];
 if(!def)return old.apply(this,arguments);
 const M=G.map,R=M?.conomi?.run;
 if(!conomiActive(R)||!R?.foes.includes(m))return;
 if(m.actionUntil>G.t){baratiePose(m);return;}
 const n=m.conTurns||0,e=R.crew[0],target=n%3===1&&e.hp>0?e:G.P;
 const dx=target.x-m.x,dy=target.y-m.y,dist=Math.hypot(dx,dy);
 const mode=m.mid==='con_arlong'&&n%3===0?'wave':def[6];
 const reach=mode==='water'?143:mode==='bite'?105:mode==='wave'?125:76;
 if(m.cd<=0&&dist<reach){m.conTurns=n+1;m.cd=m.hp<m.maxhp*.4?1.83:2.48;conomiStrike(R,m,mode,target);return;}
 if(dist>(mode==='water'?108:40)){m.dir=dirFromVec(dx,dy);moveEnt(M,m,dx/dist*spd*dt,dy/dist*spd*dt);setAnim(m,'walk',true);}
 else setAnim(m,'idle',true);
};}
function conomiAlly(M,R,e,dt){
 const m=R.foes[0];
 if(e.hp<=0||m.dying||m.remove)return;
 if(e.actionUntil>G.t){baratiePose(e);return;}
 if(crewTechniqueAttack(M,e,m,R.foes,()=>conomiActive(R),e.syrupBoost,.24))return;
 const d=Math.atan2(G.P.y-m.y,G.P.x-m.x)+1.45;
 shellsActorMove(M,e,m.x+Math.cos(d)*e.syrupReach*.73,m.y+Math.sin(d)*e.syrupReach*.73,dt);
}
function conomiFinale(M){
 const luffy=conomiActor(M,SHELLS_CAST_IDS.luffy,CON_ROOM,-31,36,'right');
 const arlong=conomiActor(M,'con_arlong',CON_ROOM,24,24,'left');
 conomiSetScene(M,'finale',[luffy,arlong]);
}
{const old=bossKilled;bossKilled=function(m){
 const M=G.map,S=M?.conomi,R=S?.run,result=old.apply(this,arguments);
 if(!R?.foes.includes(m))return result;
 for(const e of R.crew)e.remove=true;S.run=null;S.stage=null;
 if(m.mid==='con_arlong'){conomiFinale(M);return result;}
 const step=conomiStep(G.P)+1,next=CON_WINS[step-2];
 conomiStoryStep(step,next==='con_arlong'?CON_PARK:CON_FOES[next][4],'Arlong Park');
 banner(CON_FOES[m.mid][0],L2('La tripulación gana terreno.','The crew gains ground.'));
 return result;
};}
function conomiSceneTick(M,S,dt){
 const P=G.P,R=S.scene,t=G.t-R.at,[a,b]=R.cast;
 if(R.kind==='promise'){
  if(R.beat===0){R.beat++;shellsRescueSpeak(a,'Lo intenté sola. ¿Todavía puedes ayudarme?','I tried to do it alone. Can you still help me?');setAnim(a,'hurt');}
  if(R.beat===1&&t>2.4){R.beat++;a.conHat=true;shellsRescueSpeak(b,'Guárdame el sombrero. Vamos a liberar tu pueblo.','Hold on to my hat. We’re going to free your village.');setAnim(b,'atk');}
  if(t>5.8){a.remove=b.remove=true;S.scene=null;S.stage=null;conomiStoryStep(2,CON_GATE,'Arlong Park');}
  return;
 }
 if(R.beat===0){R.beat++;shellsRescueSpeak(b,'¡Esos mapas me pertenecen!','Those charts belong to me!');}
 if(R.beat===1&&t>1.2){R.beat++;setAnim(b,'atk');setAnim(a,'hurt');burst(a.x,a.y-16,12,{sp:70,up:12,g:55,life:.5,c:['#f7e1a0','#edb280']});}
 conomiAxeTick(R,t);
 if(t>CON_AXE_END){
  a.remove=b.remove=true;S.scene=null;S.stage=null;
  P.conomiCleared=true;conomiStoryStep(7,CON_VILLAGE,'Cocoyashi');
  conomiMove(CON_PROMISE);
  xMsg(L2('La navegante del Going Merry','The Going Merry’s navigator'),[
   L2('Nami: Déjame elegir el rumbo. Esta vez salgo al mar porque quiero.','Nami: Let me choose the heading. This time I’m going to sea because I want to.'),
   L2('Usopp: Llevaré una carta limpia al Merry. La primera ruta la dibujas tú.','Usopp: I’ll bring a blank chart to the Merry. You draw our first course.'),
   L2('Luffy: Entonces vamos. Te guardamos el timón.','Luffy: Then let’s go. We saved you the helm.')
  ].join('<br><br>'));
 }
}
V33_TICKS.push(dt=>{
 const M=G.map,P=G.P,S=M?.conomi;
 if(!S||!P)return;
 const t=conomiTile((P.x>>4)-CONOMI_X,(P.y>>4)-CONOMI_Y);
 if(P.dead||P.dawnHelm||!t||((S.scene?.owner||S.run?.owner||S.owner||P)!==P)){
  if(S.run||S.scene||S.locals.length)conomiClear(M);return;
 }
 if(S.scene){conomiSceneTick(M,S,dt);return;}
 if(S.run){
  if(!conomiNear(P,S.run.at,380)){conomiClear(M);return;}
  for(const e of S.run.crew)conomiAlly(M,S.run,e,dt);
 }else if(S.stage!==conomiStep(P))conomiCast(M,P);
});
{const old=setMap;setMap=function(M){const prev=G.map,r=old.apply(this,arguments);if(prev!==G.map&&prev?.conomi)conomiClear(prev);return r;};}
XACT.conomi_enter=[L2('Entrar en la sala de mapas','Enter the map room'),'ways',()=>conomiMove(CON_ENTRY)];
XACT.conomi_exit=[L2('Volver al patio','Return to the courtyard'),'ways',()=>conomiMove(CON_PARK)];
{const old=interactTarget;interactTarget=function(){
 const P=G.P,S=G.map?.conomi;
 if(!S||!P||P.dead)return old.apply(this,arguments);
 const key=conomiDockKey();if(key)return rareAction(key);
 if(S.scene)return null;
 if(!P.dawnHelm&&!S.run){
  if(conomiNear(P,CON_ENTRY,36))return rareAction('conomi_exit');
  if(conomiStep(P)===5&&conomiNear(P,CON_PARK,43))return rareAction('conomi_enter');
 }
 return old.apply(this,arguments);
};}
DLG_HOOKS.push((npc,opts)=>{
 const P=G.P,M=G.map,S=M?.conomi,step=conomiStep(P);
 if(!S||!npc||S.scene||S.run||P.dawnHelm)return;
 const add=(a,b,fn)=>opts.unshift({label:L2(a,b),icon:['talk'],fn:()=>{closeDialog();fn();}});
 if(npc.id==='con_nojiko'&&step===0)add('Escuchar la historia de Nami','Hear Nami’s story',()=>{
  conomiStoryStep(1,CON_PROMISE,'Nami');
  xMsg(L2('La promesa de Cocoyashi','Cocoyashi’s promise'),[
   L2('Nojiko: Bell-mère nos enseñó a salir adelante con el huerto. Arlong le quitó la vida y se llevó a Nami para hacer cartas náuticas.','Nojiko: Bell-mère taught us to get by with the orchard. Arlong took her life and took Nami to make sea charts.'),
   L2('Genzo: Nami juntó cien millones para comprar el pueblo. Arlong mandó a Nezumi por el dinero. Está en el sendero, cerca de casa.','Genzo: Nami saved a hundred million to buy the village. Arlong sent Nezumi for the money. She’s on the path near home.')
  ].join('<br><br>'));
 });
 if(npc.id==='con_nami'&&step===1)add('Acercarse a Nami','Approach Nami',conomiAsk);
 if(CON_WINS[step-2]===npc.id){const [name]=CON_FOES[npc.id];add('Enfrentar a '+name,'Fight '+name,()=>conomiStart(npc.id));}
 if(npc.id==='con_nojiko'&&step===7)add('Revivir la historia de Conomi','Replay Conomi’s story',()=>{
  conomiClear(M);conomiStoryStep(0,CON_VILLAGE,'Cocoyashi');conomiCast(M,P);
 });
});
GSIS.push(['conomi',CONOMI_NAME,()=>[
 L2('Después de reclutar a Sanji en Baratie, navega hasta Conomi y busca a Nojiko.','After recruiting Sanji at Baratie, sail to Conomi and find Nojiko.'),
 L2('Zoro contra Hatchan, Sanji contra Kuroobi y Usopp contra Chew. Tú y Luffy enfrentan a Arlong (605) en la sala de mapas.','Zoro versus Hatchan, Sanji versus Kuroobi and Usopp versus Chew. You and Luffy face Arlong (605) in the map room.'),
 L2('Habla con Nojiko tras liberar el pueblo para repetir la historia.','Talk to Nojiko after freeing the village to replay the story.')
],()=>({m:'dawn',loc:CON_MOOR,t:CONOMI_NAME})]);
function conomiNavigate(M,P,aboard){
 if(!M?.conomi||!P.baratieSanji||conomiStep(P)>=7)return null;
 if(aboard)return [CON_MOOR,CONOMI_NAME];
 const tile=conomiTile((P.x>>4)-CONOMI_X,(P.y>>4)-CONOMI_Y);
 if(!tile)return null;
 const step=conomiStep(P);
 return [step===0?CON_VILLAGE:step===1?CON_PROMISE:step>=5?(tile==='archive'?CON_ROOM:CON_PARK):CON_FOES[CON_WINS[step-2]][4],CONOMI_NAME];
}
{const old=updatePlayer;updatePlayer=function(dt){
 const S=G.map?.conomi;
 if(S?.scene?.owner===G.P)return;
 return old.apply(this,arguments);
};}
const conomiGuide=gsisRef('conomi');
LUPA_DAWN.push(['conomi',()=>CONOMI_NAME,conomiGuide[2],conomiGuide[3]]);
XACT.alvida_replay=[L2('Revivir el abordaje de Alvida','Replay Alvida’s boarding'),'ways',()=>{
 const M=G.map,P=G.P;
 if(M?.id===AD_DECK&&P?.alvidaMace===2&&conomiNear(P,AD_CLAIM,42)&&!M.alvidaRun?.crew.some(e=>!e.dying&&!e.remove)&&(!M.alvidaRun?.boss||M.alvidaRun.boss.dying||M.alvidaRun.boss.remove))alvidaStart(M,true);
}];
{const old=interactTarget;interactTarget=function(){
 const M=G.map,P=G.P,R=M?.alvidaRun;
 if(M?.id===AD_DECK&&P?.alvidaMace===2&&conomiNear(P,AD_CLAIM,40)&&
  !R?.crew.some(e=>!e.dying&&!e.remove)&&(!R?.boss||R.boss.dying||R.boss.remove))return rareAction('alvida_replay');
 return old.apply(this,arguments);
};}
{const attack=basicAttack,skill=useSkill,hurt=hurtPlayer;
 basicAttack=function(){if(!G.map?.conomi?.scene)return attack.apply(this,arguments);};
 useSkill=function(){if(!G.map?.conomi?.scene)return skill.apply(this,arguments);};
 hurtPlayer=function(){if(!G.map?.conomi?.scene)return hurt.apply(this,arguments);};
}
