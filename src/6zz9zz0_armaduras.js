// v5.01: armaduras sobre los cuerpos originales. Solo dibujo y catálogo; sin estadísticas nuevas.
// Las máscaras de capa conservan cara, pelo, busto, silueta y anclajes de TODOS los fotogramas.
const AP_CLASSES = ['guerrero', 'mago', 'arquero', 'asesino', 'bardo', 'invocador', 'pez'];
const AP_COS = new Set(['c_armadura_draco', 'c_armadura_vael', 'c_gala_guerrero', 'c_obsidiana', 'c_idol_robot_v']);
const AP_OLD_GEAR = gearVis, AP_OLD_HERO = heroLook, AP_OLD_DRAW = drawHero, AP_OLD_ORN = hdOrn, AP_OLD_MATS = hdMats;
const AP_OLD_COS = new Map();
const AP_PALETTES = {
 wolf: P5(['#10151e','#252c38','#434e60','#687789','#a9b7c4']),
 sepul: P5(['#071e25','#10353e','#205463','#3d7b85','#81b6bc']),
 veil: P5(['#160d20','#2b1939','#4b2857','#75416e','#a76c94']),
 eclipse: P5(['#100b22','#201334','#34234e','#513a70','#81649e']),
 moon: P5(['#0c1235','#1b2853','#304776','#50699b','#8f9fca']),
 draco: P5(['#160e16','#29151e','#45222a','#703736','#ab5a43']),
};
function apFamily(t) { return t >= 27 ? 'canvas' : ({10:'draco',22:'wolf',23:'sepul',24:'veil',25:'eclipse',26:'moon'})[t] || (t >= 19 ? 'dawn' : t >= 13 ? 'astral' : t >= 7 ? 'arcane' : 'forged'); }
function apMark(v, cls, slot, t) { return v ? Object.assign({}, v, { ap: { cls, slot, t, family: apFamily(t) } }) : v; }
gearVis = function (cls, slot, t) { return apMark(AP_OLD_GEAR.apply(this, arguments), cls, slot, t); };
for (const id of AP_COS) if (COSM[id]) {
 const prev = COSM[id].vis; AP_OLD_COS.set(id, prev);
 COSM[id].vis = function () { const v = prev.apply(this, arguments), r = apMark(v, 'guerrero', COSM[id].slot, v.t || 16); r.ap.cos = id; if (id === 'c_armadura_vael') r.ap.family = 'spectral'; return r; };
}
heroLook = function (cls, app, gear, cos, opts) {
 const L = AP_OLD_HERO.apply(this, arguments), T = L.top, a = T && T.ap;
 // Respeta las capas cosméticas, las evoluciones y las reglas originales de cobertura del pelo.
 if (a && !a.cos && L.back?.k === 'cape' && !(cos?.back && COSM[cos.back]) && !app?.evo) {
  const P = AP_PALETTES[a.family];
  if (P) L.back = Object.assign({}, L.back, { o: P, i: a.family === 'draco' ? CLOTH.naranja : P,
   tr: ['eclipse','moon'].includes(a.family) ? VA[a.family === 'moon' ? 'luna' : 'eclipse'].s : P,
   ap: a });
  else L.back = Object.assign({}, L.back, { ap: a });
 }
 return L;
};
function apMetal(s) { return s && (s.k === 'plate' || s.k === 'greaves' || s.k === 'sabatons' || /^va_(sepul|eclipse|luna)$/.test(s.k) || s.k === 'lz_guerrero' || s.k === 'id_robot'); }
// Escribe dentro de la prenda visible. Nunca añade altura, tapa ojos ni repinta pelo/piel/armas.
function apBrush(p, L, scale = 1) {
 const SK = new Set(L.skin || []), width = p.w, height = p.h;
 return (xx, yy, c, tags = [2]) => {
  const x = Math.round(xx), y = Math.round(yy); if (x < 0 || y < 0 || x >= width || y >= height || c === undefined) return;
  const i = y * width + x, old = p.d[i];
  if (!uA(old) || !p.t || !tags.includes(p.t[i]) || SK.has(old)) return;
  p.d[i] = c;
  if (scale === 1 && p._r8Bare && p._r8Bare[i]) { p._r8Bare[i] = c; if (p._r8Tags) p._r8Tags[i] = p.t[i]; }
 };
}
function apLow(p, L) {
 const A = p.meta; if (!A) return;
 const put = apBrush(p,L), T=L.top, a=T?.ap, x=A.tx0, y=A.torsoTop, w=A.tw, h=A.th, cx=A.cx;
 if (a) {
  const M=T.m,S=T.s||M,metal=apMetal(T),front=!A.side&&!A.up;
  if (metal) {
   for(let yy=2;yy<h-2;yy++) for(let xx=1;xx<w-1;xx++) {
    const edge=xx===1||xx===w-2, joint=yy===h-4;
    put(x+xx,y+yy,joint?M[0]:edge?M[xx===1?3:1]:M[xx<w/2?3:2]);
   }
   for(let xx=1;xx<w-1;xx++)put(x+xx,y+h-3,S[xx===1?3:2]);
  }
  if(front && ['leather','shadow','lz_ninja','lz_arquero'].includes(T.k)) {
   for(let n=0;n<w-2;n++){const yy=y+1+n*(h-4)/(w-2);put(x+1+n,yy,LEATHER[1]);put(x+1+n,yy-1,LEATHER[3]);}
   put(x+w-2,y+h-2,GOLD[3]);
  }
  if(front && ['robe','coat','vest','lz_mago','lz_bardo','lz_invocador'].includes(T.k)) {
   for(let yy=2;yy<h-2;yy++){put(cx-2,y+yy,M[0]);put(cx+1,y+yy,S[2]);}
  }
  if(front) {put(cx-1,y+h-3,GOLD[3]);put(cx,y+h-3,GOLD[4]);}
 }
 // Rodilleras y botas articuladas: se buscan sus píxeles reales después del paso y del ataque.
 if (L.bot?.ap || L.feet?.ap) for(let yy=Math.ceil(A.legTop)+1;yy<p.h;yy++)for(let xx=0;xx<p.w;xx++) {
  const i=yy*p.w+xx;if(p.t[i]!==1||!uA(p.d[i]))continue;
  const c=p.d[i],M=L.bot?.m||L.feet.m;
  if(apMetal(L.bot)&&yy===Math.round(A.legTop+2))put(xx,yy,uMix(c,M[4],.35),[1]);
  if(L.feet?.ap && yy>=A.base-4 && xx%3===0)put(xx,yy,uMix(c,L.feet.m[1],.18),[1]);
 }
}
drawHero = function(p,L) {
 const active = L && [L.top,L.bot,L.feet,L.head].some(s=>s?.ap);
 if(active&&!p.t){p.t=new Uint8Array(p.w*p.h);p.tg=0;}
 const result=AP_OLD_DRAW.apply(this,arguments);if(active)apLow(p,L);return result;
};
hdMats = function(L) { const M=AP_OLD_MATS.apply(this,arguments);
 for(const [s,tags]of [[L.top,[2,3]],[L.bot,[1]],[L.feet,[1]]])if(s?.ap&&apMetal(s))for(const tag of tags)for(const c of s.m||[])if(!(L.skin||[]).includes(c))M[tag].set(c,2);
 return M;
};
// Ornamentos HD dentro de las capas originales; se calculan una vez por cuadro y quedan en el atlas.
function apHd(q,p,L) {
 const A=p.meta;if(!A)return;const put=apBrush(q,L,2),T=L.top,a=T?.ap;
 const x=A.tx0*2,y=A.torsoTop*2,w=A.tw*2,h=A.th*2,cx=x+w/2,front=!A.side&&!A.up;
 const line=(x0,y0,x1,y1,c,tags=[2])=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++)put(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,c,tags);};
 const ring=(xx,yy,r,P,tags=[2])=>{for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++){const d=i*i+j*j;if(d<=r*r&&d>=(r-1)*(r-1))put(xx+i,yy+j,P[i<0?3:2],tags);}};
 if(a){
  const M=T.m,S=T.s||M,metal=apMetal(T),fam=a.family;
  if(metal){
   // Placas de pecho superpuestas, bisel de luz y juntas oscuras continuas.
   for(let yy=3;yy<h-4;yy++)for(let xx=2;xx<w-2;xx++){
    const seam=yy===h-6,edge=xx===2||xx===w-3;
    let c=seam?M[0]:edge?M[xx===2?4:1]:M[xx<w*.48?3:2];
    if(yy===3)c=M[xx<w/2?4:3];
    put(x+xx,y+yy,c);
   }
   for(let j=0;j<3;j++){line(x+3+j,y+4+j,cx-1,y+8+j,j?M[1]:M[4]);line(cx,y+8+j,x+w-4-j,y+4+j,j?M[0]:M[3]);}
   for(const sx of[x-4,x+w+1]){line(sx,y+3,sx+4,y+3,M[4],[2,3]);line(sx,y+6,sx+4,y+6,M[0],[2,3]);}
   line(x+2,y+h-4,x+w-3,y+h-4,S[1]);line(x+2,y+h-3,x+w-3,y+h-3,S[3]);
  }else{
   // Grandes pliegues y ribetes: sin puntadas discontinuas ni ruido en cada píxel.
   for(let yy=3;yy<h+6;yy++){put(x+3,y+yy,uMul(M[2],.82));put(x+w-4,y+yy,M[3]);}
   if(front&&['robe','coat','vest','lz_mago','lz_bardo','lz_invocador'].includes(T.k)){
    for(let yy=3;yy<h-3;yy++){put(cx-3,y+yy,M[0]);put(cx+2,y+yy,S[3]);}
    for(let yy=5;yy<h-3;yy+=4){put(cx+3,y+yy,GOLD[4]);put(cx+3,y+yy+1,GOLD[2]);}
   }
   if(front&&['leather','shadow','lz_ninja','lz_arquero'].includes(T.k)){
    line(x+2,y+2,x+w-3,y+h-5,LEATHER[0]);line(x+2,y+1,x+w-3,y+h-6,LEATHER[3]);
    const by=y+h-7;ring(cx,by,2,GOLD);put(cx,by,LEATHER[1]);
    for(const sx of[x+1,x+w-4]){line(sx,y+h-3,sx+2,y+h-3,LEATHER[3]);line(sx,y+h-1,sx+2,y+h-1,LEATHER[0]);}
   }
  }
  // Identidad del conjunto: escamas, eclipse, luna, runas o fracturas del Lienzo.
  const cy=y+Math.min(7,h-7),gold=GOLD,gem=S[3];
  if(fam==='draco'&&front){for(let yy=4;yy<h-5;yy+=4)for(let xx=3+(yy%8?0:2);xx<w-3;xx+=4){put(x+xx,y+yy,M[4]);put(x+xx+1,y+yy+1,M[1]);put(x+xx,y+yy+2,M[0]);}}
  if(fam==='wolf'){for(let xx=0;xx<w;xx++){put(x+xx,y+1,VA.lobo.fur[xx<w/2?3:2]);put(x+xx,y+2,VA.lobo.fur[1]);}if(front){put(cx-1,cy,gem);put(cx,cy+1,S[4]);put(cx+1,cy,gem);}}
  if(fam==='sepul'&&front){line(cx-1,y+3,cx-1,y+h-6,VA.sepul.s[3]);line(cx+1,y+3,cx+1,y+h-6,VA.sepul.m[4]);for(let j=0;j<3;j++){line(x+3,y+5+j*3,cx-2,y+7+j*3,M[0]);line(cx+2,y+7+j*3,x+w-4,y+5+j*3,M[1]);}}
  if(fam==='veil'&&front){for(let j=0;j<3;j++){line(cx-3,y+4+j*3,cx+2,y+6+j*3,S[3]);line(cx+2,y+4+j*3,cx-3,y+6+j*3,M[0]);}put(cx,y+3,C('#f583a5'));}
  if(fam==='eclipse'&&front){ring(cx,cy,3,VA.eclipse.s);put(cx,cy,M[0]);for(const [dx,dy]of [[0,-5],[5,0],[0,5],[-5,0]])put(cx+dx,cy+dy,VA.eclipse.s[3]);}
  if(fam==='moon'&&front){for(let j=-3;j<=3;j++)for(let i=-3;i<=3;i++)if(i*i+j*j<=9&&(i-1)*(i-1)+(j+1)*(j+1)>7)put(cx+i,cy+j,VA.luna.s[i<0?4:2]);}
  if(fam==='canvas'&&T.k==='lz_guerrero'){
   const path=[[cx-3,y+2],[cx,y+5],[cx-2,y+8],[cx+2,y+11],[cx,y+h-4]];
   for(let j=1;j<path.length;j++){line(...path[j-1],...path[j],S[1]);line(path[j-1][0]+1,path[j-1][1],path[j][0]+1,path[j][1],S[3]);}
  }
  if(front&&a.cls==='mago'){ring(cx,y+7,2,S);put(cx,y+7,S[4]);put(cx,y+6,M[0]);}
  if(front&&a.cls==='bardo'){line(cx,y+4,cx,y+10,GOLD[3]);ring(cx-1,y+9,2,GOLD);}
  if(front&&a.cls==='invocador'){ring(cx,y+7,3,S);put(cx,y+7,S[4]);for(const sx of[x+3,x+w-4]){line(sx,y+h-3,sx,y+h+1,M[4]);put(sx,y+h,S[2]);}}
  if(T.k==='scaletop'||T.k==='lz_pez')for(let yy=4;yy<h-3;yy+=4)for(let xx=2+(yy%8?0:2);xx<w-2;xx+=4){put(x+xx,y+yy,M[4]);put(x+xx+1,y+yy+1,M[1]);}
 }
 if(L.back?.ap){const B=L.back,P=B.o,tags=[4];
  for(let yy=y+5;yy<A.base*2-3;yy++){for(const dx of[-6,5])put(cx+dx,yy,P[dx<0?3:1],tags);}
  if(A.up){const cy=y+11,f=L.back.ap.family,S=L.top.s||P;
   if(f==='eclipse')ring(cx,cy,5,VA.eclipse.s,tags);
   else if(f==='moon'){for(let j=-5;j<=5;j++)for(let i=-5;i<=5;i++)if(i*i+j*j<=25&&(i-2)*(i-2)+(j+1)*(j+1)>22)put(cx+i,cy+j,VA.luna.s[i<0?4:2],tags);}
   else if(f==='canvas'&&L.back.ap.cls==='bardo'){ring(cx,cy,3,GOLD,tags);line(cx+2,cy-5,cx+2,cy+5,GOLD[3],tags);}
   else if(f==='canvas'&&L.back.ap.cls==='invocador')ring(cx,cy,5,S,tags);
   else if(f==='wolf'){line(cx-4,cy-2,cx,cy+4,P[4],tags);line(cx,cy+4,cx+4,cy-2,P[3],tags);}
  }
 }
 if(L.head?.ap){const H=L.head,M=H.m||IRON,tags=[7];
  // Detalle sobre el casco ya ajustado: su máscara conserva el hueco de la cara y el pelo permitido.
  const hx=A.hx*2,hy=A.hy*2;
  for(let yy=hy-12;yy<hy-3;yy++){put(hx-1,yy,M[4],tags);put(hx,yy,M[1],tags);}
  for(const dx of[-11,10]){put(hx+dx,hy-5,M[4],tags);put(hx+dx,hy-4,M[0],tags);}
 }
 for(const s of[L.bot,L.feet])if(s?.ap){const M=s.m;for(let yy=Math.ceil(A.legTop*2)+2;yy<A.base*2;yy++)for(let xx=0;xx<q.w;xx++){
  const i=yy*q.w+xx;if(q.t[i]!==1||!uA(q.d[i]))continue;
  if(apMetal(s)&&yy%5===0){put(xx,yy,uMix(q.d[i],M[0],.25),[1]);if(xx>0&&q.t[i-1]!==1)put(xx,yy,M[4],[1]);}
 }}
}
hdOrn = function(q,p,L){AP_OLD_ORN.apply(this,arguments);if([L.top,L.bot,L.feet,L.head].some(s=>s?.ap))apHd(q,p,L);};

