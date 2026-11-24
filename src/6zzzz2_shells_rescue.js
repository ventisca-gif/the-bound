// Shells Town side story. The three-person fight takes place on the existing Dawn map.
const MORGAN_ID='shells_morgan', MORGAN_LEVEL=550;
const SHELLS_RESCUE_AT=[200,159], SHELLS_SWORDS_AT=[196,157], SHELLS_DUEL_AT=[206,163];
const SHELLS_RESCUE_WHERE=L2('Patio de la Base 153, Shells Town','153rd Branch courtyard, Shells Town');
const SHELLS_CAST_IDS={luffy:'shells_luffy',zoro:'shells_zoro'};
// Level 550 warrior in Time Gear, with 549 of the 1,647 attribute points in Vitality: 44,226 HP / 4,124 DEF.
const SHELLS_ALLIES={luffy:{hp:40000,def:3800},zoro:{hp:47500,def:4400}};
const SHELLS_REINFORCEMENTS=[[197,163],[211,158]];
const SHELLS_RESCUE_TITLE=L2('Rescate en Shells Town','Shells Town rescue');
for(const [id,n,es,en] of [
 [SHELLS_CAST_IDS.luffy,'Monkey D. Luffy','Trae las tres espadas. Yo me encargo de soltarlo.','Bring his three swords. I will untie him.'],
 [SHELLS_CAST_IDS.zoro,'Roronoa Zoro','Las tres espadas son mías. Con ellas puedo pelear.','All three swords are mine. With them, I can fight.']
])NPCS[id]={n,title:SHELLS_RESCUE_WHERE,look:{},atlas:()=>shellsCastAtlas(id===SHELLS_CAST_IDS.zoro?'zoro':'luffy'),lines:[L2(es,en)]};

BOSSES[MORGAN_ID]={
 n:L2('Morgan Mano de Hacha','Axe-Hand Morgan'),lv:MORGAN_LEVEL,where:SHELLS_RESCUE_WHERE,
 art:['hum',MORGAN_ID],hp:46,atk:3.38,def:3.28,spd:51,r:34,
 moves:['slam','charge','nova'],drops:[]
};
{const old=mobAtlasFor;mobAtlasFor=function(art){
 return art[0]==='hum'&&art[1]===MORGAN_ID?shellsCastAtlas('morgan'):old.apply(this,arguments);
};}
{const old=bossWhere;bossWhere=function(id){
 return id===MORGAN_ID?{loc:[229,129],where:SHELLS_RESCUE_WHERE}:old.apply(this,arguments);
};}

EXTRA_SPR.shellsMarker=()=>spr('Shells:rescue:marker',()=>({c:mkCanvas(1,1),ax:0,ay:0}));
EXTRA_SPR.shellsCross=()=>spr('Shells:rescue:cross',()=>{
 const p=new Pix(70,85);
 p.rect(30,3,10,79,WOOD[1]);p.rect(32,3,6,78,WOOD[3]);p.vl(33,6,72,WOOD[4]);
 p.rect(4,26,62,9,WOOD[0]);p.rect(5,26,60,7,WOOD[3]);p.hl(6,27,58,WOOD[4]);
 for(let i=0;i<10;i++)p.hl(8+i*5,29+i%3,4,WOOD[2]);
 p.rect(28,76,14,5,WOOD[2]);p.ell(35,81,11,3,STONEW[1]);
 for(const n of [12,51])for(let k=0;k<5;k++)p.vl(n+k,25-k%2,10,WOOD[k%2?5:2]);
 p.outline(C('#3a2d26'));return {c:p.canvas(),ax:35,ay:64};
});
EXTRA_SPR.shellsSwords=()=>spr('Shells:rescue:swords',()=>{
 const p=new Pix(38,24);
 for(const [i,c] of [C('#ece3bc'),C('#773d48'),C('#29374a')].entries()){
  const y=8+i*5;p.line(3,y,30,y-5,WOOD[0]);p.line(4,y-1,28,y-6,c);
  p.line(28,y-4,34,y-6,WOOD[4]);p.vl(29,y-8,6,GOLD[3]);
 }
 p.outline(C('#332b32'));return {c:p.canvas(),ax:19,ay:16};
});
const shellsRescueDone=P=>!!P?.bossKills?.[MORGAN_ID];
{const old=makeDawn;makeDawn=function(){
 const M=old.apply(this,arguments);
 if(M.shellsRescue)return M;
 const add=(k,[x,y],props)=>addObj(M,k,M.shells.start+x,y,{solid:false,fp:[],...props});
 // Sort the cross behind the bound actor and keep the action point on the ground.
 const cross=add('shellsCross',SHELLS_RESCUE_AT,{py:SHELLS_RESCUE_AT[1]*16-3});
 const rescue=add('shellsMarker',SHELLS_RESCUE_AT,{xact:'shells_rescue_cross'});
 const swords=add('shellsSwords',SHELLS_SWORDS_AT,{xact:'shells_rescue_swords'});
 if(M.xactObjs)M.xactObjs.push(rescue,swords);
 M.shellsRescue={cross,swords,run:null};
 return M;
};}

