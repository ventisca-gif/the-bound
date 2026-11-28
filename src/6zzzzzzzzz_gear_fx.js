// Visual-only demonstrations. All coordinates are relative to a right-facing preview.
function rubberGearDemo(technique, progress, frames) {
  const canvas = mkCanvas(208, 118);
  const c = canvas.getContext('2d');
  const t = Math.max(0, Math.min(1, progress));
  const frame = Math.min(3, Math.floor(t * 8) % 4);
  const air = technique === 1 ? Math.sin(t * Math.PI) * 19 : 0;
  const motion = technique === 1 ? 23 * t : 0;
  const pose = frames[frame];
  c.imageSmoothingEnabled = false;
  c.drawImage(pose, 2 + Math.round(motion), -Math.round(air));
  const fist = ttFistArt(['#35162e', '#6c1e44', '#d54d68'], 'side', 56, 44);
  function strike(x, y, size) {
    c.strokeStyle = '#441c3a';
    c.lineWidth = Math.max(4, size * 7);
    c.beginPath(); c.moveTo(70 + motion, 45 - air); c.lineTo(x, y); c.stroke();
    c.drawImage(fist, x - 7 * size, y - 9 * size, 28 * size, 22 * size);
  }
  function impact(x, y, size, opacity) {
    c.save(); c.translate(x, y); c.globalAlpha = opacity;
    for (let i = 0; i < 8; i++) {
      c.rotate(Math.PI / 4);
      c.fillStyle = i % 2 ? '#fcb18e' : '#fff1d4';
      c.fillRect(size * .5, -1, size * .38, 2);
    }
    c.restore();
  }
  if (technique === 1) {
    // A springing leap with both legs extended and a vapor burst on landing.
    if (t > .3 && t < .8) {
      for (const y of [72, 80]) {
        c.fillStyle = '#662448'; c.fillRect(64 + motion, y - air, 27, 6);
        c.fillStyle = '#ed7183'; c.fillRect(83 + motion, y - air, 12, 4);
      }
    }
    if (t > .65) impact(102, 99, (t - .65) * 75, 1 - t + .25);
  } else if (technique === 2) {
    // Stagger the travel and opacity so the alternating punches read as a burst.
    for (let i = 0; i < 6; i++) {
      const phase = t * 2.4 - i * .13;
      if (phase < 0 || phase >= 2) continue;
      const p = phase % 1;
      c.globalAlpha = 1 - p * .52;
      strike(76 + p * 92, 33 + (i % 3) * 13, .72);
      if (p > .72) impact(104 + p * 88, 35 + (i % 3) * 13, 12, .75);
    }
    c.globalAlpha = 1;
  } else {
    const heavy = technique === 3;
    const release = Math.max(0, Math.min(1, (t - .34) * 3));
    strike(72 + release * (heavy ? 75 : 62), heavy ? 53 : 45, heavy ? 1.65 : 1);
    if (release > .75) impact(heavy ? 176 : 153, heavy ? 52 : 45, heavy ? 31 : 18, 1 - t * .7);
  }
  return canvas;
}