// El mismo icono representa cada pieza en bestiario, inventario, tiendas y herrería.
const AP_OLD_ICON=genIcon, AP_ICON_CACHE=new Map();let apIconClass=null;
function apItemLook(id,cls){const it=ITEMS[id],cos=it.t==='cos'?{[COSM[it.cos].slot]:it.cos}:{},gear=it.t==='armor'?{[it.slot]:it.tier}:{};
 const L=heroLook(cls,{...DEF_APP,g:'m',hs:0},gear,cos,{});L.weapon=null;L.back=null;L.scarf=null;return L;}
function apGearIcon(id,cls){const key=id+':'+cls;if(AP_ICON_CACHE.has(key))return AP_ICON_CACHE.get(key);
 const it=ITEMS[id],L=apItemLook(id,cls),p=new Pix(48,48);p.t=new Uint8Array(2304);p.tg=0;drawHero(p,L,'down','idle',0);
 const slot=it.t==='cos'?COSM[it.cos].slot:it.slot,tags=slot==='head'?[7]:slot==='body'?[2,3]:[1],SK=new Set(L.skin||[]),pts=[];
 for(let y=0;y<48;y++)for(let x=0;x<48;x++){const i=y*48+x,c=p.d[i];if(!uA(c)||!tags.includes(p.t[i])||SK.has(c))continue;
  if(slot==='legs'&&y>=p.meta.base-4)continue;if(slot==='feet'&&y<p.meta.base-4)continue;pts.push([x,y,c]);}
 const o=new Pix(16,16);
 if(!pts.length){const M=LZA[it.tier]?.c||tierPal(it.tier),S=LZA[it.tier]?.s||GOLD; o.hl(2,8,12,M[3]);o.hl(3,9,10,M[1]);o.ball(8,8,2,2,S.slice(1));}
 else{const xs=pts.map(v=>v[0]),ys=pts.map(v=>v[1]),x0=Math.min(...xs),y0=Math.min(...ys),w=Math.max(...xs)-x0+1,h=Math.max(...ys)-y0+1,s=Math.min(13/w,13/h),dx=(16-w*s)/2,dy=(16-h*s)/2;
  // Muestreo de la pieza real, no un pictograma genérico de otro tier.
  const map=new Map(pts.map(([x,y,c])=>[x+','+y,c]));for(let y=0;y<14;y++)for(let x=0;x<14;x++){const xx=Math.floor(x0+(x+.5)/s),yy=Math.floor(y0+(y+.5)/s),c=map.get(xx+','+yy);if(c)o.set(Math.floor(dx)+x,Math.floor(dy)+y,c);}
 }
 o.outline(OUTL,false);AP_ICON_CACHE.set(key,o);return o;
}
genIcon = function(spec){return spec[0]==='ap_gear'&&ITEMS[spec[1]]?apGearIcon(spec[1],AP_CLASSES.includes(spec[2])?spec[2]:'guerrero'):AP_OLD_ICON.apply(this,arguments);};
for(const it of Object.values(ITEMS))if(it.t==='armor'||(it.t==='cos'&&AP_COS.has(it.cos))){it.icon=['ap_gear',it.id];for(const c of AP_CLASSES)UI_ICONS.push('ap_gear:'+it.id+':'+c);}
{const prev=iconHTML;iconHTML=function(spec,...args){if(spec?.[0]==='ap_gear'&&!spec[2])spec=[...spec,apIconClass||G.P?.cls||'guerrero'];return prev.call(this,spec,...args);};}
const AP_PREVIEWS=new Map();
function apEquippedPreview(canvas,it,cls){const P=G.P,gear=Object.assign({},gearTiers(P)),cos=Object.assign({},P.cos||{});gear[it.slot]=it.tier;delete cos[it.slot];
 const app=normApp(P.app),key=JSON.stringify([cls,app,gear,cos]);let A=AP_PREVIEWS.get(key);
 if(!A){const L=heroLook(cls,app,gear,cos,{hideHelm:false});L.weapon=null;A=buildAtlas(L,['idle'],drawHero);if(AP_PREVIEWS.size>=24)AP_PREVIEWS.delete(AP_PREVIEWS.keys().next().value);AP_PREVIEWS.set(key,A);}
 canvas.width=48*4*2;canvas.height=48*2;canvas.style.cssText='width:100%;max-width:384px;height:auto;image-rendering:pixelated';
 const x=canvas.getContext('2d');x.imageSmoothingEnabled=false;
 for(let row=0;row<4;row++){if(hdEnsure(A,0,row,true))x.drawImage(A.hd,0,row*A.fh*2,A.fw*2,A.fh*2,row*96,0,96,96);else x.drawImage(A.img,0,row*A.fh,A.fw,A.fh,row*96,0,96,96);}
}
{const prev=renderEncyclo;renderEncyclo=function(B){const old=apIconClass;apIconClass=encCls==='all'?(G.P?.cls||'guerrero'):encCls;
 try{const r=prev.apply(this,arguments);if(encTab==='armor'&&G.P){const list=encGearList('armor'),it=list.find(v=>v.id===encSel)||list[0],box=B.querySelector('.encdet');
  if(it&&box){const section=document.createElement('div');section.className='ap-equipped';const h=document.createElement('h4');h.textContent=L2('Cómo queda puesta','Equipped appearance');const c=document.createElement('canvas');c.setAttribute('aria-label',L2('Frente, izquierda, derecha y espalda','Front, left, right and back'));section.append(h,c);box.append(section);const cl=apIconClass;/* 6.13: tras pintar la lista (generar el personaje tarda ~1 s la primera vez) */requestAnimationFrame(()=>requestAnimationFrame(()=>{if(c.isConnected)apEquippedPreview(c,it,cl);}));}}
 return r;}finally{apIconClass=old;}};}
// La comprobación de ajuste cubre también los tiers intermedios, no solo una muestra de la progresión.
{const previous=fitItems;fitItems=function(only){const out=previous.apply(this,arguments),seen=new Set(out.map(v=>v.id));
 for(const cls of AP_CLASSES)for(let t=1;t<=30;t++)for(const slot of['head','body','legs','feet']){const id=cls+':'+slot+':'+t;if(!seen.has(id)&&(!only||id.includes(only)))out.push({id,kind:'gear',cls,slot,t});}
 return out;};}
