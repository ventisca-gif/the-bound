const BAR_SANJI='baratie_sanji',BAR_MIHAWK='baratie_mihawk';
const BAR_FOES={
 baratie_pearl:{n:'Pearl',lv:590,hp:46,atk:3.67,def:3.8,spd:68,color:'#f69061'},
 baratie_gin:{n:'Gin',lv:592,hp:51,atk:3.94,def:3.51,spd:105,color:'#9fdbea'},
 baratie_krieg:{n:'Don Krieg',lv:595,hp:61,atk:4.14,def:3.77,spd:84,color:'#ffd178'}
};
const BAR_CAST=[
 [BAR_SANJI,'Sanji','Cocinero','Cook',38,11,'Si alguien llega con hambre, primero le sirvo. Lo demás se habla con el plato vacío.','If someone arrives hungry, I feed them first. Everything else can wait until the plate is empty.'],
 ['baratie_zeff','Zeff','Jefe de cocina','Head chef',34,7,'El que quiera pelear que salga a cubierta. Todavía tengo pan en el horno.','Anyone looking for a fight can take it outside. I still have bread in the oven.'],
 ['baratie_patty','Patty','Cocinero','Cook',11,10,'Bienvenido. Si vienes a comer, siéntate. Si vienes a romper sillas, ya sabes dónde está la puerta.','Welcome. If you came to eat, take a seat. If you came to break chairs, you know where the door is.'],
 ['baratie_carne','Carne','Cocinero','Cook',29,11,'Las cacerolas de cobre van dentro. Ya perdí una con el último temporal.','The copper pans go inside. I already lost one in the last storm.'],
 ['baratie_fullbody','Fullbody','Teniente de la Marina','Marine lieutenant',19,8,'Venía a almorzar tranquilo. Ahora hasta el tenedor vibra con los cañonazos.','I came here for a quiet lunch. Now even my fork rattles from the cannon fire.'],
 ['baratie_johnny','Johnny','Cazarrecompensas','Bounty hunter',9,28,'Desde aquí vi la vela negra. Nunca había visto una embarcación tan pequeña cruzar un mar así.','I saw the black sail from here. Never seen a boat that small cross seas like these.'],
 ['baratie_yosaku','Yosaku','Cazarrecompensas','Bounty hunter',15,28,'Si Zoro sale al agua, yo salto detrás. Ten una cuerda lista.','If Zoro goes into the water, I’m jumping after him. Keep a rope ready.'],
 ['baratie_gin','Gin','Comandante de Krieg','Krieg’s commander',36,19,'Ese plato sigue pesando más que mis armas. No he olvidado quién me lo sirvió.','That plate still weighs more than my weapons. I haven’t forgotten who served it.'],
 ['baratie_pearl','Pearl','Defensa de la flota','Fleet defense',35,22,'Esos escudos han parado cosas más pesadas que tú.','These shields have stopped heavier things than you.'],
 ['baratie_krieg','Don Krieg','Almirante pirata','Pirate admiral',35,21,'Ese casco aguantaría una travesía larga. Desde hoy navega bajo mi bandera.','That hull would survive a long voyage. From today it sails under my flag.'],
 [BAR_MIHAWK,'Mihawk','Espadachín','Swordsman',12,21,'Puedo esperar a que desenvaines. El mar hoy no tiene prisa.','I can wait for you to draw. The sea is in no hurry today.']
];
SAVEKEYS.push('baratieServed','baratieDuelSeen','baratieSanji');
for(const [id,n,es,en,,,line,eng] of BAR_CAST)NPCS[id]={n,title:L2(es,en),look:{},lines:[L2(line,eng)],atlas:()=>baratieAtlas(id)};
for(const [id,b] of Object.entries(BAR_FOES)){
 BOSSES[id]={...b,where:BARATIE_NAME,art:['baratie',id],r:36,moves:[],drops:[]};
 DAWN_RETO[id]=id==='baratie_krieg'?2.04:1.86;
}
{const old=mobAtlasFor;mobAtlasFor=function(art){return art[0]==='baratie'?baratieAtlas(art[1]):old.apply(this,arguments);};}
{const old=bossWhere;bossWhere=function(id){return BAR_FOES[id]?{loc:BARATIE_ARENA,where:BARATIE_NAME,m:'dawn'}:old.apply(this,arguments);};}

