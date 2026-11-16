// ================= v4.87: MELENA LARGA DE PUNTAS =================
// Peinado propio para chicos y chicas: melena larga hasta media espalda hecha de mechones en punta que se abren hacia
// abajo, corona con puntas cortas hacia atrás, flequillo desfilado y mechones laterales en punta por delante de los hombros.
AH.melena_puntas = c => { const B = c.up ? c.F : c.B, yE = [0.36, 0.44, 0.5, 0.46, 0.5, 0.44, 0.36];
  // mechones largos que terminan en pico y se abren hacia abajo (detrás del cuerpo de frente, encima de espaldas)
  if (c.side) { for (let k = 0; k < 5; k++) { const x0 = c.hx + c.k * (c.rx * 0.2 + k * 0.4), y0 = c.hy - 2 + k; ahLock(B, [[x0, y0], [x0 + c.k * (c.rx * 0.6 + k * 0.5), c.hy + c.ry + 2 + k], [x0 + c.k * (c.rx * 0.7 + k * 1.1), c.Y(yE[k + 1])]], 3.6, 1, { l: 0.15 * k }); } }
  else for (let k = -3; k <= 3; k++) { const x0 = c.hx + k * c.rx * 0.28; ahLock(B, [[x0, c.hy - 1], [x0 + k * c.rx * 0.22, c.hy + c.ry + 2], [x0 + k * (c.rx * 0.3 + 1.2), c.Y(yE[k + 3])]], 3.8, 1, { l: 0.1 * (k + 3) }); }
  if (c.up) for (let k = -2.5; k <= 2.5; k += 1) { const x0 = c.hx + k * c.rx * 0.28; ahLock(c.F, [[x0, c.hy - 1], [x0 + k * c.rx * 0.2, c.hy + c.ry + 2], [x0 + k * (c.rx * 0.28 + 1), c.Y(0.47)]], 4.2, 1, { l: 0.3 }); }
  c.cap(1.4, { bumps: 9, ba: 0.06 });
  c.spikes([[132, 3.4, 3.2], [-128, 3.4, 3.2], [106, 4.4, 3.8], [-102, 4.4, 3.8], [78, 4.8, 4.2], [-74, 4.8, 4.2], [46, 4, 4.4], [-42, 4, 4.4]], { bend: 0.5 });
  if (!c.up && !c.side) for (const s of [-1, 1]) ahLock(c.F, [[c.hx + s * (c.rx - 0.6), c.hy], [c.hx + s * (c.rx + 1.4), c.hy + c.ry + 1], [c.hx + s * (c.rx + 2.6), c.Y(0.3)]], 2.8, 1, {});
  else if (c.side) ahLock(c.F, [[c.hx - c.k * 1, c.hy], [c.hx - c.k * 2, c.hy + c.ry + 1], [c.hx - c.k * 2.4, c.Y(0.28)]], 2.4, 1, {});
  c.fringe('point', 5, { drop: 0.6 }); };
HS_F.push({ n: L2('Melena de puntas', 'Spiky long mane'), cap: 'spiky', bang: 'messy', side: 10, back: 16, bw: 1.25, jag: 1, ah: 'melena_puntas' });
HS_M.push({ n: L2('Melena de puntas', 'Spiky long mane'), cap: 'spiky', bang: 'messy', side: 10, back: 16, bw: 1.25, jag: 1, ah: 'melena_puntas' });
