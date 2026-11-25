// 6.22 · Partidas en la nube con un código corto (Sergio: «¿habría un método más sencillo para los jugadores? …
// solo un código»). Antes, el «código de cuenta» era la partida entera en texto (un bloque larguísimo) + contraseña.
// Ahora: «Subir a la nube» (botón «Nube» en el título y en Opciones › Partida) guarda en Supabase y da un código de 8 letras (p. ej. K7QF92MX); en otro móvil, «Bajar de
// la nube» + ese código y vuelven todos los héroes. Con código, la copia se actualiza sola cada 10 min de juego.
// Servidor: proyecto Supabase de Sergio (tabla cloud_saves con RLS sin políticas; solo dos funciones):
//   tb_save_upload(code, secret, data, ver) → 'new' | 'ok' | 'taken' | 'bad'   (el móvil que crea el código guarda
//   un secreto; otro móvil no puede sobrescribirlo) · tb_save_download(code) → data | null.
// La clave es la «publishable» (pública por diseño). La secret / service_role nunca va en el juego.
// En la versión de claude.ai no funciona (bloquea servidores externos): solo en la app (APK) y en el navegador normal.
const NUBE = {
  url: 'https://pwlifmvuvisvdtukrdot.supabase.co',
  key: 'sb_publishable_Yk8jhKzFoxurp_0fxrDyvA_6PGKVaZp',
  abc: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',   // sin 0/O ni 1/I para no confundirlas
  every: 10 * 60 * 1000,                       // copia automática cada 10 min mientras juegas
  last: 0, busy: false
};
async function nubeRpc(fn, body) {
  const r = await withTimeout(fetch(NUBE.url + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { apikey: NUBE.key, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }), 20000);
  if (!r.ok) throw new Error('http ' + r.status);
  return r.json();
}
const nubeStoreKey = () => 'thebound.nube.' + (ACC ? accId(ACC) : '_guest');
function nubeGet() { try { return JSON.parse(storage.get(nubeStoreKey()) || 'null'); } catch (e) { return null; } }
function nubeSet(o) { storage.set(nubeStoreKey(), JSON.stringify(o)); }
function nubeRand(n) { const a = new Uint32Array(n); crypto.getRandomValues(a); let s = ''; for (const x of a) s += NUBE.abc[x % NUBE.abc.length]; return s; }
const nubeFmt = c => c ? c.slice(0, 4) + '-' + c.slice(4) : '';
function nubeErr(e) {
  const m = String(e && (e.message || e.code) || e);
  if (m === 'none') return L2('No hay ninguna partida con ese código.', 'There is no save with that code.');
  if (m === 'fmt') return L2('El código tiene 8 letras y números (por ejemplo K7QF-92MX).', 'The code has 8 letters and digits (for example K7QF-92MX).');
  if (m === 'empty') return L2('No hay héroes guardados que subir.', 'There are no saved heroes to upload.');
  return L2('No se pudo conectar con la nube. Revisa tu internet e inténtalo otra vez.', 'Could not reach the cloud. Check your internet and try again.');
}
// todos los héroes de la cuenta abierta (o los de invitado), tal como están guardados en este móvil
function nubePayload() {
  const slots = accSlots(ACC || '');
  if (!slots.some(Boolean)) return null;
  if (ACC) { const A = accList()[accId(ACC)]; return { v: 2, kind: 'account', name: ACC, h: A && A.h, s: A && A.s, slots }; }
  return { v: 2, kind: 'guest', slots };
}
async function nubeUpload() {
  const p = nubePayload(); if (!p) throw 'empty';
  const data = await packCode(p);
  let c = nubeGet();
  for (let t = 0; t < 4; t++) {
    if (!c) c = { code: nubeRand(8), secret: nubeRand(24) };
    const r = await nubeRpc('tb_save_upload', { p_code: c.code, p_secret: c.secret, p_data: data, p_ver: String(typeof GAME_VER !== 'undefined' ? GAME_VER : '') });
    if (r === 'new' || r === 'ok') { c.at = Date.now(); nubeSet(c); NUBE.last = Date.now(); return c; }
    if (r === 'taken') { c = null; continue; }   // código ya usado por otro móvil (casi imposible): se crea otro
    throw new Error(String(r));
  }
  throw new Error('taken');
}
async function nubeDownload(code) {
  code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!/^[A-Z2-9]{8}$/.test(code)) throw 'fmt';
  const txt = await nubeRpc('tb_save_download', { p_code: code });
  if (!txt) throw 'none';
  return unpackCode(txt);
}
// mete lo bajado en este móvil; devuelve el texto para el jugador (o lanza un error)
let NUBE_REPLACE = '';
function nubeApply(d, code) {
  const fix = x => { if (!x) return null; try { const o = JSON.parse(x); o.savedAt = Date.now(); return JSON.stringify(o); } catch (e) { return null; } };
  if (d && d.kind === 'account' && d.name) {
    const L = accList(), id = accId(d.name);
    if (L[id] && accSlots(d.name).some(Boolean) && NUBE_REPLACE !== code) { NUBE_REPLACE = code; return { ask: L2('En este móvil ya existe la cuenta «', 'This phone already has the account “') + d.name + L2('». Toca «Bajar» otra vez para reemplazar sus héroes por los de la nube.', '”. Tap “Download” again to replace its heroes with the cloud ones.') }; }
    NUBE_REPLACE = '';
    L[id] = { n: d.name, h: d.h, s: d.s, at: Date.now() }; accSave(L);
    accSetSlots(d.name, (d.slots || []).map(fix));
    accUI = null; accLogin(d.name);
    return { ok: L2('Cuenta «', 'Account “') + d.name + L2('» recuperada. Entra con su contraseña de siempre cuando la pida.', '” restored. Use its usual password if asked.') };
  }
  if (d && d.kind === 'guest') {
    const list = (d.slots || []).map(fix).filter(Boolean); let put = 0;
    for (const s of list) { let i = 0; for (; i < NSLOTS; i++) if (!storage.get(i ? SAVE_KEY + '.s' + i : SAVE_KEY)) break; if (i >= NSLOTS) break; storage.set(i ? SAVE_KEY + '.s' + i : SAVE_KEY, s); put++; }
    if (!put && list.length) return { err: L2('No hay espacios libres de invitado. Borra un héroe primero.', 'No free guest slots. Delete a hero first.') };
    accUI = null; if (ACC) accLogin(''); else refreshTitle();
    return { ok: put + L2(' héroe(s) recuperado(s) como invitado.', ' hero(es) restored as guest.') };
  }
  throw new Error('bad');
}

