import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { photoById } from '../../data/photos';
import { fmtDateTime } from '../../lib/format';
import { useGame } from '../../state/GameContext';
import type { Hotspot } from '../../types';
import { Icon } from '../Icons';

const ORIGIN: Record<string, string> = {
  camara: 'Cámara del teléfono',
  captura: 'Captura de pantalla',
  recibida: 'Recibida por chat',
};

/** Visor a pantalla completa con ampliación y detalles examinables. */
export function PhotoViewer({ photoId, onClose, onNav }: { photoId: string; onClose: () => void; onNav?: (dir: -1 | 1) => void }) {
  const { state, dispatch, discover, media, sound } = useGame();
  const photo = photoById(photoId)!;
  const [zoom, setZoom] = useState(false);
  const [showSpots, setShowSpots] = useState(true);
  const [active, setActive] = useState<Hotspot | null>(null);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    discover([photo.clue]);
    setActive(null);
    setZoom(false);
  }, [photo, discover]);

  useEffect(() => {
    dialog.current?.focus();
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    }
    if (onNav && e.key === 'ArrowRight') onNav(1);
    if (onNav && e.key === 'ArrowLeft') onNav(-1);
  };

  const examine = (h: Hotspot) => {
    sound('tap');
    setActive(h);
    dispatch({ type: 'see', key: `hotspot:${h.id}` });
    discover([h.clue]);
  };

  // Portal: el visor ocupa toda la ventana aunque se abra desde dentro del teléfono.
  return createPortal(
    <div className="viewer" role="dialog" aria-modal="true" aria-label={`Foto: ${photo.title}`} tabIndex={-1} ref={dialog} onKeyDown={onKey}>
      <div className="viewer-bar">
        <button className="icon-btn light" onClick={onClose} aria-label="Cerrar foto">
          <Icon name="cerrar" />
        </button>
        <div className="viewer-title">
          <strong>{photo.title}</strong>
          <span>{fmtDateTime(photo.at)}</span>
        </div>
        <div className="viewer-tools">
          <button className={`chip ${showSpots ? 'on' : ''}`} onClick={() => setShowSpots((v) => !v)} aria-pressed={showSpots}>
            Detalles ({photo.hotspots.length})
          </button>
          <button className={`chip ${zoom ? 'on' : ''}`} onClick={() => setZoom((v) => !v)} aria-pressed={zoom}>
            <Icon name="ampliar" size={16} /> {zoom ? 'Reducir' : 'Ampliar'}
          </button>
        </div>
      </div>
      <div className="viewer-body">
        {onNav && (
          <button className="viewer-nav prev" onClick={() => onNav(-1)} aria-label="Foto anterior">
            ‹
          </button>
        )}
        <div className={`viewer-stage ${zoom ? 'zoomed' : ''}`}>
          <div className="viewer-frame">
            <img src={media(photo.id, photo.file)} alt={photo.alt} />
            {showSpots &&
              photo.hotspots.map((h) => {
                const found = !!state.seen[`hotspot:${h.id}`] || (h.clue ? !!state.clues[h.clue] : false);
                return (
                  <button
                    key={h.id}
                    className={`hotspot ${active?.id === h.id ? 'active' : ''} ${found ? 'found' : ''}`}
                    style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
                    onClick={() => examine(h)}
                    aria-label={`Examinar: ${h.label}`}
                  >
                    <span className="hotspot-dot" />
                  </button>
                );
              })}
          </div>
        </div>
        {onNav && (
          <button className="viewer-nav next" onClick={() => onNav(1)} aria-label="Foto siguiente">
            ›
          </button>
        )}
      </div>
      <div className="viewer-info" aria-live="polite">
        {active ? (
          <div className="detail-card">
            <p className="eyebrow">Detalle · {active.label}</p>
            <p>{active.text}</p>
            <button className="link-btn" onClick={() => setActive(null)}>
              Volver a la información de la foto
            </button>
          </div>
        ) : (
          <div className="detail-card">
            <p>{photo.description}</p>
            <p className="muted small">
              {ORIGIN[photo.origin]}
              {photo.place ? ` · ${photo.place}` : ''}
            </p>
            {photo.hotspots.length > 0 && <p className="muted small">Pulsad los recuadros punteados para examinar detalles.</p>}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
