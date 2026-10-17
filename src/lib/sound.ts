// Sonidos de interfaz sintetizados con Web Audio (no hay archivos de audio).
// Son discretos y se pueden desactivar en Ajustes.

export type SoundName = 'tap' | 'clue' | 'unlock' | 'error' | 'notify' | 'chapter';

let ctx: AudioContext | null = null;

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.05) {
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + start);
  o.stop(ctx.currentTime + start + dur + 0.05);
}

export function playSound(name: SoundName) {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = ctx ?? new AC();
    if (ctx.state === 'suspended') void ctx.resume();
    switch (name) {
      case 'tap':
        tone(880, 0, 0.05, 'triangle', 0.02);
        break;
      case 'clue':
        tone(660, 0, 0.18, 'sine', 0.04);
        tone(990, 0.09, 0.25, 'sine', 0.035);
        break;
      case 'unlock':
        tone(523, 0, 0.12);
        tone(784, 0.1, 0.2);
        break;
      case 'error':
        tone(196, 0, 0.18, 'triangle', 0.05);
        break;
      case 'notify':
        tone(740, 0, 0.12, 'sine', 0.035);
        tone(740, 0.16, 0.12, 'sine', 0.035);
        break;
      case 'chapter':
        tone(392, 0, 0.4, 'sine', 0.035);
        tone(523, 0.15, 0.5, 'sine', 0.03);
        tone(659, 0.3, 0.7, 'sine', 0.025);
        break;
    }
  } catch {
    /* sin audio disponible */
  }
}
