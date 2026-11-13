// ================= ONLINE POR INTERNET (Photon Realtime) =================
// Transporte alternativo al WiFi local: misma "presencia" que usa todo el multijugador (grupo, bodas, mina, PvP, trenes…),
// pero viajando por los servidores de Photon. Salas privadas con código y mundos públicos.
// Solo existe en la APK / navegador normal: el artefacto de claude.ai bloquea servidores externos y usa su propio online.
const PHN_APPID = '684c5254-9cf5-496e-bb22-d0d370a0822d', PHN_VER = 'tb-net1';
const PHN_WORLDS = 5, PHN_WORLD_MAX = 20, PHN_PRIV_MAX = 16, PHN_RATE = 0.2;
const PHN_REGIONS = [['sa', 'Sudamérica'], ['us', 'EE. UU. Este'], ['usw', 'EE. UU. Oeste'], ['eu', 'Europa'], ['asia', 'Asia']];
const PHN_ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const PHN = {
  c: null, st: 'off', region: 'sa', room: null, priv: false, code: '', msg: '', busy: '', rooms: {}, grp: 0,
  out: null, lastSend: -9, lastAll: -9, want: null, joinMode: false, lost: null, retry: 0, tmo: 0, manualOff: false
};
{ const r = storage.get('thebound.phnRegion'); if (PHN_REGIONS.some(x => x[0] === r)) PHN.region = r; }

function phnAvailable() { return typeof Photon !== 'undefined' && !!(Photon.LoadBalancing && Photon.LoadBalancing.LoadBalancingClient) && rtcSupported(); }
function phnIn() { return !!(PHN.c && PHN.room && PHN.st === 'room'); }
function phnState() { try { return PHN.c ? PHN.c.state() : -99; } catch (e) { return -99; } }
function phnWorldName(i) { return 'mundo_' + i; }
function phnRoomLabel(n) { if (!n) return ''; if (n.startsWith('p_')) return 'Sala privada ' + n.slice(2); const m = /^mundo_(\d+)$/.exec(n); return m ? 'Mundo ' + m[1] : n; }
function phnGroupFor(map) { let h = 7; const s = String(map || 'world'); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return 1 + (h % 250); }
function phnRefresh() { const m = $('#modal'); if (m && !m.hidden && m.classList.contains('party')) openParty(); uiOnline(); }
function phnMsg(t) { PHN.msg = t; PHN.busy = ''; phnRefresh(); }

