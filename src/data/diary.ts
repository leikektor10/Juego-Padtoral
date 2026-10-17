import type { DiaryEntry, Note } from '../types';

// Carpeta bloqueada «Cosas mías» de la app Notas.
// Contraseña: el nombre del protagonista del cómic de Marcos.
export const DIARY_PASSWORD = 'nadie';
export const DIARY_PASSWORD_HINT = 'Pista de contraseña: «quien soy cuando nadie mira»';

export const diary: DiaryEntry[] = [
  {
    id: 'd01',
    at: '2025-10-06T23:30',
    title: 'Cosas que he aprendido este mes',
    clue: 'c_d_inicio',
    paragraphs: [
      '1. Los pequeños del sábado creen que soy un monstruo amable. No pienso desmentirlo.',
      '2. Un colador sirve de casco. Lo he comprobado científicamente.',
      '3. Si dibujo a Nadie de perfil parece más triste. De frente parece que va a decir algo y no lo dice. Me gusta más de frente.',
      '4. Quiero hacer Bellas Artes. Lo escribo aquí para que sea verdad. Ilustración. Cómic. Lo que sea con un lápiz.',
      '5. Papá dice «ya veremos». Ya veremos es un no con corbata.',
    ],
  },
  {
    id: 'd02',
    at: '2025-10-30T00:12',
    title: 'Silencio',
    clue: 'c_d_guerra_fria',
    paragraphs: [
      'Mis padres han dejado de discutir. Ahora no se hablan. No sé qué es peor.',
      'En la cena solo habla Lucía. Le estoy muy agradecido a Lucía.',
      'Bueno, nada. Cosas de mayores.',
    ],
  },
  {
    id: 'd03',
    at: '2025-11-15T23:55',
    title: 'Cuatro cajas',
    clue: 'c_d_cuatro_cajas',
    paragraphs: [
      'Hoy papá se ha llevado sus cosas. Cuatro cajas. Dieciocho años de matrimonio caben en cuatro cajas y una bolsa de deporte. He hecho una foto a las cajas, no sé para qué.',
      'Me he llevado a Lucía al parque como dijo mamá. Me ha preguntado si papá ya no nos quiere. Le he dicho que sí nos quiere pero que se quiere en otra casa. No sé si eso tiene sentido. A ella le ha valido.',
      'No se lo he dicho a nadie. Ni a Iván. Si lo digo, se vuelve verdad del todo.',
      'En el centro todo igual. Mejor. Allí puedo ser el de siempre.',
    ],
  },
  {
    id: 'd04',
    at: '2025-11-22T23:10',
    title: 'Pasillo',
    clue: 'c_d_pasillo',
    paragraphs: [
      'Nacho me ha preguntado si estoy bien. Le he dicho que cansado. No es mentira.',
      'Es que la gente pregunta en el pasillo, entre una cosa y otra, mientras recoge sillas. Y yo no sé por dónde empezar. Para contar esto hace falta una silla, no un pasillo.',
      'Igual también me da miedo que me miren distinto. Que dejen de pedirme cosas. Que pase a ser «el pobre Marcos». Prefiero ser el del colador.',
    ],
  },
  {
    id: 'd05',
    at: '2025-12-19T22:40',
    title: '3',
    clue: 'c_d_con_cual',
    paragraphs: [
      'Un 3 en mates. Un 9 en dibujo. Papá solo va a ver el 3. Mamá solo va a ver que estoy cansado. Los dos tienen razón y ninguno ve lo otro.',
      'La tutora quiere hablar con mis padres. ¿Con cuál?',
      'He dicho en el grupo que mates y yo nos estamos dando un tiempo. Se han reído. Hago muy bien lo de que se rían.',
    ],
  },
  {
    id: 'd06',
    at: '2026-01-10T01:20',
    title: 'Prueba científica',
    clue: 'c_d_escape',
    paragraphs: [
      'He visto la historia de Iván. Escape room «con los de siempre». Los de siempre éramos nosotros.',
      'No me lo han dicho. Bueno, normal: siempre digo que no puedo. Pero una cosa es no poder ir y otra que no te pregunten.',
      'Esta noche mamá y papá han discutido por teléfono a gritos y me he ido al Mirador. Desde allí arriba la ciudad parece que no tiene problemas.',
      'He desactivado la cuenta. Nadie se va a dar cuenta. Prueba científica.',
    ],
  },
  {
    id: 'd07',
    at: '2026-01-13T02:40',
    title: 'Sara',
    clue: 'c_d_sara',
    paragraphs: [
      'Le he escrito a Sara una cosa y la he borrado. Pero la ha visto.',
      'Hemos hablado casi una hora. Le he contado lo de papá. No se ha asustado. No me ha dado consejos. Me ha dejado hablar. Al final me ha dicho «gracias por contármelo», como si el que hacía un favor era yo.',
      'Me ha hecho prometer que hablaré con alguien mayor. He pensado en la orientadora del insti, que no me conoce y no me va a mirar raro en el centro. Mañana llamo para pedir cita.',
      'Hoy duermo.',
    ],
  },
  {
    id: 'd08',
    at: '2026-01-18T01:05',
    title: 'Treinta personas',
    clue: 'c_d_espacio',
    paragraphs: [
      'En la convi he estado todo el día haciendo el payaso y me he sentido más solo que nunca. ¿Cómo se puede estar solo en un sitio con treinta personas? Pues se puede. Doy fe.',
      'Claudia me ha escrito. Le he dicho que bien. Ella me ha dicho que me deja mi espacio. Yo no quería espacio. Quería que alguien insistiera un poco. Pero eso no se puede pedir, ¿no? Si lo pides ya no vale.',
      'Papá ha escrito: «con dibujitos no se come». Lo he dejado en visto. Me he ido al Mirador otra vez y he grabado un audio que no voy a escuchar nunca.',
    ],
  },
  {
    id: 'd09',
    at: '2026-01-20T22:15',
    title: 'Orientadora',
    clue: 'c_d_orientadora',
    paragraphs: [
      'He ido. La orientadora se llama Elena y tiene un cactus que se llama Gustavo.',
      'Me ha dicho una cosa que he apuntado en la mano para no olvidarla: «Estar cansado de sostener no es lo mismo que ser débil».',
      'También me ha dicho que se lo cuente a algún adulto de mi entorno, alguien que me vea fuera del instituto. He pensado en Nacho. Me da vergüenza. Ya veremos. (Ya veremos es un no con corbata. Pero esta vez es un sí con corbata, creo.)',
      'Volver en dos semanas.',
    ],
  },
  {
    id: 'd10',
    at: '2026-01-22T23:01',
    title: '—',
    clue: 'c_d_cartujo',
    paragraphs: ['Hoy en el grupo he dicho lo del monje cartujo y se han reído.', 'Era verdad.'],
  },
  {
    id: 'd11',
    at: '2026-01-29T23:59',
    title: 'Garelli',
    clue: 'c_d_garelli',
    paragraphs: [
      'He grabado las buenas noches y las he borrado. Hablaba de Garelli, el chaval que estaba solo en la sacristía y al que Don Bosco le preguntó si sabía silbar. Todo empezó por una pregunta tonta hecha a tiempo.',
      'No puedo ponerme delante de todos a decir que hay que fijarse en el que está solo, si el que está solo soy yo y no lo sabe nadie. Sería mentir dos veces.',
      'Se lo he pasado a Claudia. A ella le va a salir bien.',
    ],
  },
  {
    id: 'd12',
    at: '2026-01-31T09:40',
    title: 'Hoy',
    clue: 'c_diario_31',
    paragraphs: [
      'Hoy es la fiesta. Me gusta el cartel. Creo que es lo mejor que he dibujado.',
      'Papá viene esta noche a por lo que queda. Mamá está nerviosa. Lucía no sabe nada.',
      'Esta noche, después de recoger, se lo cuento a Sara. Todo. Lo de casa, lo de mates, lo del Mirador, lo de que a veces no puedo más. Y el lunes, a Nacho. Esta vez sí.',
      'Si lo escribo, lo hago. Es la regla.',
    ],
  },
];

