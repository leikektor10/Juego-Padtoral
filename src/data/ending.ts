// Contenido de la resolución, el epílogo y la reflexión posterior.

export const endingSummary = {
  comprobado: [
    { text: 'El teléfono es de Marcos Ferrer, 17 años. Estuvo en el centro por última vez el 31 de enero, en la fiesta de Don Bosco, para la que dibujó el cartel.', clues: ['c_fiesta_cartel', 'c_ultima_conexion'] },
    { text: 'Su padre se fue de casa en noviembre. Su madre trabaja de tarde y Marcos cuidaba de su hermana Lucía casi todos los días.', clues: ['c_padre_se_va', 'c_lucia_cuidado'] },
    { text: 'Suspendía Matemáticas, dudaba de su futuro en Bellas Artes y sentía que sus amistades cambiaban sin él.', clues: ['c_notas', 'c_escape_room', 'c_padre_dibujitos'] },
    { text: 'Intentó pedir ayuda: se lo contó a Sara y fue a la orientadora. El 31 de enero pensaba contárselo todo a Sara y, el lunes, a Nacho.', clues: ['c_sara_padre', 'c_orientadora_visita', 'c_diario_31'] },
    { text: 'Esa noche su madre le pidió que volviera a casa. Salió corriendo y el teléfono se quedó cargando en el almacén del centro.', clues: ['c_mama_2130', 'c_almacen_foto', 'c_cargador_almacen'] },
    { text: 'Desde el 2 de febrero vive con su tía Rosa y su hermana en Santa Olaria. Escribió a su propio número para que alguien avisara a Sara. Va a una psicóloga y a la orientadora de su nuevo instituto.', clues: ['c_marcos_msg', 'c_rosa_msg', 'c_marcos_psicologa'] },
  ],
  senales: [
    '«Cansado. La sele me tiene frito» (22 de noviembre).',
    '«No puedo, tengo a la enana», una y otra vez.',
    'La nota de voz a Iván: «necesito hablar contigo de una cosa. Nada grave. Bueno… un poco».',
    'La cuenta desactivada después del escape room.',
    'En el extremo de la foto de la convivencia.',
    'La broma del monje cartujo: «allí no hay que hablar con nadie». Era verdad.',
    '«Me dormí de pie en el bus.»',
    '«Mejor que lo haga Claudia. No me sale.»',
    'Se fue de la fiesta sin despedirse.',
  ],
  hipotesisCorregidas: [
    { antes: '«Se ha cansado de nosotros».', despues: 'Iba a contarlo todo esa misma noche. No se fue: se lo llevaron las circunstancias.' },
    { antes: '«Estará con la sele, ni sale de casa».', despues: 'Subía al Mirador de noche, cuidaba de su hermana y, desde febrero, vivía a dos horas.' },
    { antes: '«El último día que vino fue la convivencia».', despues: 'Vino a la fiesta del 31. Dibujó el cartel. Fue el último en irse… corriendo.' },
    { antes: '«Me deja en visto desde hace un mes».', despues: 'En enero respondía. Y dos veces intentó hablar con Iván en serio.' },
    { antes: '«Sus padres sabrán; si pasara algo, nos habrían avisado».', despues: 'Nadie avisó. Su madre estaba desbordada. Su tía solo preguntó por el teléfono.' },
    { antes: '«Hay que dejarle su espacio».', despues: '«Yo no quería espacio. Quería que alguien insistiera un poco.»' },
  ],
  sinRespuesta: [
    'Qué pasó exactamente en su casa la noche del 31 de enero y el 1 de febrero.',
    'Si habría hablado con Sara y con Nacho si esa noche hubiera sido otra.',
    'Cómo está realmente por dentro, más allá de «regular».',
    'Si volverá al centro juvenil, y cuándo.',
    'Qué decidirán sus padres.',
    'Qué había en la foto dañada y en los fragmentos ilegibles de la carta a su padre.',
  ],
  momentos: [
    { fecha: '22 nov', quien: 'Nacho', texto: 'Preguntó en un pasillo. Podía haber buscado una silla: un rato, un sitio, sin prisa.' },
    { fecha: '14 nov – 9 ene', quien: 'Iván y el grupo', texto: 'Ante tantos «no puedo», podían haber preguntado «¿qué te pasa?» en lugar de dejar de invitarle.' },
    { fecha: '13 ene', quien: 'Sara', texto: 'Escuchó muy bien. Un secreto así pesaba demasiado para cargarlo sola: podía haber buscado antes a un adulto, con Marcos o por él.' },
    { fecha: '17 ene', quien: 'Claudia', texto: 'Su mensaje fue delicado. Insistir un poco más no habría sido invadir.' },
    { fecha: '29 ene', quien: 'Nacho', texto: '«No me sale». Una pregunta más —«¿qué es lo que no te sale?»— podía haber abierto la puerta.' },
    { fecha: '7 feb', quien: 'El grupo', texto: 'Ante la primera ausencia, las suposiciones se repartieron en el chat. Nadie propuso hacer algo juntos.' },
    { fecha: '9–21 feb', quien: 'Nacho y el centro', texto: 'Llamadas sin respuesta y «no consta nada». Era el momento de escalar: coordinación, familia, instituto, visita.' },
    { fecha: '3 feb', quien: 'El centro', texto: 'Alguien preguntó por un teléfono perdido. Nadie relacionó esa llamada con un chico que había dejado de venir.' },
  ],
};

