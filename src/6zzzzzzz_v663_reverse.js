// Reverse Mountain / Twin Cape: native Dawn terrain, no replacement of hero or crew atlases.
// All coordinates are in the existing 16px Dawn grid; Grand Line remains a separate future map.
const RMC_Y=1040, rmcAt=([x,y])=>[x,y+RMC_Y];
const RMC_BOX=[1440,12+RMC_Y,192,330], RMC_SUMMIT=rmcAt([1536,104]), RMC_PIER=rmcAt([1553,260]), RMC_MOOR=rmcAt([1558,260]), RMC_CROCUS=rmcAt([1528,251]), RMC_EXIT=rmcAt([1578,315]);
const RMC_ROUTES=[
 [[1440,172],[1480,151],[1506,128],[1536,104]],
 [[1448,25],[1480,56],[1510,84],[1536,104]],
 [[1618,25],[1590,56],[1560,80],[1536,104]],
 [[1626,150],[1594,138],[1566,116],[1536,104]],
 [[1536,104],[1542,143],[1548,175],[1565,210],[1578,236]]
].map(route=>route.map(rmcAt));
function rmcSegment(x,y,a,b){
 const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));
 return Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t);
}
function rmcTile(x,y){
 y-=RMC_Y;
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
 for(const route of RMC_ROUTES)for(let i=1;i<route.length;i++)rd=Math.min(rd,rmcSegment(x,y+RMC_Y,route[i-1],route[i]));
 if(rd<6.5&&d>-.23)return 'river';
 if(d>0)return d<.11||rd<8?'edge':'rock';
 return '';
}
const RMC_TERRAIN={rock:T.FACE,edge:T.FACE,river:T.DEEP,cape:T.STONE,shore:T.SAND,path:T.COBBLE,dock:T.BRIDGE};
const RMC_POI=[[rmcAt([1454,166]),L2('Reverse Mountain · entrada','Reverse Mountain · entrance')],[RMC_SUMMIT,L2('Cima de las corrientes','Summit of the currents')],[RMC_PIER,L2('Cabos Gemelos · muelle','Twin Cape · dock')],[RMC_CROCUS,'Crocus'],[rmcAt([1578,283]),'Laboon'],[RMC_EXIT,L2('Grand Line · próxima ruta','Grand Line · future route')]];
NPCS.rm_crocus={n:'Crocus',title:L2('Farero de Cabos Gemelos','Twin Cape lighthouse keeper'),look:LK({g:'m',hair:HAIRS.blanco,hairStyle:'short',eyes:'negro',skin:SKINS[1],outfit:'tunic',main:pal(['#493c43','#926c4e','#d4aa63','#e9d5a4','#f9edcd'])}),quests:[],lines:[L2('Laboon espera a sus amigos. Cuida el Log Pose: será tu guía cuando zarpes al Grand Line.','Laboon is waiting for his friends. Keep your Log Pose safe: it will guide you when you sail into the Grand Line.') ]};
hookAfter('makeDawn',M=>{
 if(!M||M.rmCape)return;
 const [x0,y0,w,h]=RMC_BOX;
 if(M.h<y0+h){
  const height=Math.ceil((y0+h)/CH)*CH;
  for(const key of ['ter','lvl','reg','flags','solidO','objAt']){const old=M[key],a=new old.constructor(M.w*height);if(key==='objAt')a.fill(-1);a.set(old);M[key]=a;}
  M.h=height;M.chh=Math.ceil(height/CH);while(M.objGrid.length<M.cw*M.chh)M.objGrid.push([]);
 }
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
  y+=RMC_Y;
  if(!['cape','path','shore'].includes(rmcActual(M,x,y)))return;
  addObj(M,'dawn',x,y,{dawnKey:key,dawnScale:scale,fp,solid:fp.length>0});
 };
 prop('lighthouse',1501,233,1.5,[[0,0],[-1,0],[1,0]]);
 prop('lighthouse',1616,233,1.5,[[0,0],[-1,0],[1,0]]);
 prop('house3',1516,242,1,[[0,0],[-1,0],[1,0],[0,-1]]);
 for(const [x,y] of [[1535,257],[1535,263],[1543,257],[1543,263]])if(rmcActual(M,x,y+RMC_Y))addObj(M,'lantern',x,y+RMC_Y,{kind:'wood',solid:false,fp:[]});
 if(rmcActual(M,...RMC_CROCUS))M.npcDefs.push({id:'rm_crocus',x:RMC_CROCUS[0],y:RMC_CROCUS[1],face:'down'});
});
function rmcActual(M,x,y){const S=M&&M.rmCape,[a,b,w,h]=RMC_BOX;if(!S||x<a||x>=a+w||y<b||y>=b+h)return '';return S.kinds[S.cells[(y-b)*w+x-a]]||'';}
// Dawn uses its own rasterizer, so new terrain must also be painted from its native textures.
let RMC_PAL=null;
function rmcPaint(c,M,cx,cy){
 if(!M?.rmCape)return;
 const [a,b,w,h]=RMC_BOX,ox=cx*CH,oy=cy*CH;
 if(ox+CH<=a||oy+CH<=b||ox>=a+w||oy>=b+h)return;
 if(!RMC_PAL)RMC_PAL={rock:pal(['#4c5046','#626c57','#858b6a','#a7ab80','#c7c69a']),sand:pal(['#b29259','#c6ab71','#dfc58d','#ead6a7','#f6e6be']),stone:pal(['#6d797c','#85918e','#9ea8a0','#bdc4b5','#d1d2be'])};
 const g=c.getContext('2d'),im=g.getImageData(0,0,c.width,c.height),buf=new Uint32Array(im.data.buffer);
 for(let y=0;y<CH;y++)for(let x=0;x<CH;x++){
  const t=rmcActual(M,ox+x,oy+y);if(!t)continue;
  const tex=t==='dock'?'plank':t==='rock'||t==='edge'?'rock':t==='shore'?'sand':'stone';
  const P=tex==='plank'?WOOD:RMC_PAL[tex];
  for(let dy=0;dy<16;dy++)for(let dx=0;dx<16;dx++){
   const px=x*16+dx,py=y*16+dy,ti=(((oy*16+py)&127)*128)+((ox*16+px)&127);
   buf[py*c.width+px]=t==='river'?C('#347ca4'):P[TEX[tex][ti]];
  }
 }
 g.putImageData(im,0,0);return c;
}
hookAfter('renderChunk',rmcPaint);
hookAfter('finishChunk',rmcPaint);
hookAfter('orangeOverviewColor',(old,M,x,y)=>{const t=rmcActual(M,x,y);if(t)return C(t==='river'?'#347ca4':t==='rock'||t==='edge'?'#858b6a':t==='shore'?'#dfc58d':t==='dock'?'#986845':'#9ea8a0');});
hookAfter('otherPOI',(out,M)=>{if(M.rmCape)for(const [at,t] of RMC_POI)out.push({x:at[0],y:at[1],c:'inn',t});});
function rmcDockKey(){
 const P=G.P,M=G.map;if(!P||!M?.rmCape||P.dead||G.fading||nvCalm()||ARC.rm)return null;
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
 const [x,y]=dawnPx(rmcAt([1578,283]));if(Math.abs(x-P.x)>1200||Math.abs(y-P.y)>1000)return;
 list.push({type:'xdraw',x,y,draw:(e,cx,cy)=>{const s=spr('rm:laboon:peace',XSPR.rm_laboonp);ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(x-cx),Math.round(y-cy+Math.sin(G.t*1.6)*3));ctx.scale(3,3);ctx.drawImage(s.c,-s.ax,-s.ay);ctx.restore();}});
});
WORLD_DRAW.push((cx,cy)=>{
 const M=G.map,P=G.P;if(!M?.rmCape||!P)return;
 const px=P.x/16,py=P.y/16;if(px<1430||px>1640||py>245+RMC_Y||py<RMC_Y)return;
 // Flow lines are cheap and only drawn for visible river cells.
 ctx.save();ctx.fillStyle='rgba(216,249,250,.70)';
 for(let y=Math.max(12+RMC_Y,Math.floor((cy-16)/16));y<Math.min(242+RMC_Y,py+45);y+=2)for(let x=Math.max(1440,Math.floor((cx-16)/16));x<Math.min(1632,px+70);x+=2){
  if(rmcActual(M,x,y)!=='river'||hash2(x,y,711)<.45)continue;
  const f=(Math.floor(G.t*22)+y*5+x*3)%14;
  ctx.fillRect(x*16+3-cx,y*16+f-cy,7,1);
 }
 ctx.restore();
});
if(typeof LUPA_DAWN!=='undefined')LUPA_DAWN.push(['rmcape663',()=>L2('Reverse Mountain y Cabos Gemelos','Reverse Mountain and Twin Cape'),()=>[L2('Al sureste de Dawn: navega por las corrientes de la montaña, completa la promesa con Laboon y desembarca en el muelle de los faros.','South-east of Dawn: sail through the mountain currents, complete Laboon’s promise and land at the lighthouse pier.'),L2('El siguiente mar será un mapa independiente.','The next sea will be a separate map.')],()=>({m:'dawn',loc:RMC_PIER.slice(),t:L2('Cabos Gemelos','Twin Cape')})]);

