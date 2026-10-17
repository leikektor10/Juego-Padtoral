import { useEffect, useState } from 'react';
import { chats } from '../../data/chats';
import { clues } from '../../data/clues';
import { contacts, OWNER } from '../../data/contacts';
import { calls } from '../../data/records';
import { fmtDateTime } from '../../lib/format';
import { isAvailable, type GameState } from '../../state/game';
import { useGame } from '../../state/GameContext';
import type { Contact } from '../../types';
import { Icon } from '../Icons';
import { AppHeader, Avatar } from './AppHeader';

/** Último contacto conocido: el mensaje o la llamada más reciente con esa persona. */
function lastContact(c: Contact, state: Pick<GameState, 'chapter'>) {
  const dates: string[] = [];
  chats
    .filter((ch) => ch.contactId === c.id && isAvailable(state, ch.availableFrom))
    .forEach((ch) => ch.messages.forEach((m) => dates.push(m.at)));
  chats
    .filter((ch) => ch.kind === 'grupo')
    .forEach((ch) => ch.messages.filter((m) => m.from === c.id).forEach((m) => dates.push(m.at)));
  calls.filter((k) => k.who === c.id).forEach((k) => dates.push(k.at));
  return dates.sort().pop();
}

export function ContactsApp() {
  const { state, nav, openApp, openClue } = useGame();
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (nav.app === 'contactos' && nav.target) setOpen(nav.target);
  }, [nav]);

  const visible = contacts.filter((c) => isAvailable(state, c.availableFrom));
  const c = open ? visible.find((x) => x.id === open) : null;

  if (c) {
    const chat = chats.find((ch) => ch.contactId === c.id && isAvailable(state, ch.availableFrom));
    const shared = chat ? chat.messages.filter((m) => isAvailable(state, m.availableFrom)).length : 0;
    const groupMsgs = chats.find((ch) => ch.id === 'grupo')!.messages.filter((m) => m.from === c.id).length;
    const known = clues.filter((k) => k.people?.includes(c.id) && state.clues[k.id]);
    const last = lastContact(c, state);
    return (
      <div className="app">
        <AppHeader title="Ficha" onBack={() => setOpen(null)} />
        <div className="scroll pad contact-card">
          <div className="contact-hero">
            <Avatar color={c.color} initials={c.initials} size="lg" />
            <h3>{c.name}</h3>
            <p className="muted">{c.relation}</p>
          </div>
          <dl className="kv">
            <dt>Teléfono</dt>
            <dd>{c.phone}</dd>
            {c.agendaNote && (
              <>
                <dt>Nota de la agenda</dt>
                <dd>{c.agendaNote}</dd>
              </>
            )}
            <dt>Último contacto</dt>
            <dd>{last ? fmtDateTime(last) : '—'}</dd>
            <dt>Mensajes compartidos</dt>
            <dd>
              {shared} en privado{groupMsgs ? ` · ${groupMsgs} en el grupo del centro` : ''}
            </dd>
          </dl>
          {chat && (
            <button className="btn btn-small" onClick={() => openApp('mensajes', chat.id)}>
              <Icon name="mensajes" size={16} /> Abrir conversación
            </button>
          )}
          <h4>Lo que sabemos</h4>
          {known.length ? (
            <ul className="clue-mini">
              {known.map((k) => (
                <li key={k.id}>
                  <button className="link-btn" onClick={() => openClue(k.id)}>
                    {k.title}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted small">Aún no hay pistas relacionadas con esta persona.</p>
          )}
          <h4>Preguntas</h4>
          <ul className="questions">
            {c.openQuestions.map((q) => {
              const solved = q.resolvedBy?.every((id) => state.clues[id]);
              return (
                <li key={q.q} className={solved ? 'solved' : ''}>
                  <span className="q">{q.q}</span>
                  {solved ? <span className="a">{q.answer}</span> : <span className="a muted">Sin responder todavía.</span>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <AppHeader title="Contactos" subtitle={`${visible.length} contactos`} />
      <ul className="list scroll">
        <li className="owner-row">
          <span className="avatar md" style={{ background: '#3f6b4f' }} aria-hidden="true">
            M
          </span>
          <span className="li-main">
            <span className="li-title">{OWNER.name}</span>
            <span className="li-sub">Mi tarjeta · {OWNER.phone}</span>
          </span>
        </li>
        {[...visible]
          .sort((a, b) => a.name.localeCompare(b.name, 'es'))
          .map((k) => (
            <li key={k.id}>
              <button className="list-item" onClick={() => setOpen(k.id)}>
                <Avatar color={k.color} initials={k.initials} />
                <span className="li-main">
                  <span className="li-title">{k.name}</span>
                  <span className="li-sub">{k.relation}</span>
                </span>
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