function shellsRescueNearby(M,at,distance){
 const P=G.P;
 if(!P||G.map!==M||!M?.shellsRescue||P.dead||P.dawnHelm||!dfHas())return false;
 const [x,y]=shellsDockPoint(M,at);
 return dist2(P.x,P.y,x,y)<distance**2;
}
function shellsRescueSpeak(actor,es,en){
 actor.chat=L2(es,en);actor.chatT=G.t;
}
function shellsActorMove(M,e,x,y,dt){
 const dx=x-e.x,dy=y-e.y,d=Math.hypot(dx,dy);
 if(d<=2){setAnim(e,'idle',true);stepAnim(e,dt,4);return true;}
 e.dir=dirFromVec(dx,dy);
 const travel=Math.min(d,dt*67);
 const moved=moveEnt(M,e,dx/d*travel,dy/d*travel);
 setAnim(e,moved?'walk':'idle',true);stepAnim(e,dt,moved?10:4);
 return false;
}
function shellsResetRescue(M){
 const S=M?.shellsRescue,R=S?.run;
 if(!R)return;
 for(const actor of [R.luffy,R.zoro,R.morgan,...R.marines])if(actor&&!actor.dying)actor.remove=true;
 if(G.bossBar===R.morgan)showBoss(null);
 S.run=null;S.cross.hidden=false;
 S.swords.hidden=shellsRescueDone(G.P);
}
function shellsFreeDialogue(luffy,zoro){
 luffy.def={...luffy.def,lines:[L2('¡Zoro ya está libre! Gracias por luchar con nosotros.','Zoro is free! Thanks for fighting with us.')]};
 zoro.def={...zoro.def,lines:[L2('Me diste la oportunidad de volver al mar con mis espadas.','You gave me a chance to return to sea with my swords.')]};
}
function shellsRescueActors(M){
 const S=M.shellsRescue,done=shellsRescueDone(G.P);
 const luffy=spawnNPC(SHELLS_CAST_IDS.luffy,...shellsDockPoint(M,[204,161]),M.id,{scene:true,hgt:64});
 Object.assign(luffy,{maxhp:SHELLS_ALLIES.luffy.hp,hp:SHELLS_ALLIES.luffy.hp,shellsDefense:SHELLS_ALLIES.luffy.def});
 const [x,y]=shellsDockPoint(M,done?[202,160]:SHELLS_RESCUE_AT);
 const zoro=spawnNPC(SHELLS_CAST_IDS.zoro,x,y,M.id,{scene:true,hgt:64});
 Object.assign(zoro,{maxhp:SHELLS_ALLIES.zoro.hp,hp:SHELLS_ALLIES.zoro.hp,shellsDefense:SHELLS_ALLIES.zoro.def});
 if(!done){
  zoro.anim='bound';
  S.cross.hidden=!!zoro.atlas.shellsApproved;
  if(!S.cross.hidden)zoro.y-=9;
  shellsRescueSpeak(luffy,'¡Sus espadas deben estar aquí cerca!','His swords must be nearby!');
 }
 if(done)shellsFreeDialogue(luffy,zoro);
 S.swords.hidden=done;
 return S.run={luffy,zoro,marines:[],phase:done?'done':'waiting'};
}
function shellsStartMorgan(M,R){
 const m=spawnMob(MORGAN_ID,MORGAN_LEVEL,...shellsDockPoint(M,SHELLS_DUEL_AT),0,null,true);
 m.hgt=67;m.state='fight';m.cd=1.05;
 Object.assign(R,{phase:'fight',morgan:m});
 R.luffy.chat=null;R.zoro.chat=null;
 shellsRescueSpeak(m,'¡Toda la base está bajo mi mando!','This whole base answers to me!');
 R.luffy.nextAssist=G.t+.8;R.zoro.nextAssist=G.t+1.45;
 showBoss(m);sfx('boss');
 banner(BOSSES[MORGAN_ID].n,L2('Nivel 550 · Luffy y Zoro luchan a tu lado','Level 550 · Luffy and Zoro fight beside you'));

}

