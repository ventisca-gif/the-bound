// Shells Town extends the eastern edge of the shared Dawn Sea.
const SHELL_WIDTH=480;
const SHELL_PIER=[204,233], SHELL_MOORING=[204,240];
const SHELL_TYPES={sea:0,grass:1,cliff:2,cobbles:3,quay:4,steps:5,pier:6,court:7,yard:8};
const SHELL_PALETTES=Object.fromEntries(Object.entries({
 sea:['#307d9e','#3282a5','#388bad','#4aa7bb','#7ccbc7','#bee2cd'],
 grass:['#5f7947','#79925a','#8ba66a','#a3ba78','#b2c583'],
 cliff:['#68706e','#82847c','#9b998a','#b4ad98','#d0c3aa'],
 cobbles:['#95a29c','#a6b0a8','#b4bcb2','#c3c9bc','#d0d5c9'],
 quay:['#687a78','#788784','#8d9b96','#aebbb2','#d4ded1'],
 court:['#b6ab80','#c5b88a','#d3c497','#dfd2a6','#e5d7ae'],
 tower:['#294978','#355a96','#4479b2','#5796ce','#74afe0','#a2cbe5']
}).map(([key,values])=>[key,pal(values)]));
const SHELL_POINTS=[
 [...SHELL_PIER,'Puerto de Shells Town','Shells Town Harbour'],
 [207,198,'Barrio de los tejados','Rooftop Quarter'],[208,180,'Escalinata','Town Stairs'],
 [212,161,'Patio de la Marina','Marine Courtyard'],[221,146,'Base 153','153rd Branch Base']
];
function shellsShape(x,y){
 const island=gardenShape(x,y,[[232,168,142,110],[269,151,131,101],[152,178,62,71],[277,209,88,55]])
   +Math.sin(x*.093+y*.121)*4.4+Math.sin(x*.219-y*.157)*2.8;
 const bay=38-Math.hypot((x-205)*.54,(y-262)*.88);
 return Math.min(island,-bay);
}
function shellsCityGround(x,y,d){
 const K=SHELL_TYPES;
 const apron=x>=167&&x<=249&&y>=203&&y<=228;
 if((y>=223&&y<237&&((x>=173&&x<=178)||(x>=200&&x<=207)||(x>=234&&x<=238))) ||
    (x>=162&&x<175&&y>=220&&y<=223)||(x>=243&&x<254&&y>=221&&y<225))return K.pier;
 if(apron&&(y<=221||x<190||x>=223||x>=199&&x<=209))return y===228||y===221&&x>=190&&x<223&&!(x>=199&&x<=209)?K.quay:K.cobbles;
 if(x>=180&&x<=246&&y>=147&&y<169){
  if((x>=205&&x<=211)||y<=153)return K.cobbles;
  return Math.sin(x*.35+y*.10)+Math.cos(y*.38-x*.04)>.38?K.court:K.yard;
 }
 if(y>171&&y<205&&x>=149&&x<=268){
  const half=y>194?55:y>185?48:39;
  if(Math.abs(x-209)<half)return (y===180||y===190||y===201)&&x>=202&&x<=216?K.steps:K.cobbles;
 }
 if((Math.abs(x-212)<43+(y-142)*.3+Math.sin(y*.23)*3&&y>138&&y<180)||
  (Math.abs(x-207)<53+(y-173)*.37+Math.cos(y*.24)*4&&y>169&&y<211))return K.cliff;
 if(d<0)return K.sea;
 if(d<3.3||((y>208&&y<218)&&(x<165||x>253))||((y+Math.sin(x*.065)*7)%35<2&&d<56))return K.cliff;
 return K.grass;
}
function shellsHouse(o){
 const roofs=['#365ba1','#ad5947','#318382','#94754f','#a64338','#426f93'];
 return spr('shells:house:'+o.style,()=>{
  const k=o.style,w=4+k%4,c=genBuilding({w,h:5,extra:8+k%3*3,wallH:34+k%3*5,style:k%3===0?'puerto':'albor',
   roof:k%3===0?'blue':'red',gable:k%3!==1,box:true,chimney:k%3!==2,v:k,
   awning:k%4===1?['#537c91','#ad654c','#5d9490'][k%3]:null});
  const g=c.c.getContext('2d'),im=g.getImageData(0,0,c.c.width,c.c.height),px=new Uint32Array(im.data.buffer);
  const original=ROOFP[k%3===0?'blue':'red'],base=C(roofs[k%roofs.length]);
  const remap=new Map(original.map((col,i)=>[col,uMix(uMul(base,.49+i*.14),C('#f8dfc4'),i*.055)]));
  for(let i=0;i<px.length;i++)if(remap.has(px[i]))px[i]=remap.get(px[i]);
  g.putImageData(im,0,0);
  return c;
 });
}
function shellsBrick(p,x,y,w,h){
 const stones=SHELL_PALETTES.quay;
 for(let j=0;j<h;j++)for(let i=0;i<w;i++){
  const row=j>>3,xx=i+(row%2)*8,b=hash2(xx>>4,row,51);
  p.set(x+i,y+j,stones[j%8===7||xx%16===0?0:j%8===0?4:1+Math.floor(b*3)]);
 }
}
function shellsFort(){
 return spr('shells:fort',()=>{
  const W=376,H=289,p=new Pix(W,H),bl=SHELL_PALETTES.tower;
  shellsBrick(p,15,216,346,68);
  for(let x=18;x<356;x+=21){shellsBrick(p,x,209,13,9);p.hl(x,209,13,C('#d7dbcd'));}
  for(const [x,y,r,h] of [[267,79,40,167],[94,69,42,173],[175,36,59,221]]){
   for(let j=0;j<h;j++){
    const half=r*(.75+.25*j/h);
    for(let i=Math.ceil(x-half);i<=x+half;i++){
     const u=(i-x)/half,a=u>0.64?1:u>0.19?2:u>-.58?3:2;
     const stripe=(i+j*.49)%72<17;
     p.set(i,y+j,bl[Math.max(0,a-(stripe?1:0)+(u<-.28&&u>-.55?1:0))]);
    }
   }
   p.ell(x,y,Math.round(r*.76),12,bl[5]);
   p.ell(x,y-1,Math.round(r*.67),9,bl[0]);
   p.ell(x,y-1,Math.round(r*.6),7,bl[1]);
   p.poly([[x-13,y-1],[x+8,y-10],[x+28,y-25],[x+37,y-22],[x+14,y-3],[x-8,y+5]],C('#657472'));
   p.line(x+9,y-9,x+31,y-24,C('#a7ac92'));
   p.ell(x+32,y-23,5,4,C('#3d5051'));
   for(let j=0;j<3;j++){
    const wx=x+(j%2?17:-17),wy=y+35+j*46;
    p.ell(wx,wy,6,7,bl[0]);p.rect(wx-6,wy,12,7,bl[0]);
    p.vl(wx,wy-5,11,bl[5]);p.hl(wx-4,wy,9,bl[4]);p.hl(wx-7,wy+7,14,bl[5]);
   }
   p.ell(x,y+h-32,15,16,C('#284c51'));p.rect(x-15,y+h-32,30,27,C('#284c51'));
   p.rect(x-11,y+h-31,22,23,C('#507b69'));p.vl(x,y+h-36,29,C('#324d48'));
  }
  shellsBrick(p,21,265,334,20);p.hl(21,264,334,C('#d4ddd4'));
  p.outline(C('#354b58'));
  const c=p.canvas(),g=c.getContext('2d');g.font='bold 13px monospace';g.fillStyle='#233f55';g.textAlign='center';g.fillText('MARINA 153',188,280);
  return {c,ax:188,ay:285};
 });
}
function shellsWall(o){
 return spr('shells:wall:'+o.kind,()=>{
  const gate=o.kind==='gate',corner=o.kind==='corner',w=gate?117:corner?36:96,p=new Pix(w,gate?69:57);
  const y=gate?18:13,base=p.h-2;
  shellsBrick(p,1,y,w-2,base-y);
  for(let x=2;x<w-3;x+=13){shellsBrick(p,x,y-6,8,7);p.hl(x,y-6,8,C('#e0d9bc'));}
  if(gate){
   const x=w>>1;
   p.ell(x,39,33,17,C('#3b5250'));p.rect(x-33,39,66,base-39,C('#3b5250'));
   p.ell(x,40,29,13,C('#6a8d75'));p.rect(x-29,39,58,base-40,C('#6a8d75'));
   for(let n=-26;n<26;n+=6)p.vl(x+n,41,base-42,C('#53775f'));
   p.vl(x,36,base-36,C('#3c5950'));p.hl(x-28,46,56,C('#485b53'));
  }
  p.outline(C('#445955'));
  return {c:p.canvas(),ax:w/2,ay:base};
 });
}
function shellsTerrace(o){
 return spr('shells:terrace:'+o.span,()=>{
  const w=o.span*16,p=new Pix(w,24);
  shellsBrick(p,0,4,w,19);p.hl(0,3,w,C('#d8d6bf'));p.hl(0,22,w,C('#526969'));
  return {c:p.canvas(),ax:w/2,ay:7};
 });
}
function shellsShip(){
 return spr('shells:ship',()=>{
  const p=new Pix(242,184),hull=SHELL_PALETTES.tower;
  p.poly([[9,115],[228,115],[214,149],[183,175],[47,175],[21,151]],hull[1]);
  p.poly([[13,115],[231,114],[211,140],[25,141]],hull[3]);
  for(let y=145;y<=165;y+=5)p.hl(38+(y-145)/2,y,160-(y-145),hull[0]);
  for(let x=38;x<209;x+=22){p.ball(x,146,5,4,STONEW);p.ell(x,146,3,2,hull[0]);}
  p.poly([[28,111],[210,111],[204,126],[35,126]],WOOD[4]);
  for(const [x,t,w] of [[57,48,65],[138,15,84]]){
   p.rect(x,t,4,115-t,WOOD[2]);
   p.poly([[x+5,t+9],[x+w,t+13],[x+w-4,t+70],[x+5,t+68]],C('#eef0df'));
   p.line(x+5,t+68,x+w-4,t+70,C('#97b8c8'));
   p.line(x,t+2,x+w,t+70,WOOD[3]);
   for(let f=14;f<=w-9;f+=15)p.line(x+f,t+15,x+f-3,t+65,C('#d2e5e2'));
  }
  p.outline(C('#39576a'));
  const c=p.canvas(),g=c.getContext('2d');g.font='bold 12px monospace';g.fillStyle='#315986';g.fillText('MARINA',158,57);
  return {c,ax:121,ay:177};
 });
}
EXTRA_SPR.shellShip=shellsShip;
EXTRA_SPR.shellHouse=shellsHouse;
EXTRA_SPR.shellFort=shellsFort;
EXTRA_SPR.shellWall=shellsWall;
EXTRA_SPR.shellTerrace=shellsTerrace;
function addShellsTown(M){
 const start=M.w, w=start+SHELL_WIDTH, h=M.h, K=SHELL_TYPES;
 for(const k of ['ter','lvl','reg','flags','solidO','objAt']){
  const prev=M[k],next=new prev.constructor(w*h);
  if(k==='objAt')next.fill(-1);
  for(let y=0;y<h;y++)next.set(prev.subarray(y*start,(y+1)*start),y*w);
  M[k]=next;
 }
 M.w=w;M.cw=Math.ceil(w/CH);M.I=(x,y)=>y*w+x;
 M.objGrid=Array.from({length:M.cw*M.chh},()=>[]);
 for(const o of M.objs)M.objGrid[(o.py>>7)*M.cw+(o.px>>7)].push(o.id);
 const coast=new Float32Array(SHELL_WIDTH*h),ground=new Uint8Array(coast.length);
 const types=[T.DEEP,T.GRASS,T.STONE,T.COBBLE,T.COBBLE,T.COBBLE,T.BRIDGE,T.DIRT,T.GRASS];
 for(let y=0;y<h;y++)for(let x=0;x<SHELL_WIDTH;x++){
  const i=y*SHELL_WIDTH+x,d=shellsShape(x,y);
  coast[i]=d;ground[i]=shellsCityGround(x,y,d);M.ter[M.I(start+x,y)]=types[ground[i]];
 }
 M.shells={start,coast,ground};
 const drawSea=M.drawExtra;
 M.drawExtra=(cx,cy)=>{
  drawSea(cx,cy);
  if(G.P.shellBerth?.kind==='skiff'){
   const [x,y]=shellsDockPoint(M,SHELL_MOORING);
   dawnShipSprite(cx,cy,dawnSprite('boat'),x,y+16,'down');
  }
 };
 const add=(kind,x,y,props={})=>addObj(M,kind,start+x,y,props);
 const house=(x,y,style)=>{const w=4+style%4;add('shellHouse',x,y,{style,fp:Array.from({length:w*2},(_,i)=>[i%w-(w>>1),-Math.floor(i/w)])});};
 const rows=[
  [171,[[177,1],[187,9],[198,3],[221,7],[231,4],[239,2],[246,6]]],
  [179,[[171,3],[180,6],[188,14],[196,16],[202,11],[216,8],[224,3],[232,6],[240,13],[249,2]]],
  [188,[[162,1],[170,3],[178,4],[185,8],[192,17],[201,0],[216,7],[223,3],[230,18],[239,13],[246,2],[254,9]]],
  [198,[[157,3],[165,5],[173,22],[181,9],[189,4],[201,0],[216,8],[222,13],[230,16],[238,7],[246,5],[255,16]]],
  [208,[[169,14],[175,1],[183,7],[193,15],[219,7],[227,20],[234,5],[243,16],[249,2]]],
  [216,[[169,6],[176,1],[185,4],[194,2],[220,4],[227,21],[234,17],[241,6],[248,10]]]
 ];
 for(const [y,houses] of rows)houses.forEach(([x,k],i)=>house(x,y+(i%3===0?1:0),k));
 for(const [x,y] of [[192,157],[187,163],[235,158],[240,162],[154,194],[261,193],[164,212],[254,208],
  [165,177],[258,180],[191,181],[228,197],[181,204],[237,209],[159,211],[258,211]])add('tree',x,y,{sp:y>185&&x%3===0?'palma':'roble',v:x%4});
 const rnd=new RNG(790325);
 for(let i=0;i<100;i++){
  const x=rnd.int(107,330),y=rnd.int(91,231);
  if((x>=148&&x<=270&&y>=131&&y<=235)||ground[y*SHELL_WIDTH+x]!==K.grass)continue;
  add('tree',x,y,{sp:y>192&&i%3===0?'palma':'roble',v:i%4});
 }
 for(const [x,y,kind] of [[177,200,'stall'],[190,201,'stall'],[228,201,'stall'],[240,202,'stall'],
   [187,218,'stall'],[224,219,'stall'],[180,220,'crate'],[215,220,'cart'],[199,220,'sack'],[216,226,'nets'],[176,218,'barrel'],[178,217,'crate'],[184,222,'nets'],[204,224,'crate'],[207,224,'crate'],[204,226,'barrel'],
   [223,222,'cart'],[236,219,'sack'],[243,217,'barrel'],[247,222,'nets'],[184,214,'pot'],[233,210,'pot'],
   [189,193,'pot'],[224,185,'pot'],[239,203,'pot'],[197,206,'lantern'],[217,206,'lantern'],[197,216,'lantern'],[217,216,'lantern'],
   [198,224,'lantern'],[209,224,'lantern'],[202,166,'lantern'],[215,166,'lantern']]){
  add(kind,x,y,{col:['#559086','#af6350','#ac9462'][x%3],kind:'wood'});
 }
 for(const [x,y] of [[172,230],[181,235],[210,238],[239,233],[252,227]])add('boat',x,y,{solid:false,fp:[]});
 add('shellShip',189,246,{solid:false,fp:[]});
 for(const [x,y,span] of [[193,201,15],[224,201,15],[194,190,13],[224,190,13],[194,180,12],[224,180,12],[170,228,6],[184,228,10],[220,228,24],[244,228,10]])add('shellTerrace',x,y,{span,solid:false,fp:[]});
 add('shellFort',219,153,{fp:Array.from({length:66},(_,i)=>[i%22-11,-Math.floor(i/22)])});
 for(const x of [184,190,196,219,225,231,237,243])add('shellWall',x,169,{kind:'wall',fp:Array.from({length:6},(_,i)=>[i-3,0])});
 add('shellWall',208,169,{kind:'gate',fp:Array.from({length:7},(_,i)=>[i-3,0])});
 for(const x of [180,246])add('shellWall',x,169,{kind:'corner'});
 return M;
}
function shellsPaint(M,cx,cy){
 const {start,ground,coast}=M.shells,K=SHELL_TYPES,S=SHELL_PALETTES;
 const p=new Pix(CHP,CHP),ox=(cx*CH-start)*16,oy=cy*CHP;
 for(let iy=0;iy<CHP;iy++)for(let ix=0;ix<CHP;ix++){
  const x=ox+ix,y=oy+iy,tx=x>>4,ty=y>>4,i=ty*SHELL_WIDTH+tx,d=coast[i],kind=ground[i];
  const pat=(y&127)*128+(x&127);
  let col;
  if(kind===K.sea){
    const wave=(y+Math.floor(Math.sin(x*.027)*5))%37;
    const foam=wave===0&&x%84<27;
    col=S.sea[clamp((d>-2?4:d>-6?3:d>-15?2:1)+(foam?1:0)-(TEX.mud[pat]<1?1:0),0,5)];
  }else if(kind===K.cobbles||kind===K.court){
    const row=y>>3,off=x+(row%2)*7,t=hash2(off>>4,row,86),X=off%16,Y=y%8;
    const shade=(X===0||Y===7)?0:Y===0&&t>.38?4:1+Math.floor(t*3);
    col=(kind===K.court?S.court:S.cobbles)[shade];
  }else if(kind===K.steps)col=S.quay[y%6===0?4:y%6===4?1:3];
  else if(kind===K.pier)col=WOOD[(x&7)===0?1:TEX.plank[pat]];
  else if(kind===K.quay)col=S.quay[(y&15)<3?4:(y&7)===7?0:2];
  else if(kind===K.cliff){
    const edge=Math.floor(6*Math.sin(x*.035))+y,row=edge>>3,off=x+(row%2)*8;
    col=S.cliff[(edge%8===7||off%23===0)?1:TEX.rock[pat]>2?3:2];
  }
  else col=S.grass[clamp(TEX.grass[pat]+(hash2(tx,ty,115)>.74?0:-1),0,4)];
  p.set(ix,iy,col);
 }
 return p.canvas();
}
{const old=dawnPaint;dawnPaint=function(M,cx,cy){
 return M.shells&&cx*CH>=M.shells.start?shellsPaint(M,cx,cy):old.apply(this,arguments);
};}

