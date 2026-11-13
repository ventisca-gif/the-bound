// ================= EXPANSION DATA: level 150, new materials, jobs, gear, jewelry, cosmetics, skills, monsters, bosses =================
// ---------- resource tiers 8-11 ----------
Object.assign(ORE, { 8: ['#c05a1a', '#ff9040', '#ffd0a0'], 9: ['#3a6ad0', '#8ac0ff', '#e8f4ff'], 10: ['#0a5a5a', '#2ae0d0', '#c0fff4'], 11: ['#3a1a6a', '#b070ff', '#ffe0a0'] });
Object.assign(HERB, { 8: ['Flor del Desierto', '#6a4a1a', '#f0a040', '#ffe08a'], 9: ['Orquídea de Jade', '#0c3a1a', '#2ad08a', '#b0ffd8'], 10: ['Loto Cristalino', '#2a1a5a', '#a088ff', '#f0e8ff'], 11: ['Flor Umbría', '#140a22', '#7a40c0', '#e0b0ff'] });
LOGN.push('Acacia', 'Caoba', 'Cristal', 'Sombra'); OREN.push('Oricalco', 'Astralita', 'Abisalita', 'Eclipsita');
Object.assign(WOODT, { acacia: 8, caoba: 9, arbolcristal: 10, umbrio: 11 });
Object.assign(LEAF, { acacia: pal(['#2a2a10', '#3e3e18', '#5a5a22', '#7a7a30', '#9a9a44', '#c0bc62']), caoba: pal(['#06200e', '#0c3418', '#144a22', '#1e6430', '#2c7e3c', '#46a050']), arbolcristal: pal(['#1a1040', '#2e1e6a', '#4a34a0', '#6a54d0', '#9a88f0', '#d8d0ff']) });
for (let t = 8; t <= 11; t++) {
  const rar = t >= 10 ? 2 : 1;
  it(`log${t}`, { n: `Tronco de ${LOGN[t]}`, t: 'mat', stack: true, tier: t, price: 4 * t * t, icon: ['log', t], rar });
  it(`ore${t}`, { n: `Mineral de ${OREN[t]}`, t: 'mat', stack: true, tier: t, price: 5 * t * t, icon: ['ore', t], rar });
  it(`herb${t}`, { n: HERB[t][0], t: 'mat', stack: true, tier: t, price: 4 * t * t, icon: ['herb', t], rar });
}
const FISH2 = [['pezoasis', 'Pez del Oasis', 8, ['oasis'], '#40c0a0'], ['piranha', 'Piraña Dorada', 8, ['selva'], '#f0b030'], ['arapaima', 'Arapaima', 9, ['selva'], '#b04a2a'], ['pezprisma', 'Pez Prisma', 9, ['cristal'], '#b8a0ff'], ['pezestelar', 'Pez Estelar', 10, ['cristal', 'oasis'], '#e0f0ff'], ['pezabisal', 'Pez Abisal', 10, ['eclipse'], '#5a2a9a'], ['leviatan', 'Cría de Leviatán', 11, ['eclipse', 'mar'], '#2a8a9a']];
for (const f of FISH2) { FISH.push(f); const [id, n, t, hab, col] = f; it(id, { n, t: 'mat', fish: true, stack: true, tier: t, hab, price: 6 * t * t + 4, icon: ['fish', col], rar: t >= 10 ? 4 : 3 }); }
const DROPS2 = [['aguijon', 'Aguijón de Escorpión', 8, ['fang', '#c08a30']], ['venda', 'Venda Antigua', 8, ['cloth', '#d8c8a0']], ['escamaarena', 'Escama de Arena', 8, ['scale', '#d0a050']], ['pieljaguar', 'Piel de Jaguar', 9, ['pelt', '#d89040']], ['savia', 'Savia Carnívora', 9, ['gel', '#e0405a']], ['plumatrop', 'Pluma Tropical', 9, ['wing', '#30c070']], ['seda', 'Seda de Araña', 9, ['cloth', '#e8e8f0']],
  ['prisma', 'Fragmento Prismático', 10, ['crystal', '#b8a0ff']], ['polvoestelar', 'Polvo Estelar', 10, ['core', '#e0f0ff']], ['cuernoastral', 'Cuerno Astral', 10, ['fang', '#a0c0ff']], ['esenciaeclipse', 'Esencia del Eclipse', 11, ['core', '#7a40c0']], ['placaumbria', 'Placa Umbría', 11, ['scale', '#3a2a5a']], ['ojovacio', 'Ojo del Vacío', 11, ['core', '#ff3a6a']], ['cuernodemonio', 'Cuerno de Demonio', 11, ['fang', '#a01a1a']]];
