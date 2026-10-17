import type { BrowserEntry, CalendarEvent, CallEntry, FileItem, Place } from '../types';

// ───────────────────────────── LLAMADAS ─────────────────────────────
export const calls: CallEntry[] = [
  { id: 'l01', at: '2025-10-11T12:30', who: 'ivan', direction: 'saliente', duration: 1420 },
  { id: 'l02', at: '2025-10-25T20:15', who: 'mama', direction: 'entrante', duration: 95 },
  { id: 'l03', at: '2025-11-08T22:10', who: 'ivan', direction: 'entrante', duration: 2210 },
  { id: 'l04', at: '2025-11-15T19:40', who: 'papa', direction: 'perdida' },
  { id: 'l05', at: '2025-11-21T18:02', who: 'mama', direction: 'entrante', duration: 64 },
  { id: 'l06', at: '2025-12-06T17:30', who: 'ivan', direction: 'saliente', duration: 380 },
  { id: 'l07', at: '2025-12-22T12:00', who: 'rosa', direction: 'entrante', duration: 610 },
  { id: 'l08', at: '2026-01-08T18:50', who: 'nacho', direction: 'entrante', duration: 372 },
  { id: 'l09', at: '2026-01-13T01:26', who: 'sara', direction: 'entrante', duration: 3130, clue: 'c_llamada_sara' },
  { id: 'l10', at: '2026-01-15T10:05', who: 'instituto', direction: 'saliente', duration: 140, clue: 'c_orientadora_llamada' },
  { id: 'l11', at: '2026-01-18T13:45', who: 'papa', direction: 'rechazada' },
  { id: 'l12', at: '2026-01-21T20:30', who: 'papa', direction: 'perdida' },
  { id: 'l13', at: '2026-01-25T21:10', who: 'papa', direction: 'perdida' },
  { id: 'l14', at: '2026-01-24T14:02', who: 'mama', direction: 'entrante', duration: 48 },
  { id: 'l15', at: '2026-01-31T21:44', who: 'mama', direction: 'entrante', duration: 61, clue: 'c_llamada_2144' },
];

// ───────────────────────────── CALENDARIO ─────────────────────────────
export const calendarEvents: CalendarEvent[] = [
  { id: 'e01', date: '2025-10-04', time: '17:00', title: 'Centro juvenil – inicio de curso', category: 'centro', status: 'hecho' },
  { id: 'e02', date: '2025-10-25', time: '17:00', title: 'Centro: sábado con los pequeños', category: 'centro', status: 'hecho' },
  { id: 'e03', date: '2025-11-14', time: '20:00', title: 'Pizzas en casa de Álvaro', category: 'personal', status: 'cancelado', notes: 'No puedo (Lucía)' },
  { id: 'e04', date: '2025-11-22', time: '17:00', title: 'Centro juvenil', category: 'centro', status: 'hecho' },
  { id: 'e05', date: '2025-12-19', title: 'Entrega de notas 1.ª evaluación', category: 'estudios', status: 'hecho' },
  { id: 'e06', date: '2025-12-24', title: 'Nochebuena – casa tía Rosa (Santa Olaria)', category: 'familia', status: 'hecho', clue: 'c_tia_rosa' },
  { id: 'e07', date: '2025-12-27', time: '18:00', title: 'Cine con Iván', category: 'personal', status: 'cancelado', notes: 'Estoy en Santa Olaria hasta el 28. Hablar a la vuelta.' },
  { id: 'e08', date: '2026-01-09', time: '17:00', title: 'Tarde con Lucía', category: 'familia', notes: 'Viernes. Mamá trabaja hasta las 23:00.' },
  { id: 'e09', date: '2026-01-12', title: 'Pedir cita orientadora', category: 'estudios', status: 'hecho', notes: 'Llamar a centralita a primera hora' },
  { id: 'e10', date: '2026-01-17', time: '09:00', title: 'Convivencia CJ', category: 'centro', status: 'hecho' },
  {
    id: 'e11',
    date: '2026-01-20',
    time: '11:30',
    title: 'Orientadora (Elena) – Dpto. Orientación',
    category: 'estudios',
    status: 'hecho',
    notes: 'Sala 2.14. Llevar justificante para el profe de Historia.',
    clue: 'c_orientadora_visita',
  },
  { id: 'e12', date: '2026-01-24', time: '17:00', title: 'Centro juvenil', category: 'centro', status: 'cancelado', notes: 'Mamá trabaja. Me quedo con Lucía.' },
  { id: 'e13', date: '2026-01-26', time: '08:30', title: 'EXAMEN MATES', category: 'estudios', status: 'hecho' },
  { id: 'e14', date: '2026-01-28', time: '18:00', title: 'Pintar pancarta con Sara', category: 'centro', status: 'hecho' },
  {
    id: 'e15',
    date: '2026-01-31',
    time: '17:00',
    title: 'FIESTA DON BOSCO – colgar cartel 16:30',
    category: 'centro',
    status: 'hecho',
    notes: 'Quedarse a recoger. Hablar con Sara después.',
    clue: 'c_fiesta_agenda',
  },
  { id: 'e16', date: '2026-01-31', time: '20:00', title: 'Buenas noches (fiesta)', category: 'centro', status: 'cancelado', notes: 'Las da Claudia.' },
  { id: 'e17', date: '2026-02-02', time: '19:00', title: 'Hablar con Nacho', category: 'centro', status: 'pendiente', notes: 'Lunes. Esta vez sí.', clue: 'c_hablar_nacho' },
  { id: 'e18', date: '2026-02-03', time: '11:30', title: 'Orientadora – 2.ª cita', category: 'estudios', status: 'pendiente' },
  { id: 'e19', date: '2026-02-07', time: '17:00', title: 'Centro juvenil', category: 'centro', status: 'pendiente' },
  { id: 'e20', date: '2026-04-03', title: 'Cumple Sara 🎂', category: 'personal', status: 'pendiente' },
  { id: 'e21', date: '2026-06-14', title: 'Cumple de la enana (10!!)', category: 'familia', status: 'pendiente' },
];