// ---------- conexión ----------
function phnConnect(then) {
  const LBC = Photon.LoadBalancing.LoadBalancingClient, S = LBC.State;
  if (PHN.c && phnState() === S.JoinedLobby) { then && then(); return; }
  PHN.want = then || null;
  if (PHN.c && phnState() > 0 && phnState() < S.JoinedLobby) return; // ya conectando
  if (PHN.c && phnState() > S.JoinedLobby && phnState() !== S.Disconnected) { PHN.want = null; then && setTimeout(() => phnConnect(then), 400); return; } // saliendo de una sala
  if (PHN.c) { try { PHN.c.disconnect(); } catch (e) { } }
  let c;
  try { c = new LBC(Photon.ConnectionProtocol.Wss, PHN_APPID, PHN_VER); } catch (e) { phnMsg('Este dispositivo no puede usar el modo online.'); return; }
  PHN.c = c; PHN.st = 'connecting'; PHN.manualOff = false; PHN.busy = 'Conectando con el servidor…'; PHN.msg = '';
  try { if (c.setLogLevel) c.setLogLevel(Photon.LogLevel.ERROR); } catch (e) { }
  c.onStateChange = st => {
    if (PHN.c !== c) return;
    if (st === S.JoinedLobby) {
      clearTimeout(PHN.tmo);
      if (PHN.room) phnLeftRoom();
      PHN.st = 'lobby'; PHN.busy = ''; PHN.retry = 0;
      const w = PHN.want; PHN.want = null; if (w) w(); else if (PHN.lost) phnRejoin(); else phnRefresh();
    } else if (st === S.Joined) {
      PHN.st = 'room';
    } else if (st === S.Disconnected || st === S.Error) {
      clearTimeout(PHN.tmo);
      const wasRoom = PHN.room, wasPriv = PHN.priv, never = PHN.st === 'connecting';
      if (PHN.room) phnLeftRoom();
      PHN.c = null; PHN.st = 'off'; PHN.busy = '';
      if (!PHN.manualOff && wasRoom && PHN.retry < 3) { PHN.lost = { room: wasRoom, priv: wasPriv }; PHN.retry++; toast('Conexión perdida. Reconectando…', 'warn'); setTimeout(() => { if (!PHN.c && PHN.lost) phnConnect(); }, 2500 * PHN.retry); }
      else if (!PHN.manualOff) { PHN.want = null; PHN.msg = never ? 'No se pudo conectar con el servidor. Revisa tu conexión a internet e inténtalo otra vez.' : (PHN.msg || 'Desconectado del servidor.'); }
      phnRefresh();
    }
  };
  c.onError = (code, msg) => {
    if (PHN.c !== c) return;
    PHN.msg = /32757|MaxCcu/i.test(String(code) + msg) ? 'El servidor está lleno: el plan gratis permite 20 jugadores conectados a la vez.' : 'No se pudo conectar con el servidor. Revisa tu conexión a internet.';
    PHN.busy = ''; phnRefresh();
  };
  c.onOperationResponse = (err, msg, code) => {
    if (PHN.c !== c || !err) return;
    if (err === 32757) { phnMsg('El servidor está lleno: el plan gratis permite 20 jugadores conectados a la vez.'); return; }
    if (code === 225 || code === 226 || code === 227) {
      if (err === 32758) { PHN.lost = null; phnMsg('Esa sala no existe o ya se cerró. Revisa el código.'); }
      else if (err === 32765) { PHN.lost = null; phnMsg('La sala está llena.'); }
      else if (err === 32766 && PHN.busy && PHN.pendingCreate) phnCreatePrivate(); // código repetido: probar otro
      else phnMsg('No se pudo entrar en la sala (' + err + ').');
    }
  };
  c.onRoomList = () => phnRooms();
  c.onRoomListUpdate = () => phnRooms();
  c.onJoinRoom = () => phnJoined();
  c.onActorJoin = a => { if (PHN.c === c && PHN.room && a && !a.isLocal && a.actorNr !== (c.myActor() || {}).actorNr) { PHN.out = PHN.out || {}; lastPres = ''; netPresence(true); } };
  c.onActorLeave = a => { if (a) G.remote.delete('phn:' + a.actorNr); uiOnline(); phnRefresh(); };
  c.onEvent = (code, content, actorNr) => phnRecv(code, content, actorNr);
  PHN.tmo = setTimeout(() => { if (PHN.c === c && PHN.st === 'connecting') { try { c.disconnect(); } catch (e) { } PHN.c = null; PHN.st = 'off'; PHN.want = null; phnMsg('No se pudo conectar. Revisa tu conexión a internet e inténtalo otra vez.'); } }, 15000);
  try { c.connectToRegionMaster(PHN.region); } catch (e) { PHN.c = null; PHN.st = 'off'; phnMsg('No se pudo conectar con el servidor.'); }
  phnRefresh();
}
function phnOff() { PHN.manualOff = true; PHN.lost = null; PHN.want = null; const c = PHN.c; if (PHN.room) phnLeftRoom(); PHN.c = null; PHN.st = 'off'; PHN.busy = ''; if (c) try { c.disconnect(); } catch (e) { } phnRefresh(); }
function phnRooms() {
  if (!PHN.c) return; const o = {};
  try { for (const r of PHN.c.availableRooms() || []) if (r && r.name) o[r.name] = { n: r.playerCount | 0, max: r.maxPlayers | 0 }; } catch (e) { }
  PHN.rooms = o; phnRefresh();
}

