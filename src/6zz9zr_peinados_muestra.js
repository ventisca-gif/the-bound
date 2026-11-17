// Muestra de personalización: ocho referencias, sin modificar estructuras existentes.
// Todo usa los anclajes del fotograma original; accesorios en capa de pelo.
const REF8 = [
 ['kanna','Kanna','blanco','f'], ['zero_two','Zero Two','rosa','f'],
 ['sailor_moon','Sailor Moon','rubio','f'], ['senku','Senku','blanco','m'],
 ['yuichiro','Yuichiro','negro','m'], ['frieren','Frieren','blanco','f'],
 ['dos_b','2B','blanco','f'], ['lina','Lina','naranja','f']
];
AH.r8_kanna = c => { c.bob(c.hy+c.ry+1,{}); c.cap(1); c.blunt({n:6}); c.sidelocks(c.Y(.38),3.2,{}); ahPair(c,(s,side)=>{const x=c.hx+(side?c.k*3:s*(c.rx+2));c.braid(c.up?c.F:c.B,x,c.hy+3,x+s,c.Y(.62),4);}); };
AH.r8_zero_two = c => { c.mane(c.Y(.86),3,5,{w:4}); c.cap(.9,{ba:.02}); c.blunt({n:6}); c.sidelocks(c.Y(.65),2.4,{}); };
AH.r8_sailor_moon = c => { const B=c.up?c.F:c.B; ahPair(c,(s,side)=>{const x=c.hx+(side?c.k*3:s*(c.rx-.2)); c.hang(B,x,c.top+2,s,c.Y(.94),side?5:6,3,{n:1,curl:1.1});}); c.cap(.8); c.fringe('curtain',6); ahPair(c,(s,side)=>c.bun(c.F,c.hx+(side?c.k*4:s*(c.rx-.4)),c.top+.5,2.7)); };
AH.r8_senku = c => { c.nape(c.hy+c.ry,3,{jag:1}); c.cap(.7); c.spikes([[-30,6,5],[-13,9,5],[8,10,6],[29,7,5],[55,4,4]],{bend:.2}); c.fringe('curtain',3); c.sidelocks(c.tt+1,1.7,{}); };
AH.r8_yuichiro = c => { c.nape(c.hy+c.ry+1,5,{jag:1,out:1.4}); c.cap(1.1,{bumps:9}); c.spikes([[-88,3,3],[83,3,3],[-43,2,3],[37,2,3]]); c.fringe('curtain',6,{drop:.8}); c.sidelocks(c.hy+c.ry,2.3,{}); };
AH.r8_frieren = c => { const B=c.up?c.F:c.B; ahPair(c,(s,side)=>c.hang(B,c.hx+(side?c.k*3:s*(c.rx-.5)),c.top+2,s,c.Y(.85),side?4:4.5,4,{n:2})); c.cap(.8,{ba:.02}); c.fringe('curtain',6); c.sidelocks(c.hy+c.ry,2,{}); };
AH.r8_dos_b = c => { c.bob(c.hy+c.ry+1,{front:1}); c.cap(.8,{ba:.02}); c.fringe('swept',4,{dir:1}); if(!c.side || c.d<0)c.eyelock(1); };
AH.r8_lina = c => { c.mane(c.Y(.7),5,5,{jag:1,w:4}); c.cap(1.2); c.spikes([[-65,3,3],[-35,4,4],[4,5,4],[42,3,3]]); c.fringe('point',5); c.sidelocks(c.tt+4,3,{}); c.ahoge(1); };
for (const [id,n] of REF8) for(const T of [HS_F,HS_M]) T.push({n:L2(n,n),cap:'round',bang:'full',side:4,back:12,ah:'r8_'+id});
function r8Decor(p,L,dir,anim,f){const id=L.hs.ah.slice(3),c=ahCtx(p.meta,anim,f,p.w,p.h),tg=p.tg;if(p.t)p.tg=6;
 const line=(pts,w,colors)=>{const layer=ahNew(p.w,p.h);ahLock(layer,pts,w,Math.max(.7,w*.65));ahRender(p,layer,ahPal(pal(colors)),false);};
 const dark=['#141225','#27243e','#45415d','#696482'],white=['#7f8797','#b6c5d0','#e5eaf2','#ffffff'],red=['#57162e','#a52a43','#ea5164','#ffb7bd'],gold=['#745018','#bc8b2d','#f6cc57','#fff0aa'];
 const pair=fn=>ahPair(c,(s,side)=>fn(c.hx+(side?c.k*c.rx*.7:s*c.rx),s,side));
 if(id==='kanna') { pair((x,s)=>line([[x,c.hy-2],[x+s*4,c.hy-4],[x+s*5,c.top-4]],3,white)); if(!c.up){const x=c.side?c.hx+c.k*2:c.hx,y=c.top;line([[x-2,y],[x,y+1],[x+2,y]],2,dark);} // puntas lavanda y cuentas oscuras
 if(L.r8Original)for(let y=Math.ceil(c.tt+1);y<p.h;y++)for(let x=0;x<p.w;x++){const i=y*p.w+x;if(p.t&&p.t[i]===6&&p.get(x,y))p.set(x,y,uMix(p.get(x,y),C('#a58bd2'),.42));}
 pair((x,s)=>{for(let j=0;j<3;j++)line([[x+s,c.tt+j*3],[x+s+.5,c.tt+j*3+1]],2.5,dark);});
 }
 if(id==='zero_two'){line([[c.hx-c.rx*.8,c.top+1],[c.hx,c.top-1],[c.hx+c.rx*.8,c.top+1]],1.5,white);pair((x,s)=>line([[x-s,c.top+1],[x-s,c.top-3]],1.7,red));}
 if(id==='sailor_moon')pair((x,s,side)=>{const xx=side?x:x-s*.4;line([[xx,c.top],[xx,c.top+1]],2.8,gold);line([[xx,c.top],[xx,c.top+.5]],1.4,red);});
 if(id==='senku'&&L.r8Original){for(let y=Math.ceil(c.hy+3);y<=c.tt+3;y++)for(let x=0;x<p.w;x++){const i=y*p.w+x;if(p.t&&p.t[i]===6&&p.get(x,y))p.set(x,y,uMix(p.get(x,y),C('#388e79'),.7));}}
 if(id==='frieren'){pair((x,s)=>{line([[x,c.hy+2],[x+s*5,c.hy],[x+s*2,c.hy+4]],2,['#976e63','#c69b87','#edc5a7','#ffe0bd']);line([[x+s,c.hy+4],[x+s,c.hy+6]],1.2,gold);line([[x+s,c.hy+6],[x+s,c.hy+9]],1.4,red);});}
 if(id==='dos_b')line([[c.hx-c.rx*.8,c.top+2],[c.hx,c.top],[c.hx+c.rx*.7,c.top+2]],1.8,dark);
 if(id==='lina'&&!c.up)line([[c.hx-c.rx*.9,c.ey-3],[c.hx,c.ey-3],[c.hx+c.rx*.9,c.ey-3]],1.2,dark);
 if(p.t)p.tg=tg;
}
{const original=drawHero;drawHero=function(p,L,dir,anim,f){if(L&&L.hs&&/^r8_/.test(L.hs.ah||'')&&!p.t){p.t=new Uint8Array(p.w*p.h);p.tg=0;}const result=original.apply(this,arguments);if(L&&L.hs&&/^r8_/.test(L.hs.ah||'')&&!L.head&&p.meta)r8Decor(p,L,dir,anim,f);return result;};}
// Dibujar cada perfil: el flequillo asimétrico conserva el ojo que tapa.
{const original=heroLook;heroLook=function(){const L=original.apply(this,arguments);if(L.hs&&/^r8_/.test(L.hs.ah||''))L.mirror=false;return L;};}

