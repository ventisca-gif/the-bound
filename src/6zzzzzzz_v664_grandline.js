// 6.64: a separate sea, sharing Dawn's sailing controls and original Merry.
const GL_ID='grand_line',GL_RETURN=[40,360],GL_ARRIVE=[48,360];
const RMA_EAST_PIER=rmaAt(1,[696,350]),RMA_EAST_MOOR=rmaAt(1,[696,389]);
SAVEKEYS.push('rmVisual');
function makeGrandLine(){
 if(G.maps[GL_ID])return G.maps[GL_ID];
 const w=960,h=720,N=w*h,M={id:GL_ID,w,h,I:(x,y)=>y*w+x,ter:new Uint8Array(N),lvl:new Uint8Array(N),reg:new Uint8Array(N),flags:new Uint8Array(N),chunks:new Map(),isWorld:false,dawn:1,grandLine:true,dark:0,music:'town',camps:[],bossAt:[],halos:[],temples:[],exit:{x:-9,y:-9},dawnData:{pois:[]}};
 initMapObjs(M);populateGrandLinePort(M);M.drawExtra=(cx,cy)=>{const P=G.P;if(P.dawnHelm)dawnShipSprite(cx,cy,dawnSprite('boat'),P.x,P.y+16,P.dir);};
 G.maps[GL_ID]=M;return M;
}
function rmaSailTo(id,at){
 const P=G.P;if(!P||P.dead||G.fading||P.dawnHelm?.kind!=='skiff'||merryDeck())return;
 transition(()=>{
  const M=id===GL_ID?makeGrandLine():makeDawn();
  const [x,y]=dawnPx(at);if(!dawnSurface(M,x,y,18))return;
  P.inside=null;P.dawnBoat=null;delete P.dawnHelm.deck;
  if(setMap(M,x,y,id===GL_ID?'right':'up')===false)return;
  P.rmVisual=2;markDirty(true);banner(id===GL_ID?'Grand Line':L2('Cabos Gemelos','Twin Cape'),id===GL_ID?L2('Primera escala: Puerto de las Campanas','First stop: Bellhaven'):L2('De vuelta en el mar de Dawn','Back in the Dawn Sea'));
 });
}
function rmaShift(key,at){if(rmcDockKey()!==key)return;rmaSailTo('dawn',at);}
XACT.rmc_return=[L2('Regresar a Cabos Gemelos · Dawn','Return to Twin Cape · Dawn'),'ways',()=>{if(rmcDockKey()==='rmc_return')rmaSailTo('dawn',rmaAt(1,[480,640]));}];
XACT.rmc_down=[L2('Descender a Cabos Gemelos','Descend to Twin Cape'),'ways',()=>rmaShift('rmc_down',RMA_CAPE_ENTRY)];
XACT.rmc_up=[L2('Volver a Reverse Mountain','Return to Reverse Mountain'),'ways',()=>rmaShift('rmc_up',RMA_MOUNT_RETURN)];
XACT.rmc_east_land=[L2('Desembarcar en el faro este','Land at the east lighthouse'),'ways',()=>{if(rmcDockKey()==='rmc_east_land')dawnIslandDock(true,'rmcapeEast',RMA_EAST_PIER,RMA_EAST_MOOR,L2('Faro este','East lighthouse'),L2('Cabos Gemelos','Twin Cape'));}];
XACT.rmc_east_sail=[L2('Volver al Going Merry','Return to the Going Merry'),'ways',()=>{if(rmcDockKey()==='rmc_east_sail')dawnIslandDock(false,'rmcapeEast',RMA_EAST_PIER,RMA_EAST_MOOR,'','');}];
hookAround('makeInterior',(next,id)=>id===GL_ID?makeGrandLine():next(id));
hookAround('otherPOI',(next,M)=>M?.grandLine?[{c:'ship',x:GL_RETURN[0],y:GL_RETURN[1],t:L2('Regreso a Cabos Gemelos','Return to Twin Cape')},{c:'ship',x:GL_PORT_MOOR[0],y:GL_PORT_MOOR[1],t:GL_PORT},{c:'inn',x:GL_PORT_PLAZA[0],y:GL_PORT_PLAZA[1],t:L2('Plaza del banquete','Banquet square')},{c:'ship',x:GL_PORT_BELL[0],y:GL_PORT_BELL[1],t:L2('Campana de mareas','Tide bell')}]:next(M));
hookAround('orangeOverviewColor',(next,M,x,y,i)=>M?.grandLine&&M.ter[i]===T.DEEP?C('#347ca4'):next(M,x,y,i));
hookAround('renderChunk',(next,M,cx,cy)=>{
 if(!M?.grandLine)return next(M,cx,cy);
 const left=cx*CH,top=cy*CH;
 if(left<234&&left+CH>123&&top<409&&top+CH>316)return next(M,cx,cy);
 const p=new Pix(CHP,CHP);for(let y=0;y<CHP;y++)for(let x=0;x<CHP;x++){
  const px=cx*CHP+x,py=cy*CHP+y;p.set(x,y,dawnSouthernWaterPixel(px,py,false,(py&127)*128+(px&127)));
 }return p.canvas();
});
// Disable Dawn encounters, island events and scheduled raids only while updating the empty new sea.
// Rendering and sailing still see dawn=true, so no duplicate movement or ship systems are needed.
hookAround('v33Tick',(next,dt)=>{
 const M=G.map;if(!M?.grandLine)return next(dt);
 const d=M.dawn;M.dawn=0;try{return next(dt);}finally{M.dawn=d;}
});
hookBefore('nvOn',()=>{if(G.map?.grandLine)return HOOK_SKIP;});
hookBefore('rmCanStart',()=>{if(G.map?.grandLine)return HOOK_SKIP;});
hookBefore('wiCanStart',()=>{if(G.map?.grandLine)return HOOK_SKIP;});
hookBefore('mrTick',()=>{if(G.map?.grandLine){MR.boat=null;return HOOK_SKIP;}});
hookAround('wpRoute',(next,wp)=>G.map?.grandLine&&wp.m!==GL_ID?GL_RETURN.slice():G.map?.rmCape&&wp.m===GL_ID?RMC_EXIT.slice():next(wp));
function rmaRegionalScale(){const P=G.P;return G.map?.rmCape?.visualV2&&P&&P.x>=1440*16&&P.x<1632*16&&P.y>=RMA_TOP*16&&P.y<(RMA_CAPE_Y+144)*16&&!merryDeck() ? .42 : 1;}
hookAfter('dawnMerrySprite',S=>{
 if(!S||rmaRegionalScale()===1)return;
 return spr('rma:merry:42',()=>{const c=mkCanvas(Math.round(S.c.width*.42),Math.round(S.c.height*.42)),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(S.c,0,0,c.width,c.height);return {c,ax:S.ax*.42,ay:S.ay*.42};});
});
// Explicit regional stay data: the base serializer otherwise intentionally returns a hero to world.
hookAfter('serializeP',(save,P)=>{
 const trip=P.map==='merry_bajo'&&P._mbTrip?.m===GL_ID?P._mbTrip:null;
 if(P.map===GL_ID||P.map==='dawn'&&P.rmVisual===2&&P.x>=RMC_BOX[0]*16&&P.y>=RMC_BOX[1]*16||trip){
  save.rmaStay={m:trip?GL_ID:P.map,x:trip?trip.x:P.x,y:trip?trip.y:P.y,h:trip?trip.h:P.dawnHelm,b:P.dawnBoat};
 }return save;
});
hookAround('selvaRestoreStay',(next,P)=>{
 const S=P.rmaStay;if(!S||!['dawn',GL_ID].includes(S.m))return next(P);
 const M=S.m===GL_ID?makeGrandLine():makeDawn();
 if(S.m===GL_ID&&!S.h&&S.b?.bellhaven&&S.b.h){
  const tx=Math.floor(S.x/16),ty=Math.floor(S.y/16);
  const i=tileAt(M,tx,ty);
  const [x,y]=i>=0&&!SOLID_T[M.ter[i]]&&!M.solidO[i]?[S.x,S.y]:dawnPx(GL_PORT_PIER);
  P.inside=null;P.dawnHelm=null;P.dawnBoat=S.b;return {map:M,x,y};
 }
 P.dawnHelm=S.h||S.b?.h||dawnHelm('skiff',{x:P.retX,y:P.retY});
 let [x,y]=[S.x,S.y];if(!Number.isFinite(x)||!Number.isFinite(y)||!dawnSurface(M,x,y,18)){
  [x,y]=dawnPx(S.m===GL_ID?GL_ARRIVE:RMC_MOOR);
 }
 P.inside=null;P.dawnBoat=null;
 if(!S.h&&S.b&&S.m==='dawn')P._rmaRestoreFoot={x:S.x,y:S.y,b:S.b};
 return {map:M,x,y};
});
hookAfter('setMap',(_,M)=>{
 const P=G.P;if(!P||G.map!==M)return;
 if(M.grandLine){NV.foes=[];NV.shots=[];NV.marks=[];NV.storm=null;ARC.foes=[];ARC.rm=null;ARC.wi=null;MR.boat=null;return;}
 if(!M.rmCape)return;
 const inZone=P.x>=1440*16&&P.x<1632*16&&P.y>=RMA_TOP*16&&P.y<(RMA_CAPE_Y+144)*16;
 if(P._rmaRestoreFoot){const S=P._rmaRestoreFoot;delete P._rmaRestoreFoot;P.dawnBoat=S.b;P.dawnHelm=null;
  const at=rmcActual(M,S.x>>4,S.y>>4);[P.x,P.y]=['cape','dock'].includes(at)&&!M.solidO[M.I(S.x>>4,S.y>>4)]?[S.x,S.y]:dawnPx(RMC_PIER);
 }
 if(inZone&&P.rmVisual!==2){
  if(!P.dawnHelm&&P.dawnBoat){const east=!!P.dawnBoat.rmcapeEast,[x,y]=dawnPx(east?RMA_EAST_MOOR:RMC_MOOR);P.dawnBoat.x=x;P.dawnBoat.y=y;[P.x,P.y]=dawnPx(east?RMA_EAST_PIER:RMC_PIER);}
  else if(P.dawnHelm&&!dawnSurface(M,P.x,P.y,18))[P.x,P.y]=dawnPx(RMA_CAPE_ENTRY);
  P.rmVisual=2;
 }
 if(!G.ents.some(e=>e.id==='rm_crocus'&&e.map==='dawn'&&!e.remove))spawnNPC('rm_crocus',RMC_CROCUS[0]*16+8,RMC_CROCUS[1]*16+12,'dawn',{face:'down'});
 updateCamera(0,true);
});
WORLD_DRAW.push((cx,cy)=>{
 if(!G.map?.grandLine)return;const [x,y]=dawnPx(GL_RETURN);
 if(x<cx-100||x>cx+VW+100||y<cy-100||y>cy+VH+100)return;
 ctx.save();ctx.strokeStyle='#e9d2a1';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x-cx,y-cy,20+Math.sin(G.t*2)*2,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#f5e4b8';ctx.font='12px "Pixelify Sans"';ctx.textAlign='center';ctx.fillText(L2('Regreso a Dawn','Return to Dawn'),x-cx,y-cy-30);ctx.restore();
});
MAPC.grand_line=['Grand Line','Grand Line','#4697b6','ship'];
MAPW_LIST.push({id:GL_ID,n:'Grand Line',mk:makeGrandLine,how:L2('Navega desde el extremo sur de Cabos Gemelos. Sigue hacia el este para llegar al Puerto de las Campanas (nivel 620).','Sail from the southern end of Twin Cape. Head east to Bellhaven (level 620).')});
LUPA_DAWN.push(['grandline664',()=>L2('Grand Line · mar abierto','Grand Line · open sea'),()=>[L2('Desde Reverse Mountain, desciende a Cabos Gemelos. Tras la promesa de Laboon puedes navegar al Grand Line por el sur.','From Reverse Mountain, descend to Twin Cape. After Laboon’s promise you can sail into the Grand Line from the south.'),L2('La primera escala es el Puerto de las Campanas (nivel 620). Puedes volver a Cabos Gemelos por la señal de regreso.','The first stop is Bellhaven (level 620). The return marker leads back to Twin Cape.')],()=>({m:'dawn',loc:RMC_EXIT.slice(),t:'Grand Line'})]);
