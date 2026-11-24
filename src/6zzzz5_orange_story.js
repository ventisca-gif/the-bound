// Orange Town crossover: the lookout, Cabaji's duel and Buggy's split-body fight.
const ORANGE_CABAJI='orange_cabaji', ORANGE_BUGGY='orange_buggy', ORANGE_NAMI='orange_nami';
const BUGGY_SPLIT_PARTS=[
 [[44,19],[126,19],[130,64],[103,62],[93,71],[72,69],[60,63],[44,71]],
 [[77,69],[94,70],[103,72],[103,120],[94,126],[67,124],[69,75]],
 [[59,63],[76,67],[72,85],[67,109],[67,127],[53,125],[52,116],[59,98],[52,94],[52,82]],
 [[97,64],[110,62],[119,69],[124,92],[115,99],[114,112],[121,123],[103,127],[100,96]],
 [[51,91],[65,92],[62,103],[53,116],[43,120],[41,114],[49,103]],
 [[112,91],[122,90],[121,106],[113,109],[108,102]],
 [[62,122],[108,122],[112,141],[58,141]]
];
const ORANGE_GATE=[603,486], ORANGE_BUGGY_AT=[635,514];
const orangeCabajiWhere=L2('Plaza del duelo de Cabaji, Orange Town','Cabaji Duel Square, Orange Town');
const orangeBuggyWhere=L2('Carpa de Buggy, Orange Town','Buggy’s Big Top, Orange Town');
NPCS[ORANGE_NAMI]={
 n:'Nami',title:L2('Vigía del puerto de Orange Town','Orange Town lookout'),
 look:{},atlas:()=>orangeAtlas('nami'),
 lines:[
  L2('Quédate en el borde de la calle. Desde ahí ves venir a los piratas del mercado sin que te vean primero.','Stay by the edge of the street. You can spot the pirates coming from the market before they see you.'),
  L2('El acróbata patrulla la plaza en una sola rueda. Si sales hacia la carpa, vigila el suelo: esos pies que ves siguen siendo de Buggy.','The acrobat patrols the square on a single wheel. If you head to the big top, watch the ground: those feet still belong to Buggy.')
 ]
};
BOSSES[ORANGE_CABAJI]={n:'Cabaji',lv:567,where:orangeCabajiWhere,art:['orange','cabaji'],hp:48,atk:3.42,def:3.35,spd:70,r:30,moves:['charge','volley'],drops:[]};
BOSSES[ORANGE_BUGGY]={n:'Buggy',lv:570,where:orangeBuggyWhere,art:['orange','buggy'],hp:50,atk:3.48,def:3.39,spd:56,r:32,moves:['volley','slam'],drops:[]};
{const old=mobAtlasFor;mobAtlasFor=function(art){
 return art[0]==='orange'?orangeAtlas(art[1]):old.apply(this,arguments);
};}
{const old=bossWhere;bossWhere=function(id){
 if(id===ORANGE_BUGGY||id===ORANGE_CABAJI)return {loc:[229,129],where:BOSSES[id].where};
 return old.apply(this,arguments);
};}

