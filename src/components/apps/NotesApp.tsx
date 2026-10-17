import { useEffect, useState } from 'react';
import { diary, DIARY_PASSWORD, DIARY_PASSWORD_HINT, notes } from '../../data/diary';
import { fmtDateTime } from '../../lib/format';
import { useGame } from '../../state/GameContext';
import { Icon } from '../Icons';
import { AppHeader } from './AppHeader';

type View = { kind: 'root' } | { kind: 'note'; id: string } | { kind: 'diary' } | { kind: 'entry'; id: string } | { kind: 'lock' };

const normalize = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

export function NotesApp() {
  const { state, nav, dispatch, discover, sound, pushToast } = useGame();
  const [view, setView] = useState<View>({ kind: 'root' });
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    dispatch({ type: 'see', key: 'app:notas' });
  }, [dispatch]);

  useEffect(() => {
    if (nav.app !== 'notas' || !nav.target) return;
    if (nav.target.startsWith('diario:')) {
      const id = nav.target.slice(7);
      setView(state.diaryUnlocked ? { kind: 'entry', id } : { kind: 'lock' });
    } else setView({ kind: 'note', id: nav.target });
    // Solo reacciona a navegaciones desde fuera de la app.
  }, [nav]);

  useEffect(() => {
    if (view.kind === 'entry') discover([diary.find((d) => d.id === view.id)?.clue]);
    if (view.kind === 'note') discover([notes.find((n) => n.id === view.id)?.clue]);
  }, [view, discover]);

  const tryPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (normalize(pw) === DIARY_PASSWORD) {
      sound('unlock');
      dispatch({ type: 'unlockDiary' });
      pushToast({ kind: 'info', text: 'Carpeta desbloqueada', detail: '«Cosas mías» · 12 entradas' });
      setView({ kind: 'diary' });
      setPw('');
    } else {
      sound('error');
      setError(true);
    }
  };

  if (view.kind === 'lock') {
    return (
      <div className="app">
        <AppHeader title="Cosas mías" onBack={() => setView({ kind: 'root' })} />
        <form className="lock-folder" onSubmit={tryPassword}>
          <Icon name="candado" size={42} />
          <p>Esta carpeta está protegida con contraseña.</p>
          <p className="muted small">{DIARY_PASSWORD_HINT}</p>
          <label className="sr-only" htmlFor="diary-pw">
            Contraseña
          </label>
          <input
            id="diary-pw"
            className={`input ${error ? 'input-error' : ''}`}
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setError(false);
            }}
            placeholder="Contraseña"
            autoComplete="off"
            autoFocus
          />
          {error && (
            <p className="error-text" role="alert">
              Contraseña incorrecta.
            </p>
          )}
          <button className="btn btn-primary" type="submit">
            Abrir
          </button>
        </form>
      </div>
    );
  }

  if (view.kind === 'diary') {
    return (
      <div className="app">
        <AppHeader title="Cosas mías" subtitle={`${diary.length} entradas`} onBack={() => setView({ kind: 'root' })} />
        <ul className="list">
          {diary.map((d) => (
            <li key={d.id}>
              <button className="list-item note-item" onClick={() => setView({ kind: 'entry', id: d.id })}>
                <span className="li-main">
                  <span className="li-title">{d.title}</span>
                  <span className="li-sub">{d.paragraphs[0]}</span>
                </span>
                <span className="li-meta">{fmtDateTime(d.at, false).split(' · ')[0]}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (view.kind === 'entry') {
    const d = diary.find((x) => x.id === view.id)!;
    const i = diary.indexOf(d);
    return (
      <div className="app">
        <AppHeader title={d.title} subtitle={fmtDateTime(d.at)} onBack={() => setView({ kind: 'diary' })} />
        <article className="scroll note-body diary-body">
          {d.paragraphs.map((p, k) => (
            <p key={k}>{p}</p>
          ))}
          <nav className="entry-nav">
            <button className="btn btn-small" disabled={i === 0} onClick={() => setView({ kind: 'entry', id: diary[i - 1].id })}>
              ‹ Anterior
            </button>
            <button
              className="btn btn-small"
              disabled={i === diary.length - 1}
              onClick={() => setView({ kind: 'entry', id: diary[i + 1].id })}
            >
              Siguiente ›
            </button>
          </nav>
        </article>
      </div>
    );
  }

  if (view.kind === 'note') {
    const n = notes.find((x) => x.id === view.id)!;
    return (
      <div className="app">
        <AppHeader title={n.title} subtitle={fmtDateTime(n.at)} onBack={() => setView({ kind: 'root' })} />
        <article className="scroll note-body">
          <p className="pre">{n.text}</p>
        </article>
      </div>
    );
  }

  return (
    <div className="app">
      <AppHeader title="Notas" />
      <div className="scroll">
        <h3 className="group-label">Carpetas</h3>
        <ul className="list">
          <li>
            <button
              className="list-item"
              onClick={() => setView(state.diaryUnlocked ? { kind: 'diary' } : { kind: 'lock' })}
              aria-label={`Carpeta Cosas mías, ${state.diaryUnlocked ? 'desbloqueada' : 'bloqueada'}`}
            >
              <span className="folder-ico">
                <Icon name={state.diaryUnlocked ? 'notas' : 'candado'} />
              </span>
              <span className="li-main">
                <span className="li-title">Cosas mías</span>
                <span className="li-sub">{state.diaryUnlocked ? `${diary.length} entradas` : 'Protegida con contraseña'}</span>
              </span>
            </button>
          </li>
        </ul>
        <h3 className="group-label">Notas</h3>
        <ul className="list">
          {[...notes]
            .sort((a, b) => b.at.localeCompare(a.at))
            .map((n) => (
              <li key={n.id}>
                <button className="list-item note-item" onClick={() => setView({ kind: 'note', id: n.id })}>
                  <span className="li-main">
                    <span className="li-title">{n.title}</span>
                    <span className="li-sub">{n.text.split('\n')[0]}</span>
                  </span>
                  <span className="li-meta">{fmtDateTime(n.at, false).split(' · ')[0]}</span>
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
