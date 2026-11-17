// Compara tu personaje con el que ven los demás tras pasar por la red (sala, WiFi y Photon usan la misma presencia).
(() => {
 const P = G.P, out = { cases: 0, bad: [], sizes: [] };
 let sent = null; const oldOn = netOnline, oldSend = rtcSend;
 netOnline = () => true; rtcSend = o => { sent = o; };
 const px = A => { const c = A.img, x = c.getContext('2d'); return x.getImageData(0, 0, c.width, c.height).data; };
 const same = (a, b) => { if (a.length !== b.length) return false; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; };
 function roundTrip(label) {
  sent = null; netPresence(true); if (!sent) { out.bad.push([label, 'sin presencia']); return; }
  const s = JSON.stringify(sent); out.sizes.push(s.length);
  if (s.length > 12000) out.bad.push([label, 'presencia demasiado grande para Photon', s.length]);
  G.remote.delete('rtc:test'); upsertRemote({ peer: 'rtc:test', presence: JSON.parse(s) });
  const r = G.remote.get('rtc:test'); out.cases++;
  if (!r) { out.bad.push([label, 'remoto no creado']); return; }
  const A = playerAtlas(P), B = remoteAtlas(r);
  if (A.img.width !== B.img.width || A.img.height !== B.img.height || !same(px(A), px(B))) {
   out.bad.push([label, 'dibujo distinto', JSON.stringify(sent.g), JSON.stringify(r.gear), JSON.stringify(sent.a) === JSON.stringify(r.app) ? '' : ['app', JSON.stringify(normApp(P.app)), JSON.stringify(r.app)]]);
  }
 }
 const save = { souls: P.souls, soulSet: P.soulSet, cls: P.cls, app: P.app, equip: P.equip, cos: P.cos, lv: P.lv };
 try {
  P.lv = 400;
  const tiers = [...new Set(Object.values(ITEMS).filter(i => i.t === 'armor').map(i => i.tier))].sort((a, b) => a - b);
  for (const cls of ['guerrero', 'mago', 'arquero', 'asesino', 'bardo', 'invocador', 'pez']) for (const t of tiers) {
   P.cls = cls; P.cos = {}; P.app = { ...DEF_APP, g: t % 2 ? 'f' : 'm', bt: t % 5 };
   const eq = {}; for (const it of Object.values(ITEMS)) if (it.t === 'armor' && it.tier === t && (!it.cls || it.cls === cls)) eq[it.slot] = { id: it.id };
   P.equip = Object.assign({}, save.equip, eq); calcStats(P); roundTrip(cls + ' tier ' + t);
  }
  // Cosméticos rediseñados.
  P.cls = 'guerrero'; P.equip = save.equip;
  for (const id of Object.keys(COSM)) { P.cos = { [COSM[id].slot]: id }; P.app = { ...DEF_APP, g: 'f' }; roundTrip('cos ' + id); }
  // Todos los peinados de ambos sexos (con tinte personalizado y sin él).
  P.cos = {};
  for (const g of ['f', 'm']) { const H = g === 'm' ? HS_M : HS_F; for (let i = 0; i < H.length; i++) for (const dye of [0, 1]) {
   P.app = { ...DEF_APP, g, hs: i, bt: i % 5, hair: 'rubio', hair2: 'azul' }; if (dye) P.app.r8Dye = 1; roundTrip('pelo ' + g + ' ' + i + ' ' + (H[i].n || '') + (dye ? ' tinte' : ''));
  } }
 // Cada habilidad activa de cada clase: se lanza aquí y el otro jugador recibe su animación.
  out.skills = { cast: 0, seen: 0, notCast: [], notSeen: [] };
  let mob = G.ents.find(e => e.type === 'mob' && !e.dead && dist2(e.x, e.y, P.x, P.y) < 40000); if (!mob) { mob = spawnMob(Object.keys(MOBS)[0], 400, P.x + 40, P.y, P.map); }
  for (const D of SV_OF.values()) {
   P.cls = D.cls; P.app = { ...DEF_APP }; P.cos = {}; P.equip = save.equip; calcStats(P); P.atlas = playerAtlas(P);
   P.skills[D.id] = 5; P.slots[0] = D.id; P.cds[D.id] = 0; P.mp = 1e6; P.busy = 0; P.dead = false; P.job = null; P.fishing = null; P.mount = null;
   if (mob) { mob.x = P.x + 40; mob.y = P.y; mob.hp = mob.maxhp = 1e9; mob.dead = false; mob.dying = 0; mob.remove = false; if (!G.ents.includes(mob)) G.ents.push(mob); }
   sent = null; netPresence(true); G.remote.delete('rtc:sk'); upsertRemote({ peer: 'rtc:sk', presence: JSON.parse(JSON.stringify(sent)) });
   if (D.cls === 'invocador') { P.souls = [{ id: 'nt1', mid: Object.keys(MOBS)[0], lv: 400 }]; P.soulSet = []; if (D.kind === 'sumbuff' && !SUMMONS.length) { P.skills.i1 = 5; P.cds.i1 = 0; P.slots[1] = 'i1'; useSkill(1); P.busy = 0; } }
   NFX_OUT.length = 0; useSkill(0);
   if (!(P.cds[D.id] > 0)) { out.skills.notCast.push(D.id); continue; } out.skills.cast++;
   sent = null; netPresence(true); upsertRemote({ peer: 'rtc:sk', presence: JSON.parse(JSON.stringify(sent)) });
   const r = G.remote.get('rtc:sk'); if (r && r.svCast && r.svCast.id === D.id) { out.skills.seen++; try { svAtlas(r, D); } catch (e) { out.skills.notSeen.push(D.id + ' atlas ' + e.message); } } else out.skills.notSeen.push(D.id);
   P.svCast = null; P.busy = 0; P.anim = 'idle';
  }
  G.remote.delete('rtc:sk');
 } finally { Object.assign(P, save); calcStats(P); netOnline = oldOn; rtcSend = oldSend; G.remote.delete('rtc:test'); }
 out.hairs = { f: HS_F.length, m: HS_M.length }; out.armorItems = Object.values(ITEMS).filter(i => i.t === 'armor').length; out.maxSize = Math.max(...out.sizes); delete out.sizes; out.badCount = out.bad.length; out.bad = out.bad.slice(0, 60);
 return out;
})()
