// ---------- v4.27: la escena de la cama siempre visible ----------
// La cámara se centra en la cama durante la escena (antes seguía al jugador y la cama
// quedaba bajo el panel de misión) y la pareja se dibuja encima de la cama y los muebles.
{ const _uc = updateCamera; updateCamera = function (dt, snap) { const S = BED_SC, M = G.map; if (!S || !M) return _uc(dt, snap);
  // sin límite de borde: la cama suele estar pegada a la pared de arriba
  const tx = S.cx - VW / 2, ty = S.top + 14 - VH / 2;
  const k = snap ? 1 : 1 - Math.pow(0.0005, dt); G.cam.x += (tx - G.cam.x) * k; G.cam.y += (ty - G.cam.y) * k; }; }
// Tras ordenar por profundidad, el jugador (que dibuja la pareja en la cama) pasa al final.
drawList.sort = function (f) { Array.prototype.sort.call(this, f); const S = BED_SC; if (S) { const i = this.indexOf(G.P); if (i >= 0) { this.splice(i, 1); this.push(G.P); } } return this; };
// Escena rehecha: centrada en el dibujo de la cama (la matrimonial no tiene el ancla en el centro),
// cabezas sobre las almohadas y la manta encima moviéndose.
bedScene = function (done) { const P = G.P, M = G.map, objs = (M && M.objs) || [], ok = o => o.k === 'furn' && !o.hidden;
  const bed = objs.find(o => ok(o) && o.f === 'bigbed') || objs.find(o => ok(o) && o.f === 'bed'), pe = G.ents.find(e => e.type === 'npc' && relKey(e.id) === P.partner && e.map === P.map && !e.remove);
  if (!bed) { done(); return; } const s = objSprite(bed), w = s && s.c ? s.c.width : 18, h = s && s.c ? s.c.height : 30, top = bed.py - (s && s.ay != null ? s.ay : 30), left = bed.px - (s && s.ax != null ? s.ax : 9);
  BED_SC = { bed, pe, t1: G.t + 3.4, top, left, w, h, cx: left + w / 2, n: 0 }; P.rootT = 3.6; P.busy = 3.6; sfx('quest');
  const tick = () => { const S = BED_SC; if (!S) return; if (G.t >= S.t1) { BED_SC = null; done(); return; } NFX_ON++; try { burst(S.cx + (Math.random() - 0.5) * w * 0.5, top + 4, 2, { sp: 14, up: 34, g: -22, life: 1.4, c: ['#ff5a8a', '#ffb0c8', '#ffffff'] }); if (Math.random() < 0.6) floatText(S.cx + (Math.random() - 0.5) * w * 0.6, top - 2, '♥', '#ff7ab0'); } finally { NFX_ON--; } setTimeout(tick, 280); }; tick(); };
drawBedPair = function (S, cx, cy) { const bx = Math.round(S.cx - cx), top = Math.round(S.top - cy), bt = top + Math.round(S.h * 0.37), wig = Math.round(Math.sin(G.t * 9) * 1.2), dx = Math.max(4, Math.round(S.w / 4));
  const head = (A, x) => { if (!A) return; const col = A.idx.idle || 0, ch = Math.round(A.fh * 0.5); ctx.drawImage(A.img, col * A.fw, 0, A.fw, ch, Math.round(x - A.fw / 2), bt - 1 - ch, A.fw, ch); };
  head(G.P.atlas, bx - (S.pe ? dx : 0)); if (S.pe) head(S.pe.atlas, bx + dx);
  const x0 = Math.round(S.left - cx) + 2, bw = S.w - 4, bh = Math.round(S.h * 0.5);
  ctx.fillStyle = '#c03a5a'; ctx.fillRect(x0, bt + wig, bw, bh); ctx.fillStyle = '#e86a8a'; ctx.fillRect(x0, bt + wig, bw, 3);
  ctx.fillStyle = '#ffd0dc'; for (let x = x0 + 3; x < x0 + bw - 3; x += 6) ctx.fillRect(x, bt + 8 + wig, 2, 2); };
