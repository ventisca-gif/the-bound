// ================= PELUQUERÍA: cambia peinado, colores, cuerpo y ropa base sin perder nada =================
const BARBER_PRICE = 300;
NPCS.peluquera = { n: 'Coral la Estilista', title: 'Peluquería de Puerto Coral', look: LK({ hair: HAIRS.rosa, hairStyle: 'long', outfit: 'apron', eyes: 'turquesa', main: P5(['#3a0e24', '#741e46', '#b03a6c', '#e06898', '#ffa2c4']) }),
  lines: ['¡Pasa, pasa! Un corte nuevo y serás otra persona… pero con tu mismo nivel, tranquilo.', 'Peinados, tintes, mechas, ojos, ropa… ¡lo que quieras!'] };
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W); const t = TOWNS.find(t => t.k === 'puerto'); if (t) { const [x, y] = freeTileNear(W, (t.x0 + t.x1) / 2 + 4, (t.y0 + t.y1) / 2 + 4); W.npcDefs.push({ id: 'peluquera', x, y, face: 'down' }); } }; }
DLG_HOOKS.push((npc, opts) => { if (npc.id !== 'peluquera') return; opts.unshift({ label: `Cambiar mi apariencia (${BARBER_PRICE} oro)`, icon: ['star', '#ff8ab0'], fn: () => { closeDialog && closeDialog(); openBarber(); } }); });
let BARB = null;
function openBarber() {
  const P = G.P; if (!P) return; const orig = JSON.parse(JSON.stringify(normApp(P.app))), app = JSON.parse(JSON.stringify(orig)); EDIT_CLS = P.cls; edTab = 'pelo';
  BARB = { app, t: 0 };
  const render = () => {
    openModal(`<h2>Peluquería</h2><p class="hint">Cambia tu peinado, colores, cuerpo y ropa base. Tu clase, nivel y equipo no cambian. Precio: <b>${BARBER_PRICE} oro</b> (tienes ${fmt(P.gold)}).</p>
      <div class="barb"><canvas id="barbPrev" width="96" height="96"></canvas><div class="barbEd">${appEditorHTML(app, [['pelo', 'Pelo'], ['cuerpo', 'Cuerpo'], ['ropa', 'Ropa']])}</div></div>
      <div class="row"><button class="btn gold" id="barbOk">Guardar cambios</button><button class="btn" id="barbNo">Cancelar</button></div>`, 'party');
    bindAppEditor($('#mbody'), app, ch => { BARB.atlas = null; render(); });
    $('#barbOk').onclick = () => {
      if (JSON.stringify(app) === JSON.stringify(orig)) { closeBarber(); return; }
      if (P.gold < BARBER_PRICE) { toast('No tienes suficiente oro', 'warn'); return; }
      P.gold -= BARBER_PRICE; const keep = { pz: P.app && P.app.pz, asc: P.app && P.app.asc }; P.app = Object.assign(normApp(app), keep.pz ? { pz: keep.pz } : {}, keep.asc ? { asc: 1 } : {});
      refreshLook(); markDirty(true); toast('¡Te ves genial!', 'quest'); sfx('quest'); closeBarber();
    };
    $('#barbNo').onclick = closeBarber;
  };
  render();
}
function closeBarber() { BARB = null; EDIT_CLS = null; closeModal(); }
function drawBarberPreview(dt) {
  if (!BARB) return; const c = $('#barbPrev'); if (!c) return; const P = G.P; BARB.t += dt;
  if (!BARB.atlas) { const a = Object.assign(normApp(BARB.app), P.app && P.app.pz ? { pz: P.app.pz } : {}, P.app && P.app.asc ? { asc: 1 } : {}); BARB.atlas = buildHeroAtlas(heroLook(P.cls, a, gearTiers(P), P.cos || {}, { hideHelm: 1 })); }
  const A = BARB.atlas, x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.clearRect(0, 0, c.width, c.height);
  const f = Math.floor(BARB.t * 5) % 4, dir = Math.floor(BARB.t / 2.5) % 4; x.drawImage(A.img, (A.idx.walk + f) * A.fw, [0, 1, 3, 2][dir] * A.fh, A.fw, A.fh, (c.width - A.fw * 2) / 2, c.height - A.fh * 2, A.fw * 2, A.fh * 2);
}
{ const _uh = updateHUD; updateHUD = function (dt) { _uh(dt); drawBarberPreview(dt); }; }