// ---------- salas ----------
function phnPrep() { if (typeof rtcEnd === 'function' && RTC.links.length) rtcEnd(); if (PHN.room && PHN.c) { try { PHN.c.leaveRoom(); } catch (e) { } phnLeftRoom(); } }
function phnCreatePrivate() {
  phnConnect(() => {
    let code = ''; for (let i = 0; i < 6; i++) code += PHN_ALPHA[Math.floor(Math.random() * PHN_ALPHA.length)];
    PHN.busy = 'Creando sala…'; PHN.msg = ''; PHN.pendingCreate = true; phnRefresh();
    try { PHN.c.createRoom('p_' + code, { isVisible: false, isOpen: true, maxPlayers: PHN_PRIV_MAX }); } catch (e) { phnMsg('No se pudo crear la sala.'); }
  });
}
function phnJoinCode(raw) {
  const code = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  if (code.length !== 6) { phnMsg('El código de sala tiene 6 letras o números.'); return; }
  phnConnect(() => { PHN.busy = 'Entrando en la sala ' + code + '…'; PHN.msg = ''; PHN.pendingCreate = false; phnRefresh(); try { PHN.c.joinRoom('p_' + code); } catch (e) { phnMsg('No se pudo entrar en la sala.'); } });
}
function phnJoinWorld(i) {
  i = clamp(i | 0, 1, PHN_WORLDS);
  phnConnect(() => { PHN.busy = 'Entrando en el Mundo ' + i + '…'; PHN.msg = ''; PHN.pendingCreate = false; phnRefresh(); try { PHN.c.joinRoom(phnWorldName(i), { createIfNotExists: true }, { isVisible: true, isOpen: true, maxPlayers: PHN_WORLD_MAX }); } catch (e) { phnMsg('No se pudo entrar en el mundo.'); } });
}
function phnRejoin() {
  const L = PHN.lost; PHN.lost = null; if (!L || !PHN.c) return;
  if (L.priv) { PHN.busy = 'Volviendo a la sala…'; try { PHN.c.joinRoom(L.room); } catch (e) { } }
  else { const m = /^mundo_(\d+)$/.exec(L.room); if (m) phnJoinWorld(+m[1]); }
  phnRefresh();
}
function phnJoined() {
  const c = PHN.c; if (!c) return; const room = c.myRoom(); if (!room || !room.name) return;
  if (RTC.links.length) rtcEnd();
  PHN.room = room.name; PHN.priv = room.name.startsWith('p_'); PHN.code = PHN.priv ? room.name.slice(2) : ''; PHN.st = 'room'; PHN.busy = ''; PHN.msg = ''; PHN.pendingCreate = false; PHN.lost = null; PHN.retry = 0;
  PHN.grp = 0; phnGroups(true); PHN.lastAll = -9; PHN.lastSend = -9;
  // en sala privada el que la crea es el líder del grupo, igual que en WiFi
  if (PHN.priv && c.myRoomMasterActorNr() === (c.myActor() || {}).actorNr && !PARTY.id) { PARTY.id = NET.myId; uiParty(); }
  toast(PHN.priv ? `Sala ${PHN.code} lista. Pásale el código a tus amigos` : `Has entrado en el ${phnRoomLabel(PHN.room)}`, 'quest'); sfx('quest');
  lastPres = ''; netPresence(true); phnRefresh();
}
function phnLeftRoom() {
  if (PHN.priv && PARTY.id && typeof partyLeave === 'function') { try { partyLeave(); } catch (e) { } } // el grupo automático de la sala privada se deshace al salir
  for (const k of [...G.remote.keys()]) if (k.startsWith('phn:')) G.remote.delete(k);
  PHN.room = null; PHN.priv = false; PHN.code = ''; PHN.grp = 0; PHN.out = null; if (PHN.st === 'room') PHN.st = 'lobby'; uiOnline();
}
function phnLeave() { PHN.lost = null; if (PHN.c && PHN.room) { try { PHN.c.leaveRoom(); } catch (e) { } } phnLeftRoom(); phnRefresh(); }
// Mundos públicos: cada zona del mapa es un "grupo de interés", así solo recibes a quien está en tu zona (aguanta salas grandes)
function phnGroups(force) {
  if (!phnIn() || PHN.priv) return; const g = phnGroupFor(G.P && G.P.map);
  if (!force && g === PHN.grp) return;
  try { PHN.c.changeGroups(PHN.grp ? [PHN.grp] : null, [g]); } catch (e) { } PHN.grp = g; PHN.lastAll = -9;
}