export const notes: Note[] = [
  {
    id: 'n_pendientes',
    title: 'Pendientes semana 12–18 ene',
    at: '2026-01-12T07:30',
    clue: 'c_nota_pendientes',
    text:
      '☐ recoger a Lucía L-M-X-J-V 17:00\n' +
      '☐ natación Lucía miércoles (mochila!!)\n' +
      '☐ pagar recibo luz en el cajero (mamá deja la tarjeta)\n' +
      '☐ ejercicios mates pág. 112\n' +
      '☐ boceto cartel DB\n' +
      '☑ pedir cita orientadora (llamar a centralita)\n' +
      '☐ convi sábado: mochila, saco\n' +
      '☐ ¿hablar con Iván?\n' +
      '☐ dormir (ja)',
  },
  {
    id: 'n_ideas_nadie',
    title: 'Ideas NADIE',
    at: '2025-11-28T23:50',
    text:
      'NADIE — ideas sueltas\n\n' +
      '- Cap. 3: Nadie se da cuenta de que se le transparentan las manos cuando ayuda a alguien. Cuanto más ayuda, más invisible.\n' +
      '- Nadie no tiene superpoderes. Solo tiene un poder: que nadie le ve. Pero es un poder que no ha pedido.\n' +
      '- Final posible: alguien le pregunta una tontería (¿sabes silbar?) y vuelve a verse un poco.\n' +
      '- Otro final posible: ninguno. Seguir dibujando.',
  },
  {
    id: 'n_compra',
    title: 'Compra',
    at: '2026-01-26T19:10',
    text: 'leche\npan de molde\ncereales de Lucía (los del dinosaurio, NO los otros)\ntomate frito\nhuevos\npilas para el mando',
  },
  {
    id: 'n_reir',
    title: 'Cosas que me hacen reír',
    at: '2025-10-20T22:00',
    text:
      '- Lucía diciendo «indudablemente» sin saber qué significa\n' +
      '- Nacho cuando intenta bailar\n' +
      '- Iván perdiendo y diciendo que el mando va mal\n' +
      '- Sara riéndose de sus propios chistes antes de terminarlos\n' +
      '- Los pequeños llamándome monstruo',
  },
];
