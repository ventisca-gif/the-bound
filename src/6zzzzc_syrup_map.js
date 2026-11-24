// Villa Syrup is a southern extension of the same navigable Dawn Sea grid.
const SYRUP_NAME=L2('Villa Syrup','Syrup Village');
const SYRUP_BOUNDS=[704,704,512,304];
const SYRUP_PIER=[950,735],SYRUP_MOOR=[950,730],SYRUP_BOARD=[947,743];
const SYRUP_VILLAGE=[950,776],SYRUP_MESHI=[940,777],SYRUP_MANOR=[991,765];
const SYRUP_NORTH=[905,792],SYRUP_WOOD=[995,819],SYRUP_KURO=[926,825];
const SYRUP_COAST=[[955,854,235,131],[1002,805,143,68],[856,831,99,76],[1090,882,76,54]];
const SYRUP_CLIFFS=[[874,792,27,11],[930,802,13,5],[916,836,39,9],[1018,837,22,8],[1100,852,35,10]];
const SYRUP_ROADS=[
 [2.8,[SYRUP_PIER,[950,754],SYRUP_VILLAGE,[948,798],[953,829],[967,864],[985,904],[1030,926]]],
 [2.4,[SYRUP_VILLAGE,[965,776],[981,775],SYRUP_MANOR,[1017,776],[1054,788],[1090,809],[1128,826]]],
 [2.6,[SYRUP_VILLAGE,[933,781],[919,787],SYRUP_NORTH,[880,806],[844,822],[820,841],[792,856]]],
 [2.4,[SYRUP_NORTH,[907,806],[915,816],SYRUP_KURO,[950,832]]],
 [2.1,[SYRUP_MANOR,[987,781],[990,802],SYRUP_WOOD,[1011,844],[1036,868],[1079,896],[1110,902]]],
 [2.0,[[820,841],[849,877],[894,901],[945,904],[985,904]]]
];
const SYRUP_TERRAIN=[T.DEEP,T.DEEP,T.SAND,T.GRASS,T.DIRT,T.FACE,T.BRIDGE,T.STONE,T.GRASS];
const SYRUP_COLORS=[
 ['#277398','#3288aa','#3f99b5','#4ba6bd','#6ac0ca'],
 ['#53a8b0','#67b8b7','#82c6bd','#a2d3c1','#c2e2c7'],
 ['#bda078','#d0b687','#e0c596','#eacc9d','#f2d9ad'],
 ['#456e45','#578246','#6e9b50','#85aa59','#a0bc68'],
 ['#ac8b62','#bc9b71','#d3b284','#e2c397','#e9cea6'],
 ['#6a676e','#88818b','#a19ba0','#b5acad','#c9bdb7'],
 ['#684638','#886149','#aa7e56','#c09566','#dfb781'],
 ['#92948b','#a8aa9b','#bcbcaa','#cdcdba','#dedac7'],
 ['#567546','#6d904e','#80a554','#98b862','#b3c878']
].map(pal);
function syrupTile(S,x,y){
 return x<S.x||y<S.y||x>=S.x+S.w||y>=S.y+S.h?0:S.cells[(y-S.y)*S.w+x-S.x];
}
function syrupLand(M,x,y){return !!M?.syrup&&syrupTile(M.syrup,x>>4,y>>4)>=2;}
function syrupArea(x,y,[cx,cy],rx,ry){return Math.hypot((x-cx)/rx,(y-cy)/ry)<1;}
function syrupArt(kind){
 return spr('syrup:building:'+kind,()=>{
  if(kind==='manor'){
   const W=286,H=190,p=new Pix(W,H),ivory=pal(['#827e70','#b8b4a2','#d1cabb','#e6dfcf','#f3ecdc']);
   const slate=pal(['#374b62','#4f6781','#66829d','#8099ac','#a2b6c5']);
   p.rect(13,68,260,113,ivory[3]);p.rect(18,76,249,105,ivory[4]);
   for(let y=78;y<178;y+=7)p.hl(15,y,254,ivory[2]);
   for(const x of [16,65,112,167,216,265]){
    p.rect(x-3,70,7,110,ivory[2]);p.vl(x-2,72,103,ivory[4]);p.rect(x-4,172,9,6,ivory[1]);
   }
   p.poly([[8,71],[30,27],[255,27],[278,71]],slate[2]);
   for(let y=29;y<71;y+=5){
    const inset=Math.round((71-y)*.48);
    p.hl(8+inset,y,270-2*inset,slate[1]);p.hl(9+inset,y+1,269-2*inset,slate[3]);
    for(let x=12+inset+(y%2)*5;x<271-inset;x+=13)p.vl(x,y+2,3,slate[1]);
   }
   p.hl(8,70,270,slate[0]);p.hl(28,27,229,slate[4]);
   for(const x of [61,226]){
    p.poly([[x-16,50],[x,29],[x+16,50],[x+13,63],[x-13,63]],ivory[2]);
    p.line(x-18,50,x,27,slate[0]);p.line(x,27,x+18,50,slate[0]);drawWindow(p,x-5,48,10,12);
   }
   p.poly([[104,66],[112,47],[129,32],[143,20],[157,32],[174,47],[182,66]],ivory[3]);
   p.line(102,65,143,19,slate[0]);p.line(143,19,184,65,slate[0]);
   p.ell(143,47,12,12,ivory[1]);p.ell(143,47,9,9,slate[2]);p.hl(136,47,14,slate[4]);p.vl(143,40,14,slate[4]);
   for(const x of [32,77,184,229])for(const y of [84,126])drawWindow(p,x,y,24,24);
   p.rect(118,74,50,105,ivory[2]);p.rect(122,76,42,87,ivory[4]);
   drawWindow(p,131,86,24,29);drawDoor(p,143,175,26,36);
   p.poly([[108,130],[143,115],[178,130],[169,137],[117,137]],slate[1]);p.hl(115,134,57,slate[3]);
   for(const x of [114,166]){p.rect(x,136,6,43,ivory[1]);p.vl(x+1,137,40,ivory[4]);}
   for(let y=177;y<188;y+=3){p.rect(116-(y-177),y,54+2*(y-177),3,ivory[y%2?2:1]);p.hl(116-(y-177),y,54+2*(y-177),ivory[4]);}
   p.outline(OUTL);return {c:p.canvas(),ax:143,ay:186};
  }
  if(kind==='wing')return genBuilding({w:7,h:6,wallH:72,style:'albor',roof:'blue',gable:true,box:true,chimney:true,v:12});
  if(kind==='arch'){
   const p=new Pix(93,53),metal=pal(['#313e4a','#45525e','#657280','#87949a']);
   for(const x of [6,76]){p.rect(x,9,11,42,SYRUP_COLORS[7][1]);p.rect(x-2,8,15,5,SYRUP_COLORS[7][3]);p.vl(x+1,13,33,SYRUP_COLORS[7][4]);}
   for(let i=17;i<77;i+=6){const a=Math.sqrt(Math.max(0,1-((i-46)/32)**2));p.vl(i,25-12*a,24+12*a,metal[0]);p.set(i,24-12*a,metal[2]);}
   p.hl(17,39,59,metal[1]);p.hl(17,46,59,metal[0]);p.ell(46,35,3,3,GOLD[3]);
   return {c:p.canvas(),ax:46,ay:50};
  }
  if(kind==='meshi'){
   const b=genBuilding({w:9,h:6,wallH:59,style:'albor',roof:'thatch',gable:true,box:true,chimney:true,awning:'#9a493c',v:10});
   const g=b.c.getContext('2d');g.fillStyle='#342a27';g.fillRect(b.ax-24,b.ay-53,48,14);g.fillStyle='#dbba73';g.fillRect(b.ax-22,b.ay-51,44,10);
   g.font='bold 8px monospace';g.fillStyle='#574133';g.textAlign='center';g.fillText('MESHI',b.ax,b.ay-43);
   return b;
  }
  const v=Number(kind);
  return genBuilding({w:v%3+5,h:v%2+4,wallH:39+v%3*8,style:'albor',roof:['thatch','red','blue','brown'][v%4],gable:true,box:true,chimney:v%3===1,v});
 });
}
EXTRA_SPR.syrupBuilding=o=>syrupArt(o.style);
function addSyrupIsland(M){
 const [x0,y0,w,h]=SYRUP_BOUNDS,height=y0+h,oldHeight=M.h;
 for(const key of ['ter','lvl','reg','flags','solidO','objAt']){
  const old=M[key],next=new old.constructor(M.w*height);
  if(key==='objAt')next.fill(-1);
  if(key==='ter')next.fill(T.DEEP,M.w*oldHeight);
  next.set(old);M[key]=next;
 }
 M.h=height;M.chh=Math.ceil(height/CH);
 while(M.objGrid.length<M.cw*M.chh)M.objGrid.push([]);
 const S=M.syrup={x:x0,y:y0,w,h,cells:new Uint8Array(w*h),locals:[]};
 const road=selvaDistanceField(w,h,SYRUP_ROADS.map(([r,ps])=>[r,ps.map(([x,y])=>[x-x0,y-y0])]));
 const clearings=[[SYRUP_NORTH,12,8],[SYRUP_WOOD,13,9],[SYRUP_KURO,15,10],[SYRUP_VILLAGE,10,7],[SYRUP_MANOR,20,17]];
 for(let v=0;v<h;v++)for(let u=0;u<w;u++){
  const x=x0+u,y=y0+v,i=M.I(x,y);
  const coast=gardenShape(x,y,SYRUP_COAST)+Math.sin(x*.09+y*.12)*3.3+Math.sin(x*.21-y*.15)*1.4;
  const inlet=(Math.hypot((x-950)/38,(y-722)/27)-1)*27,shore=Math.min(coast,inlet);
  const pier=Math.abs(x-950)<=3&&y>=734&&y<=756,trail=road[v*(w+1)+u]<0;
  const courtyard=syrupArea(x,y,[991,758],20,18),cleared=clearings.some(([at,rx,ry])=>syrupArea(x,y,at,rx,ry));
  const k=pier?6:shore<0?(shore>-6?1:0):courtyard?7:trail?4:
   !cleared&&gardenShape(x,y,SYRUP_CLIFFS)>0?5:shore<3?2:cleared?8:3;
  S.cells[v*w+u]=k;M.ter[i]=SYRUP_TERRAIN[k];
 }
 const house=(style,x,y,w=5,h=3)=>addObj(M,'syrupBuilding',x,y,{style,fp:orangeFootprint(w,h)});
 house('manor',991,754,17,6);house('wing',976,757,7,4);house('wing',1006,757,7,4);
 addObj(M,'syrupBuilding',991,770,{style:'arch',solid:false,fp:[]});
 for(let x=972;x<=1010;x++)if(Math.abs(x-991)>3)addObj(M,'dawn',x,770,{dawnKey:'fenceH',fp:[[0,0]]});
 house('meshi',940,773,9,4);
 const homes=[[928,774],[945,767],[959,785],[967,770],[963,796],[929,795],[916,780],[939,807],[953,813],
  [876,822],[858,829],[836,845],[829,856],[810,850],[828,871],[849,870],[860,856],
  [1053,788],[1066,802],[1080,817],[1096,815],[1101,833],[1118,812],[1130,822],[1141,831],
  [1004,907],[1022,916],[1045,907],[1052,921],[1065,916],[1077,895],[1100,899]];
 homes.forEach(([x,y],i)=>house(i%16,x,y));
 const R=new RNG(706580);
 for(let y=y0+8;y<y0+h-8;y+=5)for(let x=x0+8;x<x0+w-8;x+=5){
  const tx=x+R.int(-2,2),ty=y+R.int(-2,2);
  if(syrupTile(S,tx,ty)!==3||!canPlace(M,tx,ty,2)||homes.some(([hx,hy])=>Math.abs(hx-tx)<6&&Math.abs(hy-ty)<5))continue;
  const forest=tx>974&&ty>802&&tx<1040&&ty<859||tx<882&&ty<826;
  if(R.f()<(forest?.82:.34))addObj(M,'tree',tx,ty,{sp:forest&&R.f()<.55?'ebano':'roble',v:R.int(0,3),deco:true});
  else if(R.f()<.21)addObj(M,'rareFern',tx,ty,{v:R.int(0,3),solid:false,fp:[]});
 }
 for(const [x,y,k] of [[947,735,'lantern'],[953,735,'lantern'],[947,750,'crate'],[953,751,'barrel'],[937,778,'barrel'],[935,780,'pot'],
  [954,774,'stall'],[957,775,'crate'],[984,766,'rareFern'],[997,766,'rareFern'],[945,771,'lantern'],[950,778,'lantern']]){
  addObj(M,k,x,y,{solid:false,fp:[],kind:'wood',col:'#a65541'});
 }
 addObj(M,'rareCrewSign',...SYRUP_BOARD,{solid:false,fp:[]});
 return M;
}
{const old=makeDawn;makeDawn=function(){const M=old.apply(this,arguments);return M.syrup?M:addSyrupIsland(M);};}
{const old=dawnPaint;dawnPaint=function(M,cx,cy){
 if(!M.syrup||cy*CH<SYRUP_BOUNDS[1])return old.apply(this,arguments);
 const p=new Pix(CHP,CHP);
 for(let j=0;j<CHP;j++)for(let i=0;i<CHP;i++){
  const x=cx*CHP+i,y=cy*CHP+j,v=(y&127)*128+(x&127),k=syrupTile(M.syrup,x>>4,y>>4);
  const tone=k===2?TEX.sand[v]:k===4?TEX.dirt[v]:k===5?((y&7)===7?0:TEX.rock[v]):k===6?TEX.plank[v]:k===7?TEX.stone[v]:TEX.grass[v];
  p.set(i,j,k<=1?dawnSouthernWaterPixel(x,y,k===1,v):SYRUP_COLORS[k][tone]);
 }
 return p.canvas();
};}
{const old=orangeOverviewColor;orangeOverviewColor=function(M,x,y,i){
 if(!M.syrup||y<SYRUP_BOUNDS[1])return old.apply(this,arguments);
 const k=syrupTile(M.syrup,x,y),o=M.objs[M.objAt[i]];
 return o?.k==='syrupBuilding'?C(o.style==='manor'||o.style==='wing'?'#668398':'#a07858'):SYRUP_COLORS[k][k===3&&M.solidO[i]?0:2];
};}
MAPC.syrup=[SYRUP_NAME,SYRUP_NAME,'#eadb8b','house'];
const SYRUP_MARKS=[
 [SYRUP_PIER,L2('Muelle de Villa Syrup','Syrup Village Pier')],[SYRUP_VILLAGE,SYRUP_NAME],[SYRUP_MESHI,'Meshi'],
 [SYRUP_MANOR,L2('Mansión de Kaya','Kaya’s Manor')],[SYRUP_NORTH,L2('Cuesta de los hermanos felinos','Cat Brothers’ Slope')],
 [SYRUP_WOOD,L2('Bosque del péndulo','Pendulum Woods')],[SYRUP_KURO,L2('Terraza del capitán Kuro','Captain Kuro’s Terrace')],
 [[849,871],L2('Casas de los pastos','Pasture Cottages')],[[1104,830],L2('Casas del alto','Hilltop Cottages')]];
{const old=otherPOI;otherPOI=function(M){
 const list=old.apply(this,arguments);
 if(M.syrup)for(const [[x,y],t] of SYRUP_MARKS)list.push({x,y,t,c:'syrup'});
 return list;
};}