for (const [id, n, t, icon] of DROPS2) it(id, { n, t: 'mat', stack: true, tier: t, price: 5 * t * t + 3, icon, rar: t >= 10 ? 2 : 1 });
const GEMS = [['rubi', 'Rubí', '#e0203a', 3], ['zafiro', 'Zafiro', '#2a6ae0', 4], ['esmeralda', 'Esmeralda', '#20b050', 5], ['amatista', 'Amatista', '#9a40e0', 6], ['diamante', 'Diamante', '#e8f8ff', 8], ['opalo', 'Ópalo del Eclipse', '#ff8ad0', 10]];
for (const [id, n, col, t] of GEMS) it(id, { n, t: 'mat', stack: true, tier: t, price: 22 * t * t, icon: ['gem', col], rar: t >= 8 ? 3 : t >= 5 ? 2 : 1 });
it('piedra1', { n: 'Piedra de Mejora', t: 'mat', stack: true, tier: 2, price: 60, icon: ['stone', '#8ad0ff'], rar: 1 });
it('piedra2', { n: 'Piedra de Mejora Superior', t: 'mat', stack: true, tier: 6, price: 400, icon: ['stone', '#c070ff'], rar: 2 });
it('piedra3', { n: 'Piedra de Mejora Divina', t: 'mat', stack: true, tier: 10, price: 2500, icon: ['stone', '#ffb030'], rar: 4 });
it('tela_fina', { n: 'Tela Fina', t: 'mat', stack: true, tier: 2, price: 30, icon: ['cloth', '#c8a0e0'] });
it('tinte', { n: 'Tinte Mágico', t: 'mat', stack: true, tier: 4, price: 120, icon: ['potion', '#f05a8a'], rar: 1 });
// excavation relics
[['moneda_antigua', 'Moneda Antigua', 1, '#d8b040', 40], ['reliquia1', 'Ánfora Rota', 2, '#c07a4a', 90], ['reliquia2', 'Ídolo de Oro', 5, '#f0c840', 420], ['reliquia3', 'Tablilla Rúnica', 8, '#7ad0ff', 1500], ['reliquia4', 'Corona Perdida', 10, '#ffb030', 5000]].forEach(([id, n, t, col, price]) => it(id, { n, t: 'mat', stack: true, tier: t, price, relic: 1, icon: ['relic', col], rar: t >= 8 ? 3 : t >= 5 ? 2 : 1 }));
// farming
const CROPS = [['trigo', 'Trigo', 1, '#e8c860', 90], ['zanahoria', 'Zanahoria', 2, '#f08030', 150], ['tomate', 'Tomate', 3, '#e83a2a', 210], ['calabaza', 'Calabaza', 5, '#e88a20', 300], ['uva', 'Uvas', 6, '#7a3ab0', 360], ['melon', 'Melón Dorado', 8, '#f0d040', 480], ['frutaestelar', 'Fruta Estelar', 10, '#a0e0ff', 660]];
for (const [id, n, t, col, grow] of CROPS) { it(id, { n, t: 'mat', crop: 1, stack: true, tier: t, price: 4 * t * t + 6, icon: ['crop', col], rar: t >= 8 ? 2 : t >= 5 ? 1 : 0 }); it('sem_' + id, { n: 'Semillas de ' + n, t: 'mat', seed: id, grow, stack: true, tier: t, price: 3 * t * t + 4, icon: ['seed', col] }); }
// consumables
it('pocion5', { n: 'Poción de Vida Celestial', t: 'cons', stack: true, heal: 12000, price: 2200, lv: 100, icon: ['potion2', '#ff9ad0'], rar: 3 });
it('eter5', { n: 'Poción de Maná Celestial', t: 'cons', stack: true, mana: 5000, price: 2300, lv: 100, icon: ['potion2', '#9ad0ff'], rar: 3 });
it('pergamino_xp', { n: 'Pergamino de Sabiduría', t: 'cons', stack: true, xpB: 50, dur: 900, price: 800, icon: ['scroll', '#c070ff'], rar: 2 });
it('tonico_fuerza', { n: 'Tónico de Fuerza', t: 'cons', stack: true, tonic: { atkP: 15 }, dur: 600, price: 300, lv: 10, icon: ['potion', '#ff8a3a'], rar: 1 });
it('tonico_hierro', { n: 'Tónico de Hierro', t: 'cons', stack: true, tonic: { defP: 20 }, dur: 600, price: 300, lv: 10, icon: ['potion', '#a0a8c0'], rar: 1 });
it('pan', { n: 'Pan de Granja', t: 'cons', stack: true, heal: 300, food: 4, tier: 1, price: 30, icon: ['food', 1] });
it('ensalada', { n: 'Ensalada Fresca', t: 'cons', stack: true, heal: 900, food: 7, tier: 2, price: 90, icon: ['food', 2] });
[[8, 'Estofado del Oasis', 14000, 22], [9, 'Banquete de la Selva', 20000, 25], [10, 'Pastel Estelar', 28000, 28], [11, 'Festín del Eclipse', 40000, 32]].forEach(([t, n, heal, buff]) => it('food' + t, { n, t: 'cons', stack: true, heal, food: buff, tier: t, price: 25 * t * t, icon: ['food', t], rar: 3 }));
// tools 5-6 and shovels
TOOLT.push(['Celestial', 98, 13], ['del Eclipse', 126, 15]);
for (let t = 5; t <= 6; t++) { const [adj, lv, ti] = TOOLT[t]; it(`hacha${t}`, { n: `Hacha ${adj}`, t: 'tool', tool: 'tala', power: t, lv, price: 30 * t * t * 4, icon: ['axe', ti], rar: 3 }); it(`pico${t}`, { n: `Pico ${adj}`, t: 'tool', tool: 'mineria', power: t, lv, price: 30 * t * t * 4, icon: ['pick', ti], rar: 3 }); it(`cana${t}`, { n: `Caña ${adj}`, t: 'tool', tool: 'pesca', power: t, lv, price: 30 * t * t * 4, icon: ['rod', ti], rar: 3 }); }
const PALAT = [null, ['de Cobre', 1, 2], ['de Hierro', 10, 3], ['de Mithril', 30, 7], ['Rúnica', 55, 9], ['Celestial', 98, 13], ['del Eclipse', 126, 15]];
for (let t = 1; t <= 6; t++) { const [adj, lv, ti] = PALAT[t]; it(`pala${t}`, { n: `Pala ${adj}`, t: 'tool', tool: 'excavacion', power: t, lv, price: 30 * t * t, icon: ['shovel', ti], rar: t >= 5 ? 3 : t >= 3 ? 1 : 0 }); }
// ---------- new jobs ----------
Object.assign(JOBS, {
  excavacion: { n: 'Excavación', icon: 'shovel', desc: 'Cava montículos de tierra con una pala: monedas, gemas, reliquias y algún tesoro.' },
  agricultura: { n: 'Agricultura', icon: 'seed', desc: 'Planta semillas en los huertos de Hugo el granjero y cosecha cuando crezcan.' },
  joyeria: { n: 'Joyería', icon: 'gem', desc: 'Engasta gemas en anillos y amuletos con el joyero de la ciudad.' },
  sastreria: { n: 'Sastrería', icon: 'needle', desc: 'Confecciona ropa cosmética con telas, sedas y tintes en la sastrería.' },
});
UI_ICONS.push('shovel:2', 'seed:2', 'gem:#e0203a', 'needle:2', 'paw', 'stone:#8ad0ff', 'flag', 'heart:#e84050', 'crown');
// ---------- jewelry (rings: slot acc, amulets: slot neck) ----------
const JEWELS = [
  ['anillo_rubi', 'Anillo de Rubí', 'acc', { atk: 18, crit: 2 }, 12, [['ore3', 3], ['rubi', 1]], 4, 1], ['amuleto_zafiro', 'Amuleto de Zafiro', 'neck', { mpB: 120, def: 12 }, 16, [['ore3', 4], ['zafiro', 1]], 8, 1],
  ['amuleto_cobre', 'Colgante de Cobre', 'neck', { hpB: 80, def: 4 }, 4, [['ore1', 4]], 1, 0], ['anillo_esmeralda', 'Anillo de Esmeralda', 'acc', { hpB: 600, def: 25 }, 30, [['ore4', 4], ['esmeralda', 1]], 18, 2],
  ['amuleto_cazador', 'Colgante del Cazador', 'neck', { crit: 6, atk: 40 }, 38, [['ore4', 4], ['rubi', 2], ['garra', 2]], 24, 2], ['amuleto_amatista', 'Amuleto de Amatista', 'neck', { atk: 70, mpB: 300 }, 46, [['ore5', 4], ['amatista', 2]], 30, 2],
  ['anillo_diamante', 'Anillo de Diamante', 'acc', { atk: 160, crit: 6, hpB: 900 }, 80, [['ore7', 5], ['diamante', 1]], 46, 3], ['amuleto_diamante', 'Amuleto de Diamante', 'neck', { def: 160, hpB: 2400 }, 85, [['ore7', 6], ['diamante', 2]], 50, 3],
  ['anillo_astral', 'Anillo Astral', 'acc', { atk: 320, crit: 10, hpB: 2000 }, 115, [['ore9', 6], ['diamante', 2], ['polvoestelar', 2]], 60, 4], ['amuleto_abisal', 'Amuleto Abisal', 'neck', { atk: 300, def: 240, hpB: 4000 }, 128, [['ore10', 6], ['opalo', 1], ['prisma', 3]], 66, 4],
  ['sello_eclipse', 'Sello del Eclipse', 'neck', { atk: 520, def: 360, hpB: 7000, crit: 12, mpB: 900 }, 145, [['ore11', 8], ['opalo', 3], ['esenciaeclipse', 4]], 72, 5],
];
for (const [id, n, slot, st, lv, mats, jlv, rar] of JEWELS) { it(id, Object.assign({ n, t: 'acc', slot, lv, price: 30 * lv * (rar + 1), icon: [slot === 'neck' ? 'amulet' : 'ring', rar], rar }, st)); RECIPES.push({ id: 'r_' + id, job: 'joyeria', out: id, n: 1, lv, jlv, gold: 20 * lv * (rar + 1), mats, cat: 'joya' }); }
[['acc_kragg', 'Pinza del Rey Cangrejo', { atk: 26, def: 12 }, 14, 1, 'acc'], ['acc_colmillo', 'Colmillo Férreo', { atk: 34, crit: 3 }, 22, 2, 'neck'], ['acc_renegado', 'Emblema del Renegado', { def: 40, hpB: 500 }, 28, 2, 'neck'], ['acc_sahrak', 'Aguijón Real', { atk: 380, crit: 10 }, 108, 4, 'neck'],
  ['acc_yarak', 'Corazón de la Selva', { hpB: 6000, def: 250 }, 120, 4, 'acc'], ['acc_coloso', 'Núcleo del Coloso', { def: 420, hpB: 5000, atk: 200 }, 134, 4, 'neck'], ['acc_eclipsor', 'Corona del Eclipse', { atk: 700, def: 450, hpB: 9000, crit: 15, mpB: 1200 }, 148, 5, 'acc']].forEach(([id, n, st, lv, rar, slot]) => it(id, Object.assign({ n, t: 'acc', slot, lv, price: 40 * lv * (rar + 1), icon: [slot === 'neck' ? 'amulet' : 'ring', rar], rar }, st)));
