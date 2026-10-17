import { chapters } from '../data/chapters';
import type { ChapterId } from '../types';

export type Phase = 'titulo' | 'aviso' | 'encargo' | 'juego' | 'final' | 'reflexion';

export interface BoardNode {
  id: string;
  kind: 'persona' | 'fecha' | 'acontecimiento' | 'mensaje' | 'foto' | 'hipotesis' | 'documento' | 'lugar';
  label: string;
  clueId?: string;
  x: number;
  y: number;
}

export interface BoardEdge {
  id: string;
  from: string;
  to: string;
  label: string;
}

export interface HypothesisVersion {
  text: string;
  at: number;
  clueCount: number;
}

export interface Answer {
  value: string | string[];
  correct?: boolean;
  attempts: number;
  at: number;
}

export interface Settings {
  textScale: number;
  sound: boolean;
  reduceMotion: boolean;
}

export interface GameState {
  v: 1;
  phase: Phase;
  unlocked: boolean;
  chapter: ChapterId;
  completed: ChapterId[];
  answers: Record<string, Answer>;
  clues: Record<string, number>;
  seen: Record<string, number>;
  recovered: Record<string, number>;
  diaryUnlocked: boolean;
  hints: Record<string, number>;
  board: { nodes: BoardNode[]; edges: BoardEdge[] };
  hypotheses: Record<string, { current: string; history: HypothesisVersion[] }>;
  connection: Record<string, string>;
  facilitatorNotes: string;
  settings: Settings;
  /** Capítulo cuya introducción hay que mostrar (al empezar o al avanzar). */
  chapterIntro: ChapterId | null;
  startedAt: number | null;
  finishedAt: number | null;
}

export const STORAGE_KEY = 'ultima-conexion:partida:v1';

export const defaultSettings: Settings = { textScale: 1, sound: true, reduceMotion: false };

export function initialState(settings: Settings = defaultSettings): GameState {
  return {
    v: 1,
    phase: 'titulo',
    unlocked: false,
    chapter: 1,
    completed: [],
    answers: {},
    clues: {},
    seen: {},
    recovered: {},
    diaryUnlocked: false,
    hints: {},
    board: { nodes: [], edges: [] },
    hypotheses: {},
    connection: {},
    facilitatorNotes: '',
    settings,
    chapterIntro: null,
    startedAt: null,
    finishedAt: null,
  };
}

export type Action =
  | { type: 'setPhase'; phase: Phase }
  | { type: 'newGame' }
  | { type: 'unlock' }
  | { type: 'discover'; ids: string[] }
  | { type: 'see'; key: string }
  | { type: 'recover'; fileId: string }
  | { type: 'unlockDiary' }
  | { type: 'answer'; questionId: string; value: string | string[]; correct?: boolean }
  | { type: 'revealHint'; key: string }
  | { type: 'dismissIntro' }
  | { type: 'skipChapter' }
  | { type: 'boardAddNode'; node: BoardNode }
  | { type: 'boardMoveNode'; id: string; x: number; y: number }
  | { type: 'boardRemoveNode'; id: string }
  | { type: 'boardAddEdge'; edge: BoardEdge }
  | { type: 'boardUpdateEdge'; id: string; label: string }
  | { type: 'boardRemoveEdge'; id: string }
  | { type: 'hypothesisDraft'; id: string; text: string }
  | { type: 'hypothesisSave'; id: string }
  | { type: 'connection'; id: string; text: string }
  | { type: 'clearConnection' }
  | { type: 'facilitatorNotes'; text: string }
  | { type: 'settings'; settings: Partial<Settings> }
  | { type: 'finish' }
  | { type: 'reset' }
  | { type: 'load'; state: GameState };

/** Un capítulo está resuelto cuando todas sus preguntas calificables son correctas. */
export function chapterSolved(state: GameState, chapterId: ChapterId): boolean {
  const ch = chapters.find((c) => c.id === chapterId);
  if (!ch) return false;
  if (chapterId === 1 && !state.unlocked) return false;
  return ch.questions.filter((q) => q.type !== 'texto').every((q) => state.answers[q.id]?.correct);
}

