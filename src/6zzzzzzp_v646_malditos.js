// ================= 6.46: LAS ARMAS MALDITAS CONSERVAN SU PACTO AL QUITARLAS Y PONERLAS =================
// Sergio pidió revisar que equipar/quitar objetos malditos y normales no deje estadísticas bajadas para siempre ni que dos
// malditos se cuenten mal. Las estadísticas vuelven siempre igual (calcStats se calcula de cero cada vez; tests/malditos_stats.py),
// pero había un fallo: equipFromInv copia solo { id, up } del objeto, así que un arma maldita perdía al volver a equiparla su
// pacto, su progreso de dominio (domK), si estaba dominada (dom) o purificada (pur, ¡50.000 de oro!) y volvía a ofrecer el pacto.
// La calidad (ql, 6.35) y la forja (fg, 4.34) ya tenían su arreglo; esto hace lo mismo con los campos de la maldición.
const CURSE_KEEP = ['pact', 'dom', 'pur', 'domK'];
hookAround('equipFromInv', (next, idx, ...a) => { const P = G.P, s = P && P.inv[idx], keep = {};
  if (s && ITEMS[s.id]) for (const k of CURSE_KEEP) if (s[k] !== undefined && s[k] !== null) keep[k] = s[k];
  const r = next(idx, ...a); if (!s || !Object.keys(keep).length) return r; const slot = ITEMS[s.id].slot, e = P.equip[slot];
  if (e && e.id === s.id) { Object.assign(e, keep); if (e.pact === 'skill' && !e.dom && !e.pur && !(P.lockSlot >= 0)) P.lockSlot = Math.floor(Math.random() * 4); calcStats(P); } return r; });
// la ventana del pacto se programa antes de que se le devuelva el pacto: si ya lo tiene (o está dominada o purificada), no sale
hookBefore('cursedOffer', w => { if (w && (w.pact || w.dom || w.pur)) return HOOK_SKIP; });
