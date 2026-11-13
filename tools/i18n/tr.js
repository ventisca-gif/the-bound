// tr.js — traducción del juego al inglés en tiempo de compilación (v3.6)
// node tr.js extract <game.js> <template.html> <out.json>   → lista de textos en español (clave → nº de apariciones)
// node tr.js apply <game.js> <en.json> <out.js>             → cada texto traducible pasa a ser (LANG_EN ? "inglés" : "español")
// Las claves son "tramos" de texto: el contenido entre etiquetas HTML (o el texto entero), sin espacios en los extremos,
// con las partes variables ${...} numeradas como {0}, {1}… El español original se queda tal cual en el código.
const fs = require('fs'), path = require('path');
// acorn (MIT): copia local en tools/i18n/vendor/ o la del sistema (no va en la copia de seguridad)
const acorn = require([path.join(__dirname, 'vendor', 'acorn.js'), '/opt/npm-tools/node_modules/acorn', 'acorn'].find(p => { try { require.resolve(p); return true; } catch (e) { return false; } }));
const SKIP_CALLS = new Set(['L2', 'RegExp', 'getElementById', 'querySelector', 'querySelectorAll', '$', '$$', 'getItem', 'setItem', 'removeItem', 'addEventListener', 'removeEventListener', 'getContext', 'createElement', 'sfx', 'setProperty', 'matchMedia', 'require', 'importScripts']);
const PH = /\u0001(\d+)\u0002/g;
function isCandidate(core) {
  const plain = core.replace(PH, ' ').trim();
  if (!/[A-Za-zÀ-ÿ]{2,}/.test(plain)) return false;
  if (/\S{40,}/.test(plain)) return false;   // datos en base64 y similares
  if (/\d+px\b|rgba?\(|#[0-9a-fA-F]{3,8}\b|\bvar\(--|=>|\bfunction\b|https?:|\.(js|png|json)\b|^[\w-]+:[\w-]+$|[{};]|\bsans-serif\b|\bmonospace\b|^data:/.test(plain)) return false;
  return /[áéíóúñüÁÉÍÓÚÑÜ¿¡]/.test(plain) || /\s/.test(plain) || /^[A-ZÁÉÍÓÚÑ]/.test(plain) || /\s/.test(core.replace(PH, ' ').trim()) || (PH.test(core) && /^[a-záéíóúñü]{3,}$/.test(plain));
}
function runOf(seg, html) {
  const lead = seg.match(/^\s*/)[0], trail = seg.slice(lead.length).match(/\s*$/)[0], core = seg.slice(lead.length, seg.length - trail.length);
  // palabra suelta en minúscula: solo si está entre etiquetas HTML o rodeada de espacios (los ids nunca lo están)
  const loose = core && (html || /\s/.test(seg)) && /^\(?[a-záéíóúñü][a-záéíóúñü]+\)?[.:,]?$/.test(core);
  if (!core || !(isCandidate(core) || loose)) return null;
  const phs = []; const key = core.replace(PH, (_, n) => { phs.push(n); return '{' + (phs.length - 1) + '}'; });
  return { lead, core, trail, key, phs };
}
function parts(text) {
  const out = [], re = /<[^<>]*>/g; let i = 0, m;
  while ((m = re.exec(text))) { if (m.index > i) out.push({ t: 'txt', s: text.slice(i, m.index) }); out.push({ t: 'tag', s: m[0] }); i = m.index + m[0].length; }
  if (i < text.length) out.push({ t: 'txt', s: text.slice(i) }); return out;
}
const ATTR = /\b(placeholder|title|aria-label|alt)="([^"]*)"/g;
function runsOf(text) { const rs = [], P = parts(text), html = P.some(p => p.t === 'tag'); for (const p of P) { if (p.t === 'txt') { const r = runOf(p.s, html); if (r) rs.push(r); } else { let m; ATTR.lastIndex = 0; while ((m = ATTR.exec(p.s))) { const r = runOf(m[2]); if (r) rs.push(r); } } } return rs; }
function trRun(r, D) { const en = D[r.key]; if (en === undefined) return null; return r.lead + en.replace(/\{(\d+)\}/g, (_, k) => '\u0001' + r.phs[+k] + '\u0002') + r.trail; }
function translate(text, D) {
  let hit = false; const P = parts(text), html = P.some(p => p.t === 'tag'); const out = P.map(p => {
    if (p.t === 'txt') { const r = runOf(p.s, html); const t = r && trRun(r, D); if (t !== null && t !== undefined) { hit = true; return t; } return p.s; }
    return p.s.replace(ATTR, (all, a, v) => { const r = runOf(v); const t = r && trRun(r, D); if (t === null || t === undefined) return all; hit = true; return `${a}="${t}"`; });
  }).join('');
  return hit ? out : null;
}
let SRC = '';
function skipLit(node, parent, key) {
  if (SRC && SRC.slice(Math.max(0, node.start - 6), node.start) === '/*nt*/') return true;   // marcador: no traducir (nombres propios)
  if (!parent) return false;
  if ((parent.type === 'Property' || parent.type === 'MethodDefinition' || parent.type === 'PropertyDefinition') && key === 'key' && !parent.computed) return true;
  if (parent.type === 'MemberExpression' && key === 'property') return true;
  if (parent.type === 'ExpressionStatement' && parent.directive) return true;
  if (parent.type === 'BinaryExpression' && parent.operator === 'in' && key === 'left') return true;
  if ((parent.type === 'CallExpression' || parent.type === 'NewExpression') && key === 'arguments') {
    const c = parent.callee, n = c.type === 'Identifier' ? c.name : c.type === 'MemberExpression' && !c.computed ? c.property.name : '';
    if (SKIP_CALLS.has(n)) return true;
  }
  return false;
}
function collect(src) {
  SRC = src;
  const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'script', allowHashBang: true, allowReturnOutsideFunction: true });
  const T = [];
  (function visit(node, parent, key) {
    if (!node || typeof node.type !== 'string') return;
    if (node.type === 'Literal' && typeof node.value === 'string') { if (!skipLit(node, parent, key)) T.push(node); }
    else if (node.type === 'TemplateLiteral' && !(parent && parent.type === 'TaggedTemplateExpression')) T.push(node);
    for (const k in node) { if (k === 'type' || k === 'start' || k === 'end') continue; const v = node[k]; if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === 'string') visit(c, node, k); } else if (v && typeof v.type === 'string') visit(v, node, k); }
  })(ast, null, null);
  T.sort((a, b) => a.start - b.start); return T;
}
const tplText = n => n.quasis.map((q, i) => (q.value.cooked != null ? q.value.cooked : q.value.raw) + (i < n.expressions.length ? '\u0001' + i + '\u0002' : '')).join('');
const escTpl = s => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const mode = process.argv[2];
if (mode === 'extract') {
  const src = fs.readFileSync(process.argv[3], 'utf8'), C = {};
  const add = text => { for (const r of runsOf(text)) C[r.key] = (C[r.key] || 0) + 1; };
  for (const n of collect(src)) add(n.type === 'Literal' ? n.value : tplText(n));
  let html = fs.readFileSync(process.argv[4], 'utf8').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<head[\s\S]*?<\/head>/, '');
  const H = {}; for (const r of runsOf(html)) H[r.key] = (H[r.key] || 0) + 1;
  fs.writeFileSync(process.argv[5], JSON.stringify({ js: C, html: H }, null, 0));
  console.log('runs js', Object.keys(C).length, 'html', Object.keys(H).length);
} else if (mode === 'apply') {
  const src = fs.readFileSync(process.argv[3], 'utf8'), D = JSON.parse(fs.readFileSync(process.argv[4], 'utf8'));
  const T = collect(src); let nTr = 0;
  // emite el código de [a,b) sustituyendo los nodos traducibles de primer nivel
  function emit(a, b) {
    let out = '', i = a;
    for (let k = 0; k < T.length; k++) { const n = T[k]; if (n.start < i || n.end > b) continue; out += src.slice(i, n.start) + gen(n); i = n.end; }
    return out + src.slice(i, b);
  }
  function inner(n) { // plantilla con las expresiones internas ya transformadas
    let out = '`'; n.quasis.forEach((q, j) => { out += q.value.raw; if (j < n.expressions.length) out += '${' + emit(n.expressions[j].start, n.expressions[j].end) + '}'; }); return out + '`';
  }
  function gen(n) {
    if (n.type === 'Literal') { const t = translate(n.value, D); if (t === null) return src.slice(n.start, n.end); nTr++; return `(LANG_EN ? ${JSON.stringify(t)} : ${src.slice(n.start, n.end)})`; }
    const es = inner(n), t = translate(tplText(n), D); if (t === null) return es; nTr++;
    const en = '`' + escTpl(t).replace(/\u0001(\d+)\u0002/g, (_, k) => '${' + emit(n.expressions[+k].start, n.expressions[+k].end) + '}') + '`';
    return `(LANG_EN ? ${en} : ${es})`;
  }
  fs.writeFileSync(process.argv[5], emit(0, src.length)); console.log('translated nodes', nTr);
} else if (mode === 'html') { // diccionario solo con los tramos de la plantilla HTML (se traducen en el navegador al arrancar)
  const D = JSON.parse(fs.readFileSync(process.argv[3], 'utf8')); let html = fs.readFileSync(process.argv[4], 'utf8').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<head[\s\S]*?<\/head>/, '');
  const O = {}; for (const r of runsOf(html)) if (D[r.key] !== undefined) O[r.key] = D[r.key]; process.stdout.write(JSON.stringify(O));
}
