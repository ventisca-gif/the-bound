// Invitadas de STELLA☆LINK. El concierto especial se inicia hablando con Akane.
NPCS.jp_teto = {
  n: 'Kasane Teto',
  title: L2('Cantante virtual invitada', 'Guest virtual singer'),
  look: LK({ g: 'f' }),
  lines: [
    L2('Te-to, ra-ri-ru! [¡Hola! ¿Ya tienes tu barra de luz?]', 'Te-to, ra-ri-ru! [Hi! Got your penlight yet?]'),
    L2('Pi-po, ta-ta-tán! [Cuando suene el primer compás, mira al escenario.]', 'Pi-po, ta-ta-tan! [When the first beat drops, look at the stage.]'),
    L2('La-la, te-to-mi-ku! [¡Nos vemos en el dúo!]', 'La-la, te-to-mi-ku! [See you at the duet!]'),
  ],
  quests: [],
};

function jpTetoAtlas() {
  const img = mkCanvas(252, 160);
  const g = img.getContext('2d');
  const pixels = g.createImageData(img.width, img.height);
  const palette = atob(JP_TETO_PALETTE), runs = atob(JP_TETO_RUNS);
  let offset = 0;
  for (let i = 0; i < runs.length; i += 2) {
    const count = runs.charCodeAt(i), color = runs.charCodeAt(i + 1);
    const end = offset + count * 4;
    if (color) {
      const rgb = (color - 1) * 3;
      for (let j = offset; j < end; j += 4) {
        pixels.data[j] = palette.charCodeAt(rgb);
        pixels.data[j + 1] = palette.charCodeAt(rgb + 1);
        pixels.data[j + 2] = palette.charCodeAt(rgb + 2);
        pixels.data[j + 3] = 255;
      }
    }
    offset = end;
  }
  g.putImageData(pixels, 0, 0);
  return { img, fw: 42, fh: 40, idx: { idle: 0, walk: 2 }, ax: 21, ay: 36 };
}

const JP_GUEST_ROOM = 'jp_live_in';
const JP_GUEST_DURATION = 185.365;
let jpGuestShow = null;

{
  const previousAtlas = npcAtlas, previousLive = makeLive;
  npcAtlas = function (id) {
    return id === 'jp_teto' ? getAtlas('npc_jp_teto', jpTetoAtlas) : previousAtlas.apply(this, arguments);
  };
  makeLive = function () {
    const existing = G.maps[JP_GUEST_ROOM];
    const room = previousLive.apply(this, arguments);
    if (!existing) spawnNPC('jp_teto', 18 * 16 + 8, 16 * 16 + 8, room.id, { wander: 1 });
    return room;
  };
  const regularLiveOn = liveOn, regularGroup = jpLiveGroup;
  liveOn = () => (jpGuestShow && G.map?.id === JP_GUEST_ROOM) || regularLiveOn();
  jpLiveGroup = function (next) {
    if (!next && jpGuestShow && G.map?.id === JP_GUEST_ROOM) {
      return { name: 'MIKU × TETO', guest: true };
    }
    return regularGroup(next);
  };
  const previousVolumes = applyVolumes;
  applyVolumes = function () {
    previousVolumes();
    if (jpGuestShow && mGain) mGain.gain.value = 0;
  };
}

function jpGuestStop() {
  const show = jpGuestShow;
  if (!show) return;
  jpGuestShow = null;
  show.audio.pause();
  for (const npc of show.guests) { npc.map = JP_GUEST_ROOM; npc.scene = 0; }
  applyVolumes();
}

function jpGuestStart() {
  if (jpGuestShow || G.map?.id !== JP_GUEST_ROOM) return;
  const audio = new Audio(JP_GUEST_TRACK);
  const guests = G.ents.filter(e => !e.scene && e.map === JP_GUEST_ROOM && ['jp_miku', 'jp_teto'].includes(e.id));
  const show = { audio, guests, room: G.map, start: performance.now(), wardrobe: jpChooseConcertWardrobe() };
  jpGuestShow = show;
  for (const npc of guests) { npc.map = '_jp_guest_stage'; npc.scene = 1; }
  audio.volume = clamp(SETTINGS.music, 0, 1);
  audio.addEventListener('ended', () => { if (jpGuestShow === show) jpGuestStop(); }, { once: true });
  audio.play().then(() => {
    if (jpGuestShow === show) applyVolumes();
    else audio.pause();
  }).catch(() => {
    if (jpGuestShow !== show) return;
    jpGuestStop();
    xMsg('♪', L2('No se pudo iniciar el audio. Puedes volver a intentarlo con Akane.', 'Audio could not start. You can try again with Akane.'));
  });
}