const SHELL_OVERVIEW=pal(['#3889ac','#88a362','#b0aa91','#c0c9bd','#8c9e98','#b0bcae','#b08658','#d4c695','#93a573']);
function shellsOverviewColor(M,x,y,idx){
 const i=y*SHELL_WIDTH+x-M.shells.start,kind=M.shells.ground[i];
 if(kind===SHELL_TYPES.sea)return SHELL_PALETTES.sea[M.shells.coast[i]>-5?3:1];
 if(kind===SHELL_TYPES.grass&&M.solidO[idx])return SHELL_PALETTES.grass[0];
 if(M.objs[M.objAt[idx]]?.k==='shellHouse')return C('#a86a53');
 return SHELL_OVERVIEW[kind];
}
{const old=makeDawn;makeDawn=function(){
 const M=old.apply(this,arguments);
 return M.shells?M:addShellsTown(M);
};}
MAPC.shells=['Shells Town','Shells Town','#b2d0d4','house'];
{const old=otherPOI;otherPOI=function(M){
 const out=old.apply(this,arguments);
 if(M.shells)for(const [x,y,es,en] of SHELL_POINTS)out.push({c:'shells',x:M.shells.start+x,y,t:L2(es,en)});
 return out;
};}
{
 const entry=MAPW_LIST.find(m=>m.id==='dawn');
 entry.n=L2('Mar de Dawn · Foosha, Little Garden y Shells Town','Dawn Sea · Foosha, Little Garden and Shells Town');
 entry.how=L2('Desde nivel 500, habla con Marina en Puerto Coral. Navega al este de Little Garden y desembarca en el muelle central de Shells Town.','At level 500, talk to Marina in Coral Port. Sail east of Little Garden and land at the central pier in Shells Town.');
}

