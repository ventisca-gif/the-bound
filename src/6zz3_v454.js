// =====================================================================================
// v4.54: equipo de los hijos (no puedes quitarles lo que nunca conseguiste ni puedes usar),
// menos curación de enemigos y jefes, y rendimiento con muchos enemigos (sin perder nada).
// =====================================================================================

// ---------- objetos que has conseguido alguna vez ----------
function seenMark(id) { const P = G.P; if (!P || !id) return; P.seen = P.seen || {}; P.seen[id] = 1; }
{ const _gi = giveItem; giveItem = function (id) { try { seenMark(id); } catch (e) { } return _gi.apply(this, arguments); }; }
let SEEN_INIT = null;
V33_TICKS.push(() => { const P = G.P; if (!P || SEEN_INIT === P) return; SEEN_INIT = P; if (P.seen) return; P.seen = {}; for (const s of P.inv || []) if (s && s.id) P.seen[s.id] = 1; for (const sl in P.equip || {}) if (P.equip[sl]) P.seen[P.equip[sl].id] = 1; });
function kidGearLocked(id) { const P = G.P, it = ITEMS[id]; if (!it) return false; return (it.lv || 1) > P.lv && !(P.seen && P.seen[id]); }
{ const _ok = openKid; openKid = function (e) { const r = _ok.apply(this, arguments); try { const k = e && e.kid; if (!k) return r;
      $$('[data-kun]').forEach(b => { const sl = b.dataset.kun, s = k.equip && k.equip[sl]; if (!s || !kidGearLocked(s.id)) return; const sm = b.querySelector('small'); if (sm) sm.textContent = L2('Es de ', 'Belongs to ') + k.name + L2(' · necesitas nivel ', ' · you need level ') + (ITEMS[s.id].lv || 1);
        b.onclick = () => { toast(L2('No puedes quitárselo: es de ', 'You can\'t take it: it belongs to ') + k.name + L2('. Necesitas nivel ', '. You need level ') + (ITEMS[s.id].lv || 1) + L2(' o haberlo conseguido tú antes.', ' or to have got it yourself before.'), 'warn', 4); }; }); } catch (x) { } return r; }; }

// ---------- curación de enemigos ----------
// 1) las invocaciones de un jefe no pueden ser Curandero ni Guardián
// 2) el Curandero cura un 8 % cada 5 s (a un jefe, solo un 1,5 %)
// 3) un jefe no puede recuperar más de ~0,6 % de su vida por segundo, venga de donde venga
{ const _um = updateMob; updateMob = function (m, dt) {
    if (m && m.summoned && m.role && !m._roleOff) { m._roleOff = 1; m.role = null; if (m.def) m.name = m.def.n; }
    let heal = false; if (m && m.role === 'healer' && !m.dying) { m.hlT2 = (m.hlT2 === undefined ? 5 : m.hlT2) - (dt || 0); m.hlT = 99; if (m.hlT2 <= 0 && m.state !== 'idle' && !(m.stun > 0) && !(m.freeze > 0)) { m.hlT2 = 5; heal = true; } }
    const r = _um.apply(this, arguments);
    if (heal) { let best = null; for (const o of G.ents) if (o !== m && o.type === 'mob' && !o.dying && o.map === m.map && o.hp < o.maxhp * 0.9 && dist2(o.x, o.y, m.x, m.y) < 100 * 100 && (!best || o.hp / o.maxhp < best.hp / best.maxhp)) best = o;
      if (best) { const h = Math.round(best.maxhp * (best.boss ? 0.015 : 0.08)); best.hp = Math.min(best.maxhp, best.hp + h); floatText(best.x, best.y - (best.hgt || 28) - 8, '+' + fmt(h), '#6aff6a'); addFx({ type: 'bolt', x: m.x, y: m.y - 14, x2: best.x, y2: best.y - 14, dur: 0.35, col: '#6aff6a' }); setAnim(m, 'atk'); } }
    return r; }; }
V33_TICKS.push(dt => { dt = dt || 0; for (const m of G.ents) { if (m.type !== 'mob' || !m.boss || m.dying) continue; if (m._hl === undefined) { m._hl = m.hp; m._hb = m.maxhp * 0.03; continue; }
    m._hb = Math.min(m.maxhp * 0.05, m._hb + m.maxhp * 0.006 * dt); const gain = m.hp - m._hl; if (gain > 0) { const ok = Math.min(gain, m._hb); m._hb -= ok; if (gain > ok && m.state !== 'return' && m.state !== 'idle') m.hp -= (gain - ok); } m._hl = m.hp; } });
// el Obispo Hueco reza menos fuerte
for (const T_ of [typeof BMECH !== 'undefined' ? BMECH : null]) if (T_ && T_.obispo_hueco) { const f = T_.obispo_hueco.fn; T_.obispo_hueco.fn = function (m) { const h0 = m.hp; const r = f.apply(this, arguments); if (m.hp > h0) m.hp = Math.min(m.maxhp, h0 + m.maxhp * 0.02); return r; }; }

