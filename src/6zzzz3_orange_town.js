// Southern extension of the Dawn Sea. The quay, market and hillside share one walkable map.
const ORANGE_NAME='Orange Town';
const ORANGE_QUAY=[604,430], ORANGE_MOORING=[604,426];
const ORANGE_MARKET=[604,465], ORANGE_DUEL=[603,492], ORANGE_CIRCUS=[635,516];
const ORANGE_LOOKOUT=[617,455];
const ORANGE_PAVING=pal(['#9a8870','#b6a58a','#c3b399','#ccbea5','#d8ccb1']);
const ORANGE_BRICK=pal(['#aa7a54','#c0976e','#c7a176','#d8af80','#e0b98d']);
const ORANGE_WATER=pal(['#277299','#318bac','#3699b7','#4aa6bf','#64b7c5','#89d3cc']);
const ORANGE_SAND=pal(['#bc9864','#d2b580','#ddc38b','#e8ce98','#f3d9a4']);
const ORANGE_FLOOR=pal(['#2687ac','#65b8c5','#f4dfab','#ae805b','#a39880','#72925b','#bf7550']);
const ORANGE_TILES={water:0,shoal:1,sand:2,wood:3,stone:4,green:5,plaza:6};
const orangeFootprint=(w,h)=>Array.from({length:w*h},(_,i)=>[i%w-(w>>1),-Math.floor(i/w)]);
function orangeShore(x,y){
 const a=(1-Math.hypot((x-558)/232,(y-540)/116))*116;
 const b=(1-Math.hypot((x-680)/109,(y-507)/71))*71;
 const harbor=(Math.hypot((x-602)/63,(y-420)/29)-1)*29;
 return Math.min(Math.max(a,b)+Math.sin(x*.114+y*.08)*2.7+Math.cos(x*.23-y*.09)*1.6,harbor);
}
function orangeSquare(x,y){
 return Math.abs(x-604)<17&&Math.abs(y-465)<8||
  Math.abs(x-603)<16&&Math.abs(y-491)<9||
  Math.abs(x-635)<14&&Math.abs(y-513)<12;
}
function orangeTile(x,y,d){
 const K=ORANGE_TILES;
 if(x>=601&&x<=607&&y>=429&&y<440)return K.wood;
 if(x>=544&&x<=658&&y>=440&&y<=448)return K.stone;
 if(d<0)return d>-5?K.shoal:K.water;
 if(d<3)return K.sand;
 if(orangeSquare(x,y))return K.plaza;
 if(Math.abs(x-604)<=3&&y<=628||Math.abs(y-504)<=2&&x>=604&&x<=635||
   y>=454&&x>380&&x<769&&(y%16<2||x%22<3)||y>=442&&y<=451&&x>525&&x<675)return K.stone;
 return d<7?K.green:K.sand;
}
EXTRA_SPR.orangeTent=()=>spr('orange:tent',()=>{
 const p=new Pix(158,133),ivory=pal(['#9b7861','#caa482','#e5c9a0','#f5deb4']),
  red=pal(['#6c3139','#9b453e','#c45d49','#e78260']), blue=pal(['#284756','#375f68','#527e79','#80a79a']);
 p.poly([[12,101],[78,79],[148,100],[148,119],[79,132],[10,119]],ivory[0]);
 p.poly([[16,91],[141,91],[139,115],[76,126],[18,113]],red[1]);
 for(let x=24;x<137;x+=14)p.vl(x,97,19,red[2]);
 const roof=[[3,95],[22,80],[38,61],[57,39],[79,14],[99,41],[122,69],[155,95],[121,108],[79,113],[39,108]];
 p.poly(roof,ivory[3]);
 p.poly([[79,14],[47,69],[30,103],[52,111],[63,78]],red[2]);
 p.poly([[79,14],[95,65],[115,110],[139,102],[110,64]],red[1]);
 p.poly([[79,14],[71,72],[65,111],[91,112],[87,71]],blue[3]);
 p.poly([[63,128],[63,102],[74,96],[86,96],[97,104],[97,128]],blue[0]);
 for(let x=8;x<151;x+=8)p.ell(x,98+Math.floor((1-Math.abs(79-x)/79)*11),2,2,C('#ffcf77'));
 p.vl(79,2,17,WOOD[1]);p.poly([[79,2],[100,5],[93,9],[80,9]],red[3]);
 p.outline(OUTL,false);return {c:p.canvas(),ax:79,ay:127};
});
function addOrangeTown(M){
 const start=M.h,h=704,w=M.w;
 for(const key of ['ter','lvl','reg','flags','solidO','objAt']){
  const before=M[key],after=new before.constructor(w*h);
  if(key==='objAt')after.fill(-1);
  after.set(before);M[key]=after;
 }
 M.h=h;M.chh=Math.ceil(h/CH);
 while(M.objGrid.length<M.cw*M.chh)M.objGrid.push([]);
 const terrain=new Uint8Array((h-start)*w);
 const types=[T.DEEP,T.DEEP,T.SAND,T.BRIDGE,T.COBBLE,T.GRASS,T.COBBLE];
 for(let y=start;y<h;y++)for(let x=0;x<w;x++){
  const i=(y-start)*w+x,t=orangeTile(x,y,orangeShore(x,y));
  terrain[i]=t;M.ter[M.I(x,y)]=types[t];
 }
 M.orange={start,terrain};
 const ground=(x,y)=>terrain[(y-start)*w+x];
 const R=new RNG(389267);
 const homes=[[572,451,2],[582,451,0],[626,451,5],[638,452,4],[650,451,14],
  [585,470,3],[625,465,5],[635,465,8],[645,465,10],[652,478,9],[621,481,2],
  [584,497,4],[591,523,12],[614,530,3],[631,531,14],[649,530,16]];
 const house=(x,y,style)=>addObj(M,'shellHouse',x,y,{style,fp:orangeFootprint(4+style%4,3)});
 for(const [x,y,style] of homes)house(x,y,style);
 for(let row=0;row<23;row++){
  const y=454+row*8;
  for(let block=377;block<768;block+=22){
   for(const off of [6,13,19]){
    const x=block+off,ty=y+R.int(-1,1),style=R.int(0,23);
    if(ground(x,ty)!==ORANGE_TILES.sand||orangeShore(x,ty)<10||
      orangeSquare(x-3,ty-2)||orangeSquare(x+3,ty-2)||Math.abs(x-604)<8||
      Math.abs(ty-504)<5&&x>=603&&x<=638||
      homes.some(([hx,hy])=>Math.abs(hx-x)<7&&Math.abs(hy-ty)<6))continue;
    house(x,ty,style);
   }
  }
 }
 for(const [x,y,k] of [[597,445,'lantern'],[611,445,'lantern'],[596,460,'stall'],[614,462,'stall'],
  [596,474,'pot'],[611,474,'pot'],[591,454,'crate'],[589,445,'barrel'],[617,446,'nets'],
  [552,446,'crate'],[553,446,'barrel'],[651,442,'nets'],[640,441,'cart'],[628,461,'crate'],
  [588,485,'lantern'],[614,485,'lantern'],[591,497,'pot'],[613,499,'pot'],[628,514,'barrel'],
  [645,518,'crate'],[640,508,'lantern'],[631,509,'lantern']]){
  addObj(M,k,x,y,{col:x%2?'#a75842':'#4d8380',kind:'wood'});
 }
 for(const [x,y] of [[548,438],[566,437],[584,437],[621,438],[647,437],[657,437]]){
  addObj(M,'boat',x,y,{fp:[],solid:false});
 }
 for(const x of [552,566,581,594,614,628,641,652]){
  addObj(M,'shellTerrace',x,440,{fp:[],solid:false,span:11});
 }
 for(let k=0;k<110;k++){
  const x=R.int(325,781),y=R.int(443,651);
  if(ground(x,y)===ORANGE_TILES.green&&canPlace(M,x,y,1))addObj(M,'tree',x,y,{sp:k%4?'roble':'palma'});
 }
 addObj(M,'orangeTent',635,507,{fp:orangeFootprint(9,4)});
 return M;
}
{const old=makeDawn;makeDawn=function(){
 const M=old.apply(this,arguments);
 return M.orange?M:addOrangeTown(M);
};}
function dawnSouthernWaterPixel(x,y,shoal,pattern){
 const wave=(y+Math.floor(Math.sin(x*.035)*5))%42===0&&x%81<30;
 return ORANGE_WATER[(shoal?3:0)+(TEX.mud[pattern]>1?1:0)+(wave?1:0)];
}
function orangePaint(M,cx,cy){
 const p=new Pix(CHP,CHP),ox=cx*CHP,oy=cy*CHP,{terrain,start}=M.orange,K=ORANGE_TILES;
 for(let iy=0;iy<CHP;iy++)for(let ix=0;ix<CHP;ix++){
  const x=ox+ix,y=oy+iy,pat=(y&127)*128+(x&127),t=terrain[((y>>4)-start)*M.w+(x>>4)];
  let col;
  if(t===K.wood)col=WOOD[(x&7)===0?1:TEX.plank[pat]];
  else if(t===K.stone||t===K.plaza){
   const row=y>>3,offset=x+(row%2)*7,stone=hash2(offset>>4,row,382);
   col=(t===K.stone?ORANGE_PAVING:ORANGE_BRICK)[(offset%16===0||y%8===7)?0:1+Math.floor(stone*4)];
  }else if(t===K.sand)col=ORANGE_SAND[TEX.sand[pat]];
  else if(t===K.green)col=GP.valle[TEX.grass[pat]];
  else col=dawnSouthernWaterPixel(x,y,t===K.shoal,pat);
  p.set(ix,iy,col);
 }
 return p.canvas();
}
{const old=dawnPaint;dawnPaint=function(M,cx,cy){
 return M.orange&&cy*CH>=M.orange.start?orangePaint(M,cx,cy):old.apply(this,arguments);
};}
function orangeOverviewColor(M,x,y,i){
 if(M.objs[M.objAt[i]]?.k==='shellHouse')return C('#9a5041');
 return ORANGE_FLOOR[M.orange.terrain[(y-M.orange.start)*M.w+x]];
}
MAPC.orange=[ORANGE_NAME,ORANGE_NAME,'#ed994f','house'];
{const old=otherPOI;otherPOI=function(M){
 const list=old.apply(this,arguments);
 if(M.orange)for(const [[x,y],t] of [
  [ORANGE_QUAY,L2('Orange Town · Muelle','Orange Town · Wharf')],
  [ORANGE_MARKET,L2('Mercado de Orange Town','Orange Town Market')],
  [ORANGE_DUEL,L2('Plaza del duelo de Cabaji','Cabaji Duel Square')],
  [ORANGE_CIRCUS,L2('Carpa de Buggy','Buggy’s Big Top')]
 ])list.push({c:'orange',x,y,t});
 return list;
};}

