// 5.63: approved native dance loops; preserve faces, bodies, clothing and hair.
const DANCE_FRAMES=32;
function danceShopPose(key,f,dir,L){
 const ps=poseFor(dir,'idle',0,L),t=(f%DANCE_FRAMES)/DANCE_FRAMES*Math.PI*2,s=Math.sin(t),c=Math.cos(t),s2=Math.sin(t*2),beat=(f%8)/8,side=dir==='left'||dir==='right';
 Object.assign(ps,{noWeapon:1,wang:null,bob:0,crouch:0,jump:0,lfx:0,rfx:0,lfy:0,rfy:0,lax:0,rax:0,lay:0,ray:0,sway:0,danceJoints:true});
 if(key==='thriller'){ps.lax=-3+s*3;ps.rax=3+s*3;ps.lay=-6-Math.max(0,c)*3;ps.ray=-6+Math.min(0,c)*3;ps.crouch=1+Math.max(0,s2);ps.lfx=s*1.7;ps.rfx=s*1.7;ps.lfy=-Math.max(0,s2)*1.5;ps.rfy=-Math.max(0,-s2)*1.5;ps.lean=s;}
 if(key==='single'){ps.lax=-3;ps.lay=-3+Math.max(0,s)*2;ps.rax=1+Math.sin(t*2)*2;ps.ray=-11;ps.crouch=Math.max(0,-c);ps.bob=-Math.max(0,s2);ps.lfx=s*2;ps.rfx=-s;ps.rfy=-Math.max(0,-c)*2;ps.lean=s;ps.elbowR=-1;}
 if(key==='carlton'){ps.lax=s*5;ps.rax=s*5;ps.lay=-3-c*3;ps.ray=-3+c*3;ps.lfx=-s*2;ps.rfx=-s*2;ps.lfy=-Math.max(0,c)*2;ps.rfy=-Math.max(0,-c)*2;ps.bob=-Math.abs(s2);ps.lean=-s;}
 if(key==='running'){ps.lfx=s2*2.6;ps.rfx=-s2*2.6;ps.lfy=-Math.max(0,c*2)*3;ps.rfy=-Math.max(0,-c*2)*3;ps.lax=-s2*2;ps.rax=s2*2;ps.lay=-3+c*2;ps.ray=-3-c*2;ps.bob=-Math.abs(s2);ps.lean=1;}
 if(key==='shuffle'){ps.lfx=s*3;ps.rfx=-s*2;ps.lfy=-Math.max(0,s2)*2;ps.rfy=-Math.max(0,-s2)*2;ps.lax=-3-c*2;ps.rax=3+c*2;ps.lay=-1-Math.max(0,s)*3;ps.ray=-1-Math.max(0,-s)*3;ps.jump=Math.max(0,s2)*.8;ps.lean=-s;}
 if(key==='charleston'){ps.lfx=s*3;ps.rfx=-s*3;ps.lfy=-Math.max(0,c)*3;ps.rfy=-Math.max(0,-c)*3;ps.lax=-3-c*2;ps.rax=3+c*2;ps.lay=-3-s*2;ps.ray=-3+s*2;ps.bob=-Math.abs(s2);ps.lean=c;}
 if(key==='rasputin'){ps.crouch=4;ps.lax=-5;ps.rax=5;ps.lay=-6;ps.ray=-6;ps.lfx=-Math.max(0,c)*5;ps.rfx=Math.max(0,-c)*5;ps.lfy=-Math.max(0,c)*3;ps.rfy=-Math.max(0,-c)*3;ps.bob=-Math.abs(s2)*1.5;}
 if(key==='ymca'){
  const frames=[[-5,-13,5,-13],[-1,-10,1,-10],[-5,-10,-3,-3],[1,-13,-1,-13]],u=f/8,i=Math.floor(u)%4,n=(i+1)%4,transition=Math.max(0,(u%1-.6)/.4),q=transition*transition*(3-2*transition),v=frames[i].map((a,k)=>a+(frames[n][k]-a)*q);
  [ps.lax,ps.lay,ps.rax,ps.ray]=v;ps.bob=-Math.max(0,s2);ps.lfx=s;ps.rfx=-s;
 }
 if(key==='disco'){const up=(1+Math.sin(t))/2;ps.rax=2+up*3;ps.ray=-1-up*12;ps.lax=-1;ps.lay=-2;ps.lfx=-s*1.5;ps.rfx=s*1.5;ps.bob=-Math.max(0,s2);ps.lean=-s;}
 if(key==='merlina'){ps.lax=-5+c*2;ps.rax=5+c*2;ps.lay=-5+s*4;ps.ray=-5-s*4;ps.elbowL=f<16?-1:1;ps.elbowR=-ps.elbowL;ps.crouch=Math.max(0,s2);ps.lfx=s*1.5;ps.rfx=-s*1.5;ps.lfy=-Math.max(0,c)*1.5;ps.rfy=-Math.max(0,-c)*1.5;ps.lean=c;}
 if(side){ps.lax*=.65;ps.rax*=.65;}
 return ps;
}
// One registry and collection for the pass, festivals, emote button and shop.
const DANCE_SHOP = {
 thriller:{n:L2('Thriller · zombi','Thriller · zombie'),d:L2('Garras, pasos laterales y hombros.','Claws, side steps and shoulders.'),pr:8000},
 single:{n:'Single Ladies',d:L2('Mano junto al rostro y paso de cadera.','Hand by the face and hip steps.'),pr:10000},
 carlton:{n:'Carlton',d:L2('Balanceo de brazos y pasos cruzados.','Arm swings and crossing steps.'),pr:6000},
 running:{n:'Running Man',d:L2('Rodillas alternadas y deslizamiento.','Alternating knees and sliding feet.'),pr:6000},
 shuffle:{n:'Shuffle',d:L2('Paso en T y cambios de apoyo.','T-step and shifting weight.'),pr:7500},
 charleston:{n:'Charleston',d:L2('Puntas, talones y patadas alternas.','Toes, heels and alternating kicks.'),pr:6000},
 rasputin:{n:L2('Rasputin · cosaco','Rasputin · Cossack'),d:L2('Sentadilla y patadas laterales.','Squat and side kicks.'),pr:10000},
 ymca:{n:'YMCA',d:L2('Cuatro figuras con los brazos.','Four arm shapes.'),pr:5000},
 disco:{n:L2('Disco · años 70','Disco · 70s'),d:L2('Señalar arriba y abajo con pasos.','Point up and down while stepping.'),pr:5000},
 merlina:{n:L2('Merlina','Wednesday'),d:L2('Manos rígidas y pasos cortos.','Stiff hands and short steps.'),pr:12000}
};
for(const [k,D] of Object.entries(DANCE_SHOP)){
 DANCES[k]={n:D.n,frames:DANCE_FRAMES,fps:12.5,pose:(ps,f,dir,L)=>Object.assign(ps,danceShopPose(k,f,dir,L))};
 ANIMS['dz_'+k]=[0,DANCE_FRAMES];
}
const danceShopValid=k=>typeof k==='string'&&Object.prototype.hasOwnProperty.call(DANCE_SHOP,k);
function danceCollection(P){
 if(!P)return;
 P.dances=[...new Set(['clasico',...(Array.isArray(P.dances)?P.dances:[])].filter(k=>typeof k==='string'&&Object.prototype.hasOwnProperty.call(DANCES,k)))];
}
{const prev=initPlayerRuntime;initPlayerRuntime=function(P){danceCollection(P);return prev.apply(this,arguments);};}
function danceShopBuy(k){
 const P=G.P;if(!P||!danceShopValid(k))return false;danceCollection(P);
 if(P.dances.includes(k))return true;
 const D=DANCE_SHOP[k];if(!Number.isFinite(P.gold)||P.gold<D.pr){toast(L2('No tienes oro suficiente.','Not enough gold.'),'warn');return false;}
 P.gold-=D.pr;P.dances.push(k);markDirty(true);sfx('coin');toast(L2('Baile conseguido: ','Dance unlocked: ')+D.n,'quest');return true;
}
// Advance all 32 frames through the existing local AND remote animation clocks.
{const prev=animN;animN=function(e,a){return a==='dance'&&(e.type==='player'||e.type==='remote')&&danceShopValid(e.dk)?DANCE_FRAMES:prev.apply(this,arguments);};}
{const prev=stepAnim;stepAnim=function(e,dt,fps){if(e.anim==='dance'&&(e.type==='player'||e.type==='remote')&&danceShopValid(e.dk))fps=DANCES[e.dk].fps;return prev.call(this,e,dt,fps);};}
// Only the selected shop preview animates. At most three preview atlases are retained;
// the world keeps using danceAtlasFor/getAtlas and the engine's normal GC.
const WDB={preview:'thriller',cache:new Map()};
function dancePreviewAtlas(P,k){
 const app=normApp(P.app),gear=gearTiers(P),cos=P.cos||{},key=k+heroKey(P.cls,app,gear,cos,P.hideHelm);
 let A=WDB.cache.get(key);if(A){WDB.cache.delete(key);WDB.cache.set(key,A);return A;}
 A=buildAtlas(heroLook(P.cls,app,gear,cos,{hideHelm:P.hideHelm}),['dz_'+k],drawHero);WDB.cache.set(key,A);
 while(WDB.cache.size>3){const old=WDB.cache.keys().next().value,a=WDB.cache.get(old),i=HD_LIVE.indexOf(a);if(i>=0)HD_LIVE.splice(i,1);WDB.cache.delete(old);}
 return A;
}
function danceShopOpenEmotes(){closePanel();toggleEmoPop(true);}
{const prev=renderWardrobe;renderWardrobe=function(B){
 const dance=wdMode==='dance';if(dance)wdMode='cos';let r;try{r=prev.apply(this,arguments);}finally{if(dance)wdMode='dance';}
 const P=G.P;if(!P)return r;danceCollection(P);const chips=B.querySelector('.wdL .chips');
 if(chips){const b=document.createElement('button');b.className='chip'+(dance?' on':'');b.dataset.wdance='1';b.textContent='💃 '+L2('Bailes','Dances');b.onclick=()=>{wdMode='dance';sfx('ui');renderPanel();};chips.appendChild(b);if(dance)chips.querySelectorAll('[data-wm],[data-wt],[data-wfa],[data-waura]').forEach(el=>el.classList.remove('on'));}
 if(!dance)return r;if(!danceShopValid(WDB.preview))WDB.preview='thriller';
 const cv=B.querySelector('#wdPrev');cv.width=192;cv.height=176;cv.classList.add('dancePreview');
 const hint=B.querySelector('.wdL .hint');if(hint)hint.textContent=L2('Prueba gratis y compra con tu oro. Después elige el baile en el botón de gestos y bailes de siempre.','Preview for free and buy with gold. Then choose your dance in the existing gestures and dances button.');
 const R=B.querySelector('.wdR'),owned=Object.keys(DANCE_SHOP).filter(k=>P.dances.includes(k)).length;
 R.innerHTML=`<div class="danceHead"><h3>💃 ${L2('Bailes','Dances')} <small>${owned}/10</small></h3><span>${iconHTML(['coin'],18)} <b>${fmt(P.gold)}</b> ${L2('oro','gold')}</span><button class="btn sm" id="wdMyDances">${L2('Abrir mis bailes','Open my dances')}</button></div><p class="hint">${L2('Compra permanente para este personaje. «Ver» no gasta oro. Los bailes que ya tienes se conservan.','Permanent purchase for this character. Preview spends no gold. Your existing dances are kept.')}</p><p class="danceSelected" id="wdDanceStatus" aria-live="polite">${L2('Vista previa: ','Preview: ')+esc(DANCE_SHOP[WDB.preview].n)}</p><div class="danceGrid">${Object.entries(DANCE_SHOP).map(([k,D])=>{const own=P.dances.includes(k);return `<article class="danceCard ${own?'owned':''}" data-dcard="${k}"><h4>${esc(D.n)}</h4><p>${esc(D.d)}</p><small>${own?L2('En tu colección ✓','In your collection ✓'):fmt(D.pr)+' '+L2('oro','gold')}</small><div class="row"><button class="btn sm" data-dpreview="${k}" aria-pressed="${WDB.preview===k}">${L2('Ver','Preview')}</button><button class="btn gold sm" data-dbuy="${k}" ${own?'disabled':''}>${own?L2('Comprado ✓','Owned ✓'):L2('Comprar','Buy')}</button></div></article>`;}).join('')}</div>`;
 R.querySelectorAll('[data-dpreview]').forEach(b=>b.onclick=()=>{WDB.preview=b.dataset.dpreview;wdPrevT=0;cv._danceTick=-1;R.querySelector('#wdDanceStatus').textContent=L2('Vista previa: ','Preview: ')+DANCE_SHOP[WDB.preview].n;R.querySelectorAll('[data-dpreview]').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));sfx('ui');});
 R.querySelectorAll('[data-dbuy]').forEach(b=>b.onclick=()=>{if(danceShopBuy(b.dataset.dbuy))renderPanel();});R.querySelector('#wdMyDances').onclick=danceShopOpenEmotes;return r;
};}
{const prev=drawWardrobePreview;drawWardrobePreview=function(dt){
 if(wdMode!=='dance')return prev.apply(this,arguments);
 const P=G.P,cv=$('#wdPrev');if(!P||!cv||$('#panel').hidden||panelTab!=='wardrobe')return;
 wdPrevT+=dt;const tick=Math.floor(wdPrevT*12.5);if(cv._danceTick===tick)return;cv._danceTick=tick;
 const k=WDB.preview,A=dancePreviewAtlas(P,k),col=A.idx['dz_'+k]+tick%DANCE_FRAMES,row=[0,1,3,2][wdDir],x=cv.getContext('2d');x.clearRect(0,0,cv.width,cv.height);x.imageSmoothingEnabled=false;
 // Same final atlas silhouette as world auras, including future hairstyles.
 if(cosAuraValid(P.cosAura)){const f=cosAuraFrame(A,col,row),fx=f&&cosAuraEffect(f,P.cosAura,wdPrevT,true);if(fx)x.drawImage(fx,0,0,cv.width,cv.height);}
 atlasBlit(x,A,col,row,48,32,96,96);
};}
if(typeof GSIS!=='undefined')GSIS.unshift(['dance_shop','💃 '+L2('Bailes del armario','Wardrobe dances'),()=>[
 L2('Armario › Bailes: diez bailes nuevos, vista previa gratis y compra permanente con el oro existente.','Wardrobe › Dances: ten new dances, free preview and permanent purchase with existing gold.'),
 ...Object.values(DANCE_SHOP).map(D=>D.n+': '+fmt(D.pr)+' '+L2('oro','gold')+'.'),
 L2('Se usan en el botón de gestos y bailes existente. Funcionan con los cinco cuerpos femeninos y cinco masculinos, tu pelo y ropa, en cuatro direcciones; se ven online.','Use them in the existing gestures and dances button. They work with all five female and five male bodies, your hair and clothing, in four directions; visible online.')],()=>null]);
{const st=document.createElement('style');st.textContent='.danceHead{display:flex;gap:.6em;align-items:center;flex-wrap:wrap}.danceHead h3{margin:.2em 0;flex:1}.danceHead span{white-space:nowrap}.danceGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.65em}.danceCard{border:1px solid #886740;border-radius:.6em;padding:.75em;background:rgba(16,11,24,.65);min-width:0}.danceCard.owned{border-color:#dfba6b}.danceCard h4{margin:0;color:#f6d78b}.danceCard p{font-size:.85em;min-height:2.4em;margin:.45em 0}.danceCard small{display:block;color:#ebca86;margin:.4em 0}.danceCard .row{display:flex;flex-wrap:wrap;gap:.4em}.danceCard .btn{white-space:normal}.danceCard [aria-pressed=true]{box-shadow:0 0 0 2px #f5ce76}.danceSelected{color:#f6d78b}.wdL #wdPrev.dancePreview{width:min(100%,13em);height:auto;aspect-ratio:12/11}@media(max-width:470px){.danceGrid{grid-template-columns:1fr}}';document.head.appendChild(st);}