// Use the same Merry bitmap and character atlases as gameplay in these scenes.
function rmcCineNPC(g,id,x,y,t,scale=.42){
 const A=npcAtlas(id),f=(A.idx.idle||0)+Math.floor(t*2)%2;
 g.drawImage(A.img,f*A.fw,0,A.fw,A.fh,Math.round(x-A.ax*scale),Math.round(y-A.ay*scale),Math.round(A.fw*scale),Math.round(A.fh*scale));
}
function rmcCineShip(g,x,y,t){
 const S=dawnMerrySprite()||dawnSprite('boat'),scale=Math.min(112/S.c.width,76/S.c.height);
 g.drawImage(S.c,Math.round(x-S.ax*scale),Math.round(y-S.ay*scale),Math.round(S.c.width*scale),Math.round(S.c.height*scale));
 const P=G.P,mask=P?dawnCrewAvailable(P):0;
 DAWN_CREW.forEach(([id],i)=>{if(mask&(1<<i))rmcCineNPC(g,id,x-32+i*16,y-8,t,.23);});
}
Object.assign(CN_SC,{
 rm_subida:(g,t,k)=>{
  cnSky(g,'#2a3a6a','#e88a5a');
  const M=G.maps.dawn;if(!M?.rmCape)return;
  // A cached miniature of the real terrain, using the original chunk renderer.
  const S=spr('rmc:terrain',()=>{const c=mkCanvas(192,208),x=c.getContext('2d');x.imageSmoothingEnabled=false;
   for(let cy=0;cy<Math.ceil(208/CH);cy++)for(let cx=0;cx<Math.ceil(192/CH);cx++){
    const tx=Math.floor(1440/CH)+cx,ty=Math.floor(RMC_Y/CH)+cy;
    const C=renderChunk(M,tx,ty);x.drawImage(C,(tx*CH-1440),ty*CH-RMC_Y,CH,CH);
   }return {c,ax:0,ay:0};});
  g.drawImage(S.c,32,0,192,144);rmcCineShip(g,120,123-k*70,t);
 },
 rm_laboon:(g,t)=>{cnSky(g,'#5a8ac0','#bfe6ff');cnR(g,'#2a6ab0',0,92,CN_W,52);
  cnSpr(g,'rm_laboon',8,46+Math.sin(t*1.5)*2,170,81);rmcCineShip(g,200,128,t);},
 rm_promesa:(g,t)=>{cnSky(g,'#5a8ac0','#ffd8a0');cnR(g,'#2a6ab0',0,92,CN_W,52);
  cnSpr(g,'rm_laboonp',5,46,180,85);rmcCineNPC(g,DAWN_CREW[0][0],66,65,t,.48);
  rmcCineNPC(g,'rm_crocus',218,124,t,.48);
  // The player's actual appearance, including equipped clothes.
  g.save();g.translate(187,122);g.scale(.42,.42);cnHero(g,0,0,t);g.restore();}
});