// ───────────────────────────── ARCHIVOS ─────────────────────────────
export const files: FileItem[] = [
  {
    id: 'f_cartel',
    name: 'Cartel_FiestaDB_FINAL_def_ahorasi.png',
    folder: 'Documentos',
    at: '2026-01-27T01:12',
    kind: 'imagen',
    size: '2,4 MB',
    image: 'media/fotos/p15-cartel.svg',
    content: 'Diseño final del cartel. Versión 7. En los metadatos, el título de la capa principal: «¿sabes silbar?».',
  },
  {
    id: 'f_borrador_bn',
    name: 'buenas_noches_borrador.txt',
    folder: 'Documentos',
    at: '2026-01-26T23:40',
    kind: 'texto',
    size: '1 KB',
    clue: 'c_borrador_bn',
    content:
      'BUENAS NOCHES – FIESTA DB (borrador 2)\n\n' +
      'Todo empezó con un chaval solo en una sacristía. Bartolomé Garelli.\n' +
      'Don Bosco no le dio un discurso. Le hizo preguntas tontas.\n' +
      '¿Cómo te llamas? ¿Sabes leer? ¿Sabes silbar?\n\n' +
      'Idea: preguntar a la gente «¿quién de aquí sabe silbar?» y que silben todos. (¿Demasiado?)\n\n' +
      'Frase final: «Fijaos en el que está en la esquina. En el que dice que todo bien.»\n\n' +
      '[sin terminar]',
  },
  {
    id: 'f_correo_cuenta',
    name: 'Tu cuenta se ha desactivado',
    folder: 'Correo',
    at: '2026-01-10T01:02',
    kind: 'correo',
    size: '12 KB',
    clue: 'c_cuenta_desactivada',
    content:
      'De: Fotogram <no-responder@fotogram.example>\nPara: marcos.ferrer.dibuja@correo.example\n\n' +
      'Hola, marcos.dibuja:\n\nHemos desactivado temporalmente tu cuenta tal como solicitaste. Tu perfil, tus fotos y tus comentarios estarán ocultos hasta que vuelvas a iniciar sesión.\n\n' +
      'Motivo indicado: «Otro: no sé»\n\nSi cambias de opinión, solo tienes que volver a entrar.',
  },
  {
    id: 'f_justificante',
    name: 'Justificante_Orientacion_20ene.pdf',
    folder: 'Descargas',
    at: '2026-01-20T12:15',
    kind: 'pdf',
    size: '84 KB',
    clue: 'c_orientadora_visita',
    content:
      'IES RÍO CLARO — DEPARTAMENTO DE ORIENTACIÓN\n\n' +
      'Se justifica que el alumno MARCOS FERRER LOZANO (2.º Bach. B) ha asistido a una entrevista con el Departamento de Orientación el día 20/01/2026 de 11:30 a 12:10.\n\n' +
      'Próxima cita: 03/02/2026, 11:30.\n\nFdo.: Elena M., orientadora.',
  },
  {
    id: 'f_bellas_artes',
    name: 'Notas_de_corte_BellasArtes_2025.pdf',
    folder: 'Descargas',
    at: '2025-10-07T00:31',
    kind: 'pdf',
    size: '310 KB',
    content:
      'Notas de corte (curso anterior) — Grado en Bellas Artes\n\n' +
      'Universidad A: 7,82\nUniversidad B: 8,14\nUniversidad C: 6,95\n\n' +
      '(Anotación a mano en la captura: «C se puede. Si apruebo mates.»)',
  },
  {
    id: 'f_horario',
    name: 'Horario_Lucia_2025-26.jpg',
    folder: 'Descargas',
    at: '2025-09-15T09:00',
    kind: 'texto',
    size: '200 KB',
    content: 'Horario de 4.º de Primaria — Lucía Ferrer.\nSalida: 17:00 (L-V). Natación: miércoles 17:30–18:30.\nPersona autorizada para la recogida: Marcos Ferrer (hermano).',
    clue: 'c_autorizado_recogida',
  },
  // ─── Eliminados ───
  {
    id: 'x_sara_borrado',
    name: 'Mensaje eliminado · chat Sara · 13 ene 01:12',
    folder: 'Eliminados',
    at: '2026-01-13T01:12',
    kind: 'mensaje',
    size: '—',
    clue: 'c_del_sara',
    content: '«a veces pienso que si dejara de ir al centro nadie lo notaría»',
    deleted: {
      recoverable: 'total',
      requires: ['c_sara_padre'],
      requirementHint: 'Hace falta contexto: leed la conversación con Sara del 13 de enero.',
      deletedAt: '2026-01-13T01:12',
    },
  },
  {
    id: 'x_ivan_borrado',
    name: 'Mensaje eliminado · chat Iván · 15 ene 23:21',
    folder: 'Eliminados',
    at: '2026-01-15T23:21',
    kind: 'mensaje',
    size: '—',
    clue: 'c_del_ivan',
    content: '«Iván, ¿podemos hablar? En serio esta vez. Es de mi casa»',
    deleted: {
      recoverable: 'total',
      requires: ['c_ivan_audio'],
      requirementHint: 'Hace falta contexto: escuchad la nota de voz que Marcos envió a Iván en diciembre.',
      deletedAt: '2026-01-15T23:22',
    },
  },
  {
    id: 'x_ensayo',
    name: 'Buenas noches – ensayo.m4a',
    folder: 'Eliminados',
    at: '2026-01-29T23:20',
    kind: 'audio',
    size: '1,1 MB',
    audioId: 'au_ensayo',
    clue: 'c_del_ensayo',
    deleted: {
      recoverable: 'total',
      requires: ['c_buenas_noches_renuncia'],
      requirementHint: 'Hace falta contexto: ¿qué le encargó Nacho a Marcos para la fiesta, además del cartel?',
      deletedAt: '2026-01-29T23:45',
    },
  },
  {
    id: 'x_borrador_sara',
    name: 'Borrador sin enviar · chat Sara · 31 ene 21:46',
    folder: 'Eliminados',
    at: '2026-01-31T21:46',
    kind: 'mensaje',
    size: '—',
    clue: 'c_del_borrador_sara',
    content:
      '«Sara perdona me tengo que ir corriendo, es por lo de casa. lo que te iba a contar es que mi padre esta noche ha venido y no puedo m»\n\n[El borrador se interrumpe aquí. No llegó a enviarse.]',
    deleted: {
      recoverable: 'parcial',
      requires: ['c_mama_2130'],
      requirementHint: 'Hace falta contexto: ¿qué le escribió su madre la noche de la fiesta?',
      deletedAt: '2026-01-31T21:47',
    },
  },
  {
    id: 'x_carta_papa',
    name: 'carta_papa.txt',
    folder: 'Eliminados',
    at: '2025-11-30T02:10',
    kind: 'texto',
    size: '2 KB',
    clue: 'c_del_carta_papa',
    content:
      'Papá:\n\nNo sé escribir cartas. Tú tampoco sabes hablar, así que estamos empatados.\n\n' +
      'No estoy enfadado porque te hayas ido. Bueno, sí. Pero sobre todo ███████████ ██████ ████ que yo ██████ ████████ Lucía ████ ███████.\n\n' +
      'Me gustaría que vieras mis dibujos alguna vez sin decir «ya veremos». ██████████ ███ ███████.\n\n' +
      '████████ ██ ████████\n\n[Fragmentos ilegibles. Parte del archivo no se puede reconstruir.]',
    deleted: {
      recoverable: 'parcial',
      requires: ['c_padre_se_va'],
      requirementHint: 'Hace falta contexto: ¿qué pasó en casa de Marcos a mediados de noviembre?',
      deletedAt: '2025-11-30T02:31',
    },
  },
  {
    id: 'x_img0231',
    name: 'IMG_0231.jpg',
    folder: 'Eliminados',
    at: '2025-11-16T00:03',
    kind: 'imagen',
    size: '3,8 MB (dañado)',
    content: 'El archivo está dañado. Solo se conservan los metadatos: 16/11/2025 00:03, cámara frontal. No hay forma de saber qué mostraba.',
    deleted: {
      recoverable: 'no',
      requires: [],
      requirementHint: 'Este archivo no puede reconstruirse. Hay cosas que no vamos a saber.',
      deletedAt: '2025-11-16T00:05',
    },
  },
];