// ---------- envío / recepción ----------
function phnSend(o) { if (phnIn()) PHN.out = o; }
function phnFlush() {
  if (!phnIn() || !PHN.out || G.t - PHN.lastSend < PHN_RATE) return;
  let s; try { s = JSON.stringify(PHN.out); } catch (e) { PHN.out = null; return; } PHN.out = null; PHN.lastSend = G.t;
  try {
    if (PHN.priv || G.t - PHN.lastAll > 2) { PHN.lastAll = G.t; PHN.c.raiseEvent(1, s); }
    else PHN.c.raiseEvent(1, s, { interestGroup: PHN.grp });
  } catch (e) { }
}
function phnRecv(code, content, actorNr) {
  if (code !== 1 || !phnIn() || typeof content !== 'string' || content.length > 12000) return;
  let p; try { p = JSON.parse(content); } catch (e) { return; } if (!p || typeof p !== 'object' || Array.isArray(p)) return;
  const id = cleanStr(p.id, 12); if (!id || id === NET.myId) return; const an = actorNr | 0; if (an <= 0) return;
  // en sala privada se entra solo en el grupo del anfitrión (si cabe), como en WiFi
  if (PHN.priv && !PARTY.id && typeof p.pt === 'string' && p.pt && an === PHN.c.myRoomMasterActorNr()) {
    const n = [...G.remote.values()].filter(r => r.pt === p.pt).length; if (n + 1 < PARTY_MAX) { PARTY.id = cleanStr(p.pt, 12); PARTY.kq = []; PARTY.bd = null; uiParty(); }
  }
  const key = 'phn:' + an, had = G.remote.has(key); upsertRemote({ peer: key, presence: p }); const r = G.remote.get(key);
  if (r) { r.phn = 1; r.seen = G.t; } if (!had) { uiOnline(); if (r) toast(`${r.name} se ha conectado`, 'info'); }
}
function phnTick(dt) {
  if (!PHN.c) return;
  if (phnIn()) {
    phnGroups(false); phnFlush();
    for (const [k, r] of G.remote) if (r.phn && G.t - (r.seen || 0) > 15) G.remote.delete(k);
  }
}

// ---------- enganches con el multijugador existente ----------
{ const _send = rtcSend; rtcSend = function (o) { _send(o); phnSend(o); }; }
{ const _on = netOnline; netOnline = function () { return _on() || phnIn(); }; }
{ const _h = rtcHostStart; rtcHostStart = function () { if (PHN.room) phnLeave(); return _h.apply(this, arguments); }; }
{ const _j = rtcJoin; rtcJoin = function (c) { if (PHN.room) phnLeave(); return _j.apply(this, arguments); }; }
{ const _t = netTick; netTick = function (dt) { _t(dt); phnTick(dt); }; }
// pestaña oculta mucho tiempo (APK en segundo plano): al volver, reconecta a la sala si se cayó
document.addEventListener('visibilitychange', () => { if (!document.hidden && !PHN.c && PHN.lost) { PHN.retry = 0; phnConnect(); } });