function orangeDockAction(){
 const P=G.P,M=G.map;
 if(!M?.orange||!P||P.dead||G.fading)return null;
 if(P.dawnHelm){
  if(P.dawnHelm.kind==='swim'||dist2(P.x,P.y,...dawnPx(ORANGE_MOORING))>=52**2)return null;
  return dfHas()?'orange_land':'orange_closed';
 }
 return P.dawnBoat?.orange&&dist2(P.x,P.y,...dawnPx(ORANGE_QUAY))<35**2?'orange_sail':null;
}
function orangeDock(landing){
 if(orangeDockAction()!==(landing?'orange_land':'orange_sail'))return;
 dawnIslandDock(landing,'orange',ORANGE_QUAY,ORANGE_MOORING,ORANGE_NAME,L2('Puerto de los tejados de colores','Harbor of colorful rooftops'));
}
function dawnIslandDock(landing,berth,pier,mooring,title,subtitle){
 transition(()=>{
  const P=G.P,M=G.map,[x,y]=dawnPx(mooring);
  if(landing){
   P.dawnBoat={x,y,dir:'down',h:P.dawnHelm,[berth]:true};
   if(P.dawnHelm.kind==='galleon')P._alvidaBerth={x,y,dir:'down'};
   P.dawnHelm=null;
   [P.x,P.y]=dawnPx(pier);
   banner(title,subtitle);
  }else{
   P.dawnHelm=P.dawnBoat.h;P.dawnBoat=null;P.x=x;P.y=y;
  }
  P.dir=landing?'down':'up';P.target=null;
  updateCamera(0,true);prewarm(M);netPresence(true);markDirty(true);
 });
}
XACT.orange_closed=[L2('Desembarco cerrado · Fruta del Diablo','Landing closed · Devil Fruit'),'ways',()=>toast(L2('Necesitas una Fruta del Diablo para desembarcar en Orange Town. La Hilandera Muda (nivel 600) puede soltarla.','You need a Devil Fruit to land in Orange Town. The Mute Spinner (level 600) can drop one.'),'info',5)];
XACT.orange_land=[L2('Desembarcar en Orange Town','Land at Orange Town'),'ways',()=>orangeDock(true)];
XACT.orange_sail=[L2('Volver a la embarcación','Return to your ship'),'ways',()=>orangeDock(false)];
{const old=interactTarget;interactTarget=function(){
 const key=orangeDockAction();
 return key?{kind:'xact',label:XACT[key][0],icon:'ways',o:{xact:key}}:old.apply(this,arguments);
};}
{
 const entry=MAPW_LIST.find(m=>m.id==='dawn');
 entry.n=L2('Mar de Dawn · Foosha, Little Garden, Shells Town y Orange Town','Dawn Sea · Foosha, Little Garden, Shells Town and Orange Town');
 entry.how=L2('Habla con Marina en Puerto Coral a partir de nivel 500. Lleva una Fruta del Diablo para desembarcar en Orange Town, al sur de Foosha.','Talk to Marina in Coral Port at level 500 or higher. Bring a Devil Fruit to land in Orange Town, south of Foosha.');
}
