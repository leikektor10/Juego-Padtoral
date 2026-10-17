import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import { clueById } from '../data/clues';
import { playSound, type SoundName } from '../lib/sound';
import type { AppId } from '../types';
import { initialState, loadState, reducer, saveState, type Action, type GameState } from './game';

export interface Toast {
  id: number;
  text: string;
  detail?: string;
  kind: 'pista' | 'info' | 'aviso';
  clueId?: string;
}

export interface PhoneNav {
  app: AppId | null;
  /** Elemento concreto a abrir dentro de la app (chat#mensaje, id de foto…). */
  target?: string;
  /** Cambia en cada navegación para que las apps reaccionen aunque el destino se repita. */
  nonce: number;
}

interface GameContextValue {
  state: GameState;
  dispatch: (a: Action) => void;
  discover: (ids: (string | undefined | null)[]) => void;
  nav: PhoneNav;
  openApp: (app: AppId | null, target?: string) => void;
  view: 'telefono' | 'expediente';
  setView: (v: 'telefono' | 'expediente') => void;
  toasts: Toast[];
  pushToast: (t: Omit<Toast, 'id'>) => void;
  dismissToast: (id: number) => void;
  sound: (name: SoundName) => void;
  media: (id: string, fallback: string) => string;
  drawerClue: string | null;
  openClue: (id: string | null) => void;
  boardOpen: boolean;
  setBoardOpen: (open: boolean) => void;
  panelTab: PanelTab;
  setPanelTab: (t: PanelTab) => void;
}

export type PanelTab = 'caso' | 'pistas' | 'cronologia' | 'reconstruccion' | 'hipotesis' | 'ayuda';

const Ctx = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, rawDispatch] = useReducer(reducer, undefined, () => {
    const saved = loadState();
    // Siempre se arranca en la portada; desde ahí se puede continuar.
    return saved ? { ...saved, phase: 'titulo' as const } : initialState();
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  const [nav, setNav] = useState<PhoneNav>({ app: null, nonce: 0 });
  const [view, setView] = useState<'telefono' | 'expediente'>('telefono');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [drawerClue, setDrawerClue] = useState<string | null>(null);
  const [boardOpen, setBoardOpen] = useState(false);
  const [panelTab, setPanelTab] = useState<PanelTab>('caso');
  const [manifest, setManifest] = useState<Record<string, string>>({});
  const toastId = useRef(0);

  // Guardado automático.
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Ajustes de accesibilidad aplicados al documento.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--text-scale', String(state.settings.textScale));
    root.classList.toggle('reduce-motion', state.settings.reduceMotion);
  }, [state.settings.textScale, state.settings.reduceMotion]);

  // Manifiesto de imágenes (permite sustituir ilustraciones sin tocar el código).
  useEffect(() => {
    fetch('media/manifest.json')
      .then((r) => (r.ok ? r.json() : {}))
      .then((m: Record<string, string>) => setManifest(m ?? {}))
      .catch(() => setManifest({}));
  }, []);

  const sound = useCallback((name: SoundName) => {
    if (stateRef.current.settings.sound) playSound(name);
  }, []);

  const pushToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = ++toastId.current;
    setToasts((ts) => [...ts.slice(-2), { ...t, id }]);
    window.setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 4200);
  }, []);

  const dismissToast = useCallback((id: number) => setToasts((ts) => ts.filter((x) => x.id !== id)), []);

  const dispatch = useCallback((a: Action) => rawDispatch(a), []);

  const discover = useCallback(
    (ids: (string | undefined | null)[]) => {
      const fresh = ids.filter((id): id is string => !!id && !stateRef.current.clues[id] && !!clueById(id));
      if (!fresh.length) return;
      // Evita toasts duplicados si el mismo descubrimiento llega dos veces antes de re-renderizar.
      stateRef.current = { ...stateRef.current, clues: { ...stateRef.current.clues, ...Object.fromEntries(fresh.map((f) => [f, 1])) } };
      rawDispatch({ type: 'discover', ids: fresh });
      if (fresh.length > 2) {
        pushToast({ kind: 'pista', text: `${fresh.length} pistas nuevas`, detail: 'Revisadlas en la pestaña «Pistas» del expediente.' });
      } else {
        fresh.forEach((id) => pushToast({ kind: 'pista', text: 'Nueva pista', detail: clueById(id)!.title, clueId: id }));
      }
      sound('clue');
    },
    [pushToast, sound],
  );

  const openApp = useCallback((app: AppId | null, target?: string) => {
    setNav((n) => ({ app, target, nonce: n.nonce + 1 }));
    if (app) setView('telefono');
  }, []);

  const media = useCallback((id: string, fallback: string) => manifest[id] ?? fallback, [manifest]);

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      dispatch,
      discover,
      nav,
      openApp,
      view,
      setView,
      toasts,
      pushToast,
      dismissToast,
      sound,
      media,
      drawerClue,
      openClue: setDrawerClue,
      boardOpen,
      setBoardOpen,
      panelTab,
      setPanelTab,
    }),
    [state, dispatch, discover, nav, openApp, view, toasts, pushToast, dismissToast, sound, media, drawerClue, boardOpen, panelTab],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGame() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useGame fuera de GameProvider');
  return v;
}

/**
 * Devuelve una ref que registra una pista cuando el elemento se hace visible
 * (al leer un mensaje, al desplazarse por una lista…).
 */
export function useDiscoverOnView<T extends Element>(clueId?: string) {
  const { discover, state } = useGame();
  const known = clueId ? !!state.clues[clueId] : true;
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (known || !clueId || !ref.current) return;
    const el = ref.current;
    if (typeof IntersectionObserver === 'undefined') {
      discover([clueId]);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          discover([clueId]);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [clueId, known, discover]);
  return ref;
}
