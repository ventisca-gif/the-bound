const CON_IMG=Object.fromEntries(Object.entries(CONOMI_BITMAPS).map(([k,src])=>{
 const image=new Image();image.src=src;return [k,image];
}));
const CON_FACES={
 con_arlong:['fish',0,0],con_hatchan:['fish',1,1],con_kuroobi:['guards',0,2],con_chew:['guards',1,3]
};
function conomiAtlas(id){
 const [key,line,strike]=CON_FACES[id],img=CON_IMG[key],action=CON_IMG.action;
 if(!img.naturalWidth)return npcAtlas(SHELLS_CAST_IDS.zoro);
 const W=190,H=160,foot=H-5;
 return getAtlas(id+':'+Number(!!action?.naturalWidth),()=>{
  const a=dawnPixelAtlas(W/2,H/2,DAWN_ALT_ANIMS,12,(g,col,dir)=>{
   const side=dir===1?-1:dir===2?1:0,sx=dir*W,sy=line*H;
   const base=(dy=0)=>g.drawImage(img,sx,sy,W,H,0,dy,W,H);
   if(col===11){g.translate(W*.47,foot);g.rotate(-Math.PI/2);g.scale(.7,.7);g.translate(-W/2,-foot);base();return;}
   if(col===10){g.transform(1,0,-.07,1,9,2);base();return;}
   if(col>=6){
    const pose=col-6;
    if(side&&action?.naturalWidth&&(pose===1||pose===2)){
     if(side===-1){g.translate(W,0);g.scale(-1,1);}
     g.drawImage(action,strike*W,0,W,H,pose*2,-pose,W,H);return;
    }
    const tilt=[-.035,.01,.15,.045][pose]*(side||1);
    g.transform(1,0,tilt,1,-tilt*foot,-(pose===2?5:0));base();return;
   }
   if(col<2){base(col);return;}
   const bob=col%2,cut=foot-32;
   for(let leg=0;leg<2;leg++){
    const step=(leg===0)===(col<4),offset=step?(bob?3:8):0,x=leg*W/2,lean=(step?1:-1)*side*.14;
    g.save();g.transform(1,0,lean,1,-lean*(cut+bob),0);
    g.drawImage(img,sx+x,sy+cut,W/2,H-cut,x,cut+bob,W/2,H-cut-offset);g.restore();
   }
   g.drawImage(img,sx,sy,W,cut+1,0,bob,W,cut+1);
  });
  a.frames={idle:2,walk:4,atk:4,hurt:1,dead:1};a.combatWidth=54;return a;
 });
}
const CON_SOCIETY=['con_nojiko','con_genzo','con_bell','con_nazumi'];
for(const [i,id] of CON_SOCIETY.entries()){
 const npc=NPCS[id];
 npc.atlas=()=>getAtlas(id+':'+Number(!!CON_IMG.villagers?.naturalWidth),()=>{
  const walk=buildAtlas(npc.look,['idle','walk']);
  if(!CON_IMG.villagers?.naturalWidth)return walk;
  return dawnPixelAtlas(95,80,DAWN_ALT_ANIMS,12,(g,col,dir)=>{
   if(dir===0){
    g.drawImage(CON_IMG.villagers,i*190,0,190,160,0,col%2,190,160);return;
   }
   const kind=col>=2&&col<6?'walk':'idle',frame=walk.idx[kind]+(kind==='walk'?col-2:col%2);
   atlasBlit(g,walk,frame,dir,95-walk.fw*1.28,157-walk.fh*2.56,walk.fw*2.56,walk.fh*2.56);
  });
 });
}
DL_HOOKS.push((list,cx,cy)=>{
 const M=G.map,P=G.P,img=CON_IMG.park;
 if(!M?.conomi||!P||!img.naturalWidth)return;
 const [x,y]=dawnPx(conAt(39,51));
 if(x<cx-300||x>cx+VW+300||y<cy-75||y>cy+VH+400)return;
 list.push({type:'xdraw',x,y,noShadow:true,draw:()=>{
  if(conomiStep(P)!==7){ctx.drawImage(img,Math.round(x-cx-img.width/2),Math.round(y-cy-img.height));return;}
  const ruin=CON_FINISH_IMG.ruin;
  if(ruin?.naturalWidth){ctx.drawImage(ruin,Math.round(x-cx-ruin.width/2),Math.round(y-cy-ruin.height));return;}
  for(let i=0;i<30;i++){
   const a=(i*37)%240-120,b=(i*13)%64-58;
   ctx.fillStyle=['#a87c60','#bb9871','#7b6658'][i%3];
   ctx.fillRect(x+a-cx,y+b-cy,8+i%13,5+i%6);
  }
 }});
});
{const old=drawEnt;drawEnt=function(e,cx,cy){
 const promise=G.map?.conomi?.scene;
 if(promise?.kind==='promise'&&promise.cast[1]===e&&CON_IMG.promise?.naturalWidth){
  const t=G.t-promise.at,frame=t<1.8?0:t<2.8?1:2;
  ctx.drawImage(CON_IMG.promise,frame*190,0,190,160,Math.round(e.x-cx-47.5),Math.round(e.y-cy-78),95,80);
  return;
 }
 const r=old.apply(this,arguments);
 if(e.id!=='con_nami'||promise?.kind!=='promise'||!promise.cast.includes(e))return r;
 const x=Math.round(e.x-cx),y=Math.round(e.y-cy-57);
 if(e.conHat){
  ctx.fillStyle='#c8954a';ctx.fillRect(x-14,y+5,28,3);ctx.fillRect(x-8,y,16,6);
  ctx.fillStyle='#edc06a';ctx.fillRect(x-7,y-1,14,5);ctx.fillStyle='#a64337';ctx.fillRect(x-8,y+4,16,2);
 }else{
  const t=Math.floor((G.t-promise.at)*11)%9;
  ctx.fillStyle='#a9ddf1';ctx.fillRect(x-5,y+15+t,2,3);ctx.fillRect(x+4,y+13+t,2,3);
 }
 return r;
};}
{const old=drawFx;drawFx=function(f,cx,cy){
 if(f.type!=='conomiStrike')return old.apply(this,arguments);
 const t=clamp(f.t/f.delay,0,1),x=f.x-cx,y=f.y-cy,ex=f.ex-cx,ey=f.ey-cy;
 ctx.save();ctx.strokeStyle=f.col;ctx.fillStyle=f.col;ctx.globalAlpha=Math.max(0,1-(f.t-f.delay)/.38);
 if(f.mode==='water'||f.mode==='bite'){
  const px=lerp(x,ex,t),py=lerp(y,ey,t);
  ctx.lineWidth=f.mode==='bite'?5:2;
  ctx.beginPath();ctx.moveTo(lerp(x,px,.55),lerp(y,py,.55));ctx.lineTo(px,py);ctx.stroke();ctx.fillRect(px-3,py-3,6,6);
 }else for(let i=0;i<(f.mode==='swords'?3:2);i++){
  const angle=f.a+(i-1)*.48;
  ctx.beginPath();ctx.ellipse(x,y,24+t*f.r,17+t*25,angle,angle-.85,angle+.72);ctx.stroke();
 }
 ctx.restore();
};}
