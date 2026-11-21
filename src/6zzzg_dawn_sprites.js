const DAWN_ALT_ANIMS = {idle:0, walk:2, atk:6, hurt:10, dead:11};
const alvidaSheet=new Image();
alvidaSheet.src=ALVIDA_REFERENCE_PNG;

function dawnPixelAtlas(fw,fh,idx,cols,draw){
  const hd=mkCanvas(fw*2*cols,fh*8),g=hd.getContext('2d');
  g.imageSmoothingEnabled=false;
  for(let row=0;row<4;row++)for(let col=0;col<cols;col++){
    g.save();g.translate(col*fw*2,row*fh*2);
    g.beginPath();g.rect(0,0,fw*2,fh*2);g.clip();
    draw(g,col,row);
    g.restore();
  }
  const img=mkCanvas(fw*cols,fh*4),low=img.getContext('2d');
  low.imageSmoothingEnabled=false;low.drawImage(hd,0,0,img.width,img.height);
  return {img,hd,fw,fh,idx,ax:fw/2,ay:fh-2,hdL:{},dawnPixels:true,combatWidth:48};
}
{const old=hdEnsure;hdEnsure=function(A){
  return A.dawnPixels?true:old.apply(this,arguments);
};}
function alvidaReferenceAtlas(){
  return getAtlas('Dawn:Alvida:reference',()=>dawnPixelAtlas(72,56,DAWN_ALT_ANIMS,12,(g,col,row)=>{
    let sourceRow=row,frame=0;
    if(col<2){sourceRow=row===0?4:row;}
    else if(col<6)frame=col-2;
    else if(col<10){
      sourceRow=row===0?4:row;
      frame=col-6;
      if(row!==0){
        // The sheet supplies a frontal strike. Animate the directional silhouettes on the same timing.
        const lean=[-.04,0,.13,.05][frame]*(row===2?-1:1);
        g.translate(-lean*108,0);g.transform(1,0,lean,1,0,0);
      }
    }else if(col===10){frame=1;g.translate(row===2?3:-3,2);}
    else{g.translate(72,110);g.rotate(-Math.PI/2);g.scale(.64,.64);g.translate(-72,-108);}
    g.drawImage(alvidaSheet,frame*144,sourceRow*112,144,112,0,0,144,112);
  }));
}

const luffySheet=new Image();
luffySheet.src=LUFFY_WAVE_PNG;

function luffyWaveAtlas(){
  if(!luffySheet.naturalWidth)return null;
  return getAtlas('Dawn:Luffy:wave',()=>{
    const atlas=dawnPixelAtlas(42,48,{idle:0,wave:1},4,(g,col)=>{
      g.drawImage(luffySheet,col*84,0,84,96,0,0,84,96);
    });
    atlas.frames={idle:1,wave:3};
    return atlas;
  });
}
NPCS.dawn_luffy.atlas=luffyWaveAtlas;
// Luffy stays by the harbour. Play the sheet once on arrival and reset after the player leaves.
const LUFFY_WAVE_SEQUENCE=[0,1,0,2,1,2,0,1,2,0];
{const old=updateNPC;updateNPC=function(e,dt){
  if(e.id!=='dawn_luffy')return old.apply(this,arguments);
  const P=G.P,distance=P.map===e.map?dist2(e.x,e.y,P.x,P.y):Infinity;
  if(distance>72*72)e.waveStart=null;
  else if(distance<56*56&&e.waveStart==null)e.waveStart=G.t;
  const frame=e.waveStart==null?Infinity:Math.floor((G.t-e.waveStart)*8);
  e.anim=frame<LUFFY_WAVE_SEQUENCE.length?'wave':'idle';
  e.af=LUFFY_WAVE_SEQUENCE[frame]??0;
};}
luffySheet.addEventListener('load',()=>{
  for(const e of G.ents)if(e.id==='dawn_luffy')e.atlas=luffyWaveAtlas();
});

{const old=mobAtlasFor;mobAtlasFor=function(art){
  if(art?.[1]==='dawn_alvida'&&SETTINGS.spriteAlvida&&alvidaSheet.naturalWidth)return alvidaReferenceAtlas();
  return old.apply(this,arguments);
};}
function refreshAlvidaSprite(){
  for(const e of G.ents)if(e.mid==='dawn_alvida')e.atlas=mobAtlasFor(e.def.art);
}
alvidaSheet.addEventListener('load',refreshAlvidaSprite);
{const old=renderOpts;renderOpts=function(B){
  old.apply(this,arguments);
  const root=B.querySelector('.opts'),section=document.createElement('section');
  const title=document.createElement('h3');title.textContent=L2('Sprites de Dawn','Dawn sprites');section.append(title);
  const row=document.createElement('div');row.className='row';section.append(row);
  const button=document.createElement('button');button.className='btn';button.dataset.sprite='dawn_alvida';
  const update=()=>{
    const alternate=!!SETTINGS.spriteAlvida;
    button.textContent='Alvida · '+(alternate?L2('Nuevo','New'):L2('Original','Original'));
    button.setAttribute('aria-pressed',String(alternate));button.classList.toggle('gold',alternate);
  };
  button.onclick=()=>{SETTINGS.spriteAlvida=!SETTINGS.spriteAlvida;saveSettings();refreshAlvidaSprite();update();};
  update();row.append(button);
  root.querySelector('#oQ').closest('label').before(section);
};}
