// The human form shares Warrior's equipment progression. The fire form uses unarmed combat.
CLASSES.transmutador = {
  ...CLASSES.guerrero, n: 'Transmutador', color: '#8ed344',
  desc: L2('Usa un dispositivo de muñeca para adoptar una forma de fuego.', 'Use a wrist device to take on a fire form.')
};
BR.transmutador = ['Forma', 'Combate', 'Control'];
for (const [id, item] of Object.entries(ITEMS)) {
  if (!/^w_guerrero_\d+$/.test(id)) continue;
  const newId = id.replace('guerrero', 'transmutador');
  ITEMS[newId] = { ...item, id: newId, cls: 'transmutador' };
  const recipe = RECIPES.find(r => r.out === id);
  if (recipe) RECIPES.push({ ...recipe, id: recipe.id + '_tm', out: newId });
}
hookAfter('newPlayer', P => {
  if (P.cls === 'transmutador') P.app.tmOutfit = true;
});
hookAround('appEditorHTML', (next, app, tabs) => {
  const html = next(app, tabs);
  const cls = (G.P?.cls ?? CC.cls) === 'transmutador';
  return cls && edTab === 'ropa' ? html + '<button class="chip" data-tm-outfit>Alternar atuendo del Transmutador</button>' : html;
});
hookAfter('bindAppEditor', (_, root, app, onChange) => {
  const button = root.querySelector('[data-tm-outfit]');
  if (button) button.onclick = () => { app.tmOutfit = app.tmOutfit === false; onChange(true); };
});
const tmImage = new Image();
const tmTechniques = [
  ['Bola de fuego', 2.5, 0.045, 1.65],
  ['Abanico ardiente', 6, 0.075, 0.72],
  ['Puño volcánico', 8, 0.09, 2.35],
  ['Anillo ígneo', 13, 0.13, 2.6],
  ['Lluvia de brasas', 20, 0.17, 1.15]
];
function tmActive(P) { return P?.cls === 'transmutador' && P.tmFire; }
function tmAtlas() {
  return getAtlas('transmutador:fire', () => {
    const draw = (p, L, dir, anim, f) => {
      const row = DIRS.indexOf(dir);
      const col = anim === 'walk' ? [0, 1, 2, 1][f % 4] : anim === 'atk' ? (f ? 4 : 3) : anim === 'cast' ? 4 : 1;
      const canvas = mkCanvas(48, 48), x = canvas.getContext('2d');
      x.drawImage(tmImage, col * 48, row * 48, 48, 48, 0, 0, 48, 48);
      p.d.set(new Uint32Array(x.getImageData(0, 0, 48, 48).data.buffer));
    };
    return buildAtlas({ mirror: false }, HERO_ANIMS, draw);
  });
}
hookAround('playerAtlas', (next, P) => tmActive(P) && tmImage.naturalWidth ? tmAtlas() : next(P));
function tmToggle(P) {
  if (P.dead || P.job || P.fishing || P.busy > 0 || P.dawnHelm || !tmImage.naturalWidth) return;
  P.tmFire = !P.tmFire;
  refreshLook();
  burst(P.x, P.y - 10, 18, { sp: 70, up: 25, life: 0.4, c: ['#ff571c', '#ffd567'] });
}
function tmAttack(P, i) {
  if (P.dead || P.job || P.fishing || P.busy > 0 || P.dawnHelm) return;
  const technique = tmTechniques[i], key = 'tm_fire_' + i;
  if (technique) {
    const cost = Math.ceil(P.S.maxmp * technique[2]);
    if (P.cds[key] > 0 || P.mp < cost) return;
    P.cds[key] = technique[1];
    P.mp -= cost;
  } else {
    if (P.atkCd > 0) return;
    P.atkCd = P.S.aspd;
  }
  const target = nearestMob(P.x, P.y, i < 0 || i === 2 ? 48 : 160);
  if (target) P.dir = dirFromVec(target.x - P.x, target.y - P.y);
  const [dx, dy] = DIRV[P.dir], angle = Math.atan2(dy, dx);
  const damage = (P.S.atk * 0.9 + P.lv * 0.65) * (technique ? technique[3] * (1 + P.S.skillP / 100) : 0.88);
  const map = G.map;
  setAnim(P, i >= 3 ? 'cast' : 'atk');
  P.loopAnim = false;
  P.busy = 0.3;
  P.combatT = G.t;
  const fire = { fire: 1, burn: technique ? 1 : 0 };
  const impact = (x, y, radius) => {
    hitCircle(x, y, radius, damage, fire);
    addFx({ type: 'ring', x, y, r: radius, dur: 0.35, col: '#ff812a' });
    burst(x, y - 6, 13, { sp: 84, up: 28, life: 0.42, c: ['#ff4e15', '#ffb62a', '#fff4a0'] });
  };
  const later = (seconds, action) => delayAct(seconds, () => {
    if (G.P === P && G.map === map && !P.dead && tmActive(P)) action();
  });
  if (i === 0 || i === 1) {
    const offsets = i === 0 ? [0] : [-0.31, 0, 0.31];
    later(0.08, () => {
      for (const offset of offsets) spawnProj('p', P.x, P.y - 6, angle + offset,
        { ...fire, spd: 215, dmg: damage, art: 'fire', ex: i === 0 ? 19 : 0, life: 0.8 });
    });
  } else if (i === 4) {
    const x = target?.x ?? P.x + dx * 62, y = target?.y ?? P.y + dy * 62;
    for (const [j, ox, oy] of [[0, -19, 6], [1, 16, 10], [2, 0, -13]]) {
      later(0.13 + j * 0.13, () => addFx({ type: 'fall', x: x + ox, y: y + oy, art: 'meteor', dur: 0.28 }));
      later(0.41 + j * 0.13, () => impact(x + ox, y + oy, 23));
    }
  } else if (i === 3) later(0.12, () => impact(P.x, P.y, 55));
  else if (i === 2) later(0.1, () => impact(P.x + dx * 25, P.y + dy * 22, 22));
  else later(0.08, () => {
    hitArc(P.x, P.y, angle, 29, 1.7, damage, fire);
    burst(P.x + dx * 17, P.y + dy * 14 - 5, 5, { sp: 35, life: 0.24, c: ['#ff7523', '#ffd363'] });
  });
  sfx('fire');
}
hookBefore('basicAttack', () => { if (tmActive(G.P)) { tmAttack(G.P, -1); return HOOK_SKIP; } });
hookBefore('useSkill', slot => { if (tmActive(G.P)) { if (tmTechniques[slot]) tmAttack(G.P, slot); return HOOK_SKIP; } });
hookAfter('playerDie', () => {
  if (tmActive(G.P)) { G.P.tmFire = false; refreshLook(); }
});
hookAfter('updateHUD', () => {
  const P = G.P;
  let controls = document.getElementById('tmControls');
  if (P?.cls !== 'transmutador') { controls?.remove(); return; }
  if (!controls) {
    controls = document.createElement('div');
    controls.id = 'tmControls';
    controls.style.cssText = 'position:fixed;z-index:7;left:50%;bottom:15%;transform:translateX(-50%);display:flex;flex-wrap:wrap;justify-content:center;gap:4px;width:max-content;max-width:75vw';
    const toggle = document.createElement('button');
    toggle.className = 'chip';
    toggle.onclick = () => tmToggle(G.P);
    controls.append(toggle);
    tmTechniques.forEach(([name], i) => {
      const button = document.createElement('button');
      button.className = 'chip';
      button.setAttribute('aria-label', name);
      button.title = name;
      const icon = new Image(30, 30);
      icon.src = TM_ICONS[i];
      icon.alt = '';
      icon.style.cssText = 'vertical-align:middle;image-rendering:pixelated';
      button.append(icon, document.createElement('span'));
      button.onclick = () => { if (tmActive(G.P)) tmAttack(G.P, i); };
      controls.append(button);
    });
    document.getElementById('hud').append(controls);
    tmImage.src = TM_SHEET;
  }
  controls.hidden = !!P.dead;
  controls.style.display = P.dead ? 'none' : 'flex';
  controls.firstChild.textContent = tmActive(P) ? 'Volver a forma humana' : 'Transformar · Fuego';
  tmTechniques.forEach(([name], i) => {
    const button = controls.children[i + 1], cd = Math.ceil(P.cds['tm_fire_' + i] || 0);
    button.hidden = !tmActive(P);
    button.disabled = cd > 0 || P.mp < Math.ceil(P.S.maxmp * tmTechniques[i][2]);
    button.lastChild.textContent = cd ? ' ' + cd : '';
  });
});
