/* Larger aura proposals. The final engine sprite remains untouched, composited above all VFX. */
const COS_AURA_FX=(()=>{
 const THEMES={
 violeta:{name:'Energía violeta',subtitle:'Llamas de energía, pulsos y chispas',color:'#bc80ff'},
 tormenta:{name:'Tormenta celeste',subtitle:'Rayos vivos y descargas que rodean el cuerpo',color:'#71eaff'},
 solar:{name:'Corona solar',subtitle:'Fuego dorado y una corona de rayos',color:'#ffd56b'},
 astral:{name:'Órbitas astrales',subtitle:'Anillos cruzados, satélites y constelaciones',color:'#9eeeff'},
 eclipse:{name:'Eclipse fracturado',subtitle:'Media luna y fragmentos dimensionales',color:'#caa3ff'},
 jardin:{name:'Jardín espectral',subtitle:'Pétalos de luz y mariposas flotantes',color:'#8fffd6'}
 };
 const W=192,H=176,PADX=48,PADY=32,CACHE=new Map(),TAU=Math.PI*2;
 const make=(w,h)=>mkCanvas(w,h);
 function maskOf(sprite,key){if(CACHE.has(key)){const r=CACHE.get(key);CACHE.delete(key);CACHE.set(key,r);return r;}
  const a=sprite.getContext('2d').getImageData(0,0,96,96).data;let minX=96,maxX=0,minY=96,maxY=0;const rows=Array.from({length:96},()=>[96,-1]);
  for(let y=0;y<96;y++)for(let x=0;x<96;x++)if(a[(y*96+x)*4+3]>100){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);rows[y][0]=Math.min(rows[y][0],x);rows[y][1]=Math.max(rows[y][1],x);}
  const r={minX:minX+PADX,maxX:maxX+PADX,minY:minY+PADY,maxY:maxY+PADY,cx:(minX+maxX)/2+PADX,rows,bodyW:maxX-minX+1,bodyH:maxY-minY+1};CACHE.set(key,r);if(CACHE.size>80)CACHE.delete(CACHE.keys().next().value);return r;
 }
 const poly=(x,pts,col)=>{x.fillStyle=col;x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.fill();};
 const line=(x,pts,col,w=1)=>{x.strokeStyle=col;x.lineWidth=w;x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();};
 const star=(x,cx,cy,c,s=2)=>{x.fillStyle=c;x.fillRect(cx-s,cy-1,s*2+1,2);x.fillRect(cx-1,cy-s,2,s*2+1);x.fillStyle='#faffff';x.fillRect(cx,cy,1,1);};
 const orbit=(x,cx,cy,rx,ry,rot,col,width=2,phase=0,broken=false)=>{let pts=[];for(let i=0;i<=64;i++){const a=i/64*TAU+phase,px=Math.cos(a)*rx,py=Math.sin(a)*ry;if(broken&&i%12>8){if(pts.length>1)line(x,pts,col,width);pts=[];continue;}pts.push([cx+px*Math.cos(rot)-py*Math.sin(rot),cy+px*Math.sin(rot)+py*Math.cos(rot)]);}if(pts.length>1)line(x,pts,col,width);};
 function flame(x,M,t,w,h,colors){const cx=M.cx,base=M.maxY+3,top=base-h,points=[[cx-w*.50,base],[cx-w*.80,base-h*.13],[cx-w*.63,base-h*.29],[cx-w*.91,base-h*.43],[cx-w*.62,base-h*.48],[cx-w*.75,base-h*.70],[cx-w*.39,base-h*.61],[cx-w*.34,base-h*.84],[cx-w*.15,base-h*.77],[cx,top],[cx+w*.16,base-h*.77],[cx+w*.43,base-h*.90],[cx+w*.40,base-h*.64],[cx+w*.71,base-h*.73],[cx+w*.63,base-h*.46],[cx+w*.85,base-h*.50],[cx+w*.67,base-h*.28],[cx+w*.81,base-h*.13],[cx+w*.46,base]];
  for(let band=0;band<3;band++){const scale=1-band*.13,pts=points.map(([xx,yy],i)=>[Math.round(cx+(xx-cx)*scale+Math.sin(t*4+i*1.65)*((i%3)+1)),Math.round(base+(yy-base)*(1-band*.08)+Math.cos(t*5+i*1.1)*2)]);poly(x,pts,colors[band]);}
  for(let side of [-1,1])for(let k=0;k<3;k++){const p=(t*.46+k*.31)%1,yy=base-p*h*.86,xx=cx+side*w*(.39+.17*Math.sin(p*5+k));line(x,[[xx,yy+7],[xx+side*3,yy+1],[xx-side*2,yy-8],[xx+side*1,yy-14]],colors[3],1.5);}
 }
 function sparks(x,M,t,color,count=15,spread=40){for(let i=0;i<count;i++){const p=(t*(.25+i%3*.025)+i*.167)%1,side=i%2?-1:1,xx=M.cx+side*(12+(i*7)%spread)+Math.sin(p*8+i)*3,yy=M.maxY+3-p*(M.bodyH+33);x.fillStyle=color;x.fillRect(Math.round(xx),Math.round(yy),i%4===0?2:1,i%3===0?3:2);}}
 function draw(sprite,key,kind,time,opts={}){const c=opts.target||make(W,H),x=c.getContext('2d'),M=maskOf(sprite,key);x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,W,H);x.imageSmoothingEnabled=false;const T=THEMES[kind];if(T){const fx=opts.fx||make(W/2,H/2),g=fx.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,W/2,H/2);g.scale(.5,.5);g.imageSmoothingEnabled=false;g.lineJoin='miter';g.lineCap='square';g.globalAlpha=Math.min(1,opts.strength??1);
  const cx=M.cx,base=M.maxY+3,cy=(M.minY+M.maxY)/2,w=Math.min(50,Math.max(35,M.bodyW*.66+12)),h=Math.min(116,M.bodyH+34),pulse=1+.035*Math.sin(time*4);
  if(kind==='violeta'){flame(g,M,time,w*pulse,h,['rgba(102,42,175,.17)','rgba(132,65,225,.25)','rgba(181,106,255,.22)','rgba(226,171,255,.88)']);orbit(g,cx,base,w*.71,5,0,'#b071f0',2);sparks(g,M,time,'#e2baff',19,34);for(let i=0;i<4;i++){const p=(time*.25+i*.23)%1,xx=cx+(i%2?1:-1)*(w*.72+Math.sin(p*7)*4),yy=base-p*h;poly(g,[[xx,yy-3],[xx+2,yy],[xx,yy+3],[xx-2,yy]],'#c49aff');}}
  if(kind==='tormenta'){flame(g,M,time,w*.90,h,['rgba(20,72,148,.13)','rgba(28,139,217,.13)','rgba(82,207,255,.11)','rgba(173,249,255,.67)']);for(let side of [-1,1])for(let k=0;k<2;k++){const xx=cx+side*(w*.63+k*5),j=Math.sin(Math.floor(time*10)+k*3)*5,yy=base-6;const pts=[[xx-side*4,yy],[xx+side*3,yy-14],[xx-side*4+j,yy-27],[xx+side*7,yy-43],[xx-side*3,yy-59],[xx+side*5+j,yy-75],[xx-side*7,yy-h+8]];line(g,pts,'rgba(39,134,255,.38)',6);line(g,pts,'#80efff',2.5);line(g,pts,'#e2fdff',1);}orbit(g,cx,base,w*.8,5,0,'#5cbbfa',1.5,time,true);sparks(g,M,time,'#aaf6ff',9,39);}
  if(kind==='solar'){flame(g,M,time,w*1.05,h,['rgba(209,67,16,.15)','rgba(255,137,30,.25)','rgba(255,220,91,.22)','rgba(255,239,160,.92)']);const yy=M.minY-10;orbit(g,cx,yy,13,13,0,'#ffd46b',2);for(let i=0;i<12;i++){const a=i/12*TAU+time*.23,r=17;line(g,[[cx+Math.cos(a)*r,yy+Math.sin(a)*r],[cx+Math.cos(a)*(r+4+(i%2)*3),yy+Math.sin(a)*(r+4+(i%2)*3)]],'#ffe397',1.5);}orbit(g,cx,base,w*.70,5,0,'#f7b246',2);sparks(g,M,time,'#fff2b5',21,37);}
  if(kind==='astral'){const ry=Math.max(22,M.bodyH*.4),rx=Math.max(38,M.bodyW*.75+13);for(const [rot,col,a]of [[-.65,'#66dbed',0],[.65,'#b692fc',1],[0,'#83c4fc',2]]){orbit(g,cx,cy+2,rx,ry*.42,rot,col,2,time*.5+a);const p=time*(a%2?-1:1)+a*2,xx=cx+Math.cos(p)*rx*Math.cos(rot)-Math.sin(p)*ry*.42*Math.sin(rot),yy=cy+2+Math.cos(p)*rx*Math.sin(rot)+Math.sin(p)*ry*.42*Math.cos(rot);poly(g,[[xx,yy-4],[xx+4,yy],[xx,yy+4],[xx-4,yy]],a===1?'#dfbfff':'#a1f8ff');}for(let i=0;i<5;i++){const a=time*.14+i/5*TAU,xx=cx+Math.cos(a)*(rx+7),yy=cy+Math.sin(a)*(ry+12);star(g,xx,yy,'#c7dfff',2);}orbit(g,cx,base,26,6,0,'rgba(127,156,235,.6)',1.5);}
  if(kind==='eclipse'){const yy=M.minY-10,r=17;g.fillStyle='rgba(59,35,103,.24)';g.beginPath();g.arc(cx,yy,r+5,0,TAU);g.fill();g.fillStyle='#a589eb';g.beginPath();g.arc(cx,yy,r,0,TAU);g.fill();g.fillStyle='#211730';g.beginPath();g.arc(cx+6,yy-4,r-2,0,TAU);g.fill();orbit(g,cx,cy,w,M.bodyH*.60,-.18,'#9b7ad5',1.5,time,true);for(let i=0;i<9;i++){const a=i/9*TAU+time*.24,xx=cx+Math.cos(a)*(w+2),yy=cy+Math.sin(a)*(M.bodyH*.65),q=3+(i%3);poly(g,[[xx-2,yy-q],[xx+q,yy],[xx,yy+q+2],[xx-3,yy+1]],i%2?'#8274bb':'#baa2ec');line(g,[[xx-1,yy-q+1],[xx+q-1,yy]],'#e7ccff',1);if(i%3===0)line(g,[[xx,yy+q+4],[xx+3,yy+q+7],[xx-1,yy+q+10]],'#7967b4');}sparks(g,M,time,'#c7a9ec',9,40);}
  if(kind==='jardin'){const spread=Math.max(31,M.bodyW*.60+12);for(let i=0;i<7;i++){const a=Math.PI+i/6*Math.PI,xx=cx+Math.cos(a)*spread,yy=base+Math.sin(a)*12;poly(g,[[cx,base],[xx-8,yy-15],[xx,yy-26],[xx+8,yy-15]],'rgba(70,198,164,.22)');line(g,[[cx,base],[xx,yy-24],[xx+5,yy-13]],'#6fdab6',1.5);}for(let side of [-1,1]){const pts=[];for(let k=0;k<20;k++){const p=k/19;pts.push([cx+side*(spread+Math.sin(p*6+time)*5),base-p*(M.bodyH+13)]);}line(g,pts,'rgba(99,220,176,.65)',1.4);}for(let i=0;i<5;i++){const p=(time*.18+i*.19)%1,xx=cx+(i%2?1:-1)*(spread+Math.sin(time+i*3)*6),yy=base-p*(M.bodyH+28),flap=2+Math.floor(Math.sin(time*7+i)*2);poly(g,[[xx-1,yy],[xx-flap-3,yy-4],[xx-flap-4,yy+1],[xx-2,yy+3]],'#88e9da');poly(g,[[xx+1,yy],[xx+flap+3,yy-4],[xx+flap+4,yy+1],[xx+2,yy+3]],i%2?'#efb5ed':'#b8fbde');g.fillStyle='#f2f8db';g.fillRect(xx,yy-1,1,4);}sparks(g,M,time,'#bbffdf',12,31);}
  x.drawImage(fx,0,0,W,H);
 }
 if(!opts.effectOnly)x.drawImage(sprite,PADX,PADY);
 if(opts.contour){const a=sprite.getContext('2d').getImageData(0,0,96,96).data;x.fillStyle='#efffa0';for(let yy=1;yy<95;yy++)for(let xx=1;xx<95;xx++){const i=yy*96+xx;if(a[i*4+3]>128)continue;if([i-1,i+1,i-96,i+96].some(k=>a[k*4+3]>128))x.fillRect(PADX+xx,PADY+yy,1,1);}}
 return c;
 }
 return {themes:THEMES,draw,maskOf,width:W,height:H,padX:PADX,padY:PADY,cache:CACHE};
})();
