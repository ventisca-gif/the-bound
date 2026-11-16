# The Bound: lore oficial y reglas para ampliarlo

> Léelo antes de añadir historia, NPCs que cuenten cosas, jefes, regiones, capítulos del Libro del Vínculo o cinemáticas.
> Sergio quiere que todo tenga sentido y encaje, **sin meter cosas raras**. Si una idea nueva contradice esto, pregúntale antes.
> Esto es el principio del juego: Sergio añadirá más. Lo nuevo se construye **encima** de lo de aquí, sin cambiarlo.

## Dónde está en el código

- Capítulos: `CRON` (`src/6zn_v37.js`, se amplía con `CRON.push` en `6zo_lore.js`, `6zyg_vigias.js`, `6zym_investiga.js`, `6zys_velo_roto.js`, `6zyu_velo3.js`). **Nunca reordenes ni borres capítulos**: los guardados usan su índice (`P.loreU`). Los nuevos van al final con `const CH_X = CRON.length; CRON.push(...)` y se colocan en su época con `ERAS[n][1].push(CH_X)`.
- Épocas: `ERAS` (`6zo_lore.js`). Pistas: `CLUES` (cada una abre un capítulo). Rumores: `LORE_LINES`. Personajes: `BOOK_WHO`.
- Cinemáticas: `src/6zz9a_cine.js`. Escenas en `CN_SC`, capítulo → escenas en `cnChapterScenes`, prólogo en `cnPrologue`. Un capítulo nuevo necesita su escena (o reutilizar una que encaje) y salir en `cnChapterScenes`.
- Súper jefes: `SUPER_BOSS` en `6zz9a_cine.js` (jefe → capítulo que se ve al vencerlo).

## La historia (canon)

1. **El Lienzo y Nihil** (antes del tiempo). Solo había un Lienzo negro y en silencio. Ese silencio es **Nihil**, una conciencia que no quiere ser vista ni nombrada. No quiere conquistar: quiere que nada exista para que nada lo mire.
2. **Los Tejedores** (hace 12.000 años). Pintaron el mundo encima de Nihil, casilla a casilla de 16 en 16 (por eso el mundo es de píxeles: es su firma). Vivían en **Celestia**, cinco islas sobre las nubes; en la más alta, la **Corona del Cielo**, está el **Gran Telar**, que hila cada vida. La **Escalera de Nubes** bajaba hasta **Albor**, que era su observatorio.
3. **El Vínculo**. Cada ser vivo está atado al mundo por un hilo de luz. El hilo de los **héroes** llega «al otro lado del cristal», hasta el jugador. Por eso los héroes se levantan al caer y los aldeanos no (los aldeanos caídos van al **Velo** y vuelven aturdidos).
4. **Los Alados**. Nacieron del hilo sobrante del Telar: guardianes del cielo con alas de luz y aureola (que guarda su nombre verdadero). Los arcángeles los mandan; las arpías son Alados que olvidaron su canción en las tormentas.
5. **La Guerra del Hilo** (hace 8.000 años). Nihil susurró al Tejedor más brillante, **Aurel**: «Te están mirando». Aurel cortó su hilo y se volvió **el Desatado**, que borra lo que toca. Cayó la mitad de los Alados, se rompió la Escalera de Nubes y los Tejedores gastaron toda su luz en encerrarlo con el **Sello de siete fragmentos**. Antes de apagarse sellaron Celestia tras un mar de nubes.
6. **Los siete guardianes**. Los fragmentos acabaron con el Rey Slime, el Ent Anciano, Gruk, Morgana, el rey muerto de Vael, el Gólem de Escarcha e Ignaroth (que fue un Alado). Nadie lo pidió: el poder del Sello los torció. Por eso son jefes.
7. **La Edad de los Reyes** (hace 5.000 años). Los pueblos olvidaron el cielo. Nacen **Vael** (su rey usó un fragmento para no morir: sigue en el trono, muerto y despierto) y **Nerea** (su hermano escondió otro en el mar y se volvió el **Kraken**), el Sultanato del desierto y el pueblo Pez. Se funda Albor sobre el observatorio; una familia guarda el libro de los Tejedores. **La Anciana Mira** es la última de esa familia; el Libro del Vínculo es su copia.
8. **Altavela**. Algunos Alados no cayeron: ataron sus casas a una nube y se fueron al este. Enseñaron la lengua de los Vientos a los pueblos de abajo (por eso Nerea, las Ruinas y el desierto hablan igual). Sus reyes duermen en tumbas sobre islotes.
9. **Hace 1.000 años**. El faraón de **Sahrim** quiso robar a los héroes su don de levantarse y lo sellaron en ámbar. El frío del Gólem quedó sin dueño bajo los Picos Helados y se volvió el Rey del Invierno y sus muñecos de nieve. **Edrin Valcorde**, pescador de la Costa Coral, encontró a un muchacho con una marca de luz: el primero que movió el hilo vacío, pero el hilo no estaba listo y se deshizo al amanecer. Edrin fundó los **Vigías del Alba**, que te sacaron del río al empezar el juego.
10. **Siempre**. El **Velo** (Mundo Espiritual) recoge los hilos rotos y los vuelve a anudar; recuerda lo que el mundo olvida. La **Ventisca** es la voz que escribe tierras nuevas cada estación desde más allá del Lienzo: las actualizaciones del juego. (Ventisca es el nombre de Sergio como creador: se trata con cariño, nunca como enemiga.)
11. **El héroe (hoy)**. El último Tejedor no gastó su luz en el Sello: la guardó en un **hilo vacío** en Albor con una nota: «Para quien venga del otro lado». El jugador lo tocó. **El héroe es ese hilo.** Por eso puede construir («tejer»), se levanta al caer y Nihil lo teme.
12. **La historia que se juega**. Vences a los siete guardianes y al **Desatado**. Su sombra sobrevive como el **Señor del Eclipse**, al que también vences. El Sello se debilita, Celestia se abre y **Nihil** sube en persona a la Corona del Cielo para deshacer el mundo hilo a hilo. **Lo vences**: Nihil no puede morir (es el negro bajo los colores), pero vuelve a dormirse. Con el Telar en tus manos, mientras alguien juegue, el Lienzo no vuelve a quedarse negro.
13. **Los hilos sueltos**. El Telar no se rompió del todo: sus hilos sueltos levantan tormentas. Vendaval, la Sierpe de Tormenta, nació de ellos.
14. **El Velo Roto**. El silencio de Nihil se coló por una grieta del Velo y pintó un continente al revés: siempre de noche, campanas que suenan solas, muertos que rezan. La **Luna Sonriente** es la cara que el silencio se puso para que alguien lo mirara. Fenrik, el Lobo Viejo, vigila la grieta; la bruja Malvia habla al portal.
15. **Velmira**. El muchacho de Edrin no se deshizo del todo: una parte cruzó la grieta y, para no olvidarse de sí, se fue poniendo caras ajenas. Olvidó su nombre, **Velmira**. El Hombre sin Rostro y El Sin Nombre son la misma persona, esperando a otro hilo vacío que se lo recuerde (tú).

