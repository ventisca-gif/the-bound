const CONOMI_NAME=L2('Islas Conomi','Conomi Islands');
const CONOMI_X=1264,CONOMI_Y=768,CONOMI_W=192,CONOMI_H=155;
const conAt=(x,y)=>[CONOMI_X+x,CONOMI_Y+y];
const CON_MOOR=conAt(96,141),CON_PIER=conAt(96,132);
const CON_VILLAGE=conAt(96,106),CON_GOSA=conAt(145,47),CON_ORCHARD=conAt(117,108);
const CON_PROMISE=conAt(86,102),CON_GATE=conAt(39,77),CON_PARK=conAt(39,62);
const CON_ROOM=conAt(168,101),CON_ENTRY=conAt(168,112),CON_ARCHIVE=conAt(168,96);
const CON_COURTS={hatchan:conAt(27,65),kuroobi:conAt(50,63),chew:conAt(56,83)};
const CON_ROADS=[
 [[96,126],[96,106],[65,100],[39,77],[39,61]],
 [[96,106],[117,108],[133,88],[145,63],[145,47]]
];
function conomiTile(x,y){
 if(x<0||x>=CONOMI_W||y<0||y>=CONOMI_H)return '';
 if(x>=155&&x<=181&&y>=89&&y<=114)return x===155||x===181||y===89||y===114?'wall':'archive';
 if(x>=94&&x<=98&&y>=125&&y<=134)return 'dock';
 const coast=Math.max(1-Math.hypot((x-88)/77,(y-77)/54),1-Math.hypot((x-133)/38,(y-54)/29))+
  Math.sin(x*.19+y*.12)*.021+Math.sin(x*.09-y*.31)*.018;
 if(coast<0)return '';
 if(coast<.075)return 'sand';
 if(x>=21&&x<=57&&y>=44&&y<=76){
  if((x===21||x===57||y===44||y===76)&&!(y===76&&Math.abs(x-39)<=2))return 'wall';
  if(y>=53&&y<=58&&(x>=26&&x<=33||x>=45&&x<=52))return 'pool';
  return 'court';
 }
 for(const road of CON_ROADS)for(let i=1;i<road.length;i++){
  const [ax,ay]=road[i-1],[bx,by]=road[i],dx=bx-ax,dy=by-ay;
  const f=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy),0,1);
  if(dist2(x,y,ax+dx*f,ay+dy*f)<=3.1**2)return 'trail';
 }
 return 'grass';
}
const CON_TERRAIN={wall:T.IWALL,archive:T.FLOOR,dock:T.BRIDGE,sand:T.SAND,pool:T.WATER,court:T.COBBLE,trail:T.DIRT,grass:T.GRASS};
{const old=makeDawn;makeDawn=function(){
 const M=old.apply(this,arguments);
 if(M.conomi)return M;
 M.conomi={locals:[]};
 for(let y=0;y<CONOMI_H;y++)for(let x=0;x<CONOMI_W;x++){
  const t=conomiTile(x,y);if(!t)continue;
  const i=M.I(...conAt(x,y));M.ter[i]=CON_TERRAIN[t];M.lvl[i]=0;
 }
 const house=(x,y,style)=>addObj(M,'shellHouse',...conAt(x,y),{style,fp:orangeFootprint(5,3)});
 for(const [x,y,style] of [[86,116,1],[104,115,3],[110,101,4],[95,96,5],[79,104,0],[144,39,7],[154,44,8],[139,55,9]])house(x,y,style);
 const tree=(x,y,v)=>addObj(M,'tree',...conAt(x,y),{sp:v?'palma':'roble',v:v%4});
 for(let y=32;y<=116;y+=7)for(let x=21;x<159;x+=8){
  if((x*9+y*7)%11<5||conomiTile(x,y)!=='grass'||Math.hypot(x-96,y-106)<23||Math.hypot(x-145,y-47)<16)continue;
  tree(x,y,1+(x+y)%3);
 }
 for(let x=114;x<=130;x+=4)for(let y=108;y<=116;y+=4)if(conomiTile(x,y)==='grass')tree(x,y,0);
 for(const [x,y,f] of [[162,94,'bookshelf'],[174,94,'bookshelf'],[166,94,'desk'],[170,94,'desk'],[161,100,'barrels'],[176,100,'barrels']]){
  addObj(M,'furn',...conAt(x,y),{f,fp:[[0,0]]});
 }
 return M;
};}
const CON_COLORS={wall:['#79504a','#ad7760'],archive:['#8f614a','#be8a60'],dock:['#986541','#c4915b'],sand:['#e2c58e','#f1dbaa'],pool:['#278da9','#6dd0d5'],court:['#b7ada0','#d5c6b3'],trail:['#cea976','#e4c491'],grass:['#6c9b55','#8cbc68']};
{const old=renderChunk;renderChunk=function(M,cx,cy){
 const c=old.apply(this,arguments),ox=cx*CH-CONOMI_X,oy=cy*CH-CONOMI_Y;
 if(!M.conomi||ox+CH<=0||oy+CH<=0||ox>=CONOMI_W||oy>=CONOMI_H)return c;
 const g=c.getContext('2d');
 for(let y=0;y<CH;y++)for(let x=0;x<CH;x++){
  const t=conomiTile(ox+x,oy+y);if(!t)continue;
  const [dark,light]=CON_COLORS[t],px=x*16,py=y*16;
  g.fillStyle=light;g.fillRect(px,py,16,16);g.fillStyle=dark;
  if(t==='wall'||t==='court'||t==='archive'||t==='dock'){
   g.fillRect(px,py+15,16,1);g.fillRect(px+((ox+x+oy+y)&1)*8,py,1,16);
   if(t==='wall')g.fillRect(px,py+6,16,2);
  }else{
   const hash=((ox+x)*63+(oy+y)*47)&15;
   g.fillRect(px+hash,py+3,2,1);g.fillRect(px+3,py+hash,3,1);
  }
 }
 return c;
};}
{const old=orangeOverviewColor;orangeOverviewColor=function(M,x,y){
 const t=M.conomi&&conomiTile(x-CONOMI_X,y-CONOMI_Y);
 return t?C(CON_COLORS[t][1]):old.apply(this,arguments);
};}
{const old=otherPOI;otherPOI=function(M){
 const out=old.apply(this,arguments);
 if(M.conomi)for(const [at,t] of [[CON_PIER,CONOMI_NAME],[CON_VILLAGE,'Cocoyashi'],[CON_GOSA,'Gosa'],[CON_ORCHARD,L2('Huerto de Bell-mère','Bell-mère’s orchard')],[CON_PARK,'Arlong Park']])out.push({x:at[0],y:at[1],c:'inn',t});
 return out;
};}
function conomiNear(P,at,r=36){return dist2(P.x,P.y,...dawnPx(at))<r*r;}
function conomiMove(at){
 const P=G.P;[P.x,P.y]=dawnPx(at);P.L=0;P.dir='up';P.target=null;
 updateCamera(0,true);prewarm(G.map);netPresence(true);
}
function conomiDockKey(){
 const P=G.P,M=G.map;
 if(!M?.conomi||!P||P.dead||G.fading)return null;
 if(P.dawnHelm?.kind==='skiff'&&conomiNear(P,CON_MOOR,60))return P.baratieSanji&&dfHas()?'conomi_board':'conomi_locked';
 if(!P.dawnHelm&&P.dawnBoat?.conomi&&conomiNear(P,CON_PIER,44))return 'conomi_sail';
 return null;
}
XACT.conomi_board=[L2('Desembarcar en Conomi','Land on Conomi'),'ways',()=>{
 if(conomiDockKey()==='conomi_board')dawnIslandDock(true,'conomi',CON_PIER,CON_MOOR,CONOMI_NAME,L2('Busca a Nojiko en Cocoyashi.','Find Nojiko in Cocoyashi.'));
}];
XACT.conomi_locked=[L2('Conomi · completa Baratie','Conomi · complete Baratie'),'ways',()=>toast(L2('Recluta a Sanji y consigue una Fruta del Diablo para desembarcar.','Recruit Sanji and obtain a Devil Fruit to land.'),'info',4)];
XACT.conomi_sail=[L2('Volver al Going Merry','Return to the Going Merry'),'ways',()=>{
 if(conomiDockKey()==='conomi_sail')dawnIslandDock(false,'conomi',CON_PIER,CON_MOOR,CONOMI_NAME,'');
}];