// ---------- cosmetics as items (they move into the wardrobe when obtained) ----------
for (const id in COSM) it('cosi_' + id, { n: COSM[id].n, t: 'cos', cos: id, price: 600, icon: ['hanger'], rar: 2 });
const COS_SHOP = ['c_corona', 'c_gato', 'c_tiara', 'c_traje_noble', 'c_kimono_sakura', 'c_pantalon_noble', 'c_falda_plisada', 'c_botas_altas', 'c_sandalias', 'c_capa_real', 'c_capa_estelar'];
const COS_PRICE = { c_corona: 9000, c_gato: 2500, c_tiara: 12000, c_traje_noble: 4000, c_kimono_sakura: 3500, c_pantalon_noble: 1500, c_falda_plisada: 1500, c_botas_altas: 1200, c_sandalias: 1800, c_capa_real: 6000, c_capa_estelar: 15000 };
for (const id in COS_PRICE) ITEMS['cosi_' + id].price = COS_PRICE[id];
SHOPS.cos.puerto = COS_SHOP.slice(0, 9).map(c => 'cosi_' + c); SHOPS.cos.sahrim = COS_SHOP.map(c => 'cosi_' + c);
// tailoring recipes (cosmetics + materials)
[['tela_fina', [['tela', 2]], 1, 1, 10, 2], ['tinte', [['herb2', 2], ['herb4', 1], ['gel', 2]], 10, 6, 40, 2], ['cosi_c_gato', [['tela_fina', 4], ['piel', 3]], 5, 4, 300, 1], ['cosi_c_falda_plisada', [['tela_fina', 5], ['tinte', 1]], 8, 8, 300, 1],
 ['cosi_c_kimono_sakura', [['tela_fina', 8], ['tinte', 2], ['seda', 2]], 20, 18, 900, 1], ['cosi_c_traje_noble', [['tela_fina', 8], ['tinte', 2], ['ore4', 2]], 25, 24, 1200, 1], ['cosi_c_pantalon_noble', [['tela_fina', 6], ['tinte', 1]], 15, 14, 600, 1],
 ['cosi_c_botas_altas', [['piel', 6], ['tinte', 1]], 12, 10, 400, 1], ['cosi_c_capa_real', [['tela_fina', 12], ['tinte', 4], ['ore4', 4]], 40, 34, 3000, 1], ['cosi_c_capa_estelar', [['seda', 10], ['polvoestelar', 4], ['tinte', 4]], 110, 60, 9000, 1],
 ['cosi_c_tiara', [['ore5', 6], ['diamante', 1], ['tinte', 2]], 70, 50, 6000, 1], ['cosi_c_sandalias', [['ore4', 3], ['tela_fina', 3]], 30, 28, 800, 1]].forEach(([out, mats, lv, jlv, gold, n]) => RECIPES.push({ id: 'r_' + out, job: 'sastreria', out, n: out === 'tela_fina' ? 2 : n, lv, jlv, gold, mats, cat: out.startsWith('cosi_') ? 'cosmético' : 'material' }));
