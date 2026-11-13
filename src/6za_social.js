// ================= v3.3 SOCIAL: botón de gestos, invitación a bodas, grupos de 6, sincronía ampliada =================
// ---------- botón de gestos y bailes (abajo a la derecha) ----------
{ const _gi = genIcon; genIcon = function (spec) { if (spec[0] !== 'emote') return _gi(spec); const p = new Pix(16, 16), Y = [C('#7a4a08'), C('#d89a18'), C('#ffd040'), C('#fff0a0')], K = C('#2a1a10');
  p.ball(7, 8.5, 5.5, 5.5, Y); p.set(5, 7, K); p.set(9, 7, K); p.set(5, 6, K); p.set(9, 6, K); p.hl(5, 10, 5, K); p.set(4, 9, K); p.set(10, 9, K);
  const N = C('#ff7ab0'); p.vl(14, 1, 5, N); p.set(13, 1, N); p.set(15, 2, N); p.rect(12, 5, 2, 2, N); p.outline(OUTL); return p; }; }
function emoPopHTML() {
  const P = G.P, owned = (P.dances || ['clasico']).filter(k => DANCES[k]);
  const g = [['wave', 'Saludar'], ['cheer', 'Celebrar'], ['sit', 'Sentarse'], ['kiss2', 'Lanzar beso']].filter(x => x[0] !== 'kiss2' || ANIMS.kiss);
  return `<b>Gestos</b><div class="emorow">${g.map(([k, n]) => `<button class="btn sm" data-emk="${k}">${n}</button>`).join('')}</div><b>Bailes</b><div class="emorow">${owned.map(k => `<button class="btn sm" data-emd="${k}">${esc(DANCES[k].n)}</button>`).join('')}</div><small>Los demás jugadores ven tus gestos y bailes.</small>`;
}
function toggleEmoPop(force) {
  let pop = $('#emoPop'); if (!pop) { pop = document.createElement('div'); pop.id = 'emoPop'; pop.hidden = true; document.body.appendChild(pop); }
  const show = force !== undefined ? force : pop.hidden; if (!show) { pop.hidden = true; return; }
  if (!G.P || G.P.ghost) return; pop.innerHTML = emoPopHTML(); pop.hidden = false; sfx('ui');
  $$('[data-emk]', pop).forEach(b => b.onclick = () => { pop.hidden = true; const k = b.dataset.emk; if (k === 'kiss2') { const P = G.P; setAnim(P, 'kiss'); P.loopAnim = false; P.emote = 'kiss'; P.emoteT = 1.2; for (let i = 0; i < 5; i++) burst(P.x + (Math.random() - 0.5) * 10, P.y - 26, 1, { sp: 20, up: 40, g: -30, life: 1.2, c: ['#ff5a8a', '#ffb0c8'] }); netPresence(true); } else doEmote(k); });
  $$('[data-emd]', pop).forEach(b => b.onclick = () => { pop.hidden = true; G.P.dk = null; doDance(b.dataset.emd); });
}
function mountEmoBtn() {
  const acts = $('#acts'); if (!acts || $('#bEmo')) return;
  const b = document.createElement('button'); b.className = 'rb'; b.id = 'bEmo'; b.title = 'Gestos y bailes'; b.setAttribute('aria-label', 'Gestos y bailes');
  acts.appendChild(b);
  b.addEventListener('pointerdown', e => { e.stopPropagation(); e.preventDefault(); toggleEmoPop(); });
  document.addEventListener('pointerdown', e => { const pop = $('#emoPop'); if (pop && !pop.hidden && !pop.contains(e.target) && e.target !== b && !b.contains(e.target)) pop.hidden = true; }, true);
}
UI_ICONS.push('emote');
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountEmoBtn); else mountEmoBtn();

