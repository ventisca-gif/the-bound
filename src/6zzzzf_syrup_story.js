const SYRUP_SHAM='syrup_sham',SYRUP_BUCHI='syrup_buchi',SYRUP_JANGO='syrup_jango',SYRUP_CAPTAIN='syrup_kuro';
const SYRUP_KAYA='syrup_kaya',SYRUP_MERRY='syrup_merry';
SAVEKEYS.push('syrupClue','syrupManorWarned','syrupUsopp');
const SYRUP_BOSSES={
 [SYRUP_SHAM]:['Sham',572,SYRUP_NORTH,21,3.36,124,65],
 [SYRUP_BUCHI]:['Buchi',572,SYRUP_NORTH,24,3.57,63,79],
 [SYRUP_JANGO]:['Jango',572,SYRUP_WOOD,40,3.65,85,76],
 [SYRUP_CAPTAIN]:['Kuro',580,SYRUP_KURO,53,3.86,111,85]
};
for(const [id,[n,lv,,hp,atk,spd]] of Object.entries(SYRUP_BOSSES)){
 BOSSES[id]={n,lv,where:SYRUP_NAME,art:['syrup',id],hp,atk,def:3.43,spd,r:36,moves:[],drops:[]};
}
{const old=mobAtlasFor;mobAtlasFor=function(art){return art[0]==='syrup'?syrupAtlas(art[1]):old.apply(this,arguments);};}
{const old=bossWhere;bossWhere=function(id){return SYRUP_BOSSES[id]?{loc:SYRUP_BOSSES[id][2],where:SYRUP_NAME,m:'dawn'}:old.apply(this,arguments);};}
const SYRUP_NPCS=[
 [SYRUP_USOPP,'Usopp',L2('Tirador de Villa Syrup','Syrup Village sharpshooter'),[952,776],
  L2('Normalmente nadie me hace caso. Esta vez vi un barco apagando sus luces frente a la costa.','Nobody usually listens to me. This time I saw a ship dousing its lights off the coast.')],
 [SYRUP_KAYA,'Kaya',L2('Mansión de los altos','Hilltop manor'),[991,767],
  L2('Usopp siempre me cuenta lo que hay más allá de la colina. Hoy vino a advertirme de algo que lo asusta de verdad.','Usopp always tells me what lies beyond the hill. Today he came to warn me about something that really frightens him.')],
 [SYRUP_MERRY,'Merry',L2('Mayordomo y diseñador naval','Steward and ship designer'),[987,767],
  L2('Reconozco esa proa. Diseñé el Going Merry para que cualquier tripulación pudiera llevarlo con confianza.','I recognize that bow. I designed the Going Merry so any crew could sail it with confidence.')],
 ['syrup_ninjin','Ninjin',L2('Piratas de Usopp','Usopp Pirates'),[946,779],L2('Si el capitán dice que nos escondamos, yo busco un camino seguro para Kaya.','If the captain tells us to hide, I’ll find a safe way out for Kaya.')],
 ['syrup_piman','Piiman',L2('Piratas de Usopp','Usopp Pirates'),[996,773],L2('Puedo llevar un aviso al pueblo. Nadie me verá por los pastos.','I can get a warning to the village. Nobody will spot me through the pasture.')],
 ['syrup_tamanegi','Tamanegi',L2('Piratas de Usopp','Usopp Pirates'),[992,813],L2('Hay un sendero corto detrás de los árboles. ¡Vengan por aquí!','There’s a shortcut behind the trees. Come this way!')],
 ['syrup_meshi','Lina',L2('Meshi · comedor del pueblo','Meshi · village eatery'),[940,777],L2('Todas las mañanas Usopp grita que llegan piratas. Hoy ni se detuvo a tomar aire.','Usopp shouts about pirates every morning. Today he didn’t even stop to catch his breath.')],
 ['syrup_west','Teo',L2('Casas de los pastos','Pasture Cottages'),[849,871],L2('La cuesta del norte tiene buen camino, pero esta mañana bajaron dos tipos con garras.','The north slope is an easy walk, but two fellows with claws came down it this morning.')],
 ['syrup_east','Mara',L2('Casas del alto','Hilltop Cottages'),[1104,830],L2('Al anochecer vi un anillo reflejarse entre los árboles. Desde entonces cierro la puerta temprano.','At dusk I saw a ring glint between the trees. I’ve shut my door early ever since.')],
 ['syrup_dock','Dario',L2('Muelle de Villa Syrup','Syrup Village pier'),[954,751],L2('Aquí el mar guarda silencio antes del amanecer. Un barco sin fanales puede acercarse hasta las rocas.','The sea goes quiet before dawn here. A ship without lanterns can get right up to the rocks.')]
];
const SYRUP_LOCALS={
 syrup_meshi:{g:'f',bt:1,skin:1,hs:6,hair:'marron',top:'rojo',bot:'beige'},
 syrup_west:{g:'m',bt:2,skin:3,hs:5,hair:'marron',top:'verde',bot:'marron'},
 syrup_east:{g:'f',bt:2,skin:2,hs:8,hair:'negro',top:'azul',bot:'gris'},
 syrup_dock:{g:'m',bt:3,skin:2,hs:0,hair:'negro',top:'amarillo',bot:'gris'}
};
for(const [id,n,title,,line] of SYRUP_NPCS){
 const style=SYRUP_LOCALS[id];
 const look=style?heroLook('guerrero',{...DEF_APP,...style,top:[1,style.top],bot:[0,style.bot]}, {},{},{}):{};
 if(style)look.weapon=null;
 NPCS[id]={n,title,look,lines:[line],atlas:style?undefined:()=>syrupAtlas(id)};
}
const syrupWon=(id,P=G.P)=>!!P?.bossKills?.[id];
const syrupPairDone=P=>syrupWon(SYRUP_SHAM,P)&&syrupWon(SYRUP_BUCHI,P);
function syrupStage(P){
 if(syrupWon(SYRUP_CAPTAIN,P))return P.syrupUsopp?'done':'recruit';
 if(syrupWon(SYRUP_JANGO,P))return 'captain';
 if(syrupPairDone(P))return 'forest';
 return P.syrupClue?P.syrupManorWarned?'slope':'manor':'village';
}
function syrupNext(P){
 switch(syrupStage(P)){
  case 'manor':return SYRUP_MANOR;
  case 'slope':return SYRUP_NORTH;
  case 'forest':return SYRUP_WOOD;
  case 'captain':return SYRUP_KURO;
  case 'recruit':return SYRUP_PIER;
  default:return SYRUP_VILLAGE;
 }
}
function syrupCrewWaypoint(M,P,aboard){
 if(!M.syrup||!P.rareDone)return null;
 if(aboard&&!P.syrupUsopp)return [SYRUP_MOOR,SYRUP_NAME];
 return syrupLand(M,P.x,P.y)?[syrupNext(P),SYRUP_NAME]:null;
}
function syrupDockKey(){
 const M=G.map,P=G.P,H=P?.dawnHelm;
 if(!M?.syrup||!P||P.dead||G.fading)return null;
 if(H&&H.kind!=='swim'&&dist2(P.x,P.y,...dawnPx(SYRUP_MOOR))<53**2){
  return dfHas()&&P.dawnCrewJoined&&P.rareDone?'syrup_land':'syrup_locked';
 }
 return !H&&P.dawnBoat?.syrup&&dist2(P.x,P.y,...dawnPx(SYRUP_PIER))<38**2?'syrup_sail':null;
}
function syrupDock(landing){
 if(syrupDockKey()!==(landing?'syrup_land':'syrup_sail'))return;
 dawnIslandDock(landing,'syrup',SYRUP_PIER,SYRUP_MOOR,SYRUP_NAME,L2('Sigue el camino hasta el pueblo y busca a Usopp.','Follow the road to the village and find Usopp.'));
}
XACT.syrup_locked=[L2('Desembarco de Villa Syrup cerrado','Syrup Village landing closed'),'ways',()=>toast(!dfHas()?
 L2('Necesitas la Fruta del Diablo.','You need the Devil Fruit.'):
 L2('Reúne a tu tripulación y termina la historia de Gaimon en la Isla de los Animales Raros.','Gather your crew and finish Gaimon’s story on the Island of Rare Animals.'),'info',5)];