// ---------- pantalla de título: botón ☁ Nube en la barra de cuenta ----------
hookAround('accBarHTML', next => {
  if (accUI === 'nube') {
    const c = nubeGet();
    return `<div class="accForm"><b>${L2('Partida en la nube', 'Cloud save')}</b>
      <small class="hint">${c ? L2('Tu código: ', 'Your code: ') + '<b style="font-size:1.25em;letter-spacing:.08em">' + nubeFmt(c.code) + '</b>' : L2('Sube tus héroes y te damos un código de 8 letras para recuperarlos en cualquier móvil.', 'Upload your heroes and get an 8-letter code to restore them on any phone.')}</small>
      <div class="row"><button class="btn gold sm" id="nubeUp">${c ? L2('Actualizar copia', 'Update backup') : L2('Subir a la nube', 'Upload to cloud')}</button>${c ? `<button class="btn sm" id="nubeCopy">${L2('Copiar código', 'Copy code')}</button>` : ''}</div>
      <input id="nubeC" maxlength="12" placeholder="${L2('Código (ej. K7QF-92MX)', 'Code (e.g. K7QF-92MX)')}" autocapitalize="characters" autocomplete="off" style="text-transform:uppercase">
      <div class="row"><button class="btn sm" id="nubeDown">${L2('Bajar de la nube', 'Download from cloud')}</button><button class="btn sm" id="accX">${L2('Cerrar', 'Close')}</button></div>
      <small id="accMsg" class="hint">${L2('Guarda el código en tus notas. Quien lo tenga puede bajar tu partida: no lo compartas.', 'Keep the code in your notes. Anyone who has it can download your save: don’t share it.')}</small></div>`;
  }
  const h = next();
  return accUI ? h : h.replace(/<\/div>\s*$/, `<button class="btn sm" id="nubeOpen">${L2('Nube', 'Cloud')}</button></div>`);
});
hookAfter('accWire', () => {
  const msg = t => { const m = $('#accMsg'); if (m) m.textContent = t; };
  const on = (id, f) => { const b = $(id); if (b) b.onclick = f; };
  on('#nubeOpen', () => { accUI = 'nube'; NUBE_REPLACE = ''; refreshTitle(); });
  on('#accX', () => { accUI = null; refreshTitle(); });
  on('#nubeUp', () => { if (NUBE.busy) return; NUBE.busy = true; msg(L2('Subiendo…', 'Uploading…'));
    nubeUpload().then(c => { NUBE.busy = false; refreshTitle(); msg(L2('¡Listo! Tu código es ', 'Done! Your code is ') + nubeFmt(c.code)); }).catch(e => { NUBE.busy = false; msg(nubeErr(e)); }); });
  on('#nubeCopy', () => { const c = nubeGet(); if (!c) return; try { navigator.clipboard.writeText(nubeFmt(c.code)).then(() => msg(L2('¡Código copiado!', 'Code copied!')), () => msg(nubeFmt(c.code))); } catch (e) { msg(nubeFmt(c.code)); } });
  on('#nubeDown', () => { if (NUBE.busy) return; const code = ($('#nubeC') || {}).value || ''; NUBE.busy = true; msg(L2('Buscando…', 'Searching…'));
    nubeDownload(code).then(d => { NUBE.busy = false; const r = nubeApply(d, code.toUpperCase().replace(/[^A-Z0-9]/g, '')); if (r.ask || r.err) { msg(r.ask || r.err); return; } toast(r.ok, 'quest', 6); })
      .catch(e => { NUBE.busy = false; msg(nubeErr(e)); }); });
});

