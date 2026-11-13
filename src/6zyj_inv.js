// ================= v4.14: INVENTARIO MÁS CÓMODO =================
// - Objetos de misión que ya no pide ninguna misión activa (p. ej. tarjetas de tren de más) se pueden tirar.
// - Tarjeta de tren repetida: se convierte en 100 de saldo en lugar de ocupar otra casilla.
// - Botón «Seleccionar»: marca varios objetos y tíralos todos de una vez (pide confirmación).
// - Al equipar, comprar o tocar algo, las listas (inventario, armario, tiendas) ya no vuelven arriba.
function invNeeded(id) { const P = G.P; for (const q in (P.quests && P.quests.active) || {}) { const Q = QD(q); if (Q && Q.obj && Q.obj.some(o => (o.it === id) || (o.item === id))) return true; } return false; }
function invCanDrop(id) { const it = ITEMS[id]; if (!it) return false; if (it.t !== 'quest') return true; return !invNeeded(id); }
// tarjetas de tren repetidas → saldo
{ const _gi = giveItem; giveItem = function (id, q = 1, silent) { if (id === 'tarjeta_tren' && G.P && countItem('tarjeta_tren') > 0) { railCred().c += 100 * (q || 1); if (!silent) toast(L2('Ya tenías Tarjeta de Tren: +' + 100 * (q || 1) + ' de saldo', 'You already had a Train Card: +' + 100 * (q || 1) + ' credit'), 'loot'); return true; } return _gi(id, q, silent); }; }
V33_TICKS.push(() => { const P = G.P; if (!P || P._cardFix) return; P._cardFix = 1; let n = 0; for (let i = P.inv.length - 1; i >= 0; i--) { const s = P.inv[i]; if (s && s.id === 'tarjeta_tren') { n++; if (n > 1) { P.inv.splice(i, 1); railCred().c += 100; } } } });
// ---- selección múltiple ----
const INV_MS = { on: false, sel: new Set(), confirm: false };
{ const _ri = renderInv; renderInv = function (B) {
  _ri(B); const P = G.P;
  // tirar objetos de misión que ya no se necesitan
  const s = P.inv[invSel], it = s ? ITEMS[s.id] : null;
  if (it && it.t === 'quest' && !$('#idrop', B)) { const row = $('.invR .row', B) || $('.invR', B); const can = !invNeeded(s.id);
    row.insertAdjacentHTML('beforeend', can ? `<button class="btn danger" id="idropq">${dropConfirm === invSel ? L2('¿Seguro? Tirar', 'Sure? Drop') : L2('Tirar', 'Drop')}</button>` : `<small class="hint">${L2('Lo pide una misión activa', 'An active quest needs it')}</small>`);
    const d = $('#idropq', B); if (d) d.onclick = () => { if (dropConfirm !== invSel) { dropConfirm = invSel; renderPanel(); return; } P.inv.splice(invSel, 1); invSel = -1; dropConfirm = -1; renderPanel(); }; }
  // barra de selección
  const chips = $('.invL .chips', B); if (!chips) return;
  for (const i of [...INV_MS.sel]) if (!P.inv[i] || !invCanDrop(P.inv[i].id)) INV_MS.sel.delete(i);
  const n = INV_MS.sel.size;
  chips.insertAdjacentHTML('beforeend', INV_MS.on ? `<button class="chip on" id="imsOff">${L2('Cancelar', 'Cancel')}</button><button class="chip" id="imsAll">${L2('Todo lo visible', 'All visible')}</button><button class="chip ${n ? 'danger' : ''}" id="imsDrop" ${n ? '' : 'disabled'}>${INV_MS.confirm ? L2('¿Seguro? Tirar ', 'Sure? Drop ') + n : L2('Tirar ', 'Drop ') + n}</button>` : `<button class="chip" id="imsOn">☑ ${L2('Seleccionar', 'Select')}</button>`);
  const on = $('#imsOn', B); if (on) on.onclick = () => { INV_MS.on = true; INV_MS.sel.clear(); INV_MS.confirm = false; renderPanel(); };
  const off = $('#imsOff', B); if (off) off.onclick = () => { INV_MS.on = false; INV_MS.sel.clear(); INV_MS.confirm = false; renderPanel(); };
  const all = $('#imsAll', B); if (all) all.onclick = () => { $$('.slot[data-i]', B).forEach(b => { const i = +b.dataset.i; if (P.inv[i] && invCanDrop(P.inv[i].id)) INV_MS.sel.add(i); }); INV_MS.confirm = false; renderPanel(); };
  const dr = $('#imsDrop', B); if (dr) dr.onclick = () => { if (!INV_MS.sel.size) return; if (!INV_MS.confirm) { INV_MS.confirm = true; renderPanel(); return; }
    const idx = [...INV_MS.sel].sort((a, b) => b - a); for (const i of idx) P.inv.splice(i, 1); toast(L2('Tirados: ', 'Dropped: ') + idx.length, 'info'); INV_MS.sel.clear(); INV_MS.confirm = false; INV_MS.on = false; invSel = -1; markDirty && markDirty(); renderPanel(); };
  if (INV_MS.on) $$('.slot[data-i]', B).forEach(b => { const i = +b.dataset.i; if (INV_MS.sel.has(i)) b.classList.add('msel'); if (!invCanDrop(P.inv[i].id)) b.classList.add('mlock');
    b.onclick = () => { if (!invCanDrop(P.inv[i].id)) { toast(L2('Lo pide una misión activa', 'An active quest needs it'), 'warn'); return; } if (INV_MS.sel.has(i)) INV_MS.sel.delete(i); else INV_MS.sel.add(i); INV_MS.confirm = false; renderPanel(); sfx('ui'); }; });
}; }
{ const st = document.createElement('style'); st.textContent = '.slot.msel{outline:3px solid #ff5a5a;background:rgba(255,80,80,.18)}.slot.mlock{opacity:.45}.chip.danger{background:#7a1a1a;color:#fff}'; document.head.appendChild(st); }
// ---- las listas no vuelven arriba al volver a dibujarse ----
function scrollSnap(root) { const out = []; if (!root) return out; const cnt = {}; for (const el of root.querySelectorAll('*')) { if (el.scrollHeight <= el.clientHeight + 2) continue; const k = el.tagName + '.' + el.className; const n = cnt[k] = (cnt[k] || 0) + 1; if (el.scrollTop > 0) out.push([k, n, el.scrollTop]); } if (root.scrollTop > 0) out.push(['ROOT', 0, root.scrollTop]); return out; }
function scrollRestore(root, snap) { if (!root || !snap.length) return; const cnt = {}, map = {}; for (const el of root.querySelectorAll('*')) { const k = el.tagName + '.' + el.className; const n = cnt[k] = (cnt[k] || 0) + 1; map[k + '#' + n] = el; } for (const [k, n, t] of snap) { const el = k === 'ROOT' ? root : map[k + '#' + n]; if (el) el.scrollTop = t; } }
function scrollKeep(sel, fn, ctx) { return function () { const root = document.querySelector(sel), snap = scrollSnap(root), c0 = ctx ? ctx() : ''; const r = fn.apply(this, arguments); if (!ctx || ctx() === c0) { try { scrollRestore(document.querySelector(sel), snap); } catch (e) { } } return r; }; }
// solo si sigues en la misma pestaña (al cambiar de pestaña se empieza arriba)
renderPanel = scrollKeep('#panel', renderPanel, () => panelTab + '|' + (typeof invFilter !== 'undefined' ? invFilter : '') + '|' + (typeof wdSlot !== 'undefined' ? wdSlot : ''));
renderShop = scrollKeep('#modal', renderShop, () => (shopState && shopState.kind) + '|' + (shopState && shopState.town));
