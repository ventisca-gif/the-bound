// ================= SAVE & ONLINE =================
const SAVE_KEY = 'thebound.save.v1', NSLOTS = 4;
let SLOT = 0; { const v = +storage.get('thebound.lastSlot'); if (v >= 0 && v < NSLOTS) SLOT = v; }
// accounts: each account (name + password) keeps its own 4 save slots on this device; "guest" uses the old keys
let ACC = storage.get('thebound.acc') || '';
const accId = n => String(n || '').trim().toLowerCase().replace(/\s+/g, '_').slice(0, 24);
const slotKey = i => ACC ? 'thebound.acc.' + accId(ACC) + '.s' + (i | 0) : (i ? SAVE_KEY + '.s' + i : SAVE_KEY);
{ const v = +storage.get(ACC ? 'thebound.acc.' + accId(ACC) + '.last' : 'thebound.lastSlot'); if (v >= 0 && v < NSLOTS) SLOT = v; }
const cloudDoc = i => 'data/users/' + NET.uid + '/save' + (i ? i : '');
const NET = { db: null, user: null, uid: null, room: null, connected: false, readonly: false, heroes: [], lastCloud: 0, lastHero: 0 };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej({ code: 'timeout' }), ms))]);
let dirty = false;
function markDirty(important) { dirty = true; if (important) saveGame(false); }
function saveGame(force) {
  const P = G.P; if (!P || P.ghost || G.noSave) return; const o = serializeP(P); storage.set(slotKey(SLOT), JSON.stringify(o)); storage.set(ACC ? 'thebound.acc.' + accId(ACC) + '.last' : 'thebound.lastSlot', String(SLOT)); dirty = false;
  if (force || Date.now() - NET.lastCloud > 45000) { NET.lastCloud = Date.now(); cloudSave(o); }
}
function loadLocal(i) { try { const s = storage.get(slotKey(i === undefined ? SLOT : i)); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
async function netInit() {
  if (!window.claude || typeof window.claude.use !== 'function') return;
  try { NET.user = await window.claude.use('user'); if (NET.user) NET.uid = await NET.user.id(); } catch (e) { }
  try { NET.db = await window.claude.use('db'); } catch (e) { NET.db = null; }
  if (NET.db && !NET.uid) NET.db = null;
  if (NET.db) { try { const can = NET.user ? await NET.user.can('data.write') : null; if (can === false) NET.readonly = true; } catch (e) { } subscribeHeroes(); }
}
async function cloudLoad() { if (!NET.db || !NET.uid) return null; try { const snap = await withTimeout(NET.db.doc(cloudDoc(SLOT)).get(), 7000); if (!snap.exists) return null; const d = snap.data(); return d && d.json ? JSON.parse(d.json) : null; } catch (e) { return null; } }
let cloudBusy = false, cloudPending = null;
async function cloudSave(o) {
  if (!NET.db || !NET.uid || NET.readonly) return; cloudPending = o; if (cloudBusy) return; cloudBusy = true;
  while (cloudPending) { const x = cloudPending; cloudPending = null; try { await NET.db.doc(cloudDoc(SLOT)).set({ json: JSON.stringify(x), at: Date.now() }); } catch (e) { if (e && (e.code === 'invalid_argument' || e.code === 'revoked' || e.code === 'not_granted' || e.code === 'quota_exceeded')) { NET.readonly = true; } break; } await sleep(2000); }
  cloudBusy = false;
}
async function wipeCloud() { if (!NET.db || !NET.uid || NET.readonly) return; try { await NET.db.doc(cloudDoc(SLOT)).delete(); } catch (e) { } }
// heroes hall
let heroUnsub = null;
function subscribeHeroes() { if (heroUnsub || !NET.db) return; try { heroUnsub = NET.db.collection('heroes').orderBy('lv', 'desc').limit(15).onSnapshot(s => { NET.heroes = s.docs ? s.docs.map(d => d.data()) : []; }, () => { heroUnsub = null; }); } catch (e) { } }
async function netHero() { const P = G.P; if (!NET.db || !NET.uid || NET.readonly || !P) return; if (Date.now() - NET.lastHero < 8000) return; NET.lastHero = Date.now(); try { await NET.db.doc('heroes/' + NET.uid).set({ n: P.name.slice(0, 16), c: P.cls, lv: P.lv, at: Date.now() }); } catch (e) { } }
// ---------- room presence ----------
function cleanGear(g) { const o = {}; for (const k of ['weapon', 'head', 'body', 'legs', 'feet']) { const v = g && +g[k]; o[k] = isFinite(v) ? clamp(v | 0, 0, 15) : 0; } if (!o.weapon) o.weapon = 1; if (g && typeof g.ws === 'string' && typeof WS !== 'undefined' && WS[g.ws]) o.ws = g.ws; return o; }
function cleanCos(c) { const o = {}; if (c && typeof c === 'object') for (const k of ['head', 'body', 'legs', 'feet', 'back']) { const v = c[k]; if (v === 'base' || (typeof v === 'string' && COSM[v] && COSM[v].slot === k)) o[k] = v; } return o; }
async function roomInit() {
  if (!window.claude || typeof window.claude.use !== 'function' || NET.room) return;
  let room = null; try { room = await window.claude.use('room'); } catch (e) { room = null; } if (!room) return; NET.room = room;
  room.onPeers(ch => { for (const p of ch.left) G.remote.delete(p.peer); for (const p of ch.joined.concat(ch.updated)) { if (p.isMe || p.kind !== 'viewer') continue; upsertRemote(p); } uiOnline(); }, () => { NET.room = null; G.remote.clear(); uiOnline(); });
  room.onConnection(c => { NET.connected = c; uiOnline(); }, () => { });
  netPresence(true); uiOnline();
}
function cleanStr(s, n) { return String(s || '').replace(/[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁠-⁯]/g, '').slice(0, n); }
function upsertRemote(p) {
  const pr = p.presence || {}; if (!pr.c || !CLASSES[pr.c] || !pr.a || typeof pr.a !== 'object') return;
  let r = G.remote.get(p.peer); const x = +pr.x, y = +pr.y; if (!isFinite(x) || !isFinite(y)) return;
  if (!r) { r = { type: 'remote', peer: p.peer, x, y, tx: x, ty: y, anim: 'idle', af: 0, at: 0, hum: true, shR: 6, chatI: pr.ch ? pr.ch.i : 0 }; G.remote.set(p.peer, r); }
  r.name = cleanStr(pr.n, 16) || 'Héroe'; r.cls = pr.c; r.app = normApp(pr.a); r.gear = cleanGear(pr.g); r.cos = cleanCos(pr.cs); r.hh = pr.hh ? 1 : 0; r.lv = clamp(+pr.l || 1, 1, MAXLV) | 0;
  r.map = /^[a-z_0-9]{1,32}$/.test(pr.m || '') ? pr.m : 'world'; r.tx = x; r.ty = y; r.dir = DIRS.includes(pr.d) ? pr.d : 'down'; const an = ANIMS[pr.s] ? pr.s : 'idle'; if (an !== r.anim) { r.anim = an; r.af = 0; }
  r.atlas = remoteAtlas(r);
  partyRecv(r, pr); extraRecv(r, pr); socialRecv(r, pr); if (PARTY.id && r.pt === PARTY.id) partyCastRecv(r, pr);
  if (pr.ch && pr.ch.i !== r.chatI && typeof pr.ch.t === 'string') { r.chatI = pr.ch.i; r.chat = cleanStr(pr.ch.t, 80); r.chatT = G.t; chatLog(r.name, r.chat, false); }
}
function updateRemotes(dt) { for (const r of G.remote.values()) { const d = Math.hypot(r.tx - r.x, r.ty - r.y); if (d > 200) { r.x = r.tx; r.y = r.ty; } else { const k = 1 - Math.pow(0.001, dt); r.x += (r.tx - r.x) * k; r.y += (r.ty - r.y) * k; } stepAnim(r, dt, r.anim === 'walk' ? 9 : r.anim === 'atk' ? 12 : r.anim === 'dance' ? 7 : r.anim === 'wave' || r.anim === 'cheer' || r.anim === 'slam' ? 5 : 2); } }
let presT = 0, lastPres = '', lastPresT = 0, chatI = 0, myChat = null;
const NET_ANIMS = ['walk', 'atk', 'cast', 'chop', 'mine', 'fish', 'gather', 'slam', 'dig', 'wave', 'sit', 'dance', 'cheer'];
function netPresence(force) {
  const P = G.P; if (!netOnline() || !P || P.ghost || !P.S) return;
  const o = { n: P.name.slice(0, 16), c: P.cls, a: normApp(P.app), g: gearTiers(P), cs: P.cos || {}, hh: P.hideHelm ? 1 : 0, l: P.lv, m: P.map, x: Math.round(P.x), y: Math.round(P.y), d: P.dir, s: P.dead ? 'dead' : NET_ANIMS.includes(P.anim) ? P.anim : 'idle' };
  partyPresence(o); extraPresence(o); socialPresence(o);
  if (myChat) o.ch = myChat;
  const k = JSON.stringify(o); if (!force && k === lastPres && G.t - lastPresT < 2.5) return; const same = k === lastPres; lastPres = k; lastPresT = G.t; if (NET.room && !same) NET.room.presence(o).catch(() => { }); rtcSend(o);
}
function netTick(dt) { updateRemotes(dt); partyTick(dt); presT += dt; if (presT > 0.12) { presT = 0; netPresence(false); } }
function netChat(t) { const P = G.P; chatI++; myChat = { i: chatI, t }; P.chat = t; P.chatT = G.t; chatLog(P.name, t, true); netPresence(true); }
function uiOnline() { const b = $('#bOnline'); if (!b) return; const n = G.remote.size; b.hidden = !NET.room && !rtcSupported(); b.innerHTML = iconHTML(['users'], 16) + `<span>${n + 1}</span>`; $('#bChat').hidden = !netOnline(); }
