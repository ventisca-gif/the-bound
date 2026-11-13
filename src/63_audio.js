// ================= AUDIO (procedural chiptune + sfx) =================
let AC = null, mGain = null, sGain = null, noiseBuf = null, curMusic = null, musicTimer = null, musicState = null;
function audioUnlock() {
  if (AC) { if (AC.state === 'suspended') AC.resume(); return; }
  try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
  mGain = AC.createGain(); sGain = AC.createGain(); mGain.connect(AC.destination); sGain.connect(AC.destination); applyVolumes();
  noiseBuf = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  if (G.P || !$('#title').hidden) setMusic(null);
}
function applyVolumes() { if (!AC) return; mGain.gain.value = SETTINGS.music * 0.22; sGain.gain.value = SETTINGS.sfx * 0.35; }
const NOTE = n => 440 * Math.pow(2, (n - 69) / 12);
function tone(f, t0, dur, type = 'square', vol = 0.3, dest = sGain, slide = 0) { if (!AC) return; const o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.setValueAtTime(f, t0); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, f * slide), t0 + dur); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); o.connect(g); g.connect(dest); o.start(t0); o.stop(t0 + dur + 0.02); }
function noise(t0, dur, vol = 0.3, freq = 2000, type = 'bandpass', dest = sGain) { if (!AC) return; const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = noiseBuf; f.type = type; f.frequency.value = freq; g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); s.connect(f); f.connect(g); g.connect(dest); s.start(t0, Math.random() * 0.5); s.stop(t0 + dur + 0.02); }
const sfxLast = {};
function sfx(k) {
  if (!AC || SETTINGS.sfx <= 0) return; const t = AC.currentTime; if (sfxLast[k] && t - sfxLast[k] < 0.04) return; sfxLast[k] = t;
  switch (k) {
    case 'hit': noise(t, 0.08, 0.5, 1800); tone(180, t, 0.07, 'square', 0.15, sGain, 0.5); break;
    case 'crit': noise(t, 0.12, 0.6, 2600); tone(660, t, 0.1, 'square', 0.2, sGain, 0.5); tone(990, t + 0.03, 0.08, 'square', 0.12); break;
    case 'hurt': tone(220, t, 0.15, 'sawtooth', 0.22, sGain, 0.4); noise(t, 0.1, 0.3, 900); break;
    case 'kill': tone(520, t, 0.08, 'square', 0.15, sGain, 0.5); noise(t, 0.2, 0.3, 800, 'lowpass'); break;
    case 'swing': noise(t, 0.09, 0.22, 3200, 'highpass'); break;
    case 'slash': case 'slash2': noise(t, 0.12, 0.35, 2400); tone(320, t, 0.06, 'triangle', 0.15, sGain, 2); break;
    case 'boom': noise(t, 0.4, 0.6, 400, 'lowpass'); tone(90, t, 0.35, 'sine', 0.5, sGain, 0.4); break;
    case 'cast': case 'magic': tone(600, t, 0.18, 'triangle', 0.2, sGain, 1.8); tone(900, t + 0.04, 0.14, 'sine', 0.12, sGain, 1.5); break;
    case 'chuff': noise(t, 0.16, 0.22, 700, 'lowpass'); noise(t + 0.02, 0.08, 0.12, 2400, 'highpass'); break;
    case 'rumble': tone(55, t, 0.4, 'sawtooth', 0.08, sGain, 1); noise(t, 0.3, 0.06, 300, 'lowpass'); break;
    case 'whistle': tone(880, t, 0.5, 'sine', 0.16, sGain, 1); tone(1108, t, 0.5, 'sine', 0.12, sGain, 1); tone(880, t + 0.55, 0.7, 'sine', 0.16, sGain, 1); tone(1108, t + 0.55, 0.7, 'sine', 0.12, sGain, 1); break;
    case 'horn': tone(220, t, 0.7, 'sawtooth', 0.12, sGain, 1); tone(277, t, 0.7, 'sawtooth', 0.1, sGain, 1); tone(330, t, 0.7, 'square', 0.05, sGain, 1); break;
    case 'note': { const f = [523, 587, 659, 784, 880][(Math.random() * 5) | 0]; tone(f, t, 0.22, 'triangle', 0.16, sGain, 1); tone(f * 1.5, t + 0.02, 0.16, 'sine', 0.07, sGain, 1); break; }
    case 'bow': noise(t, 0.06, 0.3, 4000, 'highpass'); tone(300, t, 0.08, 'triangle', 0.18, sGain, 0.5); break;
    case 'fire': noise(t, 0.3, 0.4, 900, 'lowpass'); tone(200, t, 0.2, 'sawtooth', 0.1, sGain, 2); break;
    case 'ice': tone(1400, t, 0.15, 'sine', 0.15, sGain, 0.6); tone(2100, t + 0.03, 0.12, 'sine', 0.1); noise(t, 0.12, 0.2, 6000, 'highpass'); break;
    case 'dash': noise(t, 0.15, 0.3, 1200, 'bandpass'); break;
    case 'blink': tone(1200, t, 0.15, 'sine', 0.2, sGain, 0.3); break;
    case 'buff': [0, 4, 7, 12].forEach((n, i) => tone(NOTE(67 + n), t + i * 0.05, 0.18, 'triangle', 0.18)); break;
    case 'potion': tone(500, t, 0.08, 'sine', 0.2, sGain, 1.6); tone(800, t + 0.08, 0.1, 'sine', 0.15, sGain, 1.4); break;
    case 'level': [0, 4, 7, 12, 16].forEach((n, i) => tone(NOTE(72 + n), t + i * 0.08, 0.3, 'square', 0.16)); tone(NOTE(60), t, 0.6, 'triangle', 0.2); break;
    case 'quest': tone(NOTE(76), t, 0.12, 'square', 0.15); tone(NOTE(81), t + 0.1, 0.2, 'square', 0.15); break;
    case 'questdone': [0, 4, 7, 12].forEach((n, i) => tone(NOTE(67 + n), t + i * 0.1, 0.35, 'square', 0.15)); [0, 7].forEach((n, i) => tone(NOTE(55 + n), t, 0.6, 'triangle', 0.2)); break;
    case 'coin': tone(NOTE(88), t, 0.06, 'square', 0.12); tone(NOTE(93), t + 0.06, 0.12, 'square', 0.12); break;
    case 'pickup': tone(NOTE(79), t, 0.06, 'square', 0.12); tone(NOTE(84), t + 0.05, 0.08, 'square', 0.12); break;
    case 'equip': noise(t, 0.08, 0.3, 3000); tone(400, t, 0.1, 'square', 0.12, sGain, 1.5); break;
    case 'learn': [0, 7, 12].forEach((n, i) => tone(NOTE(74 + n), t + i * 0.06, 0.2, 'triangle', 0.18)); break;
    case 'ui': tone(NOTE(84), t, 0.04, 'square', 0.06); break;
    case 'talk': tone(NOTE(72), t, 0.05, 'square', 0.08); tone(NOTE(76), t + 0.05, 0.05, 'square', 0.08); break;
    case 'door': noise(t, 0.2, 0.25, 500, 'lowpass'); tone(140, t, 0.15, 'triangle', 0.2, sGain, 0.7); break;
    case 'chop': noise(t, 0.1, 0.5, 700); tone(160, t, 0.08, 'square', 0.15, sGain, 0.6); break;
    case 'mine': tone(1800, t, 0.06, 'square', 0.12, sGain, 0.8); noise(t, 0.08, 0.4, 3500); break;
    case 'bite': tone(NOTE(84), t, 0.08, 'square', 0.2); tone(NOTE(84), t + 0.12, 0.08, 'square', 0.2); noise(t, 0.15, 0.3, 1500); break;
    case 'forge': for (let i = 0; i < 3; i++) { tone(1600, t + i * 0.12, 0.06, 'square', 0.12, sGain, 0.7); noise(t + i * 0.12, 0.06, 0.3, 4000); } break;
    case 'die': [0, -3, -7, -12].forEach((n, i) => tone(NOTE(64 + n), t + i * 0.15, 0.3, 'triangle', 0.2)); break;
    case 'boss': tone(NOTE(40), t, 0.8, 'sawtooth', 0.25); tone(NOTE(47), t + 0.2, 0.8, 'sawtooth', 0.2); noise(t, 0.6, 0.4, 300, 'lowpass'); break;
  }
}
// ---------- music ----------
const THEMES = {
  title: { bpm: 78, root: 53, scale: [0, 2, 4, 5, 7, 9, 11], chords: [0, 2, 3, 4], lead: 'triangle', seed: 3, drums: 0, arp: 1 },
  town: { bpm: 96, root: 60, scale: [0, 2, 4, 5, 7, 9, 11], chords: [0, 5, 3, 4], lead: 'triangle', seed: 7, drums: 1, arp: 1 },
  field: { bpm: 116, root: 55, scale: [0, 2, 4, 5, 7, 9, 11], chords: [0, 4, 5, 3], lead: 'square', seed: 11, drums: 2, arp: 1 },
  forest: { bpm: 86, root: 57, scale: [0, 2, 3, 5, 7, 9, 10], chords: [0, 6, 5, 6], lead: 'triangle', seed: 19, drums: 1, arp: 1 },
  wild: { bpm: 108, root: 50, scale: [0, 2, 3, 5, 7, 8, 10], chords: [0, 5, 2, 6], lead: 'square', seed: 23, drums: 2, arp: 1 },
  boss: { bpm: 144, root: 52, scale: [0, 2, 3, 5, 7, 8, 10], chords: [0, 0, 5, 6], lead: 'sawtooth', seed: 31, drums: 3, arp: 1 },
};
function compose(th) {
  const R = new RNG(th.seed), bars = 8, steps = 16, mel = []; const sc = th.scale;
  const deg = (d) => { const o = Math.floor(d / 7); return th.root + 12 + sc[((d % 7) + 7) % 7] + o * 12; };
  let cur = 2; for (let b = 0; b < bars; b++) { const ch = th.chords[b % th.chords.length]; const rhythm = R.pick([[1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0], [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0], [1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0], [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0]]);
    for (let s = 0; s < steps; s++) { if (!rhythm[s]) { mel.push(null); continue; } if (s % 4 === 0) { const ct = [ch, ch + 2, ch + 4]; cur = R.pick(ct) + (R.f() < 0.3 ? 7 : 0); } else cur += R.pick([-1, 1, 1, -2, 2, 0]); cur = clamp(cur, -2, 11); let len = 1; while (s + len < steps && !rhythm[s + len] && len < 4) len++; mel.push({ n: deg(cur), len }); } }
  return { mel, deg };
}
function setMusic(name) {
  if (!name) name = G.P ? currentMusic() : 'title'; if (name === curMusic && musicTimer) return; curMusic = name; if (!AC) return;
  clearInterval(musicTimer); musicTimer = null; const th = THEMES[name] || THEMES.field; const comp = compose(th);
  const stepDur = 60 / th.bpm / 4; let step = 0, next = AC.currentTime + 0.1; const fadeG = AC.createGain(); fadeG.gain.value = 0.0001; fadeG.gain.exponentialRampToValueAtTime(1, AC.currentTime + 1.2); fadeG.connect(mGain);
  if (musicState && musicState.g) { const og = musicState.g; og.gain.setTargetAtTime(0.0001, AC.currentTime, 0.3); setTimeout(() => { try { og.disconnect(); } catch (e) { } }, 1500); }
  musicState = { g: fadeG };
  musicTimer = setInterval(() => {
    if (!AC || document.hidden) { next = AC ? AC.currentTime + 0.1 : 0; return; }
    while (next < AC.currentTime + 0.35) {
      const s = step % (comp.mel.length), bar = Math.floor(s / 16), ch = th.chords[bar % th.chords.length], beat = s % 16;
      const m = comp.mel[s]; if (m) tone(NOTE(m.n), next, stepDur * m.len * 0.95, th.lead, th.lead === 'sawtooth' ? 0.09 : th.lead === 'square' ? 0.11 : 0.2, fadeG);
      if (beat % 8 === 0) tone(NOTE(comp.deg(ch) - 24), next, stepDur * 7.5, 'triangle', 0.32, fadeG);
      if (th.drums >= 3 && beat % 2 === 0) tone(NOTE(comp.deg(ch) - 24), next, stepDur * 1.6, 'triangle', 0.22, fadeG);
      if (th.arp && beat % 2 === 0) { const a = [ch, ch + 2, ch + 4, ch + 2][(beat / 2) % 4]; tone(NOTE(comp.deg(a) - 12), next, stepDur * 1.5, 'square', 0.035, fadeG); }
      if (th.drums >= 1 && beat % 4 === 2) noise(next, 0.04, 0.12 * (th.drums > 1 ? 1.3 : 1), 7000, 'highpass', fadeG);
      if (th.drums >= 2 && beat % 8 === 0) { tone(110, next, 0.12, 'sine', 0.4, fadeG, 0.4); }
      if (th.drums >= 2 && beat % 8 === 4) noise(next, 0.1, 0.25, 1500, 'bandpass', fadeG);
      next += stepDur; step++;
    }
  }, 90);
}
