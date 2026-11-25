// 6.10 · Peces del Mar de Dawn (Sergio: «sí, añade peces de Dawn»). Las cañas de Coralita (620), Nacarita (650) y Piedra
// del Mar (680) no pescaban nada nuevo porque no había peces de tier 23-25. Ahora se pesca en todo el mapa de Dawn:
// los peces de mar de siempre para quien no tenga esas cañas y seis peces propios (2 por tier) para quien las tenga.
// Requisitos como el resto: Pesca RESLV[t] (140 / 146 / 152) y caña toolNeed('pesca', t) (19 / 20 / 21).
const DAWN_FISH = [
  ['pz_dw_coralino', 'Pez Coralino', 'Coral Fish', 23, '#f0708a', 'clown', 'Nada entre los arrecifes de Foosha y Shells Town.', 'Swims among the reefs of Foosha and Shells Town.'],
  ['pz_dw_barracuda', 'Barracuda del Este', 'East Barracuda', 23, '#8a9ab0', 'long', 'Caza en las aguas tranquilas del este de Dawn.', 'Hunts in the calm waters of Dawn’s eastern sea.'],
  ['pz_dw_nacar', 'Pez de Nácar', 'Nacre Fish', 24, '#d8e8f8', 'round', 'Sus escamas brillan como la Nacarita.', 'Its scales shine like Nacrite.'],
  ['pz_dw_espada', 'Pez Espada Rayado', 'Striped Swordfish', 24, '#3a6aa0', 'sword', 'Salta junto a los barcos que van a Baratie.', 'Leaps beside ships bound for Baratie.'],
  ['pz_dw_marea', 'Anguila de Piedra del Mar', 'Seastone Eel', 25, '#3a8a8a', 'eel', 'Vive bajo las rocas de Piedra del Mar; dicen que debilita a quien la toca.', 'Lives under Seastone rocks; they say it weakens whoever touches it.'],
  ['pz_dw_rey', 'Cría de Rey del Mar', 'Sea King Hatchling', 25, '#6a4a8a', 'dragon', 'Una cría de las bestias gigantes del mar. Muy rara.', 'A hatchling of the giant sea beasts. Very rare.']];
for (const [id, es, en, t, col, shape, des, den] of DAWN_FISH) { const n = L2(es, en);
  FISH.push([id, n, t, ['dawn'], col]);
  it(id, { n, t: 'mat', fish: true, stack: true, tier: t, hab: ['dawn'], price: 6 * t * t + 4 + t * 20, icon: ['fish', col], rar: 5, d: L2(des + ' Se pesca en el Mar de Dawn.', den + ' Caught in the Dawn Sea.') });
  if (typeof FX_SHAPE !== 'undefined') FX_SHAPE[id] = shape; }
// los peces de mar de siempre también pican en Dawn
for (const f of FISH) if (f[3] && f[3].includes('mar') && !f[3].includes('dawn')) f[3] = f[3].concat('dawn');
FISH_MAP.dawn = 'dawn';

// Lupa › Crossovers › materiales: dónde y con qué se pesca
{ const g = LUPA_DAWN.find(x => x[0] === 'mares601'); if (g) { const f = g[2]; g[2] = () => f().concat([
  '🎣 ' + L2('Pesca en Dawn (en cualquier orilla del mapa): los peces de mar de siempre y seis propios.', 'Fishing in Dawn (from any shore of the map): the usual sea fish and six of its own.'),
  '• ' + L2(`Pez Coralino y Barracuda del Este: Pesca ${RESLV[23]} y Caña de Coralita.`, `Coral Fish and East Barracuda: Fishing ${RESLV[23]} and Coralite Rod.`),
  '• ' + L2(`Pez de Nácar y Pez Espada Rayado: Pesca ${RESLV[24]} y Caña de Nacarita.`, `Nacre Fish and Striped Swordfish: Fishing ${RESLV[24]} and Nacrite Rod.`),
  '• ' + L2(`Anguila de Piedra del Mar y Cría de Rey del Mar: Pesca ${RESLV[25]} y Caña de Piedra del Mar.`, `Seastone Eel and Sea King Hatchling: Fishing ${RESLV[25]} and Seastone Rod.`)]); } }
// si puedes pescar alguno de Dawn, la mitad de las veces pica uno de Dawn (si no, se perderían entre más de 20 peces de mar)
hookAround('pickFish', function (next, hab) { if (hab === 'dawn' && Math.random() < 0.5) { const P = G.P, lv = P.jobs.pesca.lv, rod = bestTool('pesca');
    const ok = FISH.filter(f => f[3].length === 1 && f[3][0] === 'dawn' && RESLV[f[2]] <= lv && toolNeed('pesca', f[2]) <= rod);
    if (ok.length) { const maxT = Math.max(...ok.map(f => f[2])); return choiceW(new RNG((Math.random() * 1e9) | 0), ok.map(f => ({ f, w: f[2] === maxT ? 1 : 2 }))).f; } }
  return next(hab); });

// «¿Qué hago ahora?» / guía de oficios: la flecha «Árbol/Veta para tu nivel» solo miraba el nivel de oficio y podía
// llevarte a un recurso que tu herramienta no puede recoger. Ahora mira también la herramienta.
if (typeof JOB_GUIDE !== 'undefined') {
  const can = (job, t) => { const b = bestTool(job) || 0; return b > 0 && toolNeed(job, t) <= b; };
  if (JOB_GUIDE.tala) JOB_GUIDE.tala.find = () => oLoc(nearObj(['tree'], o => o.st !== 'stump' && RESLV[WOODT[o.sp] || 1] <= jlv('tala') && can('tala', WOODT[o.sp] || 1)), L2('Árbol para tu nivel', 'Tree for your level'));
  if (JOB_GUIDE.mineria) JOB_GUIDE.mineria.find = () => oLoc(nearObj(['ore'], o => o.st !== 'dep' && RESLV[o.tier || 1] <= jlv('mineria') && can('mineria', o.tier || 1)), L2('Veta para tu nivel', 'Vein for your level'));
}
