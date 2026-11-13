// ================= PARTY MOB SYNC: the leader's world is the shared one =================
// Leader broadcasts nearby monsters; members mirror them ("ghost" mobs), send their damage back, and the leader resolves deaths.
let NID = 0;
const SYNC_R = 460;
function partyLeader() { if (!PARTY.id || PARTY.id === NET.myId) return null; for (const r of G.remote.values()) if (r.id === PARTY.id) return r; return null; }
function iAmLeader() { return PARTY.id && PARTY.id === NET.myId && partyMembers().length > 0; }
function syncActive() { const L = partyLeader(), P = G.P; return !!(L && L.map === 'world' && P.map === 'world' && !P.dead && dist(L.x, L.y, P.x, P.y) < SYNC_R + 200 && L.mbT && G.t - L.mbT < 3); }
// ----- leader side -----
function syncPresence(o) {
  if (!iAmLeader() || G.P.map !== 'world') return; const P = G.P, out = [];
  for (const m of G.ents) { if (m.type !== 'mob' || m.boss || m.dying || m.map !== 'world' || m.state === 'dummy') continue; if (dist2(m.x, m.y, P.x, P.y) > SYNC_R * SYNC_R) continue; if (!m.nid) m.nid = ++NID;
    out.push([m.nid, m.mid, m.lv, Math.round(m.x), Math.round(m.y), Math.max(1, Math.round(m.hp / m.maxhp * 100)), m.anim === 'atk' ? 1 : m.anim === 'walk' ? 2 : 0, DIRS.indexOf(m.dir), m.elite ? 1 : 0]); if (out.length >= 16) break; }
  o.mb = out;
}
function syncLeaderRecv(r, pr) { // damage from members on my monsters: gh = {nid: cumulative}
  if (!iAmLeader() || r.pt !== PARTY.id || !pr.gh || typeof pr.gh !== 'object') return; r.ghl = r.ghl || {};
  for (const k in pr.gh) { const t = +pr.gh[k], prev = r.ghl[k] || 0; r.ghl[k] = t; const d = t - prev; if (!(d > 0)) continue; const m = G.ents.find(e => e.type === 'mob' && e.nid === +k && !e.dying); if (!m) continue;
    const dd = Math.min(d, m.maxhp) | 0; m.hp -= dd; m.flash = 0.1; m.lastHit = G.t; floatText(m.x + 8, m.y - (m.hgt || 30) - 6, dd, '#7ae0ff'); if (m.state === 'idle' || m.state === 'return') m.state = 'chase'; if (m.hp <= 0) { m.killedBy = r.id; killMob(m); } }
}
// ----- member side -----
const GHOSTS = new Map();
function syncMemberRecv(r, pr) {
  if (r.id !== PARTY.id || PARTY.id === NET.myId || !Array.isArray(pr.mb)) return; r.mbT = G.t; if (!syncActive()) return;
  const P = G.P, seen = new Set();
  for (const a of pr.mb) { if (!Array.isArray(a)) continue; const [nid, mid, lv, x, y, hp, an, di, el] = a; if (!MOBS[mid]) continue; seen.add(nid);
    let m = GHOSTS.get(nid);
    if (!m || m.remove) { m = spawnMob(mid, clamp(lv | 0, 1, MAXLV), +x, +y, 0, null, false); m.ghost = 1; m.nid = nid; m.state = 'ghost'; if (el) { m.elite = 1; m.maxhp *= 3.5; m.name = 'Élite ' + m.name; } m.hp = m.maxhp * hp / 100; GHOSTS.set(nid, m); }
    m.gx = +x; m.gy = +y; m.ga = an; m.dir = DIRS[di] || m.dir; m.seenT = G.t;
    const hh = m.maxhp * hp / 100; if (!(m.predT > G.t)) m.hp = hh; else m.hp = Math.min(m.hp, hh); }
  for (const [nid, m] of GHOSTS) if (!seen.has(nid)) { GHOSTS.delete(nid); if (!m.dying) { if (m.hp / m.maxhp < 0.35 || PARTY.gh && PARTY.gh[nid]) { m.dying = 0.001; m.hp = 0; setAnim(m, 'hurt'); burst(m.x, m.y - 10, 10, { sp: 60, up: 40, g: 140, life: 0.5, c: ['#ffffff', '#d8d0c8'] }); } else m.remove = true; } }
}
function ghostUpdate(m, dt) {
  const P = G.P; if (!syncActive() || G.t - (m.seenT || 0) > 2) { m.remove = true; GHOSTS.delete(m.nid); return; }
  const dx = m.gx - m.x, dy = m.gy - m.y, L = Math.hypot(dx, dy); if (L > 120) { m.x = m.gx; m.y = m.gy; } else { m.x += dx * Math.min(1, dt * 10); m.y += dy * Math.min(1, dt * 10); }
  setAnim(m, m.ga === 1 ? 'atk' : m.ga === 2 || L > 2 ? 'walk' : 'idle', true); stepAnim(m, dt, m.anim === 'walk' ? 8 : m.anim === 'atk' ? 10 : 3);
  // monsters also hurt the member who stands next to them
  m.gcd = (m.gcd || 0) - dt; if (m.gcd <= 0 && !P.dead && dist2(m.x, m.y, P.x, P.y) < 26 * 26) { m.gcd = 1.4; setAnim(m, 'atk'); hurtPlayer(m.atk, m); }
}
function ghostHit(m, d) { PARTY.gh = PARTY.gh || {}; PARTY.gh[m.nid] = (PARTY.gh[m.nid] || 0) + d; m.predT = G.t + 0.8; if (m.hp <= 0) m.hp = 1; }
function syncPresenceMember(o) { if (!PARTY.gh || !syncActive()) return; const ks = Object.keys(PARTY.gh).slice(-12); const g = {}; for (const k of ks) g[k] = Math.round(PARTY.gh[k]); o.gh = g; }
function syncBlocksCamp(c) { if (!syncActive()) return false; const L = partyLeader(); return dist(c.x * 16, c.y * 16, L.x, L.y) < SYNC_R + 260; }
