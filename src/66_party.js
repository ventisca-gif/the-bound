// ================= PARTY (co-op), EMOTES & LOCAL WIFI PLAY (WebRTC) =================
// The party layer rides on the same presence object the online room already uses, so it works the same
// over the artifact room (online) and over direct WebRTC links (APK / standalone file on the same WiFi).
NET.myId = Math.random().toString(36).slice(2, 10);
const PARTY = { id: '', inv: null, invT: 0, kq: [], kseq: 0, bd: null, bdEnt: null, bdF: 0, pending: null, declined: {} };
const PARTY_MAX = 6, PARTY_R = 640;
function netOnline() { return !!NET.room || rtcOpen(); }
function partyMembers() { if (!PARTY.id) return []; const o = []; for (const r of G.remote.values()) if (r.pt === PARTY.id) o.push(r); return o; }
function partyNear() { const P = G.P; return partyMembers().filter(r => r.map === P.map && dist(r.x, r.y, P.x, P.y) < PARTY_R && !r.dead); }
// ---------- presence fields ----------
function partyPresence(o) {
  const P = G.P; o.id = NET.myId;
  if (PARTY.id) { o.pt = PARTY.id; o.hp = Math.max(0, Math.round(P.hp / P.S.maxhp * 100)); if (PARTY.kq.length) o.kq = PARTY.kq; if (PARTY.bd) o.bd = PARTY.bd; if (PARTY.pc && PARTY.pc.length) o.pc = PARTY.pc; }
  if (PARTY.inv && G.t - PARTY.invT < 30) o.iv = PARTY.inv; else PARTY.inv = null;
  if (PARTY.id) { syncPresence(o); syncPresenceMember(o); }
}
function partyRecv(r, pr) {
  const P = G.P; if (!P) return;
  r.id = cleanStr(pr.id, 12); r.pt = cleanStr(pr.pt, 12); r.hpP = clamp(+pr.hp || 0, 0, 100); r.dead = pr.s === 'dead'; r.seen = G.t;
  // incoming invite
  const iv = pr.iv; if (iv && typeof iv === 'object' && iv.to === NET.myId && typeof iv.pt === 'string' && iv.pt && iv.pt !== PARTY.id && !(PARTY.declined[iv.pt] > G.t) && (!PARTY.pending || PARTY.pending.pt !== iv.pt)) {
    PARTY.pending = { pt: cleanStr(iv.pt, 12), from: r.name }; showInvite();
  }
  if (PARTY.inv && PARTY.inv.to === r.id && r.pt === PARTY.id) { PARTY.inv = null; toast(r.name + ' se unió al grupo', 'quest'); sfx('quest'); uiParty(); }
  if (!PARTY.id || r.pt !== PARTY.id) { r.kseen = undefined; r.bdl = null; return; }
  syncLeaderRecv(r, pr); syncMemberRecv(r, pr);
  // shared kills (each entry: [seq, mobId, lv, elite, x, y])
  if (!Array.isArray(pr.kq) && r.kseen === undefined) r.kseen = 0;
  if (Array.isArray(pr.kq)) {
    let mx = r.kseen || 0; const first = r.kseen === undefined;
    for (const k of pr.kq.slice(-8)) { if (!Array.isArray(k)) continue; const s = +k[0]; if (!(s > (r.kseen || 0))) continue; mx = Math.max(mx, s);
      if (!first && MOBS[k[1]] && r.map === P.map && dist(+k[4] || 0, +k[5] || 0, P.x, P.y) < PARTY_R && !P.dead) partyXp(k[1], clamp(+k[2] || 1, 1, MAXLV) | 0, !!k[3], +k[4], +k[5], !!(PARTY.gh && PARTY.gh[k[6]])); }
    r.kseen = mx;
  }
  // co-op boss damage: {b: bossId, f: fight, t: cumulative damage}
  const bd = pr.bd; if (bd && typeof bd === 'object' && BOSSES[bd.b] && isFinite(+bd.t)) {
    const prev = r.bdl && r.bdl.b === bd.b && r.bdl.f === bd.f ? r.bdl.t : 0, delta = (+bd.t) - prev; r.bdl = { b: bd.b, f: bd.f, t: +bd.t };
    if (delta > 0 && r.map === P.map) { const m = G.ents.find(e => e.type === 'mob' && e.boss && e.mid === bd.b && !e.dying); if (m && dist(m.x, m.y, P.x, P.y) < 900) { const d = Math.min(delta, m.maxhp * 0.25) | 0; m.hp -= d; m.flash = 0.1; floatText(m.x + 10, m.y - (m.hgt || 30) - 8, d, '#7ae0ff'); if (m.state === 'idle' || m.state === 'return') m.state = 'chase'; if (m.hp <= 0) killMob(m); } }
  }
}
function partyXp(mid, lv, elite, x, y, full) {
  const P = G.P, def = MOBS[mid], st = mobStats(def, lv, false), lvDiff = lv - P.lv;
  if (full) for (const [id, ch, n] of (def.drops || [])) if (Math.random() < ch * dropEventMul()) { giveItem(id, n ? Math.floor(1 + Math.random() * n) : 1, true); lootFx(x, y, id); }
  let xp = st.xp * (elite ? 4 : 1) * (full ? 1 : 0.5) * (lvDiff < -8 ? 0.3 : lvDiff < -4 ? 0.7 : lvDiff > 3 ? 1.25 : 1); if (lvDiff > 10) xp = Math.min(xp, xpToNext(P.lv) * 0.04); xp = Math.max(1, Math.round(xp));
  gainXp(xp); P.gold += Math.round(st.gold * 0.3); floatText(x, y - 44, '+' + xp + ' XP grupo', '#7ae0ff');
  P.best[mid] = (P.best[mid] || 0) + 1; questEvent('kill', { m: mid, fam: def.fam, lv }); uiDirty.hud = true;
}
// called from killMob (own kills): broadcast + group bonus
function partyOnKill(m, xp) {
  if (!PARTY.id || m.boss) return; PARTY.kq.push([++PARTY.kseq, m.mid, m.lv, m.elite ? 1 : 0, Math.round(m.x), Math.round(m.y), m.nid || 0]); if (PARTY.kq.length > 6) PARTY.kq.shift();
  const n = partyNear().length; if (n) { const b = Math.max(1, Math.round(xp * 0.1 * n)); gainXp(b); }
}
// called from hitMob on bosses
function partyOnBossHit(m, d) {
  if (!PARTY.id) return; if (!PARTY.bd || PARTY.bdEnt !== m) { PARTY.bdEnt = m; PARTY.bd = { b: m.mid, f: ++PARTY.bdF, t: 0 }; } PARTY.bd.t += d;
}
// ---------- actions ----------
function partyInvite(r) {
  if (!r || !r.id) return; if (partyMembers().length >= PARTY_MAX - 1) { toast('El grupo está lleno (máx. ' + PARTY_MAX + ')', 'warn'); return; }
  if (!PARTY.id) PARTY.id = NET.myId; PARTY.inv = { to: r.id, pt: PARTY.id }; PARTY.invT = G.t; toast('Invitación enviada a ' + r.name, 'info'); netPresence(true);
}
function partyLeave() { PARTY.id = ''; PARTY.kq = []; PARTY.bd = null; PARTY.inv = null; toast('Has salido del grupo', 'info'); netPresence(true); uiParty(); }
function showInvite() {
  const box = $('#invbox'); if (!box || !PARTY.pending) return; box.hidden = false;
  box.innerHTML = `<b>${esc(PARTY.pending.from)}</b> te invita a su grupo<div class="row"><button class="btn gold" id="invOk">Unirme</button><button class="btn" id="invNo">No</button></div>`; sfx('quest');
  $('#invOk').onclick = () => { if (!PARTY.pending) return; PARTY.id = PARTY.pending.pt; PARTY.kq = []; PARTY.bd = null; PARTY.pending = null; box.hidden = true; toast('¡Te uniste al grupo! Compartís experiencia y misiones de caza', 'quest'); netPresence(true); uiParty(); };
  $('#invNo').onclick = () => { if (PARTY.pending) PARTY.declined[PARTY.pending.pt] = G.t + 60; PARTY.pending = null; box.hidden = true; };
  clearTimeout(showInvite.t); showInvite.t = setTimeout(() => { box.hidden = true; PARTY.pending = null; }, 25000);
}
// ---------- party HUD ----------
let partyHudT = 0;
function uiParty() {
  const el = $('#party'); if (!el) return; const mem = partyMembers();
  if (!PARTY.id || !mem.length) { el.hidden = true; return; } el.hidden = false; const P = G.P;
  el.innerHTML = mem.map(r => { const far = r.map !== P.map || dist(r.x, r.y, P.x, P.y) > PARTY_R; return `<div class="pm ${far ? 'far' : ''}"><span class="pn">${esc(r.name)} <small>Nv.${r.lv}</small></span><div class="pb"><i style="width:${r.dead ? 0 : r.hpP}%"></i></div></div>`; }).join('');
}
function partyTick(dt) {
  partyHudT += dt; if (partyHudT > 0.5) { partyHudT = 0; uiParty(); }
  for (const [k, r] of G.remote) if (r.rtc && G.t - (r.seen || 0) > 10) { G.remote.delete(k); uiOnline(); }
}
// ---------- emotes ----------
const EMOTES = [['wave', 'Saludar', 2.4], ['cheer', 'Celebrar', 2.4], ['dance', 'Bailar', 30], ['sit', 'Sentarse', 9999]];
function doEmote(k) { const P = G.P; if (!P || P.dead || P.job || P.fishing) return; const e = EMOTES.find(x => x[0] === k); if (!e) return; P.emote = k; P.emoteT = e[2]; setAnim(P, k); P.loopAnim = k !== 'sit'; netPresence(true); }
// ---------- group / online panel ----------
let rtcUI = { mode: null, code: '', msg: '' };
function openParty() {
  const P = G.P, mem = partyMembers(), others = [...G.remote.values()].filter(r => r.id && !(PARTY.id && r.pt === PARTY.id));
  const memRows = mem.map(r => `<div class="srow"><div class="sn"><b>${esc(r.name)}</b><small>${esc(CLASSES[r.cls].n)} · Nv.${r.lv} · ${r.map === P.map ? Math.round(dist(r.x, r.y, P.x, P.y) / 16) + ' m' : 'en otra zona'}</small></div></div>`).join('');
  const othRows = others.map(r => `<div class="srow"><div class="sn"><b>${esc(r.name)}</b><small>${esc(CLASSES[r.cls].n)} · Nv.${r.lv}${r.pt ? ' · en un grupo' : ''}</small></div><button class="btn sm" data-inv="${esc(r.peer)}" ${mem.length >= PARTY_MAX - 1 ? 'disabled' : ''}>Invitar</button></div>`).join('');
  const emo = EMOTES.map(e => `<button class="btn sm" data-emo="${e[0]}">${e[1]}</button>`).join('');
  let local = '';
  if (rtcSupported()) {
    const st = RTC.links.filter(l => l.open).length;
    local = `<h3>Jugar en la misma WiFi</h3><p class="hint">Conecta hasta 4 teléfonos sin servidor: uno crea la sala y le pasa el código a sus amigos (por WhatsApp, Telegram, etc.). Cada amigo devuelve su código de respuesta. ${st ? `<b class="ok">${st} conectado${st > 1 && !LANG_EN ? 's' : ''}</b>` : ''}</p>`;
    if (rtcUI.mode === 'host') local += `<label>1 · Envía este código a tu amigo</label><textarea id="rtcOut" readonly rows="3">${esc(rtcUI.code || 'Generando…')}</textarea><div class="row"><button class="btn sm" id="rtcCopy" ${rtcUI.code ? '' : 'disabled'}>Copiar código</button></div><label>2 · Pega aquí su código de respuesta</label><textarea id="rtcIn" rows="3" placeholder="TB…"></textarea><div class="row"><button class="btn gold sm" id="rtcGo">Conectar</button><button class="btn sm" id="rtcCancel">Cancelar</button></div>`;
    else if (rtcUI.mode === 'join') local += rtcUI.code ? `<label>2 · Envía este código de respuesta al anfitrión</label><textarea id="rtcOut" readonly rows="3">${esc(rtcUI.code)}</textarea><div class="row"><button class="btn sm" id="rtcCopy">Copiar código</button><button class="btn sm" id="rtcCancel">Cerrar</button></div><p class="hint">Cuando el anfitrión lo pegue, os conectaréis automáticamente.</p>` : `<label>1 · Pega el código de sala del anfitrión</label><textarea id="rtcIn" rows="3" placeholder="TB…"></textarea><div class="row"><button class="btn gold sm" id="rtcGo">Generar respuesta</button><button class="btn sm" id="rtcCancel">Cancelar</button></div>`;
    else local += `<div class="row"><button class="btn gold sm" id="rtcHost" ${RTC.role === 'guest' ? 'disabled' : ''}>${RTC.role === 'host' ? 'Añadir otro amigo' : 'Crear sala'}</button><button class="btn sm" id="rtcJoin" ${RTC.role ? 'disabled' : ''}>Unirme a una sala</button>${RTC.role ? '<button class="btn sm" id="rtcEnd">Desconectar</button>' : ''}</div>`;
    if (rtcUI.msg) local += `<p class="hint warnt">${esc(rtcUI.msg)}</p>`;
  }
  const online = NET.room ? `<h3>Jugadores en línea</h3>${othRows || '<p class="hint">No hay más jugadores ahora mismo. Comparte el enlace del juego para jugar juntos.</p>'}` : (rtcSupported() ? (othRows ? `<h3>Jugadores conectados</h3>${othRows}` : '') : '<p class="hint">El modo online se activa al abrir el juego desde su enlace en Claude.</p>');
  openModal(`<h2>Grupo</h2><p class="hint">En grupo compartís la experiencia de cada enemigo derrotado cerca (50 %), contáis las misiones de caza juntos, ganáis +10 % de experiencia por compañero y el daño a los jefes se suma entre todos.</p>
    ${PARTY.id ? `<h3>Tu grupo (${mem.length + 1}/${PARTY_MAX})</h3><div class="srow"><div class="sn"><b>${esc(P.name)} (tú)</b><small>${esc(CLASSES[P.cls].n)} · Nv.${P.lv}</small></div></div>${memRows}<div class="row"><button class="btn sm" id="pLeave">Salir del grupo</button></div>` : ''}
    ${online}${local}<h3>Duelos PvP</h3><p class="hint">Si los dos activáis el PvP podéis pelear entre vosotros. Si alguien cae, un amigo puede reanimarlo acercándose y pulsando acción.</p><div class="row"><button class="btn sm ${PVP.on ? 'gold' : ''}" id="pPvp">${PVP.on ? 'PvP activado ✓' : 'Activar PvP'}</button></div><h3>Gestos</h3><div class="row wrap">${emo}${(P.dances || []).filter(k => k !== 'clasico').map(k => `<button class="btn sm" data-dz2="${k}">${esc(DANCES[k].n)}</button>`).join('')}</div><div class="row"><button class="btn" id="mclose">Cerrar</button></div>`, 'party');
  { const b = $('#pPvp'); if (b) b.onclick = () => { PVP.on = !PVP.on; netPresence(true); toast(PVP.on ? 'PvP activado' : 'PvP desactivado', 'info'); openParty(); }; }
  $$('[data-inv]').forEach(b => b.onclick = () => { partyInvite(G.remote.get(b.dataset.inv)); openParty(); });
  $$('[data-emo]').forEach(b => b.onclick = () => { closeModal(); if (b.dataset.emo === 'dance') G.P.dk = null; doEmote(b.dataset.emo); });
  $$('[data-dz2]').forEach(b => b.onclick = () => { closeModal(); doDance(b.dataset.dz2); });
  const on = (id, f) => { const e = $(id); if (e) e.onclick = f; };
  on('#pLeave', () => { partyLeave(); openParty(); }); on('#mclose', closeModal);
  on('#rtcHost', () => { rtcUI = { mode: 'host', code: '', msg: '' }; openParty(); rtcHostStart(); });
  on('#rtcJoin', () => { rtcUI = { mode: 'join', code: '', msg: '' }; openParty(); });
  on('#rtcCancel', () => { if (rtcUI.mode === 'host' && RTC.pendingLink && !RTC.pendingLink.open) { try { RTC.pendingLink.pc.close(); } catch (e) { } RTC.links = RTC.links.filter(l => l !== RTC.pendingLink); RTC.pendingLink = null; if (!RTC.links.length) RTC.role = null; } rtcUI = { mode: null, code: '', msg: '' }; openParty(); });
  on('#rtcEnd', () => { rtcEnd(); rtcUI = { mode: null, code: '', msg: 'Desconectado' }; openParty(); });
  on('#rtcCopy', () => copyCode());
  on('#rtcGo', () => { const v = ($('#rtcIn') || {}).value || ''; if (rtcUI.mode === 'host') rtcHostAccept(v); else rtcJoin(v); });
}
function copyCode() {
  const ta = $('#rtcOut'); if (!ta) return; ta.focus(); ta.select(); let ok = false;
  try { ok = document.execCommand('copy'); } catch (e) { }
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(() => toast('Código copiado', 'info'), () => { if (!ok) toast('Mantén pulsado el código para copiarlo', 'warn'); });
  else toast(ok ? 'Código copiado' : 'Mantén pulsado el código para copiarlo', ok ? 'info' : 'warn');
}
// ---------- WebRTC transport (no server: manual code exchange) ----------
const RTC = { role: null, links: [], pendingLink: null };
function rtcSupported() { return typeof RTCPeerConnection === 'function' && !(window.claude && typeof window.claude.use === 'function'); }
function rtcOpen() { return RTC.links.some(l => l.open); }
const ICE = { iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }] };
function b64u(u8) { let s = ''; for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function unb64u(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; const r = atob(s), u = new Uint8Array(r.length); for (let i = 0; i < r.length; i++) u[i] = r.charCodeAt(i); return u; }
function slimSdp(sdp) { return sdp.split(/\r?\n/).filter(l => l && !/^a=(extmap|msid-semantic|ice-options)/.test(l)).join('\n'); }
async function packCode(o) {
  const s = JSON.stringify(o);
  if (typeof CompressionStream === 'function') { try { const st = new Blob([s]).stream().pipeThrough(new CompressionStream('deflate-raw')); return 'TB1' + b64u(new Uint8Array(await new Response(st).arrayBuffer())); } catch (e) { } }
  return 'TB0' + b64u(new TextEncoder().encode(s));
}
async function unpackCode(c) {
  c = String(c || '').replace(/\s+/g, ''); const body = unb64u(c.slice(3));
  if (c.startsWith('TB1')) { const st = new Blob([body]).stream().pipeThrough(new DecompressionStream('deflate-raw')); return JSON.parse(await new Response(st).text()); }
  if (c.startsWith('TB0')) return JSON.parse(new TextDecoder().decode(body));
  throw new Error('bad');
}
function iceDone(pc, ms) { return new Promise(res => { if (pc.iceGatheringState === 'complete') return res(); const t = setTimeout(res, ms); pc.addEventListener('icegatheringstatechange', () => { if (pc.iceGatheringState === 'complete') { clearTimeout(t); res(); } }); }); }
function newLink() {
  const pc = new RTCPeerConnection(ICE), L = { pc, dc: null, open: false, ids: new Set() };
  pc.onconnectionstatechange = () => { if (pc.connectionState === 'failed' || pc.connectionState === 'closed') linkClosed(L); };
  return L;
}
function bindDc(L, dc) {
  L.dc = dc;
  dc.onopen = () => { L.open = true; if (RTC.pendingLink === L) RTC.pendingLink = null; toast('¡Conectado! Ya estáis jugando juntos', 'quest'); sfx('quest');
    if (RTC.role === 'host' && !PARTY.id) PARTY.id = NET.myId; rtcUI = { mode: null, code: '', msg: '' }; if (!$('#modal').hidden && $('#modal').classList.contains('party')) openParty(); lastPres = ''; netPresence(true); uiOnline(); };
  dc.onclose = () => linkClosed(L);
  dc.onmessage = ev => { let m; try { m = JSON.parse(ev.data); } catch (e) { return; } if (!m || typeof m !== 'object') return;
    if (m.t === 'p' && m.p && typeof m.p === 'object') { const id = cleanStr(m.p.id, 12); if (!id || id === NET.myId) return; L.ids.add(id);
      // guests follow the host's party automatically
      if (RTC.role === 'guest' && m.h && typeof m.p.pt === 'string' && m.p.pt && PARTY.id !== m.p.pt) { PARTY.id = cleanStr(m.p.pt, 12); PARTY.kq = []; PARTY.bd = null; uiParty(); }
      const key = 'rtc:' + id, had = G.remote.has(key); upsertRemote({ peer: key, presence: m.p }); const r = G.remote.get(key); if (r) { r.rtc = 1; r.seen = G.t; } if (!had) uiOnline();
      if (RTC.role === 'host') for (const o of RTC.links) if (o !== L && o.open) try { o.dc.send(ev.data); } catch (e) { } } };
}
function linkClosed(L) {
  if (L.closed) return; L.closed = true; L.open = false; RTC.links = RTC.links.filter(l => l !== L);
  for (const id of L.ids) G.remote.delete('rtc:' + id); if (RTC.role === 'guest') for (const k of [...G.remote.keys()]) if (k.startsWith('rtc:')) G.remote.delete(k);
  if (!RTC.links.length) RTC.role = null; toast('Un jugador se ha desconectado', 'warn'); uiOnline(); uiParty();
}
async function rtcHostStart() {
  try {
    RTC.role = 'host'; const L = newLink(); RTC.links.push(L); RTC.pendingLink = L; bindDc(L, L.pc.createDataChannel('tb', { ordered: true }));
    await L.pc.setLocalDescription(await L.pc.createOffer()); await iceDone(L.pc, 3500);
    rtcUI.code = await packCode({ v: 1, s: slimSdp(L.pc.localDescription.sdp) }); if (rtcUI.mode === 'host') openParty();
  } catch (e) { rtcUI = { mode: null, code: '', msg: 'No se pudo crear la sala en este dispositivo.' }; openParty(); }
}
async function rtcHostAccept(code) {
  const L = RTC.pendingLink; if (!L) return;
  try { const o = await unpackCode(code); if (!o || !o.a) throw 0; await L.pc.setRemoteDescription({ type: 'answer', sdp: o.a + '\n' }); rtcUI.msg = 'Conectando…'; openParty(); setTimeout(() => { if (!L.open && !L.closed) { rtcUI.msg = 'No se pudo conectar. Comprobad que estáis en la misma WiFi y volved a intentarlo.'; if (!$('#modal').hidden) openParty(); } }, 12000); }
  catch (e) { rtcUI.msg = 'Código no válido. Pega el código de respuesta completo (empieza por TB).'; openParty(); }
}
async function rtcJoin(code) {
  try {
    const o = await unpackCode(code); if (!o || !o.s) throw 0; RTC.role = 'guest'; const L = newLink(); RTC.links = [L]; RTC.pendingLink = L;
    L.pc.ondatachannel = ev => bindDc(L, ev.channel);
    await L.pc.setRemoteDescription({ type: 'offer', sdp: o.s + '\n' }); await L.pc.setLocalDescription(await L.pc.createAnswer()); await iceDone(L.pc, 3500);
    rtcUI.code = await packCode({ v: 1, a: slimSdp(L.pc.localDescription.sdp) }); rtcUI.msg = ''; openParty();
  } catch (e) { RTC.role = null; RTC.links = []; rtcUI.msg = 'Código de sala no válido. Pega el código completo (empieza por TB).'; openParty(); }
}
function rtcEnd() { for (const L of RTC.links.slice()) { try { L.pc.close(); } catch (e) { } linkClosed(L); } RTC.links = []; RTC.role = null; RTC.pendingLink = null; }
let rtcKeep = 0;
function rtcSend(o) { if (!RTC.links.length) return; const s = JSON.stringify({ t: 'p', p: o, h: RTC.role === 'host' ? 1 : 0 }); for (const L of RTC.links) if (L.open) try { L.dc.send(s); } catch (e) { } }
