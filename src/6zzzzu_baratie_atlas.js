const BAR_ASSETS={};
const mihawkImage=new Image();
mihawkImage.src=BAR_MIHAWK_IMAGE;
for(const [id,url] of Object.entries({
 combat:BAR_COMBAT_IMAGE,social:BAR_SOCIAL_IMAGE,ship:BAR_SHIP_IMAGE,
 guests:typeof BAR_GUEST_IMAGE==='undefined'?null:BAR_GUEST_IMAGE,
 strikes:typeof BAR_ATTACK_IMAGE==='undefined'?null:BAR_ATTACK_IMAGE
})){
 if(!url)continue;
 const im=new Image();im.src=url;BAR_ASSETS[id]=im;
}
const BAR_ART_ROWS={
 combat:['sanji','pearl','gin','krieg'],social:['mihawk','zeff','patty','carne'],guests:['johnny','yosaku','fullbody']
};
function baratieAtlas(id){
 if(id==='baratie_mihawk'&&mihawkImage.naturalWidth)return mihawkAtlas();
 const kind=id.replace('baratie_','');
 const section=Object.keys(BAR_ART_ROWS).find(k=>BAR_ART_ROWS[k].includes(kind));
 const image=BAR_ASSETS[section],ready=!!image?.naturalWidth;
 if(!ready)return npcAtlas('dawn_makino');
 const W=164,H=148,base=H-6,idx=BAR_ART_ROWS[section].indexOf(kind);
 const strikes=section==='combat'&&BAR_ASSETS.strikes?.naturalWidth?BAR_ASSETS.strikes:null;
 return getAtlas(id+':'+Number(!!strikes),()=>{
  const result=dawnPixelAtlas(W/2,H/2,DAWN_ALT_ANIMS,12,(g,col,row)=>{
   const sx=[0,2,3,1][row]*W,sy=idx*H,side=row===1||row===2,dx=row===1?-1:row===2?1:0;
   const frame=(dy=0)=>g.drawImage(image,sx,sy,W,H,0,dy,W,H);
   if(col<2){frame(col);return;}
   if(col===11){
    g.translate(W*.45,base);g.rotate(-Math.PI/2);g.scale(.77,.77);g.translate(-W/2,-base);frame();return;
   }
   if(col===10){g.transform(1,0,-.095,1,12,3);frame();return;}
   if(col>=6){
    const phase=col-6;
    if(strikes&&(phase===1||phase===2)){
     g.drawImage(strikes,sx,sy,W,H,dx*(phase-1)*5,-(phase-1)*3,W,H);return;
    }
    const lean=[-.015,-.06,.12,.045][phase];
    g.transform(1,0,lean*(dx||1),1,-lean*(dx||1)*base,[0,0,-4,0][phase]);frame();return;
   }
   const step=col-2,bob=step%2,cut=base-({sanji:42,gin:39,mihawk:27,pearl:21,krieg:28}[kind]||25);
   for(let leg=0;leg<2;leg++){
    const lead=(leg===0)===(step<2),lift=lead?(bob?3:8):0,partW=W/2,x=leg*partW;
    const shift=side?(lead?-1:1)*(bob?3:6):0,lean=shift/(base-cut);
    g.save();g.transform(1,0,lean,1,-lean*(cut+bob),0);
    g.drawImage(image,sx+x,sy+cut,partW,H-cut,x,cut+bob,partW,H-cut-lift);
    g.restore();
   }
   g.drawImage(image,sx,sy,W,cut+1,0,bob,W,cut+1);
  });
  result.frames={idle:2,walk:4,atk:4,hurt:1,dead:1};
  result.combatWidth=kind==='pearl'||kind==='krieg'?58:42;
  return result;
 });
}
DL_HOOKS.push((list,cx,cy)=>{
 if(!G.map?.baratie||!BAR_ASSETS.ship.naturalWidth)return;
 const im=BAR_ASSETS.ship,[x,y]=dawnPx(barAt(24,-1));
 if(x<cx-im.width||x>cx+VW+im.width||y<cy-20||y>cy+VH+im.height)return;
 list.push({type:'xdraw',x,y,noShadow:true,draw:()=>ctx.drawImage(im,Math.round(x-cx-im.width/2),Math.round(y-cy-im.height+8))});
});

function mihawkAtlas(){
 const W=208,H=166,feet=H-5;
 const animations={...DAWN_ALT_ANIMS,sword:12};
 return getAtlas('baratie_mihawk:adult',()=>{
  const atlas=dawnPixelAtlas(W/2,H/2,animations,16,(g,col,dir)=>{
   const face=dir===1?-1:dir===2?1:0;
   const strike=col>=12||col>=6&&col<10;
   const phase=col>=12?col-12:col-6;
   const draw=(pose=0,dx=0,dy=0)=>g.drawImage(mihawkImage,dir*W,pose*H,W,H,dx,dy,W,H);
   if(strike){
    const pose=col>=12?2:1;
    if(phase===0){
     g.transform(1,0,(face||1)*.05,1,-(face||1)*.05*feet,0);
     draw();return;
    }
    if(phase===3&&pose===1){draw();return;}
    const shift=face*(phase===2?7:phase===3?1:-4);
    draw(pose,shift,phase===2?-3:1);return;
   }
   if(col===10){g.transform(1,0,-.06,1,.06*feet,2);draw();return;}
   if(col===11){g.translate(W/2,feet);g.rotate(-Math.PI/2);g.scale(.71,.71);g.translate(-W/2,-feet);draw();return;}
   if(col<2){draw(0,0,col);return;}
   const footStart=feet-31;
   for(let leg=0;leg<2;leg++){
    const x=leg*W/2,bob=col%2,leading=(leg===0)===(col<4);
    const step=leading?(bob?3:7):0,slide=(leading?1:-1)*face*(bob?2:5);
    g.save();
    g.transform(1,0,slide/(H-footStart),1,-slide*(footStart+bob)/(H-footStart),0);
    g.drawImage(mihawkImage,dir*W+x,footStart,W/2,H-footStart,x,footStart+bob,W/2,H-footStart-step);
    g.restore();
   }
   g.drawImage(mihawkImage,dir*W,0,W,footStart+1,0,col%2,W,footStart+1);
  });
  atlas.frames={idle:2,walk:4,atk:4,sword:4,hurt:1,dead:1};
  atlas.combatWidth=42;
  return atlas;
 });
}