function shellsDockPoint(M,[x,y]){
 return dawnPx([M.shells.start+x,y]);
}
function shellsDockAction(){
 const P=G.P,M=G.map;
 if(!M?.shells||!P||P.dead||G.fading)return null;
 if(P.dawnHelm){
  const [x,y]=shellsDockPoint(M,SHELL_MOORING);
  return dist2(P.x,P.y,x,y)<62**2?'shells_land':null;
 }
 if(!P.shellBerth)return null;
 const [x,y]=shellsDockPoint(M,SHELL_PIER);
 return dist2(P.x,P.y,x,y)<38**2?'shells_sail':null;
}
function shellsChangeDeck(action){
 if(shellsDockAction()!==action)return;
 transition(()=>{
  const P=G.P,M=G.map,landing=action==='shells_land';
  const [x,y]=shellsDockPoint(M,landing?SHELL_PIER:SHELL_MOORING);
  if(landing){
   P.shellBerth=P.dawnHelm;P.dawnHelm=null;
   if(P.shellBerth.kind==='galleon'){
    const [mx,my]=shellsDockPoint(M,SHELL_MOORING);
    P._alvidaBerth={x:mx,y:my,dir:'down'};
   }
  }
  else{
   P.dawnHelm=P.shellBerth;P.shellBerth=null;
   if(P.dawnHelm.kind==='galleon')P._alvidaBerth={x,y,dir:'down'};
  }
  // Same map: moving between a mooring and its pier does not open the other island landings.
  P.x=x;P.y=y;P.dir=landing?'up':'down';P.target=null;
  updateCamera(0,true);prewarm(M);netPresence(true);
  if(landing)banner('Shells Town',L2('Puerto de la Marina','Marine Harbour'));
  markDirty(true);
 });
}
XACT.shells_land=[L2('Desembarcar en Shells Town','Land at Shells Town'),'ways',()=>shellsChangeDeck('shells_land')];
XACT.shells_sail=[L2('Volver a la embarcación','Return to your ship'),'ways',()=>shellsChangeDeck('shells_sail')];
{const old=interactTarget;interactTarget=function(){
 const key=shellsDockAction();
 return key?{kind:'xact',label:XACT[key][0],icon:'ways',o:{xact:key}}:old.apply(this,arguments);
};}
{const old=setMap;setMap=function(M){
 const result=old.apply(this,arguments);
 if(result!==false&&G.P&&G.map===M&&!M.shells)G.P.shellBerth=null;
 return result;
};}
