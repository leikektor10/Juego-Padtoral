import { useState } from 'react';
import { CASE_ID, GAME_SUBTITLE } from '../data/meta';
import { hasSavedGame } from '../state/game';
import { useGame } from '../state/GameContext';
import { FacilitatorGuide } from './FacilitatorGuide';
import { Confirm } from './Modal';
import { SettingsDialog } from './SettingsDialog';

export function TitleScreen() {
  const { state, dispatch, sound } = useGame();
  const [guide, setGuide] = useState(false);
  const [settings, setSettings] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);
  const saved = hasSavedGame(state);

  const start = () => {
    sound('unlock');
    dispatch({ type: 'newGame' });
  };
  const resume = () => {
    sound('unlock');
    dispatch({ type: 'setPhase', phase: state.finishedAt ? 'final' : 'juego' });
  };

  return (
    <main className="title-screen">
      <div className="title-inner">
        <p className="case-id">{CASE_ID}</p>
        <h1 className="game-title">ÚLTIMA CONEXIÓN</h1>
        <p className="tagline">Hay historias que comienzan cuando alguien deja de venir.</p>
        <div className="title-actions">
          {saved ? (
            <>
              <button className="btn btn-power" onClick={resume}>
                <span className="power-dot" aria-hidden="true" /> Continuar investigación
              </button>
              <button className="btn btn-ghost" onClick={() => setConfirmNew(true)}>
                Empezar de nuevo
              </button>
            </>
          ) : (
            <button className="btn btn-power" onClick={start}>
              <span className="power-dot" aria-hidden="true" /> Encender dispositivo
            </button>
          )}
        </div>
      </div>
      <footer className="title-footer">
        <button className="link-btn" onClick={() => setGuide(true)}>
          Guía para quien facilita
        </button>
        <span aria-hidden="true">·</span>
        <button className="link-btn" onClick={() => setSettings(true)}>
          Accesibilidad y sonido
        </button>
      </footer>
      {guide && <FacilitatorGuide onClose={() => setGuide(false)} />}
      {settings && <SettingsDialog onClose={() => setSettings(false)} inGame={false} />}
      {confirmNew && (
        <Confirm
          title="Empezar una partida nueva"
          text="Se borrará el progreso guardado en este dispositivo: pistas, tablero, hipótesis y respuestas. ¿Continuar?"
          confirmLabel="Borrar y empezar"
          danger
          onCancel={() => setConfirmNew(false)}
          onConfirm={() => {
            setConfirmNew(false);
            start();
          }}
        />
      )}
    </main>
  );
}

export function ContentWarning() {
  const { dispatch } = useGame();
  return (
    <main className="paper-screen">
      <article className="paper-card" aria-labelledby="aviso-title">
        <p className="paper-subtitle">
          <strong>Última conexión</strong> · {GAME_SUBTITLE}
        </p>
        <p className="eyebrow">Antes de empezar</p>
        <h1 id="aviso-title">Aviso de contenido</h1>
        <p>
          Esta experiencia trata temas de <strong>aislamiento</strong>, <strong>conflictos familiares</strong>, <strong>presión académica</strong> y{' '}
          <strong>sufrimiento emocional</strong> en la adolescencia. No contiene violencia gráfica ni autolesiones.
        </p>
        <p>
          Toda la historia, sus personajes, mensajes y archivos son <strong>ficticios</strong>.
        </p>
        <ul className="plain-list">
          <li>Está pensada para jugarse en grupo, con un adulto responsable que facilite el diálogo posterior.</li>
          <li>Podéis pausar o abandonar el juego en cualquier momento (botón «Pausa»).</li>
          <li>Nadie tiene que compartir experiencias personales si no quiere.</li>
          <li>
            Si durante la actividad alguien cuenta una situación real de riesgo, se deja el juego a un lado y quien facilita activa los
            protocolos de protección y acompañamiento del centro.
          </li>
        </ul>
        <p className="help-line">
          Si tú o alguien que conoces lo está pasando mal, habla con un adulto de confianza. En España: <strong>Fundación ANAR 900 20 20 10</strong>{' '}
          (niños y adolescentes) · <strong>024</strong> (atención a la conducta suicida) · <strong>112</strong> (emergencias). En otros países, usad los
          recursos locales.
        </p>
        <div className="row-end">
          <button className="btn" onClick={() => dispatch({ type: 'setPhase', phase: 'titulo' })}>
            Volver
          </button>
          <button className="btn btn-primary" onClick={() => dispatch({ type: 'setPhase', phase: 'encargo' })}>
            Entendido, continuar
          </button>
        </div>
      </article>
    </main>
  );
}

export function CaseBrief() {
  const { dispatch, sound } = useGame();
  return (
    <main className="paper-screen">
      <article className="paper-card report" aria-labelledby="informe-title">
        <div className="report-head">
          <span>Centro Juvenil Domingo Savio</span>
          <span>{CASE_ID}</span>
        </div>
        <h1 id="informe-title">Informe de hallazgo</h1>
        <dl className="report-meta">
          <dt>Fecha</dt>
          <dd>Jueves, 19 de marzo de 2026 · 12:40</dd>
          <dt>Lugar</dt>
          <dd>Almacén 2, durante la reorganización de material para Semana Santa</dd>
          <dt>Objeto</dt>
          <dd>Teléfono móvil, funda azul con una pegatina de un campamento. Batería agotada.</dd>
        </dl>
        <p>
          Entre cajas de material antiguo ha aparecido un teléfono móvil. Todo apunta a que pertenece a un chico del grupo 17+ que dejó de venir
          hace semanas. Nadie sabe bien por qué. Su familia no contesta al teléfono que figura en la ficha de inscripción.
        </p>
        <p>
          La coordinación del centro ha decidido examinar el dispositivo <strong>con un único fin: saber cómo está y cómo contactar con él</strong>.
          Lo que encontréis pertenece a su intimidad. Tratadlo con respeto.
        </p>
        <div className="funda-note" aria-label="Papel encontrado dentro de la funda">
          <span className="note-label">Dentro de la funda había un papel doblado:</span>
          <p className="handwritten">PIN: el cumple de la enana 🙃</p>
        </div>
        <h2>Vuestro encargo</h2>
        <ol className="plain-list numbered">
          <li>Reconstruid sus últimos días conocidos.</li>
          <li>Averiguad qué estaba viviendo fuera de la vista de los demás y qué señales pasaron inadvertidas.</li>
          <li>Distinguid lo que se puede comprobar de lo que solo se supone.</li>
        </ol>
        <h2>Cómo se juega</h2>
        <ul className="plain-list">
          <li>
            <strong>El teléfono</strong>: abrid sus aplicaciones en el orden que queráis. Leer mensajes, ampliar fotos o escuchar audios registra
            pistas.
          </li>
          <li>
            <strong>El expediente</strong>: objetivos de cada capítulo, pistas, cronología, tablero de reconstrucción, hipótesis y ayudas.
          </li>
          <li>Equivocarse forma parte de investigar. Las ayudas os orientan sin daros la solución.</li>
        </ul>
        <div className="row-end">
          <button
            className="btn btn-primary"
            onClick={() => {
              sound('unlock');
              dispatch({ type: 'setPhase', phase: 'juego' });
            }}
          >
            Cargar y encender el teléfono
          </button>
        </div>
      </article>
    </main>
  );
}
