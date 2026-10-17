// Tipos del modelo narrativo. Todos los datos de la historia viven en src/data
// y los componentes solo los presentan.

export type AppId =
  | 'mensajes'
  | 'galeria'
  | 'notas'
  | 'grabadora'
  | 'llamadas'
  | 'calendario'
  | 'archivos'
  | 'contactos'
  | 'buscar'
  | 'mapas'
  | 'navegador'
  | 'ajustes';

export type ChapterId = 1 | 2 | 3 | 4 | 5;

/** Fecha ISO local: 'AAAA-MM-DD' o 'AAAA-MM-DDTHH:mm'. */
export type IsoDate = string;

export type ClueKind = 'persona' | 'fecha' | 'acontecimiento' | 'mensaje' | 'foto' | 'documento' | 'lugar';

/** hecho: lo prueba el dispositivo. testimonio: lo que alguien cree o dice. interpretacion: lectura posible. */
export type Certainty = 'hecho' | 'testimonio' | 'interpretacion';

export interface EvidenceRef {
  app: AppId;
  /** Identificador del elemento dentro de la app (chat, foto, nota…). */
  id: string;
  label: string;
}

export interface Clue {
  id: string;
  title: string;
  detail: string;
  kind: ClueKind;
  certainty: Certainty;
  date?: IsoDate;
  people?: string[];
  source: EvidenceRef;
  /** Pistas con las que choca. Se señalan en la cronología cuando ambas están descubiertas. */
  contradicts?: string[];
}

export interface Contact {
  id: string;
  name: string;
  shortName: string;
  relation: string;
  phone: string;
  color: string;
  initials: string;
  /** Lo que se sabe sin investigar (lo que mostraría una agenda normal). */
  agendaNote?: string;
  openQuestions: { q: string; resolvedBy?: string[]; answer?: string }[];
  /** Aparece en la agenda desde este capítulo. */
  availableFrom?: ChapterId;
}

export interface ChatMessage {
  id: string;
  at: IsoDate;
  /** id de contacto o 'yo' (Marcos). 'sistema' para avisos. */
  from: string;
  text?: string;
  photo?: string;
  audio?: string;
  /** Mensaje borrado por el remitente. Se ve el aviso, no el texto. */
  deleted?: boolean;
  clue?: string;
  availableFrom?: ChapterId;
}

export interface Chat {
  id: string;
  title: string;
  kind: 'directo' | 'grupo' | 'sms';
  contactId?: string;
  members?: string[];
  color: string;
  initials: string;
  availableFrom?: ChapterId;
  messages: ChatMessage[];
}

export interface Hotspot {
  id: string;
  /** Posición y tamaño en porcentaje de la imagen. */
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  text: string;
  clue?: string;
}

export interface Photo {
  id: string;
  file: string;
  title: string;
  at: IsoDate;
  origin: 'camara' | 'captura' | 'recibida';
  place?: string;
  description: string;
  alt: string;
  hotspots: Hotspot[];
  clue?: string;
  availableFrom?: ChapterId;
}

export interface DiaryEntry {
  id: string;
  at: IsoDate;
  title: string;
  paragraphs: string[];
  clue?: string;
}

export interface Note {
  id: string;
  title: string;
  at: IsoDate;
  text: string;
  clue?: string;
}

export interface AudioSegment {
  t: number;
  speaker?: string;
  text: string;
}

export interface AudioNote {
  id: string;
  title: string;
  at: IsoDate;
  duration: number;
  place?: string;
  context: string;
  segments: AudioSegment[];
  clue?: string;
  /** 'grabadora': aparece en la app. 'chat': nota de voz recibida/enviada. 'eliminado': solo tras recuperarlo. */
  location: 'grabadora' | 'chat' | 'eliminado';
}

export interface CallEntry {
  id: string;
  at: IsoDate;
  who: string; // id de contacto o número
  direction: 'entrante' | 'saliente' | 'perdida' | 'rechazada';
  duration?: number; // segundos
  clue?: string;
}

export interface CalendarEvent {
  id: string;
  date: IsoDate;
  time?: string;
  title: string;
  notes?: string;
  status?: 'cancelado' | 'hecho' | 'pendiente';
  category: 'centro' | 'familia' | 'estudios' | 'personal';
  clue?: string;
}

export interface DeletedInfo {
  recoverable: 'total' | 'parcial' | 'no';
  requires: string[];
  requirementHint: string;
  deletedAt: IsoDate;
}

export interface FileItem {
  id: string;
  name: string;
  folder: 'Documentos' | 'Descargas' | 'Correo' | 'Eliminados';
  at: IsoDate;
  kind: 'texto' | 'imagen' | 'correo' | 'pdf' | 'audio' | 'mensaje';
  size: string;
  content?: string;
  image?: string;
  audioId?: string;
  clue?: string;
  deleted?: DeletedInfo;
  availableFrom?: ChapterId;
}

export interface BrowserEntry {
  id: string;
  at: IsoDate;
  query: string;
  visited?: string;
  clue?: string;
}

export interface PlaceVisit {
  id: string;
  from: IsoDate;
  to?: IsoDate;
  note?: string;
  clue?: string;
}

export interface Place {
  id: string;
  name: string;
  x: number;
  y: number;
  kind: 'casa' | 'estudios' | 'centro' | 'calle' | 'familia' | 'salud' | 'transporte';
  description: string;
  visits: PlaceVisit[];
  offMap?: boolean;
}

export interface QuestionOption {
  id: string;
  label: string;
}

export interface ChapterQuestion {
  id: string;
  prompt: string;
  type: 'eleccion' | 'texto' | 'orden';
  options?: QuestionOption[];
  /** Para 'eleccion': id correcto. Para 'orden': ids en el orden correcto. */
  correct?: string | string[];
  okFeedback?: string;
  koFeedback?: string;
  /** Pistas que sostienen la respuesta (se muestran al acertar). */
  support?: string[];
}

export interface Chapter {
  id: ChapterId;
  title: string;
  objective: string;
  intro: string;
  questions: ChapterQuestion[];
  hints: [string, string, string];
  /** Texto que aparece al completar el capítulo. */
  outro: string;
}
