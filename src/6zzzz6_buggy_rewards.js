// Orange Town rewards use the usual inventory, fruit, wardrobe and boss HUD.
const BARA_ID='df_bara', BUGGY_CLAWS='w_buggy_claws';
const BUGGY_DODGE=.10;
const BUGGY_STYLE={
 coat:P5(['#52292a','#7e382e','#b95430','#ec7c38','#ffae56']),
 trim:P5(['#7e5a48','#a47d61','#dbb88d','#efd3a5','#fff0cb']),
 wine:P5(['#33192f','#57283c','#833743','#ac504f','#d57a65']),
 plum:P5(['#281e3e','#463151','#634875','#8b6590','#ab82a4']),
 teal:P5(['#123134','#28534e','#3d7263','#639681','#9cc6a6']),
 leather:P5(['#231d22','#483027','#745036','#9c7148','#c6985f']),
 blue:P5(['#192f50','#264a79','#386b9a','#5794bd','#8dc6de']),
 glove:P5(['#3e4059','#697086','#adb7c1','#dbe0df','#fff5df']),
 blade:P5(['#353844','#5e7688','#aebcc5','#d8e7e7','#fff9df'])
};
DFR.bara={item:BARA_ID,n:'Bara Bara',ic:'🍇',
 desc:L2('Tu cuerpo se separa al recibir un ataque. Cada impacto tiene un <b>10 %</b> de probabilidad de esquivarse automáticamente.','Your body can split when struck. Each incoming hit has a <b>10%</b> chance to be dodged automatically.'),
 passive:L2('Pasiva · 10 % de probabilidad de esquivar un impacto al separarte.','Passive · 10% chance to dodge an incoming hit by splitting apart.'),
 colors:['#874aac','#d587e6','#80bc82']};
DFS.bara=[];
it(BARA_ID,{n:L2('Fruta Bara Bara','Bara Bara Fruit'),t:'cons',stack:true,price:0,icon:['bara_fruit'],rar:5,
 d:L2('La fruta de Buggy. Cómela para obtener un 10 % de probabilidad de esquivar cada impacto. Solo puedes tener el poder de una fruta.','Buggy’s fruit. Eat it for a 10% chance to dodge each incoming hit. You can only have one fruit power.')});
const buggyTierAtk=Object.keys(CLASSES).map(c=>ITEMS['w_'+c+'_41']?.atk).filter(Number.isFinite).sort((a,b)=>a-b);
it(BUGGY_CLAWS,{n:L2('Guantes de Garra de Buggy','Buggy’s Claw Gloves'),t:'weapon',slot:'weapon',lv:570,tier:41,
 atk:Math.round(buggyTierAtk[Math.floor(buggyTierAtk.length/2)]*1.04),
 price:40000,icon:['buggy_claws'],rar:5,buggyClaws:true,
 d:L2('Dos guantes blancos con cuchillas. Todas las clases pueden usarlos a nivel 570. El golpe normal es un tajo corto que escala con tus atributos, nivel y forma.','Two white bladed gloves. Every class can equip them at level 570. The basic slash scales with your attributes, level and form.')});

