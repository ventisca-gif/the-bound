// Amazonian scenery from the original Selva preview, drawn on the game's Pix grid.
let SELVA_ART;
function selvaArt() {
  if (SELVA_ART) return SELVA_ART;
  const assets = {}, R = new RNG(265671);
  function asset(k,s){if(s.trunk){const c=mkCanvas(s.w,s.h),x=c.getContext('2d');x.drawImage(s.trunk,0,0);x.drawImage(s.canopy,0,0);s.c=c;}assets[k]={...s};return s;}
  for(const sp of ['caoba','ebano','roble','palma','ancestral'])for(let i=0;i<4;i++){
   const t=genTree(sp,i),g=t.canopy.getContext('2d'),im=g.getImageData(0,0,t.w,t.h),d=im.data;
   for(let n=0;n<d.length;n+=4)if(d[n+3]){const l=d[n]*.23+d[n+1]*.63+d[n+2]*.14;d[n]=Math.round(l*(.58+i*.035));d[n+1]=Math.round(l*(.90+i*.025));d[n+2]=Math.round(l*.39);}
   g.putImageData(im,0,0);asset(sp+i,t);
  }

  asset('stall',genStall('#aa653e'));
  function custom(k,w,h,fn,ax=w/2,ay=h-2){const p=new Pix(w,h);fn(p);p.outline(OUTL,false);return asset(k,{c:p.canvas(),ax,ay});}
  custom('boat',93,44,p=>{p.ell(46,32,41,9,C('#405b4d'));p.poly([[4,25],[79,25],[91,18],[81,36],[23,38]],WOOD[1]);p.poly([[9,25],[77,25],[83,21],[75,31],[24,32]],WOOD[3]);p.line(10,25,78,25,WOOD[4]);for(const x of [31,64])p.rect(x,8,2,21,WOOD[1]);p.poly([[23,9],[31,1],[67,1],[76,9]],C('#4c6d6b'));p.hl(25,9,50,C('#8aaba0'));for(let y=29;y<35;y+=3)p.hl(20,y,56,WOOD[0]);p.line(80,28,87,34,C('#343c35'));},46,36);
  // Palm-roofed wooden stilt houses with open veranda: original Pix grid, native palettes.
  for(let v=0;v<5;v++)custom('casa'+v,116,128,p=>{
   const wall=pal([['#443528','#705034','#9f7545','#bd9155','#d8b377'],['#273f37','#41644d','#628764','#83a478','#b1c697'],['#4c332c','#80523c','#b4784b','#d49961','#e5bc82'],['#30494b','#4a7470','#70a397','#a0bcb1','#c6d7c4'],['#443c29','#706044','#9d875b','#bba16c','#ddc28c']][v]),roof=pal(['#4a3b2c','#746045','#958057','#b29a68','#ceb785']);
   for(const x of [20,47,83,98]){p.rect(x,85,4,37,WOOD[1]);p.vl(x,87,35,WOOD[3]);p.ell(x+2,122,6,2,C('#263e30'));}
   p.rect(16,64,88,31,wall[2]);for(let x=17;x<104;x+=7){p.vl(x,64,31,wall[1]);p.vl(x+1,64,31,wall[3]);}
   p.poly([[8,66],[24,20],[85,17],[110,65]],roof[2]);p.poly([[24,20],[85,17],[60,3]],roof[3]);
   for(let y=20;y<64;y++){const f=(y-20)/44,l=24-16*f,r=85+25*f;for(let x=Math.round(l);x<r;x++){if(hash2(x,y,199+v)>.56)p.set(x,y,roof[hash2(x>>1,y,4)>.6?3:1]);}if(y%6===0)p.line(l,y,r,y-1,roof[1]);}
   for(let x=12;x<108;x+=3)p.vl(x,64+(x%3),3,roof[3]);
   p.rect(31,73,18,16,wall[0]);p.rect(69,70,14,25,wall[0]);p.vl(70,71,23,wall[4]);
   p.rect(10,94,99,6,WOOD[2]);for(let x=12;x<109;x+=8)p.vl(x,94,6,WOOD[4]);
   for(const x of [15,57,101])p.rect(x,81,2,16,WOOD[1]);p.hl(15,81,88,WOOD[3]);p.line(16,82,56,94,WOOD[3]);p.line(57,94,100,82,WOOD[3]);
   for(let i=0;i<5;i++){p.rect(65-i*2,101+i*4,16+i*2,3,WOOD[2]);p.hl(65-i*2,101+i*4,16+i*2,WOOD[4]);}
  });
  custom('maloca',180,145,p=>{const roof=pal(['#3d3023','#665035','#947348','#b59760','#d1b57b']);for(const x of [25,75,125,155]){p.rect(x,90,5,51,WOOD[1]);p.vl(x,91,48,WOOD[3]);}p.rect(20,112,140,7,WOOD[2]);for(let x=22;x<160;x+=7)p.vl(x,113,6,WOOD[4]);p.poly([[8,94],[90,5],[173,94]],roof[2]);p.poly([[90,5],[119,94],[173,94]],roof[1]);for(let y=10;y<94;y++){const half=(y-5)*.93;for(let x=90-half;x<90+half;x++)if(hash2(x,y,98)>.62)p.set(x|0,y,roof[x<100?3:2]);}for(let y=30;y<94;y+=8)p.hl(92-(y-5)*.93,y,(y-5)*1.86,roof[1]);p.rect(53,92,71,20,C('#3a3828'));p.line(20,95,90,19,WOOD[2]);p.line(160,95,90,19,WOOD[2]);p.rect(86,46,4,67,WOOD[2]);});
  custom('banano',70,83,p=>{const stem=pal(['#24492e','#3d6936','#609348','#91b65b']);p.rect(33,39,5,42,stem[1]);for(let i=0;i<8;i++){const a=-Math.PI+.42*i,dx=Math.cos(a)*31,dy=Math.sin(a)*21;p.poly([[35,44],[35+dx*.45,25+dy*.8],[35+dx,24+dy],[35+dx*.9,35+dy],[35,49]],stem[i%2?2:1]);p.line(35,45,35+dx,24+dy,stem[3]);}p.ell(42,56,4,7,C('#b3b74e'));});
  custom('helecho',40,26,p=>{const q=pal(['#214a31','#376c3c','#588c46','#8bb65b']);for(let k=0;k<9;k++){const a=-Math.PI+k*Math.PI/8;for(let t=0;t<15;t++){const x=20+Math.cos(a)*t,y=24+Math.sin(a)*t-2;p.set(x|0,y|0,q[2]);if(t%2){p.line(x,y,x+Math.cos(a+1.2)*4,y+Math.sin(a+1.2)*4,q[k%2?1:2]);p.line(x,y,x+Math.cos(a-1.2)*4,y+Math.sin(a-1.2)*4,q[1]);}}}});
  custom('lirio',27,19,p=>{p.ell(13,10,12,7,C('#315d3e'));p.ell(13,9,10,6,C('#719657'));p.line(13,9,24,12,C('#294c35'));p.ball(10,6,3,2,pal(['#d6beab','#eadac5','#fff0de']));});
  custom('ruina',220,170,p=>{const stone=pal(['#384e43','#5e6d55','#84916e','#a7ad88','#c8c7a1']);p.poly([[10,151],[31,92],[183,92],[210,151]],stone[0]);p.rect(24,91,167,57,stone[2]);for(let y=95;y<148;y+=7)for(let x=26;x<189;x+=11){p.hl(x+(y%14?5:0),y,10,stone[1]);p.vl(x+(y%14?5:0),y,6,stone[1]);}for(const [x,y]of [[52,82],[120,63],[169,97]]){p.ell(x,y,24,8,stone[1]);p.rect(x-24,y-38,48,39,stone[2]);p.ell(x,y-38,24,8,stone[3]);for(let yy=y-31;yy<y;yy+=7){p.hl(x-22,yy,44,stone[1]);for(let xx=x-21;xx<x+22;xx+=9)p.vl(xx,yy,7,stone[1]);}p.poly([[x-29,y-39],[x,y-83],[x+29,y-39]],C('#807756'));p.rect(x-5,y-23,10,21,C('#283e34'));}for(let i=0;i<7;i++){p.rect(82-i*3,147+i*3,34+i*6,3,stone[i%2?1:3]);}for(let i=0;i<80;i++){const x=R.int(26,187),y=R.int(96,143);p.hl(x,y,3,C('#667f47'));}},110,166);
  custom('guacamayo',26,24,p=>{p.ball(13,13,4,7,pal(['#682827','#a93d32','#d55b3d','#ed9254']));p.poly([[10,12],[3,20],[10,19]],C('#3d6a8f'));p.poly([[16,13],[23,21],[16,19]],C('#547b8c'));p.line(12,17,9,23,C('#bd5739'));p.line(15,17,18,23,C('#bd5739'));p.ball(14,5,4,4,pal(['#6c322d','#b54c37','#e2774c']));p.rect(16,4,4,4,C('#ded2ad'));p.set(17,4,C('#202e28'));});
  custom('jaguar',45,31,p=>{const fur=pal(['#5e472b','#967944','#bc9a55','#d3b76b','#e2cf91']);p.ball(23,17,14,7,fur);for(const x of [13,31])p.rect(x,18,5,11,fur[1]);p.ball(10,12,8,7,fur);p.ball(5,8,3,3,fur);p.ball(14,7,3,3,fur);p.rect(3,14,8,4,fur[3]);p.set(5,11,C('#202b23'));p.set(3,15,C('#202b23'));for(let i=0;i<15;i++){const x=R.int(12,34),y=R.int(12,20);p.ell(x,y,2,1,C('#55422d'));p.set(x,y,fur[2]);}p.line(35,17,42,10,fur[2]);p.line(42,10,40,4,fur[1]);});
  return SELVA_ART = assets;
}
{ const previous = objSprite; objSprite = function (o) {
  if (o.k !== 'selva') return previous.apply(this, arguments);
  const source = selvaArt()[o.selvaArt], scale = o.selvaScale;
  if (scale === 1) return source;
  return spr('selva:' + o.selvaArt + ':' + scale, () => {
    const c = mkCanvas(Math.ceil(source.c.width * scale), Math.ceil(source.c.height * scale));
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(source.c, 0, 0, c.width, c.height);
    return { c, ax: source.ax * scale, ay: source.ay * scale };
  });
}; }
