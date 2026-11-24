// Baratie uses Dawn's native collision, camera, minimap and boat state.
const BARATIE_NAME = 'Baratie';
const BARATIE_X = 936, BARATIE_Y = 638;
const barAt = (x, y) => [BARATIE_X+x,BARATIE_Y+y];
const BARATIE_PIER = barAt(24,35), BARATIE_MOOR = barAt(24,39);
const BARATIE_DUEL = barAt(12,24), BARATIE_ARENA = barAt(35,24), BARATIE_GALLEY = barAt(38,11);
const BARATIE_W = 48, BARATIE_H = 35;

function baratieTile(x,y) {
 if((x===23||x===24)&&y>=34&&y<=36)return 'wood';
 const inset = Math.max(0,5-y, y-29);
 if(x<inset||x>=BARATIE_W-inset||y<0||y>=BARATIE_H)return '';
 if(x===inset||x===BARATIE_W-inset-1||y===0||y===34)return 'rail';
 if(y===16&&x>=5&&x<=42&&(x<21||x>26))return 'wall';
 if(y<16&&x===28&&(y<7||y>9))return 'wall';
 if(y<16&&x>28)return 'kitchen';
 if(y<16&&x>=5)return 'dining';
 return 'wood';
}
const baratieReady=P=>dfHas()&&P.rareDone&&syrupWon(SYRUP_CAPTAIN,P)&&P.syrupUsopp;
function baratieHere(M,P) {
 const t=baratieTile((P.x>>4)-BARATIE_X,(P.y>>4)-BARATIE_Y);
 return M?.baratie&&!P.dawnHelm&&t&&t!=='rail'&&t!=='wall';
}
{const old=makeDawn;makeDawn=function(){
 const M=old.apply(this,arguments);
 if(M.baratie)return M;
 M.baratie={locals:[]};
 for(let y=0;y<=36;y++)for(let x=0;x<BARATIE_W;x++){
  const t=baratieTile(x,y);
  if(!t)continue;
  const i=M.I(...barAt(x,y));
  M.ter[i]=t==='rail'||t==='wall'?T.IWALL:T.BRIDGE;
  M.lvl[i]=0;
 }
 const furnish=(f,x,y,fp=[[0,0]],solid=true)=>addObj(M,'furn',...barAt(x,y),{f,fp,solid});
 for(const [x,y,k] of [[9,6,0],[17,6,1],[22,6,2],[9,12,2],[17,12,0],[22,12,1]]){
  furnish('tg_mesa'+k,x,y);
  furnish('chair',x-1,y,[],false);furnish('chair',x+1,y,[],false);
 }
 for(const x of [32,37,42]){
  furnish('tg_fogon',x,4,[[0,0],[1,0]]);
  furnish('tg_encimera',x,13);
 }
 for(const [x,y] of [[5,18],[43,18],[4,28],[43,28],[18,32],[29,32]])furnish('barrels',x,y);
 for(const [x,y] of [[6,3],[25,3],[6,15],[25,15]])furnish('plant',x,y);
 return M;
};}
{const old=renderChunk;renderChunk=function(M,cx,cy){
 const c=old.apply(this,arguments);
 const ox=cx*CH,oy=cy*CH;
 if(!M.baratie||ox+CH<=BARATIE_X||oy+CH<=BARATIE_Y||ox>=BARATIE_X+BARATIE_W||oy>BARATIE_Y+36)return c;
 const g=c.getContext('2d');
 for(let y=0;y<CH;y++)for(let x=0;x<CH;x++){
  const a=ox+x-BARATIE_X,b=oy+y-BARATIE_Y,t=baratieTile(a,b);
  if(!t)continue;
  const px=x*16,py=y*16,odd=(a+b)&1;
  g.fillStyle=t==='wall'?'#407068':t==='rail'?'#60432a':t==='kitchen'?odd?'#b8cdc0':'#dedeca':t==='dining'?odd?'#9e3e40':'#a74746':odd?'#b98450':'#bd8b55';
  g.fillRect(px,py,16,16);
  g.fillStyle=t==='rail'?'#dbb064':t==='wall'?'#aad7b2':t==='kitchen'?'#849e92':t==='dining'?'#d29865':'#875739';
  if(t==='wall'||t==='rail'){g.fillRect(px,py+4,16,2);g.fillRect(px+3,py+5,2,10);}
  else{
   g.fillRect(px,py+15,16,1);
   if(t==='wood'){
    g.fillRect(px+(odd?4:11),py+2,1,9);
    const lane=(a===23||a===24)&&b>=17,edge=b===17||b===33;
    if(lane||edge){g.fillStyle='#d5aa70';g.fillRect(px+(a===24?11:3),py,2,16);}
    if(edge){g.fillStyle='#6b482f';g.fillRect(px,py+3,16,2);}
   }
  }
 }
 return c;
};}
function baratieDockKey(){
 const M=G.map,P=G.P,H=P?.dawnHelm;
 if(!M?.baratie||!P||P.dead||G.fading)return null;
 if(H&&H.kind!=='swim'&&dist2(P.x,P.y,...dawnPx(BARATIE_MOOR))<57**2)return baratieReady(P)?'baratie_board':'baratie_locked';
 if(!H&&P.dawnBoat?.baratie&&dist2(P.x,P.y,...dawnPx(BARATIE_PIER))<42**2)return 'baratie_sail';
 return null;
}
function baratieDock(landing){
 if(baratieDockKey()!==(landing?'baratie_board':'baratie_sail'))return;
 dawnIslandDock(landing,'baratie',BARATIE_PIER,BARATIE_MOOR,BARATIE_NAME,L2('Habla con Sanji en la cocina.','Talk to Sanji in the galley.'));
}
XACT.baratie_board=[L2('Subir al Baratie','Board the Baratie'),'ways',()=>baratieDock(true)];
XACT.baratie_sail=[L2('Volver al barco','Return to your ship'),'ways',()=>baratieDock(false)];
XACT.baratie_locked=[L2('Abordaje cerrado · Baratie','Boarding locked · Baratie'),'ways',()=>toast(L2('Necesitas la Fruta del Diablo. Vence a Kuro y recluta a Usopp en Villa Syrup.','You need the Devil Fruit. Defeat Kuro and recruit Usopp in Syrup Village.'),'info',5)];
{const old=interactTarget;interactTarget=function(){const key=baratieDockKey();return key?rareAction(key):old.apply(this,arguments);};}
{const old=otherPOI;otherPOI=function(M){const out=old.apply(this,arguments);
 if(M?.baratie)for(const [at,t] of [[BARATIE_PIER,'Baratie'],[BARATIE_DUEL,L2('Cubierta del duelo','Dueling deck')],[BARATIE_GALLEY,L2('Cocina del Baratie','Baratie galley')]])out.push({c:'inn',x:at[0],y:at[1],t});
 return out;
};}
{const old=orangeOverviewColor;orangeOverviewColor=function(M,x,y,i){
 const tile=M.baratie&&baratieTile(x-BARATIE_X,y-BARATIE_Y);
 if(tile)return C(tile==='wall'||tile==='kitchen'?'#87baa5':tile==='dining'?'#a95551':'#c79d68');
 return old.apply(this,arguments);
};}