// The generated fruit art is sampled to the game’s native 16×16 icon grid.
const BARA_ICON=[
 '................',
 '.......6........',
 '....9..7..9.....',
 '....9777979.....',
 '.....09691......',
 '.....cddaa......',
 '....8ddab52.....',
 '...6eb3b3ed.....',
 '...bcaeebcc3....',
 '...85aecc3b2....',
 '...4ebab5db1....',
 '...ae8835db2....',
 '....85de853.....',
 '....23cc531.....',
 '......221.......',
 '................'
];
const BARA_COLORS=pal(['#2a0729', '#40125c', '#530d68', '#56177a', '#5d286c', '#67178d', '#67406c', '#679672', '#681187', '#69616c', '#75178e', '#7c1d9d', '#83239f', '#9130aa', '#a443bd']);
function buggyFruitIcon(){
 const p=new Pix(16,16);
 BARA_ICON.forEach((row,y)=>{for(let x=0;x<row.length;x++)if(row[x]!=='.')p.set(x,y,BARA_COLORS[parseInt(row[x],16)]);});
 return p;
}
function buggyClawIcon(){
 const p=new Pix(16,16),G=BUGGY_STYLE.glove,A=BUGGY_STYLE.blade;
 p.poly([[2,13],[3,10],[5,7],[9,8],[11,11],[9,14],[5,15]],G[2]);
 p.line(3,13,6,10,G[4]);p.line(6,14,9,11,G[3]);p.set(8,13,BUGGY_STYLE.coat[2]);
 for(const [x,y] of [[6,8],[9,9],[11,10]]){
  p.poly([[x-1,y],[x+2,y-6],[x+4,y-7],[x+3,y-2],[x+1,y+1]],A[2]);
  p.line(x+2,y-4,x+3,y-6,A[4]);p.set(x,y,A[0]);
 }
 p.outline(OUTL,false);return p;
}
const BUGGY_CLAW_PIX=buggyClawIcon();
{const old=genIcon;genIcon=function(spec){
 if(spec[0]==='bara_fruit')return buggyFruitIcon();
 if(spec[0]==='buggy_claws')return BUGGY_CLAW_PIX;
 return old.apply(this,arguments);
};}
{const old=gearTiers;gearTiers=function(P){
 const out=old.apply(this,arguments);
 if(P.equip.weapon?.id===BUGGY_CLAWS)out.bcl=1;
 return out;
};}
{const old=cleanGear;cleanGear=function(g){
 const out=old.apply(this,arguments);
 if(g?.bcl===1)out.bcl=1;
 return out;
};}
{const old=heroLook;heroLook=function(cls,app,gear){
 const L=old.apply(this,arguments);
 if(gear?.bcl)L.weapon={k:'buggy_claws',tier:41,dual:true};
 return L;
};}
{const old=drawWeapon;drawWeapon=function(p,W,hx,hy,ang){
 if(W?.k!=='buggy_claws')return old.apply(this,arguments);
 drawSpriteRot(p,BUGGY_CLAW_PIX,hx,hy,ang,[7,11]);
};}
function buggyGloveBasic(P,ang){
 delayAct(.09,()=>{
  if(P.dead||P.equip.weapon?.id!==BUGGY_CLAWS)return;
  const range=42;
  hitArc(P.x,P.y,ang,range,1.7,P.S.atk,{kb:16});
  for(let i=-1;i<=1;i++)addFx({type:'slash',x:P.x,y:P.y+i*2,ang:ang+i*.19,arc:1.4,r:range-3+4*i,dur:.22,col:'#f7dfb5'});
  sfx('slash');
 });
}
function baraDodge(P){
 if(P.fruit!=='bara'||Math.random()>=BUGGY_DODGE)return false;
 floatText(P.x,P.y-42,L2('¡Bara Bara!','Chop-Chop!'),'#ebacff');
 addFx({type:'ring',x:P.x,y:P.y,r:22,dur:.28,col:'#cf96e9'});
 burst(P.x,P.y-12,8,{sp:48,up:22,life:.3,c:DFR.bara.colors});
 return true;
}