const BAR_RECALL=['welcome','duel',...Object.keys(BAR_FOES),'farewell'];
SAVEKEYS.push('baratieRecall');
function baratieStage(P){
 if(Number.isInteger(P.baratieRecall)&&BAR_RECALL[P.baratieRecall])return BAR_RECALL[P.baratieRecall];
 if(!P.baratieServed)return 'welcome';
 if(!P.baratieDuelSeen)return 'duel';
 return Object.keys(BAR_FOES).find(id=>!syrupWon(id,P))||(P.baratieSanji?'done':'farewell');
}
function baratieDestination(M,P,aboard){
 if(!M.baratie||!baratieReady(P)||P.baratieSanji)return null;
 const s=baratieStage(P);
 return [aboard||!baratieHere(M,P)?BARATIE_MOOR:s==='duel'?BARATIE_DUEL:BAR_FOES[s]?BARATIE_ARENA:BARATIE_GALLEY,BARATIE_NAME];
}
function baratieCast(M,P,stage){
 const B=M.baratie;
 for(const e of B.locals)e.remove=true;
 B.locals=[];
 for(const [id,,,,x,y] of BAR_CAST){
  const enemy=BAR_FOES[id];
  if(enemy&&id!==stage&&!(id==='baratie_gin'&&stage==='welcome'))continue;
  if(id===BAR_MIHAWK&&stage!=='duel')continue;
  if(id===BAR_SANJI&&P.baratieSanji&&!Number.isInteger(P.baratieRecall))continue;
  const pos=stage==='welcome'&&id==='baratie_gin'?barAt(40,9):barAt(x,y);
  const wander=['baratie_patty','baratie_carne','baratie_fullbody','baratie_zeff'].includes(id)?1:0;
  B.locals.push(spawnNPC(id,...dawnPx(pos),M.id,{face:'down',hgt:61,wander}));
 }
 B.stage=stage;B.owner=P;
}
function baratieMovePlayer(M,at){
 const P=G.P;
 [P.x,P.y]=dawnPx(at);P.dir='up';P.target=null;
 updateCamera(0,true);prewarm(M);netPresence(true);
}
function baratieActor(M,id,x,y,hp=0){
 const e=spawnNPC(id,x,y,M.id,{scene:true,noTalk:true,hgt:62});
 if(hp)Object.assign(e,{hp,maxhp:hp});
 return e;
}
function baratieRunClear(M){
 const B=M.baratie,R=B.run;
 if(!R)return;
 for(const e of [...R.crew,...R.foes])if(!e.dying)e.remove=true;
 if(R.foes.includes(G.bossBar))showBoss(null);
 if(R.foes.includes(G.P?.target))G.P.target=null;
 B.run=null;B.stage=null;
}
const baratieLive=(M,R)=>G.map===M&&M.baratie.run===R&&R.owner===G.P&&!G.P.dead;
function baratieStart(stage,rematch=false){
 const M=G.map,P=G.P,B=M?.baratie;
 if(!B||B.run||P.dead||!baratieHere(M,P))return;
 if(rematch?!(BAR_FOES[stage]&&P.baratieSanji&&syrupWon(stage,P)):baratieStage(P)!==stage)return;
 const duel=stage==='duel',at=duel?BARATIE_DUEL:BARATIE_ARENA;
 baratieMovePlayer(M,[at[0],at[1]+4]);
 const [x,y]=dawnPx(at);
 for(const e of B.locals)if(e.id===stage||e.id===BAR_SANJI||e.id===BAR_MIHAWK)e.remove=true;
 const lv=duel?595:BAR_FOES[stage].lv;
 const st=syrupCrewStats(P,duel?SHELLS_CAST_IDS.zoro:SHELLS_CAST_IDS.luffy,lv);
 const victories=Object.keys(BAR_FOES).filter(id=>syrupWon(id,P)).length;
 st.hp=Math.round(st.hp*(1+.075*victories));
 st.def=Math.round(st.def*(1+.045*victories));
 st.boost*=1+.05*victories;
 const R=B.run={stage,rematch,crew:[],foes:[],at,owner:P,start:G.t,beat:0};
 const z=duel?baratieActor(M,SHELLS_CAST_IDS.zoro,x-46,y+2,st.hp):null;
 if(duel){
  R.crew.push(z);R.foes.push(baratieActor(M,BAR_MIHAWK,x+28,y-9));
  z.dir='right';R.foes[0].dir='left';
  banner(L2('Zoro contra Mihawk','Zoro versus Mihawk'),L2('Duelo en la cubierta','Duel on the deck'));
  return;
 }
 const m=spawnMob(stage,lv,x,y-16,0,null,true);
 Object.assign(m,{state:'fight',cd:1.6,hgt:68,barTurns:0});
 R.foes.push(m);
 const support=DAWN_CREW.filter(([id],i)=>id!==ORANGE_NAMI&&id!==BAR_SANJI&&id!==SHELLS_CAST_IDS.luffy&&(dawnCrewMask(P)&(1<<i)));
 const cast=[[SHELLS_CAST_IDS.luffy,st],[BAR_SANJI,{...st,hp:Math.round(st.hp*1.08),def:Math.round(st.def*1.05),reach:60}]];
 if(support.length)cast.push([support[0][0],syrupCrewStats(P,support[0][0],lv)]);
 cast.forEach(([id,stats],i)=>{
  const e=baratieActor(M,id,x+[-66,66,0][i],y+(i===2?66:40),stats.hp);
  Object.assign(e,{shellsDefense:stats.def,syrupBoost:stats.boost,syrupReach:stats.reach,nextAssist:G.t+.9+i*.31,lv:stats.lv});
  R.crew.push(e);
 });
 showBoss(m);sfx('boss');banner(m.name||BAR_FOES[stage].n,'Nivel '+lv);
}
const BAR_DUEL_BEATS=[
 [2,0,'He venido por el puesto que ocupas.','I came for the title you hold.'],
 [5,0,'Tres espadas. Veamos cuánto pesa cada una.','Three swords. Let’s see how much each one weighs.'],
 [9,.12,'¡Aún ni siquiera te has movido de ahí!','You haven’t even moved from that spot!'],
 [15,.31,'El acero llega antes si dejas de anunciarlo con el hombro.','Steel arrives sooner if your shoulder stops announcing it.'],
 [22,.54,'Voy a volver a entrar. Que no se acerque nadie.','I’m going in again. Nobody come any closer.'],
 [29,.75,'Has llegado hasta aquí herido. Ahora sí mereces ver mi espada.','You came this far wounded. Now you deserve to see my sword.'],
 [36,.96,'De pie. Quiero verlo venir.','On my feet. I want to see it coming.'],
 [38,1,'El mar es grande, Roronoa. Te esperaré.','The sea is wide, Roronoa. I’ll wait for you.']
];
function baratieDuelTick(M,R,dt){
 const [z]=R.crew,[hawk]=R.foes,t=G.t-R.start;
 if(t>=40){
  if(Number.isInteger(G.P.baratieRecall))G.P.baratieRecall++;
  else G.P.baratieDuelSeen=true;
  baratieRunClear(M);markDirty(true);
  banner(L2('Mihawk gana el duelo','Mihawk wins the duel'),L2('Zoro queda al cuidado de Johnny y Yosaku. Sanji te espera en la otra cubierta.','Johnny and Yosaku take care of Zoro. Sanji is waiting on the other deck.'));
  setWp({loc:BARATIE_ARENA,m:'dawn',t:BARATIE_NAME});return;
 }
 const beat=BAR_DUEL_BEATS[R.beat];
 if(beat&&t>=beat[0]){
  const [,damage,es,en]=beat,blade=R.beat>=6;
  shellsRescueSpeak(R.beat%2===0?z:hawk,es,en);
  if(damage){
   const duration=blade?1.3:.86;
   hawk.dir=dirFromVec(z.x-hawk.x,z.y-hawk.y);
   setAnim(hawk,blade?'sword':'atk');
   hawk.actionLength=duration;hawk.actionUntil=G.t+duration;
   R.impact={damage,blade,at:G.t+duration*.52};
  }
  R.beat++;
 }
 if(R.impact&&G.t>=R.impact.at){
  const {damage,blade}=R.impact;R.impact=null;
  z.hp=Math.round(z.maxhp*(1-damage));
  setAnim(z,z.hp?'hurt':'dead');z.actionUntil=G.t+.85;z.actionLength=.85;
  burst(z.x,z.y-17,blade?18:7,{sp:100,up:15,g:64,life:.3,c:['#f2f0d7','#c7776f']});
  addFx({type:'baratieArc',x:hawk.x,y:hawk.y-20,ang:Math.atan2(z.y-hawk.y,z.x-hawk.x),r:blade?63:22,col:blade?'#9be2cb':'#faf4d3',dur:.43});
 }
 for(const e of [z,hawk]){
  if(e.actionUntil>G.t)baratiePose(e);
  else if(e!==z||z.hp>0)setAnim(e,'idle',true);
 }
 if(t>=3&&t<36&&(z.actionUntil||0)<=G.t){
  if(d2(z,hawk)>43**2)shellsActorMove(M,z,hawk.x-37,hawk.y+9,dt);
  else if(G.t>=(z.nextAssist||0))shellsAssistAttack(M,R,z,true,hawk,()=>{});
 }
}
function baratiePose(e){
 const n=animN(e,e.anim);
 e.af=clamp(Math.floor(n*(1-(e.actionUntil-G.t)/e.actionLength)),0,n-1);
}
function baratieEnemyStrike(M,R,m,target,mode){
 const radius=mode==='gas'?72:mode==='fire'?62:mode==='shield'?50:30;
 const delay=mode==='gas'?.98:mode==='fire'?.76:.59;
 const [x,y]=[target.x,target.y],ang=Math.atan2(y-m.y,x-m.x),col=mode==='gas'?'#a5c383':BAR_FOES[m.mid].color;
 m.dir=dirFromVec(x-m.x,y-m.y);setAnim(m,'atk');
 if(mode==='shield')m.armorT=delay;
 m.actionUntil=G.t+delay+.3;m.actionLength=delay+.3;
 m.syrupHazard={until:G.t+delay,area:true,point:{x,y},intersects:e=>dist2(e.x,e.y,x,y)<radius**2};
 telegraph({shape:'circle',x,y,r:radius,col:col+'52',dur:delay});
 addFx({type:'baratieArc',x:m.x,y:m.y-16,ang,r:mode==='clubs'?40:53,col,dur:delay+.3});
 addFx({type:'baratieImpact',x,y,mode,col,r:radius,dur:delay+.4,tick:delay,cbTick(f){
  if(f.fired||!baratieLive(M,R)||m.remove||m.dying)return;
  f.fired=true;
  const base=m.atk*(mode==='gas'?.89:mode==='fire'?1.02:mode==='shield'?.92:1.17);
  for(const e of [G.P,...R.crew]){
   if(e.hp<=0||dist2(e.x,e.y,x,y)>=radius**2)continue;
   if(e===G.P)hurtPlayer(base,{lv:m.lv,dawnReto:m,slow:mode==='gas'?1.3:0});
   else{
    if(e.hp<e.maxhp*.5&&!e.barGuard){
     e.barGuard=true;
     shellsRescueSpeak(e,e.id===BAR_SANJI?'Todavía puedo defender la cocina.':'¡Todavía tengo fuerzas!',e.id===BAR_SANJI?'I can still defend the kitchen.':'I’m still on my feet!');
    }
    shellsHurtAlly(e,base*(e.barGuard?.43:.68),m.lv);
    e.syrupHurtAt=G.t+.27;
   }
  }
  if(mode==='clubs')moveEnt(M,m,Math.cos(ang)*55,Math.sin(ang)*55);
  burst(x,y,mode==='gas'?26:18,{sp:100,up:15,g:42,life:.43,c:[col,'#fff2ce']});
 }});
}
{const old=updateBoss;updateBoss=function(m,dt,d,dh,spd,moveTo){
 if(!BAR_FOES[m.mid])return old.apply(this,arguments);
 const M=G.map,R=M.baratie?.run,P=G.P;
 if(!R?.foes.includes(m)||!baratieLive(M,R))return;
 if(m.actionUntil>G.t){baratiePose(m);return;}
 const allies=R.crew.filter(e=>e.hp>0),n=m.barTurns;
 const target=allies.length&&n%3!==0?allies[n%allies.length]:P;
 const dx=target.x-m.x,dy=target.y-m.y,dist=Math.hypot(dx,dy);
 const wounded=m.hp<m.maxhp*.52;
 const mode=m.mid==='baratie_pearl'?(wounded&&n%2===0?'fire':'shield'):
  m.mid==='baratie_gin'?'clubs':wounded&&n%3===0?'gas':'spear';
 const reach=mode==='gas'?170:mode==='spear'?124:mode==='clubs'?88:78;
 if(m.cd<=0&&dist<reach){
  m.barTurns++;m.cd=wounded?1.9:2.55;
  if(mode==='gas')shellsRescueSpeak(m,'¡Todos fuera de mi cubierta!','Everyone off my deck!');
  baratieEnemyStrike(M,R,m,target,mode);return;
 }
 if(dist>54){m.dir=dirFromVec(dx,dy);moveEnt(M,m,dx/dist*spd*dt,dy/dist*spd*dt);setAnim(m,'walk',true);}
 else setAnim(m,'idle',true);
};}
function baratieAssist(M,R,e,dt){
 const m=R.foes[0];
 if(e.hp<=0||e.syrupHurtAt>G.t||m.dying)return;
 if(e.actionUntil>G.t){baratiePose(e);return;}
 const h=m.syrupHazard;
 if(h?.until>G.t&&h.intersects(e)){
  const angle=Math.atan2(e.y-h.point.y,e.x-h.point.x)+(e.id===BAR_SANJI?.3:-.2);
  shellsActorMove(M,e,e.x+Math.cos(angle)*75,e.y+Math.sin(angle)*75,dt*1.75);return;
 }
 const sanji=e.id===BAR_SANJI,reach=e.syrupReach;
 if(crewTechniqueAttack(M,e,m,R.foes,()=>baratieLive(M,R),e.syrupBoost*(e.barGuard?1.15:1)))return;
 const a=Math.atan2(G.P.y-m.y,G.P.x-m.x)+(sanji?1.75:-1.35);
 shellsActorMove(M,e,m.x+Math.cos(a)*reach*.78,m.y+Math.sin(a)*reach*.78,dt);
}
V33_TICKS.push(dt=>{
 const M=G.map,P=G.P,B=M?.baratie;
 if(!B||!P)return;
 if(P.dead||!baratieHere(M,P)){
  if(B.run)baratieRunClear(M);
  for(const e of B.locals)e.remove=true;
  B.locals=[];B.stage=null;return;
 }
 const R=B.run;
 if(R){
  if(R.owner!==P||dist2(P.x,P.y,...dawnPx(R.at))>(R.stage==='duel'?195:360)**2){baratieRunClear(M);return;}
  if(R.stage==='duel')baratieDuelTick(M,R,dt);
  else for(const e of R.crew)baratieAssist(M,R,e,dt);
  return;
 }
 const s=baratieStage(P);
 if(B.stage!==s||B.owner!==P)baratieCast(M,P,s);
});
{const old=setMap;setMap=function(M){
 const prev=G.map,r=old.apply(this,arguments);
 if(prev!==G.map&&prev?.baratie){
  baratieRunClear(prev);
  for(const e of prev.baratie.locals)e.remove=true;
  prev.baratie.locals=[];prev.baratie.stage=null;
 }
 return r;
};}
{const old=bossKilled;bossKilled=function(m){
 const M=G.map,R=M?.baratie?.run,P=G.P;
 const result=old.apply(this,arguments);
 if(R?.foes.includes(m)){
  baratieRunClear(M);markDirty(true);
  if(R.rematch)return result;
  if(Number.isInteger(P.baratieRecall)){P.baratieRecall++;markDirty(true);}
  const s=baratieStage(P);
  setWp({loc:BAR_FOES[s]?BARATIE_ARENA:BARATIE_GALLEY,m:'dawn',t:BARATIE_NAME});
  if(m.mid==='baratie_pearl')xMsg(L2('Gin rompe el escudo','Gin breaks the shield'),L2('Pearl levanta el escudo por última vez. Gin se lo parte con una de sus tonfas y se planta frente a Sanji.','Pearl raises his shield one last time. Gin shatters it with a tonfa and stands in front of Sanji.'));
  if(m.mid==='baratie_gin')xMsg(L2('Gin baja las armas','Gin lowers his weapons'),L2('Gin: Me ordenaron acabar contigo. Pero todavía recuerdo aquella primera cucharada. Hoy puedes pasar.','Gin: I was ordered to finish you. But I still remember that first spoonful. Today you can pass.'));
  banner(BAR_FOES[m.mid].n+' · '+L2('Victoria','Victory'),L2(
   m.mid==='baratie_krieg'?'Vuelve a la cocina y habla con Sanji.':'Habla con el siguiente rival en cubierta.',
   m.mid==='baratie_krieg'?'Head back to the galley and talk to Sanji.':'Talk to the next rival on deck.'));
 }
 return result;
};}
DLG_HOOKS.push((npc,opts)=>{
 const M=G.map,P=G.P;
 if(!npc||!M?.baratie||!P||!baratieReady(P)||!baratieHere(M,P)||M.baratie.run)return;
 const stage=baratieStage(P);
 const option=(label,icon,fn)=>opts.unshift({label,icon:[icon],fn:()=>{closeDialog();fn();}});
 if(npc.id==='baratie_zeff'&&P.baratieSanji){
  const replay=Number.isInteger(P.baratieRecall);
  option(replay?L2('Cerrar el recuerdo','End the replay'):L2('Revivir la historia de Baratie','Replay Baratie’s story'),'ways',()=>{
   if(replay)delete P.baratieRecall;else P.baratieRecall=0;
   M.baratie.stage=null;markDirty(true);
  });
 }
 if(npc.id===BAR_SANJI&&stage==='welcome'){
  option(L2('Llevarle comida a Gin','Bring Gin a meal'),'food',()=>{
   if(Number.isInteger(P.baratieRecall))P.baratieRecall++;else P.baratieServed=true;
   markDirty(true);
   xMsg(L2('La cocina del Baratie','The Baratie galley'),[
    L2('Sanji deja un plato caliente delante de Gin. El pirata se come hasta la última miga.','Sanji sets a hot plate in front of Gin. The pirate eats down to the last crumb.'),
    L2('Gin: Me diste de comer sin preguntar de qué barco venía. Ojalá pudiera devolverte el favor.','Gin: You fed me without asking which ship I came from. I wish I could return the favor.'),
    L2('Zeff: Hay un barco enorme arrimándose a la borda. Dejen la cocina despejada.','Zeff: A huge ship is pulling alongside. Clear the galley.')
   ].join('<br><br>'));
   banner(L2('Un plato para Gin','A meal for Gin'),L2('Krieg exige el restaurante. Una vela negra se acerca por la otra borda.','Krieg demands the restaurant. A black sail approaches the other rail.'));
   setWp({loc:BARATIE_DUEL,m:'dawn',t:BARATIE_NAME});
  });
 }
 if(npc.id===BAR_MIHAWK&&stage==='duel')option(L2('Presenciar el duelo de Zoro','Watch Zoro’s duel'),'sword',()=>baratieStart(stage));
 if(BAR_FOES[stage]&&npc.id===stage)option(L2('Defender el Baratie','Defend the Baratie'),'sword',()=>baratieStart(stage));
 if(npc.id===BAR_SANJI&&stage==='farewell'){
  option(L2('Invitar a Sanji al Going Merry','Invite Sanji aboard the Going Merry'),'ways',()=>{
   P.baratieSanji=true;delete P.baratieRecall;markDirty(true);
   xMsg(L2('Sanji se une a la tripulación','Sanji joins the crew'),[
    L2('Zeff: Te guardé un cuchillo afilado y un sitio vacío en la cocina. Usa el primero. El segundo puede esperar.','Zeff: I kept a sharp knife and an empty place in the galley for you. Use the first. The second can wait.'),
    L2('Sanji: Gracias por todas las comidas, viejo. La primera que prepare en el Merry te la voy a dedicar.','Sanji: Thanks for every meal, old man. The first one I make on the Merry is for you.'),
    L2('Luffy: ¡Tenemos cocinero! ¿Eso significa que hoy cenamos dos veces?','Luffy: We have a cook! Does that mean we get dinner twice today?')
   ].join('<br><br>'));
  });
 }
});
{const old=drawOverhead;drawOverhead=function(e,cx,cy){
 const r=old.apply(this,arguments);
 if(!G.map?.baratie?.run?.crew.includes(e))return r;
 const x=Math.round(e.x-cx-20),y=Math.round(e.y-cy-e.hgt-7);
 ctx.fillStyle='#211d25';ctx.fillRect(x,y,40,5);ctx.fillStyle='#885052';ctx.fillRect(x+1,y+1,38,3);
 ctx.fillStyle='#99d584';ctx.fillRect(x+1,y+1,Math.round(38*e.hp/e.maxhp),3);
 return r;
};}
{const old=drawFx;drawFx=function(f,cx,cy){
 if(f.type!=='baratieArc'&&f.type!=='baratieImpact')return old.apply(this,arguments);
 ctx.save();ctx.strokeStyle=f.col;ctx.fillStyle=f.col;
 if(f.type==='baratieImpact'){
  if(f.fired){
   ctx.globalAlpha=Math.max(0,(f.dur-f.t)*1.2);
   for(let i=0;i<12;i++){const a=i*2.4,y=Math.sin(a)*f.r*.6,x=Math.cos(a)*f.r*.85;
    ctx.fillRect(f.x+x-cx,f.y+y-cy-3,4+(i%3)*3,3+(i%4));
   }
  }
 }else{
  const a=f.ang+(f.t/f.dur-.5)*1.1;
  ctx.globalAlpha=Math.sin(Math.PI*clamp(f.t/f.dur,0,1))*.9;
  ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(f.x-cx,f.y-cy,f.r,f.r*.58,a,a-1.02,a+.91);ctx.stroke();
  ctx.lineWidth=1;ctx.strokeStyle='#fff7d7';ctx.beginPath();ctx.ellipse(f.x-cx,f.y-cy,f.r+4,f.r*.58+3,a,a-.9,a+.72);ctx.stroke();
 }
 ctx.restore();
};}
GSIS.push(['baratie',BARATIE_NAME,()=>[
 L2('Al norte de Villa Syrup. Vence a Kuro y recluta a Usopp antes de abordar.','North of Syrup Village. Defeat Kuro and recruit Usopp before boarding.'),
 L2('Sirve a Gin, presencia el duelo y defiende la cubierta contra Pearl (590), Gin (592) y Don Krieg (595).','Feed Gin, witness the duel, and defend the deck from Pearl (590), Gin (592), and Don Krieg (595).'),
 L2('Recluta a Sanji como cocinero después de la batalla. Puedes llevar a tres compañeros en tierra.','Recruit Sanji as cook after the fight. You can bring three crewmates ashore.')
],()=>({m:'dawn',loc:BARATIE_MOOR,t:BARATIE_NAME})]);
{
 const guide=gsisRef('baratie');
 LUPA_DAWN.push(['baratie',()=>BARATIE_NAME,guide[2],guide[3]]);
 const route=LUPA_DAWN.find(([id])=>id==='ruta');
 const entries=route[2],next=route[3];
 route[2]=()=>{
  const lines=entries();
  lines.splice(6,0,(G.P?.baratieSanji?'✅ ':'⬜ ')+L2(
   '7. Baratie: duelo de Zoro, defensa del restaurante y reclutamiento de Sanji.',
   '7. Baratie: Zoro’s duel, defense of the restaurant and Sanji joins.'));
  lines[7]=lines[7].replace('7.','8.');
  return lines;
 };
 route[3]=()=>{
  const [loc,t]=G.P&&G.map?baratieDestination(G.map,G.P,!!G.P.dawnHelm)||[]:[];
  return loc?{loc,m:'dawn',t}:next();
 };
}