DLG_HOOKS.push((npc, opts) => {
  if (npc.id !== 'jp_prod' || G.map?.id !== JP_GUEST_ROOM) return;
  opts.push({
    label: jpGuestShow ? L2('Terminar actuación', 'End performance') : L2('Ver concierto de Miku y Teto', 'Watch Miku and Teto'),
    fn: () => {
      closeDialog();
      if (jpGuestShow) jpGuestStop();
      else jpGuestStart();
    },
  });
});

V33_TICKS.push(() => {
  if (!jpGuestShow) return;
  if (G.map !== jpGuestShow.room || performance.now() - jpGuestShow.start > (JP_GUEST_DURATION + 8) * 1000) {
    jpGuestStop();
    return;
  }
  jpGuestShow.audio.volume = clamp(SETTINGS.music, 0, 1);
});

DL_HOOKS.push(list => {
  if (!jpGuestShow || G.map !== jpGuestShow.room) return;
  const t = jpGuestShow.audio.currentTime;
  const artists = t < 50 ? ['jp_miku'] : t < 100 ? ['jp_teto'] : ['jp_miku', 'jp_teto'];
  artists.forEach((id, i) => {
    const atlas = jpDanceAtlas(id), dance = jpGuestDance(t, i);
    const x = (artists.length === 1 ? 248 : 216 + i * 64) + dance.shift;
    const y = 108;
    const frame = atlas.idx.walk + dance.frame;
    list.push({ type: 'xdraw', x, y, noShadow: true, draw: (e, cx, cy) => {
      const sx = Math.round(x - cx), sy = y - cy;
      ctx.drawImage(shadowSprite(8, 2), sx - 8, sy - 2);
      ctx.save();
      ctx.translate(sx, sy - dance.lift);
      ctx.rotate(dance.tilt);
      if (!jpDanceHDFrame(id, dance.frame, 0, 0)) {
        atlasBlit(ctx, atlas, frame, DIRI.down, -atlas.ax, -atlas.ay, atlas.fw, atlas.fh);
      }
      ctx.restore();
    } });
  });
});

// Usa las mismas prendas ajustables de Diva Virtual con la paleta de Teto.
const JP_TETO_PRICE = 32000;
const JP_TETO_ACCENT = pal(['#631533', '#a82049', '#de3663', '#ff6389', '#ffadc0']);
const JP_TETO_CLOTH = pal(['#131c2b', '#25344a', '#3c4e65', '#556a80', '#8091a6']);
const JP_TETO_OUTFIT = [
  ['c_teto_chaleco', 'body', L2('Chaleco de Teto', 'Teto’s vest'),
    () => ({ k: 'id_diva', m: JP_TETO_CLOTH, a: JP_TETO_ACCENT, sl: 'det' })],
  ['c_teto_falda', 'legs', L2('Falda de Teto', 'Teto’s skirt'),
    () => ({ k: 'id_diva_f', m: IDP.negro, a: JP_TETO_ACCENT })],
  ['c_teto_botas', 'feet', L2('Botas de Teto', 'Teto’s boots'),
    () => ({ k: 'boots', m: IDP.negro })],
];

for (const [id, slot, name, look] of JP_TETO_OUTFIT) {
  cosm(id, name, slot, look, {
    src: L2('Kasane Teto · STELLA☆LINK, Akihabara', 'Kasane Teto · STELLA☆LINK, Akihabara'),
  });
}

DLG_HOOKS.push((npc, opts) => {
  if (npc.id !== 'jp_teto' || jpGuestShow || G.map?.id !== JP_GUEST_ROOM || !G.P) return;
  const P = G.P;
  const missing = () => JP_TETO_OUTFIT.filter(([id]) => !(P.wardrobe || []).includes(id));
  opts.push({
    label: missing().length
      ? L2('Comprar mi traje · ', 'Buy my outfit · ') + fmt(JP_TETO_PRICE) + L2(' oro', ' gold')
      : L2('¿Dónde quedó mi traje?', 'Where is my outfit?'),
    icon: ['hanger'],
    fn: () => {
      if (jpGuestShow || G.P !== P || G.map?.id !== JP_GUEST_ROOM) return;
      const parts = missing();
      if (!parts.length) {
        typeText(L2('¡Ya tienes mi traje! Puedes equiparlo desde el Armario.', 'You already have my outfit! Equip it from the Wardrobe.'));
        return;
      }
      if (P.gold < JP_TETO_PRICE) {
        typeText(L2('Te falta oro para el traje completo.', 'You need more gold for the full outfit.'));
        return;
      }
      P.gold -= JP_TETO_PRICE;
      P.wardrobe = [...(P.wardrobe || []), ...parts.map(([id]) => id)];
      markDirty(true);
      sfx('coin');
      typeText(L2('¡Te queda genial! El chaleco, la falda y las botas están en tu Armario.',
        'It looks great on you! The vest, skirt and boots are in your Wardrobe.'));
    },
  });
});