fitKind('head','buggy_hat',(p,A)=>{
 const K=BUGGY_STYLE,{side,up,d}=A,x=Math.round(A.hx),y=Math.round(A.headTop),shift=side?d*2:0;
 const X=x+shift;
 for(const sign of side?[-d]:[-1,1]){
  p.poly([[x+sign*6,y+4],[x+sign*10,y+3],[x+sign*12,y+7],[x+sign*11,y+14],[x+sign*8,y+10]],K.blue[2]);
  p.line(x+sign*9,y+5,x+sign*10,y+10,K.blue[3]);
 }
 p.poly([[X-10,y+3],[X-8,y+1],[X-4,y-2],[X,y-4],[X+4,y-2],[X+8,y+1],[X+10,y+3],[X+6,y+6],[X-6,y+6]],K.coat[2]);
 p.line(X-9,y+3,X-3,y-2,K.trim[4]);p.line(X-3,y-2,X,y-3,K.trim[3]);
 p.line(X,y-3,X+9,y+3,K.trim[2]);
 p.hl(X-6,y+5,13,K.coat[0]);
 if(!up){
  const n=X+(side?d:0);
  p.ell(n,y+1,2,1,K.glove[4]);
  p.set(n-1,y+1,K.coat[0]);p.set(n+1,y+1,K.coat[0]);p.hl(n-1,y+3,3,K.glove[4]);
 }
});
fitKind('body','buggy_shirt',(p,A)=>{
 const K=BUGGY_STYLE,{tx0,tw,torsoTop,th,up,side,d,cx}=A;
 for(let j=1;j<th-1;j++){
  const y=torsoTop+j,strip=j%4<2?K.wine:K.trim;
  for(let x=tx0;x<tx0+tw;x++){
   // Preserve the native silhouette, especially the fitted waist and shoulder curves.
   if(p.t&&p.t[y*p.w+x]!==2||x===tx0||x===tx0+tw-1)continue;
   p.set(x,y,strip[x===tx0?3:x===tx0+tw-1?1:2+(j%2)]);
  }
 }
 if(!up){
  const x=Math.round(cx+(side?d*2:0)),y=torsoTop+1;
  p.poly([[x-2,y-1],[x+2,y-1],[x+1,y+1],[x+2,y+4],[x,y+3],[x-2,y+4],[x-1,y+1]],K.plum[2]);
  p.hl(x-1,y,3,K.plum[4]);p.set(x,y+2,K.plum[3]);
 }
});
fitKind('legs','buggy_slacks',(p,A)=>{
 const {legTop,base}=A,K=BUGGY_STYLE;
 for(let y=legTop;y<base-1;y++)for(let x=2;x<p.w-2;x++){
  const c=p.get(x,y),i=K.teal.indexOf(c);
  if(i<0)continue;
  if(y>=base-4)p.set(x,y,y&1?K.trim[3]:K.wine[3]);
  else if(i>1&&((x+y)%9===0))p.set(x,y,K.teal[i-1]);
 }
});
fitKind('feet','buggy_boots',(p,A)=>{
 const K=BUGGY_STYLE;
 for(let y=A.base-4;y<=A.base+1;y++)for(let x=2;x<p.w-2;x++){
  const v=p.get(x,y);
  if(!K.leather.includes(v)||y!==A.base-1||x%3!==1)continue;
  p.set(x,y,GOLD[3]);
 }
});
fitKind('back','buggy_coat',(p,A)=>{
 const K=BUGGY_STYLE,{cx,tw,torsoTop:top,base,side,d,up,f}=A;
 const bottom=base-2-(A.anim==='walk'?f%2:0);
 for(let y=top-1;y<=bottom;y++){
  const span=Math.round(tw/2+2+(y-top)*.16);
  for(let i=-span;i<=span;i++){
   const edge=Math.abs(i)===span;
   if(side?(i*d>0||Math.abs(i)>7):!up&&Math.abs(i)<tw/2-1)continue;
   const x=Math.round(cx+i-(side?d:0));
   const fur=edge||y<=top+1||y===bottom;
   p.set(x,y,fur?K.trim[edge?2:3]:K.coat[i<0?3:i%3===0?1:2]);
  }
 }
});
const BUGGY_COSTUMES=[
 ['c_buggy_hat','Sombrero de Buggy','Buggy’s Tricorne','head',()=>({k:'buggy_hat'})],
 ['c_buggy_coat','Abrigo de Buggy','Buggy’s Coat','back',()=>({k:'buggy_coat'})],
 ['c_buggy_shirt','Camiseta, pañuelo y guantes de Buggy','Buggy’s Shirt, Scarf and Gloves','body',()=>({k:'buggy_shirt',m:CLOTH.gris,s:BUGGY_STYLE.trim,cuff:BUGGY_STYLE.trim,hand:BUGGY_STYLE.glove})],
 ['c_buggy_slacks','Pantalón de Buggy','Buggy’s Trousers','legs',()=>({k:'buggy_slacks',m:BUGGY_STYLE.teal,s:BUGGY_STYLE.teal})],
 ['c_buggy_boots','Botas de Buggy','Buggy’s Boots','feet',()=>({k:'buggy_boots',m:BUGGY_STYLE.leather,s:BUGGY_STYLE.leather})]
];
const BUGGY_COS_SOURCE=L2('Buggy (nivel 570) en Orange Town. 30 % por prenda, segura a la victoria 15.','Buggy (level 570) in Orange Town. 30% per piece, guaranteed on win 15.');
for(const [id,es,en,slot,vis] of BUGGY_COSTUMES){
 cosm(id,L2(es,en),slot,vis,{src:BUGGY_COS_SOURCE});
 it('cosi_'+id,{n:COSM[id].n,t:'cos',cos:id,icon:['hanger'],price:40000,rar:5,d:BUGGY_COS_SOURCE});
}

