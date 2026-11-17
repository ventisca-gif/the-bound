# Gi naranja: traje aprobado

Petición de Sergio: adaptar el traje de la referencia 45558.jpg a las cinco estructuras femeninas y cinco masculinas; conservar el busto existente. Mostrar ejemplos antes de vender o publicar.

Implementación provisional: `src/6zz9zu_gi_preview.js`. Chaqueta naranja sin mangas, cuello cruzado, emblema fino, fajín azul con nudo y colas animadas, pantalón ancho, pies descalzos. Conserva cuerpo, cara, pelo y caminata. La versión 4.98 build 119 se prepara para el actualizador después de pasar las pruebas. Compra integrada en el tendero de cómics por 24.000 de oro.

Tienda identificada: tienda de cómics al oeste de Akihabara, Japón, punto exterior [127,52], interior jp_comics_in. Dependiente jp_comic_st (Tendero de cómics / Otaku de Akihabara). El aspecto fue aprobado; la venta usa el sistema existente de cosméticos. La integración se prueba en tests/gi/browser.py. Originalmente se planificó mediante el sistema existente de cosméticos, sin reemplazar sus mangas ni diálogos.

Generar muestras: `node tools/dev/gi_preview/render.cjs` y `python3 tools/dev/gi_preview/sheets.py`. El script usa los módulos originales de dibujo, estructuras, prendas y HD con canvas; no arranca el juego completo ni simula una sesión Android. Produce 160 fotogramas (10 cuerpos × 4 direcciones × 4 pasos) y ejecuta fitCheck para las tres piezas, incluyendo las estructuras número 4: 900 comparaciones, 0 avisos. Antes de publicar se requiere validar en navegador con el juego completo, los peinados detallados y el guardado/equipamiento de las tres piezas.
