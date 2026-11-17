// Approved orange gi: existing cosmetics, body shapes, wardrobe and comic shop.
const GI_ORANGE = P5(['#572309','#84320d','#b44813','#d3631c','#eb8833']);
const GI_BLUE = P5(['#060e29','#0a1c49','#14326e','#234c99','#4774bd']);
const GI_PARTS = {body:'c_gi_ref_top',legs:'c_gi_ref_pants',feet:'c_gi_ref_bare'};
fitKind('body','gi_ref',(p,A,s)=>{
 const {tx0,tw,torsoTop:y,th,cx,side,up,d}=A, R=tx0+tw-1,m=s.m,b=s.s,sk=A.sk;
 // Keep the existing silhouette, waist and bust. Only paint inside the torso.
 if(!up){
  const depth=Math.min(th-3,A.fem?3:4);
  for(let j=0;j<=depth;j++){
   const half=Math.max(0,Math.round((depth-j)*.65));
   const center=side?cx+d:cx-1;
   for(let x=center-half;x<=center+(side?0:half);x++)if(x>=tx0&&x<=R&&p.get(x,y+j))p.set(x,y+j,sk[x<center?2:1]);
   const edge=center-half-1;if(edge>=tx0)p.set(edge,y+j,m[1]);
   if(!side&&center+half+1<=R)p.set(center+half+1,y+j,m[3]);
  }
  p.line(side?cx+d:tx0+1,y+1,side?cx:cx+1,y+th-3,m[1]);
  if(!side){p.set(cx-1,y+1,sk[2]);p.set(cx,y+1,sk[2]);}
 }else{p.hl(tx0+1,y,tw-2,m[1]);p.hl(tx0+2,y+1,tw-4,m[2]);}
 // Wide wrapped blue sash; its tails are drawn after the arms.
 for(let j=th-2;j<th;j++)for(let x=tx0;x<=R;x++)if(p.get(x,y+j))p.set(x,y+j,b[j===th-2?3:1]);
},{skin:true});
cosm(GI_PARTS.body,L2('Gi naranja · chaqueta','Orange gi · jacket'),'body',()=>({k:'gi_ref',m:GI_ORANGE,s:GI_BLUE,giRef:1}),{src:L2('Tienda de cómics de Akihabara','Akihabara comic shop')});
cosm(GI_PARTS.legs,L2('Gi naranja · pantalón','Orange gi · trousers'),'legs',()=>({k:'baggy',m:GI_ORANGE,giRef:1}),{src:'Akihabara'});
cosm(GI_PARTS.feet,L2('Gi naranja · pies descalzos','Orange gi · bare feet'),'feet',app=>{const a=SKINS[(app&&app.skin)||0];return {k:'shoes',m:[a[0],a[0],a[1],a[2],a[3]],giRef:1};},{src:'Akihabara'});
{const previous=drawHero;drawHero=function(p,L,dir,anim,f){
 const result=previous.apply(this,arguments);if(!L?.top?.giRef||!p.meta)return result;
 const A=p.meta, ix=new Map(GI_ORANGE.map((c,i)=>[c,i]));
 const before=p._r8Bare?p.d.slice():null, oldTag=p.tg;p.tg=3;
 // Bare arms follow the original pose, hand position and animation tags.
 for(let y=0;y<p.h;y++)for(let x=0;x<p.w;x++){
  const i=y*p.w+x;if(p.t&&p.t[i]===3){const k=ix.get(p.d[i]);if(k!==undefined)p.set(x,y,A.sk[[0,0,1,2,3][k]]);}
 }
 p.tg=oldTag;
 const y=A.torsoTop+A.th-1, center=A.cx-1;
 if(!A.up){
  const sway=anim==='walk'?Math.round(Math.sin(f*Math.PI/2)):0;
  const tag=p.tg;p.tg=2;
  p.rect(center-1,y,3,2,GI_BLUE[1]);p.set(center,y,GI_BLUE[4]);
  for(let j=1;j<=Math.min(5,A.base-y-3);j++){
   p.set(center-1+Math.round(j/3)+sway,y+j,GI_BLUE[2]);
   p.set(center+1+Math.round(j/3)+sway,y+j,GI_BLUE[3]);
  }p.tg=tag;
 }
 if(before)for(let i=0;i<p.d.length;i++)if(p.d[i]!==before[i]){p._r8Bare[i]=p.d[i];if(p._r8Tags&&p.t)p._r8Tags[i]=p.t[i];}
 return result;
};}
// Fine emblem belongs to this costume only; other clothing and the face stay intact.
function giBadge(q,M){
 if(M.side)return;
 const scale=2, x=M.up?M.cx*scale-4:(M.tx0+M.tw-3)*scale-2,y=(M.torsoTop+2)*scale;
 const K=C('#15161a'),W=C('#f5eee0');
 q.ell(x+3,y+3,3.4,3.4,K);q.ell(x+3,y+3,2.5,2.5,W);
 // Compact pixel monogram; its strokes fit the actual HD sprite resolution.
 for(const [dx,dy]of [[2,1],[3,1],[1,2],[3,2],[4,2],[2,3],[3,3],[4,3],[1,4],[3,4],[4,4],[2,5],[3,5]])q.set(x+dx,y+dy,K);
}
{const previous=hdDetail;hdDetail=function(p,mats){const q=previous.apply(this,arguments);if(p._giRef&&p.meta)giBadge(q,p.meta);return q;};}
{const previous=drawHero;drawHero=function(p,L){if(L?.top?.giRef&&!p.t){p.t=new Uint8Array(p.w*p.h);p.tg=0;}const r=previous.apply(this,arguments);p._giRef=!!L?.top?.giRef;return r;};}

