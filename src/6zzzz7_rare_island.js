// A second island in the southern Dawn Sea with its own terrain and native chunk rendering.
const RARE_NAME=L2('Isla de los Animales Raros','Island of Rare Animals');
const RARE_BOUNDS=[1136,416,272,232];
const RARE_PIER=[1244,459], RARE_MOORING=[1244,454];
const RARE_BOARD=[1242,463], ORANGE_BOARD=[601,434];
const RARE_CLEARING=[1246,501], RARE_TERRACE=[1275,488], RARE_LAKE=[1290,528];
const RARE_CHESTS=[[1267,489],[1271,486],[1276,487],[1280,485],[1284,489]];
const RARE_LAND=[[1260,534,112,69],[1211,549,68,47],[1313,509,60,40],[1325,554,44,34]];
const RARE_RIDGES=[[1225,494,16,9],[1306,484,17,9],[1234,566,33,11],[1340,574,17,9]];
const RARE_TRAILS=[
 [2.3,[[1244,468],[1244,483],[1246,501],[1251,509],[1269,523],[1277,532],[1308,534],[1336,546],[1348,562]]],
 [2.1,[[1246,501],[1259,497],[1265,494],[1275,490],[1290,489],[1320,503]]],
 [1.6,[[1251,509],[1237,521],[1219,532],[1198,552],[1178,553]]],
 [1.9,[[1276,532],[1260,549],[1265,568],[1286,585],[1314,579]]]
];
const RARE_RIVER=[[2.15,[[1290,529],[1307,529],[1317,541],[1330,541],[1347,540],[1369,543],[1383,540]]]];
const RARE_TILES={deep:0,shoal:1,beach:2,forest:3,path:4,cliff:5,water:6,wood:7,meadow:8,shelf:9};
const RARE_TERRAIN=[T.DEEP,T.DEEP,T.SAND,T.GRASS,T.DIRT,T.FACE,T.WATER,T.BRIDGE,T.GRASS,T.STONE];
const RARE_PALETTE=[
 ['#26769a','#328aab','#3c9ab5','#499ec0','#68b8c7'],
 ['#448d9a','#519ea1','#65b1ab','#7ac8b7','#a4d8bf'],
 ['#af9061','#c6a677','#dec18d','#eacf9d','#f3dbad'],
 ['#305d46','#3d704c','#528457','#5e9259','#75a167'],
 ['#a08562','#b0976d','#c0a878','#d4b983','#dfc488'],
 ['#71534d','#896851','#a38360','#b99569','#ccab7c'],
 ['#2a7474','#328b84','#489b88','#6ab2a0','#8ac4af'],
 ['#79513a','#975f41','#b88055','#ca956a','#e5b37b'],
 ['#466d46','#5d864c','#759651','#89a95c','#a7bb69'],
 ['#957b63','#ac9370','#bba57d','#d5b68a','#dfc59e']
].map(pal);
const RARE_ANIMALS=[
 ['rare_tiger','Tigre elefante','Elephant tiger',[1241,500]],
 ['rare_rhino','Rinoceronte rayado','Striped rhinoceros',[1324,544]],
 ['rare_zebra','Caballo cebra','Zebra horse',[1249,497]],
 ['rare_giraffe','Jirafa moteada','Spotted giraffe',[1252,502]],
 ['rare_hippo','Hipopótamo peludo','Shaggy hippo',[1319,548]],
 ['rare_rooster','Perro gallo','Rooster dog',[1243,503]],
 ['rare_pig','Cerdo con melena','Maned pig',[1248,505]],
 ['rare_bat','Murciélago de cara blanca','White-faced bat',[1242,496]],
 ['rare_rabbit','Conejo serpiente','Rabbit snake',[1250,499]],
 ['rare_pup','Cachorro con capucha','Hooded pup',[1245,497]],
 ['rare_hare','Liebre rosada','Pink hare',[1250,504]]
];
const rareTerrainAt=(S,x,y)=>x<S.x||y<S.y||x>=S.x+S.w||y>=S.y+S.h?undefined:S.land[(y-S.y)*S.w+x-S.x];