// ───────────────────────────── NAVEGADOR ─────────────────────────────
export const browserHistory: BrowserEntry[] = [
  { id: 'b01', at: '2025-10-07T00:20', query: 'nota de corte bellas artes', visited: 'Notas de corte — Grado en Bellas Artes' },
  { id: 'b02', at: '2025-10-19T16:02', query: 'por qué los patos no se mojan', visited: 'Las plumas de los patos y el aceite: explicación' },
  { id: 'b03', at: '2025-11-02T23:41', query: 'mis padres no se hablan qué hago', visited: 'Foro: «Mis padres llevan semanas sin hablarse»' },
  { id: 'b04', at: '2025-11-16T01:12', query: 'custodia hijos 17 años quién decide', visited: 'Guía: separación y custodia de hijos adolescentes', clue: 'c_busqueda_custodia' },
  { id: 'b05', at: '2025-11-18T19:30', query: 'macarrones fáciles para niños', visited: 'Receta: macarrones con tomate en 15 minutos' },
  { id: 'b06', at: '2025-12-20T00:50', query: 'cómo aprobar mates aplicadas si vas muy mal', visited: 'Consejos para recuperar Matemáticas en 2.º de Bachillerato' },
  { id: 'b07', at: '2026-01-10T01:05', query: 'cómo desactivar cuenta fotogram', visited: 'Centro de ayuda: desactivar tu cuenta' },
  {
    id: 'b08',
    at: '2026-01-12T23:58',
    query: 'cómo decirle a alguien que no estás bien sin agobiarle',
    visited: 'Pedir ayuda no es molestar: 7 formas de empezar la conversación',
    clue: 'c_busqueda_contar',
  },
  { id: 'b09', at: '2026-01-14T22:30', query: 'qué hace un orientador del instituto', visited: 'El departamento de orientación: qué es y cuándo acudir' },
  { id: 'b10', at: '2026-01-21T00:10', query: 'estar cansado de sostener', visited: '(sin resultados relevantes)' },
  { id: 'b11', at: '2026-01-27T00:40', query: 'bartolomé garelli sabes silbar', visited: '8 de diciembre de 1841: el encuentro que dio origen al Oratorio' },
  { id: 'b12', at: '2026-01-30T22:15', query: 'acordes bajo el sol saldrá mañana', visited: 'Tablatura para bajo' },
];

