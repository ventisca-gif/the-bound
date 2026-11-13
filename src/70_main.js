// ================= BOOT, TITLE, CHARACTER CREATION, LOOP =================
let lastT = 0, titleMode = true, titleT = 0;
const warmQ = []; // sprite atlases built a few at a time so new mobs never cause a hitch
function runWarm() { if (!warmQ.length) return; const t = performance.now(); while (warmQ.length && performance.now() - t < 4) { try { warmQ.shift()(); } catch (e) { } } }
function loading(msg, pct) { $('#loadmsg').textContent = msg; $('#loadbar i').style.width = pct + '%'; }
const nextFrame = () => new Promise(r => setTimeout(r, 16));
async function boot(hot) {
  resize(); loadSettings();
  loading('Forjando el mundo...', 5); await nextFrame();
  genTextures(); loading('Levantando montañas y ríos...', 20); await nextFrame();
  const W = buildWorld(MOBS); W.chunks = new Map(); decorateWorld(W); G.world = W; G.maps.world = W; initChunkWorker(W);
  loading('Pintando los pueblos...', 60); await nextFrame();
  buildIconAtlas(); setupHUD(); buildMinimapBase();
  loading('Despertando a los aldeanos...', 80); await nextFrame();
  for (const n of W.npcDefs) { const i = W.I(n.x, n.y); spawnNPC(n.id, n.x * 16 + 8, n.y * 16 + 12, 'world', { wander: n.wander, face: n.face, L: W.lvl[i], paxSt: n.st }); } spawnTownfolk(W);
  netInit().then(async () => { const cs = await cloudLoad(); if (cs) { const ls = loadLocal(); if (!ls || (cs.savedAt || 0) > (ls.savedAt || 0)) { storage.set(slotKey(SLOT), JSON.stringify(cs)); CLOUD_SAVE = cs; refreshTitle(); } } });
  for (const n of W.npcDefs) warmQ.push(() => npcAtlas(n.id));
  for (const k in MOBS) warmQ.push(() => mobAtlasFor(MOBS[k].art));
  loading('Listo', 100); await nextFrame();
  $('#loading').hidden = true;
  G.P = { ghost: true, noShadow: true, x: 112 * 16, y: 150 * 16, map: 'world', dir: 'down', L: 0 }; G.map = W; G.time = 18.6 * 60; updateCamera(0, true);
  if (hot && hot.save && hot.save.cls) { startGame(hot.save, false); return; }
  showTitle();
  requestAnimationFrame(loop);
}
let CLOUD_SAVE = null;
let delSlot = -1;
function refreshTitle() {
  const box = $('#tslots'); if (!box) return; let html = '', free = -1;
  for (let i = 0; i < NSLOTS; i++) { const s = loadLocal(i); if (!s) { if (free < 0) free = i; continue; }
    html += `<div class="tslot"><button class="tbtn sm" data-slot="${i}">${esc(s.name)}<small>${CLASSES[s.cls] ? esc(CLASSES[s.cls].n) : ''} · Nivel ${s.lv}${i === SLOT ? ' · última' : ''}</small></button><button class="tdel ${delSlot === i ? 'on' : ''}" data-del="${i}" title="Borrar">${delSlot === i ? '¿Borrar?' : '✕'}</button></div>`; }
  box.innerHTML = html; const nb = $('#tNew'); nb.disabled = free < 0; nb.dataset.slot = free; nb.querySelector('small').textContent = free < 0 ? 'Todos los espacios están llenos' : 'Crea tu héroe · espacio ' + (free + 1) + ' de ' + NSLOTS;
  $$('[data-slot]', box).forEach(b => b.onclick = () => { audioUnlock(); SLOT = +b.dataset.slot; const s = loadLocal(SLOT); if (s) startGame(s, false); });
  $$('[data-del]', box).forEach(b => b.onclick = ev => { ev.stopPropagation(); const i = +b.dataset.del; if (delSlot !== i) { delSlot = i; refreshTitle(); setTimeout(() => { if (delSlot === i) { delSlot = -1; refreshTitle(); } }, 3500); return; } storage.del(slotKey(i)); const k = SLOT; SLOT = i; wipeCloud(); SLOT = k; delSlot = -1; refreshTitle(); });
}
function showTitle() {
  titleMode = true; $('#title').hidden = false; $('#title').classList.remove('creating'); $('#hud').hidden = true; $('#create').hidden = true; $('#tmain').hidden = false; refreshTitle();
  $('#tNew').onclick = () => { audioUnlock(); const i = +$('#tNew').dataset.slot; if (!(i >= 0)) return; SLOT = i; openCreate(); };
  $('#title').onpointerdown = () => audioUnlock();
}
function startGame(save, isNew, name) {
  const W = G.world; let P;
  if (save) { P = Object.assign(newPlayer(save.name, save.cls, save.app), save); } else { P = newPlayer(name, CC.cls, Object.assign({}, CC.app)); }
  initPlayerRuntime(P); G.P = P; G.time = P.time || 8 * 60; titleMode = false;
  $('#title').hidden = true; $('#hud').hidden = false;
  const i = W.I(clamp(Math.floor(P.x / 16), 0, W.w - 1), clamp(Math.floor(P.y / 16), 0, W.h - 1)); if (SOLID_T[W.ter[i]] || W.solidO[i]) { const t = WAYSTONES.find(w => w.k === (P.lastTown || 'albor')); P.x = t.x * 16 + 8; P.y = (t.y + 2) * 16 + 6; }
  setMap(W, P.x, P.y, P.dir); uiDirty.hud = uiDirty.quest = true; updateTracker(); uiOnline();
  if (isNew) { saveGame(true); openModal(`<div class="intro">${STORY_INTRO.map(s => `<p>${esc(s)}</p>`).join('')}<p class="hint">Habla con la <b>Anciana Mira</b> (tiene un <b class="exc">!</b> sobre la cabeza) para comenzar.</p><button class="btn gold big" id="introOk">Comenzar</button></div>`, 'introm'); $('#introOk').onclick = () => { closeModal(); banner('The Bound', 'Valle de Albor'); setTimeout(() => tip('move'), 2600); }; }
  else banner('Bienvenido de nuevo', P.name);
  roomInit(); netHero();
  if (window.claude && window.claude.hot && window.claude.hot.snapshot) { try { window.claude.hot.snapshot(() => ({ save: G.P && !G.P.ghost ? serializeP(G.P) : null })); } catch (e) { } }
  if (!lastT) requestAnimationFrame(loop);
}
function loop(ts) {
  const dt = Math.min(0.05, ((ts - lastT) / 1000) || 0.016); lastT = ts; G.frame++;
  chunkBudget = 1; runWarm();
  if (titleMode) { titleT += dt; G.t += dt; const P = G.P; P.x = (112 + Math.sin(titleT * 0.05) * 14) * 16; P.y = (149 + Math.sin(titleT * 0.033) * 5) * 16; updateCamera(dt); render(); prewarm(G.map); drawCreatePreview(dt); for (const e of G.ents) if (e.type === 'npc' && e.map === 'world') updateNPC(e, dt); G.parts = G.parts.filter(p => (p.t += dt) < p.life); for (const p of G.parts) { p.x += p.vx * dt; p.y += p.vy * dt; } }
  else {
    update(dt); if (reel.on) updateReel(dt); render(); updateHUD(dt);
    if (!$('#panel').hidden && panelTab === 'char') { previewT += dt; animPreview(); }
    if (!$('#panel').hidden && panelTab === 'wardrobe') drawWardrobePreview(dt);
    if (chunkBudget > 0 || useWorker(G.map)) prewarm(G.map);
  }
  requestAnimationFrame(loop);
}
document.addEventListener('visibilitychange', () => { if (document.hidden && G.P && !G.P.ghost) saveGame(true); try { if (AC) { if (document.hidden) AC.suspend(); else AC.resume(); } } catch (e) { } });
// Android app: the system back button/gesture closes the open window, or opens the menu (never quits by accident)
window.onAndroidBack = () => { if (!$('#modal').hidden && G.P) { closeModal(); return; } if (!$('#panel').hidden) { closePanel(); return; } if (!$('#dialog').hidden) { closeDialog(); return; } if (!$('#chatbox').hidden) { $('#chatbox').hidden = true; return; } if (G.P && !G.P.dead) openPanel('opts'); };
addEventListener('pagehide', () => { if (G.P && !G.P.ghost) saveGame(true); });
window.addEventListener('error', e => { const el = document.getElementById('errlog'); if (el) { el.hidden = false; el.textContent = 'Error: ' + (e.message || e.error); } });
(function start() { const h = window.claude && window.claude.hot; if (h && h.ready) { try { h.ready(d => boot(d || {})); return; } catch (e) { } } boot((h && h.data) || {}); })();
