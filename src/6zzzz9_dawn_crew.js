// The stop after Orange Town follows manga chapter 22. Gaimon stays with the animals.
const SYRUP_USOPP='syrup_usopp';
const DAWN_CREW=[
 [SHELLS_CAST_IDS.luffy,'Luffy',L2('Capitán','Captain')],
 [SHELLS_CAST_IDS.zoro,'Zoro',L2('Espadachín','Swordsman')],
 [ORANGE_NAMI,'Nami',L2('Navegante','Navigator')],
 [SYRUP_USOPP,'Usopp',L2('Tirador','Sniper')],
 ['baratie_sanji','Sanji',L2('Cocinero','Cook')]
];
const GAIMON_ID='rare_gaimon';
const CREW_LANDING_LIMIT=3;
const CREW_NAMI_BIT=1<<2;
const dawnCrewAvailable=P=>P.baratieSanji?31:P.syrupUsopp?15:7;
const dawnCrewCount=mask=>DAWN_CREW.reduce((n,_,i)=>n+Number(!!(mask&(1<<i))),0);
SAVEKEYS.push('dawnCrewJoined','dawnCrewAshore','rareClue','rareChestMask','rareDone');
const dawnCrewMask=P=>P.dawnCrewAshore==null?CREW_LANDING_LIMIT:P.dawnCrewAshore&dawnCrewAvailable(P)&~CREW_NAMI_BIT;
function dawnCrewLines(id,aboard=false){
 if(id==='baratie_sanji')return [
  aboard?L2('La cena está en la cocina. Si Luffy pregunta por el postre, dile que todavía se enfría.','Dinner is in the galley. If Luffy asks for dessert, tell him it is still cooling.'):
    L2('Yo te cubro. Después buscamos un sitio donde cocinar con calma.','I’ll cover you. After that, let’s find somewhere quiet to cook.'),
  L2('En algún lugar está el All Blue. Imagínate lo que podríamos preparar con pescado de los cuatro mares.','The All Blue is out there. Imagine what we could cook with fish from all four seas.')
 ];
 if(id===SYRUP_USOPP)return aboard?[
  L2('¡El gran capitán Usopp vigila desde cubierta! Si ves una vela desconocida, avísame antes de acercarte.','The great Captain Usopp is keeping watch! If you spot a strange sail, tell me before you get close.'),
  L2('Voy a guardar mis piedras de repuesto lejos de la cocina. Luffy se las comería por error.','I’m keeping my spare stones well away from the galley. Luffy might eat them by mistake.')
 ]:[
  L2('Desde aquí puedo cubrirte con el tirachinas. Procura dejarme un buen ángulo.','I can cover you from here with my slingshot. Try to give me a clear shot.'),
  L2('Me asusta un poco lo que viene. También me da curiosidad. Supongo que eso es ser pirata.','I’m a little scared of what’s next. Curious too. I guess that’s what being a pirate feels like.')
 ];
 if(aboard){
  if(id===SHELLS_CAST_IDS.luffy)return [
   L2('¡Mira qué velas! Con el Merry podemos seguir navegando hasta que se nos acabe el mapa.','Look at those sails! On the Merry we can keep sailing until we run out of map.'),
   L2('Zoro dice que guardemos las provisiones. ¡Pero navegar también da hambre!','Zoro says to save our supplies. But sailing makes me hungry, too!')
  ];
  if(id===SHELLS_CAST_IDS.zoro)return [
   L2('Yo vigilo la cubierta. Nami lleva el rumbo. Así todos llegamos en una pieza.','I’ll watch the deck. Nami has the heading. That way we all get there in one piece.'),
   L2('Cuando atraquemos, avísame si quieres que baje contigo.','When we dock, let me know if you want me ashore with you.')
  ];
  return [
   L2('Yo leo la carta y el viento. Tú llevas el timón. ¿Te marco el próximo muelle?','I’ll read the chart and the wind. You take the helm. Shall I mark the next pier?'),
   L2('Avisa antes de cambiar de rumbo. No pienso dibujar la misma costa dos veces.','Tell me before you change heading. I’m not drawing the same coastline twice.')
  ];
 }
 if(id===SHELLS_CAST_IDS.luffy)return [
  L2('¡Vamos los cuatro! Seguro que en el bosque hay alguien que necesita nuestra ayuda.','All four of us are going! I bet someone in those woods needs our help.'),
  L2('¡Vi un tigre con trompa! Zoro, ¿tú también lo viste?','I saw a tiger with a trunk! Zoro, did you see it too?')
 ];
 if(id===SHELLS_CAST_IDS.zoro)return [
  L2('Yo voy detrás. Pero si nos separamos, que sea el del sombrero el que pregunte por el camino.','I’ll bring up the rear. If we get split up, the guy in the hat can ask for directions.'),
  L2('Las huellas van hacia la laguna. Alguien pasó por aquí hace poco.','The tracks lead to the lagoon. Something came through here recently.')
 ];
 return [
  L2('Yo marco la ruta. El bote se queda amarrado y a la vista desde el muelle.','I’ll mark the route. The boat stays tied up where we can see it from the pier.'),
  L2('Los cofres están en tierra firme. Vamos por el sendero de la cornisa.','The chests are on dry ground. Let’s take the trail up to the ledge.')
 ];
}
function rareLandHere(M,P){
 const k=M.rare&&rareTerrainAt(M.rare,P.x>>4,P.y>>4);
 return k!==undefined&&k>=RARE_TILES.beach&&k!==RARE_TILES.water;
}
function rareDockAction(){
 const M=G.map,P=G.P;
 if(!M?.rare||!P||P.dead||G.fading)return null;
 if(P.dawnHelm){
  if(P.dawnHelm.kind==='swim'||dist2(P.x,P.y,...dawnPx(RARE_MOORING))>=54**2)return null;
  return dfHas()&&orangeWon(ORANGE_BUGGY)&&P.dawnCrewJoined?'rare_land':'rare_closed';
 }
 return P.dawnBoat?.rare&&dist2(P.x,P.y,...dawnPx(RARE_PIER))<36**2?'rare_sail':null;
}
function rareProgressHint(){
 if(!dfHas())return L2('Necesitas la Fruta del Diablo para desembarcar.','You need the Devil Fruit to go ashore.');
 if(!orangeChapterReady())return L2('Primero vence a Morgan en Shells Town.','Defeat Morgan in Shells Town first.');
 if(!orangeWon(ORANGE_CABAJI)&&!orangeWon(ORANGE_BUGGY))return L2('Zoro te espera para el duelo con Cabaji en Orange Town.','Zoro is waiting for the duel with Cabaji in Orange Town.');
 if(!orangeWon(ORANGE_BUGGY))return L2('Vence a Buggy en la plaza de la carpa de Orange Town.','Defeat Buggy by the big top in Orange Town.');
 return L2('Habla con Nami cerca del mercado de Orange Town para reunir a la tripulación.','Talk to Nami near Orange Town’s market to gather the crew.');
}
function rareDock(landing){
 if(rareDockAction()!==(landing?'rare_land':'rare_sail'))return;
 dawnIslandDock(landing,'rare',RARE_PIER,RARE_MOORING,RARE_NAME,L2('Sigue el sendero hasta el claro del bosque','Follow the path to the forest clearing'));
}
function dawnCrewMenu(){
 const P=G.P;
 if(!P?.dawnCrewJoined||G.map?.id!=='dawn')return;
 const mask=dawnCrewMask(P);
 const labels=DAWN_CREW.slice(0,P.baratieSanji?5:P.syrupUsopp?4:3).map(([,name,role],i)=>[
  name+' · '+(i===2?L2('Al timón','At the helm'):(mask&(1<<i))?L2('A tierra','Ashore'):L2('A bordo','On board'))+' · '+role,
  ()=>{
   if(G.P!==P||P.dead||i===2)return;
   const next=dawnCrewMask(P)^(1<<i);
   if(dawnCrewCount(next)>3){
    toast(L2('Hay tres plazas en tierra. Envía a alguien a bordo primero.','There are three shore slots. Send someone aboard first.'),'info',4);return;
   }
   P.dawnCrewAshore=next;
   markDirty(true);dawnCrewMenu();
  }
 ]);
 xMsg(L2('Tripulación del Mar de Dawn','Dawn Sea crew'),
  L2('Elige quién baja contigo. Los demás se quedan en la embarcación. Durante la travesía, todos van a bordo.','Choose who goes ashore with you. The others stay on the boat. Everyone rides aboard while sailing.'),labels);
}
XACT.rare_closed=[L2('Ruta de los Animales Raros cerrada','Rare Animals route closed'),'ways',()=>toast(rareProgressHint(),'info',5)];
XACT.rare_land=[L2('Desembarcar en la Isla de los Animales Raros','Land on the Island of Rare Animals'),'ways',()=>rareDock(true)];
XACT.rare_sail=[L2('Volver a la embarcación','Return to your ship'),'ways',()=>rareDock(false)];
function dawnCrewAtHelm(){
 const P=G.P,H=P?.dawnHelm;
 return G.map?.id==='dawn'&&P?.dawnCrewJoined&&!P.dead&&H&&H.kind!=='swim';
}
function dawnTalkAboard(){
 if(!dawnCrewAtHelm())return;
 xMsg(L2('Tripulación a bordo','Crew aboard'),L2('¿Con quién quieres hablar?','Who would you like to speak with?'),
  DAWN_CREW.slice(0,G.P.baratieSanji?5:G.P.syrupUsopp?4:3).map(([id,name,role])=>[name+' · '+role,()=>{
   if(!dawnCrewAtHelm())return;
   openDialog({id,type:'npc',map:'dawn',dawnCrew:true,aboard:true,atlas:npcAtlas(id),
    def:{...NPCS[id],title:role,lines:dawnCrewLines(id,true)}});
  }]));
}
function dawnNavigatorMark(){
 if(G.map?.id!=='dawn'||!G.P?.dawnCrewJoined)return;
 const P=G.P,M=G.map,aboard=dawnCrewAtHelm();
 const quay=P.shellBerth?[M.shells.start+SHELL_PIER[0],SHELL_PIER[1]]:
  P.fooshaBerth?fooshaPier(M).map(n=>n>>4):ORANGE_QUAY;
 const quayName=P.shellBerth?'Shells Town':P.fooshaBerth?'Villa Foosha':ORANGE_NAME;
 const [loc,t]=baratieDestination(M,P,aboard)||typeof syrupCrewWaypoint==='function'&&syrupCrewWaypoint(M,P,aboard)|| (aboard?[P.rareDone?ORANGE_MOORING:RARE_MOORING,P.rareDone?ORANGE_NAME:RARE_NAME]:
  rareLandHere(M,P)?[P.rareClue&&!P.rareDone&&P.rareChestMask!==31?RARE_TERRACE:RARE_CLEARING,RARE_NAME]:[quay,quayName]);
 setWp({loc,m:'dawn',t});
 typeText(aboard?L2('Te marqué el fondeadero. Busca la flecha dorada y acércate desde mar abierto.','I’ve marked the mooring. Follow the golden arrow and approach from open water.'):
  L2('Ya está marcado en la carta. Sígueme la flecha dorada.','It’s marked on the chart now. Follow the golden arrow.'));
}
XACT.dawn_crew_talk=[L2('Hablar con la tripulación','Talk to the crew'),'talk',dawnTalkAboard];
XACT.rare_crew=[L2('Organizar tripulación','Manage crew'),'talk',dawnCrewMenu];
function rareNearestChest(M,P){
 let choice=null,dist=33**2;
 for(const o of M.rare.chests){
  const d=dist2(P.x,P.y,o.px,o.py);
  if(d<dist){choice=o;dist=d;}
 }
 return choice;
}
function rareOpenChest(){
 const P=G.P,M=G.map;
 if(!M?.rare||P.dawnHelm||P.dead||!P.dawnCrewJoined)return;
 const o=rareNearestChest(M,P);
 if(!o)return;
 if(!P.rareClue){toast(L2('Habla antes con Gaimon en el claro del bosque.','Talk to Gaimon in the forest clearing first.'),'info',4);return;}
 const bit=1<<o.rareIndex;
 if(P.rareChestMask&bit){toast(L2('El cofre está vacío.','The chest is empty.'),'info',3);return;}
 P.rareChestMask=(P.rareChestMask||0)|bit;
 const count=RARE_CHESTS.reduce((sum,_,i)=>sum+Number(!!(P.rareChestMask&(1<<i))),0);
 sfx('quest');markDirty(true);
 banner(L2('Cofre vacío','Empty chest'),count===RARE_CHESTS.length
  ?L2('Revisaste los cinco. Vuelve con Gaimon.','You checked all five. Return to Gaimon.')
  :count+' / '+RARE_CHESTS.length+' · '+L2('Cofres revisados','Chests checked'));
}
XACT.rare_chest=[L2('Revisar el cofre','Check the chest'),'bag',rareOpenChest];
function rareAction(key){return {kind:'xact',label:XACT[key][0],icon:XACT[key][1],o:{xact:key}};}
{const old=interactTarget;interactTarget=function(){
 const P=G.P,M=G.map,k=rareDockAction();
 if(k)return rareAction(k);
 if(!M?.rare||!P||P.dead||!P.dawnCrewJoined)return old.apply(this,arguments);
 if(P.dawnHelm){
  return old.apply(this,arguments)||(dawnCrewAtHelm()?rareAction('dawn_crew_talk'):null);
 }
 if([RARE_BOARD,ORANGE_BOARD,...(M.syrup?[SYRUP_BOARD]:[])].some(at=>dist2(P.x,P.y,...dawnPx(at))<28**2))return rareAction('rare_crew');
 if(rareNearestChest(M,P))return rareAction('rare_chest');
 const it=old.apply(this,arguments);
 return it?.e?.rareAnimal?null:it;
};}