// alchemy & cooking additions
[['pocion5', [['herb9', 2], ['herb10', 1], ['savia', 1]], 100, 58, 600], ['eter5', [['herb10', 2], ['herb8', 1], ['polvoestelar', 1]], 100, 60, 620], ['pergamino_xp', [['herb5', 2], ['tinte', 1], ['ecto', 2]], 30, 26, 300],
 ['tonico_fuerza', [['herb3', 2], ['colmillo', 1]], 10, 8, 40], ['tonico_hierro', [['herb2', 2], ['caparazon', 2]], 10, 8, 40], ['piedra1', [['ore2', 3], ['gel', 2]], 8, 10, 60], ['piedra2', [['ore5', 3], ['ecto', 2], ['rubi', 1]], 45, 34, 500], ['piedra3', [['ore9', 3], ['prisma', 2], ['diamante', 1]], 110, 62, 3000]].forEach(([out, mats, lv, jlv, gold]) => RECIPES.push({ id: 'r_' + out, job: 'alquimia', out, n: out.startsWith('poc') || out.startsWith('eter') ? 2 : 1, lv, jlv, gold, mats, cat: out.startsWith('piedra') ? 'mejora' : 'pocion' }));
[['pan', [['trigo', 3]], 1, 1, 5], ['ensalada', [['zanahoria', 2], ['tomate', 2]], 5, 6, 15], ['food8', [['pezoasis', 2], ['tomate', 2], ['zanahoria', 2]], 96, 56, 300], ['food9', [['piranha', 2], ['arapaima', 1], ['calabaza', 2], ['uva', 2]], 106, 62, 450],
 ['food10', [['pezestelar', 2], ['frutaestelar', 2], ['trigo', 4], ['melon', 1]], 118, 68, 650], ['food11', [['pezabisal', 2], ['leviatan', 1], ['frutaestelar', 3]], 132, 72, 900]].forEach(([out, mats, lv, jlv, gold]) => RECIPES.push({ id: 'r_' + out, job: 'cocina', out, n: 2, lv, jlv, gold, mats, cat: 'comida' }));
