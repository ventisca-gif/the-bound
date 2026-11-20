// Cosmetic auras live separately from P.auras, which already holds temporary combat buffs.
const COS_AURAS={
 violeta:{n:L2('Energía violeta','Violet energy'),d:L2('Llamas de energía, pulsos y chispas.','Energy flames, pulses and sparks.'),pr:25000},
 tormenta:{n:L2('Tormenta celeste','Azure storm'),d:L2('Rayos vivos alrededor del cuerpo.','Living lightning around your body.'),pr:40000},
 solar:{n:L2('Corona solar','Solar crown'),d:L2('Fuego dorado y una corona de luz.','Golden fire and a crown of light.'),pr:60000},
 astral:{n:L2('Órbitas astrales','Astral orbits'),d:L2('Anillos cruzados, satélites y constelaciones.','Crossed rings, satellites and constellations.'),pr:80000},
 eclipse:{n:L2('Eclipse fracturado','Fractured eclipse'),d:L2('Media luna y fragmentos dimensionales.','Crescent moon and dimensional fragments.'),pr:100000},
 jardin:{n:L2('Jardín espectral','Spectral garden'),d:L2('Pétalos de luz y mariposas flotantes.','Light petals and floating butterflies.'),pr:50000}
};
const WDA={preview:null,active:null,capture:false,ids:new WeakMap(),nextId:0,frames:new Map(),effects:new Map(),scratch:mkCanvas(96,88),tick:-1,built:0};
const WDA_BLIT=atlasBlit;
const cosAuraValid=id=>typeof id==='string'&&Object.prototype.hasOwnProperty.call(COS_AURAS,id);
function cosAuraState(P){
 if(!P)return;const own=Array.isArray(P.cosAuraOwn)?P.cosAuraOwn:[];P.cosAuraOwn=[...new Set(own.filter(cosAuraValid))].slice(0,6);
 if(!cosAuraValid(P.cosAura)||!P.cosAuraOwn.includes(P.cosAura))P.cosAura=null;
}
for(const key of ['cosAuraOwn','cosAura'])if(!SAVEKEYS.includes(key))SAVEKEYS.push(key);
{const prev=initPlayerRuntime;initPlayerRuntime=function(P){cosAuraState(P);return prev.apply(this,arguments);};}
function cosAuraEquip(id){const P=G.P;if(!P)return false;cosAuraState(P);if(id!==null&&(!cosAuraValid(id)||!P.cosAuraOwn.includes(id)))return false;P.cosAura=id;WDA.preview=id;uiDirty.hud=true;markDirty(true);netPresence(true);return true;}
function cosAuraBuy(id){
 const P=G.P,D=COS_AURAS[id];if(!P||!cosAuraValid(id))return false;cosAuraState(P);
 if(!P.cosAuraOwn.includes(id)){if(!Number.isFinite(P.gold)||P.gold<D.pr){toast(L2('No tienes oro suficiente.','Not enough gold.'),'warn');return false;}
  P.gold-=D.pr;P.cosAuraOwn.push(id);sfx('coin');toast(L2('Aura conseguida: ','Aura unlocked: ')+D.n,'quest');}
 return cosAuraEquip(id);
}
// Bounded frame and effect caches. No aura is baked into a hero atlas or into a save.
function cosAuraFrame(A,col,row){
 if(!A||!A.img||!A.fw||!A.fh)return null;
 const cols=Math.floor(A.img.width/A.fw);if(!Number.isInteger(col)||col<0||col>=cols||!Number.isInteger(row)||row<0||row>3)return null;
 let id=WDA.ids.get(A);if(!id){id=++WDA.nextId;WDA.ids.set(A,id);}
 let hd=HDS>1&&(A.hi||A.idolHD&&A.ready)?2:1;if(HDS>1&&A.hdL&&hdEnsure(A,col,row))hd=2;
 const key=id+':'+col+':'+row+':'+hd;
 if(WDA.frames.has(key)){const f=WDA.frames.get(key);WDA.frames.delete(key);WDA.frames.set(key,f);return f;}
 let c;if(WDA.frames.size>=80){const k=WDA.frames.keys().next().value;c=WDA.frames.get(k).c;WDA.frames.delete(k);}else c=mkCanvas(96,96);
 const x=c.getContext('2d');x.clearRect(0,0,96,96);x.imageSmoothingEnabled=false;
 const scale=Math.min(1,96/(A.fw*2),96/(A.fh*2)),ox=(96-A.fw*2*scale)/2,oy=(96-A.fh*2*scale)/2;
 WDA.capture=true;try{WDA_BLIT(x,A,col,row,ox,oy,A.fw*2*scale,A.fh*2*scale);}finally{WDA.capture=false;}
 const out={c,key,scale,ox,oy};WDA.frames.set(key,out);return out;
}
function cosAuraEffect(frame,id,time,menu=false){
 if(!frame||!cosAuraValid(id))return null;const hz=OPT.on?8:12,bucket=Math.floor(time*hz),key=frame.key+':'+id+':'+bucket;
 if(WDA.effects.has(key)){const c=WDA.effects.get(key);WDA.effects.delete(key);WDA.effects.set(key,c);return c;}
 if(!menu){if(WDA.tick!==G.frame){WDA.tick=G.frame;WDA.built=0;}if(WDA.built>=3&&WDA.active!==G.P)return null;WDA.built++;}
 let target;if(WDA.effects.size>=24){const k=WDA.effects.keys().next().value;target=WDA.effects.get(k);WDA.effects.delete(k);}else target=mkCanvas(192,176);
 const c=COS_AURA_FX.draw(frame.c,frame.key,id,bucket/hz,{target,fx:WDA.scratch,effectOnly:true});WDA.effects.set(key,c);return c;
}
function cosAuraWorld(c,A,col,row,x,y,w,h,e){
 const id=e===G.P?G.P.cosAura:e.cosAura;if(!cosAuraValid(id)||e.dead||e.dying||e.invis)return;
 const f=cosAuraFrame(A,col,row);if(!f)return;const fx=cosAuraEffect(f,id,G.t);if(!fx)return;
 const sx=w/(A.fw*2*f.scale),sy=h/(A.fh*2*f.scale);
 c.save();try{c.imageSmoothingEnabled=false;c.drawImage(fx,Math.round(x-(COS_AURA_FX.padX+f.ox)*sx),Math.round(y-(COS_AURA_FX.padY+f.oy)*sy),Math.round(192*sx),Math.round(176*sy));}finally{c.restore();}
}
{const prev=drawEnt;drawEnt=function(e){const old=WDA.active;WDA.active=e&&((e===G.P)||(e.type==='remote'))?e:null;try{return prev.apply(this,arguments);}finally{WDA.active=old;}};}
{const prev=atlasBlit;atlasBlit=function(c,A,col,row,x,y,w,h){const e=WDA.active;if(!WDA.capture&&e&&A===e.atlas)cosAuraWorld(c,A,col,row,x,y,w,h,e);return prev.apply(this,arguments);};}
// Every transport already uses extraPresence/extraRecv: LAN, WebRTC and internet rooms.
{const prev=extraPresence;extraPresence=function(o){const r=prev.apply(this,arguments);if(G.P&&cosAuraValid(G.P.cosAura))o.cau=G.P.cosAura;return r;};}
{const prev=extraRecv;extraRecv=function(r,pr){const v=prev.apply(this,arguments);r.cosAura=cosAuraValid(pr.cau)?pr.cau:null;return v;};}
function cosAuraPaintPreview(cv,A,id,time,dir){
 const anim=A.idx.walk===undefined?'idle':'walk',n=ANIMS[anim]?.[1]||1,col=A.idx[anim]+Math.floor(time*6)%n,row=DIRI[dir]||0,f=cosAuraFrame(A,col,row);if(!f)return;
 const x=cv.getContext('2d');x.clearRect(0,0,cv.width,cv.height);x.imageSmoothingEnabled=false;
 const fx=cosAuraEffect(f,id,time,true);if(fx)x.drawImage(fx,0,0,cv.width,cv.height);
 x.drawImage(f.c,COS_AURA_FX.padX*cv.width/192,COS_AURA_FX.padY*cv.height/176,96*cv.width/192,96*cv.height/176);
}
{const prev=renderWardrobe;renderWardrobe=function(B){
 const aura=wdMode==='aura';if(aura)wdMode='cos';let r;try{r=prev.apply(this,arguments);}finally{if(aura)wdMode='aura';}
 const P=G.P;if(!P)return r;cosAuraState(P);const chips=B.querySelector('.wdL .chips');if(chips){const b=document.createElement('button');b.className='chip'+(aura?' on':'');b.dataset.waura='1';b.textContent='✦ '+L2('Auras','Auras');b.onclick=()=>{wdMode='aura';WDA.preview=P.cosAura;sfx('ui');renderPanel();};chips.appendChild(b);if(aura)chips.querySelectorAll('[data-wm],[data-wt],[data-wfa]').forEach(el=>el.classList.remove('on'));}
 const cv=B.querySelector('#wdPrev');if(cv&&(aura||P.cosAura)){cv.width=192;cv.height=176;cv.classList.add('cosAuraPreview');}
 if(!aura)return r;const R=B.querySelector('.wdR'),hint=B.querySelector('.wdL .hint');if(hint)hint.textContent=L2('Prueba las auras, cómpralas con tu oro y equípalas cuando quieras. Son solo cosméticas y se ven en el online.','Preview auras, buy them with your gold and equip them any time. They are cosmetic only and visible online.');
 R.innerHTML=`<div class="caHead"><h3>✦ ${L2('Auras','Auras')} <small>${P.cosAuraOwn.length}/6</small></h3><span>${iconHTML(['coin'],18)} <b>${fmt(P.gold)}</b> ${L2('oro','gold')}</span><button class="btn sm" id="caNone">${L2('Quitar aura','Remove aura')}</button></div><p class="hint">${L2('«Ver» permite probar un aura sin gastar oro. Cada compra es permanente para este personaje.','Preview lets you try an aura without spending gold. Each purchase is permanent for this character.')}</p><div class="caGrid">${Object.entries(COS_AURAS).map(([id,D])=>{const own=P.cosAuraOwn.includes(id),on=P.cosAura===id;return `<article class="caCard ${on?'equipped':''}"><h4>${esc(D.n)}</h4><canvas width="192" height="176" data-cac="${id}" aria-label="${esc(D.n)}"></canvas><p>${esc(D.d)}</p><small>${own?L2('En tu colección','In your collection'):fmt(D.pr)+' '+L2('oro','gold')}</small><div class="row"><button class="btn sm" data-cap="${id}">${L2('Ver','Preview')}</button><button class="btn gold sm" data-cab="${id}" ${on?'disabled':''}>${on?L2('Equipada ✓','Equipped ✓'):own?L2('Equipar','Equip'):L2('Comprar y equipar','Buy and equip')}</button></div></article>`;}).join('')}</div><p id="caStatus" class="hint">${WDA.preview&&WDA.preview!==P.cosAura?L2('Vista previa: ','Preview: ')+esc(COS_AURAS[WDA.preview]?.n||''):P.cosAura?L2('Equipada: ','Equipped: ')+esc(COS_AURAS[P.cosAura].n):L2('No llevas aura.','No aura equipped.')}</p>`;
 R.querySelectorAll('[data-cap]').forEach(b=>b.onclick=()=>{WDA.preview=b.dataset.cap;sfx('ui');const st=R.querySelector('#caStatus');st.textContent=L2('Vista previa: ','Preview: ')+COS_AURAS[WDA.preview].n;});
 R.querySelectorAll('[data-cab]').forEach(b=>b.onclick=()=>{if(cosAuraBuy(b.dataset.cab))renderPanel();});R.querySelector('#caNone').onclick=()=>{cosAuraEquip(null);renderPanel();};return r;
};}
{const prev=drawWardrobePreview;drawWardrobePreview=function(dt){
 const P=G.P,cv=$('#wdPrev');if(!P||!cv||$('#panel').hidden||panelTab!=='wardrobe'||!P.atlas)return prev.apply(this,arguments);
 if(wdMode!=='aura'&&!P.cosAura)return prev.apply(this,arguments);wdPrevT+=dt;const frame=Math.floor(wdPrevT*12);if(cv._caTick===frame)return;cv._caTick=frame;
 const id=wdMode==='aura'?WDA.preview:P.cosAura,dir=[0,1,3,2][wdDir];cosAuraPaintPreview(cv,P.atlas,id,wdPrevT,DIRS[dir]);
 if(wdMode==='aura')$$('[data-cac]',$('#pbody')).forEach(c=>cosAuraPaintPreview(c,P.atlas,c.dataset.cac,wdPrevT,'down'));
};}
if(typeof GSIS!=='undefined')GSIS.unshift(['cos_auras','✦ '+L2('Auras cosméticas','Cosmetic auras'),()=>[
 L2('Armario › Auras: seis efectos de energía, oro como moneda y colección permanente por personaje. Usa «Ver» para probar sin pagar.','Wardrobe › Auras: six energy effects, bought with gold and permanently collected per character. Use Preview to try without paying.'),
 ...Object.values(COS_AURAS).map(D=>D.n+': '+fmt(D.pr)+' '+L2('oro','gold')+'.'),
 L2('Se adaptan a las cinco estructuras femeninas y cinco masculinas y al fotograma final del pelo y la ropa. Puedes equipar una o quitarla. No cambian tus estadísticas; se ven en multijugador.','They adapt to all five female and five male bodies and the final hair and clothing frame. Equip one or remove it. No stat changes; visible in multiplayer.')],()=>null]);
{const st=document.createElement('style');st.textContent='.caHead{display:flex;gap:.6em;align-items:center;flex-wrap:wrap}.caHead h3{margin:.2em 0;flex:1}.caGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.6em}.caCard{border:1px solid #886740;border-radius:.55em;background:rgba(16,11,24,.65);padding:.6em;min-width:0}.caCard.equipped{border:2px solid #f4cc76}.caCard h4{margin:0;font-size:1em}.caCard canvas{display:block;width:100%;height:auto;image-rendering:pixelated}.caCard p{font-size:.8em;min-height:2.6em;margin:.3em 0}.caCard small{display:block;color:#ebca86;margin:.3em 0}.caCard .row{display:flex;gap:.3em;flex-wrap:wrap}.caCard .btn{white-space:normal;font-size:.75em;padding:.3em .55em}.wdL #wdPrev.cosAuraPreview{width:min(100%,13em);height:auto;aspect-ratio:12/11}@media(max-width:900px){.caGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:470px){.caGrid{grid-template-columns:1fr}.caCard canvas{max-width:12em;margin:auto}}';document.head.appendChild(st);}
