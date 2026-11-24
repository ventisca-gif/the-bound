// Original pixel atlas for the three Shells Town actors. Coordinates are at 2× game resolution.
const SHELLS_CAST_COLORS = Object.fromEntries(Object.entries({
 skin:['#402630','#9c5446','#cf7f59','#efab77','#ffd2a0'], white:['#484951','#7e8294','#b7bbba','#e0ded2','#fff1cd'],
 black:['#171d2a','#28313e','#3c4a50','#525d61','#748183'], green:['#182e27','#284e35','#417447','#70a653','#a8ce72'],
 red:['#421e2d','#852a37','#b33a41','#d7534a','#f07a59'], blue:['#202946','#334d77','#4370a0','#6391bb','#94b8cf'],
 gold:['#5c422e','#966a38','#c9984f','#e6bc6a','#f4d88d'], metal:['#27313c','#53616b','#839499','#c0cdcb','#f2f3e7']
}).map(([name,colors])=>[name,pal(colors)]));
const SHELLS_CAST_SEQ={idle:0,walk:2,atk:6,hurt:10,dead:11,bound:12};
const SHELLS_INK=C('#241d2a');

function shellsActorFrame(id,row,col){
 const p=new Pix(172,144),P=SHELLS_CAST_COLORS;
 const front=row===0,back=row===3,side=!front&&!back;
 const boss=id==='morgan',zoro=id==='zoro',bound=col===12;
 const sign=row===2||boss&&front?-1:1;
 const walking=col>=2&&col<=5,action=col>=6&&col<=9?col-5:0;
 const walk=walking?[0,6,0,-6][col-2]:0;
 const wobble=walking&&col%2===1?2:col===10?3:0;
 const y=boss?0:11,top=y+wobble;
 const spread=boss?24:zoro?19:16;
 const tilt=action?[0,2,-3,7,2][action]*sign:0;
 const reflect=(x,yy)=>[86+x*sign,yy+top];
 const shape=(pts,color)=>p.poly(pts.map(([x,yy])=>reflect(x,yy)),color);
 const spot=(x,yy,rx,ry,color)=>p.ell(...reflect(x,yy),rx,ry,color);
 const trace=(x1,y1,x2,y2,color)=>p.line(...reflect(x1,y1),...reflect(x2,y2),color);
 const thread=(pts,material)=>{
  shape(pts,SHELLS_INK);
  const [a,b,c,d]=pts;
  shape([[a[0]+1,a[1]+2],[b[0]-1,b[1]+2],[c[0]-1,c[1]-1],[d[0]+1,d[1]-1]],material[2]);
  trace(a[0]+2,a[1]+2,b[0]-2,b[1]+2,material[4]);
  trace(d[0]+2,d[1]-2,c[0]-2,c[1]-2,material[1]);
 };
 const sword=(hx,hy,tx,ty,wrap)=>{
  const a=Math.atan2(ty-hy,tx-hx),nx=-Math.sin(a),ny=Math.cos(a),dx=Math.cos(a),dy=Math.sin(a);
  const pt=(x,y,d)=>[x+nx*d,y+ny*d];
  shape([pt(hx-dx*8,hy-dy*8,-3),pt(tx,ty,-2),[tx+dx*5,ty+dy*5],pt(tx,ty,3),pt(hx-dx*8,hy-dy*8,3)],SHELLS_INK);
  shape([pt(hx,hy,-1),pt(tx,ty,-1),[tx+dx*3,ty+dy*3],pt(tx,ty,2),pt(hx,hy,2)],P.metal[3]);
  trace(hx,hy,tx,ty,P.metal[4]);
  shape([pt(hx-dx*10,hy-dy*10,-2),pt(hx,hy,-2),pt(hx,hy,2),pt(hx-dx*10,hy-dy*10,2)],wrap);
  trace(hx+nx*5,hy+ny*5,hx-nx*5,hy-ny*5,P.gold[3]);
 };
 const axe=(hx,hy,tx,ty)=>{
  const ax=Math.atan2(ty-hy,tx-hx),dx=Math.cos(ax),dy=Math.sin(ax),nx=-dy,ny=dx;
  const q=(d,w)=>[hx+dx*d+nx*w,hy+dy*d+ny*w];
  shape([q(-9,-8),q(9,-8),q(14,-5),q(14,6),q(8,8),q(-9,8)],SHELLS_INK);
  shape([q(-8,-6),q(8,-6),q(10,6),q(-8,6)],P.gold[2]);
  shape([q(8,-6),q(21,-6),q(28,-15),q(37,-16),q(43,-8),q(43,8),q(37,17),q(28,16),q(21,6),q(8,6)],P.metal[1]);
  shape([q(10,-4),q(22,-4),q(33,-15),q(39,-12),q(41,0),q(39,12),q(33,14),q(22,4),q(10,4)],P.metal[3]);
  shape([q(37,-15),q(43,-8),q(43,8),q(37,16),q(37,10),q(40,0),q(37,-10)],P.metal[4]);
  for(const d of [-5,3])spot(...q(d,0),2,2,P.gold[4]);
 };
 const hands=bound?[[-46,54],[44,54]]:action?
  [[-spread-8+(side?-5:0),[0,72,60,79,87][action]],[spread+5,[0,82,49,66,91][action]]]:
  [[-spread-4,83+walk*.6],[spread+4,83-walk*.6]];
 if(side&&!bound){hands[0][0]-=5;hands[1][0]-=13;}
 const body=boss?P.blue:zoro?P.white:P.red;
 const pants=boss?P.black:zoro?P.black:P.blue;
 for(const k of [-1,1]){
  const base=side?k*8-3:k*(boss?13:10);
  const step=bound?k*6:k*walk;
  const bootY=(boss?134:123)-Math.max(0,step*.5)-wobble;
  const bootX=base+step*(side?1:.55)+(action===3?k*3:0);
  const knee=bootX+(zoro?k*2:0),cuff=boss||zoro?bootY-10:bootY-21;
  thread([[base-10,76],[base+10,76],[knee+9,cuff],[knee-8,cuff]],pants);
  trace(base-7,85,knee-6,cuff-2,pants[3]);
  if(!boss&&!zoro){
   shape([[knee-8,cuff-4],[knee+9,cuff-4],[knee+9,cuff+2],[knee-9,cuff+2]],P.white[3]);
   thread([[knee-6,cuff+2],[knee+7,cuff+2],[bootX+6,bootY-1],[bootX-6,bootY-1]],P.skin);
  }
  const toes=side?-6:k*2;
  shape([[bootX-8,bootY-10],[bootX+8,bootY-10],[bootX+10+Math.max(toes,0),bootY-2],[bootX+8+toes,bootY+3],[bootX-9+toes,bootY+3],[bootX-10,bootY]],boss||zoro?P.black[1]:P.gold[1]);
  trace(bootX-8+toes,bootY,bootX+8+toes,bootY,boss||zoro?P.black[3]:P.gold[4]);
  if(!boss&&!zoro)trace(bootX-5,bootY-4,bootX+5,bootY-8,P.black[0]);
 }
 const h1=hands[0],h2=hands[1];
 function arm(k,h){
  const shoulder=k*(spread-3)+tilt,elbow=k*(spread+3)+(h[0]-k*spread)*.5;
  thread([[shoulder-6,47],[shoulder+6,52],[elbow+5,69],[elbow-5,72]],boss?body:P.skin);
  thread([[elbow-5,67],[elbow+5,68],[h[0]+5,h[1]+2],[h[0]-5,h[1]+2]],boss?body:P.skin);
  if(zoro){
   shape([[shoulder-6,47],[shoulder+6,51],[elbow+2,60],[elbow-8,60]],P.white[2]);
   trace(shoulder-5,48,elbow-7,58,P.white[4]);
   trace(elbow-8,60,elbow+2,60,P.white[1]);
  }
  if(!boss||k===-1){spot(h[0],h[1],6,6,SHELLS_INK);spot(h[0],h[1]-1,4.5,4.5,P.skin[3]);trace(h[0]-2,h[1]-3,h[0]+3,h[1]-3,P.skin[4]);}
 }
 arm(side?1:-1,side?h2:h1);
 shape([[-spread+tilt,45],[-12+tilt,40],[12+tilt,40],[spread+tilt,46],[spread-5,74],[spread-9,85],[-spread+9,85],[-spread+4,73]],body[1]);
 shape([[-spread+4+tilt,48],[-12+tilt,42],[11+tilt,42],[spread-5+tilt,48],[spread-9,72],[spread-9,82],[-spread+10,81],[-spread+7,72]],body[2]);
 shape([[-spread+5+tilt,47],[-7+tilt,42],[-7,74],[-spread+10,77]],body[3]);
 trace(-spread+8,54,-spread+10,72,body[4]);
 trace(spread-6,55,spread-10,76,body[0]);
 if(zoro){
  shape([[-spread+7,72],[spread-7,72],[spread-6,85],[-spread+6,85]],P.green[2]);
  trace(-spread+7,73,spread-7,73,P.green[4]);
  for(let k=-13;k<15;k+=4)trace(k,75,k+2,84,P.green[0]);
  if(!action&&!bound){
   for(const [n,c] of [[0,P.white[3]],[1,P.red[1]],[2,P.black[0]]]){
    trace(11,80+n*3,36,97+n*3,SHELLS_INK);trace(11,79+n*3,36,96+n*3,c);
    trace(8,77+n*3,14,81+n*3,P.gold[3]);
   }
  }
 }else if(boss){
  for(const k of [-1,1]){
   shape([[k*11,40],[k*31,43],[k*32,50],[k*13,49]],P.gold[2]);
   trace(k*11,41,k*29,44,P.gold[4]);
   for(let f=0;f<4;f++)trace(k*(18+f*3),46,k*(19+f*3),52,P.gold[1]);
  }
  shape([[-17,73],[18,73],[17,80],[-16,80]],P.black[0]);
  if(!back)spot(-2,76,5,4,P.gold[3]);
 }else if(!back){
  shape([[-8+tilt,43],[8+tilt,43],[4,68],[0,74],[-4,61]],P.skin[3]);
  trace(-8+tilt,44,-4,61,P.red[0]);trace(8+tilt,44,5,63,P.red[4]);
  for(const by of [65,72,78])spot(5,by,1.7,1.5,P.gold[3]);
 }
 arm(side?-1:1,side?h1:h2);
 const nx=tilt+(side?-5:0),hy=boss?29:28;
 spot(nx,hy-2,boss?16:15,boss?18:16,SHELLS_INK);
 spot(nx-1,hy,boss?14:13,boss?16:14,P.skin[2]);
 spot(nx-3,hy-1,boss?11:10,boss?14:12,P.skin[3]);
 if(!side){spot(nx-13,hy+1,3,5,P.skin[2]);spot(nx+13,hy+1,3,5,P.skin[2]);}
 if(zoro||boss){
  const hair=zoro?P.green:P.gold;
  shape([[nx-15,hy-4],[nx-16,hy-12],[nx-12,hy-11],[nx-11,hy-18],[nx-7,hy-15],[nx-3,hy-20],[nx,hy-16],[nx+5,hy-19],[nx+8,hy-15],[nx+12,hy-16],[nx+15,hy-8],[nx+14,hy-3],[nx+6,hy-9],[nx,hy-6],[nx-6,hy-10],[nx-11,hy-7]],hair[2]);
  for(let i=-11;i<=10;i+=4)trace(nx+i,hy-13,nx+i+2,hy-10,hair[4]);
  if(back){spot(nx,hy,13,14,hair[1]);trace(nx-10,hy-4,nx+8,hy-9,hair[3]);}
 }else{
  shape([[nx-14,hy-6],[nx-10,hy-13],[nx+13,hy-12],[nx+16,hy-3],[nx+12,hy+2],[nx+8,hy-6],[nx+4,hy-2],[nx,hy-8],[nx-4,hy-1],[nx-10,hy-5],[nx-14,hy+4]],P.black[0]);
  if(back)spot(nx,hy-1,13,13,P.black[0]);
  spot(nx,hy-10,23,6,SHELLS_INK);spot(nx,hy-11,22,5,P.gold[3]);
  spot(nx,hy-18,14,10,P.gold[2]);spot(nx-2,hy-20,11,7,P.gold[4]);
  trace(nx-11,hy-13,nx+12,hy-13,P.red[1]);trace(nx-11,hy-12,nx+12,hy-12,P.red[3]);
  for(let i=-17;i<=15;i+=4)trace(nx+i,hy-9,nx+i+1,hy-9,P.gold[1]);
 }
 if(!back){
  for(const ex of side?[nx-6]:[nx-6,nx+6]){
   if(boss||zoro){trace(ex-4,hy-2,ex+2,hy,SHELLS_INK);spot(ex,hy+1,2.8,1.6,P.white[4]);spot(ex-.8,hy+1,1,1,P.black[0]);}
   else{spot(ex,hy+1,4,4,P.white[4]);spot(ex-1,hy+1,1.4,2,P.black[0]);}
  }
  if(boss){
   shape([[nx-13,hy+4],[nx+12,hy+4],[nx+11,hy+15],[nx+4,hy+19],[nx-8,hy+16],[nx-12,hy+11]],P.metal[1]);
   shape([[nx-10,hy+6],[nx+10,hy+6],[nx+8,hy+14],[nx+3,hy+17],[nx-7,hy+14]],P.metal[3]);
   for(const dx of [-7,-2,3,8])trace(nx+dx,hy+7,nx+dx-1,hy+14,P.metal[1]);
   spot(nx-9,hy+8,1,1,P.metal[4]);spot(nx+8,hy+8,1,1,P.metal[4]);
  }else{
   trace(nx-4,hy+9,nx+5,hy+9,SHELLS_INK);
   if(!zoro){trace(nx-3,hy+10,nx+3,hy+10,P.white[4]);trace(nx+5,hy+5,nx+8,hy+6,P.red[1]);}
   if(zoro&&!side)for(let i=0;i<3;i++)trace(nx+12+i*2,hy+1,nx+12+i*2,hy+7+i,P.gold[4]);
  }
 }
 if(boss){
  const swingX=action===2?11:action===3?27:14,swingY=action===2?-31:action===3?-3:24;
  axe(...h2,h2[0]+(side?-swingX:swingX),h2[1]+swingY);
 }
 if(zoro&&action&&!bound){
  const stance=[null,[-35,32,45,68],[-39,49,30,26],[-48,70,55,46],[-43,88,49,84]][action];
  sword(...h1,stance[0],stance[1],P.black[0]);sword(...h2,stance[2],stance[3],P.red[1]);
  if(!back)sword(nx-3,hy+9,nx-34,hy+7,P.white[4]);
 }
 if(bound){
  shape([[-16,31],[-12,22],[10,22],[16,30],[11,39],[-10,39]],P.black[0]);
  trace(-12,25,9,23,P.green[2]);
  for(const h of hands)for(let i=-3;i<=3;i+=2)trace(h[0]+i,h[1]-9,h[0]+i+2,h[1]+4,P.gold[i%4===1?3:1]);
  for(let i=0;i<4;i++)trace(-16,77+i*2,16,77+i*2,P.gold[i%2?3:1]);
  trace(3,79,-1,97,P.gold[3]);trace(5,80,8,98,P.gold[1]);
 }
 p.outline(SHELLS_INK);
 return p.canvas();
}
function shellsCastAtlas(id){
 return getAtlas('Shells:cast:'+id,()=>dawnPixelAtlas(86,72,SHELLS_CAST_SEQ,13,(g,col,row)=>g.drawImage(shellsActorFrame(id,row,col),0,0)));
}

