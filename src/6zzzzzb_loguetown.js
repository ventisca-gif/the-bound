// Loguetown: first pass is the walkable island, without chapter battles or rewards.
// Kept inside the existing Dawn Sea bounds, east of Rare Animals and north of Conomi.
const LOGUE_X=1424, LOGUE_Y=416, LOGUE_W=208, LOGUE_H=256;
const logueAt=(x,y)=>[LOGUE_X+x,LOGUE_Y+y];
const LOGUE_PIER=logueAt(104,230),LOGUE_MOOR=logueAt(104,237);
const LOGUE_PLAZA=logueAt(104,112),LOGUE_GATE=logueAt(104,196);
const LOGUE_PLACES=[
 [LOGUE_PIER,L2('Loguetown · Puerto','Loguetown · Harbor')],
 [LOGUE_GATE,L2('Arco de Loguetown','Loguetown arch')],
 [LOGUE_PLAZA,L2('Plaza de ejecución de Roger','Roger’s execution square')],
 [logueAt(74,163),L2('Armería de Ipponmatsu','Ipponmatsu’s arms shop')],
 [logueAt(133,163),L2('Distrito comercial','Shopping district')],
 [logueAt(146,69),L2('Base de la Marina','Marine base')],
 [logueAt(51,105),L2('Torre del reloj','Clock tower')]
];
function logueTile(x,y){
 if(x<0||y<0||x>=LOGUE_W||y>=LOGUE_H)return '';
 if(Math.abs(x-104)<=3&&y>=215&&y<=232)return 'dock';
 const d=1-Math.hypot((x-104)/91,(y-128)/99);
 if(d<0)return '';
 if(d<.045)return 'sand';
 if(d<.10)return 'quay';
 if(y>=207&&y<=217&&x>=61&&x<=147)return 'quay';
 if(Math.abs(x-104)<=22&&y>=99&&y<=130)return 'plaza';
 if(Math.abs(x-104)<=6&&y>=126)return 'avenue';
 if((Math.abs(y-81)<=3||Math.abs(y-139)<=3||Math.abs(y-179)<=3)&&x>=34&&x<=174)return 'street';
 if((Math.abs(x-63)<=3||Math.abs(x-146)<=3)&&y>=58&&y<=207)return 'street';
 if(y<56||x<32||x>177)return 'garden';
 return 'stone';
}
const LOGUE_TERRAIN={dock:T.BRIDGE,sand:T.SAND,quay:T.COBBLE,plaza:T.COBBLE,avenue:T.COBBLE,street:T.COBBLE,garden:T.GRASS,stone:T.COBBLE};
const LOGUE_COLORS={dock:'#ba8e60',sand:'#e6d5a5',quay:'#9caeac',plaza:'#d7d7cc',avenue:'#c8ccc4',street:'#b7c3be',garden:'#83aa6a',stone:'#bfc8c0'};