export const epilogue = {
  fecha: 'Viernes, 20 de marzo de 2026 · 18:12',
  titulo: 'Epílogo: la llamada',
  intro:
    'Con el número que aparece en el teléfono, Nacho, junto a la coordinadora del centro, llama a casa de Paco y Rosa, en Santa Olaria. Contesta Rosa. Después de un rato, se pone Marcos.',
  dialogo: [
    { quien: 'Marcos', texto: '¿Nacho?' },
    { quien: 'Nacho', texto: 'Hola, Marcos. Hemos encontrado tu móvil. Estaba en el almacén, detrás de las cajas de la fiesta.' },
    { quien: 'Marcos', texto: '(silencio) …Sabía que estaba ahí. Mi tía llamó. Me dijeron que no.' },
    { quien: 'Nacho', texto: 'Lo sé. Lo siento. Lo sentimos mucho. Por eso y por más cosas.' },
    { quien: 'Marcos', texto: '¿Lo habéis leído?' },
    { quien: 'Nacho', texto: 'Una parte. Queríamos saber si estabas bien y cómo encontrarte. No vamos a contar lo que es tuyo. El teléfono es tuyo y vuelve a ti.' },
    { quien: 'Marcos', texto: '(pausa larga) Vale. No me hace gracia. Pero vale.' },
    { quien: 'Nacho', texto: '¿Cómo estás?' },
    { quien: 'Marcos', texto: 'Regular tirando a bien. Voy a una psicóloga. Es maja. Lucía está feliz porque aquí hay un perro. Mi madre viene los fines de semana. Mis padres están con lo suyo… con un mediador.' },
    { quien: 'Nacho', texto: 'Sara no ha dejado de escribirte.' },
    { quien: 'Marcos', texto: 'Ya. Yo pensaba que nadie se había dado cuenta.' },
    { quien: 'Nacho', texto: 'Nos dimos cuenta tarde. Pero nos dimos cuenta. Y no queremos volver a llegar tarde.' },
    { quien: 'Marcos', texto: 'En Semana Santa vamos unos días a la ciudad. Igual me paso. Pero sin hacer de esto un drama, ¿eh?' },
    { quien: 'Nacho', texto: 'Sin drama. Con bocadillos de tortilla.' },
    { quien: 'Marcos', texto: '(se ríe) Eso es chantaje.' },
  ],
  cierre:
    'No sabemos si Marcos volverá al centro. Sabemos que está acompañado, que pidió ayuda y la está recibiendo, y que una comunidad que se había olvidado de preguntar ha vuelto a hacerlo.',
};

export const debriefQuestions = [
  '¿En qué momento empezamos a sospechar que algo no estaba bien?',
  '¿Qué pruebas cambiaron nuestra interpretación de Marcos?',
  '¿Qué señales parecían insignificantes cuando las vimos por primera vez?',
  '¿Qué diferencia hay entre saber cosas de una persona y conocer cómo está viviendo?',
  '¿Alguna vez confundimos el silencio de alguien con una decisión de alejarse?',
  '¿Qué puede hacer una comunidad cuando un miembro deja de aparecer?',
  '¿Cómo podemos interesarnos por alguien sin invadir su intimidad?',
  '¿Qué formas de acompañamiento necesitan la intervención de un adulto o de un profesional?',
  '¿Qué tipo de presencia queremos ofrecer en nuestro centro juvenil?',
  '¿Qué cambiaría si dejáramos de considerar las ausencias como algo normal?',
];

export const connectionPrompts = [
  { id: 'cx1', text: 'Una cosa que puedo hacer para interesarme más por los demás es…' },
  { id: 'cx2', text: 'Una señal a la que quiero aprender a prestar atención es…' },
  { id: 'cx3', text: 'Una persona con la que me gustaría recuperar el contacto es…' },
  { id: 'cx4', text: 'Cuando alguien me diga que no está bien, quiero aprender a…' },
];

export const FINAL_PHRASE = 'La comunidad no es solamente el lugar al que todos llegamos. Es el lugar donde alguien se da cuenta cuando dejamos de llegar.';
export const FINAL_SUBPHRASE = 'No siempre podremos conocer toda la historia de alguien. Pero podemos aprender a no dejar de interesarnos por ella.';
