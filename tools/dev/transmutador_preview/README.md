# Transmutador: primera prueba visual

Prototipo solicitado antes de integrar las habilidades de la clase. Parte de main 6.64, commit 259057f6b159120140fb4341cc2b730470265366, y no altera src/, el actualizador ni las partidas.

- Camiseta blanca con franja central, cuello y puños negros; cargo oliva; zapatillas blancas y negras; reloj en la muñeca izquierda.
- Los 10 cuerpos masculinos y 12 femeninos existentes, con poses nativas de caminar y las cuatro direcciones dibujadas independientemente. No se refleja el reloj al cambiar de perfil.
- Editor original appEditorHTML / bindAppEditor: cuerpo, piel, ojos, pelo, mechas, maquillaje y ropa.
- Se permiten prendas, cosméticos y armaduras existentes. El traje de referencia solo sustituye las ranuras sin equipamiento, y el botón Ropa personalizada permite usar las prendas base del editor.
- Se reutilizan las apariencias de armadura existentes; no se inventa una progresión nueva. El máximo actual es nivel 700.
- La clase se registra solamente al abrir esta prueba. No tiene todavía poderes, transformaciones ni balance propios y no se publica en el juego instalado.

Preparación: `python3 build.py`, después `python3 tools/dev/transmutador_preview/prepare.py`. Abrir `dist/Transmutador_prueba_visual.html`, o servir dist y abrir `transmutador.html`.

La prueba de compatibilidad recorre todos los peinados internos (incluye las variantes exclusivas de Pez aunque el editor original las oculta para clases humanas), los tintes y mechas, todas las armaduras y los 503 cosméticos. Es una comprobación de representación y personalización visual; el equipamiento jugable, las estadísticas y el guardado de una clase nueva se implementarán en su fase de integración.

El editor utiliza las listas y restricciones nativas por sexo. Los contadores de resultados distinguen peinados, combinaciones peinado/tinte, prendas y armaduras. Se exportan hojas PNG de los 22 cuerpos y cuatro fotogramas de cada caminata para elaborar GIF sin modificar el dibujo.

## Resultado comprobado

Motor completo 6.64 en navegador: **185.776 fotogramas**, 0 excepciones y **0 avisos internos de prendas**. 26.912 casos de pelo/caminata, 107.648 combinaciones de peinado y tinte, 1.408 de tinte y mechas, 44.264 de cosméticos, 4.840 de armaduras y 88 recorridos de caminata; además 352 fotogramas HD de cuerpos/direcciones/pasos.

Comprobación manual por los botones del editor: Femenino → Curvas → Ado detallado → Rosa; la selección, el tinte y la caminata se actualizan correctamente. Se inspeccionaron las hojas de los 22 cuerpos y las comparaciones de prendas, armadura nivel 700 y pelo original/teñido.

La prueba detectó que el gorro verde de Piman usa `of_bucket` sin paleta secundaria; el prototipo suministra la principal como secundaria para esa apariencia, evitando que el sistema de dibujo oculte el fallo. Esta corrección queda dentro de la prueba visual. La camiseta también omite la hebilla dorada que el detalle HD añade a otros tipos de ropa.
