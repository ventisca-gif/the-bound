// The existing personal helm becomes the Merry when Nami joins, including on older saves.
const DAWN_MERRY_NAME='Going Merry';
const DAWN_MERRY_IMAGE=new Image();
DAWN_MERRY_IMAGE.src=DAWN_MERRY_BITMAP;
function dawnMerrySprite(){
 const c=DAWN_MERRY_IMAGE;
 if(!c.naturalWidth)return null;
 return spr('dawn:merry-wide',()=>{
  const scaled=mkCanvas(Math.round(c.naturalWidth*1.34),Math.round(c.naturalHeight*1.14));
  const g=scaled.getContext('2d');g.imageSmoothingEnabled=false;
  g.drawImage(c,0,0,scaled.width,scaled.height);
  return {c:scaled,ax:scaled.width>>1,ay:Math.round(scaled.height*.75)+16};
 });
}
function dawnMerryBerth(M,P){
 if(P.dawnBoat?.h?.kind==='skiff')return P.dawnBoat;
 if(P.fooshaBerth?.h?.kind==='skiff')return P.fooshaBerth;
 if(P.shellBerth?.kind==='skiff'&&M.shells){
  const [x,y]=shellsDockPoint(M,SHELL_MOORING);
  return {x,y,dir:'down'};
 }
 return null;
}
{const old=dawnShipSprite;dawnShipSprite=function(cx,cy,s,x,y,dir){
 const M=G.map,P=G.P;
 if(!M?.dawn||!P?.dawnCrewJoined)return old.apply(this,arguments);
 const own=P.dawnHelm?.kind==='skiff'&&x===P.x&&y===P.y+16;
 const berth=dawnMerryBerth(M,P);
 const moored=berth&&x===berth.x&&(y===berth.y+15||y===berth.y+16);
 return old.call(this,cx,cy,(own||moored)?dawnMerrySprite()||s:s,x,y,dir);
};}
DL_HOOKS.push((list,cx,cy)=>{
 const P=G.P,M=G.map;
 if(!M?.dawn||!P?.dawnCrewJoined)return;
 const H=P.dawnHelm,B=P.dawnBoat,F=P.fooshaBerth;
 let vessel=null,kind=null,mask=dawnCrewAvailable(P);
 if(H&&H.kind!=='swim'){vessel=P;kind=H.kind;}
 else if(B){
  vessel=B;kind=B.h?.kind;
  if(!H&&(B.rare||B.orange||B.syrup||B.baratie))mask&=~dawnCrewMask(P);
 }else if(P.shellBerth&&M.shells){
  const [x,y]=shellsDockPoint(M,SHELL_MOORING);
  vessel={x,y,dir:'down'};kind=P.shellBerth.kind;
  mask&=~dawnCrewMask(P);
 }else if(F){
  vessel=F;kind=F.h?.kind;
  mask&=~dawnCrewMask(P);
 }
 if(!vessel||dist2(vessel.x,vessel.y,cx+VW/2,cy+VH/2)>(VW+VH+200)**2)return;
 const dir=vessel.dir||'down',merry=kind==='skiff',side=dir==='left'?-1:1;
 if(vessel===F&&merry){
  list.push({type:'xdraw',x:F.x,y:F.y-10,noShadow:true,draw:()=>{
   const s=dawnMerrySprite()||dawnSprite('boat');
   dawnShipSprite(cx,cy,s,F.x,F.y+16,dir);
  }});
 }
 DAWN_CREW.forEach(([id],i)=>{
  if(!(mask&(1<<i)))return;
  const dx=(merry?[-65,54,122,-116,21]:[-37,-16,37,13,55])[i]*side,dy=(merry?[7,11,6,11,4]:[7,12,6,9,2])[i];
  const x=vessel.x+dx,y=vessel.y+dy;
  list.push({x,y,noShadow:true,type:'xdraw',draw:()=>{
   const A=npcAtlas(id),zoom=merry?.72:.62;
   atlasBlit(ctx,A,A.idx.idle+Math.floor(G.t*2+i)%2,DIRI[dir]||0,
    Math.round(x-cx-A.ax*zoom),Math.round(y-cy-A.ay*zoom),Math.round(A.fw*zoom),Math.round(A.fh*zoom));
  }});
 });
});
