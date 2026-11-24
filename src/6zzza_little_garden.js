// Little Garden shares Dawn's map ID and leaves the original island at its existing coordinates.
const GARDEN_W = 448;
const GARDEN_LANDING = [139,230];
const GARDEN_PLACES = [
  ['Little Garden · cerrado', 'Little Garden · closed', ...GARDEN_LANDING],
  ['Selva de los helechos', 'Fern jungle', 156,192],
  ['Cavernas del Diente Verde', 'Green Tooth caves', 194,149],
  ['Valle de los Fósiles', 'Fossil Valley', 239,194],
  ['Mirador de las Calderas', 'Caldera Lookout', 276,152],
  ['Laguna del Este', 'Eastern Lagoon', 301,213]
];
const GARDEN_TRAILS = [
  [2.5, [GARDEN_LANDING,[142,212],[156,192],[178,179],[194,149],[218,159],[232,178],[239,194],[263,186],[276,152]]],
  [2.0, [[239,194],[256,205],[279,212],[301,213]]]
];
const GARDEN_RIVER = [[3.5, [[232,110],[226,138],[239,163],[251,188],[266,215],[253,249],[250,313]]]];
const GARDEN_LAND = [[201,172,103,92],[270,180,88,83],[175,212,53,50],[305,151,57,54]];
const GARDEN_HILLS = [[185,129,42,23],[217,128,32,22],[280,119,31,25],[318,142,29,19]];
const GARDEN_COLORS = Object.fromEntries([
  ['grass',['#365632','#47743a','#558447','#66974d','#7aa555']],
  ['stone',['#43534a','#546351','#768069','#9a9d81','#bbbca0']],
  ['cliff',['#38473d','#515749','#646954','#858574','#aeaa91']],
  ['lava',['#5c251c','#9e3a25','#c85228','#ed792e','#ffc355']],
  ['sand',['#a99364','#b8a47a','#cbb889','#ddc99a','#ebd7ac']],
  ['dirt',['#77613f','#91774e','#ab8e60','#b99d6b','#d0b282']],
  ['water',['#416d60','#568776','#69a394','#7fb4a0','#a3c8aa']],
  ['lagoon',['#235550','#326b5e','#3d8470','#579884','#82baa5']],
  ['sea',['#2677a0','#3095b2','#4eb2c1','#75c6c7','#99d7ce']],
  ['deep',['#3279a2','#347ca4','#357da5','#3881a8','#3b86ac']],
  ['foam',['#88c9bd','#a2d9cb','#c3ead4','#d7ebd3','#e4f2db']]
].map(([key,colors]) => [key,pal(colors)]));

function gardenShape(x,y,ellipses) {
  let edge = -999;
  for (const [cx,cy,rx,ry] of ellipses) edge = Math.max(edge,(1-Math.hypot((x-cx)/rx,(y-cy)/ry))*Math.min(rx,ry));
  return edge;
}

function expandDawnSea(M) {
  const oldW = M.w, w = oldW + GARDEN_W, h = M.h, stride = GARDEN_W+1;
  // Keep the original Dawn terrain at its original stride for dawnPaint().
  for (const key of ['ter','lvl','reg','flags','solidO','objAt']) {
    const old = M[key], data = new old.constructor(w*h);
    if (key === 'objAt') data.fill(-1);
    for (let y=0;y<h;y++) data.set(old.subarray(y*oldW,(y+1)*oldW),y*w);
    M[key] = data;
  }
  M.w=w; M.I=(x,y)=>y*w+x; M.dawnW=oldW; M.cw=Math.ceil(w/CH);
  M.objGrid=Array.from({length:M.cw*M.chh},()=>[]);
  for (const o of M.objs) M.objGrid[(o.py>>7)*M.cw+(o.px>>7)].push(o.id);
  M.xactObjs = M.objs.filter(o=>o.xact);
  M.overviewMinimap = true;
  M.hudName = L2('Mar de Dawn','Dawn Sea');

  const coast=new Float32Array(stride*(h+1));
  const river=selvaDistanceField(GARDEN_W,h,GARDEN_RIVER);
  const trail=selvaDistanceField(GARDEN_W,h,GARDEN_TRAILS);
  const landform = new Uint8Array(GARDEN_W*h);
  for (let y=0;y<=h;y++) for (let x=0;x<=GARDEN_W;x++) {
    const fi=y*stride+x;
    const shore=gardenShape(x,y,GARDEN_LAND)+Math.sin(x*.149+y*.131)*2.9+Math.sin(x*.232-y*.148)*1.25;
    coast[fi]=shore;
    if (x===GARDEN_W||y===h) continue;
    const lake=(Math.hypot((x-307)/21,(y-228)/13)-1)*13;
    const bridge=shore>0 && trail[fi]<1.9 && river[fi]<1.7;
    const hill=gardenShape(x,y,GARDEN_HILLS);
    const lava=Math.hypot((x-280)/4.8,(y-119)/3.3)<1;
    const cell=y*GARDEN_W+x;
    const type=bridge?T.BRIDGE:shore<0?T.DEEP:lake<0||river[fi]<0?T.WATER:
      lava?T.LAVA:trail[fi]<0?T.DIRT:hill>6?T.STONE:shore<4?T.SAND:T.GRASS;
    M.ter[M.I(oldW+x,y)]=type;
    landform[cell]=type===T.WATER?(lake<0?2:1):hill>6?3:0;
  }
  M.garden={coast,trail,landform,points:GARDEN_PLACES.map(([es,en,x,y])=>({name:L2(es,en),x:x+oldW,y}))};
  gardenDecorate(M);
  return M;
}

