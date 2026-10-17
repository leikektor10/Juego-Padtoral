import type { Chapter } from '../types';

// Cada capítulo se completa al resolver sus deducciones de tipo 'eleccion' u 'orden'.
// Las preguntas de tipo 'texto' son interpretativas: se guardan, nunca se califican.

export const LOCK_HINTS: [string, string, string] = [
  'Leed el papel que había dentro de la funda: el PIN es una fecha.',
  '«La enana» es la hermana pequeña del propietario. Mirad con atención el fondo de pantalla: ¿qué se celebra y qué pone en la tarta?',
  'El PIN tiene cuatro cifras: día y mes del cumpleaños (DDMM).',
];

export const chapters: Chapter[] = [
  {
    id: 1,
    title: 'El teléfono',
    objective: 'Identificad al propietario, sus relaciones más cercanas y el último día en que estuvo en el centro juvenil.',
    intro:
      'El teléfono se enciende. Se conecta al wifi del centro y empieza a descargar 47 días de mensajes pendientes. Antes de sacar conclusiones, averiguad de quién es y cuándo estuvo aquí por última vez.',
    questions: [
      {
        id: 'q1_propietario',
        prompt: '¿A quién pertenece el teléfono?',
        type: 'eleccion',
        options: [
          { id: 'ivan', label: 'Iván Morales' },
          { id: 'marcos', label: 'Marcos Ferrer Lozano' },
          { id: 'alvaro', label: 'Álvaro Gil' },
          { id: 'nacho', label: 'Ignacio Varela (Nacho)' },
        ],
        correct: 'marcos',
        okFeedback: 'Marcos Ferrer Lozano, 17 años. Dejó de venir al centro hace semanas.',
        koFeedback: 'Revisad la app Ajustes y fijaos en cómo le llaman en los chats.',
        support: ['c_propietario'],
      },
      {
        id: 'q1_ultimo_dia',
        prompt: '¿Cuál fue el último día que Marcos estuvo en el centro juvenil?',
        type: 'eleccion',
        options: [
          { id: '17ene', label: 'Sábado 17 de enero (convivencia)' },
          { id: '24ene', label: 'Sábado 24 de enero' },
          { id: '31ene', label: 'Sábado 31 de enero (fiesta de Don Bosco)' },
          { id: '7feb', label: 'Sábado 7 de febrero' },
        ],
        correct: '31ene',
        okFeedback: 'El 31 de enero. Iván recuerda otra cosa: los testimonios no siempre coinciden con las pruebas.',
        koFeedback: 'No os fieis solo de lo que dice alguien en el grupo. ¿Qué dicen las fotos, el mapa y los ajustes del teléfono?',
        support: ['c_fiesta_cartel', 'c_ultima_conexion', 'c_mapa_ultimo', 'c_ivan_ultimo_dia'],
      },
      {
        id: 'q1_ultima_conexion',
        prompt: '¿Cuándo y dónde se conectó el teléfono por última vez?',
        type: 'eleccion',
        options: [
          { id: 'casa', label: '31 de enero, 16:05, en el wifi de casa' },
          { id: 'cj', label: '31 de enero, 21:47, en el wifi del centro juvenil' },
          { id: 'feb', label: '1 de febrero, 03:12, con datos móviles' },
          { id: 'ies', label: '30 de enero, 14:20, en el instituto' },
        ],
        correct: 'cj',
        okFeedback: 'Su última conexión fue aquí, en el centro. Retened ese dato.',
        koFeedback: 'Ajustes guarda las redes wifi y la hora de la última conexión. ¿Tenía datos móviles?',
        support: ['c_ultima_conexion', 'c_bateria'],
      },
      {
        id: 'q1_cercanos',
        prompt: 'Primera impresión (no se corrige): ¿quiénes parecen las personas más cercanas a Marcos? ¿Por qué?',
        type: 'texto',
      },
    ],
    hints: [
      'Los teléfonos guardan dónde y cuándo se conectaron por última vez. Abrid Ajustes.',
      'Comparad lo que dice Iván en el grupo (21 de febrero) con las fotos del 31 de enero de la Galería.',
      'La Cronología del expediente ordena lo que vais descubriendo. Fijaos en el 31 de enero entre las 18:30 y las 21:47.',
    ],
    outro: 'Marcos estuvo aquí el 31 de enero. Su teléfono también. Desde esa noche, silencio.',
  },
  {
    id: 2,
    title: 'Todo parecía normal',
    objective: 'Examinad fotos, chats y calendario. Descubrid qué había detrás de la imagen que los demás tenían de Marcos.',
    intro:
      'Para el grupo, Marcos era «el del colador»: el gracioso, el que siempre ayudaba. Las fotos y los chats cotidianos cuentan esa historia… y otra, más bajita, por debajo.',
    questions: [
      {
        id: 'q2_planes',
        prompt: '¿Por qué cancelaba Marcos tantos planes por la tarde?',
        type: 'eleccion',
        options: [
          { id: 'castigo', label: 'Estaba castigado por las notas' },
          { id: 'cansado', label: 'Se había cansado de sus amigos' },
          { id: 'lucia', label: 'Cuidaba de su hermana mientras su madre trabajaba' },
          { id: 'estudio', label: 'Pasaba las tardes estudiando para selectividad' },
        ],
        correct: 'lucia',
        okFeedback: 'Recogía a Lucía, le daba la cena y le ayudaba con los deberes. Sus amigos solo veían que «nunca podía».',
        koFeedback: 'Ampliad la foto de la nevera y leed el chat con su madre.',
        support: ['c_lucia_cuidado', 'c_mama_turnos', 'c_autorizado_recogida', 'c_ivan_siempre_dice'],
      },
      {
        id: 'q2_noviembre',
        prompt: '¿Qué ocurrió en casa de Marcos en noviembre que casi nadie sabía?',
        type: 'eleccion',
        options: [
          { id: 'mudanza', label: 'Se mudaron de barrio' },
          { id: 'padre', label: 'Su padre se fue de casa' },
          { id: 'abuela', label: 'Murió su abuela' },
          { id: 'paro', label: 'Su madre perdió el trabajo' },
        ],
        correct: 'padre',
        okFeedback: 'El 15 de noviembre. Cuatro cajas. En el centro, «todo igual».',
        koFeedback: 'Buscad en la Galería una foto de noviembre sin personas, y leed el chat de Mamá de ese día.',
        support: ['c_padre_se_va', 'c_busqueda_custodia', 'c_nochebuena'],
      },
      {
        id: 'q2_quien_sabia',
        prompt: '¿Quién sabía lo de su padre?',
        type: 'eleccion',
        options: [
          { id: 'ivan', label: 'Iván, su mejor amigo' },
          { id: 'nacho', label: 'Nacho, el animador' },
          { id: 'sara', label: 'Sara' },
          { id: 'todos', label: 'Todo el grupo' },
        ],
        correct: 'sara',
        okFeedback: 'Solo Sara, y desde el 13 de enero. «No se lo he dicho a nadie. Ni a Iván.»',
        koFeedback: 'Mirad el historial de llamadas de madrugada y el chat con esa persona.',
        support: ['c_sara_padre', 'c_llamada_sara'],
      },
      {
        id: 'q2_imagen',
        prompt: 'Para conversar (no se corrige): ¿qué imagen tenía el grupo de Marcos? ¿Qué prueba os ha hecho dudar de esa imagen?',
        type: 'texto',
      },
    ],
    hints: [
      'En la foto de la nevera (5 de enero) hay una nota adhesiva. Ampliadla y pulsad sobre ella.',
      'Leed el chat de Mamá de noviembre y buscad en la Galería una foto de un pasillo con cajas.',
      '¿Con quién habló Marcos de madrugada el 13 de enero? Revisad Llamadas y ese chat.',
    ],
    outro: 'Hacía reír a todos y cargaba con una casa. Las dos cosas eran verdad a la vez.',
  },
  {
    id: 3,
    title: 'Los mensajes sin respuesta',
    objective: 'Abrid el diario y recuperad los archivos eliminados. Reconstruid las señales que pasaron inadvertidas… y lo que Marcos intentó hacer.',
    intro:
      'La carpeta «Cosas mías» de Notas está protegida con contraseña. La papelera del teléfono guarda mensajes que Marcos escribió y borró. Para recuperarlos hace falta contexto.',
    questions: [
      {
        id: 'q3_ayuda',
        prompt: '¿Qué hizo Marcos en enero para pedir ayuda?',
        type: 'eleccion',
        options: [
          { id: 'nada', label: 'Nada: lo ocultó todo hasta el final' },
          { id: 'sara_orient', label: 'Se lo contó a Sara y fue a la orientadora del instituto' },
          { id: 'padre', label: 'Llamó a su padre para pedirle que volviera' },
          { id: 'nacho', label: 'Se lo contó todo a Nacho' },
        ],
        correct: 'sara_orient',
        okFeedback: 'Lo intentó. Le costó mucho, pero lo intentó: Sara el 13, la orientadora el 20.',
        koFeedback: 'Revisad el calendario del 20 de enero, el chat con Sara y el diario.',
        support: ['c_sara_padre', 'c_orientadora_llamada', 'c_orientadora_visita', 'c_d_orientadora'],
      },
      {
        id: 'q3_plan31',
        prompt: '¿Qué pensaba hacer Marcos la noche del 31 de enero, después de la fiesta?',
        type: 'eleccion',
        options: [
          { id: 'irse', label: 'Irse de casa sin decir nada' },
          { id: 'dejar', label: 'Despedirse del centro juvenil' },
          { id: 'contar', label: 'Contárselo todo a Sara (y el lunes, a Nacho)' },
          { id: 'fiesta', label: 'Irse de fiesta con Iván y Noa' },
        ],
        correct: 'contar',
        okFeedback: '«Esta noche se lo cuento a Sara. Todo. Y el lunes, a Nacho. Esta vez sí.» A las 21:30 escribió su madre.',
        koFeedback: 'Leed la última entrada del diario y buscad en Eliminados el borrador de las 21:46.',
        support: ['c_diario_31', 'c_fiesta_agenda', 'c_hablar_nacho', 'c_del_borrador_sara'],
      },
      {
        id: 'q3_senal',
        prompt: 'Para conversar (no se corrige): elegid un mensaje que el grupo leyó como una broma y que ahora leéis de otra manera. ¿Qué cambió?',
        type: 'texto',
      },
    ],
    hints: [
      'La carpeta «Cosas mías» tiene contraseña. Marcos dibuja un cómic: ¿cómo se llama su protagonista? (Galería, cuaderno; o el chat con Sara).',
      'Los archivos eliminados se recuperan cuando tenéis el contexto adecuado. Cada uno os dice con qué prueba está relacionado.',
      'Comparad la última entrada del diario (31 de enero) con el borrador recuperado de las 21:46 y con el mensaje de su madre de las 21:30.',
    ],
    outro: 'Marcos no desapareció de golpe. Se fue quedando en la esquina mientras intentaba, a su manera, pedir ayuda.',
  },
  {
    id: 4,
    title: 'Lo que nadie sabía',
    objective: 'La sincronización ha terminado. Contrastad lo que el grupo creía con lo que realmente pasó.',
    intro:
      'Sincronización completada (100 %). Han llegado los últimos mensajes: los de remitentes que no están en la agenda y el aviso del operador con las llamadas perdidas. Algunas hipótesis van a caer.',
    questions: [
      {
        id: 'q4_donde',
        prompt: '¿Dónde está Marcos?',
        type: 'eleccion',
        options: [
          { id: 'hospital', label: 'En un hospital' },
          { id: 'padre', label: 'En casa de su padre' },
          { id: 'rosa', label: 'En Santa Olaria, en casa de su tía Rosa, con su hermana' },
          { id: 'nadie', label: 'No se puede saber' },
        ],
        correct: 'rosa',
        okFeedback: 'Desde el 2 de febrero. Su madre sigue en la ciudad, buscando un piso que pueda pagar.',
        koFeedback: 'Leed los mensajes del número desconocido. ¿Quién es Paco? Buscad «Santa Olaria» en el teléfono.',
        support: ['c_rosa_msg', 'c_marcos_msg', 'c_tia_rosa', 'c_irene_traslado', 'c_se_alquila'],
      },
      {
        id: 'q4_porque',
        prompt: '¿Por qué dejó de responder a todos?',
        type: 'eleccion',
        options: [
          { id: 'decidio', label: 'Decidió cortar con todo el mundo' },
          { id: 'perdio', label: 'Dejó el móvil en el centro la noche del 31, se marchó de la ciudad y no tenía los números de nadie' },
          { id: 'quitaron', label: 'Sus padres le quitaron el móvil como castigo' },
          { id: 'roto', label: 'Se le rompió el móvil y no le importó' },
        ],
        correct: 'perdio',
        okFeedback: 'Su silencio no fue una decisión. Pero su silencio, sumado al de todos, se volvió una distancia.',
        koFeedback: 'Juntad el mensaje de su madre de las 21:30, la foto de las 21:41, los ajustes de batería y el mensaje del 12 de febrero.',
        support: ['c_mama_2130', 'c_almacen_foto', 'c_bateria', 'c_marcos_msg', 'c_rosa_msg'],
      },
      {
        id: 'q4_telefono',
        prompt: '¿Dónde estuvo el teléfono durante esos 47 días?',
        type: 'eleccion',
        options: [
          { id: 'casa', label: 'En su antigua casa, olvidado en un cajón' },
          { id: 'objetos', label: 'En la caja de objetos perdidos del centro' },
          { id: 'almacen', label: 'En el almacén del centro juvenil, detrás de las cajas de decoración de la fiesta' },
          { id: 'rosa', label: 'En Santa Olaria, en casa de su tía' },
        ],
        correct: 'almacen',
        okFeedback: 'Estuvo aquí todo el tiempo. Su tía llamó para preguntar por él. Él escribió pidiendo que alguien «del centro» avisara a Sara. La respuesta estaba en nuestro almacén.',
        koFeedback: 'Volved a la última foto de la Galería (21:41) y al chat con Álvaro de esa tarde.',
        support: ['c_almacen_foto', 'c_cargador_almacen', 'c_rosa_msg', 'c_almacen_convocatoria'],
      },
      {
        id: 'q4_quien_intento',
        prompt: 'Para conversar (no se corrige): ¿quién intentó acercarse a Marcos después del 31 de enero? ¿Por qué nadie juntó las piezas?',
        type: 'texto',
      },
    ],
    hints: [
      'Ha terminado la sincronización. En Mensajes hay conversaciones nuevas: una de un número que no está en Contactos.',
      '¿Quién es Paco? ¿Y Rosa? Buscad en Contactos, en el Calendario (Nochebuena) y en el Mapa.',
      'Volved a la última foto de la Galería (31 de enero, 21:41) y al chat con Álvaro. ¿Dónde se quedó el teléfono?',
    ],
    outro: 'Cada uno hizo algo, por separado. Nadie juntó las piezas. Ahora las tenéis vosotros.',
  },
  {
    id: 5,
    title: 'La última conexión',
    objective: 'Ordenad los hechos y presentad vuestra reconstrucción final.',
    intro:
      'Ya tenéis casi todas las piezas. Falta lo más difícil: contar la historia entera sin quedaros con una sola causa ni con un solo culpable, y reconocer lo que no se puede saber.',
    questions: [
      {
        id: 'q5_orden',
        prompt: 'Ordenad estos acontecimientos de más antiguo a más reciente.',
        type: 'orden',
        options: [
          { id: 'o_padre', label: 'Su padre se va de casa' },
          { id: 'o_escape', label: 'Descubre el escape room al que no le invitaron' },
          { id: 'o_sara', label: 'Le cuenta a Sara lo de su padre' },
          { id: 'o_orientadora', label: 'Va a la orientadora del instituto' },
          { id: 'o_buenasnoches', label: 'Renuncia a dar las buenas noches' },
          { id: 'o_fiesta', label: 'Fiesta de Don Bosco: el móvil se queda en el almacén' },
          { id: 'o_traslado', label: 'Se va a vivir con su tía a Santa Olaria' },
          { id: 'o_saranacho', label: 'Sara pide ayuda a Nacho' },
          { id: 'o_mensaje', label: 'Marcos escribe a su propio número' },
          { id: 'o_hallazgo', label: 'Aparece el teléfono en el almacén' },
        ],
        correct: [
          'o_padre',
          'o_escape',
          'o_sara',
          'o_orientadora',
          'o_buenasnoches',
          'o_fiesta',
          'o_traslado',
          'o_saranacho',
          'o_mensaje',
          'o_hallazgo',
        ],
        okFeedback: 'La cronología está completa.',
        koFeedback: 'Algunas piezas no están en su sitio. Usad la Cronología del expediente.',
      },
      {
        id: 'q5_explicacion',
        prompt: '¿Qué explicación recoge mejor lo que habéis comprobado?',
        type: 'eleccion',
        options: [
          { id: 'cansado', label: 'Se cansó del grupo y decidió alejarse.' },
          {
            id: 'completa',
            label:
              'Llevaba meses cargando con cosas que casi nadie conocía. Intentó pedir ayuda. Una crisis familiar le llevó a casa de su tía y, sin móvil, su silencio se interpretó como una decisión. Nadie juntó las piezas.',
          },
          { id: 'ivan', label: 'Iván le dio la espalda y por eso se fue.' },
          { id: 'grave', label: 'Le ocurrió algo grave que nadie podía haber evitado.' },
        ],
        correct: 'completa',
        okFeedback: 'No hay una sola causa ni un solo culpable.',
        koFeedback: 'Esa explicación se queda con una sola pieza. Revisad vuestras hipótesis y las contradicciones de la Cronología.',
      },
      {
        id: 'q5_responsabilidad',
        prompt: 'Para conversar (no se corrige): ¿qué podría haber hecho distinto cada persona? ¿Y la comunidad en su conjunto?',
        type: 'texto',
      },
    ],
    hints: [
      'Usad la Cronología: cada hecho confirmado tiene fecha y hora.',
      'Primero noviembre (su padre); luego enero en este orden: escape room, Sara, orientadora, buenas noches; después la fiesta.',
      'La explicación correcta no culpa a nadie en concreto y reúne varios factores a la vez.',
    ],
    outro: '',
  },
];

export const chapterById = (id: number) => chapters.find((c) => c.id === id)!;

// Preguntas del cuaderno de hipótesis (siempre editables).
export const hypothesisQuestions = [
  { id: 'h_porque', q: '¿Por qué dejó de acudir al centro?' },
  { id: 'h_viviendo', q: '¿Qué estaba viviendo?' },
  { id: 'h_quien', q: '¿Quién conocía realmente su situación?' },
  { id: 'h_senales', q: '¿Qué señales se interpretaron mal?' },
  { id: 'h_desconocido', q: '¿Qué información sigue siendo desconocida?' },
];