16. **Las Tierras sin Pintar** (v4.69). El mundo termina donde se acaba el color: más allá del último pueblo (puente al este de Albor) la Ventisca todavía no ha pintado y el suelo es un boceto blanco sobre el vacío morado. Allí el silencio de Nihil no es negro sino **blanco**: **el Lienzo en Blanco**, un lienzo vacío que no quiere que nada se pinte nunca (otro rostro de Nihil, no un mal nuevo). Dibuja de memoria **ecos inacabados** de lo ya vencido (el Rey en Borrador es un eco de Varkhul) y borra lo que la Ventisca pinta. **Mael, la Pintora del Borde**, sigue los trazos de la Ventisca. En el cielo, una mano enorme con un pincel (la Ventisca) sigue pintando. Cada criatura vencida devuelve color a su zona. Zonas: Orilla del Boceto, Llanura de los Trazos, Ciénaga de los Borrones, El Marco Roto y El Lienzo en Blanco. Código: `src/6zz9k_sinpintar.js` y `src/6zz9m_v470.js`. Desde la v4.70 llega al nivel 400 y usa el bestiario y los jefes que dibujó Sergio: **Eco del Vencido** (un caballero hecho con los recuerdos de todo lo que ya venciste), **El Fragmento sin Color** (guardián del límite: marca dónde se acaba lo pintado), **La Sierpe de Tormenta** (los hilos sueltos del Gran Telar dibujados por el Lienzo: un eco de Vendaval) y el nuevo aspecto del **Lienzo en Blanco**. Criaturas: Babosa Borrada, Lobo Inacabado, Araña de Tiza, Caballero Vacío, Esqueleto Sin Tinta, Gólem de Cal, Espectro del Lienzo, Pez Pálido, Mimo del Silencio y Nihilito (un trocito suelto del silencio de Nihil).

17. **Lienya, la Diosa sin Pintar** (v4.75, descubrimiento). La **primera obra de la Ventisca**: la dibujó al principio para cuidar el borde del mundo, le dio el pelo blanco del lienzo y la dejó sin terminar. En lo que quedó sin pintar (su piel oscura) se metió el silencio de Nihil, y durante siglos miró a cada viajero sin saber si quería que la pintaran o que todo se borrara. Vigila al héroe desde lejos al cruzar el puente; tras el Lienzo en Blanco se revela y pelea (súper jefe de nivel 410). Vencida, el silencio la suelta: enseña el oficio de **Artista** (pintar el borde en los caballetes) y se puede enamorar. No es una diosa creadora ni rival de los Tejedores: es una criatura dibujada, como todo el mundo. Código: `src/6zz9t_diosa.js`.

