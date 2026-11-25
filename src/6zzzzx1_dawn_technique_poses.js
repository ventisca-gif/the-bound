// Frames from the live character atlas remain the wind-up, recovery and vertical views.
const CREW_SIDE_POSES=Object.fromEntries(Object.entries({
 [SHELLS_CAST_IDS.luffy]:'luffy',[SHELLS_CAST_IDS.zoro]:'zoro',[SYRUP_USOPP]:'usopp',[BAR_SANJI]:'sanji'
}).map(([id,name])=>{
 const img=new Image();
 if(CREW_TECH_BITMAPS[name])img.src=CREW_TECH_BITMAPS[name];
 return [id,img];
}));
{const old=drawEnt;drawEnt=function(e,cx,cy){
 const pose=e.crewPose,img=CREW_SIDE_POSES[e.id];
 if(!pose||!img?.naturalWidth||e.anim!=='atk'||e.hp===0||G.t<pose.start+.16||G.t>pose.end-.12||
   (e.dir!=='left'&&e.dir!=='right'))return old.apply(this,arguments);
 const w=120,h=80;
 ctx.save();
 ctx.translate(Math.round(e.x-cx),Math.round(e.y-cy));
 if(e.dir==='left')ctx.scale(-1,1);
 ctx.drawImage(img,pose.index*240,0,240,160,-w/2,-h+2,w,h);
 ctx.restore();
};}
