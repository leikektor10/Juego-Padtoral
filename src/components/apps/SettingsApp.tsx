import { useEffect, useState } from 'react';
import { LOCK_WALLPAPER } from '../../data/photos';
import { deviceInfo } from '../../data/records';
import { fmtDateTime } from '../../lib/format';
import { useGame } from '../../state/GameContext';
import { Icon } from '../Icons';
import { AppHeader } from './AppHeader';

type Section = 'info' | 'wifi' | 'bateria' | 'fondo' | 'datos';

const SECTIONS: { id: Section; label: string; icon: string; clue?: string }[] = [
  { id: 'info', label: 'Información del teléfono', icon: 'telefono', clue: 'c_propietario' },
  { id: 'wifi', label: 'Wi‑Fi', icon: 'wifi', clue: 'c_ultima_conexion' },
  { id: 'datos', label: 'Datos móviles', icon: 'sync' },
  { id: 'bateria', label: 'Batería', icon: 'bateria', clue: 'c_bateria' },
  { id: 'fondo', label: 'Fondo de pantalla', icon: 'imagen', clue: 'c_pin_lucia' },
];

export function SettingsApp() {
  const { nav, discover, media } = useGame();
  const [sec, setSec] = useState<Section | null>(null);

  useEffect(() => {
    if (nav.app === 'ajustes' && nav.target) setSec(nav.target as Section);
  }, [nav]);

  useEffect(() => {
    if (sec) discover([SECTIONS.find((s) => s.id === sec)?.clue]);
  }, [sec, discover]);

  if (sec) {
    const meta = SECTIONS.find((s) => s.id === sec)!;
    return (
      <div className="app">
        <AppHeader title={meta.label} onBack={() => setSec(null)} />
        <div className="scroll pad">
          {sec === 'info' && (
            <dl className="kv">
              <dt>Nombre del dispositivo</dt>
              <dd>{deviceInfo.owner}</dd>
              <dt>Número</dt>
              <dd>{deviceInfo.number}</dd>
              <dt>Modelo</dt>
              <dd>{deviceInfo.model}</dd>
              <dt>Almacenamiento</dt>
              <dd>{deviceInfo.storage}</dd>
              <dt>Cuenta</dt>
              <dd>marcos.ferrer.dibuja@correo.example</dd>
            </dl>
          )}
          {sec === 'wifi' && (
            <>
              <p className="muted small">Redes guardadas y su última conexión.</p>
              <ul className="list">
                {deviceInfo.wifi.map((w) => (
                  <li key={w.ssid} className="kv-row">
                    <Icon name="wifi" size={18} />
                    <span className="li-main">
                      <span className="li-title">{w.ssid}</span>
                      <span className="li-sub">Última conexión: {fmtDateTime(w.last)}</span>
                      {w.note && <span className="li-sub">{w.note}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {sec === 'datos' && <p>{deviceInfo.dataPlan}</p>}
          {sec === 'bateria' && (
            <ol className="visits">
              {deviceInfo.battery.map((b) => (
                <li key={b.at}>
                  <strong>{fmtDateTime(b.at)}</strong>
                  <span>{b.text}</span>
                </li>
              ))}
            </ol>
          )}
          {sec === 'fondo' && (
            <figure className="wallpaper-preview">
              <img src={media('fondo-bloqueo', LOCK_WALLPAPER)} alt="Fondo de pantalla: cumpleaños de Lucía. Pancarta: ¡Feliz cumple, enana! 14 · 06." />
              <figcaption className="muted small">Foto de fondo: cumpleaños de Lucía, sábado 14 de junio de 2025.</figcaption>
            </figure>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <AppHeader title="Ajustes" />
      <ul className="list">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <button className="list-item" onClick={() => setSec(s.id)}>
              <span className="folder-ico">
                <Icon name={s.icon} />
              </span>
              <span className="li-main">
                <span className="li-title">{s.label}</span>
              </span>
              <span className="li-meta">›</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
