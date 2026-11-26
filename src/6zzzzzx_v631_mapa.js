// 6.31 · Mapa de los mundos secundarios (Sergio: «el mapa del Mar de Dawn no me deja deslizar y ver todas las islas»).
// El lienzo se dibujaba antes de saber el alto real de la ventana: en el móvil apaisado quedaba más alto que el hueco
// (302 px en 233) y el arrastre solo funcionaba con ratón. Ahora, sin zoom, el mapa se encoge hasta caber entero, y con
// zoom se arrastra también con el dedo (touch-action: none y arrastre por puntero de cualquier tipo).
hookAfter('renderMap', () => {
  const scr = document.getElementById('wmScroll'), cvs = document.getElementById('wm'); if (!scr || !cvs || !cvs.width) return;
  const Wd = typeof MAPW_LIST !== 'undefined' && MAPW_LIST[MAPW]; if (!Wd || Wd.id === 'world') return;
  const zoom = (MAPZO && MAPZO[Wd.id]) || 1;
  const fit = () => { const h = scr.clientHeight || parseInt(scr.style.maxHeight) || cvs.height, w = scr.clientWidth || cvs.width; return Math.min(1, h / cvs.height, w / cvs.width); };
  if (zoom === 1) { const f = fit(); if (f < 0.999) { cvs.style.width = Math.floor(cvs.width * f) + 'px'; cvs.style.height = Math.floor(cvs.height * f) + 'px'; } scr.style.textAlign = 'center'; }
  scr.style.touchAction = 'none';
  let drag = null;
  scr.onpointerdown = e => { drag = [e.clientX, e.clientY, scr.scrollLeft, scr.scrollTop, false, e.pointerId]; };
  scr.onpointermove = e => { if (!drag || drag[5] !== e.pointerId) return; const dx = e.clientX - drag[0], dy = e.clientY - drag[1]; if (Math.abs(dx) + Math.abs(dy) > 4) drag[4] = true; scr.scrollLeft = drag[2] - dx; scr.scrollTop = drag[3] - dy; if (drag[4]) e.preventDefault(); };
  scr.onpointerup = scr.onpointercancel = scr.onpointerleave = () => { const moved = drag && drag[4]; setTimeout(() => { drag = null; }, 0); if (moved) { const c = cvs.onclick; cvs.onclick = null; setTimeout(() => { cvs.onclick = c; }, 0); } };
});