// ---------- bodas: invitación opcional a todos los de la sala (WiFi u online) ----------
{ const _sr = socialRecv; socialRecv = function (r, pr) {
  const w = pr.wd, had = r.wdSeen; _sr(r, pr);
  if (w && typeof w.tk === 'string' && r.wdSeen === w.t0 && had !== w.t0 && TOWNS.find(t => t.k === w.tk) && ROM[w.k]) wedInvite(r.name, w.tk, nick(w.k));
}; }
function wedInvite(who, tk, partner) {
  const box = $('#invbox'); if (!box || G.P.ghost) return; if (!box.hidden && PARTY.pending) return;
  const town = TOWNS.find(t => t.k === tk); box.hidden = false;
  box.innerHTML = `💍 <b>${esc(who)}</b> se casa con <b>${esc(partner)}</b> en ${esc(town.n)}. ¿Quieres ir a la boda?<div class="row"><button class="btn gold" id="wiGo">Ir a la boda</button><button class="btn" id="wiNo">No, gracias</button></div>`; sfx('quest');
  $('#wiGo').onclick = () => { box.hidden = true; const P = G.P; if (P.dead || (typeof WED !== 'undefined' && WED)) return; const D = wedDecor(tk); transition(() => { P.inside = null; setMap(G.world, D.px * 16 + 8, (D.py + 3) * 16 + 8, 'up'); markDirty(); toast('Has llegado a la boda. ¡Felicita a los novios!', 'quest'); }); };
  $('#wiNo').onclick = () => { box.hidden = true; };
  clearTimeout(wedInvite.t); wedInvite.t = setTimeout(() => { if ($('#wiGo')) box.hidden = true; }, 30000);
}

// ---------- grupos: buscar y unirse en mundos públicos (máx. 6) ----------
function openGroups() {
  const out = new Map();
  for (const r of G.remote.values()) { if (!r.pt || !r.id) continue; const g = out.get(r.pt) || { pt: r.pt, n: 0, lead: null }; g.n++; if (r.id === r.pt) g.lead = r; out.set(r.pt, g); }
  return [...out.values()].filter(g => g.lead && g.pt !== PARTY.id);
}
{
  const _op = openParty;
  openParty = function () {
    _op.apply(this, arguments);
    const body = $('#mbody'); if (!body || !netOnline()) return;
    const groups = openGroups(), P = G.P;
    let h = `<h3>Buscar grupo</h3><p class="hint">Únete a un grupo de jugadores (máx. ${PARTY_MAX}). En grupo veis los mismos monstruos en el mismo sitio, compartís experiencia y misiones, y el daño a los jefes se suma.</p>`;
    h += groups.length ? groups.map(g => `<div class="srow"><div class="sn"><b>Grupo de ${esc(g.lead.name)}</b><small>${g.n}/${PARTY_MAX} jugadores · ${esc(CLASSES[g.lead.cls] ? CLASSES[g.lead.cls].n : '')} Nv.${g.lead.lv}</small></div><button class="btn sm" data-gjoin="${esc(g.pt)}" ${g.n >= PARTY_MAX ? 'disabled' : ''}>${g.n >= PARTY_MAX ? 'Lleno' : 'Unirme'}</button></div>`).join('') : '<p class="hint">Todavía no hay grupos abiertos.</p>';
    if (!PARTY.id) h += `<div class="row"><button class="btn gold sm" id="gNew">Crear un grupo</button></div>`;
    const wrap = document.createElement('div'); wrap.innerHTML = h;
    const anchor = [...body.querySelectorAll('h3')].find(e => /Duelos|Duels/.test(e.textContent)); if (anchor) anchor.parentNode.insertBefore(wrap, anchor); else body.appendChild(wrap);
    $$('[data-gjoin]', wrap).forEach(b => b.onclick = () => { const g = openGroups().find(x => x.pt === b.dataset.gjoin); if (!g || g.n >= PARTY_MAX) { toast('Ese grupo está lleno', 'warn'); return; } PARTY.id = g.pt; PARTY.kq = []; PARTY.bd = null; PARTY.pending = null; toast('Te uniste al grupo de ' + g.lead.name, 'quest'); sfx('quest'); netPresence(true); uiParty(); openParty(); });
    const n = $('#gNew', wrap); if (n) n.onclick = () => { PARTY.id = NET.myId; PARTY.kq = []; PARTY.bd = null; toast('Grupo creado. Otros jugadores pueden unirse desde «Buscar grupo»', 'quest'); netPresence(true); uiParty(); openParty(); };
  };
}
// el líder se entera de quién entra en su grupo abierto
{ const _pr = partyRecv; partyRecv = function (r, pr) { const was = r.pt; _pr(r, pr); if (PARTY.id && PARTY.id === NET.myId && r.pt === PARTY.id && was !== PARTY.id && was !== undefined) { toast(r.name + ' se unió a tu grupo', 'quest'); uiParty(); } }; }