// Native Pix architecture, cached by kind/style; no full-island bitmap per frame.
function logueSprite(o){return spr('logue:'+o.part+':'+(o.style||0),()=>{
 const part=o.part,v=o.style||0;
 const w=part==='gate'?240:part==='hall'?350:part==='tower'?96:part==='scaffold'?142:120+(Math.floor(v/4)%2)*16;
 const h=part==='tower'?232:part==='hall'?194:part==='gate'?116:part==='scaffold'?142:138+(v%3)*16;
 const p=new Pix(w,h),iv=pal(['#7b8785','#a6b5af','#c8d0c5','#e7e7d8','#f4f1df']);
 const roofs=[['#284d69','#3a718d','#5694a6'],['#70444c','#9b6268','#bc8a86'],['#46665b','#68907d','#8ab09a'],['#8a6047','#b78658','#d3aa74']][v%4].map(c=>C(c));
 const text=[];
 if(part==='gate'){
  for(const x of [6,w-24]){p.rect(x,38,18,78,iv[1]);p.rect(x-3,103,24,13,iv[3]);p.rect(x-3,36,24,8,iv[4]);}
  p.poly([[0,38],[120,2],[239,38],[239,62],[120,26],[0,62]],C('#704b3f'));
  p.line(0,40,120,5,C('#d6ae74'));p.line(120,5,239,40,C('#d6ae74'));
  for(let x=24;x<224;x+=13)p.ell(x,38-Math.floor((1-Math.abs(x-120)/120)*19),4,3,C('#b68d56'));
  p.rect(62,16,116,29,C('#4f5140'));p.rect(65,19,110,23,C('#987e50'));
  text.push(['Loguetown',72,36,16,'#f8edce']);
 }else if(part==='scaffold'){
  const iron=pal(['#354d55','#56717a','#82989a','#b8c3ba']);
  for(const x of [26,102]){p.rect(x,33,6,105,iron[0]);p.vl(x+1,34,104,iron[2]);}
  for(let y=50;y<131;y+=27){p.line(30,y,104,y+26,iron[1]);p.line(104,y,30,y+26,iron[2]);p.hl(27,y,81,iron[0]);}
  p.rect(13,30,112,7,WOOD[1]);p.hl(13,29,112,WOOD[4]);
  for(let x=16;x<127;x+=12)p.vl(x,11,19,iron[1]);p.hl(13,10,114,iron[2]);
  p.rect(58,23,27,7,WOOD[2]);
  for(let y=46;y<139;y+=8){p.line(112,y,139,y+6,WOOD[2]);}p.line(111,37,111,138,iron[0]);p.line(140,43,140,141,iron[1]);
 }else{
  const left=8,right=w-9,top=part==='tower'?62:part==='hall'?67:50;
  const plaster=['#e7e7d8','#dfd7cd','#d6e2df','#e7d5ca'][v%4];
  p.rect(left,top,right-left,h-top-5,C(plaster));p.rect(right-12,top,12,h-top-5,iv[1]);
  p.poly([[2,top],[w/2,part==='tower'?9:10],[w-3,top],[w-9,top+8],[8,top+8]],roofs[1]);
  p.poly([[w/2,10],[w-3,top],[w-9,top+8],[w/2,24]],roofs[0]);
  for(let y=top-25;y<top;y+=6)p.hl(22,y,w-44,roofs[2]);
  for(let y=top+22;y<h-18;y+=27){
   p.hl(left,y+17,right-left,iv[1]);p.hl(left,y+18,right-left,iv[4]);
   for(let x=left+14;x<right-8;x+=24){p.rect(x,y-7,9,15,C('#547a82'));p.vl(x,y-7,15,iv[0]);p.vl(x+4,y-7,15,iv[4]);p.hl(x,y-1,9,iv[2]);p.hl(x-2,y+8,13,iv[4]);}
  }
  for(const x of [left,left+5,right-5]){p.rect(x,top+6,3,h-top-10,iv[2]);p.vl(x,top+7,h-top-12,iv[4]);}
  p.rect(7,h-8,w-14,8,iv[0]);p.hl(7,h-8,w-14,iv[4]);
  drawDoor(p,w/2,h-1,part==='hall'?25:15,25);
  if(part==='tower'){
   p.ball(w/2,94,25,25,iv);p.ell(w/2,94,20,20,C('#f1e9d1'));
   p.line(w/2,94,w/2+10,83,C('#45585c'));p.line(w/2,94,w/2,77,C('#45585c'));
   for(const [dx,dy] of [[0,-17],[17,0],[0,17],[-17,0]])p.rect(w/2+dx-1,94+dy-1,3,3,C('#45585c'));
  }
  if(part==='hall'){
   for(let x=18;x<w-12;x+=36){p.rect(x,h-65,7,57,iv[2]);p.vl(x,h-64,55,iv[4]);p.rect(x-3,h-65,13,4,iv[4]);}
   p.poly([[113,68],[175,31],[239,68]],iv[3]);p.line(113,68,175,31,iv[0]);p.line(175,31,239,68,iv[0]);
   p.ball(175,56,9,9,iv);p.rect(136,h-58,78,5,iv[0]);
  }
  if(part==='arms'||part==='shop'){
   p.rect(19,h-48,w-38,15,C('#6c5144'));text.push([part==='arms'?'ARMS SHOP':'MARKET',26,h-37,11,'#f4e4b4']);
   const a=part==='arms'?'#417f70':'#c99552';p.rect(17,h-30,29,7,C(a));p.rect(w-46,h-30,29,7,C(a));
  }
  if(part==='marine'){p.rect(20,top+8,w-40,18,C('#e7e7d8'));text.push(['MARINE',30,top+21,13,'#305f7c']);}
 }
 p.outline(C('#506569'),false);
 const c=p.canvas(),g=c.getContext('2d');
 for(const [s,x,y,size,col] of text){g.font='bold '+size+'px monospace';g.fillStyle=col;g.fillText(s,x,y);}
 return {c,ax:w/2,ay:h-2};
});}
EXTRA_SPR.logue=logueSprite;

