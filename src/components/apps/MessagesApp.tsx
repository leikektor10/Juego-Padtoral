import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { audioById } from '../../data/audios';
import { chats, LAST_CONNECTION } from '../../data/chats';
import { displayName, extraColors, contactById } from '../../data/contacts';
import { photoById } from '../../data/photos';
import { dayKey, fmtDate, fmtTime } from '../../lib/format';
import { isAvailable, type GameState } from '../../state/game';
import { useDiscoverOnView, useGame } from '../../state/GameContext';
import type { Chat, ChatMessage } from '../../types';
import { Icon } from '../Icons';
import { AppHeader, Avatar } from './AppHeader';
import { AudioPlayer } from './AudioPlayer';
import { PhotoViewer } from './PhotoViewer';

function lastMessage(c: Chat, state: Pick<GameState, 'chapter'>) {
  const list = c.messages.filter((m) => isAvailable(state, m.availableFrom));
  return list[list.length - 1];
}

function preview(m: ChatMessage) {
  if (m.deleted) return 'Mensaje eliminado';
  if (m.audio) return '🎙 Nota de voz';
  if (m.photo) return `📷 ${m.text ?? 'Foto'}`;
  return m.text ?? '';
}

export function MessagesApp() {
  const { state, nav, dispatch } = useGame();
  const [open, setOpen] = useState<string | null>(null);
  const [focusMsg, setFocusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (nav.app === 'mensajes' && nav.target) {
      const [chatId, msgId] = nav.target.split('#');
      setOpen(chatId);
      setFocusMsg(msgId ?? null);
    }
  }, [nav]);

  useEffect(() => {
    if (open) dispatch({ type: 'see', key: `chat:${open}` });
  }, [open, dispatch]);

  const list = useMemo(
    () =>
      chats
        .filter((c) => isAvailable(state, c.availableFrom))
        .map((c) => ({ c, last: lastMessage(c, state) }))
        .sort((a, b) => (b.last?.at ?? '').localeCompare(a.last?.at ?? '')),
    [state],
  );

  const chat = open ? chats.find((c) => c.id === open) : null;
  if (chat && isAvailable(state, chat.availableFrom)) {
    return <ChatView chat={chat} focusMsg={focusMsg} onBack={() => setOpen(null)} />;
  }

  return (
    <div className="app">
      <AppHeader title="Mensajes" subtitle={`${list.length} conversaciones`} />
      <ul className="list chat-list">
        {list.map(({ c, last }) => {
          const unread = state.seen[`chat:${c.id}`]
            ? 0
            : c.messages.filter((m) => m.at > LAST_CONNECTION && m.from !== 'yo' && isAvailable(state, m.availableFrom)).length;
          return (
            <li key={c.id}>
              <button className="list-item" onClick={() => setOpen(c.id)}>
                <Avatar color={c.color} initials={c.initials} />
                <span className="li-main">
                  <span className="li-title">
                    {c.title}
                    {c.kind === 'sms' && <span className="tag">SMS</span>}
                  </span>
                  <span className="li-sub">
                    {last && last.from !== 'yo' && c.kind === 'grupo' ? `${displayName(last.from)}: ` : ''}
                    {last && preview(last)}
                  </span>
                </span>
                <span className="li-meta">
                  <span>{last ? fmtDate(last.at, false) : ''}</span>
                  {unread > 0 && <span className="badge inline">{unread}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ChatView({ chat, focusMsg, onBack }: { chat: Chat; focusMsg: string | null; onBack: () => void }) {
  const { state } = useGame();
  const scroller = useRef<HTMLDivElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const messages = chat.messages.filter((m) => isAvailable(state, m.availableFrom));
  const firstSynced = messages.find((m) => m.at > LAST_CONNECTION);
  const contact = chat.contactId ? contactById(chat.contactId) : undefined;

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    if (focusMsg) {
      const target = el.querySelector<HTMLElement>(`[data-msg="${focusMsg}"]`);
      if (target) {
        target.scrollIntoView({ block: 'center' });
        target.classList.add('flash');
        return;
      }
    }
    el.scrollTop = el.scrollHeight;
  }, [focusMsg, chat.id]);

  const subtitle =
    chat.kind === 'grupo'
      ? `${chat.members?.length ?? 0} participantes`
      : chat.kind === 'sms'
        ? 'SMS · número no guardado en la agenda'
        : contact?.relation;

  let prevDay = '';
  return (
    <div className="app chat">
      <AppHeader title={chat.title} subtitle={subtitle} onBack={onBack} right={<Avatar color={chat.color} initials={chat.initials} size="sm" />} />
      <div className="chat-scroll" ref={scroller} role="log" aria-label={`Conversación: ${chat.title}`}>
        {messages.map((m) => {
          const day = dayKey(m.at);
          const showDay = day !== prevDay;
          prevDay = day;
          return (
            <Fragment key={m.id}>
              {m === firstSynced && (
                <div className="sync-divider" role="separator">
                  <span>
                    Última conexión del teléfono: sáb 31 ene · 21:47
                    <br />
                    Lo que sigue llegó al encenderlo el 19 de marzo
                  </span>
                </div>
              )}
              {showDay && <div className="day-sep">{fmtDate(m.at)}</div>}
              <Bubble m={m} group={chat.kind === 'grupo'} onPhoto={setPhoto} />
            </Fragment>
          );
        })}
        <p className="chat-foot">
          <Icon name="candado" size={12} /> Solo lectura: no se escribe desde el teléfono de otra persona.
        </p>
      </div>
      {photo && <PhotoViewer photoId={photo} onClose={() => setPhoto(null)} />}
    </div>
  );
}

function Bubble({ m, group, onPhoto }: { m: ChatMessage; group: boolean; onPhoto: (id: string) => void }) {
  const { media } = useGame();
  const mine = m.from === 'yo';
  // Las notas de voz registran su pista al escucharlas, no al verlas.
  const ref = useDiscoverOnView<HTMLDivElement>(m.audio ? undefined : m.clue);
  const color = contactById(m.from)?.color ?? extraColors[m.from] ?? '#888';
  const photo = m.photo ? photoById(m.photo) : undefined;
  const audio = m.audio ? audioById(m.audio) : undefined;
  const synced = m.at > LAST_CONNECTION;

  return (
    <div ref={ref} data-msg={m.id} className={`bubble-row ${mine ? 'mine' : ''}`}>
      <div className={`bubble ${m.deleted ? 'deleted' : ''} ${m.from === 'operador' || m.from === 'desconocido' ? 'sms' : ''}`}>
        {group && !mine && (
          <span className="bubble-author" style={{ color }}>
            {displayName(m.from)}
          </span>
        )}
        {m.deleted ? (
          <span className="deleted-text">
            <Icon name="papelera" size={14} /> {mine ? 'Eliminaste este mensaje' : 'Este mensaje fue eliminado'}
          </span>
        ) : (
          <>
            {photo && (
              <button className="bubble-photo" onClick={() => onPhoto(photo.id)} aria-label={`Abrir foto: ${photo.title}`}>
                <img src={media(photo.id, photo.file)} alt={photo.alt} loading="lazy" />
              </button>
            )}
            {audio && <AudioPlayer audio={audio} compact />}
            {m.text && <span className="bubble-text">{m.text}</span>}
          </>
        )}
        <span className="bubble-time">
          {fmtTime(m.at)}
          {synced && !mine && <span className="synced-mark" title="Recibido al sincronizar"> · recibido 19 mar</span>}
        </span>
      </div>
    </div>
  );
}
