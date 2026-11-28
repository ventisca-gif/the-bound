// Previews only. The forms and techniques are outside the save, skill and combat systems.
const RUBBER_DEMOS = [
  ['Comprime el brazo y lo suelta de golpe.', 'Compresses the arm and releases it in a punch.'],
  ['Rebota y lanza una patada doble entre estelas de vapor.', 'Bounces into a double kick through trails of steam.'],
  ['Encadena puñetazos alternos con destellos escalonados.', 'Chains alternating punches with staggered flashes.'],
  ['Carga un puño más grande y lo remata con una onda.', 'Charges an oversized fist and releases a shockwave.'],
];
const RUBBER_GEARS = [
  { id: 3, techniques: [['Puño Gigante', 'Giant Fist'], ['Doble Martillo', 'Double Hammer'],
    ['Barrido Colosal', 'Colossal Sweep'], ['Impacto de Titanes', 'Titan Impact']] },
  { id: 4, techniques: [['Puño de Presión', 'Pressure Fist'], ['Rebote de Vapor', 'Steam Bounce'],
    ['Ráfaga Carmesí', 'Crimson Flurry'], ['Impacto Comprimido', 'Compressed Impact']] },
];

function rubberGearPreviewAtlas(P) {
  const app = normApp(P.app);
  const key = heroKey(P.cls, app, {}, {}, true) + '|rubber-preview';
  return getAtlas(key, () => {
    const look = heroLook(P.cls, app, {}, {}, { hideHelm: true });
    look.weapon = { k: 'none', tier: 1 };
    return buildHeroAtlas(look);
  });
}

hookAfter('transOpen', () => {
  const P = G.P, close = $('#trX');
  if (!P || !close || $('#rubberGearCards')) return;
  const section = document.createElement('section');
  section.id = 'rubberGearCards';
  const hasFruit = P.fruit === 'goma';
  const requirement = hasFruit
    ? L2('Ya tienes la fruta Goma Goma. Forma y técnicas bloqueadas por ahora.', 'You have the Rubber Fruit. The form and techniques are still locked.')
    : L2('Requiere conseguir y comer la Fruta del Diablo de Goma (Goma Goma). Bloqueada por ahora.',
         'Requires finding and eating the Rubber Devil Fruit. Currently locked.');
  const atlas = rubberGearPreviewAtlas(P);
  for (const form of RUBBER_GEARS) {
    const card = document.createElement('div');
    card.className = 'gsrc';
    const title = document.createElement('span');
    title.innerHTML = `<b>🔒 Gear ${form.id}</b><br><small>${esc(requirement)}</small><br>
      <small>${esc(L2('Técnicas bloqueadas', 'Locked techniques'))} · ${form.techniques.map(names => esc(L2(...names))).join(' · ')}</small>`;
    const draw = form.id === 3 ? rubberGearThree : rubberGearFour;
    const preview = draw(P, atlas, 'down', 'idle', 0);
    preview.style.cssText = 'width:6em;height:auto;image-rendering:pixelated;flex:none';
    preview.setAttribute('aria-label', 'Gear ' + form.id);
    card.append(title, preview);
    section.append(card);
  }
  const demos = document.createElement('div');
  demos.className = 'frame';
  const preview = mkCanvas(208, 118);
  preview.style.cssText = 'width:min(100%, 26em);height:auto;image-rendering:pixelated;display:block;margin:auto';
  preview.setAttribute('role', 'img');
  const label = document.createElement('p');
  label.className = 'hint';
  const demoButtons = document.createElement('div');
  demoButtons.className = 'row wrap';
  let cue = 0, frames;
  function play(index) {
    const token = ++cue, start = performance.now();
    const title = L2(...RUBBER_GEARS[1].techniques[index]);
    label.textContent = title + ' · ' + L2(...RUBBER_DEMOS[index]);
    preview.setAttribute('aria-label', title);
    frames ||= Array.from({length: 4}, (_, i) => rubberGearFour(P, atlas, 'right', 'atk', i));
    const context = preview.getContext('2d');
    function render(now) {
      if (!preview.isConnected || token !== cue) return;
      const progress = Math.min(1, (now - start) / 1050);
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      context.clearRect(0, 0, preview.width, preview.height);
      context.drawImage(rubberGearDemo(index, reduced ? .63 : progress, frames), 0, 0);
      if (!reduced && progress < 1) requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }
  const heading = document.createElement('b');
  heading.textContent = L2('Demostraciones visuales de Gear 4', 'Gear 4 visual demonstrations');
  for (const [index, names] of RUBBER_GEARS[1].techniques.entries()) {
    const button = document.createElement('button');
    button.className = 'btn sm';
    button.dataset.rubberDemo = index;
    button.textContent = L2(...names);
    button.onclick = () => play(index);
    demoButtons.append(button);
  }
  demos.append(heading, preview, label, demoButtons);
  section.append(demos);
  play(2);
  close.closest('.row').before(section);
});

V33_TICKS.push(() => {
  const row = $('#tr .trbtns');
  if (!row) return;
  const visible = G.P?.fruit === 'goma' && !G.P.dead;
  let button = $('#bRubberGear');
  if (button) {
    button.style.display = visible ? '' : 'none';
    return;
  }
  if (!visible) return;
  button = document.createElement('button');
  button.id = 'bRubberGear';
  button.className = 'mini';
  button.title = L2('Engranajes de Goma', 'Rubber Gears');
  button.textContent = '🥊';
  button.onclick = () => {
    transOpen();
    $('#rubberGearCards')?.scrollIntoView({ block: 'nearest' });
  };
  row.append(button);
});
