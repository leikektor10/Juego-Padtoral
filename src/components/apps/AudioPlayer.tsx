import { useEffect, useMemo, useRef, useState } from 'react';
import { fmtDuration } from '../../lib/format';
import { useGame } from '../../state/GameContext';
import type { AudioNote } from '../../types';
import { Icon } from '../Icons';

// Reproductor funcional sin archivo de sonido: el tiempo avanza de verdad,
// los subtítulos se sincronizan y la transcripción completa está siempre a mano.
// Opcionalmente, la voz sintética del navegador puede leer cada frase.

function bars(seed: string, n: number) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return Array.from({ length: n }, (_, i) => {
    h = (h * 1103515245 + 12345) >>> 0;
    return 0.25 + ((h >>> 8) % 1000) / 1000 * 0.75 * (0.6 + 0.4 * Math.sin(i / 3));
  });
}

export function AudioPlayer({ audio, compact }: { audio: AudioNote; compact?: boolean }) {
  const { discover } = useGame();
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [transcript, setTranscript] = useState(!compact);
  const [voice, setVoice] = useState(false);
  const spoken = useRef(-1);
  const waves = useMemo(() => bars(audio.id, compact ? 28 : 48), [audio.id, compact]);
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!playing) return;
    const started = performance.now() - t * 1000;
    let raf = 0;
    const tick = () => {
      const now = (performance.now() - started) / 1000;
      if (now >= audio.duration) {
        setT(audio.duration);
        setPlaying(false);
        return;
      }
      setT(now);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // t se lee solo al empezar a reproducir: no es dependencia a propósito.
  }, [playing, audio.duration]);

  const idx = audio.segments.reduce((acc, s, i) => (t >= s.t ? i : acc), 0);
  const current = audio.segments[idx];

  // La pista se registra al escuchar buena parte del audio o al abrir la transcripción.
  useEffect(() => {
    if (t / audio.duration >= 0.6 || transcript) discover([audio.clue]);
  }, [t, transcript, audio, discover]);

  useEffect(() => {
    if (!voice || !playing || !canSpeak || spoken.current === idx) return;
    spoken.current = idx;
    const text = current.text.replace(/\([^)]*\)/g, '').trim();
    window.speechSynthesis.cancel();
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-ES';
    window.speechSynthesis.speak(u);
  }, [idx, voice, playing, canSpeak, current]);

  useEffect(() => {
    if ((!playing || !voice) && canSpeak) window.speechSynthesis.cancel();
  }, [playing, voice, canSpeak]);

  useEffect(() => () => void (canSpeak && window.speechSynthesis.cancel()), [canSpeak]);

  const toggle = () => {
    if (!playing && t >= audio.duration) {
      setT(0);
      spoken.current = -1;
    }
    setPlaying((p) => !p);
  };

  const progress = t / audio.duration;

  return (
    <div className={`audio-player ${compact ? 'compact' : ''}`}>
      <div className="ap-row">
        <button className="ap-play" onClick={toggle} aria-label={playing ? 'Pausar' : `Reproducir ${audio.title}`}>
          <Icon name={playing ? 'pausa' : 'play'} size={18} />
        </button>
        <div className="ap-wave" aria-hidden="true">
          {waves.map((h, i) => (
            <span key={i} className={i / waves.length <= progress ? 'on' : ''} style={{ height: `${h * 100}%` }} />
          ))}
        </div>
        <span className="ap-time">
          {fmtDuration(t)} / {fmtDuration(audio.duration)}
        </span>
      </div>
      <input
        className="ap-seek"
        type="range"
        min={0}
        max={audio.duration}
        step={0.5}
        value={t}
        onChange={(e) => {
          setT(Number(e.target.value));
          spoken.current = -1;
        }}
        aria-label="Posición de la reproducción"
      />
      <p className="ap-subtitle" aria-live="polite">
        {t > 0 || playing ? (
          <>
            {current.speaker && <strong>{current.speaker}: </strong>}
            {current.text}
          </>
        ) : (
          <span className="muted">Subtítulos: pulsad reproducir.</span>
        )}
      </p>
      <div className="ap-tools">
        <button className="link-btn" onClick={() => setTranscript((v) => !v)} aria-expanded={transcript}>
          {transcript ? 'Ocultar transcripción' : 'Ver transcripción completa'}
        </button>
        {canSpeak && (
          <label className="ap-voice">
            <input type="checkbox" checked={voice} onChange={(e) => setVoice(e.target.checked)} /> Voz sintética
          </label>
        )}
      </div>
      {transcript && (
        <ol className="transcript">
          {audio.segments.map((s, i) => (
            <li key={i} className={i === idx && (t > 0 || playing) ? 'now' : ''}>
              <button
                className="ts-btn"
                onClick={() => {
                  setT(s.t);
                  spoken.current = -1;
                }}
              >
                <span className="ts-time">{fmtDuration(s.t)}</span>
                <span>
                  {s.speaker && <strong>{s.speaker}: </strong>}
                  {s.text}
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
