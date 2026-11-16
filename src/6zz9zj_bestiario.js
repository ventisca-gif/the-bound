// Reemplazos visuales por entrada. El arte anterior conserva sus medidas para el combate.
const BESTIARY_ART = new WeakMap();
for (const id of Object.keys(BESTIARY_SPRITES)) {
  const mob = MOBS[id] || BOSSES[id];
  BESTIARY_ART.set(mob.art, id);
}

function bestiaryAtlas(id, original, humanoid) {
  const [fw, fh, palette64, runs64] = BESTIARY_SPRITES[id];
  const strip = mkCanvas(fw, fh * 4), s = strip.getContext('2d');
  const pixels = s.createImageData(fw, fh * 4);
  const palette = atob(palette64), runs = atob(runs64);
  let pos = 0;
  for (let i = 0; i < runs.length; i += 2) {
    const end = pos + runs.charCodeAt(i) * 4;
    const index = runs.charCodeAt(i + 1);
    if (index) {
      const rgb = (index - 1) * 3;
      for (let j = pos; j < end; j += 4) {
        pixels.data[j] = palette.charCodeAt(rgb);
        pixels.data[j + 1] = palette.charCodeAt(rgb + 1);
        pixels.data[j + 2] = palette.charCodeAt(rgb + 2);
        pixels.data[j + 3] = 255;
      }
    }
    pos = end;
  }
  s.putImageData(pixels, 0, 0);

  const anims = humanoid ? ANIMS : MOBANIM;
  const states = ['idle', 'walk', 'atk', 'hurt'];
  const count = Math.max(...states.map(a => anims[a][0] + anims[a][1]));
  const img = mkCanvas(fw * count, fh * 4), g = img.getContext('2d');
  g.imageSmoothingEnabled = false;
  const idx = {};
  const slime = id.startsWith('slime') || id === 'reyslime';
  const shifts = { idle: [0, 1], walk: [0, 2, 1, 2], atk: [0, 4, 2, 0], hurt: [0] };
  for (const a of states) {
    const [first, frames] = anims[a];
    idx[a] = first;
    for (let row = 0; row < 4; row++) for (let f = 0; f < frames; f++) {
      const lift = shifts[a][f];
      const squash = slime ? (a === 'hurt' ? 4 : a === 'atk' && f === 0 ? 3 : f % 2 ? -2 : 0) : 0;
      const sway = a === 'walk' && (row === 0 || row === 3) ? [0, -1, 0, 1][f] : 0;
      g.drawImage(strip, 0, row * fh, fw, fh, (first + f) * fw + sway, row * fh + squash - lift, fw, fh - squash);
    }
  }
  return { img, fw, fh, idx, ax: fw >> 1, ay: fh - 3, combatWidth: original.fw };
}

{
  const previous = mobAtlasFor;
  mobAtlasFor = function (art) {
    const id = BESTIARY_ART.get(art);
    if (!id) return previous(art);
    return getAtlas('bestiary:' + id, () => bestiaryAtlas(id, previous(art), art[0] === 'hum'));
  };
}