// ---------- en partida: Opciones › Partida ----------
hookAfter('renderOpts', (_r, B) => {
  const imp = B && B.querySelector && B.querySelector('#oImp'); if (!imp || B.querySelector('#oNube')) return;
  const b = document.createElement('button'); b.className = 'btn'; b.id = 'oNube'; b.textContent = L2('Subir a la nube', 'Upload to cloud');
  imp.parentNode.insertBefore(b, imp.nextSibling);
  b.onclick = () => { const m = $('#oMsg'); if (NUBE.busy) return; saveGame(true); NUBE.busy = true; if (m) m.textContent = L2('Subiendo…', 'Uploading…');
    nubeUpload().then(c => { NUBE.busy = false; if (m) m.innerHTML = L2('Copia en la nube lista. Tu código: ', 'Cloud backup ready. Your code: ') + '<b style="font-size:1.2em;letter-spacing:.08em">' + nubeFmt(c.code) + '</b>' + L2(' (se actualiza sola cada 10 min).', ' (updates itself every 10 min).'); })
      .catch(e => { NUBE.busy = false; if (m) m.textContent = nubeErr(e); }); };
});

// ---------- copia automática: si ya tienes código, cada 10 min de juego al guardar ----------
hookAfter('saveGame', () => {
  if (NUBE.busy || Date.now() - NUBE.last < NUBE.every) return;
  const c = nubeGet(); if (!c) return;
  NUBE.last = Date.now(); NUBE.busy = true;
  nubeUpload().then(() => { NUBE.busy = false; }).catch(() => { NUBE.busy = false; });
});

// ---------- Lupa ----------
if (typeof GSIS !== 'undefined') GSIS.push(['nube', L2('Partida en la nube (código corto)', 'Cloud save (short code)'), () => [
  L2('En el título toca «Nube» (o en Opciones › Partida, «Subir a la nube»): tus héroes se guardan en internet y recibes un código de 8 letras, por ejemplo K7QF-92MX.', 'On the title screen tap “Cloud” (or Options › Game, “Upload to cloud”): your heroes are saved online and you get an 8-letter code, for example K7QF-92MX.'),
  L2('En otro móvil: título › «Nube», escribe el código y «Bajar de la nube». Vuelven todos los héroes de esa cuenta.', 'On another phone: title › “Cloud”, type the code and “Download from cloud”. Every hero of that account comes back.'),
  L2('Con código, la copia se actualiza sola cada 10 minutos de juego. Guarda el código en tus notas y no lo compartas.', 'Once you have a code, the backup updates itself every 10 minutes of play. Keep the code in your notes and don’t share it.'),
  L2('Necesita internet. Funciona en la app; en la versión de claude.ai no.', 'Needs internet. Works in the app; not in the claude.ai version.')
]]);