function addRareIsland(M){
 const [x0,y0,w,h]=RARE_BOUNDS,K=RARE_TILES, S={x:x0,y:y0,w,h,land:new Uint8Array(w*h),animals:[],chests:[]};
 const local=routes=>routes.map(([width,ps])=>[width,ps.map(([x,y])=>[x-x0,y-y0])]);
 const stride=w+1,trail=selvaDistanceField(w,h,local(RARE_TRAILS)),river=selvaDistanceField(w,h,local(RARE_RIVER));
 for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){
  const i=(y-y0)*w+x-x0,f=(y-y0)*stride+x-x0;
  const shore=gardenShape(x,y,RARE_LAND)+Math.sin(x*.143+y*.115)*2.5+Math.cos(x*.23-y*.15)*1.3;
  const cliff=gardenShape(x,y,RARE_RIDGES);
  const creek=river[f]<0||Math.hypot((x-RARE_LAKE[0])/13,(y-RARE_LAKE[1])/9)<1;
  const path=trail[f]<0, pier=Math.abs(x-RARE_PIER[0])<=2&&y>=458&&y<=478;
  const camp=Math.hypot((x-1246)/12,(y-501)/8)<1;
  const shelf=Math.hypot((x-1276)/14,(y-488)/7)<1;
  const bridge=creek&&path&&shore>0;
  const kind=pier||bridge?K.wood:shore<0?(shore>-4?K.shoal:K.deep):
   creek?K.water:cliff>0&&!path?K.cliff:shelf?K.shelf:shore<3?K.beach:path?K.path:camp?K.meadow:K.forest;
  S.land[i]=kind;M.ter[M.I(x,y)]=RARE_TERRAIN[kind];
 }
 M.rare=S;
 const R=new RNG(220318),ground=(x,y)=>rareTerrainAt(S,x,y);
 for(let y=y0+3;y<y0+h-3;y+=3)for(let x=x0+3;x<x0+w-3;x+=3){
  const tx=x+R.int(-1,1),ty=y+R.int(-1,1);
  if(ground(tx,ty)!==K.forest||R.f()<.24||!canPlace(M,tx,ty,1))continue;
  if(R.f()<.75)addObj(M,'tree',tx,ty,{sp:['roble','ebano','palma'][R.int(0,2)],v:R.int(0,3),deco:true});
  else addObj(M,'rareFern',tx,ty,{v:R.int(0,3),solid:false,fp:[]});
 }
 for(const [x,y,kind] of [[1240,472,'nets'],[1243,475,'crate'],[1246,477,'barrel'],[1240,493,'rareFern'],
  [1243,498,'rareFern'],[1255,504,'rareFern'],[1254,495,'pot'],[1276,535,'rareFern'],[1301,533,'rareFern'],
  [1271,483,'rareFern'],[1289,492,'rareFern'],[1242,458,'lantern'],[1246,458,'lantern']]){
  addObj(M,kind,x,y,{solid:false,fp:[],kind:'wood',col:'#ac7556'});
 }
 for(const [x,y] of [RARE_BOARD,ORANGE_BOARD])addObj(M,'rareCrewSign',x,y,{solid:false,fp:[]});
 RARE_CHESTS.forEach(([x,y],i)=>S.chests.push(addObj(M,'rareChest',x,y,{rareIndex:i,solid:false,fp:[]})));
 return M;
}
EXTRA_SPR.rareFern=o=>spr('rare:fern:'+o.v,()=>{
 const p=new Pix(26,22),leaf=pal(['#285244','#427c4b','#61964f','#91ac68','#c3c27d']);
 for(let i=0;i<7;i++){
  const x=3+i*3,y=5+(i%3)*4;
  p.line(12,20,x,y,leaf[1]);
  p.line(x,y,x+(i<3?3:-3),y+4,leaf[2]);
  p.line(x+(i<3?1:-1),y+1,x+(i<3?2:-2),y+5,leaf[3]);
 }
 if(o.v%2===0)for(const [x,y] of [[6,11],[17,14],[12,8]]){
  p.set(x,y,C('#f8c5a5'));p.set(x+1,y+1,C('#ce8272'));p.set(x-1,y+1,C('#e4a887'));
 }
 return {c:p.canvas(),ax:13,ay:20};
});
EXTRA_SPR.rareCrewSign=()=>spr('rare:crew:sign',()=>{
 const p=new Pix(34,31),blue=pal(['#234557','#38687a','#68a0a1','#b0d0bf']);
 p.rect(14,8,5,23,WOOD[1]);p.vl(15,9,19,WOOD[3]);
 p.poly([[2,3],[29,3],[32,8],[28,17],[2,17],[0,10]],blue[0]);
 p.rect(3,5,25,10,blue[1]);p.hl(4,5,23,blue[2]);
 p.vl(16,6,5,blue[3]);p.line(15,7,11,10,blue[3]);p.line(16,7,20,10,blue[3]);
 p.hl(9,12,13,blue[3]);p.set(8,11,blue[2]);p.set(22,11,blue[2]);
 p.outline(OUTL,false);return {c:p.canvas(),ax:16,ay:29};
});
EXTRA_SPR.rareChest=o=>{
 const open=!!(G.P?.rareChestMask&(1<<o.rareIndex));
 return spr('rare:chest:'+open,()=>{
  const p=new Pix(33,27),iron=pal(['#414551','#62636a','#919098','#d3c4a3']);
  p.poly([[3,13],[6,9],[24,9],[29,12],[30,23],[26,26],[4,26]],WOOD[2]);
  p.rect(5,15,21,10,WOOD[3]);
  for(let y=16;y<26;y+=4)p.hl(4,y,24,WOOD[1]);
  if(open){
   p.poly([[3,13],[0,7],[4,3],[24,3],[29,8],[27,14]],WOOD[2]);
   p.poly([[4,12],[4,6],[23,6],[27,11],[20,15]],WOOD[0]);p.hl(7,12,16,iron[0]);
  }else{
   p.poly([[4,11],[7,7],[23,7],[29,11],[28,17],[3,17]],WOOD[3]);
   p.hl(5,12,22,WOOD[4]);p.hl(3,16,26,WOOD[1]);
  }
  for(const x of [7,23]){p.vl(x,13,11,iron[1]);p.set(x,20,iron[3]);}
  p.rect(14,open?18:15,5,5,iron[2]);p.set(16,open?21:17,iron[0]);
  p.outline(OUTL,false);return {c:p.canvas(),ax:16,ay:24};
 });
};
{const old=makeDawn;makeDawn=function(){
 const M=old.apply(this,arguments);
 return M.rare?M:addRareIsland(M);
};}
function rarePaint(M,cx,cy){
 const S=M.rare,K=RARE_TILES,p=new Pix(CHP,CHP);
 for(let j=0;j<CHP;j++)for(let i=0;i<CHP;i++){
  const x=cx*CHP+i,y=cy*CHP+j,pat=(y&127)*128+(x&127),k=rareTerrainAt(S,x>>4,y>>4),pal=RARE_PALETTE[k];
  if(k===K.deep){p.set(i,j,dawnSouthernWaterPixel(x,y,false,pat));continue;}
  let tone;
  if(k===K.cliff){
   const row=y>>3,offset=x+(row%2)*7;
   tone=offset%19===0||y%8===7?0:TEX.rock[pat];
  }else if(k<=K.shoal||k===K.water){
   const wave=(y+Math.round(Math.sin(x*.074)*4))%41===0&&x%71<23;
   tone=clamp(TEX.mud[pat]+(wave?1:0),0,4);
  }else if(k===K.beach)tone=TEX.sand[pat];
  else if(k===K.path)tone=TEX.dirt[pat];
  else if(k===K.shelf)tone=TEX.stone[pat];
  else if(k===K.wood)tone=(x%8===0?1:TEX.plank[pat]);
  else tone=TEX.grass[pat];
  p.set(i,j,pal[tone]);
 }
 return p.canvas();
}
{const old=dawnPaint;dawnPaint=function(M,cx,cy){
 return M.rare&&rareTerrainAt(M.rare,cx*CH,cy*CH)!==undefined?rarePaint(M,cx,cy):old.apply(this,arguments);
};}
{const old=orangeOverviewColor;orangeOverviewColor=function(M,x,y,i){
 const k=M.rare&&rareTerrainAt(M.rare,x,y);
 if(k===undefined||k===RARE_TILES.deep)return old.apply(this,arguments);
 return RARE_PALETTE[k][k===RARE_TILES.forest&&M.solidO[i]?0:2];
};}
MAPC.rare=[RARE_NAME,RARE_NAME,'#a9d979','star'];
{const old=otherPOI;otherPOI=function(M){
 const all=old.apply(this,arguments);
 if(M.rare)for(const [[x,y],t] of [[RARE_PIER,RARE_NAME],[RARE_CLEARING,L2('Claro de Gaimon','Gaimon’s clearing')],
  [RARE_TERRACE,L2('Cornisa de los cinco cofres','Ledge of the five chests')],[RARE_LAKE,L2('Laguna de las huellas','Footprint Lagoon')]])all.push({c:'rare',x,y,t});
 return all;
};}