XACT.shells_rescue_swords=[
 ()=>G.map.shellsRescue.run?.phase==='waiting'?L2('Recoger las tres espadas de Zoro','Pick up Zoro’s three swords'):null,
 'sword',()=>{
  const M=G.map,R=M?.shellsRescue?.run;
  if(!shellsRescueNearby(M,SHELLS_SWORDS_AT,32)||R?.phase!=='waiting')return;
  R.phase='swords';M.shellsRescue.swords.hidden=true;sfx('quest');
  shellsRescueSpeak(R.luffy,'¡Eso es! Llévalas a la cruz.','That’s it! Bring them to the cross.');
  banner(SHELLS_RESCUE_TITLE,L2('Lleva las espadas hasta la cruz','Bring the swords to the cross'));
 }
];
XACT.shells_rescue_cross=[
 ()=>{
  const phase=G.map.shellsRescue.run?.phase;
  if(phase==='waiting')return L2('Hablar con Zoro','Talk to Zoro');
  if(phase==='swords')return L2('Entregarle las espadas a Luffy','Hand the swords to Luffy');
  return null;
 },
 'talk',()=>{
  const M=G.map,R=M?.shellsRescue?.run;
  if(!shellsRescueNearby(M,SHELLS_RESCUE_AT,32)||!R)return;
  if(R.phase==='waiting'){shellsRescueSpeak(R.zoro,'Mis tres espadas. Las dejaron al oeste del patio.','My three swords. They left them west of the courtyard.');return;}
  if(R.phase!=='swords')return;
  R.phase='untie';
  shellsRescueSpeak(R.luffy,'¡Yo desato las cuerdas!','I will untie the ropes!');
 }
];