XACT.syrup_land=[L2('Desembarcar en Villa Syrup','Land at Syrup Village'),'ways',()=>syrupDock(true)];
XACT.syrup_sail=[L2('Volver al Going Merry','Return to the Going Merry'),'ways',()=>syrupDock(false)];
{const old=interactTarget;interactTarget=function(){const k=syrupDockKey();return k?rareAction(k):old.apply(this,arguments);};}

const SYRUP_ALLIES={
 [SHELLS_CAST_IDS.luffy]:[40000,3800,114],
 [SHELLS_CAST_IDS.zoro]:[47500,4400,39],
 [ORANGE_NAMI]:[34500,3350,56],
 [SYRUP_USOPP]:[43500,4160,135]
};
function syrupCrewStats(P,id,lv=580){
 const [hp,def,reach]=SYRUP_ALLIES[id];
 const wins=[MORGAN_ID,ORANGE_CABAJI,ORANGE_BUGGY,SYRUP_SHAM,SYRUP_BUCHI,SYRUP_JANGO,SYRUP_CAPTAIN].filter(key=>syrupWon(key,P)).length;
 const growth=wins*.058+Math.max(0,lv-550)*.003;
 const baseline=id===SYRUP_USOPP||id===BAR_SANJI?580:550+wins*4;
 const allyLevel=Math.max(baseline,Math.min(lv,P.lv||lv,700));
 return {hp:Math.round(hp*(1+growth)),def:Math.round(def*(1+growth*.63)),boost:1+growth*.52,reach,lv:allyLevel};
}
const SYRUP_ENCOUNTERS={
 slope:{at:SYRUP_NORTH,foes:[SYRUP_SHAM,SYRUP_BUCHI],crew:[SHELLS_CAST_IDS.zoro],
  title:L2('Zoro y los hermanos felinos','Zoro and the Cat Brothers')},
 forest:{at:SYRUP_WOOD,foes:[SYRUP_JANGO],crew:[SYRUP_USOPP],
  title:L2('Nami y Usopp protegen a Kaya','Nami and Usopp protect Kaya')},
 captain:{at:SYRUP_KURO,foes:[SYRUP_CAPTAIN],crew:[SHELLS_CAST_IDS.luffy],
  title:L2('Luffy y tú contra Kuro','Luffy and you versus Kuro')}
};
function syrupRunning(M,R){return G.map===M&&M.syrup.run===R&&!G.P.dead;}
function syrupClear(M){
 const S=M?.syrup,R=S?.run;if(!R)return;
 for(const e of [...R.foes,...R.crew])if(!e.dying)e.remove=true;
 if(R.foes.includes(G.bossBar))showBoss(null);
 S.run=null;
}
function syrupMoveScene(M,at){
 const P=G.P,[x,y]=dawnPx(at);
 P.x=x;P.y=y;P.L=0;P.dir='up';P.target=null;updateCamera(0,true);prewarm(M);netPresence(true);
}
function syrupStart(stage){
 const M=G.map,P=G.P,D=SYRUP_ENCOUNTERS[stage];
 if(!M?.syrup||M.syrup.run||!D||P.dead||P.dawnHelm||syrupStage(P)!==stage)return;
 const [x,y]=dawnPx(D.at);
 syrupMoveScene(M,[D.at[0],D.at[1]+4]);
 const foes=D.foes.filter(id=>!syrupWon(id)).map((id,i)=>{
  const [,,,,,,,height]=SYRUP_BOSSES[id],m=spawnMob(id,BOSSES[id].lv,x+(i?42:-22),y+3,0,null,true);
  Object.assign(m,{state:'fight',cd:1.3+i*.65,hgt:height,shR:17,syrupTurns:0});return m;
 });
 const lv=foes[0].lv;
 const chosen=DAWN_CREW.filter(([id],i)=>id!==ORANGE_NAMI&&(dawnCrewMask(P)&(1<<i))).map(([id])=>id);
 const mandatory=P.kuroRematch&&chosen.length?[]:D.crew;
 const roster=stage==='captain'?[...new Set([...mandatory,...chosen])].slice(0,3):D.crew;
 const crew=roster.map((id,i)=>{
  const a=syrupCrewStats(P,id,lv),e=spawnNPC(id,x+[-62,63,0][i],y+(i===2?69:43),M.id,{face:'up',scene:true,noTalk:true,hgt:id===SYRUP_USOPP?57:63});
  Object.assign(e,{hp:a.hp,maxhp:a.hp,shellsDefense:a.def,syrupBoost:a.boost,syrupReach:a.reach,lv:a.lv,nextAssist:G.t+.95+i*.6});
  return e;
 });
 const R=M.syrup.run={stage,foes,crew,at:D.at,owner:P};
 showBoss(foes[0]);sfx('boss');banner(D.title,'Nivel '+lv);
 if(stage==='slope')shellsRescueSpeak(crew[0],'Sham es rápido. Buchi no lo es, pero mira dónde va a caer.','Sham is quick. Buchi isn’t, but watch where he lands.');
 if(stage==='forest')shellsRescueSpeak(crew[0],'¡Nami, no mires el anillo! Voy a cortarle el paso.','Nami, don’t look at the ring! I’ll cut him off.');
 if(stage==='captain'&&!P.kuroRematch)shellsRescueSpeak(crew[0],'Yo lo saco de las sombras. Tú golpea cuando se pare.','I’ll draw him out of the shadows. You hit him when he stops.');
}
const SYRUP_SCENES={
 manor:[
  L2('Usopp: Kaya, el mayordomo al que llamas Klahadore es el capitán Kuro. Esta noche piensa regresar al mando del barco.','Usopp: Kaya, the steward you call Klahadore is Captain Kuro. Tonight he plans to take command of the ship again.'),
  L2('Kaya: Encontré una carta tuya junto a sus mapas, Usopp. Ahora entiendo por qué preguntaba tanto por los caminos.','Kaya: I found a letter from you beside his charts, Usopp. Now I understand why he kept asking about the roads.'),
  L2('Merry: Llevaré a Kaya con los chicos si el camino se cierra. Ustedes vayan hacia la cuesta del norte.','Merry: I’ll get Kaya to the children if the road closes. You head for the north slope.')
 ],
 clue:[
  L2('Usopp: El hombre que sirve a Kaya se reunió con alguien del barco. Oí cómo hablaban de atacar antes del amanecer.','Usopp: The man who serves Kaya met someone from the ship. I heard them talking about striking before sunrise.'),
  L2('Nami: Hay dos caminos desde el agua. Si avisamos a Kaya y cubrimos la cuesta del norte, no nos sorprenderán por ambos lados.','Nami: There are two roads from the water. If we warn Kaya and cover the north slope, they can’t surprise us on both sides.'),
  L2('Luffy: Vamos contigo, Usopp. Muéstranos el camino.','Luffy: We’re coming with you, Usopp. Show us the way.')
 ],
 slope:[
  L2('Zoro: Dos siluetas salen del desfiladero. Yo voy al frente, tú cúbreme el costado.','Zoro: Two figures are coming out of the pass. I’ll take the front. Cover my flank.'),
  L2('Sham: El de las espadas se queda conmigo. Buchi, tráeme al otro.','Sham: The swordsman is mine. Buchi, bring me the other one.')
 ],
 forest:[
  L2('Kaya: Los chicos conocen un camino entre los setos. Iré con ellos.','Kaya: The children know a path through the hedge. I’ll go with them.'),
  L2('Nami: Usopp, llévalo al claro. Desde los árboles no puedo ver por dónde viene ese anillo.','Nami: Usopp, draw him into the clearing. I can’t see where that ring is coming from in the trees.'),
  L2('Usopp: Haré ruido por la izquierda. Que Kaya tenga tiempo de salir.','Usopp: I’ll make noise on the left. Give Kaya time to get out.')
 ],
 captain:[
  L2('Kuro: Planeé esta noche durante años. No contaba con que un pueblo entero le hiciera caso a Usopp.','Kuro: I planned this night for years. I didn’t count on a whole village listening to Usopp.'),
  L2('Luffy: La gente de aquí tiene nombres. Él se molestó en aprendérselos.','Luffy: The people here have names. He bothered to learn them.'),
  L2('Luffy: Vamos. Cuando se mueva, fíjate en las huellas.','Luffy: Let’s go. When he moves, watch his tracks.')
 ],
 recruit:[
  L2('Kaya: El pueblo está a salvo. Merry y yo revisamos su barco. Puede llegar mucho más lejos que estas costas.','Kaya: The village is safe. Merry and I looked over your ship. It can take you far beyond these shores.'),
  L2('Usopp: Nunca he salido tan lejos del pueblo. Si tienen un puesto para un tirador, quiero probar.','Usopp: I’ve never been far from the village. If you have room for a sharpshooter, I want to try.'),
  L2('Luffy: ¡Sube, Usopp! Nami, pon su nombre en la lista.','Luffy: Get aboard, Usopp! Nami, put his name on the list.')
 ]
};
function syrupAddOption(opts,label,fn){opts.unshift({label,icon:['talk'],fn});}
DLG_HOOKS.push((npc,opts)=>{
 const M=G.map,P=G.P;
 if(!M?.syrup||!npc.syrupLocal||!P?.dawnCrewJoined||!P.rareDone||M.syrup.run)return;
 const stage=syrupStage(P);
 if(stage==='village'&&npc.id===SYRUP_USOPP){
  syrupAddOption(opts,L2('Escuchar la advertencia','Hear the warning'),()=>showLines(SYRUP_SCENES.clue,()=>{
   P.syrupClue=true;markDirty(true);closeDialog();setWp({loc:SYRUP_MANOR,m:'dawn',t:SYRUP_NAME});
  }));return;
 }
 if(stage==='manor'&&npc.id===SYRUP_KAYA){
  syrupAddOption(opts,L2('Advertir a Kaya','Warn Kaya'),()=>showLines(SYRUP_SCENES.manor,()=>{
   P.syrupManorWarned=true;markDirty(true);closeDialog();setWp({loc:SYRUP_NORTH,m:'dawn',t:SYRUP_NAME});
  }));return;
 }
 if(stage==='recruit'&&npc.id===SYRUP_USOPP){
  syrupAddOption(opts,L2('Reclutar a Usopp · nivel 580','Recruit Usopp · level 580'),()=>showLines(SYRUP_SCENES.recruit,()=>{
   P.syrupUsopp=true;markDirty(true);closeDialog();sfx('quest');
   banner(L2('Usopp · nivel 580','Usopp · level 580'),L2('Tirador de la tripulación. Ya puedes elegirlo en el puesto del muelle.','Crew sharpshooter. You can now select him at the pier sign.'));
  }));return;
 }
 const D=SYRUP_ENCOUNTERS[stage];
 const lead=stage==='slope'?SHELLS_CAST_IDS.zoro:stage==='forest'?ORANGE_NAMI:SHELLS_CAST_IDS.luffy;
 if(D&&npc.id===lead&&dist2(P.x,P.y,...dawnPx(D.at))<120**2){
  syrupAddOption(opts,D.title,()=>showLines(SYRUP_SCENES[stage],()=>{closeDialog();syrupStart(stage);}));
 }
});
function syrupLocals(M,P){
 const S=M.syrup,stage=syrupStage(P);
 for(const e of S.locals)e.remove=true;
 S.locals=[];S.lead=null;S.sceneStage=stage;S.sceneOwner=P;
 for(const [id,,,at] of SYRUP_NPCS){
  if(id===SYRUP_USOPP&&P.syrupUsopp)continue;
  if(id===SYRUP_USOPP&&stage==='recruit'){
   S.locals.push(spawnNPC(id,...dawnPx([950,742]),M.id,{syrupLocal:true,hgt:57}));continue;
  }
  S.locals.push(spawnNPC(id,...dawnPx(at),M.id,{syrupLocal:true,hgt:id===SYRUP_USOPP?57:49,wander:['syrup_west','syrup_east','syrup_dock'].includes(id)?2:0,face:'down'}));
 }
 const D=SYRUP_ENCOUNTERS[stage];
 if(D){
  const id=D.crew[0],[x,y]=D.at,e=spawnNPC(id,...dawnPx([x,y+2]),M.id,{syrupLocal:true,hgt:64,face:'down'});
  e.def={...e.def,lines:[SYRUP_SCENES[stage][0]]};S.lead=e;
  S.locals.push(e);
 }
}