NPCS[GAIMON_ID]={
 n:'Gaimon',title:L2('Guardián de los animales raros','Guardian of the rare animals'),look:{},
 atlas:()=>rareActorAtlas(GAIMON_ID),
 lines:[
  L2('¡Alto! Si vienen por los animales, tendrán que vérselas conmigo. ¿Vieron un tigre con trompa por el camino?','Hold it! If you’re here for the animals, you’ll have to get past me. Did you see a tiger with a trunk on the way?'),
  L2('Hace veinte años me quedé atascado en esta caja. Los animales me hicieron compañía desde entonces.','I got stuck in this box twenty years ago. The animals have kept me company ever since.')
 ]
};
for(const [id,es,en] of RARE_ANIMALS)NPCS[id]={
 n:L2(es,en),title:RARE_NAME,look:{},atlas:()=>rareActorAtlas(id),
 lines:[L2('El animal te observa con curiosidad.','The animal watches you curiously.')]
};
function rareGaimonDialogue(npc,opts){
 if(npc.id!==GAIMON_ID)return;
 const P=G.P,end=P.rareChestMask===((1<<RARE_CHESTS.length)-1);
 if(P.rareDone){opts.unshift({label:L2('Hablar de los animales','Talk about the animals'),icon:['talk'],fn:()=>{
  typeText(L2('La oferta de Luffy fue buena. Pero alguien tiene que quedarse a cuidar a todos estos tragones.','Luffy made a good offer. But someone has to stay and look after all these hungry mouths.'));
 }});return;}
 if(end){
  opts.unshift({label:L2('Contarle lo de los cofres','Tell him about the chests'),icon:['talk'],fn:()=>{
   showLines([
    L2('Gaimon: ¿Vacíos los cinco? Veinte años mirando esa cornisa… Supongo que estaba cuidando el tesoro equivocado.','Gaimon: All five empty? Twenty years staring at that ledge… Guess I was guarding the wrong treasure.'),
    L2('Luffy: ¡Ven con nosotros, entonces! Hay un montón de islas que ver.','Luffy: Come with us, then! There are loads of islands to see.'),
    L2('Gaimon: Gracias, chico. Pero en esta isla ya encontré a los míos. Cuídense en el mar.','Gaimon: Thanks, kid. But I’ve already found my family here. Take care out at sea.')
   ],()=>{P.rareDone=true;markDirty(true);closeDialog();banner(RARE_NAME,L2('La historia de Gaimon está completa','Gaimon’s story is complete'));});
  }});return;
 }
 opts.unshift({label:P.rareClue?L2('Preguntar por la cornisa','Ask about the ledge'):L2('Buscar los cinco cofres','Look for the five chests'),icon:['bag'],fn:()=>{
  P.rareClue=true;markDirty(true);
  typeText(L2('Sigan el camino de la derecha hasta la cornisa. Dejé cinco cofres arriba. Díganme qué hay dentro.','Follow the trail on the right to the ledge. I left five chests up there. Tell me what’s inside.'));
 }});
}
DLG_HOOKS.push((npc,opts)=>{
 const P=G.P;
 rareGaimonDialogue(npc,opts);
 if(npc.id===ORANGE_NAMI&&!npc.dawnCrew&&orangeWon(ORANGE_BUGGY)&&!P.dawnCrewJoined){
  opts.unshift({label:L2('Reunir a la tripulación','Gather the crew'),icon:['ways'],fn:()=>{
   if(P.dawnCrewJoined||!orangeWon(ORANGE_BUGGY))return;
   showLines([
    L2('Nami: Hay una isla de animales extraños al este de aquí. Si vamos juntos, yo marco el rumbo.','Nami: There’s an island of strange animals east of here. If we go together, I’ll chart the course.'),
    L2('Luffy: ¡Listo! Zoro, Nami y tú. ¡Nuestro próximo viaje es en el Going Merry!','Luffy: All right! Zoro, Nami and you. Our next trip is aboard the Going Merry!'),
    L2('Zoro: Yo llevo las espadas. Tú encárgate de que Luffy no se coma las provisiones.','Zoro: I’ll bring the swords. You keep Luffy from eating the supplies.')
   ],()=>{
    P.dawnCrewJoined=true;P.dawnCrewAshore=CREW_LANDING_LIMIT;
    for(const actor of G.ents)if(actor.map==='dawn'&&actor.id==='dawn_luffy')actor.remove=true;
    closeDialog();markDirty(true);sfx('quest');
    banner(L2('Tripulación reunida','Crew gathered'),L2('Going Merry · Nami se une como navegante','Going Merry · Nami joins as navigator'));
   });
  }});
 }
 if(!npc.dawnCrew||G.map?.id!=='dawn')return;
 if(npc.id===ORANGE_NAMI)opts.unshift({label:L2('Marcar el próximo destino','Mark the next destination'),icon:['ways'],fn:dawnNavigatorMark});
 else opts.unshift({label:npc.id===SHELLS_CAST_IDS.zoro?L2('Hablar de la próxima escala','Talk about the next stop'):L2('Hablar de la aventura','Talk about the adventure'),
  icon:['talk'],fn:()=>typeText(dawnCrewLines(npc.id,!!npc.aboard)[1])});
 opts.push({label:L2('Organizar tripulación','Manage crew'),icon:['ways'],fn:()=>{closeDialog();dawnCrewMenu();}});

});

