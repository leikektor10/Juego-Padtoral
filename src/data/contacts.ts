import type { Contact } from '../types';

// Personas que aparecen en el dispositivo. Los números son ficticios.
export const OWNER = {
  name: 'Marcos Ferrer Lozano',
  shortName: 'Marcos',
  phone: '+34 611 48 20 37',
};

export const contacts: Contact[] = [
  {
    id: 'sara',
    name: 'Sara Benítez',
    shortName: 'Sara',
    relation: 'Amiga del centro juvenil',
    phone: '+34 622 17 40 93',
    color: '#c98a2b',
    initials: 'SB',
    agendaNote: 'Cumple: 3 de abril',
    openQuestions: [
      {
        q: '¿Qué sabía Sara de lo que vivía Marcos?',
        resolvedBy: ['c_sara_padre'],
        answer: 'Que su padre se había ido de casa en noviembre. Marcos le pidió que no se lo dijera a nadie.',
      },
      {
        q: '¿Qué hizo Sara cuando Marcos dejó de responder?',
        resolvedBy: ['c_sara_nacho'],
        answer: 'Siguió escribiendo, llamó y, el 8 de febrero, rompió su promesa y se lo contó a Nacho.',
      },
      {
        q: '¿Qué iba a contarle Marcos el 31 de enero?',
        resolvedBy: ['c_diario_31', 'c_del_borrador_sara'],
        answer: 'Lo que pasaba en casa. «Todo». No llegó a hacerlo.',
      },
    ],
  },
  {
    id: 'ivan',
    name: 'Iván Morales',
    shortName: 'Iván',
    relation: 'Mejor amigo desde primaria',
    phone: '+34 633 92 15 08',
    color: '#b5483b',
    initials: 'IM',
    openQuestions: [
      {
        q: '¿Por qué se distanciaron?',
        resolvedBy: ['c_escape_room', 'c_ivan_siempre_dice'],
        answer: 'Planes a los que Marcos «nunca podía ir» y a los que acabaron por no invitarle. Ninguno de los dos lo habló.',
      },
      {
        q: '¿Intentó Marcos hablar con Iván?',
        resolvedBy: ['c_ivan_audio', 'c_del_ivan'],
        answer: 'Sí, dos veces: el 23 de diciembre y el 15 de enero. Las dos se echó atrás.',
      },
      {
        q: '¿Es cierto que «el último día que vino fue la convivencia»?',
        resolvedBy: ['c_fiesta_cartel'],
        answer: 'No. Marcos estuvo en la fiesta de Don Bosco el 31 de enero. Iván no fue.',
      },
    ],
  },
  {
    id: 'nacho',
    name: 'Nacho (animador)',
    shortName: 'Nacho',
    relation: 'Animador del grupo 17+ del centro juvenil',
    phone: '+34 644 30 71 26',
    color: '#4f7a5a',
    initials: 'NV',
    agendaNote: 'Ignacio Varela',
    openQuestions: [
      {
        q: '¿Notó Nacho algún cambio en Marcos?',
        resolvedBy: ['c_nacho_cansado'],
        answer: 'Sí, el 22 de noviembre le vio «apagado». Aceptó la respuesta «estoy cansado».',
      },
      {
        q: '¿Por qué no se dio la voz de alarma antes?',
        resolvedBy: ['c_nacho_padres', 'c_nacho_llama'],
        answer: 'Supuso que la familia habría avisado si pasaba algo. En secretaría «no constaba nada».',
      },
      {
        q: '¿Qué hizo cuando Sara le avisó?',
        resolvedBy: ['c_nacho_llama'],
        answer: 'Escribió, llamó al móvil y a casa. No contestó nadie. No llegó a ir más allá.',
      },
    ],
  },
  {
    id: 'claudia',
    name: 'Claudia Ruiz',
    shortName: 'Claudia',
    relation: 'Compañera del grupo del centro',
    phone: '+34 655 08 63 41',
    color: '#4a6fa5',
    initials: 'CR',
    openQuestions: [
      {
        q: '¿Por qué dejó de escribirle Claudia?',
        resolvedBy: ['c_claudia_no_escribo'],
        answer: 'Pensó que lo correcto era no agobiarle y dejarle espacio.',
      },
      {
        q: '¿Qué esperaba Marcos de ella?',
        resolvedBy: ['c_d_espacio'],
        answer: '«Yo no quería espacio. Quería que alguien insistiera un poco.»',
      },
    ],
  },
  {
    id: 'alvaro',
    name: 'Álvaro Gil',
    shortName: 'Álvaro',
    relation: 'Compañero del grupo del centro',
    phone: '+34 666 54 29 70',
    color: '#7a5c99',
    initials: 'ÁG',
    openQuestions: [
      {
        q: '¿Se había «cansado» Marcos del grupo, como dice Álvaro?',
        resolvedBy: ['c_diario_31'],
        answer: 'No. El día de la fiesta pensaba contárselo todo a Sara y, después, a Nacho.',
      },
    ],
  },
  {
    id: 'mama',
    name: 'Mamá',
    shortName: 'Mamá',
    relation: 'Madre (Pilar Lozano)',
    phone: '+34 677 21 84 55',
    color: '#a0617a',
    initials: 'M',
    openQuestions: [
      {
        q: '¿Por qué Marcos estaba solo con Lucía tantas tardes?',
        resolvedBy: ['c_lucia_cuidado'],
        answer: 'Su madre trabaja de tarde (15–23 h). Desde noviembre, Marcos recoge a Lucía, le da la cena y le ayuda con los deberes.',
      },
      {
        q: '¿Avisó la familia al centro juvenil?',
        resolvedBy: ['c_marcos_msg'],
        answer: 'No. «Mi madre no ha avisado a nadie, bastante tiene.»',
      },
    ],
  },
  {
    id: 'papa',
    name: 'Papá',
    shortName: 'Papá',
    relation: 'Padre (Andrés Ferrer)',
    phone: '+34 688 63 02 19',
    color: '#6b6b6b',
    initials: 'P',
    openQuestions: [
      {
        q: '¿Qué pasó con su padre?',
        resolvedBy: ['c_padre_se_va'],
        answer: 'Se fue de casa el 15 de noviembre. La relación con Marcos es tensa y torpe.',
      },
      {
        q: '¿Qué pasó la noche del 31 de enero?',
        resolvedBy: ['c_papa_perdon'],
        answer: 'Su padre fue a por sus cosas y hubo una discusión muy fuerte. El 3 de febrero le pide perdón por gritar. No sabemos más.',
      },
    ],
  },
  {
    id: 'rosa',
    name: 'Tía Rosa (fijo)',
    shortName: 'Tía Rosa',
    relation: 'Tía materna. Vive en Santa Olaria',
    phone: '+34 925 71 33 02',
    color: '#8a7a3a',
    initials: 'TR',
    agendaNote: 'Casa de Santa Olaria (fijo)',
    openQuestions: [
      {
        q: '¿Tiene algo que ver la tía Rosa con la ausencia de Marcos?',
        resolvedBy: ['c_rosa_msg', 'c_marcos_msg'],
        answer: 'Marcos y Lucía viven con ella desde el 2 de febrero. Rosa llamó al centro buscando el móvil.',
      },
    ],
  },
  {
    id: 'irene',
    name: 'Irene (clase)',
    shortName: 'Irene',
    relation: 'Compañera de clase en el instituto',
    phone: '+34 699 45 12 87',
    color: '#3f8a8a',
    initials: 'IS',
    openQuestions: [
      {
        q: '¿Qué sabía el instituto?',
        resolvedBy: ['c_irene_traslado'],
        answer: 'La tutora habló de un «traslado por temas familiares». El instituto sabía algo que el centro juvenil no.',
      },
    ],
  },
  {
    id: 'instituto',
    name: 'IES Río Claro (centralita)',
    shortName: 'Instituto',
    relation: 'Instituto de Marcos',
    phone: '+34 925 40 18 00',
    color: '#5d6d7e',
    initials: 'IES',
    openQuestions: [
      {
        q: '¿Para qué llamó Marcos al instituto el 15 de enero?',
        resolvedBy: ['c_orientadora_visita'],
        answer: 'Para pedir cita con la orientadora. Fue el 20 de enero.',
      },
    ],
  },
  {
    id: 'desconocido',
    name: '+34 6** ** ** 58',
    shortName: 'Número desconocido',
    relation: 'No guardado en la agenda',
    phone: '+34 6** ** ** 58',
    color: '#555',
    initials: '?',
    availableFrom: 4,
    openQuestions: [
      {
        q: '¿De quién es este número?',
        resolvedBy: ['c_rosa_msg'],
        answer: 'De Paco, el marido de la tía Rosa. Desde él escriben Rosa y el propio Marcos.',
      },
      {
        q: '¿Dónde está Marcos?',
        resolvedBy: ['c_marcos_msg'],
        answer: 'En Santa Olaria, en casa de su tía, con su hermana.',
      },
    ],
  },
];

export const contactById = (id: string): Contact | undefined => contacts.find((c) => c.id === id);

/** Nombre a mostrar para un remitente (contacto, 'yo' o número). */
export function displayName(id: string): string {
  if (id === 'yo') return 'Marcos';
  const c = contactById(id);
  if (c) return c.shortName;
  const extra: Record<string, string> = {
    ruben: 'Rubén',
    paula: 'Paula',
    noa: 'Noa',
    operador: 'Movilia',
    sistema: 'Sistema',
  };
  return extra[id] ?? id;
}

export const extraColors: Record<string, string> = {
  ruben: '#8d6e3f',
  paula: '#9a4f6e',
  noa: '#5b7f9e',
};