const orangeWon=(id)=>!!G.P?.bossKills?.[id];
const orangeChapterReady=()=>orangeWon(MORGAN_ID)||orangeWon(ORANGE_CABAJI)||orangeWon(ORANGE_BUGGY);
function orangeNear(at,r){
 const P=G.P;
 return G.map?.orange&&P&&!P.dead&&!P.dawnHelm&&dfHas()&&dist2(P.x,P.y,...dawnPx(at))<r*r;
}
function orangeFindActors(M){
 const cabajiWon=orangeWon(ORANGE_CABAJI),buggyWon=orangeWon(ORANGE_BUGGY);
 const [x,y]=cabajiWon?[628,516]:ORANGE_GATE;
 const luffy=spawnNPC(SHELLS_CAST_IDS.luffy,...dawnPx([x+1,y+1]),M.id,{scene:true,hgt:64});
 const zoro=spawnNPC(SHELLS_CAST_IDS.zoro,...dawnPx([x-1,y]),M.id,{scene:true,hgt:64});
 luffy.def={...luffy.def,lines:[cabajiWon
  ?L2('¡Lo de las cuchillas me toca a mí! Si se desarma, acércate a sus botas.','Leave the knives to me! When he comes apart, get close to his boots.')
  :orangeChapterReady()?L2('¡Zoro ya está en la plaza! Vamos a echarle una mano.','Zoro’s already at the square! Let’s back him up.')
  :L2('¡Vamos primero a la base de Shells Town! Todavía tenemos que enfrentar a Morgan.','Let’s go to the base in Shells Town first! We still have to face Morgan.')]};
 zoro.def={...zoro.def,lines:[cabajiWon
  ?L2('Ese acróbata tenía buen equilibrio. Ahora vamos por el que lo mandó.','That acrobat had good balance. Now let’s get the one who sent him.')
  :orangeChapterReady()?L2('Cuando el tipo de la rueda se lance, déjalo pasar. Yo le corto la retirada.','When the guy on one wheel charges, let him go past. I’ll cut off his escape.')
  :L2('Morgan sigue en Shells Town. Volvamos cuando esté resuelto.','Morgan is still in Shells Town. We’ll come back when that’s settled.')]};
 if(buggyWon){
  luffy.def.lines=[L2('¡Eso sí que fue un buen golpe! ¿Crees que ahora podemos buscar algo de comer?','Now that was a good hit! Think we can find something to eat now?')];
  zoro.def.lines=[L2('Dos peleas y todavía sigues de pie. Cuando quieras volver al mar, tienes sitio con nosotros.','Two fights and you’re still standing. When you’re ready to sail again, there’s room with us.')];
 }
 return {luffy,zoro,phase:buggyWon?'done':cabajiWon?'captain':'ready'};
}
function orangeStart(M,R,id){
 const def=BOSSES[id],at=id===ORANGE_CABAJI?ORANGE_DUEL:ORANGE_BUGGY_AT;
 const m=spawnMob(id,def.lv,...dawnPx(at),0,null,true);
 Object.assign(m,{state:'fight',cd:1.2,hgt:67,orangeMove:0});
 Object.assign(R,{boss:m,phase:id===ORANGE_CABAJI?'duel':'captainFight'});
 for(const [ally,who] of [[R.luffy,'luffy'],[R.zoro,'zoro']]){
  const {hp,def}=SHELLS_ALLIES[who];
  Object.assign(ally,{hp,maxhp:hp,shellsDefense:def,nextAssist:G.t+1,noTalk:true,orangeResolve:false,orangeHurtUntil:0,orangeLastHit:-Infinity});
  setAnim(ally,'idle');
 }
 if(id===ORANGE_BUGGY){
  [R.zoro.x,R.zoro.y]=[m.x-32,m.y+14];
  [R.luffy.x,R.luffy.y]=[m.x-77,m.y+32];
  R.cutAt=G.t+.62;m.cd=3.7;m.introUntil=G.t+2.55;
  shellsRescueSpeak(m,'¿Ya acabaron con mi acróbata? Ahora empieza mi función.','Done with my acrobat? Now the real show begins.');
 }else{
  [R.zoro.x,R.zoro.y]=[m.x-34,m.y+17];
  [R.luffy.x,R.luffy.y]=[m.x-80,m.y+31];
  shellsRescueSpeak(m,'Tres espadas contra una rueda. A ver si puedes seguirme.','Three swords against one wheel. Let’s see if you can keep up.');
 }
 showBoss(m);sfx('boss');
 banner(def.n,(id===ORANGE_CABAJI?L2('Nivel 567 · Lucha al lado de Zoro','Level 567 · Fight alongside Zoro'):L2('Nivel 570 · Enfréntate al capitán con Luffy','Level 570 · Face the captain with Luffy')));
}
function orangeTalkStart(npc,opts){
 const M=G.map,R=M?.orange?.run;
 if(!R||npc!==R.luffy&&npc!==R.zoro)return;
 const cabaji=orangeChapterReady()&&R.phase==='ready'&&orangeNear(ORANGE_GATE,65);
 const replay=R.phase==='done';
 const buggy=(R.phase==='captain'||replay)&&orangeNear(ORANGE_BUGGY_AT,140);
 if(!cabaji&&!buggy)return;
 opts.unshift({label:cabaji?L2('Acompañar a Zoro al duelo','Join Zoro’s duel'):replay?L2('Revancha con Buggy','Buggy rematch'):L2('Enfrentar a Buggy','Face Buggy'),icon:['sword'],fn:()=>{
  if(G.map!==M||M.orange.run!==R||R.phase!==(cabaji?'ready':replay?'done':'captain'))return;
  closeDialog();orangeStart(M,R,cabaji?ORANGE_CABAJI:ORANGE_BUGGY);
 }});
}
DLG_HOOKS.push(orangeTalkStart);