// ---------- panel en el menú Grupo ----------
function phnSection() {
  const S = Photon.LoadBalancing.LoadBalancingClient.State, st = phnState();
  let h = `<h3>Online por internet</h3><p class="hint">Juega con amigos de cualquier lugar, sin estar en la misma WiFi. Todo lo del modo WiFi (grupo, PvP, bodas, mina, trenes…) funciona igual. Plan gratis: hasta 20 jugadores conectados a la vez en todo el juego.</p>`;
  if (phnIn()) {
    const n = (PHN.c.myRoomActorCount ? PHN.c.myRoomActorCount() : 1) | 0, max = PHN.priv ? PHN_PRIV_MAX : PHN_WORLD_MAX;
    h += PHN.priv
      ? `<div class="phnBox"><small>Código de tu sala</small><b class="phnCode">${esc(PHN.code)}</b><small>${n}/${max} jugadores · ${esc(PHN_REGIONS.find(r => r[0] === PHN.region)[1])}</small></div><textarea id="phnOut" readonly rows="1" class="phnHid">${esc(PHN.code)}</textarea><div class="row"><button class="btn gold sm" id="phnCopy">Copiar código</button><button class="btn sm" id="phnLeave">Salir de la sala</button></div><p class="hint">Tus amigos entran en <b>Grupo → Online por internet → Unirme con código</b> y escriben el código. Tienen que elegir la misma región.</p>`
      : `<div class="phnBox"><b>${esc(phnRoomLabel(PHN.room))}</b><small>${n}/${max} jugadores · ${esc(PHN_REGIONS.find(r => r[0] === PHN.region)[1])}</small></div><div class="row"><button class="btn sm" id="phnLeave">Salir del mundo</button></div>`;
  } else {
    const conn = st === S.JoinedLobby || st === S.ConnectedToMaster;
    h += `<label>Región del servidor (todos tenéis que usar la misma)</label><select id="phnReg" ${PHN.c ? 'disabled' : ''}>${PHN_REGIONS.map(r => `<option value="${r[0]}" ${r[0] === PHN.region ? 'selected' : ''}>${r[1]}</option>`).join('')}</select>`;
    h += `<h4>Sala privada</h4><div class="row"><button class="btn gold sm" id="phnCreate" ${PHN.busy ? 'disabled' : ''}>Crear sala privada</button><button class="btn sm" id="phnJoinB" ${PHN.busy ? 'disabled' : ''}>Unirme con código</button></div>`;
    if (PHN.joinMode) h += `<div class="row"><input id="phnIn" maxlength="8" placeholder="Ej: K7P2QX" autocomplete="off" autocapitalize="characters" class="phnInput"><button class="btn gold sm" id="phnGo">Entrar</button></div>`;
    h += `<h4>Mundos públicos</h4>`;
    for (let i = 1; i <= PHN_WORLDS; i++) {
      const r = PHN.rooms[phnWorldName(i)], n = r ? r.n : 0;
      h += `<div class="srow"><div class="sn"><b>Mundo ${i}</b><small>${conn ? `${n}/${PHN_WORLD_MAX} jugadores` : 'Conéctate para ver cuánta gente hay'}</small></div><button class="btn sm" data-phnw="${i}" ${PHN.busy || n >= PHN_WORLD_MAX ? 'disabled' : ''}>${n >= PHN_WORLD_MAX ? 'Lleno' : 'Entrar'}</button></div>`;
    }
    h += `<div class="row">${PHN.c ? `<button class="btn sm" id="phnOff">Desconectar</button>` : `<button class="btn sm" id="phnLook">Ver mundos</button>`}</div>`;
  }
  if (PHN.busy) h += `<p class="hint"><b class="ok">${esc(PHN.busy)}</b></p>`;
  if (PHN.msg) h += `<p class="hint warnt">${esc(PHN.msg)}</p>`;
  return `<div id="phnSec">${h}</div>`;
}
{
  const _op = openParty;
  openParty = function () {
    _op.apply(this, arguments);
    if (!phnAvailable()) return;
    const body = $('#mbody'); if (!body) return;
    const anchor = [...body.querySelectorAll('h3')].find(e => /misma WiFi|same WiFi/.test(e.textContent)) || [...body.querySelectorAll('h3')].find(e => /Duelos|Duels/.test(e.textContent));
    const wrap = document.createElement('div'); wrap.innerHTML = phnSection();
    if (anchor) anchor.parentNode.insertBefore(wrap.firstChild, anchor); else body.appendChild(wrap.firstChild);
    const on = (id, f) => { const e = $(id); if (e) e.onclick = f; };
    const reg = $('#phnReg'); if (reg) reg.onchange = () => { PHN.region = reg.value; storage.set('thebound.phnRegion', PHN.region); };
    on('#phnCreate', () => { PHN.joinMode = false; phnPrep(); phnCreatePrivate(); });
    on('#phnJoinB', () => { PHN.joinMode = !PHN.joinMode; PHN.msg = ''; openParty(); const i = $('#phnIn'); if (i) i.focus(); });
    on('#phnGo', () => { const v = ($('#phnIn') || {}).value || ''; PHN.joinMode = false; phnPrep(); phnJoinCode(v); });
    { const i = $('#phnIn'); if (i) i.onkeydown = e => { e.stopPropagation(); if (e.key === 'Enter') { const b = $('#phnGo'); if (b) b.click(); } }; }
    on('#phnLeave', () => phnLeave());
    on('#phnOff', () => { phnOff(); PHN.msg = ''; phnRefresh(); });
    on('#phnLook', () => { PHN.msg = ''; phnConnect(); });
    on('#phnCopy', () => {
      const v = PHN.code; let ok = false; const ta = $('#phnOut');
      if (ta) { ta.classList.remove('phnHid'); ta.focus(); ta.select(); try { ok = document.execCommand('copy'); } catch (e) { } ta.classList.add('phnHid'); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(() => toast('Código copiado', 'info'), () => toast(ok ? 'Código copiado' : 'Apunta el código: ' + v, ok ? 'info' : 'warn'));
      else toast(ok ? 'Código copiado' : 'Apunta el código: ' + v, ok ? 'info' : 'warn');
    });
    $$('[data-phnw]').forEach(b => b.onclick = () => { phnPrep(); phnJoinWorld(+b.dataset.phnw); });
  };
}
