// The atlas uses the game's foot anchor. Effects are rendered separately from the sprites.
const ORANGE_ANIM={idle:0,walk:2,atk:6,hurt:10,dead:11,throw:12,split:16,rejoin:18,look:20,ride:21};
const ORANGE_IMAGES=Object.fromEntries(Object.entries(ORANGE_SPRITES).map(([id,src])=>{
 const image=new Image();image.src=src;return [id,image];
}));
const ORANGE_DIR_CELL=[0,3,1,2];
function orangeFrame(g,img,col,row,x=0,y=0){
 g.drawImage(img,col*172,row*144,172,144,x,y,172,144);
}
function orangeWalk(g,img,id,col,row){
 const side=row===1||row===2,a=ORANGE_DIR_CELL[row],step=col-2;
 if(id==='nami'&&drawDawnWalkFrame(g,id,row,step))return;
 if(row===0){orangeFrame(g,img,step,1);return;}
 const hip=id==='nami'?102:id==='buggy'?108:94;
 const bob=[0,1,0,1][step],sx=a*172;
 if(side){
  const shoe=id==='buggy'?122:id==='cabaji'?117:108;
  const swing=[7,2,-7,-2][step]*(row===1?-1:1);
  for(const back of [true,false]){
   const stride=back?-swing:swing,lift=(step<2)===back?5:0;
   g.save();if(back)g.globalAlpha=.79;
   g.transform(1,0,stride/(139-shoe),1,-shoe*stride/(139-shoe),0);
   g.drawImage(img,sx,shoe,172,144-shoe,0,shoe+bob,172,144-shoe-lift);
   g.restore();
  }
  g.drawImage(img,sx,0,172,shoe+1,0,bob,172,shoe+1);
  return;
 }
 const stride=[8,4,8,4][step];
 for(let leg=0;leg<2;leg++){
  const lift=(leg===0)===(step<2)?stride:0;
  const x=leg*86;
  g.drawImage(img,sx+x,hip,86,144-hip,x,hip+bob,86,144-hip-lift);
 }
 g.drawImage(img,sx,0,172,hip+1,0,bob,172,hip+1);
}
function orangeFrameDraw(g,img,id,col,row){
 const a=ORANGE_DIR_CELL[row];
 if(col>=2&&col<6){orangeWalk(g,img,id,col,row);return;}
 if(col>=16&&col<=17){orangeFrame(g,img,col-15,2);return;}
 if(col===18){orangeFrame(g,img,3,2);return;}
 if(col===19){orangeFrame(g,img,0,0);return;}
 if(col>=21){
  if(row===1){g.translate(172,0);g.scale(-1,1);}
  orangeFrame(g,img,row===0?2:row===3?3:0,2,0,[0,1,0,-1][col-21]);
  return;
 }
 if(col===20){orangeFrame(g,img,2,2);return;}
 if(col>=6&&col<=9||col>=12&&col<=15){
  const throwMove=col>=12,f=throwMove?col-12:col-6;
  if(row===3&&id!=='cabaji'){orangeFrame(g,img,a,0,[-2,0,3,0][f],[0,-1,1,0][f]);return;}
  if(row===1){g.translate(172,0);g.scale(-1,1);}
  orangeFrame(g,img,(id==='cabaji'?(throwMove?[0,3,3,0]:[0,1,2,0]):(throwMove?[0,1,2,0]:[0,0,3,0]))[f],2);
  return;
 }
 if(col===10)g.transform(1,0,-.05,1,7,2);
 if(col===11){g.translate(85,134);g.rotate(-Math.PI/2);g.translate(-85,-134);}
 orangeFrame(g,img,a,0);
}
function orangeAtlas(id){
 const img=ORANGE_IMAGES[id];
 if(!img?.naturalWidth)return npcAtlas(id==='nami'?'dawn_makino':SHELLS_CAST_IDS.zoro);
 return getAtlas('orange:'+id+':'+Number(dawnWalkReady(id)),()=>{
  const atlas=dawnPixelAtlas(86,72,ORANGE_ANIM,25,(g,col,row)=>orangeFrameDraw(g,img,id,col,row));
  atlas.frames={throw:4,split:2,rejoin:2,look:1,ride:4};
  return atlas;
 });
}