const SHELLS_NEW_SEQUENCES={...SHELLS_CAST_SEQ,gatling:13,charge:17,sweep:21};
const SHELLS_NEW_IMAGES=Object.fromEntries(Object.entries(SHELLS_APPROVED_SHEETS).map(([id,src])=>{
 const image=new Image();
 image.src=src;
 return [id,image];
}));
// Torso/upper-leg join and knee heights in the approved 2× artwork.
const SHELLS_WALK_JOINTS={luffy:[91,116],zoro:[87,112],morgan:[85,114]};
function shellsWalkStraight(g,image,id,sourceCol,step,back){
 const sx=sourceCol*172,[hip,knee]=SHELLS_WALK_JOINTS[id];
 const lifts=[[0,16],[0,9],[16,0],[9,0]][step];
 const bob=step===1||step===3?0:2;
 const advance=back?3:6;
 for(const side of [0,1]){
  const lift=lifts[side],direction=side===0?-1:1;
  const drift=lift?direction*3:0,footY=lift?140-lift:140+advance*.5;
  const bentKnee=knee+bob-(lift?Math.round(lift*.42):0);
  const x=side*86;
  // The moving knee stays attached to the hip and each sole has its own contact height.
  g.drawImage(image,sx+x,hip,86,knee-hip,x,hip+bob,86,bentKnee-hip-bob);
  g.drawImage(image,sx+x,knee,86,144-knee,x+drift,bentKnee,86,footY+4-bentKnee);
 }
 g.drawImage(image,sx,0,172,hip+3,0,bob,172,hip+3);
}
function shellsDrawApproved(g,image,id,col,row){
 const side=row===1||row===2,walking=col>=2&&col<6;
 const attack=col>=6&&col<10||col>=13;
 let sourceRow=0,sourceCol=[0,1,2,3][row],mirror=false,dy=0,dx=0,tilt=0;
 if(col===12&&id==='zoro'){sourceRow=3;sourceCol=2;}
 else if(walking&&side){sourceRow=1;sourceCol=col-2;mirror=row===1;}
 else if(walking){
  if(!drawDawnWalkFrame(g,id,row,col-2))shellsWalkStraight(g,image,id,sourceCol,col-2,row===3);
  return;
 }else if(attack){
  const frame=col<10?col-6:col<17?col-13:col<21?col-17:col-21;
  if(row!==3){
   sourceRow=col>=13&&col<21?3:2;
   sourceCol=col>=21?[0,2,2,3][frame]:id==='morgan'&&col<10?[0,0,1,3][frame]:frame;
   mirror=row===1;dx=row===0?[0,0,3,0][frame]:0;
  }else{dy=[0,2,1,0][frame];tilt=[-.05,.045,.095,0][frame];}
 }else if(col===10){dx=3;dy=2;tilt=-.065;}
 else if(col===11){g.translate(83,128);g.rotate(-Math.PI/2);g.translate(-83,-128);}
 if(mirror){g.translate(172,0);g.scale(-1,1);}
 if(tilt){g.translate(-140*tilt,0);g.transform(1,0,tilt,1,0,0);}
 g.drawImage(image,sourceCol*172,sourceRow*144,172,144,dx,dy,172,144);
}
{
 const original=shellsCastAtlas;
 shellsCastAtlas=function(id){
  const image=SHELLS_NEW_IMAGES[id];
  if(!image?.naturalWidth)return original(id);
  return getAtlas('Shells:approved:'+id+':'+Number(dawnWalkReady(id)),()=>{
   const atlas=dawnPixelAtlas(86,72,SHELLS_NEW_SEQUENCES,25,(g,col,row)=>shellsDrawApproved(g,image,id,col,row));
   atlas.frames={bound:1,gatling:4,charge:4,sweep:4};
   atlas.shellsApproved=true;
   return atlas;
  });
 };
}