function advance(state: GameState): GameState {
  let s = state;
  // Avanza tantos capítulos como estén resueltos (normalmente uno).
  while (s.chapter < 5 && chapterSolved(s, s.chapter)) {
    const done = s.chapter;
    const next = (done + 1) as ChapterId;
    s = { ...s, completed: [...new Set([...s.completed, done])] as ChapterId[], chapter: next, chapterIntro: next };
  }
  if (s.chapter === 5 && chapterSolved(s, 5) && !s.completed.includes(5)) {
    s = { ...s, completed: [...s.completed, 5] };
  }
  return s;
}

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'setPhase':
      return { ...state, phase: action.phase };
    case 'newGame':
      return { ...initialState(state.settings), phase: 'aviso' };
    case 'unlock':
      if (state.unlocked) return state;
      return {
        ...state,
        unlocked: true,
        startedAt: state.startedAt ?? Date.now(),
        chapterIntro: 1,
        clues: { ...state.clues, c_pin_lucia: state.clues.c_pin_lucia ?? Date.now() },
      };
    case 'discover': {
      const fresh = action.ids.filter((id) => !state.clues[id]);
      if (!fresh.length) return state;
      const now = Date.now();
      const clues = { ...state.clues };
      fresh.forEach((id) => (clues[id] = now));
      return { ...state, clues };
    }
    case 'see':
      if (state.seen[action.key]) return state;
      return { ...state, seen: { ...state.seen, [action.key]: Date.now() } };
    case 'recover':
      return { ...state, recovered: { ...state.recovered, [action.fileId]: Date.now() } };
    case 'unlockDiary':
      return { ...state, diaryUnlocked: true };
    case 'answer': {
      const prev = state.answers[action.questionId];
      const answers = {
        ...state.answers,
        [action.questionId]: {
          value: action.value,
          correct: action.correct,
          attempts: (prev?.attempts ?? 0) + 1,
          at: Date.now(),
        },
      };
      return advance({ ...state, answers });
    }
    case 'revealHint':
      return { ...state, hints: { ...state.hints, [action.key]: Math.min(3, (state.hints[action.key] ?? 0) + 1) } };
    case 'dismissIntro':
      return { ...state, chapterIntro: null };
    case 'skipChapter': {
      // Herramienta del facilitador: marca como resueltas las deducciones del capítulo actual.
      const ch = chapters.find((c) => c.id === state.chapter)!;
      const answers = { ...state.answers };
      ch.questions
        .filter((q) => q.type !== 'texto')
        .forEach((q) => {
          answers[q.id] = { value: q.correct ?? '', correct: true, attempts: answers[q.id]?.attempts ?? 0, at: Date.now() };
        });
      const clues = { ...state.clues };
      ch.questions.forEach((q) => q.support?.forEach((id) => (clues[id] = clues[id] ?? Date.now())));
      return advance({ ...state, unlocked: true, startedAt: state.startedAt ?? Date.now(), answers, clues });
    }
    case 'boardAddNode':
      if (action.node.clueId && state.board.nodes.some((n) => n.clueId === action.node.clueId)) return state;
      return { ...state, board: { ...state.board, nodes: [...state.board.nodes, action.node] } };
    case 'boardMoveNode':
      return {
        ...state,
        board: { ...state.board, nodes: state.board.nodes.map((n) => (n.id === action.id ? { ...n, x: action.x, y: action.y } : n)) },
      };
    case 'boardRemoveNode':
      return {
        ...state,
        board: {
          nodes: state.board.nodes.filter((n) => n.id !== action.id),
          edges: state.board.edges.filter((e) => e.from !== action.id && e.to !== action.id),
        },
      };
    case 'boardAddEdge': {
      const { from, to } = action.edge;
      if (from === to) return state;
      const exists = state.board.edges.some((e) => (e.from === from && e.to === to) || (e.from === to && e.to === from));
      if (exists) return state;
      return { ...state, board: { ...state.board, edges: [...state.board.edges, action.edge] } };
    }
    case 'boardUpdateEdge':
      return {
        ...state,
        board: { ...state.board, edges: state.board.edges.map((e) => (e.id === action.id ? { ...e, label: action.label } : e)) },
      };
    case 'boardRemoveEdge':
      return { ...state, board: { ...state.board, edges: state.board.edges.filter((e) => e.id !== action.id) } };
    case 'hypothesisDraft': {
      const h = state.hypotheses[action.id] ?? { current: '', history: [] };
      return { ...state, hypotheses: { ...state.hypotheses, [action.id]: { ...h, current: action.text } } };
    }
    case 'hypothesisSave': {
      const h = state.hypotheses[action.id];
      if (!h || !h.current.trim()) return state;
      const last = h.history[h.history.length - 1];
      if (last && last.text === h.current) return state;
      const version = { text: h.current, at: Date.now(), clueCount: Object.keys(state.clues).length };
      return { ...state, hypotheses: { ...state.hypotheses, [action.id]: { ...h, history: [...h.history, version] } } };
    }
    case 'connection':
      return { ...state, connection: { ...state.connection, [action.id]: action.text } };
    case 'clearConnection':
      return { ...state, connection: {} };
    case 'facilitatorNotes':
      return { ...state, facilitatorNotes: action.text };
    case 'settings':
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case 'finish':
      return { ...state, phase: 'final', finishedAt: state.finishedAt ?? Date.now() };
    case 'reset':
      return initialState(state.settings);
    case 'load':
      return action.state;
    default:
      return state;
  }
}

export function loadState(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (parsed?.v !== 1) return null;
    // Rellena campos que pudieran faltar en partidas guardadas por versiones anteriores.
    return { ...initialState(parsed.settings ?? defaultSettings), ...parsed };
  } catch {
    return null;
  }
}

export function saveState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* almacenamiento no disponible: la partida sigue en memoria */
  }
}

export function hasSavedGame(state: GameState) {
  return state.unlocked || Object.keys(state.clues).length > 0;
}

/** ¿Está disponible un contenido marcado con availableFrom en el capítulo actual? */
export const isAvailable = (state: Pick<GameState, 'chapter'>, from?: ChapterId) => !from || state.chapter >= from;

/** Porcentaje de sincronización mostrado en la barra de estado (recurso diegético). */
export function syncPercent(state: Pick<GameState, 'chapter' | 'unlocked'>) {
  if (!state.unlocked) return 64;
  return [0, 72, 81, 93, 100, 100][state.chapter];
}