SAVEKEYS.push('buggyPity');
const BUGGY_REWARD_TABLE=[
 [BARA_ID,.10,20,P=>P.fruit==='bara'||countItem(BARA_ID)>0],
 [BUGGY_CLAWS,.20,10,P=>P.equip.weapon?.id===BUGGY_CLAWS||countItem(BUGGY_CLAWS)>0],
 ...BUGGY_COSTUMES.map(([id])=>['cosi_'+id,.30,15,P=>P.wardrobe.includes(id)])
];
const buggyMissing=P=>BUGGY_REWARD_TABLE.filter(row=>!row[3](P));
const buggyLeft=(P,id,cap)=>Math.max(1,cap-(P.buggyPity?.[id]||0));
BOSS_EXTRA[ORANGE_BUGGY]=()=>{
 const P=G.P;
 if(!P?.inv)return [];
 return buggyMissing(P).map(([id,chance,cap])=>[id,chance,L2('seguro en ','sure in ')+buggyLeft(P,id,cap)]);
};
{const old=showBoss;showBoss=function(m){
 const r=old.apply(this,arguments),root=$('#bossbar'),drops=root?.querySelector('.bdrops'),bar=root?.querySelector('.bar');
 if(drops&&bar){
  if(m?.mid===ORANGE_BUGGY)bar.after(drops);
  else bar.before(drops);
 }
 return r;
};}
{const old=bossKilled;bossKilled=function(m){
 const P=G.P,R=G.map?.orange?.run;
 const eligible=m.mid===ORANGE_BUGGY&&R?.boss===m&&R.phase==='captainFight';
 const result=old.apply(this,arguments);
 if(!eligible)return result;
 P.buggyPity=P.buggyPity||{};
 for(const [id,chance,cap] of buggyMissing(P)){
  const tries=Math.min(cap,(P.buggyPity[id]||0)+1);
  if(tries<cap&&Math.random()>=chance*dropEventMul()){P.buggyPity[id]=tries;continue;}
  if(giveItem(id,1,true)){
   delete P.buggyPity[id];
   if(id===BARA_ID)P.dfKey=1;
   lootFx(m.x,m.y,id);
  }else P.buggyPity[id]=cap;
 }
 markDirty(true);
 return result;
};}
{const old=itemSources;itemSources=function(id){
 const row=BUGGY_REWARD_TABLE.find(r=>r[0]===id||r[0]==='cosi_'+id);
 if(!row)return old.apply(this,arguments);
 const s=L2('Buggy en Orange Town · ','Buggy in Orange Town · ')+Math.round(row[1]*100)+L2(' % · seguro a la victoria ','% · guaranteed by win ')+row[2];
 return [[s,{loc:ORANGE_CIRCUS,m:'dawn',t:'Orange Town'}]];
};}