// Shop: use the existing cosmetic item/wardrobe path; never charge twice.
const GI_PRICE = 24000;
for(const id of Object.values(GI_PARTS)) {
 COSM[id].src=L2('Tendero de cómics, oeste de Akihabara (Japón)','Comic shopkeeper, western Akihabara (Japan)');
 it('cosi_'+id,{n:COSM[id].n,t:'cos',cos:id,price:GI_PRICE/3,icon:['hanger'],rar:3});
}
DLG_HOOKS.push((npc,opts)=>{
 const P=G.P;if(!P||npc.id!=='jp_comic_st')return;
 const missing=()=>Object.values(GI_PARTS).filter(id=>!(P.wardrobe||[]).includes(id));
 const cost=missing().length*GI_PRICE/3;
 opts.unshift({label:'🥋 '+L2('Gi naranja completo','Complete orange gi')+' · '+(cost?cost.toLocaleString()+L2(' oro',' gold'):L2('Ya lo tienes','Already owned')),icon:['hanger'],fn:()=>{
  const ids=missing(),price=ids.length*GI_PRICE/3;
  if(!ids.length){typeText(L2('Ya tienes el gi completo en tu armario.','You already own the complete gi in your wardrobe.'));return;}
  if(P.gold<price){typeText(L2('No te llega el oro.','Not enough gold.'));return;}
  P.gold-=price;for(const id of ids)giveItem('cosi_'+id,1);sfx('coin');markDirty(true);
  typeText(L2('¡Gi naranja al armario! Incluye chaqueta, pantalón y pies descalzos. Equípalo desde Vestuario.','Orange gi added to your wardrobe! Includes jacket, trousers and bare feet. Equip it in Wardrobe.'));
 }});
});
if(typeof GSIS!=='undefined')GSIS.push(['jp_gi','🥋 '+L2('Gi naranja de Akihabara','Akihabara orange gi'),()=>[
 L2('El tendero de la tienda de cómics, al oeste de Akihabara (Japón), vende el gi naranja completo por 24.000 de oro.','The comic shopkeeper in western Akihabara (Japan) sells the complete orange gi for 24,000 gold.'),
 L2('Tres piezas para Vestuario: chaqueta sin mangas con fajín azul, pantalón y pies descalzos. Para las cinco estructuras femeninas y las cinco masculinas; solo cambia el aspecto.','Three Wardrobe pieces: sleeveless jacket with blue sash, trousers and bare feet. Fits all five female and five male structures; appearance only.')],()=>({loc:[127,52],t:L2('Tienda de cómics · Gi naranja','Comic shop · Orange gi'),m:'japon'})]);
