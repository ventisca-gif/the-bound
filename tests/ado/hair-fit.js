(()=>{
 const assert=(v,m)=>{if(!v)throw Error(m)},out={frames:0,protectedPixels:0,dye:0},dirs=['down','left','right','up'];
 const render=(g,bt,dir,anim,f,dye)=>{const app={...DEF_APP,g,bt,hs:ADO_HS[g],hair:'rojo',r8Dye:dye?1:0,eyes:'celeste'},L=heroLook('bardo',app,{weapon:0},{},{});L.weapon=null;const p=new Pix(48,48);p.t=new Uint8Array(2304);p.tg=0;drawHero(p,L,dir,anim,f);return{L,p};};
 for(const g of ['f','m']){assert(BODY_T[g].length===5,'missing body');for(let bt=0;bt<5;bt++)for(const dir of dirs)for(const anim of ['idle','walk','atk','cast','hug','kiss','carry','carryw','sit','dance'])for(let f=0;f<(ANIMS[anim]?.[1]||1);f++){
  const {L,p}=render(g,bt,dir,anim,f,false),m=p.meta;assert(m.bt===bt,'body index changed');
  // Clothes, bare arms, weapons and legs must survive the new foreground/rear split.
  if(dir!=='up')for(let y=Math.ceil(m.chin+1);y<p.h;y++)for(let x=0;x<p.w;x++){const i=y*p.w+x;if(p._r8Bare[i]){assert(p.d[i]===p._r8Bare[i],`hair painted over body ${g}/${bt}/${dir}/${anim}`);out.protectedPixels++;}}
  p.outline(OUTL,false);const q=hdDetail(p,hdMats(L));assert(q.d.some((c,i)=>c&&q.t[i]===6),'no HD hair');
  // No disconnected background blobs or lost tail: every view has actual hair below the shoulders.
  let tail=0;for(let y=Math.ceil(m.torsoTop*2);y<q.h-4;y++)for(let x=0;x<q.w;x++)if(q.t[y*q.w+x]===6&&q.d[y*q.w+x])tail++;
  assert(tail>12,`missing tail ${g}/${bt}/${dir}/${anim}`);out.frames++;
 }
 for(let bt=0;bt<5;bt++)for(const dir of dirs){const a=render(g,bt,dir,'idle',0,false),b=render(g,bt,dir,'idle',0,true);assert(a.p.d.some((v,i)=>a.p.t[i]===6&&v!==b.p.d[i]),'custom dye ignored');assert(a.p.meta.hy===b.p.meta.hy,'dye moved head');out.dye++;}}
 assert(ADO_NATIVE_CACHE.size===8,'unbounded hair cache');
 return{ok:true,...out};
})()