function gardenDecorate(M) {
  const random=new RNG(90472), {coast,trail}=M.garden, stride=GARDEN_W+1;
  const clearings=[[142,223,15,14],[157,184,13,9],[194,146,17,12],[239,192,21,12],[276,150,19,12],[301,213,15,9]];
  const add = (name,x,y,fp=[]) => addObj(M,'garden',x+M.dawnW,y,{gardenSprite:name,fp,solid:fp.length>0});
  for (let gy=77;gy<270;gy+=4) for (let gx=89;gx<362;gx+=4) {
    const x=gx+random.int(-1,1),y=gy+random.int(-1,1),i=y*stride+x;
    if (M.ter[M.I(x+M.dawnW,y)]!==T.GRASS || coast[i]<2 || trail[i]<2.7 ||
      clearings.some(([cx,cy,rx,ry])=>Math.hypot((x-cx)/rx,(y-cy)/ry)<1) || random.f()>.76) continue;
    if (random.f()<.15) add('fern'+random.int(0,2),x,y);
    else add((coast[i]<10||random.f()<.28?'palm':'tree')+random.int(0,3),x,y,[[0,0]]);
  }
  for (const [s,x,y] of [
    ['ridge0',187,145],['ridge1',204,147],['ridge0',216,138],['ridge1',171,137],
    ['volcano0',276,140],['volcano1',288,135],['volcano1',301,143],
    ['bone0',231,190],['bone1',243,190],['bone0',251,197],['bone1',232,199],
    ['fern0',136,223],['fern1',144,225],['fern2',181,151],['fern1',204,152],['fern0',291,212],
    ['fern0',190,148],['fern2',192,146],['fern1',198,147],['fern0',200,149],
    ['fern2',273,142],['fern0',281,143],['fern1',284,144],['boulder0',269,144],
    ['boulder1',282,148],['boulder0',274,151],['boulder1',287,146],['fern1',275,153]
  ]) {
    const t=M.ter[M.I(M.dawnW+x,y)];
    const tall=s.startsWith('ridge')||s.startsWith('volcano');
    const fp=tall?Array.from({length:7},(_,i)=>[i-3,0]):[[0,0]];
    const safe=fp.filter(([offset])=>!blockedFor(M,M.dawnW+x+offset,y,0)&&trail[y*stride+x+offset]>1.8);
    add(s,x,y,SOLID_T[t]||s.startsWith('fern')?[]:safe);
  }
  add('beacon',136,228);
}