function shellsAssistHit(M,R,b,base){
 const P=G.P;
 if(G.map!==M||M.shellsRescue.run!==R||R.phase!=='fight'||P.dead||b.dying||b.remove)return;
 // Preserve a finishing window for the player's own attacks.
 if(b===R.morgan&&b.hp<=b.maxhp*.25)return;
 hitMob(b,Math.min(base,b.maxhp*.012),{summon:true});
}
function shellsAssistAttack(M,R,e,isZoro,b){
 e.dir=dirFromVec(b.x-e.x,b.y-e.y);
 const count=isZoro?3:e.useGatling?7:1;
 setAnim(e,!isZoro&&count>1&&e.atlas.shellsApproved?'gatling':'atk');
 e.useGatling=!e.useGatling;
 const dur=isZoro?.44:count>1?.64:.3;
 e.actionUntil=G.t+dur;e.actionLength=dur;e.nextAssist=G.t+(isZoro?2.15:count>1?2.65:1.65);
 const name=isZoro?L2('Santoryu','Three Sword Style'):count>1?L2('¡Metralleta de Goma!','Gum-Gum Gatling!'):L2('¡Puñetazo de Goma!','Gum-Gum Pistol!');
 floatText(e.x,e.y-71,name,isZoro?'#c3ffd2':'#ffe59f');
 for(let i=0;i<count;i++){
  const t=(i+1)*dur/(count+1),reach=isZoro?51:152;
  addFx({type:isZoro?'shells_sword':'shells_rubber',x:e.x,y:e.y,source:e,target:b,at:t,
   index:i,count,dur:t+(isZoro?.24:.19),tick:t,fired:false,cbTick(f){
    if(f.fired||e.hp<=0||b.remove||b.dying)return;f.fired=true;
    if(dist2(e.x,e.y,b.x,b.y)>reach**2)return;
    shellsAssistHit(M,R,b,b.maxhp*(isZoro?.01:count>1?.0035:.015));
    burst(b.x,b.y-14,5,{sp:80,up:16,g:70,life:.25,c:isZoro?['#e3fff2','#75d9bc']:['#fff5d6','#edb878']});
   }});
 }
}
function shellsAllyTick(M,R,e,isZoro,dt){
 if(e.hp<=0)return;
 const b=R.marines.find(m=>!m.dying&&!m.remove&&dist2(e.x,e.y,m.x,m.y)<130**2)||R.morgan;
 if(e.actionUntil>G.t){
  e.af=clamp(Math.floor((1-(e.actionUntil-G.t)/e.actionLength)*4),0,3);return;
 }
 const angle=Math.atan2(G.P.y-b.y,G.P.x-b.x)+(isZoro?1.45:-1.55),r=isZoro?33:94;
 const d=dist2(e.x,e.y,b.x,b.y);
 if(G.t>=e.nextAssist&&d<=(isZoro?52:142)**2){shellsAssistAttack(M,R,e,isZoro,b);return;}
 const x=b.x+Math.cos(angle)*r,y=b.y+Math.sin(angle)*r;
 if(dist2(e.x,e.y,x,y)>12**2)shellsActorMove(M,e,x,y,dt);
 else {e.dir=dirFromVec(b.x-e.x,b.y-e.y);setAnim(e,'idle',true);stepAnim(e,dt,4);}
}
{const old=drawFx;drawFx=function(f,cx,cy){
 if(f.type!=='shells_rubber'&&f.type!=='shells_sword')return old.apply(this,arguments);
 if(f.target.remove||f.source.remove||f.source.hp<=0)return;
 const side=f.source.dir==='left'||f.source.dir==='right';
 if(f.source.atlas.shellsApproved&&side&&dist2(f.source.x,f.source.y,f.target.x,f.target.y)<70**2)return;
 const travel=clamp((f.t-f.at+.09)/.25,0,1);
 if(!travel||f.t>=f.dur)return;
 const a=f.source,b=f.target,sign=f.index%2?1:-1;
 const x=a.x-cx,y=a.y-cy-29,tx=b.x-cx,ty=b.y-cy-35;
 const progress=Math.sin(travel*Math.PI),dx=tx-x,dy=ty-y;
 ctx.save();
 if(f.type==='shells_rubber'){
  const offset=sign*(f.index%3+1)*3.2;
  dfLimb(ctx,x+offset,y+offset,Math.round(x+dx*progress+offset),Math.round(y+dy*progress+offset),'#efab77',3,4);
 }else{
  const angle=Math.atan2(dy+6,dx);
  ctx.translate(Math.round(x+dx*.48),Math.round(y+dy*.48));ctx.rotate(angle+sign*.43);
  for(const [col,w] of [['#34565f',5],['#77d6bb',3],['#efffe6',1]]){
   ctx.globalAlpha=progress;ctx.strokeStyle=col;ctx.lineWidth=w;
   ctx.beginPath();ctx.arc(-14,f.index*3-3,23,-.88,.85);ctx.stroke();
  }
 }
 ctx.restore();
};}

