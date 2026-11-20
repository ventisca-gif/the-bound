// v5.62 · Dawn / Foosha. Native, seeded map; travel remains deliberately closed.
const DAWN_TRAVEL_OPEN = false;
let DAWN_TERRAIN=null;
function dawnTerrain(){if(DAWN_TERRAIN)return DAWN_TERRAIN;const out={};for(const k of ['field','pathField','grassNoise','terrain']){const raw=atob(DAWN_BAKED[k]),u=Uint8Array.from(raw,v=>v.charCodeAt(0));out[k]=k==='terrain'?u:k==='grassNoise'?Float32Array.from(u,v=>v/255):Float32Array.from(new Int16Array(u.buffer),v=>v/32);}return DAWN_TERRAIN=out;}
let DAWN_ASSETS = null;
function dawnAssets(){if(DAWN_ASSETS)return DAWN_ASSETS;const assets={};
const addAsset=(key,s)=>{if(s.trunk){const c=mkCanvas(s.w,s.h),g=c.getContext('2d');g.drawImage(s.trunk,0,0);g.drawImage(s.canopy,0,0);s.c=c;}assets[key]=s;return key;};
for(const sp of ['palma','roble','ebano'])for(let i=0;i<4;i++)addAsset(sp+i,genTree(sp,i));
for(let i=0;i<4;i++)addAsset('rock'+i,genRock(i%2?'m':'l',i,'normal'));
for(let i=0;i<24;i++)addAsset('house'+i,genBuilding({w:5+i%3,h:5,wallH:40,style:i%3?'albor':'puerto',roof:['red','brown','green','thatch'][i%4],gable:1,box:true,chimney:i%4===0,sign:i%5===0?'inn':i%5===1?'store':null,awning:i%3===0?'#a83432':null,v:i}));
addAsset('boat',genBoat());addAsset('lighthouse',genLighthouse(0));addAsset('castle',genCastle());addAsset('barrel',genBarrel());addAsset('crate',genCrate());addAsset('stall',genStall('#a74232'));
function custom(key,w,h,fn,ax=w/2,ay=h-2){const p=new Pix(w,h);fn(p);p.outline(OUTL);return addAsset(key,{c:p.canvas(),ax,ay});}
custom('windmill',140,186,p=>{
 const wall=pal(['#826a65','#af9284','#d4b6a0','#e9d0b3','#f5dfbd']);
 for(let y=60;y<178;y++){const half=27+(y-60)*.035;for(let x=70-half;x<70+half;x++){const v=x<52?3:x<68?4:x<88?2:1;p.set(x|0,y,wall[y%22===0?1:v]);}}
 for(let y=60;y<178;y+=25)p.hl(43,y,54,C('#b29b8a'));
 for(let y=0;y<42;y++){const half=y/42*34;for(let x=70-half;x<70+half;x++)p.set(x|0,26+y,x<70?C('#698b70'):C('#476856'));}
 p.hl(35,68,70,WOOD[1]);p.rect(35,111,70,5,WOOD[2]);p.hl(35,111,70,WOOD[4]);
 for(let x=37;x<105;x+=7)p.vl(x,98,16,WOOD[1]);p.hl(35,98,70,WOOD[3]);
 drawDoor(p,70,178,14,24);drawWindow(p,62,124,13,14);drawWindow(p,63,76,12,14);
 const cx=70,cy=71;
 for(let k=0;k<4;k++){const a=-Math.PI/3+k*Math.PI/2,cs=Math.cos(a),sn=Math.sin(a),pts=[[9,-3],[68,-3],[68,9],[9,7]].map(([u,v])=>[cx+cs*u-sn*v,cy+sn*u+cs*v]);p.poly(pts,C('#f1efcf'));for(let j=12;j<69;j+=8)p.line(cx+cs*j+sn*3,cy+sn*j-cs*3,cx+cs*j-sn*9,cy+sn*j+cs*9,WOOD[3]);p.line(cx+cs*8+sn*3,cy+sn*8-cs*3,cx+cs*69+sn*3,cy+sn*69-cs*3,WOOD[1]);p.line(cx+cs*8-sn*9,cy+sn*8+cs*9,cx+cs*69-sn*9,cy+sn*69+cs*9,WOOD[2]);}
 p.ball(cx,cy,5,5,WOOD);p.rect(40,177,61,6,STONEW[2]);
});
addAsset('bar',genBuilding({w:10,h:6,extra:24,wallH:68,style:'albor',roof:'red',gable:false,box:true,sign:'inn',awning:'#a84136',big:true,v:91}));
const barG=assets.bar.c.getContext('2d');barG.fillStyle='#efe0b8';barG.fillRect(40,62,89,13);barG.fillStyle='#6c3027';barG.font='9px monospace';barG.fillText("PARTYS BAR",46,72);
addAsset('fenceH',genFence('h'));addAsset('fenceV',genFence('v'));
custom('galleon',230,190,p=>{p.poly([[12,133],[207,133],[228,115],[214,160],[185,181],[42,181]],WOOD[2]);for(let y=139;y<179;y+=6){p.hl(35,y,162,WOOD[0]);p.hl(35,y+1,162,WOOD[4]);}p.rect(22,111,55,28,WOOD[3]);p.rect(29,103,43,8,WOOD[4]);for(let k=0;k<9;k++)p.ball(48+k*17,156,3,3,IRON);for(const [x,top]of [[89,20],[155,2]]){p.rect(x,top,4,133-top,WOOD[3]);p.poly([[x+6,top+12],[x+60,top+17],[x+58,top+86],[x+7,top+82]],C('#f3e7cc'));p.vl(x+10,top+16,63,C('#d4c5a7'));for(let y=top+27;y<top+81;y+=16)p.hl(x+8,y,49,C('#dbceb2'));p.line(x+2,top,218,134,C('#bda775'));p.line(x+2,top,15,134,C('#bda775'));}p.ell(179,48,10,9,C('#292733'));p.ell(175,47,2,3,C('#f3e7cc'));p.ell(183,47,2,3,C('#f3e7cc'));p.rect(175,55,10,3,C('#292733'));p.line(168,60,190,69,C('#292733'));p.line(190,60,168,69,C('#292733'));p.rect(154,2,28,12,C('#252633'));p.ell(168,7,4,3,C('#eee0bd'));p.hl(14,131,199,GOLD[3]);});
const fort=assets.castle.c.getContext('2d'),fortImage=fort.getImageData(0,0,400,270),fortBuf=new Uint32Array(fortImage.data.buffer),recolor=new Map(pal(['#2c2e38','#43465a','#5c6074','#777c90','#9498aa','#b8bccc','#8a1626','#a01a2a']).map((c,i)=>[c,pal(['#46556a','#6e8393','#9bafb8','#c1ced0','#dce5df','#f3f2dd','#1a5f8a','#246e9b'])[i]]));for(let i=0;i<fortBuf.length;i++)if(recolor.has(fortBuf[i]))fortBuf[i]=recolor.get(fortBuf[i]);fort.putImageData(fortImage,0,0);

addAsset('cave',genMineEntrance());
return assets;
}
function dawnSprite(key,scale=1){const assets=DAWN_ASSETS||(DAWN_ASSETS=dawnAssets()),src=assets[key];if(!src)return null;if(scale===1)return src;return spr('dawn:'+key+':'+scale,()=>{const c=mkCanvas(Math.ceil(src.c.width*scale),Math.ceil(src.c.height*scale)),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(src.c,0,0,c.width,c.height);return {c,ax:src.ax*scale,ay:src.ay*scale};});}
{const old=objSprite;objSprite=function(o){return o.k==='dawn'?dawnSprite(o.dawnKey,o.dawnScale):old.apply(this,arguments);};}
function makeDawn(){if(G.maps.dawn)return G.maps.dawn;
 const W=720,H=360,w=W,h=H,N=W*H,R=new RNG(107321),objects=[],obj=(key,x,y,scale=1)=>objects.push({key,x:x*16,y:y*16,scale});
const shapes=[[368,179,242,130],[473,135,154,96],[245,137,126,87]];
const sd=(x,y)=>{let d=-999;for(const [cx,cy,rx,ry]of shapes)d=Math.max(d,(1-Math.hypot((x-cx)/rx,(y-cy)/ry))*Math.min(rx,ry));d+=Math.sin(x*.063+y*.051)*1.6+Math.sin(x*.18-y*.13)*.5;const foosha=31-Math.hypot((x-531)*.9,(y-292)*1.1),cove=23-Math.hypot((x-330)*1.2,(y-309)*1.4);return Math.min(d,-foosha,-cove);};
const {field,grassNoise,terrain,pathField}=dawnTerrain();const paths=[];
function route(points,width=3,type=3){paths.push({points,width,type});}
route([[521,264],[521,251],[512,241],[502,237],[489,225],[464,214],[435,200],[414,181],[393,166],[364,165],[341,155],[306,155],[287,151],[269,145],[244,145]],2.4);
route([[514,242],[526,239],[544,243],[556,248]],2.1);
route([[500,237],[492,251],[478,255]],1.7);
route([[393,166],[389,146],[372,139],[365,129]],1.9);
route([[341,155],[326,175],[332,209],[330,253],[330,286]],2);
const segdist=(x,y,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],t=clamp(((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy),0,1);return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);};
// Forests, with clear roads, settlement buffers and shoreline variation.
const towns=[[521,247,47,29],[245,135,33,26],[293,155,21,19],[365,139,13,10]];
for(let k=0;k<10000;k++){const x=R.range(110,650),y=R.range(35,319),i=(y|0)*W+(x|0);if(terrain[i]!==1||sd(x,y)<8||towns.some(([cx,cy,rx,ry])=>Math.abs(x-cx)<rx&&Math.abs(y-cy)<ry))continue;if(x>445&&y>200&&R.f()<.88)continue;const near=pathField[(y|0)*(W+1)+(x|0)]<2.5;if(near)continue;obj((R.f()<.7?'roble':'ebano')+(k%4),x,y);}
for(let k=0;k<34;k++){const x=490+k*1.8,y=259+(k%4)*1.4;if(sd(x,y)>1&&sd(x,y)<13&&Math.abs(x-522)>4)obj('palma'+k%4,x,y);}
for(let k=0;k<140;k++){const x=R.range(120,650),y=R.range(36,317);if(sd(x,y)>1&&sd(x,y)<4)obj('rock'+k%4,x,y);}
// Foosha sits directly above the bay; the fields and mills form its outskirts.
for(const [x,y,n]of [[501,241,0],[514,235,1],[528,235,2],[543,239,3],[555,248,4],[540,253,5],[510,251,6],[496,254,7],[482,247,8],[486,231,9],[550,227,10]])obj('house'+n,x,y);
obj('bar',526,249);obj('windmill',502,229,1.2);obj('windmill',542,229,1.1);obj('windmill',481,239,.8);
for(const [x,y,n]of [[229,125,12],[244,125,13],[259,125,14],[229,141,15],[259,141,16]])obj('house'+n,x,y);
obj('castle',245,133,1.1);obj('house17',365,139);
// Open pasture fences, with gaps where the footpaths cross.
for(let x=477;x<492;x++)obj('fenceH',x,258);for(let y=244;y<258;y++)obj('fenceV',477,y);
for(let x=530;x<548;x++)obj('fenceH',x,222);for(let y=218;y<223;y++)obj('fenceV',548,y);
for(let x=492;x<509;x++)if(x<500||x>504)obj('fenceH',x,233);
for(let x=487;x<499;x++)obj('fenceH',x,224);
for(let k=0;k<6;k++){obj('barrel',519+k*.65,268+k%2);obj('crate',535+k*.65,273+k%2);}
obj('stall',515,245);obj('boat',515,280);obj('boat',545,280);obj('galleon',535,289,1.1);obj('galleon',334,298,.85);
// Gray Terminal is represented as a scrapyard, rather than a second military town.
for(let k=0;k<80;k++){const x=286+R.range(-10,10),y=155+R.range(-8,8);obj(k%2?'crate':'barrel',x,y);}
obj('cave',410,119,1.4);
const pois=[{name:'Villa Foosha',x:523,y:250,desc:'Pueblo junto al agua, molinos y campos con cercas.'},{name:'Partys Bar · Makino',x:526,y:249,desc:'La taberna y el camino que baja al pequeño puerto.'},{name:'Monte Colubo',x:393,y:136,desc:'Montaña y bosque detrás de los campos.'},{name:'Casa de Dadan',x:365,y:143,desc:'Cabaña entre el bosque y el sendero.'},{name:'Reino de Goa',x:245,y:146,desc:'Capital y palacio, en una disposición adaptada al juego.'},{name:'Gray Terminal',x:289,y:159,desc:'Zona de desechos a las afueras de la capital.'}];

 const M={id:'dawn',w,h,I:(x,y)=>y*w+x,ter:new Uint8Array(N),lvl:new Uint8Array(N),reg:new Uint8Array(N),flags:new Uint8Array(N),isWorld:false,chunks:new Map(),dark:0,music:'town',camps:[],bossAt:[],halos:[],temples:[],dawn:1,exit:{x:-9,y:-9},port:[522,267],dawnData:{field,pathField,grassNoise,terrain,pois}};
 for(let i=0;i<N;i++)M.ter[i]=terrain[i]===6?T.BRIDGE:terrain[i]===0?T.DEEP:terrain[i]===7?T.IWALL:terrain[i]===2?T.SAND:terrain[i]===3?T.DIRT:terrain[i]===5?T.STONE:T.GRASS;
 prepPalettes(M);initMapObjs(M);
 for(const o of objects){const tx=Math.floor(o.x/16),ty=Math.floor(o.y/16);if(/^(roble|ebano|palma)[0-3]$/.test(o.key)){addObj(M,'tree',tx,ty,{sp:o.key.slice(0,-1),v:+o.key.slice(-1),px:o.x,py:o.y});continue;}
  const building=o.key.startsWith('house')||['bar','castle','windmill'].includes(o.key),fp=[];
  if(building){const wide=o.key==='bar'?10:o.key==='castle'?24:o.key==='windmill'?4:5;for(let y=-2;y<=0;y++)for(let x=-Math.floor(wide/2);x<Math.ceil(wide/2);x++)if(!(x===0&&y===0))fp.push([x,y]);}
  else if(!['boat','galleon'].includes(o.key))fp.push([0,0]);
  addObj(M,'dawn',tx,ty,{dawnKey:o.key,dawnScale:o.scale,px:o.x,py:o.y,fp,solid:fp.length>0});
 }
 for(const [x,y]of [[464,213],[451,207],[439,200],[426,191],[477,223],[561,242],[570,250],[334,276]]){const at=freePxNear(M,x*16+8,y*16+8,8);if(at)M.camps.push({x:Math.floor(at[0]/16),y:Math.floor(at[1]/16),mob:'dawn_pirata',lv:500,n:3,alive:[],dead:[],noElite:true});}
 M.npcDefs=DAWN_PLACEMENTS.map(([id,x,y,face])=>({id,x,y,face:face||'down'}));
 G.maps.dawn=M;return M;
}
function dawnPaint(M,cx,cy){const {field,pathField,grassNoise,terrain}=M.dawnData,W=M.w,H=M.h,ox=cx*CHP,oy=cy*CHP,c=mkCanvas(CHP,CHP),g=c.getContext('2d'),im=g.createImageData(CHP,CHP),buf=new Uint32Array(im.data.buffer);
const texPal={sand:pal(['#b29259','#c6ab71','#dfc58d','#ead6a7','#f6e6be']),dirt:pal(['#ccb98e','#deceaa','#e9dbb9','#f0e4c6','#f7edd3']),stone:pal(['#6d797c','#85918e','#9ea8a0','#bdc4b5','#d1d2be']),rock:pal(['#4c5046','#626c57','#858b6a','#a7ab80','#c7c69a']),plank:WOOD};
const softGrass=pal(['#93c968','#a3d777','#b0de82','#bae68d']);
 for(let yy=0;yy<CHP;yy++)for(let xx=0;xx<CHP;xx++){const px=ox+xx,py=oy+yy,tx=clamp(px>>4,0,W-1),ty=clamp(py>>4,0,H-1),fx=(px&15)/16,fy=(py&15)/16,fi=ty*(W+1)+tx,d=lerp(lerp(field[fi],field[fi+1],fx),lerp(field[fi+W+1],field[fi+W+2],fx),fy),idx=ty*W+tx,t=terrain[idx],ti=(py%128)*128+px%128;let col;
 if(t===6)col=texPal.plank[TEX.plank[ti]];
 else if(t===7)col=texPal.rock[TEX.rock[ti]];
 else if(t===4)col=C((py+px)%31<2?'#91d9d6':'#318f9c');
 else if(d<0){col=C(d>-.22?'#d1e9c3':d>-2?'#6ec6b3':d>-5?'#75c8c7':d>-11?'#55afbc':d>-23?'#388fae':'#347ca4');if(d<-3&&((py+Math.floor(Math.sin(px*.03)*3))%85===0)&&hash2(px>>4,py>>5,7)>.7)col=C('#5b9eaa');}
 else if(d<5){col=texPal.sand[TEX.sand[ti]];}
 else if(lerp(lerp(pathField[fi],pathField[fi+1],fx),lerp(pathField[fi+W+1],pathField[fi+W+2],fx),fy)<(hash2(px>>2,py>>2,66)-.5)*.2)col=texPal.dirt[2+(hash2(px>>2,py>>2,4)>.87?1:0)-(hash2(px>>3,py>>3,7)<.08?1:0)];
 else if(t===5)col=texPal.stone[TEX.stone[ti]];
 else{const n=lerp(lerp(grassNoise[fi],grassNoise[fi+1],fx),lerp(grassNoise[fi+W+1],grassNoise[fi+W+2],fx),fy),v=n<.39?0:n<.49?1:n<.59?2:3;col=softGrass[v];if(hash2(px>>2,py>>2,78)>.985)col=softGrass[Math.max(0,v-1)];}buf[yy*CHP+xx]=col;}

 g.putImageData(im,0,0);return c;
}
{const old=renderChunk;renderChunk=function(M,cx,cy){return M?.dawn?dawnPaint(M,cx,cy):old.apply(this,arguments);};}
