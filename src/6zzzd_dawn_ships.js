// Access to the sea is independent of the closed island landings.
const DAWN_BUOY=[646,302];
const DAWN_PATROL=[[668,296],[790,269]];
const DAWN_HELM_SPEED=460;
const ALVIDA_SHIP_NAME=L2('Galeón de Alvida','Alvida’s galleon');
const DAWN_SEA_NAME=L2('Mar de Dawn','Dawn Sea');
const AD_DECK='alvida_deck';
const AD_START=[5,11], AD_CLAIM=[26,11], AD_HATCH=[4,11];
const AD_CREW=[['dawn_deckhand',9,9],['dawn_boarder',11,12],['dawn_deckhand',12,8],['dawn_boarder',14,11]];
SAVEKEYS.push('alvidaMace');
const dawnPx=([x,y])=>[x*16+8,y*16+8];
function dawnSurface(M,x,y,r=8){
  for(const [dx,dy] of [[0,0],[-r,-r],[r,-r],[-r,r],[r,r]]){
    const i=tileAt(M,(x+dx)>>4,(y+dy)>>4);
    if(i<0||M.ter[i]!==T.DEEP)return false;
  }
  return true;
}
function dawnPatrol(){
  const a=dawnPx(DAWN_PATROL[0]),b=dawnPx(DAWN_PATROL[1]),dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);
  const phase=(G.t*415/len)%2, u=phase<=1?phase:2-phase;
  return {x:a[0]+dx*u,y:a[1]+dy*u,dir:phase<=1?'right':'left'};
}
function dawnGalleon(){
  const P=G.P;
  return P.dawnHelm?.kind==='galleon'?{x:P.x,y:P.y,dir:P.dir}:P._alvidaBerth||dawnPatrol();
}
function dawnShipRadius(P,H){
  return H.kind==='galleon'?22:H.kind==='skiff'&&P.dawnCrewJoined?18:8;
}
function dawnHelm(kind,returnAt){
  return {kind,returnAt};
}
function dawnLaunch(){
  const P=G.P;
  if(G.map.id!=='world'||G.fading||P.dead)return;
  if(P.lv<500){typeText(L2('La ruta del galeón de Alvida requiere nivel 500.','Alvida’s galleon route requires level 500.'));return;}
  const [x,y]=dawnPx(DAWN_BUOY), M=makeDawn(), returnAt={x:P.x,y:P.y};
  closeDialog();
  transition(()=>{
    P.retX=returnAt.x;P.retY=returnAt.y;P.inside=null;P.dawnHelm=dawnHelm('skiff',returnAt);
    setMap(M,x,y,'right');
    banner(DAWN_SEA_NAME,L2('Usa el joystick o las flechas para navegar.','Use the stick or arrow keys to sail.'));
  });
}
DLG_HOOKS.push((npc,options)=>{
  if(npc.id==='marina')options.push({label:L2('Navegar por el Mar de Dawn · nivel 500','Sail the Dawn Sea · level 500'),icon:['ways'],fn:dawnLaunch});
});
function dawnDeck(){
  if(G.maps[AD_DECK])return G.maps[AD_DECK];
  const w=32,h=22,N=w*h,I=(x,y)=>y*w+x;
  const M={id:AD_DECK,w,h,I,ter:new Uint8Array(N).fill(T.DEEP),lvl:new Uint8Array(N),reg:new Uint8Array(N),flags:new Uint8Array(N),
    dark:0,isWorld:false,chunks:new Map(),camps:[],exit:{x:-9,y:-9},hudName:ALVIDA_SHIP_NAME,overviewMinimap:true};
  for(let y=4;y<=17;y++)for(let x=2;x<=29;x++){
    const bow=Math.max(0,Math.abs(y-11)-3);
    if(x>=2+bow&&x<=29-bow)M.ter[I(x,y)]=T.PLANK;
  }
  M.ter[I(16,10)]=T.IWALL;M.ter[I(24,10)]=T.IWALL;
  prepPalettes(M);initMapObjs(M);
  const prop=(f,x,y)=>addObj(M,'furn',x,y,{f});
  for(const [x,y] of [[7,6],[8,6],[7,15],[13,6],[21,15],[23,6],[25,7]])prop(x%2?'barrels':'chest',x,y);
  for(const [x,y] of [[16,10],[24,10]])prop('alvida_deck_mast',x,y);
  const action=(x,y,xact)=>addObj(M,'furn',x,y,{f:'ae_vacio',xact,solid:false,fp:[]});
  action(...AD_HATCH,'alvida_leave');
  prop('chest',AD_CLAIM[0],AD_CLAIM[1]-1);
  prop('alvida_wheel',28,10);
  action(...AD_CLAIM,'alvida_claim');
  action(28,11,'alvida_helm');
  M.drawExtra=(cx,cy)=>{
    ctx.fillStyle='#315f82';
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const X=x*16-cx,Y=y*16-cy;
      if(X<-16||X>VW||Y<-16||Y>VH)continue;
      if(M.ter[I(x,y)]===T.DEEP){
        ctx.fillStyle='#315f82';ctx.fillRect(X,Y,16,16);
        if((y*17+x*13)%19<2){ctx.fillStyle='#508eab';ctx.fillRect(X+2,Y+4,10,1);}
      }else if(M.ter[I(x,y-1)]===T.DEEP||M.ter[I(x,y+1)]===T.DEEP||M.ter[I(x-1,y)]===T.DEEP||M.ter[I(x+1,y)]===T.DEEP){
        ctx.fillStyle='#4a2b2a';ctx.fillRect(X,Y+5,16,5);ctx.fillStyle='#cba064';ctx.fillRect(X,Y+4,16,2);
      }
    }
  };
  return G.maps[AD_DECK]=M;
}
XSPR.alvida_deck_mast=()=>{
  const p=new Pix(108,124);
  p.rect(52,12,6,111,WOOD[1]);p.vl(53,14,105,WOOD[4]);
  p.line(11,22,97,22,WOOD[2]);
  p.poly([[14,24],[94,24],[89,65],[67,72],[24,67]],ALVIDA_HAT[3]);
  p.line(18,24,25,66,ALVIDA_HAT[1]);p.line(88,26,81,64,ALVIDA_HAT[2]);
  p.poly([[51,30],[59,30],[57,40],[60,50],[53,54],[49,49],[54,41]],ALVIDA_RED[2]);
  p.outline(OUTL,false);return {c:p.canvas(),ax:55,ay:122};
};
XSPR.alvida_wheel=()=>{
  const p=new Pix(32,35),x=16,y=14;
  p.rect(13,16,6,17,WOOD[1]);p.hl(9,32,14,WOOD[3]);
  for(let d=0;d<8;d++){
    const a=d*Math.PI/4,dx=Math.cos(a),dy=Math.sin(a);
    p.line(x,y,x+dx*13,y+dy*13,WOOD[3]);
  }
  for(let d=0;d<32;d++){
    const a=d*Math.PI/16;
    p.ell(x+Math.cos(a)*9,y+Math.sin(a)*9,2,2,WOOD[2]);
  }
  p.ell(x,y,3,3,GOLD[3]);p.outline(OUTL,false);
  return {c:p.canvas(),ax:x,ay:32};
};
XSPR.alvida_galleon=()=>{
  const p=new Pix(332,224);
  const wood=pal(['#34232c','#643d39','#8a5547','#ac744e','#cd9c66']);
  p.poly([[8,164],[36,169],[68,149],[292,147],[323,121],[322,169],[298,195],[257,216],[65,212],[26,191]],wood[2]);
  for(let y=159;y<215;y+=5)for(let x=7;x<325;x++)if(p.d[y*p.w+x]){p.set(x,y,wood[1]);if(p.d[(y+1)*p.w+x])p.set(x,y+1,wood[3]);}
  p.line(11,162,73,174,GOLD[3]);p.line(73,174,302,167,GOLD[3]);p.line(302,167,321,144,GOLD[3]);
  p.rect(242,125,56,34,wood[1]);p.rect(245,129,51,28,wood[3]);p.rect(235,122,64,7,ALVIDA_RED[2]);
  for(let x=76;x<271;x+=24){p.ell(x,187,5,4,wood[0]);p.hl(x-3,184,6,GOLD[2]);}
  for(const [x,y] of [[111,19],[202,7],[265,47]]){
    p.rect(x,y,5,167-y,wood[1]);p.vl(x+1,y,167-y,wood[4]);
    p.line(x-39,y+22,x+37,y+22,wood[1]);
    p.poly([[x-36,y+23],[x+34,y+23],[x+31,y+61],[x+19,y+74],[x-29,y+66]],ALVIDA_HAT[3]);
    p.line(x-35,y+23,x-29,y+64,ALVIDA_HAT[1]);p.line(x+26,y+26,x+21,y+63,ALVIDA_HAT[2]);
    p.poly([[x,y+32],[x+7,y+36],[x+5,y+43],[x-4,y+47],[x-9,y+40]],ALVIDA_RED[2]);
    p.line(x,y+5,26,161,wood[0]);p.poly([[x+4,y],[x+42,y+4],[x+28,y+18],[x+4,y+12]],ALVIDA_RED[1]);
  }
  p.poly([[13,149],[31,151],[25,166],[16,167],[8,159]],GOLD[3]);
  p.outline(OUTL,false);return {c:p.canvas(),ax:163,ay:196};
};
function dawnShipSprite(cx,cy,s,x,y,dir){
  if(x<cx-220||x>cx+VW+220||y<cy-32||y>cy+VH+220)return;
  ctx.save();ctx.translate(Math.round(x-cx),Math.round(y-cy));if(dir==='left')ctx.scale(-1,1);
  ctx.drawImage(s.c,-s.ax,-s.ay);ctx.restore();
}
{const old=makeDawn;makeDawn=function(){
  const M=old.apply(this,arguments);
  if(M.maritime)return M;
  M.maritime=true;
  M.drawExtra=(cx,cy)=>{
    const P=G.P,S=dawnGalleon(),large=spr('dawn:alvida:galleon',XSPR.alvida_galleon);
    dawnShipSprite(cx,cy,large,S.x,S.y+24,S.dir);
    if(P.dawnHelm?.kind==='skiff')dawnShipSprite(cx,cy,dawnSprite('boat'),P.x,P.y+16,P.dir);
    const [x,y]=dawnPx(DAWN_BUOY);
    if(x>=cx-16&&x<=cx+VW+16&&y>=cy-16&&y<=cy+VH+16){
      ctx.fillStyle='#e08353';ctx.fillRect(x-cx-4,y-cy-4,8,7);
      ctx.fillStyle='#ffe1a5';ctx.fillRect(x-cx-3,y-cy-5,6,2);
    }
  };
  return M;
};}
{const old=setMap;setMap=function(M,x,y){
  const P=G.P;
  if(M?.dawn&&P?.dawnHelm&&!dawnSurface(M,x,y,dawnShipRadius(P,P.dawnHelm)))return false;
  if(P&&!M?.dawn)P.dawnHelm=null;
  return old.apply(this,arguments);
};}
{const old=updatePlayer;updatePlayer=function(dt){
  const P=G.P,M=G.map,H=P.dawnHelm;
  if(!M.dawn||!H||P.dead)return old.apply(this,arguments);
  const [dx,dy]=moveInput(),speed=DAWN_HELM_SPEED*(H.kind==='galleon'?.82:P.dawnCrewJoined?.88:1);
  if(dx||dy){
    const r=dawnShipRadius(P,H), distance=speed*dt, steps=Math.max(1,Math.ceil(distance/8));
    const sx=dx*distance/steps,sy=dy*distance/steps;
    for(let i=0;i<steps;i++){
      if(dawnSurface(M,P.x+sx,P.y,r))P.x+=sx;
      if(dawnSurface(M,P.x,P.y+sy,r))P.y+=sy;
    }
    P.dir=dirFromVec(dx,dy);
    if(H.kind==='galleon')P._alvidaBerth={x:P.x,y:P.y,dir:P.dir};
  }
  setAnim(P,'idle',true);
};}
{const old=basicAttack;basicAttack=function(){if(!G.P?.dawnHelm)return old.apply(this,arguments);};}
{const old=useSkill;useSkill=function(){if(!G.P?.dawnHelm)return old.apply(this,arguments);};}

