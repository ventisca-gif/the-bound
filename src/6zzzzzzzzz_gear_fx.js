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
    const shoulderX = 70 + motion, shoulderY = 45 - air;
    const reach = Math.max(0, x - shoulderX);
    const thickness = Math.max(3, size * 6);
    for (const [offset, width, color] of [[0, thickness, '#441c3a'],
      [-2, thickness * .45, '#983352'], [-3, 1, '#ed8098']]) {
      c.strokeStyle = color; c.lineWidth = width; c.beginPath();
      c.moveTo(shoulderX, shoulderY + offset);
      c.quadraticCurveTo(shoulderX + reach * .42, y + offset - 7, x, y + offset);
      c.stroke();
    }
    c.drawImage(fist, x - 7 * size, y - 9 * size, 28 * size, 22 * size);
  }
  function impact(x, y, size, opacity) {
    c.save(); c.translate(x, y); c.globalAlpha = opacity;
    for (let i = 0; i < 8; i++) {
      c.rotate(Math.PI / 4);
      c.fillStyle = i % 2 ? '#fcb18e' : '#fff1d4';
      c.fillRect(size * .5, -1, size * .38, 2);
    }
    c.strokeStyle = '#ffc7a3'; c.lineWidth = 1;
    c.beginPath(); c.ellipse(0, 0, size * .44, size * .35, 0, 0, Math.PI * 2); c.stroke();
    c.restore();
  }
  if (technique === 1) {
    // A springing leap with both legs extended and a vapor burst on landing.
    if (t > .3 && t < .8) {
      for (const [dx, dy] of [[0, 0], [-5, 9]]) {
        c.save(); c.translate(60 + motion + dx, 76 - air + dy); c.rotate(-.32);
        c.fillStyle = '#2b1831'; c.fillRect(0, -4, 27, 9);
        c.fillStyle = '#8e284a'; c.fillRect(2, -3, 23, 6);
        c.fillStyle = '#e46b83'; c.fillRect(15, -3, 11, 2);
        c.fillStyle = '#f8b6b8'; c.fillRect(24, -5, 6, 8);
        c.restore();
      }
    }
    if (t > .65) impact(102, 99, (t - .65) * 75, 1 - t + .25);
  } else if (technique === 2) {
    // Stagger the travel and opacity so the alternating punches read as a burst.
    for (let i = 0; i < 8; i++) {
      const phase = t * 2.6 - i * .115;
      if (phase < 0 || phase >= 2) continue;
      const p = phase % 1;
      c.globalAlpha = 1 - p * .52;
      strike(76 + p * 92, 28 + (i % 4) * 11, .72);
      if (p > .72) impact(104 + p * 88, 30 + (i % 4) * 11, 12, .75);
    }
    c.globalAlpha = 1;
  } else {
    const heavy = technique === 3;
    const release = Math.max(0, Math.min(1, (t - .34) * 3));
    strike(72 + release * (heavy ? 75 : 62), heavy ? 53 : 45, heavy ? 2.0 : 1.18);
    if (release > .75) impact(heavy ? 176 : 153, heavy ? 52 : 45, heavy ? 31 : 18, 1 - t * .7);
  }
  return canvas;
}