function shellsHurtAlly(e,attack,level){
 if(e.hp<=0)return;
 const damage=Math.max(1,Math.round(attack*dmgRedP(e.shellsDefense,level)));
 e.hp=Math.max(0,e.hp-damage);e.actionUntil=0;e.nextAssist=Math.max(e.nextAssist||0,G.t+.35);
 floatText(e.x,e.y-54,damage,'#ff8c79');
 setAnim(e,e.hp?'hurt':'dead');
 if(!e.hp)shellsRescueSpeak(e,'¡Sigue, tú puedes!','Keep going, you can do this!');
}
{const old=drawOverhead;drawOverhead=function(e,cx,cy){
 const result=old.apply(this,arguments);
 const R=G.map?.shellsRescue?.run;
 if(R?.phase==='fight'&&(e===R.luffy||e===R.zoro)){
  const x=Math.round(e.x-cx-19),y=Math.round(e.y-cy-66);
  ctx.fillStyle='#16151d';ctx.fillRect(x,y,38,5);
  ctx.fillStyle='#704554';ctx.fillRect(x+1,y+1,36,3);
  ctx.fillStyle='#8ede95';ctx.fillRect(x+1,y+1,Math.round(36*e.hp/e.maxhp),3);
 }
 return result;
};}
function shellsCallMarines(M,R){
 const m=R.morgan;
 R.called=true;m.cd=1.25;setAnim(m,'idle');
 shellsRescueSpeak(m,'¡Marines! ¡Cierren el patio!','Marines! Seal the courtyard!');
 banner(L2('¡Refuerzos de la Marina!','Navy reinforcements!'),L2('Dos marines entran al patio','Two marines enter the courtyard'));
 addFx({type:'ring',x:m.x,y:m.y,r:40,dur:.8,col:'#f5df9b',cb:()=>{
  if(G.map!==M||M.shellsRescue.run!==R||R.phase!=='fight'||G.P.dead||m.dying)return;
  for(const at of SHELLS_REINFORCEMENTS){
   const [x,y]=shellsDockPoint(M,at);
   if(blockedFor(M,x>>4,y>>4,0))continue;
   const marine=spawnMob('dawn_marine',MORGAN_LEVEL,x,y,0,null,false);
   marine.state='chase';R.marines.push(marine);
   shellsRescueSpeak(marine,'¡Por orden del capitán!','By order of the captain!');
  }
 }});
}
{const old=updateBoss;updateBoss=function(m,dt,d,dh,spd,moveTo){
 if(m.mid!==MORGAN_ID)return old.apply(this,arguments);
 const P=G.P,M=G.map,R=M.shellsRescue?.run;
 if(R?.morgan!==m||R.phase!=='fight'||P.dead)return;
 if(m.swingUntil>G.t){m.af=clamp(Math.floor((1-(m.swingUntil-G.t)/m.swingLength)*4),0,3);return;}
 if(!R.called&&m.hp<=m.maxhp*.65){shellsCallMarines(M,R);return;}
 const angry=m.hp<m.maxhp*.45;
 if(d>112||(m.cd>.38&&d>38)){moveTo(P.x,P.y,spd);return;}
 if(m.cd>0){setAnim(m,'idle',true);return;}
 const type=(m.swingCount=(m.swingCount||0)+1)%3;
 if(d>61&&type!==1){moveTo(P.x,P.y,spd);return;}
 const ang=Math.atan2(P.y-m.y,P.x-m.x),dx=Math.cos(ang),dy=Math.sin(ang);
 const x=m.x,y=m.y,dur=type===1?.68:angry?.57:.73;
 const spec=type===1?{shape:'line',x,y,ang,len:144,w:33}
  :type===0?{shape:'circle',x:x+dx*20,y:y+dy*20,r:61}
  :{shape:'cone',x,y,ang,arc:.98,r:69};
 m.swingUntil=G.t+dur;m.swingLength=dur;m.cd=dur+(angry?.79:1.07);
 mobFace(m,P.x-x,P.y-y);
 setAnim(m,m.atlas.shellsApproved?(type===1?'charge':type===2?'sweep':'atk'):'atk');
 floatText(x,y-75,type===1?L2('Carga del hacha','Axe charge'):type===0?L2('Golpe al suelo','Ground slam'):L2('Barrido','Axe sweep'),'#ffc084');
 telegraph({...spec,dur,cb:()=>{
  if(G.map!==M||M.shellsRescue.run!==R||R.phase!=='fight'||P.dead||m.dying||m.remove)return;
  const connects=e=>{
   const vx=e.x-x,vy=e.y-y,along=vx*dx+vy*dy,perp=Math.abs(vy*dx-vx*dy);
   return type===1?along>0&&along<144&&perp<16.5:type===0?dist2(e.x,e.y,spec.x,spec.y)<61**2
    :Math.hypot(vx,vy)<69&&along>0&&perp<along*Math.tan(.49);
  };
  if(type===1)for(let i=0;i<10;i++)if(!moveEnt(M,m,dx*7,dy*7))break;
  const power=m.atk*(type===0?1.08:type===1?.92:1);
  if(connects(P))hurtPlayer(power,{lv:m.lv});
  for(const ally of [R.luffy,R.zoro])if(connects(ally))shellsHurtAlly(ally,power,m.lv);
  addFx({type:'ring',x:m.x,y:m.y,r:type===0?61:33,dur:.35,col:'#efd3ac'});
  burst(m.x,m.y-4,14,{sp:111,up:36,g:95,life:.38,c:['#f9dcb2','#b28662','#f3b064']});sfx('swing');
 }});
};}