// ───────────────────────────── MAPA (historial de ubicaciones) ─────────────────────────────
export const places: Place[] = [
  {
    id: 'pl_casa',
    name: 'Casa',
    x: 28,
    y: 62,
    kind: 'casa',
    description: 'Calle del Olmo, 14 – 3.º B. Ubicación más frecuente.',
    visits: [{ id: 'v01', from: '2025-09-01', note: 'Todos los días (ubicación habitual por la noche).' }],
  },
  {
    id: 'pl_ies',
    name: 'IES Río Claro',
    x: 60,
    y: 70,
    kind: 'estudios',
    description: 'Instituto de Marcos. Lunes a viernes, 8:25–14:30.',
    visits: [
      { id: 'v02', from: '2025-09-15', note: 'Lunes a viernes por la mañana.' },
      { id: 'v03', from: '2026-01-20T11:28', to: '2026-01-20T12:14', note: 'Dpto. de Orientación (planta 2). Visita fuera del horario de clase habitual.', clue: 'c_orientadora_visita' },
    ],
  },
  {
    id: 'pl_cj',
    name: 'Centro Juvenil Domingo Savio',
    x: 46,
    y: 40,
    kind: 'centro',
    description: 'Casa salesiana. Sábados por la tarde.',
    visits: [
      { id: 'v04', from: '2026-01-10T17:05', to: '2026-01-10T18:20', note: 'Se fue antes de la hora habitual.' },
      { id: 'v05', from: '2026-01-28T17:50', to: '2026-01-28T20:40', note: 'Miércoles (pancarta).' },
      {
        id: 'v06',
        from: '2026-01-31T16:20',
        to: '2026-01-31T21:47',
        note: 'Fiesta de Don Bosco. Último registro del dispositivo: aquí, 21:47. Después, ninguna ubicación.',
        clue: 'c_mapa_ultimo',
      },
    ],
  },
  {
    id: 'pl_mirador',
    name: 'Mirador del Cerro',
    x: 78,
    y: 22,
    kind: 'calle',
    description: 'Parque en lo alto de la ciudad. A 25 minutos andando de casa.',
    visits: [
      { id: 'v07', from: '2026-01-09T22:55', to: '2026-01-09T23:40', note: 'Viernes por la noche.', clue: 'c_mirador' },
      { id: 'v08', from: '2026-01-18T23:30', to: '2026-01-19T00:15', note: 'Domingo por la noche.', clue: 'c_mirador' },
      { id: 'v09', from: '2026-01-26T22:40', to: '2026-01-26T23:20', note: 'Lunes por la noche (día del examen).', clue: 'c_mirador' },
    ],
  },
  {
    id: 'pl_colegio_lucia',
    name: 'Colegio de Lucía (CEIP Los Almendros)',
    x: 18,
    y: 38,
    kind: 'estudios',
    description: 'Colegio de primaria.',
    visits: [{ id: 'v10', from: '2025-11-17', note: 'Lunes a viernes, hacia las 17:00, desde mediados de noviembre.', clue: 'c_lucia_cuidado' }],
  },
  {
    id: 'pl_estacion',
    name: 'Estación de autobuses',
    x: 86,
    y: 78,
    kind: 'transporte',
    description: 'Líneas interurbanas.',
    visits: [{ id: 'v11', from: '2025-12-23T10:10', note: 'Autobús de las 10:30 (dirección Santa Olaria).' }],
  },
  {
    id: 'pl_santa_olaria',
    name: 'Santa Olaria',
    x: 94,
    y: 6,
    kind: 'familia',
    offMap: true,
    description: 'Pueblo a unas 2 horas en autobús. Casa de la tía Rosa.',
    visits: [{ id: 'v12', from: '2025-12-23T12:40', to: '2025-12-28T18:00', note: 'Vacaciones de Navidad.', clue: 'c_tia_rosa' }],
  },
];

