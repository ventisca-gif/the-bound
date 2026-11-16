// Las invitadas usan los mismos niveles de relación y el mismo Armario que las demás parejas.
const STELLA_PARTNER_OUTFITS = {
  jp_miku: ['normal', 'miku_neon', 'miku_maid'],
  jp_teto: ['normal', 'teto_gotica'],
};

PT_SETS.miku_neon = { n: L2('Miku neón', 'Neon Miku') };
PT_SETS.miku_maid = { n: L2('Miku maid', 'Maid Miku') };
PT_SETS.teto_gotica = { n: L2('Teto gótica', 'Goth Teto') };

ROM.jp_miku = { g: 'f', loves: ['crystal', 'bouquet'], likes: ['cake', 'gem', 'amulet'], hates: ['bone', 'ore'],
  taste: L2('los cristales y las flores', 'crystals and flowers') };
ROM.jp_teto = { g: 'f', loves: ['cake', 'bouquet'], likes: ['crystal', 'gem', 'ring'], hates: ['bone', 'ore'],
  taste: L2('los pasteles y las flores', 'cakes and flowers') };
for (const id of Object.keys(STELLA_PARTNER_OUTFITS)) ROM_WHERE[id] = 'STELLA☆LINK, Akihabara';

function stellaPartnerAtlas(id, outfit = 'normal') {
  const base = STELLA_NPC_ATLAS(id);
  const variant = outfit !== 'normal' ? jpVariantAtlas(outfit) : null;
  if (variant && !variant.ready) return stellaPartnerAtlas(id);
  const source = variant || base;
  return getAtlas('stella-social:' + id + ':' + outfit, () => {
    const { fw, fh, ax, ay } = source;
    const img = mkCanvas(fw * 10, fh * 4), c = img.getContext('2d');
    c.imageSmoothingEnabled = false;
    c.drawImage(source.img, 0, 0);
    for (let row = 0; row < 4; row++) {
      const toward = row === 1 ? -1 : row === 2 ? 1 : 0;
      const face = c.getImageData(0, row * fh, fw, fh).data;
      for (let col = 6; col < 10; col++) {
        const shift = col % 2 ? toward * 2 : toward, left = col * fw + shift;
        c.save();
        c.beginPath();
        c.rect(col * fw, row * fh, fw, fh);
        c.clip();
        c.drawImage(source.img, 0, row * fh, fw, fh, left, row * fh, fw, fh);
        if (col >= 8 && row !== 3) {
          c.fillStyle = 'rgba(255,98,145,.7)';
          for (let y = 8; y < 21; y++) for (let x = 11; x < 31; x++) {
            if (toward && (x - 21) * toward < 0) continue;
            const i = (y * fw + x) * 4;
            if (face[i + 3] && face[i] > 190 && face[i + 1] > 128 && face[i] - face[i + 1] > 18 && face[i + 1] > face[i + 2] + 5 && (x + y) % 3 === 0) {
              c.fillRect(left + x, row * fh + y, 1, 1);
            }
          }
        }
        c.restore();
      }
    }
    return { img, fw, fh, ax, ay, idx: { idle: 0, walk: 2, hug: 6, kiss: 8 } };
  });
}

const STELLA_NPC_ATLAS = npcAtlas;
npcAtlas = function (id) {
  if (!STELLA_PARTNER_OUTFITS[id]) return STELLA_NPC_ATLAS.apply(this, arguments);
  const selected = G.P?.partner === id ? G.P.pOut : 'normal';
  return stellaPartnerAtlas(id, STELLA_PARTNER_OUTFITS[id].includes(selected) ? selected : 'normal');
};

V33_TICKS.push(() => {
  const id = G.P?.partner;
  const outfit = G.P?.pOut;
  if (!STELLA_PARTNER_OUTFITS[id]?.includes(outfit) || outfit === 'normal') return;
  if (!jpVariantAtlas(outfit).ready) return;
  const atlas = stellaPartnerAtlas(id, outfit);
  for (const e of G.ents) {
    if (e.id === id && !e.wedTmp && !e.scene && e.atlas !== atlas) e.atlas = atlas;
  }
});

const STELLA_LOVE_LINES = {
  jp_miku: [
    L2('Guardé el último compás para cuando volvieras. ♥', 'I saved the last beat for when you came back. ♥'),
    L2('¿Paseamos? Quiero que la próxima canción empiece contigo.', 'Want to walk? I want my next song to start with you.'),
    L2('Cuando estoy contigo, hasta la ciudad suena diferente.', 'Even the city sounds different when I’m with you.'),
  ],
  jp_teto: [
    L2('¡Te-to, ra-ri-ru! Eso significa que te extrañé. ♥', 'Teto, ra-ri-ru! That means I missed you. ♥'),
    L2('Te guardé un pastel. El segundo ya me lo comí.', 'I saved you a cake. I already ate the second one.'),
    L2('Ven, quiero caminar contigo antes del ensayo.', 'Come on, I want to walk with you before rehearsal.'),
  ],
};

{
  const previous = romPartnerTalk;
  romPartnerTalk = function (npc) {
    const lines = STELLA_LOVE_LINES[npc.id];
    if (!lines || G.P?.partner !== npc.id) return previous.apply(this, arguments);
    if (cdLeft(rel(npc.id), 'cp', 1200) > 0) return romanceMenu(npc, pick(lines));
    previous.apply(this, arguments);
    typeText(pick(lines) + '\n' + L2('Te preparé algo para el camino. ♥', 'I packed something for the road. ♥'));
  };
}

{
  const previous = romScene;
  romScene = function (npc, kind, done) {
    if (!STELLA_PARTNER_OUTFITS[npc.id] || kind !== 'kiss') return previous.apply(this, arguments);
    return previous.call(this, npc, kind, () => {
      if (done) done();
      const line = npc.id === 'jp_miku'
        ? L2('Ahora sí me hiciste perder el compás… ♥', 'Now you’ve made me lose the beat… ♥')
        : L2('¿Yo, sonrojada? ¡Son las luces del escenario! ♥', 'Me, blushing? It’s the stage lights! ♥');
      toast(nick(npc.id) + ': ' + line, 'info');
    });
  };
}
