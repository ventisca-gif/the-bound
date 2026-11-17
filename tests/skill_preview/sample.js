// Muestras de revisión; se inyectan sobre la versión publicada, nunca en src ni en el actualizador.
const SP_CASES=[
 {cls:'guerrero',id:'g4',title:'Juicio Final',idea:'Preparación a dos manos, golpe pesado y grietas de luz.',color:'#edbb63'},
 {cls:'mago',id:'m1',title:'Bola de Fuego',idea:'Concentrar fuego, empujar con la mano y proyectil con cola de brasas.',color:'#ff8753'},
 {cls:'arquero',id:'a1',title:'Disparo Cargado',idea:'Tensar la cuerda, retener, soltar y estela de viento.',color:'#8be0ba'},
 {cls:'asesino',id:'s1',title:'Golpe Sombrío',idea:'Postura baja, desplazamiento breve, doble corte y siluetas de sombra.',color:'#c48ef1'},
 {cls:'bardo',id:'d4',title:'Crescendo',idea:'Rasgueo visible, compás del cuerpo y pentagrama con notas.',color:'#f1c966'},
 {cls:'invocador',id:'i1',title:'Invocar Almas',idea:'Manos abiertas, sello de invocación y aparición de un espíritu.',color:'#86c8f4'},
 {cls:'pez',id:'z4',title:'Mandíbula de Tiburón',idea:'Impulso de las aletas, mandíbula de agua y espuma.',color:'#6cdeea'},
];
const SP_OLD_POSE=heroPose;
const spClamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const spEase=v=>{v=spClamp(v);return v*v*(3-2*v)};
const spLerp=(a,b,t)=>a+(b-a)*t;
function spPose(cls,dir,t,L){
 const wind=spEase(t/.27),hit=spEase((t-.27)/.18),recover=spEase((t-.62)/.24),active=t<.88;
 const frame=t<.28?0:t<.43?1:t<.63?2:3;
 const base=cls==='guerrero'||cls==='pez'?'slam':cls==='mago'||cls==='invocador'?'cast':'atk';
 let p={...SP_OLD_POSE(dir,base,base==='slam'?Math.min(2,frame):base==='cast'?frame%2:frame,L)};
 const side=dir==='left'||dir==='right',d=dir==='left'?-1:1;
 if(!active)return {...SP_OLD_POSE(dir,'idle',0,L)};
 if(cls==='guerrero'){
  p.rax=spLerp(side?-d:1,side?d*6:2,hit);p.ray=spLerp(-7*wind,3,hit);p.lax=spLerp(side?0:-1,side?d*3:-2,hit);p.lay=spLerp(-6*wind,2,hit);p.wang=spLerp(-1.65,dir==='left'?2.55:dir==='right'?.55:1.5,hit);p.crouch=wind*(1-hit)+hit*2*(1-recover);p.jump=0;p.lean=hit*2*(1-recover);
 }else if(cls==='mago'){
  p.rax=(side?d:1)*(2+hit*3);p.ray=-6*wind+hit*4;p.lax=(side?d:-1)*3;p.lay=-3*wind-hit;p.wang=spLerp(-1.6,side?(d>0?.35:2.7):1.15,hit);p.bob=-Math.sin(t*10)*.45;p.crouch=0;p.lean=hit*(1-recover);
 }else if(cls==='arquero'){
  p.wph=t<.2?1:t<.38?2:0;p.rax=side?d*4:3;p.ray=side?-1:2;p.lax=side?-d*(1+wind*4):-3;p.lay=-1-wind*3+hit*3;p.crouch=wind*.7;p.lean=-wind*(1-hit)+hit;p.wang=({down:1.57,up:-1.57,left:3.14,right:0})[dir];
 }else if(cls==='asesino'){
  p.crouch=2.5*(1-recover);p.lean=3*hit*(1-recover);p.rax=(side?d:1)*(2+hit*5);p.ray=-2+hit*5;p.lax=(side?d:-1)*(1+hit*4);p.lay=1-hit*4;p.wang=({down:1.57,up:-1.57,left:3.14,right:0})[dir]+Math.sin(t*18)*.5;p.dual=t>.36?1:0;
 }else if(cls==='bardo'){
  p.lax=side?d:0;p.lay=-3;p.rax=side?d*3:2;p.ray=-3+Math.sin(spClamp((t-.2)/.45)*Math.PI*4)*2;p.wang=-.6;p.wph=frame%2;p.bob=t>.22&&t<.65?-Math.sin(t*17):0;p.lfy=t>.25&&t<.5?-1:0;p.crouch=0;
 }else if(cls==='invocador'){
  p.rax=(side?d:1)*(2+wind*2);p.lax=(side?d:-1)*(2+wind*2);p.ray=-2-wind*5+hit;p.lay=-1-wind*5+hit;p.wang=side?(d>0?.6:2.5):.7;p.crouch=0;p.jump=0;p.bob=-wind*.8;
 }else if(cls==='pez'){
  p.noWeapon=1;p.rax=(side?d:1)*(1+hit*5);p.lax=(side?d:-1)*(1+hit*5);p.ray=-3+hit*5;p.lay=-3+hit*5;p.crouch=wind*2*(1-hit)+hit*(1-recover);p.lean=hit*3*(1-recover);p.jump=Math.sin(spClamp((t-.27)/.3)*Math.PI)*2;
 }
 for(const k of['rax','ray','lax','lay','crouch','jump','lean','bob','lfy','rfy'])if(p[k])p[k]*=1-recover;
 return p;
}
heroPose=function(dir,anim,f,L){return anim==='sp_example'?spPose(L.spClass,dir,f/24,L):SP_OLD_POSE.apply(this,arguments);};