// ───────────────────────────── AJUSTES (datos del dispositivo) ─────────────────────────────
export const deviceInfo = {
  owner: 'Teléfono de Marcos',
  model: 'Modelo A12 (2021)',
  storage: '58,1 GB de 64 GB usados',
  number: '+34 611 48 20 37',
  dataPlan: 'Datos móviles: sin saldo desde el 28/01/2026 (solo wifi).',
  wifi: [
    { ssid: 'CJ_DomingoSavio_Invitados', last: '2026-01-31T21:47', note: 'Conectado de 16:22 a 21:47. Red no disponible desde las 21:47.' },
    { ssid: 'MOVISTAR_3B_OLMO', last: '2026-01-31T16:05', note: 'Wifi de casa.' },
    { ssid: 'IES_RioClaro_Alumnos', last: '2026-01-30T14:20', note: '' },
    { ssid: 'WLAN_Rosa', last: '2025-12-28T17:40', note: 'Santa Olaria.' },
  ],
  battery: [
    { at: '2026-01-31T19:28', text: '9 %' },
    { at: '2026-01-31T21:41', text: '4 % — conectado a la corriente (carga lenta)' },
    { at: '2026-01-31T21:58', text: '6 % — corriente interrumpida' },
    { at: '2026-02-01T03:12', text: 'Batería agotada. Dispositivo apagado.' },
    { at: '2026-03-19T17:31', text: 'Encendido (conectado a la corriente).' },
  ],
};
