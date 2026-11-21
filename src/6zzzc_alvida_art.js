// Alvida's first outfit, rigged to the game's stocky body and directional hand anchors.
const ALVIDA_RED=pal(['#481726','#792337','#a42a43','#cb4056','#e66a75']);
const ALVIDA_PINK=pal(['#672c4c','#9f4369','#c6628c','#e386aa','#efa5c1']);
const ALVIDA_NAVY=pal(['#14192c','#263352','#344971','#49658e','#6582a2']);
const ALVIDA_HAT=pal(['#5f6976','#9ea7ad','#c5cbcf','#e4e7e4','#fff9e9']);
BODYP.alvida={...BODYP.normal,fw:60,fh:49};
const ALVIDA_IRON=pal(['#182427','#2a3b3d','#435453','#6a7771','#a0a699']);
fitKind('head','alvida_hat',(p,A)=>{
  const x=A.hx,y=Math.round(A.headTop),b=Math.round(A.hrx)+4;
  p.ball(x,y+1,b,2.8,ALVIDA_HAT);
  p.poly([[x-5,y],[x-5,y-5],[x-2,y-7],[x+4,y-7],[x+6,y]],ALVIDA_HAT[3]);
  p.line(x-5,y-4,x-3,y-6,ALVIDA_HAT[4]);p.hl(x-5,y-1,11,C('#56804a'));
  p.ball(x+(A.side?-2:4),y-7,3.4,5.2,ALVIDA_RED);
  p.ball(x+(A.side?-1:5),y-5,2.8,3.7,ALVIDA_RED);
  p.line(x+2,y-4,x+5,y-11,ALVIDA_RED[1]);
});
fitKind('body','alvida_jacket',(p,A)=>{
  const {tx0,tw,torsoTop:y,th,side,up,cx}=A;
  for(let j=0;j<th;j++)for(let i=0;i<tw;i++){
    const pink=clamp(3+(i<tw*.27?1:0)-(i>tw*.72?1:0)-(j>th*.65?1:0),1,4);
    p.set(tx0+i,y+j,up?ALVIDA_NAVY[pink]:ALVIDA_PINK[pink]);
    if(!up&&(j%4===3||i%5===4))p.set(tx0+i,y+j,ALVIDA_PINK[Math.max(1,pink-1)]);
  }
  if(!up){
    const k=side?cx-3:cx;
    p.poly([[k-4,y],[k+4,y],[k+1,y+4],[k+1,y+th-3],[k-1,y+5]],ALVIDA_RED[2]);
    p.set(k,y+3,ALVIDA_RED[4]);
  }
  for(const x of side?[tx0+tw-3]:[tx0+1,tx0+tw-2]){
    p.ell(x,y+1,3.8,1.6,GOLD[3]);p.hl(x-2,y,5,GOLD[4]);
    for(let d=-2;d<=2;d+=2)p.vl(x+d,y+2,2+(d===0?1:0),GOLD[2]);
  }
  p.hl(tx0,y+th-2,tw,C('#53257c'));p.hl(tx0,y+th-1,tw,C('#7b3e96'));
  if(!up){
    for(let i=1;i<tw-1;i+=3)p.set(tx0+i,y+th-1,GOLD[4]);
  }
});
function drawAlvidaClub(p,hx,hy,ang,length=1){
  const ca=Math.cos(ang),sa=Math.sin(ang);
  const at=(d,w=0)=>[hx+ca*d*length-sa*w*length,hy+sa*d*length+ca*w*length];
  p.line(...at(-3),...at(8),ALVIDA_IRON[1]);
  p.line(...at(-3,-.7),...at(8,-.7),ALVIDA_IRON[3]);
  p.poly([at(5,-1.3),at(18,-4.5),at(22,-3),at(22,3),at(18,5),at(5,1.6)],ALVIDA_IRON[1]);
  p.poly([at(7,-1),at(19,-3.2),at(21,-1),at(19,1.2),at(7,1)],ALVIDA_IRON[2]);
  p.line(...at(8,-.8),...at(20,-2.3),ALVIDA_IRON[3]);
  for(const [d,v] of [[11,-1],[14,1],[17,-2],[19,2],[21,-.5]]){
    p.poly([at(d-1,v),at(d+1,v),at(d+.6,v+(v<0?-2.8:2.8))],ALVIDA_IRON[4]);
  }
}
{const old=drawWeapon;drawWeapon=function(p,W,hx,hy,ang){
  if(W?.k==='alvida_club')return drawAlvidaClub(p,hx,hy,ang,W.size||1);
  return old.apply(this,arguments);
};}
{const old=genIcon;genIcon=function(spec){
  if(spec[0]!=='alvida_club')return old.apply(this,arguments);
  const p=new Pix(16,16);drawAlvidaClub(p,3,13,-.81,.76);p.outline(OUTL,false);return p;
};}
function alvidaLook(){
  const app={...DEF_APP,g:'f',bt:2,skin:1,hs:4,hair:'negro',eyes:'cafe',top:[1,'rojo'],bot:[0,'blanco'],shoe:[1,'rojo']};
  const L=heroLook('guerrero',app,{},{},{});
  L.body='alvida';
  L.btS={...BODY_T.f[2],tw:19,sw:14,aw:4,al:7,hrx:9.7,hry:7.9,jaw:4.5,belly:3,hips:2,waist:0,bust:2};
  L.head={k:'alvida_hat',cover:'hat'}; L.top={k:'alvida_jacket',m:ALVIDA_PINK,s:ALVIDA_NAVY};
  L.back={k:'cape',o:ALVIDA_NAVY,i:ALVIDA_RED,tr:GOLD};
  L.weapon={k:'alvida_club',tier:1,size:1};
  L.hd=true;return L;
}
function drawAlvida(p,L,dir,anim,f){
  drawHero(p,L,dir,anim,f);
  const A=p.meta;
  if(!A||A.up||anim==='hurt')return;
  if(p.t)p.tg=2;
  if(A.side){
    p.ball(A.hx+A.d*5,A.hy+4,3.4,2.5,A.sk);
    p.hl(A.hx+A.d*4-1,A.hy+5,4,ALVIDA_RED[1]);
    return;
  }
  if(p.t)p.tg=2;
  const x=A.hx,y=A.hy+5;
  for(const d of [-1,1])p.ball(x+d*5.8,y-1,3,2.5,A.sk);
  p.poly([[x-3,y],[x+3,y],[x+2,y+2],[x-2,y+2]],ALVIDA_RED[1]);
  p.hl(x-3,y,6,ALVIDA_HAT[4]);p.set(x-4,y-1,ALVIDA_RED[2]);p.set(x+4,y-1,ALVIDA_RED[2]);
}
{const old=heroPose;heroPose=function(dir,anim,f,L){
  const pose=old.apply(this,arguments);
  if(L.weapon?.k==='alvida_club'&&anim==='atk'){
    const base={down:1.16,up:-1.5,left:2.85,right:.28}[dir];
    pose.wang=base+[-1.6,-.66,.66,1.0][f];
  }
  return pose;
};}
{const old=mobAtlasFor;mobAtlasFor=function(art){
  if(art[0]!=='hum')return old.apply(this,arguments);
  if(art[1]==='dawn_alvida')return getAtlas('alvida:boss',()=>buildAtlas(alvidaLook(),['idle','walk','atk','hurt','dead'],drawAlvida));
  if(art[1]==='dawn_deckhand'||art[1]==='dawn_boarder')return getAtlas(art[1],()=>{
    const dark=art[1]==='dawn_boarder';
    const L=heroLook('guerrero',{...DEF_APP,g:'m',bt:dark?3:1,hs:dark?7:2,skin:dark?3:1,
      hair:dark?'negro':'marron',top:[1,dark?'verde':'rojo'],bot:[0,'gris'],shoe:[1,'marron']},{},{},{});
    L.back=null;L.head={k:'dawn_hat',dawn:'band',cover:'hat'};
    L.weapon={k:dark?'axe':'sword',tier:3};
    return buildAtlas(L,['idle','walk','atk','hurt','dead'],drawHero);
  });
  return old.apply(this,arguments);
};}
