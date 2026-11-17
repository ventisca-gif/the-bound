// Attack VFX are a separate pixel layer. No damage callbacks, projectiles, timers or combat mutations.
const R133_FX=new Map();
function r133Effect(S,dir,f){const key=S.id+':'+dir+':'+f;let cv=r133Read(R133_FX,key);if(cv)return cv;const p=new Pix(96,96),P=pal(R133_THEMES[S.theme]),A=pal(R133_THEMES[S.theme==='void'?'crystal':S.theme==='fire'?'gold':'ice']);const phase=[.35,1,.7,.12][f%4],dv={down:[0,1],left:[-1,0],right:[1,0],up:[0,-1]}[dir]||[0,1],x=48+dv[0]*21,y=62+dv[1]*13,r=5+phase*9;
 const family=S.family;
 if(['beast','human','rabbit','doll'].includes(family)){
  const needle=family==='doll',rays=family==='beast'||family==='rabbit'?3:1;for(let j=0;j<rays;j++){const off=(j-(rays-1)/2)*5;for(let k=0;k<10;k++){const t=k/9,xx=x+(dv[1]||.3)*(t*20-10)+off,yy=y-(dv[0]||.3)*(t*20-10)+Math.sin(t*Math.PI)*r;p.set(xx,yy,P[2]);p.set(xx+dv[1],yy-dv[0],A[3]);if(k%3===0)p.set(xx+2,yy+1,A[4]);}if(needle){p.line(x-dv[0]*9,y-dv[1]*9,x+dv[0]*13,y+dv[1]*13,A[3]);}}
 }else if(['golem','dummy','snowman','toad','beetle'].includes(family)){
  for(let j=0;j<10;j++){const a=j*Math.PI/5,xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r*.5;p.line(x+Math.cos(a)*(r-3),y+Math.sin(a)*(r-3)*.5,xx,yy,A[j%2?2:3]);if(j%2===0)p.rect(xx-1,yy-3,2,3,P[2]);}for(let j=0;j<3;j++)p.line(x-8+j*8,y+2,x-11+j*8,y+10,A[1]);
 }else if(['crab','scorpion','spider','snake','lizard','axolotl','fish','octopus','ray'].includes(family)){
  for(const s of[-1,1]){r133Poly(p,[[x+s*(r+1),y-8],[x+s*3,y-2],[x+s*(r-2),y+7],[x+s*1,y+4],[x+s*2,y-4]],A[3]);p.line(x+s*(r+2),y-7,x+s*5,y-3,P[2]);}if(['scorpion','spider','snake'].includes(family))for(let j=0;j<3;j++)p.ell(x-6+j*6,y+10+(j%2)*3,1.5,2,P[3]);
 }else{
  for(let j=0;j<12;j++){const a=j*Math.PI/6+f*.3;p.ell(x+Math.cos(a)*r,y+Math.sin(a)*r*.7,1+(j%3===0?1:0),1,A[j%3===0?4:2]);}p.ell(x,y,3+phase*2,3+phase*2,P[2]);p.ell(x-1,y-1,2,2,A[4]);if(['plant','mushroom','slime'].includes(family))for(let j=0;j<4;j++)p.ell(x-9+j*6,y+9,2,2,P[3]);
 }
 cv=p.canvas();R133_FX.set(key,{value:cv,bytes:96*96*4});while(R133_FX.size>80)R133_FX.delete(R133_FX.keys().next().value);return cv;}
function r133DrawFx(e,cx,cy){const id=e?.atlas?.r133;if(!id||e.anim!=='atk'||e.dying||e.remove)return;const S=R133_OF.get(id),A=e.atlas,sc=e.scale||1,cv=r133Effect(S,e.dir||'down',e.af||0),s=Math.min((A.fw*2-4)/96,(A.fh*2-4)/96)/2*sc;ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalAlpha=.9;ctx.drawImage(cv,Math.round(e.x-cx-48*s),Math.round(e.y-cy-(e.z||0)-84*s),96*s,96*s);ctx.restore();}
{const prev=drawEnt;drawEnt=function(e,cx,cy){if(e?.dir==='up')r133DrawFx(e,cx,cy);const r=prev.apply(this,arguments);if(e?.dir!=='up')r133DrawFx(e,cx,cy);return r;};}
