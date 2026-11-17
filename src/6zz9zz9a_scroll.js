// ================= v5.07: LAS VENTANAS NO VUELVEN ARRIBA AL ELEGIR ALGO =================
// Muchas ventanas se redibujan enteras al tocar una opción (Lupa, tiendas, oficios, panel…) y la lista saltaba al principio.
// Ahora, si después de redibujar sigues en la misma pantalla (mismo título y misma pestaña), se recupera el desplazamiento
// de cada zona con barra (la lista, el detalle, el cuerpo del panel). Al cambiar de pestaña o de ventana sí empieza arriba.
function scrSig(root, extra) { if (!root) return ''; const h = root.querySelector('h2,h3'), on = [...root.querySelectorAll('.chip.on,.tab.on,.mchip.on,[data-t].on')].map(e => e.textContent.trim()).join('|'); return (extra || '') + '§' + (h ? h.textContent.trim() : '') + '§' + on; }
function scrSnap(root) { const out = []; if (!root) return out; const all = [root, ...root.querySelectorAll('*')], seen = {};
 for (const el of all) { const key = el.tagName + '.' + (el.className && el.className.baseVal === undefined ? el.className : '') + (el.id ? '#' + el.id : ''); const n = seen[key] = (seen[key] || 0) + 1;
  if (el.scrollTop > 0 || el.scrollLeft > 0) out.push([key, n, el.scrollTop, el.scrollLeft]); } return out; }
function scrRestore(root, snap) { if (!root || !snap.length) return; const all = [root, ...root.querySelectorAll('*')], seen = {}, idx = {};
 for (const el of all) { const key = el.tagName + '.' + (el.className && el.className.baseVal === undefined ? el.className : '') + (el.id ? '#' + el.id : ''); const n = seen[key] = (seen[key] || 0) + 1; idx[key + '@' + n] = el; }
 for (const [key, n, t, l] of snap) { const el = idx[key + '@' + n]; if (el) { el.scrollTop = t; el.scrollLeft = l; } } }
function scrKeep(root, extra, fn) { const was = root && !root.closest('[hidden]') ? { sig: scrSig(root, extra()), snap: scrSnap(root) } : null; const r = fn();
 if (was && was.snap.length && scrSig(root, extra()) === was.sig) { scrRestore(root, was.snap); requestAnimationFrame(() => { if (scrSig(root, extra()) === was.sig) scrRestore(root, was.snap); }); } return r; }
{ const _om = openModal; openModal = function (html, cls) { const m = $('#modal'), open = m && !m.hidden, root = $('#mbody'); if (!open) return _om.apply(this, arguments); return scrKeep(root, () => m.className, () => _om.apply(this, arguments)); }; }
{ const _rp = renderPanel; renderPanel = function () { const pn = $('#panel'), root = $('#pbody'); if (!pn || pn.hidden) return _rp.apply(this, arguments); return scrKeep(root, () => 'p:' + panelTab, () => _rp.apply(this, arguments)); }; }
