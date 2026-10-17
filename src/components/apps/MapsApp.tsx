import { useEffect, useState } from 'react';
import { places } from '../../data/records';
import { fmtDateTime, fmtTime } from '../../lib/format';
import { useGame } from '../../state/GameContext';
import type { Place } from '../../types';
import { AppHeader } from './AppHeader';

const KIND_COLOR: Record<Place['kind'], string> = {
  casa: '#c9a227',
  estudios: '#4a6fa5',
  centro: '#2f8f6a',
  calle: '#8a6fb0',
  familia: '#c0704a',
  salud: '#b5483b',
  transporte: '#6b7280',
};

/** Plano esquemático de una ciudad ficticia con el historial de ubicaciones del teléfono. */
export function MapsApp() {
  const { nav, discover } = useGame();
  const [sel, setSel] = useState<string | null>(null);

  useEffect(() => {
    if (nav.app === 'mapas' && nav.target) setSel(nav.target);
  }, [nav]);

  const place = sel ? places.find((p) => p.id === sel) : null;
  useEffect(() => {
    if (place) discover(place.visits.map((v) => v.clue));
  }, [place, discover]);

  return (
    <div className="app">
      <AppHeader title="Mapas" subtitle="Historial de ubicaciones" />
      <div className="map-wrap">
        <svg className="map" viewBox="0 0 100 70" role="img" aria-label="Plano de la ciudad con los lugares visitados">
          <rect width="100" height="70" fill="#1d2329" />
          <path d="M-2 52 C 20 46, 35 58, 55 50 S 85 40, 102 46" stroke="#2e4c63" strokeWidth="4" fill="none" />
          <g stroke="#2d343c" strokeWidth="1.4">
            <path d="M0 20 H100 M0 34 H100 M0 62 H100 M14 0 V70 M38 0 V70 M62 0 V70 M86 0 V70" />
            <path d="M0 8 L100 40 M20 70 L70 0" strokeWidth="1" />
          </g>
          <rect x="70" y="6" width="18" height="12" rx="3" fill="#24372b" />
          <text x="79" y="4.5" fontSize="2.3" fill="#7d8b80" textAnchor="middle">
            Parque del Cerro
          </text>
          {places.map((p) => (
            <g
              key={p.id}
              className={`map-pin ${sel === p.id ? 'sel' : ''}`}
              transform={`translate(${p.x} ${p.y * 0.7})`}
              onClick={() => setSel(p.id)}
            >
              <circle r={sel === p.id ? 2.8 : 2.1} fill={KIND_COLOR[p.kind]} stroke="#fff" strokeWidth="0.5" />
              <text y="-3.4" fontSize="2.3" fill="#e8eaed" textAnchor={p.offMap ? 'end' : 'middle'}>
                {p.offMap ? `→ ${p.name} (2 h)` : p.name.split(' (')[0]}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="map-places" role="list">
        {places.map((p) => (
          <button key={p.id} role="listitem" className={`chip ${sel === p.id ? 'on' : ''}`} onClick={() => setSel(p.id)}>
            <span className="dot" style={{ background: KIND_COLOR[p.kind] }} /> {p.name}
          </button>
        ))}
      </div>
      <div className="scroll pad map-detail" aria-live="polite">
        {place ? (
          <>
            <h3>{place.name}</h3>
            <p className="muted small">{place.description}</p>
            <ul className="visits">
              {place.visits.map((v) => (
                <li key={v.id}>
                  <strong>
                    {fmtDateTime(v.from)}
                    {v.to ? ` → ${v.to.slice(0, 10) === v.from.slice(0, 10) ? fmtTime(v.to) : fmtDateTime(v.to)}` : ''}
                  </strong>
                  {v.note && <span>{v.note}</span>}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="muted small">Pulsa un lugar para ver cuándo estuvo allí el teléfono. El historial termina el 31 de enero a las 21:47.</p>
        )}
      </div>
    </div>
  );
}