// tools 5-6 + shovels at the smithy
for (let t = 5; t <= 6; t++) { const lv = TOOLT[t][1], m = t === 5 ? [['ore8', 6], ['log8', 4]] : [['ore10', 6], ['log10', 4]]; for (const k of ['hacha', 'pico', 'cana']) RECIPES.push({ id: `r_${k}${t}`, job: 'herreria', out: `${k}${t}`, n: 1, lv, jlv: t === 5 ? 56 : 66, gold: 3000 * t, mats: m, cat: 'herramienta' }); }
for (let t = 1; t <= 6; t++) RECIPES.push({ id: `r_pala${t}`, job: 'herreria', out: `pala${t}`, n: 1, lv: PALAT[t][1], jlv: [0, 0, 8, 22, 40, 56, 66][t], gold: 30 * t * t, mats: [null, [['ore1', 2], ['log1', 1]], [['ore2', 4], ['log2', 2]], [['ore5', 5], ['log4', 3]], [['ore7', 5], ['log6', 3]], [['ore8', 6], ['log8', 4]], [['ore10', 6], ['log10', 4]]][t], cat: 'herramienta' });
// ---------- skills rows 5-6 (levels 100-140) ----------
sk('g13', 'guerrero', 0, 4, 'Tormenta de Acero', 'act', 100, 'g4', { mp: 90, cd: 16, icon: ['spin', '#a0d8ff'], eff: { k: 'spin', m: 1.1, mr: 0.08, r: 50, hits: 8 }, d: 'Un remolino de acero que golpea 8 veces a tu alrededor ({m}% cada golpe).' });
sk('g14', 'guerrero', 0, 5, 'Corte del Vínculo', 'act', 130, 'g13', { mp: 160, cd: 30, icon: ['slash', '#ffd040'], eff: { k: 'slash', m: 8, mr: 0.6, arc: 3.6, r: 74, kb: 140 }, d: 'Un corte que parte el aire: {m}% de daño en un enorme arco frontal.' });
sk('g15', 'guerrero', 1, 4, 'Fortaleza', 'act', 104, 'g8', { mp: 80, cd: 45, icon: ['shield', '#a0d8ff'], eff: { k: 'buff', dur: 15, st: { defP: 40, atkP: 10 }, str: { defP: 3 } }, d: 'Durante 15 s: +{defP}% defensa y +{atkP}% ataque.' });
sk('g16', 'guerrero', 1, 5, 'Égida Eterna', 'act', 134, 'g15', { mp: 140, cd: 60, icon: ['shield', '#fff0a0'], eff: { k: 'shield', p: 45, pr: 3, dur: 10 }, d: 'Un escudo divino que absorbe el {p}% de tu vida máxima (10 s).' });
sk('g17', 'guerrero', 2, 4, 'Salto Devastador', 'act', 110, 'g12', { mp: 100, cd: 18, icon: ['slam', '#ff8a3a'], eff: { k: 'leap', dist: 130, m: 5, mr: 0.4, r: 56, stun: 1.5 }, d: 'Saltas sobre el enemigo y golpeas el suelo: {m}% de daño en área y aturdes 1.5 s.' });
sk('g18', 'guerrero', 2, 5, 'Cataclismo', 'act', 140, 'g17', { mp: 180, cd: 40, icon: ['slam', '#ff4040'], eff: { k: 'slam', m: 10, mr: 0.7, r: 84, stun: 2, front: 0 }, d: 'Desatas la tierra misma: {m}% de daño a todo a tu alrededor y aturdes 2 s.' });
sk('m13', 'mago', 0, 4, 'Meteoro', 'act', 100, 'm4', { mp: 110, cd: 18, icon: ['meteor', '#ff4010'], eff: { k: 'meteor', m: 8, mr: 0.6, r: 62, burn: 1, delay: 0.9 }, d: 'Invocas un meteoro gigante: {m}% de daño en área y quemadura.' });
sk('m14', 'mago', 0, 5, 'Apocalipsis Ígneo', 'act', 130, 'm13', { mp: 200, cd: 40, icon: ['meteor', '#ffd040'], eff: { k: 'rain', m: 2, mr: 0.15, n: 18, r: 30, area: 80, art: 'meteor', fire: 1 }, d: 'Una lluvia de 18 meteoros arrasa la zona ({m}% cada uno).' });
sk('m15', 'mago', 1, 4, 'Glaciar Eterno', 'act', 104, 'm8', { mp: 100, cd: 26, icon: ['snow', '#7ad0ff'], eff: { k: 'field', m: 1.3, mr: 0.1, r: 70, ticks: 12, slow: 2, art: 'ice' }, d: 'Una tormenta de hielo enorme: {m}% de daño por pulso y ralentiza.' });
sk('m16', 'mago', 1, 5, 'Cero Absoluto', 'act', 134, 'm15', { mp: 170, cd: 45, icon: ['nova', '#e8ffff'], eff: { k: 'nova', m: 6, mr: 0.45, r: 96, freeze: 3, art: 'ice' }, d: 'Congelas todo a tu alrededor: {m}% de daño y congelas 3 s.' });
sk('m17', 'mago', 2, 4, 'Agujero Negro', 'act', 110, 'm12', { mp: 120, cd: 24, icon: ['nova', '#a040e0'], eff: { k: 'vortex', m: 0.8, mr: 0.06, r: 86, ticks: 10 }, d: 'Un vórtice arcano atrae a los enemigos y los daña ({m}% por pulso).' });
sk('m18', 'mago', 2, 5, 'Singularidad', 'act', 140, 'm17', { mp: 180, cd: 30, icon: ['star', '#c070ff'], eff: { k: 'proj', m: 3, mr: 0.25, spd: 260, n: 9, spread: 2.4, pierce: 1, art: 'dark' }, d: 'Nueve esferas arcanas perforantes ({m}% cada una).' });
sk('a13', 'arquero', 0, 4, 'Flecha Perforante', 'act', 100, 'a4', { mp: 80, cd: 10, icon: ['arrow', '#7ad0ff'], eff: { k: 'proj', m: 7, mr: 0.5, spd: 560, pierce: 1, critB: 60, art: 'bigarrow' }, d: 'Una flecha que atraviesa todo a su paso: {m}% de daño.' });
sk('a14', 'arquero', 0, 5, 'Juicio del Cazador', 'act', 130, 'a13', { mp: 150, cd: 35, icon: ['skull', '#ffd040'], eff: { k: 'mark', m: 6, mr: 0.45, p: 60, pr: 3 }, d: 'Marcas a tu presa: {m}% de daño y recibe +{p}% de daño 10 s.' });
sk('a15', 'arquero', 1, 4, 'Diluvio de Flechas', 'act', 104, 'a8', { mp: 100, cd: 20, icon: ['rain', '#7ad0ff'], eff: { k: 'rain', m: 1.6, mr: 0.12, n: 22, r: 20, area: 72, art: 'arrowrain' }, d: '22 flechas caen del cielo ({m}% cada una).' });
sk('a16', 'arquero', 1, 5, 'Ira del Bosque', 'act', 134, 'a15', { mp: 160, cd: 40, icon: ['root', '#8aff6a'], eff: { k: 'nova', m: 5, mr: 0.35, r: 96, root: 3, art: 'root' }, d: 'Raíces gigantes brotan: {m}% de daño y enraízan 3 s.' });
sk('a17', 'arquero', 2, 4, 'Abanico Mortal', 'act', 110, 'a12', { mp: 90, cd: 14, icon: ['multi', '#ffd040'], eff: { k: 'proj', m: 1.9, mr: 0.14, spd: 320, n: 11, spread: 2.4, art: 'arrow' }, d: 'Disparas 11 flechas en abanico ({m}% cada una).' });
sk('a18', 'arquero', 2, 5, 'Ojo de Halcón', 'act', 140, 'a17', { mp: 150, cd: 60, icon: ['eye', '#ffd040'], eff: { k: 'buff', dur: 15, st: { crit: 30, atkP: 25, aspdP: 25 }, str: { atkP: 2 } }, d: 'Durante 15 s: +30% crítico, +{atkP}% ataque y +25% velocidad.' });
sk('s13', 'asesino', 0, 4, 'Ejecución', 'act', 100, 's4', { mp: 90, cd: 14, icon: ['blink', '#ff4040'], eff: { k: 'shadow', m: 8, mr: 0.6 }, d: 'Apareces tras tu objetivo y lo ejecutas: {m}% de daño.' });
sk('s14', 'asesino', 0, 5, 'Danza Sombría', 'act', 130, 's13', { mp: 170, cd: 40, icon: ['spin', '#7a40c0'], eff: { k: 'flurry', m: 1.6, mr: 0.12, hits: 18 }, d: '18 cortes fulminantes entre las sombras ({m}% cada uno).' });
sk('s15', 'asesino', 1, 4, 'Plaga', 'act', 104, 's6', { mp: 100, cd: 22, icon: ['cloud', '#a0ff4a'], eff: { k: 'nova', m: 4, mr: 0.3, r: 92, poison: 6, art: 'poison' }, d: 'Una explosión tóxica: {m}% de daño y veneno potente.' });
sk('s16', 'asesino', 1, 5, 'Miasma', 'act', 134, 's15', { mp: 160, cd: 34, icon: ['cloud', '#6ae04a'], eff: { k: 'field', m: 1.4, mr: 0.1, r: 72, ticks: 12, poison: 6, art: 'poison', self: 1 }, d: 'Una niebla venenosa enorme a tu alrededor ({m}% por pulso).' });
sk('s17', 'asesino', 2, 4, 'Paso del Vacío', 'act', 110, 's12', { mp: 70, cd: 10, icon: ['dash', '#c070ff'], eff: { k: 'dash', dist: 140, m: 4, mr: 0.3, inv: 1 }, d: 'Atraviesas a los enemigos invulnerable: {m}% de daño en tu camino.' });
sk('s18', 'asesino', 2, 5, 'Mil Sombras', 'act', 140, 's17', { mp: 180, cd: 60, icon: ['star', '#7a40c0'], eff: { k: 'buff', dur: 15, st: { atkP: 35, crit: 25, dodge: 20 }, str: { atkP: 3 } }, d: 'Durante 15 s: +{atkP}% ataque, +25% crítico y +20% esquiva.' });
// ---------- monsters of the new lands ----------
Object.assign(MOBS, {
  escorpion: { n: 'Escorpión de Arena', art: ['scorp', 'arena'], reg: ['desierto'], lv: [96, 108], hp: 1.3, atk: 1.4, def: 1.4, spd: 46, ai: 'aggro', fam: 'escorpion', poison: 1, drops: [['aguijon', 0.4], ['escamaarena', 0.2]] },
  momia: { n: 'Momia', art: ['hum', 'momia'], reg: ['desierto'], lv: [98, 110], hp: 1.4, atk: 1.4, def: 1.2, spd: 40, ai: 'aggro', fam: 'momia', group: 3, drops: [['venda', 0.45], ['moneda_antigua', 0.15]] },
  serpiente: { n: 'Serpiente de las Dunas', art: ['snake', 'arena'], reg: ['desierto'], lv: [96, 106], hp: 1, atk: 1.5, def: 1, spd: 60, ai: 'charge', fam: 'serpiente', poison: 1, drops: [['escamaarena', 0.4]] },
  nomada: { n: 'Bandido Nómada', art: ['hum', 'nomada'], reg: ['desierto'], lv: [100, 110], hp: 1.2, atk: 1.5, def: 1.2, spd: 58, ai: 'aggro', fam: 'bandido', group: 3, drops: [['tela', 0.4], ['rubi', 0.04]] },
  hiena: { n: 'Hiena', art: ['quad', 'hiena'], reg: ['desierto'], lv: [96, 104], hp: 1, atk: 1.3, def: 1, spd: 72, ai: 'aggro', fam: 'lobo', group: 3, drops: [['piel', 0.4]] },
  slime_arena: { n: 'Slime de Arena', art: ['slime', 'arena'], reg: ['desierto'], lv: [96, 102], hp: 1, atk: 1.2, def: 1.1, spd: 40, ai: 'passive', fam: 'slime', drops: [['gel', 0.4], ['escamaarena', 0.1]] },
  jaguar: { n: 'Jaguar', art: ['quad', 'jaguar'], reg: ['selva'], lv: [106, 120], hp: 1.2, atk: 1.6, def: 1.1, spd: 78, ai: 'aggro', fam: 'felino', drops: [['pieljaguar', 0.45]] },
  planta: { n: 'Planta Carnívora', art: ['plant', ''], reg: ['selva'], lv: [106, 118], hp: 1.5, atk: 1.5, def: 1.2, spd: 8, ai: 'ranged', fam: 'planta', drops: [['savia', 0.45], ['herb9', 0.1]] },
  lagarto: { n: 'Guerrero Lagarto', art: ['hum', 'lagarto'], reg: ['selva'], lv: [110, 122], hp: 1.4, atk: 1.6, def: 1.3, spd: 56, ai: 'aggro', fam: 'lagarto', group: 3, drops: [['escamaarena', 0.2], ['plumatrop', 0.3], ['esmeralda', 0.04]] },
  arana: { n: 'Araña de la Selva', art: ['spider', 'selva'], reg: ['selva'], lv: [106, 116], hp: 1.1, atk: 1.5, def: 1, spd: 64, ai: 'aggro', fam: 'arana', poison: 1, group: 2, drops: [['seda', 0.45]] },
  serpselva: { n: 'Víbora Esmeralda', art: ['snake', 'selva'], reg: ['selva'], lv: [108, 118], hp: 1, atk: 1.6, def: 1, spd: 62, ai: 'charge', fam: 'serpiente', poison: 1, drops: [['plumatrop', 0.2], ['savia', 0.2]] },
  murciselva: { n: 'Murciélago Vampiro', art: ['bat', 'selva'], reg: ['selva'], lv: [110, 120], hp: 0.9, atk: 1.5, def: 0.9, spd: 82, ai: 'aggro', fam: 'murcielago', fly: 1, drops: [['ala', 0.4]] },
  golemcristal: { n: 'Gólem de Cristal', art: ['hum', 'golemcristal'], reg: ['cristal'], lv: [122, 136], hp: 2.3, atk: 1.6, def: 2, spd: 36, ai: 'aggro', fam: 'golem', drops: [['prisma', 0.45], ['ore10', 0.12], ['diamante', 0.03]] },
  ciervo: { n: 'Ciervo Astral', art: ['quad', 'ciervo'], reg: ['cristal'], lv: [118, 128], hp: 1.2, atk: 1.5, def: 1.2, spd: 70, ai: 'charge', fam: 'ciervo', drops: [['cuernoastral', 0.45], ['polvoestelar', 0.15]] },
  slime_cristal: { n: 'Slime Prismático', art: ['slime', 'cristal'], reg: ['cristal'], lv: [118, 126], hp: 1.1, atk: 1.4, def: 1.3, spd: 42, ai: 'aggro', fam: 'slime', drops: [['gel', 0.3], ['prisma', 0.2]] },
  prisma: { n: 'Espectro Prismático', art: ['ghost', 'prisma'], reg: ['cristal'], lv: [122, 134], hp: 1.1, atk: 1.7, def: 1.1, spd: 50, ai: 'ranged', fam: 'fantasma', drops: [['polvoestelar', 0.4]] },
  aranacristal: { n: 'Araña de Cristal', art: ['spider', 'cristal'], reg: ['cristal'], lv: [120, 130], hp: 1.2, atk: 1.6, def: 1.4, spd: 62, ai: 'aggro', fam: 'arana', group: 2, drops: [['seda', 0.3], ['prisma', 0.2]] },
  escorpcristal: { n: 'Escorpión de Cuarzo', art: ['scorp', 'cristal'], reg: ['cristal'], lv: [124, 136], hp: 1.4, atk: 1.7, def: 1.6, spd: 46, ai: 'aggro', fam: 'escorpion', drops: [['prisma', 0.3], ['aguijon', 0.2]] },
  plantacristal: { n: 'Flor de Cuarzo', art: ['plant', 'cristal'], reg: ['cristal'], lv: [120, 132], hp: 1.5, atk: 1.6, def: 1.4, spd: 8, ai: 'ranged', fam: 'planta', drops: [['herb10', 0.25], ['polvoestelar', 0.2]] },
  caballero_e: { n: 'Caballero del Eclipse', art: ['hum', 'caballero_eclipse'], reg: ['eclipse'], lv: [134, 150], hp: 1.9, atk: 1.8, def: 1.8, spd: 54, ai: 'aggro', fam: 'caballero', group: 2, drops: [['placaumbria', 0.4], ['ore11', 0.12], ['piedra3', 0.02]] },
  demonio: { n: 'Demonio Umbrío', art: ['hum', 'demonio'], reg: ['eclipse'], lv: [138, 150], hp: 2, atk: 1.9, def: 1.6, spd: 52, ai: 'aggro', fam: 'demonio', drops: [['cuernodemonio', 0.45], ['esenciaeclipse', 0.15]] },
  bestia: { n: 'Bestia del Vacío', art: ['quad', 'vacio'], reg: ['eclipse'], lv: [130, 144], hp: 1.4, atk: 1.8, def: 1.3, spd: 76, ai: 'charge', fam: 'lobo', drops: [['esenciaeclipse', 0.3], ['ojovacio', 0.06]] },
  sombra: { n: 'Sombra Errante', art: ['ghost', 'sombra'], reg: ['eclipse'], lv: [132, 146], hp: 1.1, atk: 1.8, def: 1.1, spd: 54, ai: 'ranged', fam: 'fantasma', drops: [['esenciaeclipse', 0.35]] },
  murcieclipse: { n: 'Murciélago del Eclipse', art: ['bat', 'eclipse'], reg: ['eclipse'], lv: [130, 140], hp: 0.9, atk: 1.6, def: 1, spd: 84, ai: 'aggro', fam: 'murcielago', fly: 1, drops: [['ala', 0.3], ['esenciaeclipse', 0.12]] },
  slime_eclipse: { n: 'Slime del Vacío', art: ['slime', 'eclipse'], reg: ['eclipse'], lv: [130, 138], hp: 1.1, atk: 1.5, def: 1.3, spd: 42, ai: 'aggro', fam: 'slime', drops: [['gel', 0.3], ['esenciaeclipse', 0.15]] },
});
Object.assign(BOSSES, {
  kragg: { n: 'Kragg, Rey Cangrejo', lv: 14, art: ['crab', 2.4], hp: 34, atk: 1.4, def: 1.6, spd: 30, moves: ['slam', 'charge', 'summon'], minion: 'cangrejo', acc: 'acc_kragg', drops: [['caparazon', 1, 6], ['piedra1', 1, 2]], r: 26 },
  colmillo: { n: 'Colmilloférreo', lv: 22, art: ['quad', 'jabali_rey'], hp: 34, atk: 1.5, def: 1.4, spd: 60, moves: ['charge', 'slam', 'charge', 'hop'], acc: 'acc_colmillo', drops: [['colmillo', 1, 6], ['piedra1', 1, 3]], r: 26 },
  renegado: { n: 'Sir Aldric, el Renegado', lv: 28, art: ['hum', 'renegado'], hp: 30, atk: 1.6, def: 1.6, spd: 50, moves: ['charge', 'slam', 'volley', 'summon'], minion: 'bandido', acc: 'acc_renegado', drops: [['tela', 1, 6], ['piedra1', 1, 3]], r: 24 },
  sahrak: { n: 'Sahrak, Rey Escorpión', lv: 108, art: ['scorp', 'rey', 2.3], hp: 24, atk: 2.1, def: 2, spd: 44, moves: ['charge', 'volley', 'field', 'summon'], minion: 'escorpion', acc: 'acc_sahrak', drops: [['aguijon', 1, 8], ['piedra2', 1, 3]], r: 32 },
  yarak: { n: 'Yarak, el Gran Simio', lv: 120, art: ['hum', 'simio'], hp: 26, atk: 2.2, def: 2, spd: 56, moves: ['slam', 'charge', 'rain', 'summon'], minion: 'jaguar', acc: 'acc_yarak', drops: [['pieljaguar', 1, 8], ['piedra2', 1, 4]], r: 30 },
  coloso: { n: 'Coloso de Cristal', lv: 134, art: ['hum', 'coloso'], hp: 22, atk: 2.3, def: 2.0, spd: 34, moves: ['rain', 'nova', 'slam', 'volley'], acc: 'acc_coloso', drops: [['prisma', 1, 8], ['piedra3', 1, 1]], r: 32 },
  eclipsor: { n: 'Señor del Eclipse', lv: 148, art: ['hum', 'eclipsor'], hp: 26, atk: 2.3, def: 2.1, spd: 58, moves: ['charge', 'slam', 'rain', 'nova', 'summon', 'volley', 'breath'], minion: 'caballero_e', acc: 'acc_eclipsor', drops: [['esenciaeclipse', 1, 10], ['piedra3', 1, 2]], r: 32 },
});
const BOSS_COS = { reyslime: ['c_sombrero_slime'], ent: ['c_flores', 'c_tunica_druida'], gruk: ['c_pieles_orco'], morgana: ['c_bruja'], vael: ['c_armadura_vael'], golemhielo: ['c_vestido_hielo'], ignaroth: ['c_yelmo_draco', 'c_armadura_draco', 'c_alas_draco'], desatado: ['c_cuernos', 'c_alas_demonio'], kragg: ['c_pirata'], sahrak: ['c_arena', 'c_bombacho'], yarak: ['c_selva', 'c_capa_hojas'], coloso: ['c_halo', 'c_alas_angel'], eclipsor: ['c_eclipse', 'c_capa_eclipse'], renegado: ['c_capa_real'] };
for (const b in BOSS_COS) { BOSSES[b].cos = BOSS_COS[b]; for (const c of BOSS_COS[b]) if (COSM[c]) COSM[c].src = BOSSES[b].n; }
// enemies drop enhancement stones and gems now and then
for (const id in MOBS) { const m = MOBS[id], top = m.lv[1]; m.drops = m.drops || []; m.drops.push([top >= 100 ? 'piedra2' : 'piedra1', top >= 100 ? 0.025 : 0.02]); if (top >= 20) m.drops.push([top >= 120 ? 'diamante' : top >= 80 ? 'amatista' : top >= 50 ? 'esmeralda' : top >= 30 ? 'zafiro' : 'rubi', 0.012]); }
// level-gated region tiers for excavation loot
const DIG_LOOT = [[1, [['moneda_antigua', 50], ['reliquia1', 18], ['rubi', 8], ['piedra1', 10], ['ore1', 14]]], [24, [['moneda_antigua', 40], ['reliquia1', 20], ['reliquia2', 6], ['zafiro', 8], ['esmeralda', 4], ['piedra1', 12], ['tinte', 10]]],
  [56, [['reliquia1', 20], ['reliquia2', 14], ['reliquia3', 4], ['amatista', 8], ['diamante', 2], ['piedra2', 8], ['tinte', 10]]], [100, [['reliquia2', 20], ['reliquia3', 12], ['reliquia4', 3], ['diamante', 6], ['opalo', 2], ['piedra2', 10], ['piedra3', 2], ['pergamino_xp', 4]]]];
