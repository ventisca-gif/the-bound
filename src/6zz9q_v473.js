// ================= v4.73: EL PODER SE CALCULA AL FINAL =================
// Los bonos añadidos después de la 4.52 (técnicas, armas ancestrales, Trazos, «borrado»…) cambiaban el ataque, la defensa y
// la vida, pero el número de Poder se calculaba antes. Esta envoltura va la última (6zz9q) y lo vuelve a calcular.
{ const _cs = calcStats; calcStats = function (P) { const r = _cs.apply(this, arguments); const S = (P && P.S) || r; if (S && S.atk !== undefined) S.power = Math.round(S.atk * 2 + S.def * 1.5 + S.maxhp / 10); return r; }; }
