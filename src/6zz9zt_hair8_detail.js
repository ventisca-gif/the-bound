// Approved detailed boards: synchronous RGB layers, original bodies and animation anchors.
// Entries are appended; the original eight previews and every existing saved hairstyle keep their index.
const R8_HD_CACHE = new Map();
function r8HDFrame(id, dir) {
 const key = id + '_' + ({down:0,up:1,left:2,right:3}[dir] || 0);
 if (R8_HD_CACHE.has(key)) return R8_HD_CACHE.get(key);
 const D = R8_HD_DATA[key]; if (!D) return null;
 const pixels = new Uint32Array(D.w * D.h), kinds = new Uint8Array(D.w * D.h), colors = D.pal.map(h=>C(h));
 const raw = atob(D.rle); let at = 0;
 for (let i=0;i<raw.length;i+=3) { const n=raw.charCodeAt(i), color=colors[raw.charCodeAt(i+1)], k=raw.charCodeAt(i+2); for(let j=0;j<n;j++,at++) { pixels[at]=k?color:0; kinds[at]=k; } }
 const F = Object.assign({},D,{pixels,kinds}); R8_HD_CACHE.set(key,F); return F;
}
function r8HDPaint(p, m, L, dir, anim, f, scale) {
 const F=r8HDFrame(L.hs.r8HD,dir); if(!F) return;
 const hx=(m.hx+.5)*scale, hy=m.hy*scale, rx=m.hrx*scale, ry=m.hry*scale;
 let sx=rx/F.radius, sy=ry/F.radius;
 // Keep tall spikes inside the original atlas cell, anchored at the same head centre.
 const upper=Math.min(sy,(hy-scale)/Math.max(1,F.hy));
 const bottomScale=Math.min(sy,(p.h-2*scale-hy)/Math.max(1,F.h-F.hy));
 const sway=(anim==='walk'||anim==='dance')?Math.sin(f*Math.PI/2)*.45*scale:0;
 const top=Math.max(0,Math.floor(hy-F.hy*upper)), bottom=Math.min(p.h-1,Math.ceil(hy+(F.h-F.hy)*bottomScale));
 const left=Math.max(0,Math.floor(hx-F.cx*sx)-1), right=Math.min(p.w-1,Math.ceil(hx+(F.w-F.cx)*sx)+1);
 const T=ahPal(L.hair), tg=p.tg;
 for(let y=top;y<=bottom;y++) {
  const ys=y<hy?upper:bottomScale, fy=Math.floor(F.hy+(y+.5-hy)/ys); if(fy<0||fy>=F.h)continue;
  const tail=Math.max(0,(y-hy)/Math.max(1,p.h-hy)), dx=sway*tail;
  for(let x=left;x<=right;x++) {
   const fx=Math.floor(F.cx+(x+.5-hx-dx)/sx); if(fx<0||fx>=F.w)continue;
   const i=fy*F.w+fx,k=F.kinds[i];if(!k)continue;
   // Long hair is behind the torso from the front/profile, and over it when seen from behind.
   if(dir!=='up'&&y>=m.torsoTop*scale&&p.get(x,y))continue;
   let c=F.pixels[i];
   if(k===1&&!L.r8Original) { const light=(uR(c)*.26+uG(c)*.57+uB(c)*.17)/255;const t=clamp(light*5,0,5),a=Math.floor(t);c=uMix(T[a],T[Math.min(5,a+1)],t-a); }
   else if(k===3) { const skin=L.skin||SKINS[0],v=clamp((uR(c)+uG(c)+uB(c))/765,0,1),t=v*3,a=Math.floor(t);c=uMix(skin[a],skin[Math.min(3,a+1)],t-a); }
   if(p.t)p.tg=k===3?5:6;p.set(x,y,c);
  }
 }
 if(p.t)p.tg=tg;
}
for(const [id,n] of REF8) for(const T of [HS_F,HS_M]) {
 T.push({n:L2(n+' · detallado',n+' · detailed'),cap:'round',bang:'full',side:4,back:12,r8HD:id,r8Base:id});
}
{const previous=heroLook;heroLook=function(){const L=previous.apply(this,arguments);if(L.hs&&L.hs.r8HD)L.mirror=false;return L;};}
{const previous=drawHero;drawHero=function(p,L,dir,anim,f){
 if(!L||!L.hs||!L.hs.r8HD||L.head)return previous.apply(this,arguments);
 const bald=Object.assign({},L,{hs:Object.assign({},L.hs,{cap:'bald',bang:'none',tail:null,back:0,side:0,r8HD:null,r8Base:null})});
 const result=previous.call(this,p,bald,dir,anim,f);if(!p.meta)return result;
 // The HD pass starts from the original body, so it does not double coarse hair pixels.
 p._r8Bare=p.d.slice();p._r8Tags=p.t?p.t.slice():null;p._r8={L,dir,anim,f};
 r8HDPaint(p,p.meta,L,dir,anim,f,1);return result;
};}
{const previous=hdDetail;hdDetail=function(p,mats){
 if(!p._r8)return previous.apply(this,arguments);
 const bare=new Pix(p.w,p.h);bare.d=p._r8Bare;bare.t=p._r8Tags||new Uint8Array(p.w*p.h);bare.tg=p.tg;bare.meta=p.meta;
 bare.outline(OUTL,false);const q=previous.call(this,bare,mats),r=p._r8;
 r8HDPaint(q,p.meta,r.L,r.dir,r.anim,r.f,2);return q;
};}