function dawnBoard(){
  const P=G.P,H=P.dawnHelm;
  if(!H||G.fading||P.dead)return;
  const ship=dawnGalleon();
  if(H.kind!=='galleon'&&dist2(P.x,P.y,ship.x,ship.y)>=112**2)return;
  transition(()=>{
    P._alvidaTrip={returnAt:H.returnAt,ship,skiff:{x:P.x,y:P.y},kind:H.kind};
    P.inside=AD_DECK;const M=dawnDeck();
    setMap(M,...dawnPx(AD_START),'right');
    alvidaStart(M);
    banner(ALVIDA_SHIP_NAME,P.alvidaMace?L2('Cubierta despejada','Deck cleared'):L2('Derrota primero a la tripulación.','Defeat the crew first.'));
  });
}
function dawnLeaveDeck(takeHelm){
  const P=G.P,S=P._alvidaTrip;
  if(!S||G.fading||P.dead)return;
  if(takeHelm&&!P.alvidaMace){toast(L2('Derrota a Alvida antes de tomar el timón.','Defeat Alvida before taking the helm.'),'warn');return;}
  transition(()=>{
    P.inside=null;P._alvidaTrip=null;
    const kind=takeHelm?'galleon':'skiff';
    const at=takeHelm?S.ship:S.skiff;
    P.dawnHelm=dawnHelm(kind,S.returnAt);
    if(takeHelm)P._alvidaBerth={x:at.x,y:at.y,dir:S.ship.dir};
    setMap(makeDawn(),at.x,at.y,S.ship.dir);
  });
}
XACT.alvida_leave=[L2('Volver al bote','Return to the boat'),'ways',()=>dawnLeaveDeck(false)];
XACT.alvida_helm=[()=>G.P.alvidaMace?L2('Tomar el timón del galeón','Take the galleon’s helm'):null,'ways',()=>dawnLeaveDeck(true)];
XACT.alvida_claim=[()=>G.P.alvidaMace===1?L2('Recoger el mazo de Alvida','Claim Alvida’s mace'):null,'bag',()=>alvidaClaim()];
XACT.alvida_board=[L2('Abordar el galeón','Board the galleon'),'ways',dawnBoard];
XACT.alvida_deck=[L2('Bajar a la cubierta','Go down to the deck'),'ways',dawnBoard];
XACT.dawn_return=[L2('Regresar a Puerto Coral','Return to Coral Port'),'ways',()=>{
  const P=G.P,S=P.dawnHelm?.returnAt;
  if(!S||G.fading)return;
  transition(()=>{P.inside=null;setMap(G.world,S.x,S.y,'down');markDirty(true);});
}];
{const old=interactTarget;interactTarget=function(){
  const P=G.P;
  if(!G.map?.dawn||!P?.dawnHelm||P.dead)return old.apply(this,arguments);
  const [bx,by]=dawnPx(DAWN_BUOY), ship=dawnGalleon();
  const action=P.dawnHelm.kind==='galleon'?'alvida_deck':dist2(P.x,P.y,ship.x,ship.y)<96**2?'alvida_board':null;
  const key=dist2(P.x,P.y,bx,by)<66**2?'dawn_return':action;
  return key?{kind:'xact',label:XACT[key][0],icon:'ways',o:{xact:key}}:null;
};}
{const old=otherPOI;otherPOI=function(M){
  const out=old.apply(this,arguments);
  if(M.dawn){
    const s=dawnGalleon();
    out.push({c:'boss',x:s.x/16,y:s.y/16,t:ALVIDA_SHIP_NAME},{c:'dawn',x:DAWN_BUOY[0],y:DAWN_BUOY[1],t:L2('Boya de retorno a Puerto Coral','Return buoy to Coral Port')});
  }
  return out;
};}
{
  const entry=MAPW_LIST.find(m=>m.id==='dawn');
  entry.how=L2('Habla con Marina en Puerto Coral para navegar al nivel 500. Los desembarcos en las islas siguen cerrados.','Talk to Marina at Coral Port to sail at level 500. The island landings remain closed.');
}
