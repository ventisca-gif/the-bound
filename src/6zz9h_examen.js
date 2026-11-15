// ================= v4.65: ACADEMIA — EXAMEN FINAL Y TÉCNICA EXCLUSIVA =================
// Tras 3 lecciones en la Academia Arcana, cualquier profesor te examina: 4 preguntas sobre la historia del mundo.
// Con 3 aciertos o más aprendes la Técnica arcana (solo se aprende aquí). Si fallas, se repite al día siguiente.
SAVEKEYS.push('examDay');
TECH.a_arcana = [L2('Técnica arcana de la Academia', 'Academy arcane technique'), { atk: 0.04, hp: 0.04 }];
const EXAM = [
  [L2('¿Quién susurró a Aurel «Te están mirando»?', 'Who whispered to Aurel "They are watching you"?'), [L2('Nihil', 'Nihil'), L2('Morgana', 'Morgana'), L2('El Kraken', 'The Kraken')], 0],
  [L2('¿Cuántas islas forman Celestia?', 'How many islands make up Celestia?'), ['3', '5', '7'], 1],
  [L2('¿Adónde caen los hilos rotos?', 'Where do broken threads fall?'), [L2('Al mar', 'Into the sea'), L2('Al Abismo', 'Into the Abyss'), L2('Al Velo', 'Into the Veil')], 2],
  [L2('¿Cuántos fragmentos tiene el Sello?', 'How many shards does the Seal have?'), ['5', '7', '9'], 1],
  [L2('¿Quién guarda el libro de los Tejedores en Albor?', 'Who keeps the Weavers\' book in Albor?'), [L2('La Anciana Mira', 'Elder Mira'), L2('Brienne', 'Brienne'), L2('Edrin Valcorde', 'Edrin Valcorde')], 0],
  [L2('¿En qué se convirtió el rey de Nerea?', 'What did the king of Nerea become?'), [L2('En el Kraken', 'The Kraken'), L2('En un Alado', 'One of the Winged'), L2('En el Rey del Invierno', 'The Winter King')], 0],
];
DLG_HOOKS.push((npc, opts) => { if (!/^acad_/.test(npc.id || '') || !NPCS[npc.id] || !G.P) return; const P = G.P, H = hunt(), n = Object.keys(H.lessons || {}).length;
  if ((P.tech || []).includes('a_arcana')) return;
  opts.unshift({ label: '📝 ' + L2('Examen de la Academia', 'Academy exam') + (n < 3 ? ' (' + n + '/3 ' + L2('lecciones', 'lessons') + ')' : ''), icon: ['book'], fn: () => {
    if (n < 3) { typeText(L2('Primero asiste a tres lecciones. Luego hablamos de exámenes.', 'Attend three lessons first. Then we\'ll talk about exams.')); return; }
    if (P.examDay === calDay() + 1) { typeText(L2('Ya te examinaste hoy. Repasa el Libro del Vínculo y vuelve mañana.', 'You already took the exam today. Review the Book of the Bond and come back tomorrow.')); return; }
    closeDialog(); P.examDay = calDay() + 1; const qs = EXAM.slice().sort(() => Math.random() - 0.5).slice(0, 4); let i = 0, ok = 0;
    const ask = () => { const [q, a] = qs[i]; openModal(`<h2>📝 ${L2('Examen', 'Exam')} ${i + 1}/4</h2><p class="lorep">${esc(q)}</p><div class="slist">${a.map((t, k) => `<button class="btn" data-ex="${k}" style="width:100%;margin:.2em 0">${esc(t)}</button>`).join('')}</div>`, 'party');
      $$('#modal [data-ex]').forEach(b => b.onclick = () => { if (+b.dataset.ex === qs[i][2]) ok++; i++; if (i < 4) return ask(); closeModal();
        if (ok >= 3) techLearn('a_arcana'); else toast(L2('Aciertos: ', 'Correct: ') + ok + '/4 · ' + L2('vuelve mañana', 'come back tomorrow'), 'warn', 3); markDirty(); }); };
    ask(); } }); });
if (typeof GSIS !== 'undefined') GSIS.push(['examen', '📝 ' + L2('Examen de la Academia', 'Academy exam'), () => [
  L2('Asiste a 3 lecciones en la Academia Arcana y habla con un profesor: «Examen de la Academia». Son 4 preguntas sobre la historia del mundo (todo está en el Libro del Vínculo).', 'Attend 3 lessons at the Arcane Academy and talk to a teacher: "Academy exam". It is 4 questions about the world\'s history (everything is in the Book of the Bond).'),
  L2('Con 3 aciertos aprendes la Técnica arcana (+4 % ataque y +4 % vida), que solo se enseña allí. Si fallas, vuelve al día siguiente.', 'With 3 correct answers you learn the Arcane technique (+4% attack and +4% HP), only taught there. If you fail, come back the next day.')], () => null]);