// ---------- sincronía de monstruos del grupo en todos los mapas compartidos ----------
const SYNC_MAPS = new Set(['world', 'archipielago', 'nerea', 'submarino', 'tumba', 'espiritual', 'mina_profunda'].concat(Object.keys(CAVES)));
syncActive = function () { const L = partyLeader(), P = G.P; return !!(L && L.map === P.map && SYNC_MAPS.has(P.map) && !P.dead && dist(L.x, L.y, P.x, P.y) < SYNC_R + 200 && L.mbT && G.t - L.mbT < 3); };
syncPresence = function (o) {
  const P = G.P; if (!iAmLeader() || !SYNC_MAPS.has(P.map)) return; const out = [];
  for (const m of G.ents) { if (m.type !== 'mob' || m.boss || m.dying || m.map !== P.map || m.state === 'dummy' || m.ghost) continue; if (dist2(m.x, m.y, P.x, P.y) > SYNC_R * SYNC_R) continue; if (!m.nid) m.nid = ++NID;
    out.push([m.nid, m.mid, m.lv, Math.round(m.x), Math.round(m.y), Math.max(1, Math.round(m.hp / m.maxhp * 100)), m.anim === 'atk' ? 1 : m.anim === 'walk' ? 2 : 0, DIRS.indexOf(m.dir), m.elite ? 1 : 0]); if (out.length >= 24) break; }
  o.mb = out;
};
// los monstruos propios del miembro quedan "dormidos" mientras ve los del líder (sin duplicados); vuelven al salir
let _supT = 0;
function syncSuppressTick(dt) {
  _supT += dt; if (_supT < 0.25) return; _supT = 0; const P = G.P; if (!P || !G.map) return;
  const on = syncActive() && G.map.id !== 'world', L = on ? partyLeader() : null;
  for (const m of G.ents) {
    if (m.type !== 'mob' || m.ghost || m.boss || m.dying) continue;
    if (on && m.map === G.map.id && dist2(m.x, m.y, L.x, L.y) < (SYNC_R + 260) ** 2) { m.supMap = m.map; m.map = '_sync'; }
    else if (m.map === '_sync' && (!on || m.supMap !== G.map.id || dist2(m.x, m.y, L.x, L.y) >= (SYNC_R + 260) ** 2)) { m.map = m.supMap; m.supMap = null; }
  }
}

// ---------- hijos que te acompañan: también los ven los demás ----------
{ const _sp = socialPresence; socialPresence = function (o) { _sp(o); const ks = (typeof FOLLOW_KIDS !== 'undefined' ? FOLLOW_KIDS : []).filter(e => e && !e.remove && e.map === G.P.map).slice(0, 3); if (ks.length) o.kd = ks.map(e => [String(e.kid.name || '').slice(0, 14), e.kid.cls || '', normApp(e.kid.app), kidStage(e.kid), Math.round(e.x), Math.round(e.y), DIRS.indexOf(e.dir), e.anim === 'walk' ? 1 : 0]); }; }
{ const _sr = socialRecv; socialRecv = function (r, pr) {
  _sr(r, pr); r.rkd = r.rkd || [];
  const a = Array.isArray(pr.kd) ? pr.kd.slice(0, 3) : [];
  a.forEach((k, i) => { if (!Array.isArray(k) || !k[2] || typeof k[2] !== 'object') return; const cls = CLASSES[k[1]] ? k[1] : 'guerrero', app = normApp(k[2]), st = clamp(k[3] | 0, 1, 2), key = cls + JSON.stringify(app) + st;
    let e = r.rkd[i]; if (!e || e.remove || e.key !== key) { if (e) e.remove = true; e = { type: 'rkid', key, x: +k[4], y: +k[5], L: 0, map: r.map, dir: 'down', anim: 'idle', af: 0, at: 0, hum: true, scale: st === 1 ? 0.78 : 0.92, name: cleanStr(k[0], 14) };
      e.atlas = getAtlas('RK' + heroKey(cls, app, { weapon: 1 }, {}, 0), () => buildHeroAtlas(heroLook(cls, app, { weapon: 1 }, {}, {}))); G.ents.push(e); r.rkd[i] = e; }
    e.tx = +k[4]; e.ty = +k[5]; e.dir = DIRS[k[6]] || 'down'; e.ta = k[7] ? 'walk' : 'idle'; e.map = r.map; e.seen = G.t; });
  for (let i = a.length; i < r.rkd.length; i++) if (r.rkd[i]) { r.rkd[i].remove = true; r.rkd[i] = null; }
}; }
// ---------- tick de la v3.3 ----------
const V33_TICKS = [syncSuppressTick, () => { const b = $('#bEmo'); if (b && !b.dataset.ic && ICON.keys.emote !== undefined) { b.innerHTML = iconHTML(['emote'], 24); b.dataset.ic = 1; } }];
function v33Tick(dt) { for (const f of V33_TICKS) f(dt); }