// =====================================================================================
// RENDIMIENTO
// =====================================================================================
// 1) los enemigos teñidos (Luna de Sangre, corruptos, Imitador, sombras) ya no usan ctx.filter en cada
//    fotograma: se prepara una copia teñida de su dibujo una sola vez
const TINTC = new WeakMap(); let NOFILTER = false;
{ const proto = Object.getPrototypeOf(ctx), d = Object.getOwnPropertyDescriptor(proto, 'filter'); if (d && d.set) Object.defineProperty(ctx, 'filter', { configurable: true, get() { return d.get.call(this); }, set(v) { if (NOFILTER) return; d.set.call(this, v); } }); }
function tintCanvas(src, f) { if (!src) return src; const c = mkCanvas(src.width, src.height), x = c.getContext('2d'); x.filter = f; x.drawImage(src, 0, 0); return c; }
function tintAtlas(A, f) { let m = TINTC.get(A); if (!m) { m = {}; TINTC.set(A, m); } if (m[f]) return m[f]; const B = Object.assign({}, A, { img: tintCanvas(A.img, f) }); if (A.hi) B.hi = tintCanvas(A.hi, f); B.hdL = null; B.hd = null; return m[f] = B; }
function entFilter(e) { if (!e || e.dying) return null; if (e.type === 'mob' && e.mid === 'imitador') return 'hue-rotate(160deg) brightness(0.75)'; if (e.type === 'mob' && e.blood) return 'sepia(1) saturate(4) hue-rotate(-40deg)'; if (e.type === 'mob' && e.corrupt) return 'saturate(1.6) hue-rotate(60deg) brightness(0.8)'; if (e.shadow) return 'brightness(0.25) saturate(0)'; return null; }
{ const _de = drawEnt; drawEnt = function (e) { const f = entFilter(e); if (!f || !e.atlas) return _de.apply(this, arguments); const A = e.atlas; e.atlas = tintAtlas(A, f); NOFILTER = true; try { return _de.apply(this, arguments); } finally { NOFILTER = false; e.atlas = A; } }; }
// 2) sonidos: el mismo sonido no se repite más de una vez cada 60 ms y como mucho 14 sonidos cada 250 ms
{ const _sf = sfx, last = {}; let win = 0, n = 0; sfx = function (k) { const t = performance.now(); if (last[k] && t - last[k] < 60) return; if (t - win > 250) { win = t; n = 0; } if (++n > 14) return; last[k] = t; return _sf.apply(this, arguments); }; }
// 3) con muchas partículas en pantalla, las ráfagas nuevas son más pequeñas
{ const _bu = burst; burst = function (x, y, n, o) { const L = G.parts.length; if (L > 120) n = Math.max(2, Math.ceil(n * (L > 200 ? 0.25 : 0.5))); return _bu.call(this, x, y, n, o); }; }
// 4) con muchos números flotando, los golpes pequeños repetidos no crean más números (los críticos y textos sí)
{ const _ft = floatText; floatText = function (x, y, str, col, big) { if (G.texts.length > 24 && !big && /^[0-9.,]+$/.test(String(str)) && Math.random() < 0.6) return; return _ft.apply(this, arguments); }; }
// 5) con muchísimas partículas, las sueltas de adorno (chispas de enemigos) se saltan en parte
{ const _pa = part; part = function () { const L = G.parts.length; if (L > 150 && Math.random() < (L > 220 ? 0.75 : 0.45)) return; return _pa.apply(this, arguments); }; }
// 6) el velo rojo de la Luna de Sangre se dibuja con una imagen preparada (antes: degradado nuevo en cada fotograma)
let BM_OV = null;
function bmOverlay() { if (BM_OV && BM_OV.width === VW && BM_OV.height === VH) return BM_OV; const c = mkCanvas(VW, VH), x = c.getContext('2d'); x.fillStyle = 'rgba(170,0,10,0.24)'; x.fillRect(0, 0, VW, VH); const g = x.createRadialGradient(VW / 2, VH / 2, VH * 0.3, VW / 2, VH / 2, VW * 0.7); g.addColorStop(0, 'rgba(120,0,0,0)'); g.addColorStop(1, 'rgba(90,0,0,0.45)'); x.fillStyle = g; x.fillRect(0, 0, VW, VH); return BM_OV = c; }
{ const _dw = drawWeather; drawWeather = function (cx, cy, after) { if (!after || !G.map || !G.map.isWorld || !SETTINGS.weather || !G.P || G.P.ghost || !bloodMoon()) return _dw.apply(this, arguments); const bm = bloodMoon; bloodMoon = () => false; try { _dw.apply(this, arguments); } finally { bloodMoon = bm; } ctx.drawImage(bmOverlay(), 0, 0); }; }
