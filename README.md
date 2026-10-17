# ÚLTIMA CONEXIÓN

*Un teléfono. Cuarenta y siete días de silencio. Una historia que nadie terminó de conocer.*

Juego narrativo de investigación digital con finalidad pastoral, pensado para grupos juveniles de centros salesianos. Los participantes examinan el teléfono móvil de Marcos, un chico del centro juvenil que dejó de venir sin dar explicaciones, y reconstruyen sus últimos días conocidos. La verdadera pregunta no es solo *qué le pasó*, sino **cuánto conocemos a las personas con las que compartimos la vida**.

- Duración: **35–50 minutos** de investigación + **20–30 minutos** de diálogo.
- Público: jóvenes a partir de 14–15 años, con un adulto que facilite.
- Todo funciona en el navegador, en español, sin conexión a internet una vez cargado.

> Toda la historia, los personajes, los lugares, los números y los archivos son ficticios.

---

## Instalación y ejecución

Requisitos: [Node.js](https://nodejs.org) 18 o superior (probado con Node 22).

```bash
npm install        # instala las dependencias (una sola vez)
npm run dev        # modo desarrollo: abre http://localhost:5173
```

Para una sesión con un grupo es preferible la versión compilada:

```bash
npm run build      # genera la carpeta dist/
npm run preview    # la sirve en http://localhost:4173
```

La carpeta `dist/` es una web estática: se puede subir tal cual a cualquier servidor o servicio de alojamiento estático (GitHub Pages, Netlify, el servidor del centro…), también dentro de una subcarpeta. **No funciona abriendo `dist/index.html` con doble clic** (los navegadores bloquean los módulos JavaScript en `file://`); hace falta servirla con `npm run preview` o con un servidor web.

### Otras órdenes

| Orden | Para qué sirve |
|---|---|
| `npm test` | Pruebas de coherencia narrativa y de la lógica del juego (Vitest). |
| `npm run typecheck` | Comprobación de tipos de TypeScript. |
| `npm run fotos` | Regenera las ilustraciones provisionales de `public/media/fotos`. |
| `npm run matriz` | Regenera `docs/MATRIZ_EVIDENCIAS.md` a partir de los datos. |

---

## Cómo se usa en una sesión

1. Abrid el juego en un ordenador conectado a un proyector (recomendado) o en varios dispositivos, uno por equipo de 3–5 personas.
2. En la portada pulsad **«Encender dispositivo»**. Se muestra el aviso de contenido y el informe del hallazgo.
3. El teléfono se enciende. El PIN se deduce del papel encontrado en la funda y del fondo de pantalla.
4. La investigación avanza en **cinco capítulos**. Cada uno tiene un objetivo y unas deducciones en la pestaña **Caso** del expediente. El siguiente capítulo se abre al resolver las del actual.
5. Al terminar, el grupo presenta la reconstrucción final, escucha el epílogo y la pantalla pasa a la **reflexión**: diez preguntas, una a una, y la dinámica «Una conexión real».

La [guía para quien facilita](docs/GUIA_FACILITADOR.md) detalla tiempos, roles, seguridad emocional y soluciones. También está dentro del juego (portada → «Guía para quien facilita»).

### Guardado y reinicio

- El progreso se **guarda automáticamente** en el navegador (localStorage) y se recupera al recargar: la portada ofrece «Continuar investigación».
- Para empezar con otro grupo, cualquiera de estas opciones (todas piden confirmación):
  - Portada → **«Empezar de nuevo»**.
  - Durante el juego → **Ajustes → «Reiniciar partida»**.
  - Al final de la reflexión → **«Preparar para otro grupo»**.
- **Pausa** (barra superior) oculta el juego sin perder nada.
- Si el grupo va justo de tiempo: **Ajustes → «Dar por resuelto el capítulo N»**.

---

## Qué está implementado

**El teléfono** (interfaz principal), con todas sus aplicaciones funcionales:

| App | Contenido |
|---|---|
| Pantalla de bloqueo | Hora, fecha, batería cargando, notificaciones de sincronización, fondo examinable, teclado de PIN (también con teclado físico). |
| Mensajes | 11 conversaciones (amigos, grupo del centro, animador, familia, compañera de clase, número desconocido, SMS del operador), con mensajes borrados, notas de voz y fotos. Separador visual de los mensajes que llegaron al encender el teléfono. |
| Galería | 17 fotografías con fecha, lugar y origen; visor a pantalla completa con ampliación, navegación y **detalles examinables** (puntos interactivos). |
| Notas | Notas cotidianas y la carpeta bloqueada **«Cosas mías»** (diario de 12 entradas, protegido con contraseña). |
| Grabadora | 6 audios con reproductor funcional, subtítulos sincronizados, transcripción completa y voz sintética opcional. |
| Teléfono | Historial de llamadas (entrantes, salientes, perdidas, rechazadas). |
| Calendario | Vista de agenda y vista mensual; eventos realizados, cancelados y pendientes. |
| Archivos | Documentos, descargas, correo y **Eliminados**: herramienta de recuperación que reconstruye archivos cuando se ha encontrado la prueba relacionada (algunos solo en parte; uno no se puede recuperar). |
| Contactos | Fichas construidas con lo descubierto: último contacto, mensajes compartidos, pistas relacionadas y preguntas abiertas que se resuelven al investigar. |
| Mapas | Plano esquemático de una ciudad ficticia con el historial de ubicaciones. |
| Navegador | Historial de búsquedas. |
| Buscar | Buscador en todo el contenido accesible del dispositivo (sin tildes, con fragmentos resaltados). |
| Ajustes | Información del dispositivo, redes wifi y última conexión, registro de batería, fondo de pantalla. |

**El expediente** (capa de investigación):

- **Caso**: objetivo del capítulo, deducciones calificables (elección, ordenación) y preguntas abiertas que no se corrigen.
- **Pistas**: 90 pistas que se registran al leer, ampliar, escuchar o recuperar; filtros por tipo y orden; ficha de cada pista con su fuente («Abrir la prueba»), certeza (hecho / testimonio / interpretación) y contradicciones.
- **Cronología**: se construye con las pistas fechadas, distingue hechos de suposiciones, marca la última conexión y **detecta contradicciones** entre testimonios y pruebas.
- **Tablero (Reconstrucción)**: tarjetas de pistas, personas, fechas e hipótesis; arrastrar (ratón, táctil o teclado), conectar, etiquetar y borrar conexiones. No se califica.
- **Hipótesis**: cinco preguntas con versiones guardadas y aviso de pistas nuevas desde la última versión.
- **Ayuda**: tres niveles por capítulo (Observación, Relación, Orientación) que no revelan la solución.

**Final y reflexión**: resumen (lo comprobado, señales, hipótesis corregidas, preguntas sin respuesta, momentos de acompañamiento, vuestras hipótesis), epílogo, transición gradual a una pantalla clara, diez preguntas una a una con notas para quien facilita, dinámica «Una conexión real» (privada, borrable) y frase final.

**Accesibilidad**: interfaz en español; ordenador, tableta y móvil (en pantallas estrechas se alterna entre Teléfono y Expediente); tamaño de texto ajustable; navegación por teclado y foco visible; etiquetas accesibles; transcripciones de todos los audios; sonidos y animaciones desactivables (y respeto de `prefers-reduced-motion`); pausa; guardado automático.

---

## Recursos visuales y sonoros (provisionales)

- **Fotografías**: las 17 imágenes de la galería y el fondo de pantalla son **ilustraciones provisionales** en SVG generadas por `scripts/generar-fotos.mjs`. Mantienen la coherencia de la historia (mismos personajes, ropa y lugares) pero no son fotografías. No se ha usado ninguna imagen de personas reales.
- **Cómo sustituirlas** sin tocar el código:
  1. Copiad la fotografía nueva (JPG, PNG, WebP o SVG) en `public/media/fotos/`.
  2. En `public/media/manifest.json`, cambiad la ruta del identificador correspondiente (`p01` … `p17`, `fondo-bloqueo`). El manifiesto indica qué archivo corresponde a cada prueba.
  3. Si el encuadre cambia, revisad las coordenadas de los detalles examinables (`hotspots`, en %) de esa foto en `src/data/photos.ts`.
  - Usad solo imágenes originales de personajes ficticios o con licencia compatible. **Nunca fotos de jóvenes reales del centro.**
- **Audio**: no hay grabaciones reales. Cada nota de voz es un reproductor funcional con tiempo simulado, subtítulos sincronizados y transcripción completa; opcionalmente lee las frases con la voz sintética del navegador. Ninguna pista depende de poder oír el audio.
- **Sonidos de interfaz**: sintetizados con Web Audio; se desactivan en Ajustes.

---

## Estructura del proyecto

```
src/
  data/            Historia: contactos, chats, fotos, diario, audios, registros, pistas, capítulos, final
  state/           Estado del juego (reducer), persistencia y contexto
  components/
    PhoneShell, LockScreen, HomeScreen
    apps/          MessagesApp, GalleryApp + PhotoViewer, NotesApp (diario), AudioApp + AudioPlayer,
                   CallsApp, CalendarApp, FilesApp, ContactsApp, SearchApp, MapsApp, BrowserApp, SettingsApp
    investigation/ CasePanel, CaseTab, CluesTab, Timeline, InvestigationBoard, HypothesisJournal,
                   HintSystem, EvidenceDrawer
    Screens (portada, aviso, informe), EndingScreen, DebriefScreen, FacilitatorGuide, SettingsDialog
  styles/
public/media/      Ilustraciones y manifiesto de imágenes
docs/              Biblia narrativa, matriz de evidencias, guía para quien facilita
tests/             Pruebas de coherencia y de lógica
scripts/           Generadores de ilustraciones y de la matriz
```

Los datos narrativos están separados de la interfaz y tipados (`src/types.ts`). Cada pista tiene identificador, fecha, certeza, personas, fuente y contradicciones; cada contenido puede llevar su condición de desbloqueo (`availableFrom`). Las pruebas automáticas comprueban, entre otras cosas, que toda pista se puede descubrir, que cada deducción es resoluble con las pruebas disponibles en su capítulo, que las revelaciones del capítulo 4 no aparecen antes, el orden cronológico de los chats y que Marcos no escribe nada después de la última conexión.

## Documentación narrativa

- [`docs/BIBLIA_NARRATIVA.md`](docs/BIBLIA_NARRATIVA.md): protagonista, personajes, cronología completa, hipótesis iniciales, revelaciones, resolución y preguntas abiertas (**contiene la solución**).
- [`docs/MATRIZ_EVIDENCIAS.md`](docs/MATRIZ_EVIDENCIAS.md): qué revela cada prueba y qué deducción sostiene (generada desde los datos).
- [`docs/GUIA_FACILITADOR.md`](docs/GUIA_FACILITADOR.md): guía de la sesión.

## Limitaciones conocidas

- Las imágenes son ilustraciones, no fotografías; los audios son transcripciones con reproductor simulado.
- El progreso se guarda en el navegador de cada dispositivo: no se sincroniza entre equipos.
- El tablero de reconstrucción funciona en móvil, pero es más cómodo en pantallas grandes.
- La voz sintética depende del navegador y del sistema operativo (puede no haber voz en español).
- Los teléfonos de ayuda que aparecen son de España; adaptadlos a vuestro país.
