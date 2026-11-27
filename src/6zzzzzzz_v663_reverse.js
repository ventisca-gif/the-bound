// 6.64: original proposal artwork integrated with Dawn's ship, player and save systems.
const RMC_Y=1040,RMA_TOP=RMC_Y+12,RMA_CAPE_Y=RMA_TOP+154,RMA_SCALE=3.2;
const rmcAt=([x,y])=>[x,y+RMC_Y];
function rmaAt(scene,p){return [1440+p[0]/5,(scene?RMA_CAPE_Y:RMA_TOP)+p[1]/5];}
const RMC_BOX=[1440,RMA_TOP,192,298],RMC_SUMMIT=rmaAt(0,[480,340]),RMC_PIER=rmaAt(1,[265,365]),RMC_MOOR=rmaAt(1,[265,404]),RMC_CROCUS=rmaAt(1,[215,318]),RMC_EXIT=rmaAt(1,[480,690]);
const RMA_MOUNT_EXIT=rmaAt(0,[920,680]),RMA_MOUNT_RETURN=rmaAt(0,[870,650]),RMA_CAPE_ENTRY=rmaAt(1,[480,58]),RMA_CAPE_UP=rmaAt(1,[480,24]),RMA_LABOON=rmaAt(1,[700,612]);
const RMC_ROUTES=RMA_ART.branches.map(r=>r.p.map(p=>rmaAt(0,[Math.max(10,Math.min(950,p[0])),Math.max(10,Math.min(758,p[1]))])));
function rmcTile(x,y){
 if(x<1440||x>=1632||y<RMA_TOP||y>=RMA_CAPE_Y+144)return '';
 const scene=y>=RMA_CAPE_Y?1:0,t=RMA_ART.type((x-1440+.5)*5,(y-(scene?RMA_CAPE_Y:RMA_TOP)+.5)*5,scene);
 return t===0?'river':t===1?'rock':t===2?'cape':'dock';
}
const RMC_TERRAIN={rock:T.FACE,river:T.DEEP,cape:T.SAND,dock:T.BRIDGE};
const RMC_POI=[[rmaAt(0,[48,696]),L2('Reverse Mountain · East Blue','Reverse Mountain · East Blue')],[RMC_SUMMIT,L2('Cima de las corrientes','Summit of the currents')],[RMA_MOUNT_EXIT,L2('Descenso a Cabos Gemelos','Descent to Twin Cape')],[RMC_PIER,L2('Cabos Gemelos · muelle oeste','Twin Cape · west pier')],[rmaAt(1,[696,350]),L2('Faro este · muelle','East lighthouse · pier')],[RMC_CROCUS,'Crocus'],[RMA_LABOON,'Laboon'],[RMC_EXIT,L2('Entrada al Grand Line','Grand Line entrance')]];
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
 const cells=new Uint8Array(w*h),kinds=['','rock','river','cape','dock'];
 for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){
  const t=rmcTile(x,y);if(!t)continue;const i=M.I(x,y);
  if(M.ter[i]!==T.DEEP||(M.objAt&&M.objAt[i]>=0))continue;
  cells[(y-y0)*w+x-x0]=kinds.indexOf(t);M.ter[i]=RMC_TERRAIN[t];M.lvl[i]=0;
 }
 M.rmCape={cells,kinds};M.chunks.clear();
 // Scenery is painted from the original proposal; matching foot-level collision remains native.
 for(const [sx,sy,rx,ry] of [[165,294,42,12],[265,316,20,12],[696,312,20,12]]){
  const [tx,ty]=rmaAt(1,[sx,sy]);for(let y=Math.floor(ty-ry/5);y<=Math.floor(ty);y++)for(let x=Math.floor(tx-rx/5);x<=Math.floor(tx+rx/5);x++)if(rmcActual(M,x,y)==='cape')M.solidO[M.I(x,y)]=1;
 }
 M.npcDefs.push({id:'rm_crocus',x:RMC_CROCUS[0],y:RMC_CROCUS[1],face:'down'});
 M.rmCape.visualV2=true;
});
function rmcActual(M,x,y){const S=M&&M.rmCape,[a,b,w,h]=RMC_BOX;if(!S||x<a||x>=a+w||y<b||y>=b+h)return '';return S.kinds[S.cells[(y-b)*w+x-a]]||'';}
// The exact original proposal is cached at its own pixel resolution and projected into world chunks.
function rmcPaint(c,M,cx,cy){
 if(!M?.rmCape)return;
 const [a,b,w,h]=RMC_BOX,ox=cx*CH,oy=cy*CH;
 if(ox+CH<=a||oy+CH<=b||ox>=a+w||oy>=b+h)return;
 const g=c.getContext('2d');g.save();g.imageSmoothingEnabled=false;
 for(let scene=0;scene<2;scene++){
  const top=scene?RMA_CAPE_Y:RMA_TOP,src=RMA_ART.scene(scene);
  g.drawImage(src,(a-ox)*16,(top-oy)*16,src.width*RMA_SCALE,src.height*RMA_SCALE);
 }
 g.restore();return c;
}
hookAfter('renderChunk',rmcPaint);hookAfter('finishChunk',rmcPaint);
hookAfter('orangeOverviewColor',(old,M,x,y)=>{const t=rmcActual(M,x,y);if(t)return C(t==='river'?'#347ca4':t==='rock'?'#bd8273':t==='dock'?'#c19768':'#cbb08c');});
hookAfter('otherPOI',(out,M)=>{if(M.rmCape)for(const [at,t] of RMC_POI)out.push({x:at[0],y:at[1],c:'inn',t});});
function rmcDockKey(){
 const P=G.P,M=G.map;if(!P||!M||P.dead||G.fading||nvCalm()||ARC.rm)return null;
 if(M.grandLine)return P.dawnHelm?.kind==='skiff'&&conomiNear(P,GL_RETURN,120)?'rmc_return':null;
 if(!M.rmCape)return null;
 if(P.dawnHelm?.kind==='skiff'&&conomiNear(P,RMA_MOUNT_EXIT,90))return 'rmc_down';
 if(P.dawnHelm?.kind==='skiff'&&conomiNear(P,RMA_CAPE_UP,65))return 'rmc_up';
 if(P.dawnHelm?.kind==='skiff'&&conomiNear(P,RMA_EAST_MOOR,60))return P.rmDone?'rmc_east_land':'rmc_locked';
 if(!P.dawnHelm&&P.dawnBoat?.rmcapeEast&&conomiNear(P,RMA_EAST_PIER,44))return 'rmc_east_sail';
 if(P.dawnHelm?.kind==='skiff'&&conomiNear(P,RMC_MOOR,60))return P.rmDone?'rmc_land':'rmc_locked';
 if(!P.dawnHelm&&P.dawnBoat?.rmcape&&conomiNear(P,RMC_PIER,44))return 'rmc_sail';
 if(P.dawnHelm?.kind==='skiff'&&P.rmDone&&conomiNear(P,RMC_EXIT,70))return 'rmc_exit';
 return null;
}
XACT.rmc_land=[L2('Desembarcar en Cabos Gemelos','Land at Twin Cape'),'ways',()=>{if(rmcDockKey()==='rmc_land')dawnIslandDock(true,'rmcape',RMC_PIER,RMC_MOOR,L2('Cabos Gemelos','Twin Cape'),L2('Habla con Crocus y visita los faros.','Talk to Crocus and visit the lighthouses.'));}];
XACT.rmc_locked=[L2('Completa el encuentro con Laboon','Complete the Laboon encounter'),'ways',()=>toast(L2('Completa primero la promesa con Laboon.','First complete the promise with Laboon.'),'info')];
XACT.rmc_sail=[L2('Volver al Going Merry','Return to the Going Merry'),'ways',()=>{if(rmcDockKey()==='rmc_sail')dawnIslandDock(false,'rmcape',RMC_PIER,RMC_MOOR,'','');}];
XACT.rmc_exit=[L2('Navegar al Grand Line','Sail to the Grand Line'),'ways',()=>{if(rmcDockKey()==='rmc_exit')rmaSailTo('grand_line',GL_ARRIVE);}];
hookAround('interactTarget',next=>{const k=rmcDockKey();return k?rareAction(k):next();});
DL_HOOKS.push(list=>{
 const M=G.map,P=G.P;if(!M?.rmCape||!P?.rmDone)return;
 const [x,y]=dawnPx(RMA_LABOON);if(Math.abs(x-P.x)>1200||Math.abs(y-P.y)>1000)return;
 list.push({type:'xdraw',x,y,draw:(e,cx,cy)=>{const s=spr('rma:laboon',()=>({c:RMA_ART.whale(),ax:132,ay:150}));ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(x-cx),Math.round(y-cy+Math.sin(G.t*1.6)*3));ctx.scale(RMA_SCALE,RMA_SCALE);ctx.drawImage(s.c,-s.ax,-s.ay);ctx.restore();}});
});
WORLD_DRAW.push((cx,cy)=>{
 const M=G.map,P=G.P;if(!M?.rmCape||!P)return;
 const tx=P.x/16,ty=P.y/16;if(tx<1430||tx>1640||ty<RMA_TOP||ty>RMA_CAPE_Y+144)return;
 ctx.save();ctx.strokeStyle='rgba(201,230,225,.7)';ctx.lineWidth=2;
 if(ty<RMA_CAPE_Y){for(const route of RMC_ROUTES)for(let j=1;j<route.length;j++){
  const a=dawnPx(route[j-1]),b=dawnPx(route[j]),dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);
  for(let k=0;k<len;k+=78){const f=(k+G.t*92)%len,x=a[0]+dx*f/len,y=a[1]+dy*f/len;
   if(x<cx-20||x>cx+VW+20||y<cy-20||y>cy+VH+20)continue;
   ctx.beginPath();ctx.moveTo(x-cx,y-cy);ctx.lineTo(x-cx+dx/len*22,y-cy+dy/len*22);ctx.stroke();
  }
 }}ctx.restore();
});
if(typeof LUPA_DAWN!=='undefined')LUPA_DAWN.push(['rmcape663',()=>L2('Reverse Mountain y Cabos Gemelos','Reverse Mountain and Twin Cape'),()=>[L2('Al sureste de Dawn: navega por las corrientes de la montaña, completa la promesa con Laboon y desembarca en el muelle de los faros.','South-east of Dawn: sail through the mountain currents, complete Laboon’s promise and land at the lighthouse pier.'),L2('En el extremo sur de los cabos puedes entrar al Grand Line: por ahora solo hay mar y una ruta de regreso.','At the southern end of the capes you can enter the Grand Line: for now it contains only sea and a return route.')],()=>({m:'dawn',loc:RMC_PIER.slice(),t:L2('Cabos Gemelos','Twin Cape')})]);

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
    const tx=Math.floor(1440/CH)+cx,ty=Math.floor(RMA_TOP/CH)+cy;
    const C=renderChunk(M,tx,ty);x.drawImage(C,(tx*CH-1440),ty*CH-RMA_TOP,CH,CH);
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