18. **El sur de Albor, el Camposanto del Alba y Japón** (v4.81, lo que vendrá). Al sur de Albor el mar se volvió tierra nueva. Allí está el **Camposanto del Alba**: descansan los Vigías del Alba que cayeron defendiendo el valle (Edrin Valcorde incluido) y los vecinos cuyo hilo terminó de tejerse en el Telar. Los héroes no mueren de viejos (su hilo llega al otro lado del cristal); sus descendientes sí: crecen, se jubilan y, cuando el Telar termina su hilo, descansan aquí (no van al Velo, que solo recoge hilos *rotos*). La cuidadora es **Odila**. Junto al camposanto está el **Aeródromo de Albor**: la Ventisca empezó a pintar tierras de **su propio mundo, el del otro lado del cristal**, y la primera es **Japón** (Fuji, Kioto, Akihabara, Tokio, Shinjuku, Asakusa). Desde entonces llegan viajeros de muchos países de ese mundo (Brasil, México, Francia, Corea…) en aviones. Los japoneses no tienen nombre propio en el juego (Japonés 1, Japonesa 2…). Japón no tiene monstruos ni hilos rotos: es una tierra recién pintada. Código: `src/6zz9x_v481.js` y `src/6zz9y_japon.js`.

## Armas ancestrales (v4.65)

Armas hechas por los siete guardianes antes de que el Sello los torciera, o por reyes de la Edad de los Reyes. No suben con experiencia: despiertan restaurando su santuario (una estela antigua), hablando con quien conoció a su portador y venciendo a su creador. `ANC` en `src/6zz9g_vida.js`.
- Hoja de Brasa (guerrero): la forjó Ignaroth cuando aún era un Alado; la empuñó una guardiana de Arxar (Brienne la conoce).
- Báculo del Silencio Roto (mago): Morgana lo talló para no oír a Nihil (Ysolde).
- Arco del Ent Anciano (arquero): rama del Ent antes de guardar un fragmento (Doctora Selma).
- Colmillo de Ámbar (asesino): daga del faraón de Sahrim para cortar el hilo de los héroes (Alma Errante).
- Laúd de las Mareas (bardo): del rey de Nerea antes de volverse el Kraken (Mira).
- Guadaña del Rey de Vael (invocador): segaba los días que el rey no quería vivir (Lys).
- Aletas del Leviatán (pez): regalo del Leviatán al pueblo Pez cuando era un solo clan (Mira).

Las plantas mágicas, los festivales y el museo son vida cotidiana: no añaden historia nueva. Los hallazgos arqueológicos (`FINDS`) son restos de cosas que ya están en el canon (Nerea, Alados, Vael, Altavela, el faraón, el Telar, el Eclipse, el Sello).

## Súper jefes

Los jefes de la historia principal no son jefes normales: salen como **Súper jefe** (barra dorada, aviso grande la primera vez, cinemática al vencerlos). Hoy: el Desatado, el Señor del Eclipse, Nihil, la Luna Sonriente, El Sin Nombre El Lienzo en Blanco y Lienya. Nihil usa el dibujo de Sergio (v4.65) y solo aparece en la Corona del Cielo. Un jefe nuevo es súper jefe solo si cierra un capítulo de la historia principal; los demás (guardianes de zona, jefes del mundo, mazmorras) siguen siendo jefes.

## Reglas para ampliar el lore

1. **Todo lo oscuro viene de Nihil o del Sello.** Un villano nuevo es un siervo de Nihil, alguien torcido por un fragmento o un hilo del Telar, o un resto de algo ya vencido. No inventes otro dios maligno ni otro origen del mal.
2. **El hilo es la regla del mundo.** Revivir, construir, viajar al Velo, las subrazas o las maldiciones se explican con hilos (atados, cortados, sueltos o anudados de nuevo). No metas magia que no tenga que ver con hilos, colores o el silencio.
3. **El jugador es el hilo vacío.** No crees otro «elegido» igual que él. Puede haber otros que lo intentaron antes (como el muchacho de Edrin), pero el que lo logra eres tú.
4. **La cuarta pared es suave.** Los NPCs pueden insinuar la pantalla, los dedos o el guardado con humor, sin romper el tono ni hablar de menús, botones o código.
5. **Las fechas encajan en `ERAS`.** Antes del tiempo, hace 12.000, 8.000, 5.000 o 1.000 años, siempre, hoy y lo que vendrá. Un suceso nuevo va en una de ellas y no contradice lo que ya pasó allí.
6. **Lo vencido no vuelve igual.** Si un enemigo regresa, es su sombra, su eco o un resto (como el Eclipse o el Eco de Nihil), y la historia lo dice.
7. **Cada lugar nuevo dice quién lo hizo**: Tejedores, Alados, un reino de la Edad de los Reyes, el pueblo Pez, Nihil (lugares al revés) o la Ventisca (tierras nuevas).
8. **Bilingüe.** Todo texto de lore va con `L2('es', 'en')`.
9. **Cada capítulo nuevo** lleva: entrada en `CRON` al final, su época en `ERAS`, al menos una pista (`CLUES`) o un NPC que lo cuente, y su escena en las cinemáticas. Actualiza este archivo con un resumen de una o dos líneas.