// Color original y tinte personalizado usan el mismo editor y la misma apariencia guardada.
// Entradas añadidas al final: los índices de todos los peinados anteriores se conservan.
const R8_PALETTES = {
 kanna: ['#78708f','#bcb3d1','#e8e1f4','#fffaff'],
 zero_two: ['#864358','#be7189','#e8a8bc','#ffd4df'],
 sailor_moon: ['#8c5a13','#cc9822','#f4d344','#fff49a'],
 senku: ['#707e72','#a9bba9','#e0e7d4','#fffde9'],
 yuichiro: ['#090b14','#171b2a','#2c3248','#434d68'],
 frieren: ['#75778f','#adb0c5','#dcddea','#fcfbff'],
 dos_b: ['#747987','#aab1bf','#dde2ec','#ffffff'],
 lina: ['#8f2714','#d44d1c','#f7812b','#ffca67']
};
for (const T of [HS_F, HS_M]) for (const H of T) {
 if (H.ah && H.ah.startsWith('r8_')) H.r8Base = H.ah.slice(3);
}
{ const previous = normApp;
 normApp = function (app) {
  const result = previous.apply(this, arguments);
  const H = (result.g === 'm' ? HS_M : HS_F)[result.hs];
  if (H && H.r8Base && app && app.r8Dye === 1) result.r8Dye = 1;
  return result;
 };
}
{ const previous = heroLook;
 heroLook = function (cls, app) {
  const L = previous.apply(this, arguments), A = normApp(app);
  if (L && L.hs && R8_PALETTES[L.hs.r8Base]) {
   L.r8Original = A.r8Dye !== 1;
   if (L.r8Original) {
    L.hair = pal(R8_PALETTES[L.hs.r8Base]);
    delete L.hair2;
   }
  }
  return L;
 };
}
{ const previous = appEditorHTML;
 appEditorHTML = function (app, tabs) {
  const html = previous.apply(this, arguments);
  if (edTab !== 'pelo') return html;
  const A = normApp(app), H = (A.g === 'm' ? HS_M : HS_F)[A.hs];
  if (!H || !H.r8Base) return html;
  const original = A.r8Dye !== 1;
  return html + '<div class="edextra"><h4>' + L2('Tinte del peinado', 'Hairstyle dye') +
   '</h4><div class="chips"><button type="button" class="chip ' + (original ? 'on' : '') +
   '" data-r8tone="original" aria-pressed="' + original + '">' +
   L2('Tinte original', 'Original dye') + '</button><button type="button" class="chip ' +
   (!original ? 'on' : '') + '" data-r8tone="custom" aria-pressed="' + !original + '">' +
   L2('Personalizado', 'Custom') + '</button></div><p class="hint">' +
   L2('El tinte original recupera los colores del diseño. Los colores y mechas de arriba activan el tinte personalizado; los accesorios mantienen su color.',
      'Original dye restores the design colors. Colors and highlights above enable custom dye; accessories keep their color.') +
   '</p></div>';
 };
}
{ const previous = bindAppEditor;
 bindAppEditor = function (root, app, onChange) {
  const result = previous.apply(this, arguments);
  $$('[data-r8tone]', root).forEach(button => {
   button.onclick = () => {
    if (button.dataset.r8tone === 'custom') app.r8Dye = 1;
    else delete app.r8Dye;
    sfx('ui'); onChange(true);
   };
  });
  $$('[data-ek="hair"], [data-ek="hair2"]', root).forEach(button => {
   const click = button.onclick;
   button.onclick = function (event) {
    const H = (app.g === 'm' ? HS_M : HS_F)[app.hs];
    if (H && H.r8Base) app.r8Dye = 1;
    return click && click.call(this, event);
   };
  });
  $$('[data-ek="hs"], [data-ek="g"]', root).forEach(button => {
   const click = button.onclick;
   button.onclick = function (event) {
    // Cada nuevo diseño empieza con su paleta original, sin borrar los tintes elegidos.
    const changed = button.dataset.ek === 'g' ? app.g !== button.dataset.ev : app.hs !== +button.dataset.ev;
    if (changed) delete app.r8Dye;
    return click && click.call(this, event);
   };
  });
  return result;
 };
}
