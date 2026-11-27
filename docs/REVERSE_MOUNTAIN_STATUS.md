# Reverse Mountain y Cabos Gemelos — 6.63, build 285

La actualización conserva `main` 5ee9729 (6.62), incluidos Brasil, Río de Janeiro, Iguazú y todas las novedades anteriores de Claude.

## Integración

- Zona nativa en una extensión libre al sureste del mar de Dawn, y=1052–1381. La propuesta anterior coincidía con Shells Town; las islas existentes se conservan.
- Canales navegables con el radio real de colisión del Going Merry; muelle, dos faros, casa y Crocus. Texturas y recursos del motor original.
- Las escenas usan el Merry y los atlas originales de la tripulación y del personaje del jugador.
- Se conserva `rmDone`. El Log Pose y el oro se registran junto con el progreso antes de la cinemática; el premio no se repite. Un encuentro interrumpido al abandonar Dawn se puede reintentar.
- La primera isla del Grand Line no está incluida; tendrá otro mapa marítimo. La salida futura permanece cerrada.

## Validación completada el 27/11/2026

Ejecución: https://github.com/ventisca-gif/the-bound/actions/runs/46077026337

- Compilación, traducción y SDK Photon presentes.
- 1210 muestras de canales, conservación del terreno anterior, Crocus, muelle, amarre e idempotencia correctos.
- Escenas, recompensa única, guardado, bloqueo/desbloqueo del desembarco, regreso al barco y salida futura cerrada comprobados dentro del juego.
- Regresión general y revisión estricta de 2043 prendas (1.329.900 dibujos), sin avisos de ajuste ni envolturas nuevas. Reutilización únicamente tras comprobar que sus entradas son idénticas, normalizando versión/novedades/pie de pantalla.
- Actualizador: descarga gzip, conservación del oro de la partida, rechazo de SHA incorrecto, aviso de APK mínimo, rollback por arranque roto y por espera de 60 segundos, y alternativa HTML cuando falla el gzip. Sin errores de página inesperados.
- Partidas de v4.3 y v5.31 migradas a v6.63 conservando nivel, oro y objetos, y guardadas de nuevo correctamente.
- Acciones de todos los mapas: `RESULTS` vacío, sin errores.
- HTML y gzip generados y comprobados por tamaño, SHA-256 y descompresión idéntica al HTML. `minApk` sigue en 24.

La prueba del actualizador se corrigió para que la versión falsa se anuncie después de crear y guardar la partida; antes, su aviso podía tapar el botón de creación. Las pruebas específicas distinguen los mensajes conocidos de tiempo de espera del servidor externo de Photon de las excepciones del juego.