function rareSpawnLocals(M){
 const S=M.rare;
 S.gaimon=spawnNPC(GAIMON_ID,...dawnPx(RARE_CLEARING),M.id,{face:'down',hgt:55});
 S.animals=RARE_ANIMALS.map(([id,,,at])=>{
  const [x,y]=dawnPx(at);
  return spawnNPC(id,x,y,M.id,{rareAnimal:true,wander:2,face:'down',hgt:34});
 });
}
function rareClearActors(M){
 const S=M?.rare;
 if(!S)return;
 for(const e of [S.gaimon,...S.animals,...(S.crew||[])])if(e)e.remove=true;
 S.animals=[];S.gaimon=null;S.crew=null;S.trail=null;S.lastTrail=0;S.crewOwner=null;
}
function dawnCrewFollow(M,P,dt){
 const S=M.rare,mask=dawnCrewMask(P);
 const points=S.trail||(S.lastTrail=G.t,S.trail=[[P.x,P.y]]);
 if(dist2(P.x,P.y,...points[0])>=8**2){
  points.unshift([P.x,P.y]);S.lastTrail=G.t;
  if(points.length>48)points.pop();
 }
 const settled=G.t-S.lastTrail>.42;
 const activeSyrup=M.syrup?.run;
 const [fx,fy]=DIRV[P.dir]||DIRV.down;
 const crew=S.crew||(S.crew=[null,null,null]);
 const orange=M.orange?.run,shells=M.shellsRescue?.run;
 DAWN_CREW.forEach(([id,,role],i)=>{
  const sceneLead=M.syrup?.lead;
  const scripted=M.baratie?.run||activeSyrup||(sceneLead?.id===id&&d2(P,sceneLead)<180**2)||(id!==ORANGE_NAMI&&id!==SYRUP_USOPP&&(orange||shells));
  if(!(mask&(1<<i))||scripted){
   if(crew[i])crew[i].remove=true;
   crew[i]=null;return;
  }
  let [x,y]=points[Math.min(points.length-1,3+dawnCrewCount(mask&((1<<i)-1))*3)];
  if(settled){
   const slot=dawnCrewCount(mask&((1<<i)-1));
   const side=[-19,19,0][slot],back=slot===2?25:13;
   const tx=P.x-fx*back-fy*side,ty=P.y-fy*back+fx*side;
   const clear=[[-4,-3],[-4,3],[4,-3],[4,3]].every(([dx,dy])=>!blockedFor(M,(tx+dx)>>4,(ty+dy)>>4,P.L));
   if(clear){x=tx;y=ty;}
  }
  const e=crew[i]||(crew[i]=spawnNPC(id,x,y,M.id,{scene:true,dawnCrew:true,hgt:57}));
  if(!e.crewReady){e.def={...e.def,title:role,lines:dawnCrewLines(id)};e.crewReady=true;}
  if(e.actionUntil>G.t){baratiePose(e);return;}
  const target=P.target;
  if(CREW_TECHNIQUES[id]&&target?.mid&&target.map===M.id&&target.state!=='return'&&d2(P,target)<174**2){
   const stats=syrupCrewStats(P,id,target.lv);
   e.lv=stats.lv;
   if(crewTechniqueAttack(M,e,target,[target],()=>G.map===M&&G.P===P&&!P.dead&&!P.dawnHelm,stats.boost,target.boss?.24:0))return;
  }
  const dx=x-e.x,dy=y-e.y,d=Math.hypot(dx,dy);
  if(d<5){
   if((e.crewMovedAt||0)+.14<G.t){
    if(settled)e.dir=dirFromVec(P.x-e.x,P.y-e.y);
    setAnim(e,'idle',true);stepAnim(e,dt,3);
   }
   return;
  }
  const step=Math.min(d,dt*Math.max(84,Math.min(260,P.S.spd*1.16+d*.25)));
  e.dir=dirFromVec(dx,dy);
  const oldX=e.x,oldY=e.y;
  moveEnt(M,e,dx/d*step,dy/d*step);
  const travelled=Math.hypot(e.x-oldX,e.y-oldY);
  if(travelled>.1){
   e.crewMovedAt=G.t;e.crewStuck=0;setAnim(e,'walk',true);stepAnim(e,travelled/9,1);
  }else e.crewStuck=(e.crewStuck||0)+dt;
  if(d>240||e.crewStuck>1.65){
   e.x=x;e.y=y;e.crewStuck=0;
  }
 });
}
V33_TICKS.push(dt=>{
 const M=G.map,P=G.P,S=M?.rare;
 if(!S||!P)return;
 if(S.crewOwner&&S.crewOwner!==P)rareClearActors(M);
 const shore=P.dawnCrewJoined&&!P.dawnHelm&&!P.dead;
 const island=shore&&rareLandHere(M,P);
 const tile=M.ter[tileAt(M,P.x>>4,P.y>>4)];
 if(shore&&tile!==undefined&&!SOLID_T[tile]){S.crewOwner=P;dawnCrewFollow(M,P,dt);}
 else if(S.crew){for(const e of S.crew)if(e)e.remove=true;S.crew=null;S.trail=null;}
 if(island&&dist2(P.x,P.y,...dawnPx(RARE_CLEARING))<1800**2){
  if(!S.gaimon&&rareArtworkReady())rareSpawnLocals(M);
  if(P.rareDone&&S.gaimon&&!S.gaimon.rareAfter){
   S.gaimon.rareAfter=true;
   S.gaimon.def={...S.gaimon.def,lines:[L2('Buen viaje, amigos. Si pasan otra vez, ya saben dónde encontrarme.','Safe travels, friends. If you come by again, you know where to find me.')]};
  }
 }else if(S.gaimon){
  for(const e of [S.gaimon,...S.animals])if(e)e.remove=true;
  S.gaimon=null;S.animals=[];
 }
});
{const old=setMap;setMap=function(M){
 const prev=G.map,result=old.apply(this,arguments);
 if(prev!==G.map)rareClearActors(prev);
 return result;
};}