function orangeEffectAlive(M,R,m){
 return G.map===M&&M.orange.run===R&&R.boss===m&&!m.dying&&!m.remove&&!G.P.dead;
}
function orangeAssist(M,R,m,base,boost){
 if(!orangeEffectAlive(M,R,m)||m.hp<=m.maxhp*.30||m.introUntil>G.t)return;
 hitMob(m,Math.min(base,m.maxhp*.009)*boost,{summon:true});
}
function orangePartner(M,R,e,isZoro,dt){
 const m=R.boss;
 if(!m||m.dying||e.hp<=0||e.orangeHurtUntil>G.t)return;
 if(e.actionUntil>G.t){
  e.af=clamp(Math.floor(4*(1-(e.actionUntil-G.t)/e.actionLength)),0,3);return;
 }
 if(orangeEvade(R,e,dt))return;
 const angle=Math.atan2(G.P.y-m.y,G.P.x-m.x)+(isZoro?1.35:-1.55),radius=isZoro?36:95;
 if(G.t>=e.nextAssist&&d2(e,m)<(isZoro?51:140)**2){
  shellsAssistAttack(M,R,e,isZoro,m,(M,R,b,base)=>orangeAssist(M,R,b,base,e.orangeResolve?1.3:1));
  if(e.orangeResolve)e.nextAssist=G.t+(e.nextAssist-G.t)*.82;
  return;
 }
 const x=m.x+Math.cos(angle)*radius,y=m.y+Math.sin(angle)*radius;
 if(dist2(e.x,e.y,x,y)>12**2)shellsActorMove(M,e,x,y,dt);
 else{e.dir=dirFromVec(m.x-e.x,m.y-e.y);setAnim(e,'idle',true);stepAnim(e,dt,4);}
}
function orangeSplit(m,duration){
 m.splitAt=G.t;m.splitUntil=G.t+duration;
 m.orangeParts=buggyFragmentSprites().map((sprite,i)=>({
  sprite,x:m.x+sprite.dx,y:m.y,z:sprite.z,phase:i*.96,
  next:G.t+1.05+(i%3)*.42,windup:0
 }));
 setAnim(m,'split',true);
 addFx({type:'ring',x:m.x,y:m.y,r:28,dur:.45,col:'#f0bb80'});
}
{const old=hitMob;hitMob=function(m,base,src={}){
 if(m.mid!==ORANGE_BUGGY)return old.apply(this,arguments);
 if(m.introUntil>G.t)return 0;
 // His grounded boots remain a usable target for every class.
 if(m.splitUntil>G.t&&d2(G.P,m)>58**2&&!src.summon){
  base*=.35;
  if((m.feetHint||0)<=G.t){
   m.feetHint=G.t+2.2;
   floatText(m.x,m.y-88,L2('¡Apunta a los pies!','Aim for his feet!'),'#ffdc89');
  }
 }
 return old.call(this,m,base,src);
};}
function orangeAllyHurt(e,base,level){
 if(!e||e.hp<=0||G.t-e.orangeLastHit<.72)return;
 e.orangeLastHit=G.t;e.orangeHurtUntil=G.t+.23;
 const guarded=e.orangeResolve;
 shellsHurtAlly(e,base*(guarded?.40:1),level);
 if(e.hp>0&&e.hp<=e.maxhp*.5&&!guarded){
  e.orangeResolve=true;
  const zoro=e.id===SHELLS_CAST_IDS.zoro;
  shellsRescueSpeak(e,zoro?'Ahora sí. Voy en serio.':'¡Todavía puedo pelear!',zoro?'All right. I’m getting serious.':'I can still fight!');
  addFx({type:'ring',x:e.x,y:e.y,r:33,dur:.55,col:zoro?'#99ffbc':'#ffd18d'});
 }
}
let BUGGY_SPLIT_SPRITES=null;
function buggyFragmentSprites(){
 const img=ORANGE_IMAGES.buggy;
 if(!img.naturalWidth)return [];
 if(BUGGY_SPLIT_SPRITES)return BUGGY_SPLIT_SPRITES;
 return BUGGY_SPLIT_SPRITES=BUGGY_SPLIT_PARTS.map(points=>{
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
  const x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x+1,h=Math.max(...ys)-y+1;
  const c=mkCanvas(w,h),g=c.getContext('2d');
  g.beginPath();
  points.forEach(([px,py],i)=>i?g.lineTo(px-x,py-y):g.moveTo(px-x,py-y));
  g.closePath();g.clip();g.drawImage(img,-x,-y);
  return {c,dx:(x+w/2-86)/2,z:(139-y-h/2)/2,w:w/2,h:h/2};
 });
}
function orangeEvade(R,e,dt){
 if(!e.orangeResolve||e.hp<=0)return false;
 const m=R.boss,part=m.orangeParts?.find(f=>f.target===e&&f.windup>G.t&&dist2(e.x,e.y,f.hitX,f.hitY)<26**2);
 const kick=G.fx.find(f=>f.orangeKick===m&&dist2(e.x,e.y,f.x,f.y)<(f.r+4)**2&&f.t<f.dur);
 if(!part&&!kick)return false;
 const angle=kick?Math.atan2(e.y-kick.y,e.x-kick.x):Math.atan2(e.y-m.y,e.x-m.x);
 const side=e===R.zoro?1:-1;
 for(const a of kick?[angle,angle+side*.75,angle-side*.75]:[angle+side*1.4,angle-side*1.4,angle]){
  const dx=Math.cos(a),dy=Math.sin(a);
  if(!moveEnt(G.map,e,dx*dt*145,dy*dt*145))continue;
  e.dir=dirFromVec(dx,dy);setAnim(e,'walk',true);stepAnim(e,dt,10);return true;
 }
 return false;
}
function buggyTrackParts(M,R,dt){
 const m=R.boss;
 if(!m.orangeParts?.length)return;
 const regroup=m.splitUntil<=G.t;
 for(const [i,f] of m.orangeParts.entries()){
  const planted=i===6,assigned=[G.P,R.zoro,R.luffy][i%3],target=assigned.hp>0?assigned:G.P;
  const regrouping=regroup||planted;
  if(!regrouping&&target.hp<=0)continue;
  const a=f.phase+G.t*1.8;
  const x=regrouping?m.x+f.sprite.dx:target.x+Math.cos(a)*(i%2?24:36);
  const y=regrouping?m.y:target.y+Math.sin(a)*(i%2?19:29);
  const gap=Math.hypot(x-f.x,y-f.y);
  if(gap>0&&!f.windup){
   const step=regrouping?Math.min(gap,dt*290):Math.min(gap,dt*(m.hp<m.maxhp*.45?111:93));
   f.x+=(x-f.x)/gap*step;f.y+=(y-f.y)/gap*step;
  }
  f.z=regrouping?f.sprite.z:20+(i%3)*9+Math.sin(G.t*5+i)*4;
  if(regrouping||G.t-m.splitAt<.75)continue;
  if(f.windup){
   if(G.t<f.windup)continue;
   f.windup=0;
   const base=m.atk*(i>=4?.29:.22);
   const victims=f.target===G.P?[G.P]:[G.P,f.target];
   for(const e of victims)if(e.hp>0&&dist2(e.x,e.y,f.hitX,f.hitY)<22**2){
    if(e===G.P)hurtPlayer(base,{lv:m.lv,orangeBoss:m});
    else orangeAllyHurt(e,base*.64,m.lv);
   }
   burst(f.hitX,f.hitY-7,5,{sp:58,life:.25,c:['#ffc284','#fff1ce']});
   if(i>=4)addFx({type:'orangeKnife',x:f.x,y:f.y-f.z,angle:Math.atan2(f.hitY-f.y,f.hitX-f.x),dur:.25});
   f.next=G.t+1.45;
  }else if(G.t>=f.next&&gap<64&&m.splitUntil-G.t>.48){
   f.target=target;f.hitX=target.x;f.hitY=target.y;f.windup=G.t+.44;
   telegraph({shape:'circle',x:f.hitX,y:f.hitY,r:22,dur:.44,col:'rgba(235,114,75,.32)'});
  }
 }
}
function orangeLineHits(e,x,y,angle,len,halfWidth){
 const vx=e.x-x,vy=e.y-y,dx=Math.cos(angle),dy=Math.sin(angle);
 const along=vx*dx+vy*dy;
 return along>-4&&along<len&&Math.abs(vy*dx-vx*dy)<halfWidth;
}
function orangeStrike(M,R,m,name,dur,spec,hit,anim='atk'){
 m.orangeActionUntil=G.t+dur;m.orangeActionLength=dur;
 setAnim(m,anim);
 floatText(m.x,m.y-76,name,'#ffe0a0');
 telegraph({...spec,dur,cb:()=>{
  if(orangeEffectAlive(M,R,m))hit();
 }});
}
function orangeCabaji(M,R,m,spd,d,moveTo){
 const P=G.P,x=m.x,y=m.y,zoro=R.zoro;
 if(d>150){moveTo(P.x,P.y,spd);setAnim(m,'ride',true);return;}
 if(m.cd>0){
  if(d>42)moveTo(P.x,P.y,spd*.72);
  setAnim(m,'ride',true);
  return;
 }
 const move=m.orangeMove++%3;
 const aim=move===2&&zoro.hp>0&&d2(m,zoro)<112**2?zoro:P;
 const ang=Math.atan2(aim.y-y,aim.x-x);
 mobFace(m,aim.x-x,aim.y-y);
 m.cd=m.hp<m.maxhp*.4?1.85:2.48;
 if(move===0){
  orangeStrike(M,R,m,L2('¡Carga sobre una rueda!','One-wheel charge!'),.65,{shape:'line',x,y,ang,len:155,w:32},()=>{
   for(let i=0;i<15;i++)if(!moveEnt(M,m,8*Math.cos(ang),8*Math.sin(ang)))break;
   if(orangeLineHits(P,x,y,ang,155,16))hurtPlayer(m.atk*1.2,{lv:m.lv});
   if(orangeLineHits(zoro,x,y,ang,155,16))orangeAllyHurt(zoro,m.atk*.58,m.lv);
   burst(m.x,m.y,14,{sp:80,life:.4,c:['#cfbba2','#ead3ae']});
   setAnim(m,'ride',true);sfx('swing');
  });
 }else if(move===1){
  orangeStrike(M,R,m,L2('Trompos de la plaza','Spinning tops'),.62,{shape:'cone',x,y,ang,arc:1.18,r:140},()=>{
   for(const turn of [-.42,0,.42])spawnProj('m',m.x,m.y-9,ang+turn,{spd:128,dmg:m.atk*.65,art:'orangeTop',life:1.4,lv:m.lv});
   sfx('swing');
  },'throw');
 }else{
  const tx=x+18*Math.cos(ang),ty=y+18*Math.sin(ang);
  orangeStrike(M,R,m,L2('Barrido de sable','Saber sweep'),.48,{shape:'circle',x:tx,y:ty,r:58},()=>{
   if(dist2(P.x,P.y,tx,ty)<58**2)hurtPlayer(m.atk,{lv:m.lv});
   if(dist2(zoro.x,zoro.y,tx,ty)<58**2)orangeAllyHurt(zoro,m.atk*.54,m.lv);
   addFx({type:'ring',x:tx,y:ty,r:53,dur:.3,col:'#e9e2bc'});sfx('swing');
  });
 }
}
function orangeBuggy(M,R,m,spd,d,moveTo){
 const P=G.P,x=m.x,y=m.y,ang=Math.atan2(P.y-y,P.x-x);
 if(m.introUntil>G.t)return;
 if(m.splitUntil&&m.splitUntil<=G.t){
  m.splitUntil=0;m.rejoinUntil=G.t+.68;
  for(const piece of m.orangeParts||[])piece.windup=0;setAnim(m,'rejoin');
  addFx({type:'ring',x,y,r:36,dur:.31,col:'#f1a77c'});
 }
 if(m.rejoinUntil>G.t)return;
 if(m.splitUntil>G.t){m.af=Math.floor((G.t-m.splitAt)*5)%2;return;}
 m.orangeParts=null;
 if(d>150||m.cd>.12&&d>91){
  const dx=P.x-m.home.x,dy=P.y-m.home.y,l=Math.hypot(dx,dy),limit=96;
  const f=l>limit?limit/l:1;
  moveTo(m.home.x+dx*f,m.home.y+dy*f,spd);return;
 }
 if(m.cd>0){setAnim(m,'idle',true);return;}
 mobFace(m,P.x-x,P.y-y);
 const move=m.orangeMove++%3;
 m.cd=m.hp<m.maxhp*.4?1.65:2.4;
 if(move===0){
  orangeSplit(m,4.2);m.cd=.35;
  shellsRescueSpeak(m,'¡Mis manos van a dar una vuelta!','My hands are going for a little walk!');
 }else if(move===1){
  orangeStrike(M,R,m,L2('Abanico de cuchillas','Knife fan'),.57,{shape:'cone',x,y,ang,arc:1.1,r:154},()=>{
   for(const turn of [-.34,-.17,0,.17,.34])spawnProj('m',m.x,m.y-10,ang+turn,{spd:174,dmg:m.atk*.53,art:'dagger',life:1.1,lv:m.lv,orangeBoss:m});
   sfx('swing');
  },'throw');
 }else{
  const tx=x+24*Math.cos(ang),ty=y+24*Math.sin(ang);
  orangeStrike(M,R,m,L2('Patada del payaso','Clown kick'),.52,{shape:'circle',x:tx,y:ty,r:56,orangeKick:m},()=>{
   if(dist2(P.x,P.y,tx,ty)<56**2)hurtPlayer(m.atk*.98,{lv:m.lv,orangeBoss:m});
   for(const ally of [R.zoro,R.luffy])if(dist2(ally.x,ally.y,tx,ty)<56**2)orangeAllyHurt(ally,m.atk*.38,m.lv);
   addFx({type:'ring',x:tx,y:ty,r:54,dur:.3,col:'#fff1bf'});sfx('swing');
  });
 }
}
{const old=drawProj;drawProj=function(e,cx,cy){
 if(e.art!=='orangeTop')return old.apply(this,arguments);
 const x=Math.round(e.x-cx),y=Math.round(e.y-cy-4);
 ctx.fillStyle='#304759';ctx.fillRect(x-5,y-4,10,4);
 ctx.fillStyle='#daa45f';ctx.fillRect(x-4,y-3,8,2);
 ctx.fillStyle='#466f85';ctx.fillRect(x-2,y,4,2);
 ctx.fillStyle='#344558';ctx.fillRect(x-1,y-7,2,3);ctx.fillRect(x-1,y+2,2,2);
 ctx.fillStyle='#f7d687';ctx.fillRect(x+Math.round(Math.sin(e.t*42)*3),y-3,2,1);
};}
{const old=drawFx;drawFx=function(f,cx,cy){
 if(f.type!=='orangeKnife')return old.apply(this,arguments);
 const d=175*(f.t/f.dur);
 ctx.save();ctx.translate(f.x-cx+d*Math.cos(f.angle),f.y-cy+d*Math.sin(f.angle));
 ctx.rotate(f.angle);ctx.fillStyle='#502f2d';ctx.fillRect(-7,-2,6,4);
 ctx.fillStyle='#f6e7cd';ctx.fillRect(-1,-2,10,3);ctx.fillRect(9,-1,3,1);ctx.restore();
};}
// Use actual pieces from Buggy's animated sprite rather than a second full body.
{const old=drawEnt;drawEnt=function(e,cx,cy){
 if(e.mid===ORANGE_BUGGY&&!e.dying&&e.orangeParts?.length)return;
 return old.apply(this,arguments);
};}
DL_HOOKS.push((list,cx,cy)=>{
 const m=G.map?.orange?.run?.boss;
 if(m?.mid!==ORANGE_BUGGY||m.dying||!m.orangeParts?.length)return;
 for(const f of m.orangeParts)list.push({type:'xdraw',x:f.x,y:f.y,draw:()=>{
  const {c,w,h}=f.sprite;
  if(f.windup)ctx.globalAlpha=.76+.24*Math.cos(G.t*35);
  ctx.drawImage(c,Math.round(f.x-cx-w/2),Math.round(f.y-cy-f.z-h/2),w,h);
  ctx.globalAlpha=1;
 }});
});
{const old=drawOverhead;drawOverhead=function(e,cx,cy){
 const result=old.apply(this,arguments),R=G.map?.orange?.run;
 if(!['duel','captainFight'].includes(R?.phase)||(e!==R.luffy&&e!==R.zoro))return result;
 const x=Math.round(e.x-cx-16),y=Math.round(e.y-cy-66);
 ctx.fillStyle='#19313b';ctx.fillRect(x,y,32,4);
 ctx.fillStyle=e.orangeResolve?'#ffc66a':'#93d882';
 ctx.fillRect(x+1,y+1,Math.round(30*e.hp/e.maxhp),2);
 if(e.orangeResolve&&e.hp>0){
  ctx.fillStyle=e===R.zoro?'#a9ec9f':'#ffb479';
  for(let i=0;i<4;i++){
   const a=G.t*4+i*Math.PI*.5;
   ctx.fillRect(Math.round(e.x-cx+Math.cos(a)*14),Math.round(e.y-cy+Math.sin(a)*5),2,1);
  }
 }
 return result;
};}
{const old=updateBoss;updateBoss=function(m,dt,d,dh,spd,moveTo){
 if(m.mid!==ORANGE_CABAJI&&m.mid!==ORANGE_BUGGY)return old.apply(this,arguments);
 const M=G.map,R=M.orange?.run;
 if(R?.boss!==m||G.P.dead)return;
 if(m.orangeActionUntil>G.t){
  m.af=clamp(Math.floor(4*(1-(m.orangeActionUntil-G.t)/m.orangeActionLength)),0,3);return;
 }
 if(m.mid===ORANGE_CABAJI)orangeCabaji(M,R,m,spd,d,moveTo);
 else orangeBuggy(M,R,m,spd,d,moveTo);
};}

