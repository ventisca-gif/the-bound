// Reverse Mountain / Twin Cape: native Dawn terrain, no replacement of hero or crew atlases.
// All coordinates are in the existing 16px Dawn grid; Grand Line remains a separate future map.
const RMC_BOX=[1440,12,192,330], RMC_SUMMIT=[1536,104], RMC_PIER=[1553,260], RMC_MOOR=[1558,260], RMC_CROCUS=[1528,251], RMC_EXIT=[1578,315];
const RMC_ROUTES=[
 [[1440,172],[1480,151],[1506,128],RMC_SUMMIT],
 [[1448,25],[1480,56],[1510,84],RMC_SUMMIT],
 [[1618,25],[1590,56],[1560,80],RMC_SUMMIT],
 [[1631,150],[1594,138],[1566,116],RMC_SUMMIT],
 [RMC_SUMMIT,[1542,143],[1548,175],[1565,210],[1578,236]]
];
function rmcSegment(x,y,a,b){
 const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));
 return Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t);
}
function rmcTile(x,y){
 if(x<1440||x>=1632||y<12||y>=342)return '';
 if(y>=258&&y<=262&&x>=1537&&x<=1553)return 'dock';
 const bank=Math.max(1-Math.hypot((x-1513)/39,(y-245)/38),1-Math.hypot((x-1620)/32,(y-245)/39));
 if(bank>0){
  if(bank<.12)return 'shore';
  if((Math.abs(y-251)<4&&x<1545)||(Math.abs(y-247)<4&&x>1590))return 'path';
  return 'cape';
 }
 const d=1-Math.hypot((x-1536)/95,(y-108)/87)+Math.sin(x*.19+y*.11)*.018+Math.sin(y*.31)*.012;
 let rd=999;
 for(const route of RMC_ROUTES)for(let i=1;i<route.length;i++)rd=Math.min(rd,rmcSegment(x,y,route[i-1],route[i]));
 if(rd<6.5&&d>-.23)return 'river';
 if(d>0)return d<.11||rd<8?'edge':'rock';
 return '';
}
const RMC_COLORS={rock:['#804945','#a65e55','#c67b6d','#d89683','#e6ac92'],edge:['#754647','#96574d','#ae6a5b','#c48672','#e4ae94'],river:['#287fa2','#3a9dbb','#59b7ce','#87d8e5','#c5eff1'],cape:['#8a6455','#a67c61','#c6a27e','#d6b891','#e2cba2'],shore:['#9b735d','#b18b6d','#cfad86','#e2c5a0','#f1d9b3'],path:['#9f8b75','#b5a18a','#ccbaa1','#e2d0b7','#e9dbc6'],dock:['#785038','#986845','#bb8a58','#d6a970','#e8c292']};
const RMC_TERRAIN={rock:T.FACE,edge:T.FACE,river:T.DEEP,cape:T.STONE,shore:T.SAND,path:T.COBBLE,dock:T.BRIDGE};
const RMC_POI=[[[1454,166],L2('Reverse Mountain · entrada','Reverse Mountain · entrance')],[RMC_SUMMIT,L2('Cima de las corrientes','Summit of the currents')],[RMC_PIER,L2('Cabos Gemelos · muelle','Twin Cape · dock')],[RMC_CROCUS,'Crocus'],[[1578,283],'Laboon'],[RMC_EXIT,L2('Grand Line · próxima ruta','Grand Line · future route')]];
NPCS.rm_crocus={n:'Crocus',title:L2('Farero de Cabos Gemelos','Twin Cape lighthouse keeper'),look:LK({g:'m',hair:HAIRS.blanco,hairStyle:'short',eyes:'negro',skin:SKINS[1],outfit:'tunic',main:pal(['#493c43','#926c4e','#d4aa63','#e9d5a4','#f9edcd'])}),quests:[],lines:[L2('Laboon espera a sus amigos. Cuida el Log Pose: será tu guía cuando zarpes al Grand Line.','Laboon is waiting for his friends. Keep your Log Pose safe: it will guide you when you sail into the Grand Line.') ]};
hookAfter('makeDawn',M=>{
 if(!M||M.rmCape)return;
 const [x0,y0,w,h]=RMC_BOX;
 if(M.w<x0+w||M.h<y0+h){console.warn('Reverse Mountain: map bounds too small');return;}
 // Do not overwrite earlier islands or any existing objects.
 const cells=new Uint8Array(w*h),kinds=['','rock','edge','river','cape','shore','path','dock'];
 for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){
  const t=rmcTile(x,y);if(!t)continue;const i=M.I(x,y);
  if(M.ter[i]!==T.DEEP||(M.objAt&&M.objAt[i]>=0))continue;
  cells[(y-y0)*w+x-x0]=kinds.indexOf(t);M.ter[i]=RMC_TERRAIN[t];M.lvl[i]=0;
 }
 M.rmCape={cells,kinds};M.chunks.clear();
 const prop=(key,x,y,scale,fp)=>{
  if(!['cape','path','shore'].includes(rmcActual(M,x,y)))return;
  addObj(M,'dawn',x,y,{dawnKey:key,dawnScale:scale,fp,solid:fp.length>0});
 };
 prop('lighthouse',1501,233,1.5,[[0,0],[-1,0],[1,0]]);
 prop('lighthouse',1616,233,1.5,[[0,0],[-1,0],[1,0]]);
 prop('house3',1521,242,1,[[0,0],[-1,0],[1,0],[0,-1]]);
 for(const [x,y] of [[1535,257],[1535,263],[1543,257],[1543,263]])if(rmcActual(M,x,y))addObj(M,'lantern',x,y,{kind:'wood',solid:false,fp:[]});
 if(rmcActual(M,...RMC_CROCUS))M.npcDefs.push({id:'rm_crocus',x:RMC_CROCUS[0],y:RMC_CROCUS[1],face:'down'});
});
function rmcActual(M,x,y){const S=M&&M.rmCape,[a,b,w,h]=RMC_BOX;if(!S||x<a||x>=a+w||y<b||y>=b+h)return '';return S.kinds[S.cells[(y-b)*w+x-a]]||'';}
hookAfter('renderChunk',(c,M,cx,cy)=>{
 if(!M.rmCape)return;const [a,b,w,h]=RMC_BOX,ox=cx*CH,oy=cy*CH;
 if(ox+CH<=a||oy+CH<=b||ox>=a+w||oy>=b+h)return;
 const g=c.getContext('2d');
 for(let y=0;y<CH;y++)for(let x=0;x<CH;x++){
  const tx=ox+x,ty=oy+y,t=rmcActual(M,tx,ty);if(!t)continue;
  const P=RMC_COLORS[t],px=x*16,py=y*16,n=hash2(tx,ty,663);
  g.fillStyle=P[t==='rock'?2+Math.floor(n*2):t==='edge'?1:2];g.fillRect(px,py,16,16);
  if(t==='rock'||t==='edge'){
   // Coherent strata and jagged cracks, not a checkerboard.
   const seam=(tx*7+ty*3)%13;g.fillStyle=P[0];g.fillRect(px,py+seam,16,1);
   g.fillStyle=P[3];g.fillRect(px,py+Math.min(15,seam+1),16,1);
   const xx=(tx*11+ty*5)%13;g.fillStyle=P[1];g.fillRect(px+xx,py+2,2,9);
   g.fillStyle=P[4];g.fillRect(px+(xx+4)%13,py+4,2,2);
  }else if(t==='river'){
   g.fillStyle=P[3];g.fillRect(px+(tx*3+ty*5)%10,py+4,5,1);
   if(hash2(tx,ty,664)>.65){g.fillStyle=P[4];g.fillRect(px+4,py+12,6,1);}
  }else if(t==='dock'||t==='path'){
   g.fillStyle=P[0];g.fillRect(px,py+15,16,1);g.fillRect(px+(ty%2)*8,py,1,15);
   g.fillStyle=P[3];g.fillRect(px+1,py,15,1);
  }else{
   g.fillStyle=P[1];g.fillRect(px+(tx*7+ty*3)%14,py+5,2,1);
   g.fillStyle=P[3];g.fillRect(px+6,py+(tx*3+ty*7)%14,2,1);
  }
 }
 return c;
});
hookAfter('orangeOverviewColor',(old,M,x,y)=>{const t=rmcActual(M,x,y);if(t)return C(RMC_COLORS[t][2]);});
hookAfter('otherPOI',(out,M)=>{if(M.rmCape)for(const [at,t] of RMC_POI)out.push({x:at[0],y:at[1],c:'inn',t});});
function rmcDockKey(){
 const P=G.P,M=G.map;if(!P||!M?.rmCape||P.dead||G.fading)return null;
 if(P.dawnHelm?.kind==='skiff'&&conomiNear(P,RMC_MOOR,60))return P.rmDone?'rmc_land':'rmc_locked';
 if(!P.dawnHelm&&P.dawnBoat?.rmcape&&conomiNear(P,RMC_PIER,44))return 'rmc_sail';
 if(P.dawnHelm?.kind==='skiff'&&P.rmDone&&conomiNear(P,RMC_EXIT,70))return 'rmc_exit';
 return null;
}
XACT.rmc_land=[L2('Desembarcar en Cabos Gemelos','Land at Twin Cape'),'ways',()=>{if(rmcDockKey()==='rmc_land')dawnIslandDock(true,'rmcape',RMC_PIER,RMC_MOOR,L2('Cabos Gemelos','Twin Cape'),L2('Habla con Crocus y visita los faros.','Talk to Crocus and visit the lighthouses.'));}];
XACT.rmc_locked=[L2('Completa el encuentro con Laboon','Complete the Laboon encounter'),'ways',()=>toast(L2('Completa primero la promesa con Laboon.','First complete the promise with Laboon.'),'info')];
XACT.rmc_sail=[L2('Volver al Going Merry','Return to the Going Merry'),'ways',()=>{if(rmcDockKey()==='rmc_sail')dawnIslandDock(false,'rmcape',RMC_PIER,RMC_MOOR,'','');}];
XACT.rmc_exit=[L2('Grand Line · próxima expedición','Grand Line · future expedition'),'ways',()=>toast(L2('La ruta al nuevo mar todavía no está abierta.','The route to the new sea is not open yet.'),'info',5)];
hookAround('interactTarget',next=>{const k=rmcDockKey();return k?rareAction(k):next();});
DL_HOOKS.push(list=>{
 const M=G.map,P=G.P;if(!M?.rmCape||!P?.rmDone)return;
 const [x,y]=dawnPx([1578,283]);if(Math.abs(x-P.x)>1200||Math.abs(y-P.y)>1000)return;
 list.push({type:'xdraw',x,y,draw:(e,cx,cy)=>{const s=spr('rm:laboon:peace',XSPR.rm_laboonp);ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(x-cx),Math.round(y-cy+Math.sin(G.t*1.6)*3));ctx.scale(3,3);ctx.drawImage(s.c,-s.ax,-s.ay);ctx.restore();}});
});
WORLD_DRAW.push((cx,cy)=>{
 const M=G.map,P=G.P;if(!M?.rmCape||!P)return;
 const px=P.x/16,py=P.y/16;if(px<1430||px>1640||py>245||py<0)return;
 // Flow lines are cheap and only drawn for visible river cells.
 ctx.save();ctx.fillStyle='rgba(216,249,250,.70)';
 for(let y=Math.max(12,Math.floor((cy-16)/16));y<Math.min(242,py+45);y+=2)for(let x=Math.max(1440,Math.floor((cx-16)/16));x<Math.min(1632,px+70);x+=2){
  if(rmcActual(M,x,y)!=='river'||hash2(x,y,711)<.45)continue;
  const f=(Math.floor(G.t*22)+y*5+x*3)%14;
  ctx.fillRect(x*16+3-cx,y*16+f-cy,7,1);
 }
 ctx.restore();
});
if(typeof LUPA_DAWN!=='undefined')LUPA_DAWN.push(['rmcape663',()=>L2('Reverse Mountain y Cabos Gemelos','Reverse Mountain and Twin Cape'),()=>[L2('Al noreste de Dawn: navega por las corrientes de la montaña, completa la promesa con Laboon y desembarca en el muelle de los faros.','North-east of Dawn: sail through the mountain currents, complete Laboon’s promise and land at the lighthouse pier.'),L2('El siguiente mar será un mapa independiente.','The next sea will be a separate map.')],()=>({m:'dawn',loc:RMC_PIER.slice(),t:L2('Cabos Gemelos','Twin Cape')})]);
