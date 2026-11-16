const JP_CONCERT_WARDROBE = {
  jp_miku: ['jp_miku', 'miku_neon', 'miku_maid'],
  jp_teto: ['jp_teto', 'teto_gotica'],
};
const JP_VARIANT_ATLASES = new Map();
const JP_DIALOG_PORTRAITS = new Map();

function jpChooseConcertWardrobe() {
  return Object.fromEntries(Object.entries(JP_CONCERT_WARDROBE)
    .map(([id, options]) => [id, options[Math.floor(Math.random() * options.length)]]));
}

function jpVariantAtlas(id) {
  if (JP_VARIANT_ATLASES.has(id)) return JP_VARIANT_ATLASES.get(id);
  const fw = 42, fh = 40;
  const img = mkCanvas(6 * fw, 4 * fh), g = img.getContext('2d');
  g.imageSmoothingEnabled = false;
  const atlas = { img, fw, fh, ax: 21, ay: 36, idx: { idle: 0, walk: 2 }, ready: false };
  JP_VARIANT_ATLASES.set(id, atlas);
  const source = new Image();
  source.onload = () => {
    for (let row = 0; row < 4; row++) for (let col = 0; col < 6; col++) {
      const step = col >= 2 ? [0, -1, 0, -1][col - 2] : 0;
      g.drawImage(source, 0, row * fh, fw, fh, col * fw, row * fh + step, fw, fh);
    }
    atlas.ready = true;
  };
  source.src = JP_NEW_SPRITES[id];
  return atlas;
}

function jpDanceAtlas(id) {
  const key = jpGuestShow.wardrobe[id];
  const replacement = JP_NEW_SPRITES[key] && jpVariantAtlas(key);
  return replacement?.ready ? replacement : STELLA_NPC_ATLAS(id);
}

function jpGuestDance(t, i) {
  const beat = t * 2.8 + i * 0.18;
  const phrase = Math.floor(t / 4) % 3;
  const wave = Math.sin(beat * Math.PI);
  return {
    shift: wave * [8, 12, 5][phrase],
    lift: Math.round(Math.max(0, Math.sin(beat * Math.PI * 2)) * [3, 7, 5][phrase]),
    tilt: wave * [.07, .15, .105][phrase],
    frame: Math.floor(beat * 2) % ANIMS.walk[1],
  };
}

NPCS.jp_neru = {
  n: 'Akita Neru', title: L2('Cantante virtual', 'Virtual singer'),
  look: LK({ g: 'f' }), quests: [],
  lines: [
    L2('¿Miku y Teto ya empezaron? Avísame cuando llegue el dúo.', 'Have Miku and Teto started? Tell me when they get to the duet.'),
    L2('Un segundo, estoy respondiendo un mensaje.', 'One second, I’m replying to a message.'),
  ],
};

{
  const previous = npcAtlas;
  npcAtlas = function (id) {
    return id === 'jp_neru' ? jpVariantAtlas(id) : previous.apply(this, arguments);
  };
}

function jpDrawDialoguePortrait(npc) {
  const costume = jpGuestShow?.wardrobe[npc.id] || (G.P?.partner === npc.id ? G.P.pOut : null);
  const key = JP_NEW_PORTRAITS[costume] ? costume : npc.id;
  if (!JP_NEW_PORTRAITS[key]) return;
  const active = dlg;
  const draw = (image) => {
    if (dlg !== active) return;
    const canvas = $('#dport'), g = canvas.getContext('2d');
    g.clearRect(0, 0, canvas.width, canvas.height);
    g.imageSmoothingEnabled = false;
    g.drawImage(image, 0, 0, canvas.width, canvas.height);
  };
  let image = JP_DIALOG_PORTRAITS.get(key);
  if (!image) {
    image = new Image();
    JP_DIALOG_PORTRAITS.set(key, image);
    image.src = JP_NEW_PORTRAITS[key];
  }
  if (image.complete && image.naturalWidth) draw(image);
  else image.addEventListener('load', () => draw(image), { once: true });
}

{
  const previous = openDialog;
  openDialog = function (npc) {
    const result = previous.apply(this, arguments);
    if (dlg?.npc === npc) jpDrawDialoguePortrait(npc);
    return result;
  };
}

const JP_NERU_GOLD = pal(['#805018', '#a86d19', '#edab27', '#ffd250', '#ffed9a']);
const JP_NERU_VEST = pal(['#292627', '#423e3b', '#65605b', '#8b847b', '#b7aea0']);
const JP_NERU_DARK = pal(['#17131b', '#282124', '#423632', '#5c4c3c', '#857057']);

fitKind('legs', 'id_neru_legs', (p, A, s) => {
  if (A.fem) {
    FITK.legs.id_diva_f.draw(p, A, s);
    return;
  }
  for (let x = A.tx0; x < A.tx0 + A.tw; x++) {
    if (uA(p.get(x, A.legTop))) p.set(x, A.legTop, JP_NERU_GOLD[2]);
  }
}, { skin: true });

const JP_NERU_OUTFIT = [
  ['c_neru_chaleco', 'body', L2('Chaleco de Neru', 'Neru’s vest'),
    () => ({ k: 'id_diva', m: JP_NERU_VEST, a: JP_NERU_GOLD, sl: 'det' })],
  ['c_neru_piernas', 'legs', L2('Parte inferior de Neru', 'Neru’s bottoms'),
    () => ({ k: 'id_neru_legs', m: JP_NERU_DARK, a: JP_NERU_GOLD })],
  ['c_neru_botas', 'feet', L2('Botas de Neru', 'Neru’s boots'),
    () => ({ k: 'boots', m: JP_NERU_DARK })],
];
for (const [id, slot, name, look] of JP_NERU_OUTFIT) {
  cosm(id, name, slot, look, { src: L2('Regalo de Akita Neru, Akihabara', 'Gift from Akita Neru, Akihabara') });
}

DLG_HOOKS.push((npc, opts) => {
  if (npc.id !== 'jp_neru' || !G.P || G.map?.id !== 'japon') return;
  const player = G.P;
  const missing = () => JP_NERU_OUTFIT.map(([id]) => id)
    .filter(id => !(player.wardrobe || []).includes(id));
  if (!missing().length) return;
  opts.push({
    label: L2('Aceptar el traje de Neru', 'Accept Neru’s outfit'),
    icon: ['hanger'],
    fn: () => {
      if (G.P !== player || G.map?.id !== 'japon') return;
      const pieces = missing();
      if (!pieces.length) return;
      player.wardrobe = [...(player.wardrobe || []), ...pieces];
      markDirty(true);
      typeText(L2('Ya lo tienes en tu Armario. ¡Cuídalo!', 'It’s in your Wardrobe now. Take care of it!'));
    },
  });
});

const RUKIA_STYLE = { n: 'Flequillo Rukia', cap: 'rukia', bang: 'none', side: 0, back: 0 };
HS_F.push(RUKIA_STYLE);
HS_M.push(RUKIA_STYLE);

function drawRukiaHair(p, dir, hx, hy, rx, ry, hair) {
  const shapes = dir === 'down' ? RUKIA_PIXELS.front : dir === 'up' ? RUKIA_PIXELS.back : RUKIA_PIXELS.profile;
  const palette = [uMul(hair[0], .53), uMul(hair[1], .76), hair[1], hair[2], hair[3]];
  const flip = dir === 'right' ? -1 : 1;
  for (const [color, points] of shapes) {
    p.poly(points.map(([x, y]) => [
      hx + x * rx * .91 / 15 * flip,
      hy + y * ry * .87 / 16,
    ]), palette[color]);
  }
}