hookAfter('makeDawn',M=>{
 if(M.logue)return;
 M.logue={};
 for(let y=0;y<LOGUE_H;y++)for(let x=0;x<LOGUE_W;x++){
  const t=logueTile(x,y);if(!t)continue;
  const i=M.I(LOGUE_X+x,LOGUE_Y+y);M.ter[i]=LOGUE_TERRAIN[t];M.lvl[i]=0;
 }
 const add=(part,x,y,style=0,wide=7,deep=4)=>{
  const fp=orangeFootprint(wide,deep);
  if(fp.some(([dx,dy])=>!logueTile(x+dx,y+dy)||logueTile(x+dx,y+dy)==='sand'))return;
  return addObj(M,'logue',...logueAt(x,y),{part,style,fp});
 };
 // Compact blocks leave continuous cross-streets and a generous central avenue.
 for(const y of [72,96,112,128,156,172,196,210])for(const x of [42,54,79,92,116,129,159,171]){
  if(y>=96&&y<=128&&x>=76&&x<=132||y===72&&x>=120&&x<=159||y===156&&x>=76&&x<=132)continue;
  const style=(Math.floor(x/12)+Math.floor(y/12)*3)%12;add('house',x,y,style);
 }
 for(const [x,y] of [[76,156],[88,156],[120,156],[132,156]])add(x===76?'arms':'shop',x,y,x%4);
 add('hall',104,93,1,21,5);add('tower',51,101,0,5,4);
 add('marine',146,65,0,7,4);add('scaffold',104,111,0,7,2);
 // Only the gate pillars collide; the space below its arch remains walkable.
 addObj(M,'logue',...LOGUE_GATE,{part:'gate',fp:[[-7,0],[-7,-1],[7,0],[7,-1]]});
 for(const x of [88,120])addObj(M,'fountain',...logueAt(x,119),{fp:orangeFootprint(3,2)});
 for(const [x,y] of [[82,127],[126,127],[81,183],[127,183]])addObj(M,'bench',...logueAt(x,y),{fp:orangeFootprint(3,1)});
 for(const x of [78,130])for(const y of [210,214])addObj(M,'crate',...logueAt(x,y));
 for(const y of [60,91,120,150,181])for(const x of [29,179])if(logueTile(x,y)==='garden')addObj(M,'tree',...logueAt(x,y),{sp:'roble',v:y%4});
 for(const y of [44,51])for(const x of [76,88,120,132])if(logueTile(x,y)==='garden')addObj(M,'tree',...logueAt(x,y),{sp:'roble',v:(x+y)%4});
 for(const y of [145,170,185,202])for(const x of [96,112])addObj(M,'lantern',...logueAt(x,y),{kind:'wood'});
 for(const [at,title] of LOGUE_PLACES){
  const key='logue_info_'+at[0]+'_'+at[1];
  XACT[key]=[title,'book',()=>xMsg(title,L2('Loguetown, la ciudad del principio y del fin. Desde el puerto, la avenida pasa bajo el arco y lleva a la plaza de Roger. La armería está al oeste y el mercado al este.','Loguetown, the town of the beginning and the end. From the harbor, the avenue passes under the arch to Roger’s square. The arms shop is west and the market is east.'))];
  const port=at===LOGUE_PIER;
  addObj(M,'sign',at[0]+(port?2:5),at[1]+(port?0:2),{xact:key,solid:false,fp:[]});
 }
 M.chunks.clear();
});
hookAfter('renderChunk',(c,M,cx,cy)=>{
 const ox=cx*CH-LOGUE_X,oy=cy*CH-LOGUE_Y;
 if(!M.logue||ox+CH<=0||oy+CH<=0||ox>=LOGUE_W||oy>=LOGUE_H)return;
 const g=c.getContext('2d');
 for(let y=0;y<CH;y++)for(let x=0;x<CH;x++){
  const tx=ox+x,ty=oy+y,t=logueTile(tx,ty);if(!t)continue;
  const px=x*16,py=y*16;g.fillStyle=LOGUE_COLORS[t];g.fillRect(px,py,16,16);
  if(t==='garden'||t==='sand'){
   g.fillStyle=t==='garden'?'#71995f':'#cfbc90';g.fillRect(px+(tx*7+ty*3)%13,py+5,2,1);
  }else{
   g.fillStyle=t==='dock'?'#886844':'#a5b3ae';g.fillRect(px,py+15,16,1);
   g.fillRect(px+((tx+ty)%2)*8,py,1,15);g.fillStyle=t==='dock'?'#d7ad7c':'#dce1d4';g.fillRect(px+1,py,15,1);
   if(t==='plaza'&&Math.abs(Math.hypot(tx-104,ty-119)%8)<.7){g.fillStyle='#9caea9';g.fillRect(px,py+7,16,2);}
  }
 }
 return c;
});
hookAfter('orangeOverviewColor',(color,M,x,y)=>{
 const t=M.logue&&logueTile(x-LOGUE_X,y-LOGUE_Y);if(t)return C(LOGUE_COLORS[t]);
});
hookAfter('otherPOI',(out,M)=>{if(M.logue)for(const [at,t] of LOGUE_PLACES)out.push({x:at[0],y:at[1],c:'inn',t});});
function logueDockKey(){
 const P=G.P,M=G.map;if(!M?.logue||!P||P.dead||G.fading)return null;
 if(P.dawnHelm&&P.dawnHelm.kind!=='swim'&&conomiNear(P,LOGUE_MOOR,52))return dfHas()?'logue_land':'logue_locked';
 if(!P.dawnHelm&&P.dawnBoat?.logue&&conomiNear(P,LOGUE_PIER,40))return 'logue_sail';
 return null;
}
XACT.logue_land=[L2('Desembarcar en Loguetown','Land at Loguetown'),'ways',()=>{if(logueDockKey()==='logue_land')dawnIslandDock(true,'logue',LOGUE_PIER,LOGUE_MOOR,'Loguetown',L2('La ciudad del principio y del fin','The town of the beginning and the end'));}];
XACT.logue_sail=[L2('Volver al barco','Return to your ship'),'ways',()=>{if(logueDockKey()==='logue_sail')dawnIslandDock(false,'logue',LOGUE_PIER,LOGUE_MOOR,'Loguetown','');}];
XACT.logue_locked=[L2('Desembarco · necesitas una Fruta del Diablo','Landing · Devil Fruit required'),'ways',()=>toast(L2('Necesitas el permiso de desembarco de la Fruta del Diablo.','You need the Devil Fruit landing permit.'),'info',4)];
hookAround('interactTarget',(next)=>{const key=logueDockKey();return key?rareAction(key):next();});
