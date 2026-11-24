const SYRUP_CAST_ROWS=['usopp','kuro','jango','kaya','sham','buchi','merry','ninjin','piman','tamanegi'];
const SYRUP_ATTACK_ROWS=['usopp','kuro','jango','sham','buchi'];
const SYRUP_ATLAS_W=172,SYRUP_ATLAS_H=152;
const SYRUP_STANCE_COLUMNS=[0,2,3,1];
const SYRUP_IMAGES=[new Image(),new Image(),new Image()];
SYRUP_IMAGES[0].src=SYRUP_STANCES;
SYRUP_IMAGES[1].src=SYRUP_STRIKES;
SYRUP_IMAGES[2].src=SYRUP_USOPP_STRIKES;

function syrupAtlas(id){
 const kind=id.replace('syrup_',''),index=SYRUP_CAST_ROWS.indexOf(kind);
 const [image,strikes,usoppStrikes]=SYRUP_IMAGES;
 if(index<0||!image.naturalWidth)return npcAtlas(id==='syrup_kuro'?SHELLS_CAST_IDS.zoro:'dawn_makino');
 const W=SYRUP_ATLAS_W,H=SYRUP_ATLAS_H,hasStrikes=!!(kind==='usopp'?usoppStrikes:strikes).naturalWidth;
 const strike=SYRUP_ATTACK_ROWS.indexOf(kind);
 return getAtlas('syrup:'+id+':'+Number(hasStrikes),()=>{
  const result=dawnPixelAtlas(W/2,H/2,DAWN_ALT_ANIMS,12,(g,col,row)=>{
   const sx=SYRUP_STANCE_COLUMNS[row]*W,sy=index*H,body=H-6;
   const frame=(dx=0,dy=0)=>g.drawImage(image,sx,sy,W,H,dx,dy,W,H);
   if(col===11){
    g.translate(W/2,body);g.rotate(-Math.PI/2);g.scale(.72,.72);g.translate(-W/2,-body);frame();return;
   }
   if(col===10){g.transform(1,0,-.055,1,7,2);frame();return;}
   if(col<2){frame(0,col);return;}
   if(col>=6){
    const phase=col-6;
    if(hasStrikes&&kind==='usopp'){
     g.drawImage(usoppStrikes,phase*W,row*H,W,H,0,0,W,H);return;
    }
    if(hasStrikes&&strike>=0&&(row===0||phase===2)){
     const pose=row===0?phase:row===3?4:row===1?5:6;
     g.drawImage(strikes,pose*W,strike*H,W,H,0,0,W,H);return;
    }
    const lateral=row===1?-1:row===2?1:0,forward=row===3?-1:1;
    g.translate(W*.5+lateral*[0,-4,8,2][phase],body-forward*[0,1,5,0][phase]);
    g.transform(1,0,lateral*[0,-.09,.15,.03][phase],1,0,0);
    g.translate(-W*.5,-body);frame();return;
   }
   const step=col-2,bob=step%2,side=row===1||row===2;
   const cut=body-(kind==='usopp'?41:kind==='buchi'?16:kind==='kaya'?17:index>=7?20:28);
   for(let leg=0;leg<2;leg++){
    const phase=(leg===0)===(step<2),lift=phase?(step%2===0?7:3):0;
    const x=leg*W/2,shift=side?(phase?-1:1)*(step%2===0?6:3):0;
    g.drawImage(image,sx+x,sy+cut,W/2,H-cut,x+shift,cut+bob,W/2,H-cut-lift);
   }
   g.drawImage(image,sx,sy,W,cut+1,0,bob,W,cut+1);
  });
  result.frames={idle:2,walk:4,atk:4,hurt:1,dead:1};
  result.combatWidth=kind==='buchi'?62:47;
  return result;
 });
}