function spFx(cls,t,p,anchor,behind){
 const x=anchor.x,y=anchor.y,base=anchor.base,F=C('#e8fbff');
 const FS=1.5,point=(u,v)=>[Math.round(x+u*FS),Math.round(y+v*FS)];
 const line=(a,b,c)=>p.line(...point(...a),...point(...b),C(c));
 const arc=(rx,ry,a,b,c,w=1)=>{let last;for(let i=0;i<=30;i++){const ang=a+(b-a)*i/30,z=point(Math.cos(ang)*rx,Math.sin(ang)*ry);if(last)for(let j=0;j<w;j++)p.line(last[0],last[1]+j,z[0],z[1]+j,C(c));last=z;}};
 const dot=(u,v,r,cols)=>p.ball(x+u*FS,y+v*FS,r*FS,r*FS,cols.map(h=>C(h)));
 const life=spClamp((t-.26)/.45),fade=1-spClamp((t-.7)/.2),charge=spClamp(t/.3);
 if(t>.91)return;
 if(cls==='guerrero'){
  if(behind&&t>.36&&t<.83){const r=10+life*32;for(let k=0;k<7;k++){const a=k*2.399;const q=[Math.cos(a)*r,22+Math.sin(a)*r*.35];line([0,20],[q[0]*.55,q[1]],'#6d472c');line([q[0]*.55,q[1]],[q[0],q[1]+4],'#e4a553');line([q[0]*.55,q[1]],[q[0]*.7+3,q[1]-5],'#b27b3f');}}
  if(!behind&&t>.28&&t<.54){const z=life*27;p.poly([point(-5,-16+z),point(1,-12+z),point(8,18+z),point(0,21+z)],C('#e7bd72'));line([-3,-14+z],[2,18+z],'#fff2c9');line([2,18+z],[6,22+z],'#fff8e1');}
  if(!behind&&t>.4&&t<.72)for(let i=0;i<10;i++){const a=i*2.4,r=(t-.38)*75;dot(Math.cos(a)*r,20+Math.sin(a)*r*.5,1,['#9a612d','#edb45d','#fff4d1']);}
 }else if(cls==='mago'){
  if(behind&&t<.35)for(let i=0;i<5;i++){const a=i*2.399+t*6;dot(Math.cos(a)*(10-charge*5),Math.sin(a)*(9-charge*4),1,['#85292a','#d56c35','#ffe3a3']);}
  if(!behind){const z=t<.32?0:(t-.32)*85,sz=t<.32?2+charge*3:5*(1-life*.3),cols=['#7f2325','#d84325','#f89438','#ffe3a0'];
   if(t<.72){for(let i=5;i>=1;i--)dot(Math.sin(i*1.5+t*15)*2,-i*3+z,Math.max(1,sz-i*.6),cols);dot(0,z,sz,cols);dot(-1,z-1,Math.max(1,sz*.38),['#ffdf7b','#fff0b5','#fff8dd']);}
   if(t>.58&&t<.85){const r=(t-.58)*60;for(let i=0;i<11;i++){const a=i*2.399;dot(Math.cos(a)*r,25+Math.sin(a)*r*.6,1,cols);}}
  }
 }else if(cls==='arquero'){
  if(behind&&t<.36)for(let i=0;i<3;i++){const yy=3+i*4;line([-16-charge*5,yy],[-6,yy-2],'#518e80');line([6,yy-2],[16+charge*5,yy],'#8ed0b4');}
  if(!behind&&t>.31&&t<.73){const d=(t-.31)*110;line([0,d-17],[0,d+2],'#d7e3d4');line([-2,d],[0,d+4],'#b3f1dd');line([0,d+4],[2,d],'#8addb8');for(let i=1;i<4;i++)line([-i*2,d-4-i*4],[-i*2,d-13-i*3],i%2?'#79c9b8':'#3c857b');}
  if(!behind&&t>.65&&t<.87)for(let i=0;i<7;i++){const a=i*2.399,r=(t-.65)*50;line([Math.cos(a)*r,30+Math.sin(a)*r*.5],[Math.cos(a)*(r+3),30+Math.sin(a)*(r+3)*.5],'#9be9c3');}
 }else if(cls==='asesino'){
  if(behind&&t>.25&&t<.64){for(let i=0;i<7;i++){const k=(i*2.4+t*5);dot(Math.sin(k)*13,15+Math.cos(k)*5,2,['#1c1231','#3b2354','#694081']);}}
  if(!behind&&t>.33&&t<.65){const z=life*12;line([-17+z,-2],[17+z,28],'#ab68da');line([-16+z,-2],[18+z,28],'#eee1fb');line([17-z,-2],[-17-z,28],'#7d3fa2');line([16-z,-2],[-18-z,28],'#e7bdf3');}
 }else if(cls==='bardo'){
  if(behind&&t>.22&&t<.84)for(let i=0;i<4;i++){const a=i*1.5+t*9;dot(Math.sin(a)*20,17+Math.cos(a)*3,1,['#674b7e','#ac7ca9','#e5bd73']);}
  if(!behind&&t>.23&&t<.83){for(let l=0;l<5;l++)for(let i=0;i<20;i++){const xx=-20+i*2,yy=10+l*3+Math.sin(i*.35-t*9)*3+life*7;line([xx,yy],[xx+2,yy],l%2?'#8f6d8f':'#c6a85b');}
   for(let n=0;n<4;n++){const xx=-20+n*13+Math.sin(t*8+n)*2,yy=5+n%2*7-life*11,cols=n%2?['#63345e','#bc6fa5','#f4bad9']:['#866525','#e0b44c','#fff0ad'];dot(xx,yy,2,cols);line([xx+2,yy],[xx+2,yy-8],n%2?'#e6a4d0':'#f4d378');line([xx+2,yy-8],[xx+5,yy-6],n%2?'#e6a4d0':'#f4d378');}
  }
 }else if(cls==='invocador'){
  if(behind&&t>.12&&t<.87){const r=7+Math.sin(spClamp((t-.12)/.65)*Math.PI)*16,gy=(base-y)/FS+2;let last;for(let i=0;i<=36;i++){const a=i/36*Math.PI*2,z=[Math.cos(a)*r,gy+Math.sin(a)*r*.4];if(last)line(last,z,i%2?'#5f8fb6':'#87c9dd');last=z;}for(let i=0;i<8;i++){const a=i*Math.PI/4;line([Math.cos(a)*(r+1),gy+Math.sin(a)*(r+1)*.4],[Math.cos(a)*(r+4),gy+Math.sin(a)*(r+4)*.4],'#9dd7e9');}}
  if(!behind&&t>.35&&t<.85){const rise=spEase((t-.35)/.25),yy=(base-y)/FS+14-rise*16,dx=22,cols=['#173a5e','#2e719b','#78b4d1','#c5f0f2'];dot(dx,yy-7,5,cols);p.poly([point(dx-4,yy-4),point(dx+4,yy-4),point(dx+6,yy+7),point(dx+2,yy+4),point(dx,yy+8),point(dx-2,yy+4),point(dx-5,yy+7)],C('#5796b6'));p.set(...point(dx-2,yy-8),C('#e6fcfc'));p.set(...point(dx+2,yy-8),C('#e6fcfc'));}
 }else if(cls==='pez'){
  if(behind&&t>.25&&t<.84){const r=7+life*29;arc(r,r*.4,Math.PI,Math.PI*2,'#3a8fa8',2);arc(r-3,(r-3)*.4,0,Math.PI,'#a8eff0');}
  if(!behind&&t>.32&&t<.76){const openness=Math.sin(spClamp((t-.32)/.4)*Math.PI),rx=13+life*13,ry=4+openness*10;
   arc(rx,ry,Math.PI,Math.PI*2,'#4aa6bd',3);arc(rx,ry,0,Math.PI,'#b1f1eb',3);
   for(let i=-2;i<=2;i++){const xx=i*rx/3,yu=-Math.sqrt(Math.max(0,1-xx*xx/(rx*rx)))*ry,yl=-yu;p.poly([point(xx-2,yu),point(xx+2,yu),point(xx,yu+4)],F);p.poly([point(xx-2,yl),point(xx+2,yl),point(xx,yl-4)],F);}
   for(let i=0;i<7;i++){const a=i*2.4;dot(Math.cos(a)*(rx+3),Math.sin(a)*(ry+2),1,['#316b90','#7bd8dc','#e3ffff']);}
  }
 }
}
const SP_CACHE=new Map();
function spSprite(cls,g,bt,f){const key=[cls,g,bt,f].join(':');if(SP_CACHE.has(key))return SP_CACHE.get(key);
 const app={...DEF_APP,g,bt,hs:g==='f'?6:0,hair:'negro',eyes:'azul'},L=heroLook(cls,app,{weapon:5,body:30,legs:30,feet:30},{},{hideHelm:true});L.spClass=cls;
 const p=new Pix(48,48);p.t=new Uint8Array(2304);p.tg=0;const rec=ARM_REC=[];
 try{drawHero(p,L,'down','sp_example',f);}finally{ARM_REC=null;}
 p.outline(OUTL,false);const q=hdDetail(p,hdMats(L));hdOrn(q,p,L);
 for(const r of rec){const src=armHD(r.key);if(src)armRot(q,src,ARM_PIVK32[r.key]||ARM_PIV32[r.cls],r.hx*2,r.hy*2,r.ang,i=>!uA(q.d[i])||q.t[i]===10||q.t[i]===0);}
 const result={canvas:q.canvas(),meta:p.meta};SP_CACHE.set(key,result);return result;
}
function spFrame(cls,f){const D=SP_CASES.find(v=>v.cls===cls),S=2,CW=104,CH=106,LABEL=60,TOP=65,c=mkCanvas(LABEL+5*CW*S,TOP+2*CH*S),x=c.getContext('2d');x.imageSmoothingEnabled=false;
 x.fillStyle='#171c28';x.fillRect(0,0,c.width,c.height);x.fillStyle=D.color;x.font='bold 20px sans-serif';x.fillText(CLASSES[cls].n+' · '+D.title,14,26);x.font='13px sans-serif';x.fillStyle='#c7d1df';x.fillText('PROPUESTA ANIMADA · cuerpos originales de The Bound 5.01 · sin cambios publicados',14,47);
 const phase=f<7?'Preparación':f<13?'Ataque':f<19?'Impacto':'Recuperación';x.fillStyle=D.color;x.fillText(phase,c.width-125,26);
 for(let row=0;row<2;row++){const g=row?'f':'m';x.fillStyle='#aab7c9';x.fillText(row?'MUJER':'HOMBRE',5,TOP+row*CH*S+CH*S/2);for(let bt=0;bt<5;bt++){
  const ox=LABEL+bt*CW*S,oy=TOP+row*CH*S;x.save();x.beginPath();x.rect(ox,oy,CW*S,CH*S);x.clip();x.fillStyle=bt%2?'#202735':'#1c2330';x.fillRect(ox,oy,CW*S-2,CH*S-2);x.fillStyle='#b6c3d3';x.font='13px sans-serif';x.fillText(bodyName(g,bt),ox+8,oy+16);
  const A=spSprite(cls,g,bt,f),fx=new Pix(CW*S,CH*S),anchor={x:32+A.meta.cx*3,y:8+(A.meta.torsoTop+2)*3,base:8+A.meta.base*3};
  spFx(cls,f/24,fx,anchor,true);x.drawImage(fx.canvas(),ox,oy);
  const dash=cls==='asesino'&&f>=8&&f<=15?Math.sin((f-8)/7*Math.PI)*10:0;
  if(cls==='asesino'&&f>=8&&f<=15){x.globalAlpha=.18;for(let j=1;j<=2;j++)x.drawImage(A.canvas,ox+32-j*6,oy+8-j*7,144,144);x.globalAlpha=1;}
  x.drawImage(A.canvas,ox+32,oy+8+dash,144,144);const front=new Pix(CW*S,CH*S);spFx(cls,f/24,front,anchor,false);x.drawImage(front.canvas(),ox,oy);x.restore();
 }}return c.toDataURL();}