function gardenPaint(M,cx,cy) {
  const {coast,trail,landform}=M.garden, stride=GARDEN_W+1, c=mkCanvas(CHP,CHP),g=c.getContext('2d');
  const im=g.createImageData(CHP,CHP), pixels=new Uint32Array(im.data.buffer), S=GARDEN_COLORS;
  const ox=cx*CHP,oy=cy*CHP;
  for(let yy=0;yy<CHP;yy++){
    const py=oy+yy,y=py>>4, fy=(py&15)/16, row=y*stride, ti=(py&127)*128;
    for(let xx=0;xx<CHP;xx++){
      const px=ox+xx,gx=px>>4,x=gx-M.dawnW, fx=(px&15)/16,k=row+x, n=ti+(px&127), t=M.ter[M.I(gx,y)];
      const d=lerp(lerp(coast[k],coast[k+1],fx),lerp(coast[k+stride],coast[k+stride+1],fx),fy);
      const art=landform[y*GARDEN_W+x];
      let col;
      if(t===T.BRIDGE) col=WOOD[(py&7)===0?1:TEX.plank[n]];
      else if(t===T.LAVA) col=S.lava[TEX.rock[n]];
      else if(t===T.WATER) col=(art===2?S.lagoon:S.water)[TEX.mud[n]];
      else if(d<0) {
        const wave=(py+Math.round(Math.sin(px*.04)*4))%44===0 && (px%89)<22;
        const colors=d>-.35?S.foam:d>-10?S.sea:S.deep;
        col=colors[wave?Math.min(4,TEX.mud[n]+1):TEX.mud[n]];
      } else if(t===T.STONE) col=(art===3&&((py+(px>>2))%29)<7?S.cliff:S.stone)[TEX.rock[n]];
      else if(d<3.8) col=S.sand[TEX.sand[n]];
      else if(lerp(lerp(trail[k],trail[k+1],fx),lerp(trail[k+stride],trail[k+stride+1],fx),fy)<0) col=S.dirt[TEX.dirt[n]];
      else col=S.grass[clamp(TEX.grass[n]-1,0,4)];
      pixels[yy*CHP+xx]=col;
    }
  }
  g.putImageData(im,0,0);return c;
}

{const old=makeDawn;makeDawn=function(){
  const M=old.apply(this,arguments);
  return M.garden?M:expandDawnSea(M);
};}
{const old=dawnPaint;dawnPaint=function(M,cx,cy){
  if(!M.garden)return old.apply(this,arguments);
  if(cx*CH>=M.dawnW)return gardenPaint(M,cx,cy);
  return old({w:M.dawnW,h:M.h,dawnData:M.dawnData},cx,cy);
};}
{const old=otherPOI;otherPOI=function(M){
  const out=old.apply(this,arguments);
  if(M.garden)for(const p of M.garden.points)out.push({c:'garden',x:p.x,y:p.y,t:p.name});
  return out;
};}
MAPC.garden=[L2('Little Garden','Little Garden'),'Little Garden','#d9d898','star'];
{
  const entry=MAPW_LIST.find(m=>m.id==='dawn');
  entry.n=L2('Mar de Dawn · Foosha y Little Garden','Dawn Sea · Foosha and Little Garden');
}
{const old=mapOverview;mapOverview=function(M){
  if(!M.garden)return old.apply(this,arguments);
  if(MAP_OV[M.id]?.w===M.w&&MAP_OV[M.id]?.c.height===M.h)return MAP_OV[M.id].c;
  const {w,h,dawnW,garden}=M,c=mkCanvas(w,h),g=c.getContext('2d'),im=g.createImageData(w,h),p=new Uint32Array(im.data.buffer);
  const S=GARDEN_COLORS;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const i=M.I(x,y),t=M.ter[i];
    if(M.orange&&y>=M.orange.start){p[i]=orangeOverviewColor(M,x,y,i);continue;}
    if(M.shells&&x>=M.shells.start){p[i]=shellsOverviewColor(M,x,y,i);continue;}
    const d=x<dawnW?M.dawnData.field[y*(dawnW+1)+x]:garden.coast[y*(GARDEN_W+1)+x-dawnW];
    p[i]=t===T.DEEP?(d>-9?S.sea[2]:S.deep[1]):t===T.WATER?S.water[2]:
      t===T.LAVA?S.lava[3]:t===T.SAND?S.sand[3]:t===T.DIRT||t===T.BRIDGE?S.dirt[3]:
      t===T.STONE||t===T.IWALL?S.stone[2]:x<dawnW?(M.solidO[i]?S.grass[2]:S.grass[4]):S.grass[M.solidO[i]?0:2];
  }
  g.putImageData(im,0,0);
  MAP_OV[M.id]={c,w};return c;
};}