function orangeClear(M){
 const R=M?.orange?.run;
 if(!R)return;
 for(const e of [R.zoro,R.luffy,R.boss])if(e&&!e.dying)e.remove=true;
 if(R.boss&&G.bossBar===R.boss)showBoss(null);
 M.orange.run=null;
}
{const old=bossKilled;bossKilled=function(m){
 const M=G.map,R=M?.orange?.run;
 const result=old.apply(this,arguments);
 if(R?.boss!==m)return result;
 if(m.mid===ORANGE_CABAJI){
  R.phase='walkToCaptain';R.walkUntil=G.t+2.35;
  shellsRescueSpeak(R.zoro,'Buena pelea. Ahora a la carpa, antes de que ese payaso se escape.','Good fight. To the big top, before that clown gets away.');
  banner(ORANGE_NAME,L2('Cabaji derrotado · Busca la carpa de Buggy','Cabaji defeated · Find Buggy’s Big Top'));
 }else if(m.mid===ORANGE_BUGGY){
  R.phase='done';
  for(const ally of [R.zoro,R.luffy]){ally.noTalk=false;setAnim(ally,'idle');}
  R.luffy.def.lines=[L2('¡Lo mandamos a volar! Gracias por pelear aquí también.','We sent him flying! Thanks for fighting with us again.')];
  R.zoro.def.lines=[L2('Lo vi separarse hasta de sus botas. Buena idea atacarlas.','I saw him split right off his boots. Good call going after them.')];
  shellsRescueSpeak(R.luffy,'¡Se acabó la función! Vamos a comer.','Show’s over! Let’s eat.');
  banner(ORANGE_NAME,L2('Buggy derrotado · El puerto queda libre','Buggy defeated · The harbor is free'));
 }
 return result;
};}
{const old=setMap;setMap=function(M){
 const prev=G.map,result=old.apply(this,arguments);
 if(prev!==G.map){
  orangeClear(prev);
  if(prev?.orange?.nami){prev.orange.nami.remove=true;prev.orange.nami=null;}
 }
 return result;
};}
V33_TICKS.push(dt=>{
 const M=G.map,S=M?.orange,P=G.P;
 if(!S||!P)return;
 if(!P.dawnCrewJoined&&orangeNear(ORANGE_LOOKOUT,340)){
  S.nami=S.nami||spawnNPC(ORANGE_NAMI,...dawnPx(ORANGE_LOOKOUT),M.id,{wander:4,hgt:56});
 }else if(S.nami){S.nami.remove=true;S.nami=null;}
 const cabajiWon=orangeWon(ORANGE_CABAJI),R=S.run;
 if(R?.phase==='walkToCaptain'){
  if(!P.dead&&G.t<R.walkUntil){
   for(const [ally,off] of [[R.zoro,0],[R.luffy,1]])shellsActorMove(M,ally,...dawnPx([614,495+off]),dt);
   return;
  }
  orangeClear(M);
 }
 const at=cabajiWon?ORANGE_BUGGY_AT:ORANGE_DUEL;
 if(!orangeNear(at,540)){orangeClear(M);return;}
 const run=S.run|| (S.run=orangeFindActors(M));
 const m=run.boss;
 if(run.phase==='duel'){
  orangePartner(M,run,run.zoro,true,dt);
 }else if(run.phase==='captainFight'){
  if(run.cutAt&&G.t>=run.cutAt){
   run.cutAt=0;run.zoro.dir='right';setAnim(run.zoro,'atk');
   run.zoro.actionUntil=G.t+.52;run.zoro.actionLength=.52;
   addFx({type:'shells_sword',x:run.zoro.x,y:run.zoro.y,source:run.zoro,target:m,at:.12,index:1,count:1,dur:.34});
   orangeSplit(m,2.9);
   floatText(m.x,m.y-93,L2('¡Se separó!','He split apart!'),'#fff0bf',true);
   shellsRescueSpeak(run.zoro,'Lo corté. ¿Por qué sigue sonriendo?','I cut him. Why is he still smiling?');
  }
  if(run.zoro.actionUntil>G.t)run.zoro.af=clamp(Math.floor(4*(1-(run.zoro.actionUntil-G.t)/run.zoro.actionLength)),0,3);
  else if(run.zoro.hp>0&&run.zoro.anim==='atk')setAnim(run.zoro,'idle',true);
  buggyTrackParts(M,run,dt);
  if(m.splitUntil<=G.t)orangePartner(M,run,run.zoro,true,dt);
  else if(run.zoro.actionUntil<=G.t)orangeEvade(run,run.zoro,dt);
  orangePartner(M,run,run.luffy,false,dt);
 }
});
GSIS.push(['orange_town',ORANGE_NAME,()=>[
 L2('Navega al sur de Foosha. En el muelle de Orange Town hace falta la Fruta del Diablo. Puedes hablar con Nami cerca del mercado.','Sail south from Foosha. You’ll need the Devil Fruit at Orange Town’s wharf. Look for Nami near the market.'),
 L2('Después de vencer a Morgan, habla con Zoro en la plaza para retar a Cabaji (567). Después encontrarás la carpa de Buggy (570). Al separarse, sus pies siguen en el suelo.','After defeating Morgan, talk to Zoro at the square to challenge Cabaji (567). Then head for Buggy’s Big Top (570). When Buggy splits, his feet stay on the ground.')
],()=>({m:'dawn',loc:!orangeChapterReady()?[makeDawn().shells.start+SHELLS_RESCUE_AT[0],SHELLS_RESCUE_AT[1]]:orangeWon(ORANGE_CABAJI)?ORANGE_CIRCUS:ORANGE_DUEL,t:!orangeChapterReady()?SHELLS_RESCUE_TITLE:ORANGE_NAME})]);

// Nami alternates a lookout pose with the engine's normal walk and interaction.
{const old=updateNPC;updateNPC=function(e,dt){
 if(e.id!==ORANGE_NAMI)return old.apply(this,arguments);
 const P=G.P,near=d2(e,P)<46**2;
 if(!near&&e.anim!=='walk'&&Math.floor(G.t)%12>=9){
  e.dir='down';setAnim(e,'look',true);return;
 }
 if(e.anim==='look')setAnim(e,'idle',true);
 return old.apply(this,arguments);
};}