GSIS.push(['rare_animals',RARE_NAME,()=>[
 L2('Completa esta ruta en orden: Morgan en Shells Town, Cabaji y Buggy en Orange Town. Luego habla con Nami cerca del mercado.','Follow this route in order: Morgan in Shells Town, Cabaji and Buggy in Orange Town. Then talk to Nami near the market.'),
 L2('Navega al este de Orange Town y desembarca con la Fruta del Diablo. Puedes llevar a Luffy, Zoro y Nami juntos o dejar tripulantes a bordo.','Sail east from Orange Town and land with the Devil Fruit. Bring Luffy, Zoro and Nami together, or leave crew members aboard.'),
 L2('Al unirse Nami, tu bote pasa a ser el Going Merry. Habla con la tripulación al navegar: Nami puede marcar el siguiente fondeadero.','When Nami joins, your boat becomes the Going Merry. Talk to the crew while sailing: Nami can mark the next mooring.'),
 L2('Habla con Gaimon, revisa los cinco cofres de la cornisa y vuelve a contarle lo que encontraste.','Talk to Gaimon, check all five chests on the ledge and return to tell him what you found.')
],()=>({m:'dawn',loc:!orangeChapterReady()?[makeDawn().shells.start+SHELLS_RESCUE_AT[0],SHELLS_RESCUE_AT[1]]:
 !orangeWon(ORANGE_CABAJI)&&!orangeWon(ORANGE_BUGGY)?ORANGE_DUEL:!orangeWon(ORANGE_BUGGY)?ORANGE_CIRCUS:
 !G.P?.dawnCrewJoined?ORANGE_LOOKOUT:!G.P.rareClue||G.P.rareChestMask===31?RARE_CLEARING:RARE_TERRACE,t:RARE_NAME})]);
{
 const entry=MAPW_LIST.find(m=>m.id==='dawn');
 entry.n=L2('Mar de Dawn · Foosha, Little Garden, Shells Town, Orange Town y Animales Raros','Dawn Sea · Foosha, Little Garden, Shells Town, Orange Town and Rare Animals');
 entry.how=L2('Nivel 500: navega desde Puerto Coral. Lleva una Fruta del Diablo. Para Animales Raros, vence a Buggy y reúne a tu tripulación con Nami.','Level 500: sail from Coral Port. Bring a Devil Fruit. For Rare Animals, defeat Buggy and gather your crew with Nami.');
}