function syrupStrikeFx(M,R,m,target,kind){
 const P=G.P,area=kind==='stomp'||kind==='hypnosis';
 const aim={x:target.x,y:target.y},dx=aim.x-m.x,dy=aim.y-m.y,d=Math.hypot(dx,dy)||1;
 const reach=kind==='rush'?Math.min(205,d+32):kind==='ring'?Math.min(235,d+38):Math.min(110,d+18);
 const point=area?aim:{x:m.x+dx/d*reach,y:m.y+dy/d*reach};
 const late=kind==='stomp'?.78:kind==='hypnosis'?.95:kind==='rush'?.55:.51;
 const radius=kind==='stomp'?66:kind==='hypnosis'?53:kind==='ring'?18:21;
 const origin={x:m.x,y:m.y},color=kind==='hypnosis'?'#c888e4':kind==='stomp'?'#d7a16e':kind==='ring'?'#ffcf82':'#e49580';
 const intersects=e=>{
  if(area)return dist2(e.x,e.y,point.x,point.y)<radius**2;
  const vx=point.x-origin.x,vy=point.y-origin.y;
  const t=clamp(((e.x-origin.x)*vx+(e.y-origin.y)*vy)/(vx*vx+vy*vy||1),0,1);
  return dist2(e.x,e.y,origin.x+vx*t,origin.y+vy*t)<radius**2;
 };
 m.dir=dirFromVec(dx,dy);setAnim(m,'atk');
 m.syrupActionAt=G.t;m.syrupActionEnd=G.t+late+.25;
 m.syrupHazard={until:G.t+late,intersects,origin,point,area};
 if(area)telegraph({shape:'circle',x:point.x,y:point.y,r:radius,dur:late,col:color+'46'});
 else telegraph({shape:'line',x:origin.x,y:origin.y,w:radius*2,len:reach,ang:Math.atan2(dy,dx),dur:late,col:color+'34'});
 addFx({type:'syrupCast',ground:true,x:origin.x,y:origin.y,origin,point,area,radius,kind,color,dur:late+.18,tick:late,cbTick(f){
  if(f.fired||!syrupRunning(M,R)||m.remove||m.dying)return;f.fired=true;
  const base=m.atk*(kind==='stomp'?1.08:kind==='rush'?1.20:kind==='hypnosis'?.54:.85);
  for(const e of [P,...R.crew]){
   if(e.hp<=0||!intersects(e))continue;
   if(e===P){
    hurtPlayer(base,{lv:m.lv,dawnReto:m});
    if(kind==='hypnosis'&&!P.dead)P.slowT=Math.max(P.slowT||0,1.4);
   }else{
    const guard=e.hp<e.maxhp*.48;
    if(guard&&!e.syrupGuard){e.syrupGuard=true;shellsRescueSpeak(e,'Aún puedo seguir.','I can still keep going.');}
    shellsHurtAlly(e,base*(guard?.49:.71),m.lv);e.syrupHurtAt=G.t+.28;
    if(kind==='hypnosis')e.nextAssist=Math.max(e.nextAssist,G.t+1.65);
   }
  }
  if(kind==='rush'){
   const nodes=Math.ceil(reach/9);
   m.afterimages=[{...origin,until:G.t+.24}];
   for(let i=0;i<nodes;i++){
    const x=m.x,y=m.y;moveEnt(M,m,dx/d*reach/nodes,dy/d*reach/nodes);
    if(dist2(x,y,m.x,m.y)<.25)break;
    if(i%4===0)m.afterimages.push({x,y,until:G.t+.24+i*.008});
   }
  }
  burst(point.x,point.y,kind==='stomp'?18:8,{sp:91,up:11,g:52,life:.34,c:[color,'#fff0c7']});
 }});
}
for(const id of Object.keys(SYRUP_BOSSES))DAWN_RETO[id]=id===SYRUP_CAPTAIN?1.92:1.7;
{const old=updateBoss;updateBoss=function(m,dt,d,dh,spd,moveTo){
 if(!SYRUP_BOSSES[m.mid])return old.apply(this,arguments);
 const M=G.map,P=G.P,R=M.syrup?.run;
 if(!R?.foes.includes(m)||P.dead)return;
 if(m.syrupActionEnd>G.t){m.af=clamp(Math.floor((G.t-m.syrupActionAt)/(m.syrupActionEnd-m.syrupActionAt)*4),0,3);return;}
 const active=R.crew.filter(e=>e.hp>0);
 const target=active.length&&m.syrupTurns%3!==1?active[m.syrupTurns%active.length]:P;
 const x=target.x-m.x,y=target.y-m.y,dist=Math.hypot(x,y);
 const frenzy=m.mid===SYRUP_CAPTAIN&&m.hp<m.maxhp*.46;
 const kind=m.mid===SYRUP_BUCHI?'stomp':m.mid===SYRUP_JANGO?(m.syrupTurns%2===0?'hypnosis':'ring'):
  m.mid===SYRUP_CAPTAIN&&(frenzy||m.syrupTurns%2===0)?'rush':'slash';
 const range=kind==='ring'?211:kind==='rush'?188:kind==='slash'?88:126;
 if(m.cd<=0&&dist<range){
  if(frenzy&&!m.syrupFrenzy){
   m.syrupFrenzy=true;shellsRescueSpeak(m,'A partir de ahora, ni mis pasos escucharás.','From now on you won’t even hear my footsteps.');
  }
  if(kind==='hypnosis')floatText(m.x,m.y-83,L2('Péndulo','Pendulum'),'#d9afec');
  m.syrupTurns++;m.cd=frenzy?1.7:m.mid===SYRUP_BUCHI?2.8:2.3;
  syrupStrikeFx(M,R,m,target,kind);return;
 }
 if(dist>(m.mid===SYRUP_JANGO?110:kind==='rush'?92:42)){
  m.dir=dirFromVec(x,y);moveEnt(M,m,x/dist*spd*dt,y/dist*spd*dt);setAnim(m,'walk',true);
 }else setAnim(m,'idle',true);
};}
function syrupAssistHit(M,R,e,target,amount){
 if(!syrupRunning(M,R)||e.hp<=0||target.remove||target.dying||target.hp<target.maxhp*(R.stage==='slope'?.22:.28))return;
 hitMob(target,Math.min(amount*e.syrupBoost,target.maxhp*.019),{summon:true});
}
function syrupFirePellet(M,e,m,reach,impact){
 const P=G.P,turn=(e.syrupShots||0)+1,powder=turn%3===0;
 e.syrupShots=turn;
 e.dir=dirFromVec(m.x-e.x,m.y-e.y);setAnim(e,'atk');
 e.actionLength=.66;e.actionUntil=G.t+e.actionLength;e.nextAssist=G.t+1.8;
 const [dx,dy]=DIRV[e.dir],origin={x:e.x+dx*13,y:e.y+dy*9},point={x:m.x,y:m.y};
 const travel=clamp(Math.hypot(point.x-origin.x,point.y-origin.y)/480,.12,.31),release=.36;
 const col=powder?'#fff09b':'#e1c98a',hitAt=release+travel;
 addFx({type:'syrupAssist',x:origin.x,y:origin.y,origin,point,usopp:true,powder,col,release,travel,dur:hitAt+.16,tick:hitAt,cbTick(f){
  if(f.fired||G.map!==M||G.P!==P||P.dead||e.remove||e.hp===0||m.remove||m.dying)return;
  f.fired=true;
  if(d2(e,m)>reach**2||dist2(m.x,m.y,point.x,point.y)>(powder?51:35)**2)return;
  impact(powder?1.29:1);
  if(powder){
   addFx({x:m.x,y:m.y-9,type:'boom',r:22,dur:.34,col:'#ef9647'});
   floatText(m.x,m.y-52,L2('Estrella de pólvora','Gunpowder Star'),'#ffe495');
  }
  burst(m.x,m.y-12,powder?14:5,{sp:powder?105:60,up:12,g:70,life:.26,c:[col,'#fff0bc']});
 }});
}
function syrupRangedAssist(M,R,e,m){
 if(e.id===SYRUP_USOPP){
  syrupFirePellet(M,e,m,e.syrupReach+22,boost=>syrupAssistHit(M,R,e,m,m.maxhp*.015*boost));
  return;
 }
 e.dir=dirFromVec(m.x-e.x,m.y-e.y);setAnim(e,'atk');e.actionLength=.5;e.actionUntil=G.t+.5;e.nextAssist=G.t+1.9;
 const origin={x:e.x,y:e.y},point={x:m.x,y:m.y},col='#84e9c9';
 addFx({type:'syrupAssist',x:e.x,y:e.y,origin,point,col,dur:.46,tick:.3,cbTick(f){
  if(f.fired)return;f.fired=true;
  if(dist2(e.x,e.y,m.x,m.y)>(e.syrupReach+22)**2)return;
  syrupAssistHit(M,R,e,m,m.maxhp*.013);
  burst(m.x,m.y-12,6,{sp:66,up:12,g:63,life:.22,c:[col,'#fff0bc']});
 }});
}
function syrupAllyTick(M,R,e,dt){
 if(e.hp<=0||e.syrupHurtAt>G.t)return;
 if(e.actionUntil>G.t){
  const n=animN(e,e.anim);e.af=clamp(Math.floor(n*(1-(e.actionUntil-G.t)/e.actionLength)),0,n-1);return;
 }
 const m=R.foes.find(m=>!m.dying&&!m.remove);if(!m)return;
 const danger=R.foes.map(b=>b.syrupHazard).find(h=>h&&h.until>G.t&&h.intersects(e));
 if(danger){
  let dx,dy;
  if(danger.area){dx=e.x-danger.point.x;dy=e.y-danger.point.y;}
  else{dx=danger.origin.y-danger.point.y;dy=danger.point.x-danger.origin.x;
   if((e.x-danger.origin.x)*dx+(e.y-danger.origin.y)*dy<0){dx=-dx;dy=-dy;}
  }
  const d=Math.hypot(dx,dy)||1;
  if(!dx&&!dy)dx=1;
  e.dir=dirFromVec(dx,dy);moveEnt(M,e,dx/d*dt*112,dy/d*dt*112);setAnim(e,'walk',true);stepAnim(e,dt,12);
  return;
 }
 if(crewTechniqueAttack(M,e,m,R.foes,()=>syrupRunning(M,R),e.syrupBoost,.27))return;
 const reach=e.syrupReach,zoro=e.id===SHELLS_CAST_IDS.zoro,luffy=e.id===SHELLS_CAST_IDS.luffy;
 if(!CREW_TECHNIQUES[e.id]&&d2(e,m)<reach**2&&G.t>=e.nextAssist){
  if(zoro||luffy)shellsAssistAttack(M,R,e,zoro,m,(M,R,target,base)=>syrupAssistHit(M,R,e,target,base));
  else syrupRangedAssist(M,R,e,m);
  return;
 }
 const a=Math.atan2(G.P.y-m.y,G.P.x-m.x)+(zoro||e.id===ORANGE_NAMI?1.68:-1.15);
 shellsActorMove(M,e,m.x+Math.cos(a)*reach*.75,m.y+Math.sin(a)*reach*.75,dt);
}
{const old=drawFx;drawFx=function(f,cx,cy){
 if(!['syrupCast','syrupAssist'].includes(f.type))return old.apply(this,arguments);
 const {origin:o,point:p}=f,end=f.tick,active=f.t>=end;
 if(f.type==='syrupAssist'){
  if(f.usopp&&f.t<f.release)return;
  const t=f.usopp?clamp((f.t-f.release)/f.travel,0,1):clamp(f.t/end,0,1);
  const x=lerp(o.x,p.x,t)-cx,y=lerp(o.y,p.y,t)-cy-14;
  ctx.save();ctx.fillStyle=f.col;
  if(f.usopp){
   ctx.translate(x,y);ctx.rotate(Math.atan2(p.y-o.y,p.x-o.x));
   ctx.fillRect(f.powder?-17:-8,-1,f.powder?21:11,2);
   ctx.fillStyle=f.powder?'#fff7c7':'#eee2cc';ctx.fillRect(-1,-2,5,4);
  }
  else{ctx.translate(x,y);ctx.rotate(Math.atan2(p.y-o.y,p.x-o.x));ctx.fillRect(-9,-2,19,4);}
  ctx.restore();return true;
 }
 ctx.save();ctx.globalAlpha=active?.82:.48;ctx.strokeStyle=f.color;ctx.lineWidth=active?3:1;
 if(f.area){
  ctx.beginPath();ctx.ellipse(p.x-cx,p.y-cy,f.radius,f.radius*.61,0,0,Math.PI*2);ctx.stroke();
  if(f.kind==='hypnosis'){
   const x=p.x-cx,y=p.y-cy-18;
   ctx.beginPath();ctx.ellipse(x,y,10+Math.sin(f.t*13)*4,10,0,0,Math.PI*2);ctx.stroke();
  }
 }else{
  ctx.beginPath();ctx.moveTo(o.x-cx,o.y-cy-14);ctx.lineTo(p.x-cx,p.y-cy-14);ctx.stroke();
  if(active&&f.kind==='rush'){
   ctx.globalAlpha=.59;ctx.strokeStyle='#fff4cb';ctx.lineWidth=1;
   for(let j=-1;j<=1;j+=2){ctx.beginPath();ctx.moveTo(o.x-cx,o.y-cy+j*7-14);ctx.lineTo(p.x-cx,p.y-cy+j*7-14);ctx.stroke();}
  }
 }
 ctx.restore();
};}
DL_HOOKS.push((list,cx,cy)=>{
 const R=G.map?.syrup?.run;if(!R)return;
 for(const m of R.foes)for(const a of m.afterimages||[]){
  if(a.until<G.t)continue;
  list.push({x:a.x,y:a.y,type:'xdraw',noShadow:true,draw:()=>{
   const A=m.atlas;ctx.save();ctx.globalAlpha=clamp((a.until-G.t)*1.5,0,.45);
   atlasBlit(ctx,A,A.idx.atk+2,DIRI[m.dir]||0,Math.round(a.x-cx-A.ax),Math.round(a.y-cy-A.ay),A.fw,A.fh);
   ctx.restore();
  }});
 }
});
{const old=drawOverhead;drawOverhead=function(e,cx,cy){
 const r=old.apply(this,arguments);
 if(!G.map?.syrup?.run?.crew.includes(e))return r;
 const x=Math.round(e.x-cx-17),y=Math.round(e.y-cy-e.hgt-7);
 ctx.fillStyle='#192922';ctx.fillRect(x,y,34,4);ctx.fillStyle='#9dda87';ctx.fillRect(x+1,y+1,Math.round(32*e.hp/e.maxhp),2);
 return r;
};}
{const old=bossKilled;bossKilled=function(m){
 const M=G.map,R=M?.syrup?.run;
 const result=old.apply(this,arguments);
 if(!R?.foes.includes(m))return result;
 const next=R.foes.find(b=>b!==m&&!b.dying&&!b.remove&&b.hp>0);
 if(next){showBoss(next);return result;}
 const P=G.P,at=syrupNext(P);
 syrupClear(M);setWp({loc:at,m:'dawn',t:SYRUP_NAME});markDirty(true);
 const title=R.stage==='slope'?L2('La cuesta queda libre','The slope is clear'):R.stage==='forest'?L2('Kaya está a salvo','Kaya is safe'):L2('Kuro derrotado','Kuro defeated');
 const msg=R.stage==='slope'?L2('Encuentra a Nami en el bosque','Find Nami in the woods'):R.stage==='forest'?
  L2('Reúnete con Luffy en la terraza','Meet Luffy on the terrace'):L2('Habla con Usopp en el muelle','Speak to Usopp at the pier');
 banner(title,msg);return result;
};}
function syrupClearLocals(M){
 if(!M?.syrup)return;
 syrupClear(M);for(const e of M.syrup.locals)e.remove=true;
 M.syrup.locals=[];M.syrup.lead=null;M.syrup.sceneStage=null;M.syrup.sceneOwner=null;
}
V33_TICKS.push(dt=>{
 const M=G.map,P=G.P,S=M?.syrup;
 if(!S||!P)return;
 if(S.run&&(P.dead||S.run.owner!==P||P.dawnHelm||dist2(P.x,P.y,...dawnPx(S.run.at))>420**2))syrupClear(M);
 if(!P.dead&&!P.dawnHelm&&syrupLand(M,P.x,P.y)&&P.dawnCrewJoined&&P.rareDone){
  const stage=syrupStage(P);
  if(!S.run&&(S.sceneStage!==stage||S.sceneOwner!==P))syrupLocals(M,P);
 }else if(S.locals.length)syrupClearLocals(M);
 if(S.run){
  for(const e of S.run.crew)syrupAllyTick(M,S.run,e,dt);
  const anchor=SYRUP_ENCOUNTERS[S.run.stage].at;
  const lead=S.locals.find(e=>SYRUP_ALLIES[e.id]&&e.id!==SYRUP_USOPP);
  if(lead&&lead.id!==SYRUP_USOPP){lead.remove=true;S.sceneStage=null;}
  if(S.run.stage==='forest'&&dist2(P.x,P.y,...dawnPx(anchor))<390**2){
   if(!S.run.escort){
    S.run.escort=[SYRUP_KAYA,'syrup_ninjin','syrup_piman','syrup_tamanegi'].map(id=>S.locals.find(e=>e.id===id));
    S.run.escort.forEach((e,i)=>{[e.x,e.y]=dawnPx([998+i,815-i]);e.scene=true;});
   }
   for(const [i,e] of S.run.escort.entries())shellsActorMove(M,e,...dawnPx([1006+i,806]),dt);
  }
 }
});
{const old=setMap;setMap=function(M){
 const prev=G.map,r=old.apply(this,arguments);if(prev!==G.map)syrupClearLocals(prev);return r;
};}
GSIS.push(['syrup_village',SYRUP_NAME,()=>[
 L2('Termina la historia de Gaimon y navega al sur para encontrar el muelle de Villa Syrup. La Fruta del Diablo sigue siendo necesaria.','Finish Gaimon’s story and sail south to the Syrup Village pier. The Devil Fruit is still required.'),
 L2('Habla con Usopp en el pueblo y advierte a Kaya en la mansión. En la cuesta, Zoro se enfrenta a Sham y Buchi (572). Después, Nami y Usopp protegen a Kaya de Jango (572) y Luffy te ayuda contra Kuro (580).','Talk to Usopp in the village and warn Kaya at the manor. On the slope, Zoro faces Sham and Buchi (572). Then Nami and Usopp protect Kaya from Jango (572), and Luffy helps you against Kuro (580).'),
 L2('Después de Kuro, recluta a Usopp (580) en el muelle. Elige tres compañeros en tierra y guarda al cuarto a bordo.','After Kuro, recruit Usopp (580) at the pier. Choose three companions ashore and keep the fourth aboard.')
],()=>({m:'dawn',loc:!G.P?.rareDone?RARE_CLEARING:syrupNext(G.P),t:SYRUP_NAME})]);
const syrupMapItem=MAPW_LIST.find(m=>m.id==='dawn');
syrupMapItem.n=L2('Mar de Dawn · Foosha, Little Garden, Shells Town, Orange Town, Animales Raros y Villa Syrup','Dawn Sea · Foosha, Little Garden, Shells Town, Orange Town, Rare Animals and Syrup Village');
syrupMapItem.how=L2('Navega desde Puerto Coral a partir del nivel 500. Lleva una Fruta del Diablo. Completa la misión de Gaimon para desembarcar en Villa Syrup.','Sail from Coral Port from level 500 onward. Bring a Devil Fruit. Complete Gaimon’s mission to land at Syrup Village.');