{const old=bossKilled;bossKilled=function(m){
 const R=G.map?.shellsRescue?.run;
 const result=old.apply(this,arguments);
 if(m.mid===MORGAN_ID&&R?.morgan===m){
  R.phase='done';
  for(const marine of R.marines)if(!marine.dying)marine.remove=true;
  for(const ally of [R.luffy,R.zoro]){ally.hp=ally.maxhp;setAnim(ally,'idle');}
  shellsFreeDialogue(R.luffy,R.zoro);
  shellsRescueSpeak(R.zoro,'Le debo una a tu tripulación. Yo también saldré al mar.','I owe your crew one. I am heading out to sea too.');
  banner(SHELLS_RESCUE_TITLE,L2('Zoro está libre · Morgan derrotado','Zoro is free · Morgan defeated'));
 }
 return result;
};}
{const old=setMap;setMap=function(M){
 const prev=G.map,result=old.apply(this,arguments);
 if(prev!==G.map)shellsResetRescue(prev);
 return result;
};}
V33_TICKS.push(dt=>{
 const M=G.map,S=M?.shellsRescue;
 if(!S)return;
 if(!shellsRescueNearby(M,SHELLS_RESCUE_AT,325)){shellsResetRescue(M);return;}
 const R=S.run||shellsRescueActors(M);
 if(R.phase==='untie'){
  const [x,y]=shellsDockPoint(M,SHELLS_RESCUE_AT);
  if(shellsActorMove(M,R.luffy,x+18,y+10,dt)){
   R.phase='release';R.releaseAt=G.t+.6;
   R.luffy.dir='left';setAnim(R.luffy,'atk');
  }
 }else if(R.phase==='release'){
  stepAnim(R.luffy,dt,7);
  if(G.t>=R.releaseAt){
   if(!S.cross.hidden)R.zoro.y+=9;
   S.cross.hidden=false;setAnim(R.zoro,'idle');shellsStartMorgan(M,R);
  }
 }else if(R.phase==='fight'){
  shellsAllyTick(M,R,R.luffy,false,dt);shellsAllyTick(M,R,R.zoro,true,dt);
 }
});
{const old=otherPOI;otherPOI=function(M){
 const out=old.apply(this,arguments);
 if(M.shellsRescue)out.push({c:'shells',x:M.shells.start+SHELLS_RESCUE_AT[0],y:SHELLS_RESCUE_AT[1],t:SHELLS_RESCUE_TITLE});
 return out;
};}
GSIS.push(['shells_rescue',SHELLS_RESCUE_TITLE,()=>[
 L2('Desembarca en Shells Town con la Fruta del Diablo y sube al patio de la Base 153. Recoge al oeste las tres espadas y llévaselas a Luffy junto a la cruz.','Land at Shells Town with the Devil Fruit and go up to the 153rd Branch courtyard. Recover the three swords on the west side and take them to Luffy at the cross.'),
 L2('Luffy libera a Zoro. Enfréntate con ellos a Morgan de nivel 550. Esquiva el hacha y ocúpate de los refuerzos cuando los llame.','Luffy frees Zoro. Fight level-550 Morgan alongside them. Dodge his axe and handle the reinforcements when he calls them.')
],()=>({m:'dawn',loc:[makeDawn().shells.start+SHELLS_RESCUE_AT[0],SHELLS_RESCUE_AT[1]],t:SHELLS_RESCUE_TITLE})]);
