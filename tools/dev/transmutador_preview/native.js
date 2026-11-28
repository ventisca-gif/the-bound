// Opt-in visual prototype. Loaded only by the preview, never by build.py or the updater.
(()=>{
 if(window.TM_PREVIEW)return;
 const WHITE=P5(['#767e7c','#acb4b0','#e4e7e1','#f6f6ef','#ffffff']);
 const BLACK=P5(['#060909','#101514','#171d1b','#2a312e','#47504a']);
 const OLIVE=P5(['#242b18','#3c4528','#58613a','#778151','#939d68']);
 const SHOE=P5(['#101510','#343c33','#e4e7df','#ffffff','#ffffff']);
 const MODEL={app:normApp({g:'m',bt:1,hs:1,hair:'castano',eyes:'verde',skin:0,top:[1,'blanco'],bot:[3,'oliva'],shoe:[1,'blanco']}),base:true,gear:{},cos:{},anim:'walk'};
 CLASSES.transmutador={...CLASSES.guerrero,n:'Transmutador',desc:'Prueba visual del atuendo y reloj. Personalización, prendas y armaduras del juego.',color:'#8ed344'};
 hookAround('gearVis',(next,cls,slot,t)=>next(cls==='transmutador'?'guerrero':cls,slot,t));
 fitKind('body','tm_classic',(p,A,s)=>{
  const {tx0,tw,torsoTop:ty,th,cx,side,up}=A;
  // Short white T-shirt, continuous black centre stripe and black round collar; no fantasy belt.
  const mid=Math.round(cx-(side?1:0)),sw=Math.max(2,Math.round(tw*.27));
  for(let y=ty;y<ty+th;y++)for(let x=tx0;x<tx0+tw;x++)p.set(x,y,WHITE[x===tx0?3:x===tx0+tw-1?1:2]);
  if(!side)for(let y=ty+1;y<ty+th;y++)for(let x=mid-Math.ceil(sw/2);x<mid+Math.floor(sw/2);x++)p.set(x,y,BLACK[x<mid?2:3]);
  p.hl(tx0+1,ty,tw-2,BLACK[1]);
  if(!side){p.hl(mid-2,ty+1,4,BLACK[1]);if(!up)for(const sg of [-1,1])p.set(mid+sg*(Math.floor(tw/2)-1),ty+th-2,WHITE[1]);}
  // Anatomical sleeve caps/cuffs follow exactly the game's shoulder and arm pose.
  const ps=heroPose(A.dir,A.anim,A.f,{}),arms=side?[[A.cx-2,ps.rax,ps.ray]]:[[A.shL,ps.lax,ps.lay],[A.shR,ps.rax,ps.ray]];
  for(const [sx,dx,dy] of arms){const n=Math.max(1,Math.round(A.al*.42));for(let k=0;k<=n;k++)for(let i=0;i<A.aw;i++){const t=k/Math.max(1,A.al);p.set(Math.round(sx+dx*t)+i,Math.round(A.shY+k+dy*t),k===n?BLACK[1]:WHITE[i===0?3:2]);}}
 });
 fitKind('legs','tm_cargo',(p,A,s)=>{
  const ps=heroPose(A.dir,A.anim,A.f,{}),lw=A.lw,c=A.cx,legs=A.side?[[c-1+A.d*ps.rfx,ps.rfy,true],[c-1+A.d*ps.lfx,ps.lfy,false]]:[[c-Math.ceil(A.tw/2)+1,ps.lfy,false],[c+Math.floor(A.tw/2)-lw,ps.rfy,false]];
  for(const [lx,ly,far] of legs){const xx=Math.round(A.side?lx-(lw>>1):lx),bottom=A.base+ly-2;
   // Slightly wider cargo legs, separate moving feet; pockets and side seams.
   for(let y=A.legTop;y<bottom;y++)for(let x=xx-1;x<=xx+lw;x++)p.set(x,y,OLIVE[far?1:x===xx-1?3:x===xx+lw?1:2]);
   const py=A.legTop+Math.max(1,Math.floor((bottom-A.legTop)*.3));if(bottom-py>2){p.hl(xx-1,py,lw+1,OLIVE[1]);p.hl(xx-1,py+1,lw+1,OLIVE[3]);p.set(xx-1,py+2,OLIVE[1]);p.set(xx+lw-1,py+2,OLIVE[1]);}
   p.hl(xx-1,bottom-1,lw+2,OLIVE[1]);
  }
 });
 fitKind('feet','tm_sneakers',(p,A,s)=>{
  const ps=heroPose(A.dir,A.anim,A.f,{}),lw=A.lw,c=A.cx,legs=A.side?[[c-1+A.d*ps.rfx,ps.rfy],[c-1+A.d*ps.lfx,ps.lfy]]:[[c-Math.ceil(A.tw/2)+1,ps.lfy],[c+Math.floor(A.tw/2)-lw,ps.rfy]];
  for(const [lx,ly]of legs){const xx=Math.round(A.side?lx-(lw>>1):lx),b=A.base+ly;for(let x=xx-1;x<=xx+lw;x++){p.set(x,b-2,SHOE[x===xx-1||x===xx+lw?1:3]);p.set(x,b-1,SHOE[x===xx||x===xx+lw?1:2]);p.set(x,b,SHOE[0]);}}
 });
 hookAfter('heroLook',(L,cls,app,gear={},cos={})=>{
  if(cls!=='transmutador')return;
  if(MODEL.base){if(!gear.body&&!cos.body)L.top={k:'tm_classic',m:WHITE,s:BLACK};if(!gear.legs&&!cos.legs)L.bot={k:'tm_cargo',m:OLIVE,s:OLIVE};if(!gear.feet&&!cos.feet)L.feet={k:'tm_sneakers',m:SHOE};}
  if(L.head?.k==='of_bucket'&&!L.head.s)L.head={...L.head,s:L.head.m};
  L.tmDevice=true;L.mirror=false;L.weapon=null;L.back=cos.back?L.back:null;return L;
 });
 function wrist(A,L){const ps=heroPose(A.dir,A.anim,A.f,L),aw=A.aw;
  if(!A.side)return {x:(A.up?A.shL:A.shR)+aw/2+ps.lax,y:A.shY+A.al+ps.lay-2};
  const near=A.dir==='left';return {x:(near?A.cx-2:A.cx-1-A.d)+aw/2+(near?ps.rax:ps.lax),y:A.shY+A.al+(near?ps.ray:ps.lay)-2};
 }
 function device(p,A,L,scale){const w=wrist(A,L),x=Math.round(w.x*scale),y=Math.round(w.y*scale),r=scale===1?2:4,tg=p.tg;p.tg=3;
  // The left wrist is drawn independently in all four directions; the right view is never a mirrored left watch.
  const set=(dx,dy,c)=>{const xx=x+dx,yy=y+dy,k=yy*p.w+xx;if(xx<0||yy<0||xx>=p.w||yy>=p.h)return;const tag=p.t?.[k];if(tag&&tag!==3)return;p.set(xx,yy,c);};
  for(let dy=-r;dy<=r;dy++)for(let dx=-r-1;dx<=r+1;dx++){if(Math.abs(dx)===r+1&&Math.abs(dy)===r)continue;set(dx,dy,C(Math.abs(dy)===r?'#999f96':Math.abs(dx)>=r?'#363e36':'#111811'));}
  for(let dx=-r;dx<=r;dx++){set(dx,-r+1,C('#d0d3c5'));set(dx,r-1,C('#aeb5a6'));}
  if(scale===1){set(0,0,C('#82d638'));set(1,0,C('#c4f86b'));}else{for(let yy=-1;yy<=1;yy++)for(let xx=-1;xx<=1;xx++)set(xx,yy,C(xx<0?'#5fae25':'#a4ec40'));set(-2,-2,C('#b4bda8'));set(2,2,C('#76826e'));}
  p.tg=tg;
 }
 hookAround('drawHero',(next,p,L,...a)=>{
  if(!L.tmDevice)return next(p,L,...a);if(!p.t)p.t=new Uint8Array(p.w*p.h);
  const classic=L.top.k==='tm_classic',old=FITK.body.tunic;let r;
  try{if(classic)FITK.body.tunic=FITK.body.tm_classic;r=next(p,classic?{...L,top:{...L.top,k:'tunic'}}:L,...a);}finally{if(classic){if(old)FITK.body.tunic=old;else delete FITK.body.tunic;}}
  const A=p.meta;if(A){if(classic){const ps=heroPose(A.dir,A.anim,A.f,L),arms=A.side?[[A.cx-1-A.d,ps.lax,ps.lay],[A.cx-2,ps.rax,ps.ray]]:[[A.shL,ps.lax,ps.lay],[A.shR,ps.rax,ps.ray]];
   for(const [sx,dx,dy]of arms){const t=.4,y=Math.round(A.shY+A.al*t+dy*t);for(let i=0;i<A.aw;i++){const x=Math.round(sx+dx*t)+i;if(p.t[y*p.w+x]===3)p.set(x,y,BLACK[1]);}}}
   device(p,A,L,1);}
  return r;
 });
 hookAround('hdOrn',(next,q,p,L)=>next(q,p,L.tmDevice&&L.top.k==='tm_classic'?{...L,top:{...L.top,k:'swim'}}:L));
 hookAfter('hdOrn',(_,q,p,L)=>{if(!L.tmDevice||!p.meta)return;device(q,p.meta,L,2);});
 function look(app=MODEL.app,gear=MODEL.gear,cos=MODEL.cos){return heroLook('transmutador',app,gear,cos,{});}
 function frame(app,dir,f,gear={},cos={},hd=true){const L=look(app,gear,cos),p=new Pix(48,48);p.t=new Uint8Array(2304);drawHero(p,L,dir,'walk',f);p.outline(OUTL,false);if(!hd)return p;const q=hdDetail(p,hdMats(L));hdOrn(q,p,L);return q;}
 const warnings=[];hookBefore('errOnce',(tag,e)=>{if(String(tag).startsWith('fit:'))warnings.push({tag,message:String(e?.message||e)});});
 window.TM_PREVIEW={warnings,model:MODEL,look,frame,wrist,version:'visual-1',meta:()=>({bodies:{m:BODY_T.m.length,f:BODY_T.f.length},hairs:{m:HS_M.length,f:HS_F.length},dyes:HAIR_ORDER.length,cosmetics:Object.keys(COSM).length,armorMax:Math.max(...Object.values(ITEMS).filter(i=>i.t==='armor').map(i=>i.lv||0)),levelMax:MAXLV,tiers:TIER.length-1})};
})();
