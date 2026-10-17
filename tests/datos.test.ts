import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { audios } from '../src/data/audios';
import { chapters } from '../src/data/chapters';
import { chats, LAST_CONNECTION } from '../src/data/chats';
import { clueById, clues } from '../src/data/clues';
import { contacts } from '../src/data/contacts';
import { diary, notes } from '../src/data/diary';
import { endingSummary } from '../src/data/ending';
import { photos } from '../src/data/photos';
import { browserHistory, calendarEvents, calls, files, places } from '../src/data/records';
import { parseIso } from '../src/lib/format';

const SETTINGS_CLUES = ['c_propietario', 'c_ultima_conexion', 'c_bateria', 'c_pin_lucia'];
const avail = (n: number, from?: number) => !from || n >= from;

/** Todas las referencias a pistas que hay repartidas por los datos. */
function allReferences() {
  const refs: { where: string; id: string }[] = [];
  const add = (where: string, id?: string) => id && refs.push({ where, id });
  chats.forEach((c) => c.messages.forEach((m) => add(`chat ${c.id}/${m.id}`, m.clue)));
  photos.forEach((p) => {
    add(`foto ${p.id}`, p.clue);
    p.hotspots.forEach((h) => add(`hotspot ${h.id}`, h.clue));
  });
  diary.forEach((d) => add(`diario ${d.id}`, d.clue));
  notes.forEach((n) => add(`nota ${n.id}`, n.clue));
  audios.forEach((a) => add(`audio ${a.id}`, a.clue));
  calls.forEach((c) => add(`llamada ${c.id}`, c.clue));
  calendarEvents.forEach((e) => add(`evento ${e.id}`, e.clue));
  files.forEach((f) => {
    add(`archivo ${f.id}`, f.clue);
    f.deleted?.requires.forEach((r) => add(`requisito ${f.id}`, r));
  });
  browserHistory.forEach((b) => add(`navegador ${b.id}`, b.clue));
  places.forEach((p) => p.visits.forEach((v) => add(`lugar ${p.id}`, v.clue)));
  SETTINGS_CLUES.forEach((id) => add('ajustes', id));
  chapters.forEach((ch) => ch.questions.forEach((q) => q.support?.forEach((s) => add(`pregunta ${q.id}`, s))));
  contacts.forEach((c) => c.openQuestions.forEach((q) => q.resolvedBy?.forEach((r) => add(`contacto ${c.id}`, r))));
  endingSummary.comprobado.forEach((c, i) => c.clues.forEach((id) => add(`final ${i}`, id)));
  clues.forEach((c) => c.contradicts?.forEach((x) => add(`contradicción ${c.id}`, x)));
  return refs;
}

/** Pistas que se pueden descubrir en el capítulo n, resolviendo dependencias (contraseña, archivos eliminados). */
function reachable(n: number) {
  const got = new Set<string>(SETTINGS_CLUES);
  const add = (id?: string) => id && got.add(id);
  let size = -1;
  while (size !== got.size) {
    size = got.size;
    chats.filter((c) => avail(n, c.availableFrom)).forEach((c) => c.messages.filter((m) => avail(n, m.availableFrom)).forEach((m) => add(m.clue)));
    photos.filter((p) => avail(n, p.availableFrom)).forEach((p) => (add(p.clue), p.hotspots.forEach((h) => add(h.clue))));
    if (got.has('c_comic_nadie') || got.has('c_sara_nadie')) diary.forEach((d) => add(d.clue));
    notes.forEach((x) => add(x.clue));
    audios.filter((a) => a.location !== 'eliminado').forEach((a) => add(a.clue));
    calls.forEach((c) => add(c.clue));
    calendarEvents.forEach((e) => add(e.clue));
    files.forEach((f) => {
      if (!f.deleted) return add(f.clue);
      if (f.deleted.recoverable !== 'no' && f.deleted.requires.every((r) => got.has(r))) add(f.clue);
    });
    browserHistory.forEach((b) => add(b.clue));
    places.forEach((p) => p.visits.forEach((v) => add(v.clue)));
  }
  return got;
}

describe('Registro de pistas', () => {
  it('no hay identificadores repetidos', () => {
    const ids = clues.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('toda referencia apunta a una pista existente', () => {
    const missing = allReferences().filter((r) => !clueById(r.id));
    expect(missing).toEqual([]);
  });

  it('toda pista se puede descubrir en algún momento', () => {
    const r = reachable(5);
    const unreachable = clues.filter((c) => !r.has(c.id)).map((c) => c.id);
    expect(unreachable).toEqual([]);
  });

  it('la fuente de cada pista existe', () => {
    const bad: string[] = [];
    clues.forEach((c) => {
      const { app, id } = c.source;
      const ok =
        (app === 'mensajes' && chats.some((ch) => ch.messages.some((m) => `${ch.id}#${m.id}` === id))) ||
        (app === 'galeria' && photos.some((p) => p.id === id)) ||
        (app === 'notas' && (diary.some((d) => `diario:${d.id}` === id) || notes.some((x) => x.id === id))) ||
        (app === 'grabadora' && audios.some((a) => a.id === id)) ||
        (app === 'llamadas' && calls.some((x) => x.id === id)) ||
        (app === 'calendario' && calendarEvents.some((e) => e.id === id)) ||
        (app === 'archivos' && files.some((f) => f.id === id)) ||
        (app === 'navegador' && browserHistory.some((b) => b.id === id)) ||
        (app === 'mapas' && places.some((p) => p.id === id)) ||
        (app === 'ajustes' && ['info', 'wifi', 'bateria', 'fondo', 'datos'].includes(id));
      if (!ok) bad.push(c.id);
    });
    expect(bad).toEqual([]);
  });

  it('cada contradicción enfrenta un testimonio o interpretación con otra pista', () => {
    clues
      .filter((c) => c.contradicts)
      .forEach((c) => expect(c.certainty === 'testimonio' || c.contradicts!.some((x) => clueById(x)?.certainty === 'testimonio')).toBe(true));
  });
});

describe('Capítulos', () => {
  it('cada deducción se puede resolver con las pruebas disponibles en su capítulo', () => {
    chapters.forEach((ch) => {
      const r = reachable(ch.id);
      ch.questions.forEach((q) => q.support?.forEach((s) => expect(r.has(s), `${q.id} necesita ${s}`).toBe(true)));
    });
  });

  it('las respuestas correctas existen entre las opciones', () => {
    chapters.forEach((ch) =>
      ch.questions
        .filter((q) => q.type !== 'texto')
        .forEach((q) => {
          const ids = q.options!.map((o) => o.id);
          if (q.type === 'orden') expect([...(q.correct as string[])].sort()).toEqual([...ids].sort());
          else expect(ids).toContain(q.correct);
        }),
    );
  });

  it('las revelaciones del capítulo 4 no están disponibles antes', () => {
    const r3 = reachable(3);
    ['c_rosa_msg', 'c_marcos_msg', 'c_sms_operador'].forEach((id) => expect(r3.has(id)).toBe(false));
  });

  it('cada capítulo tiene tres niveles de ayuda', () => {
    chapters.forEach((ch) => expect(ch.hints).toHaveLength(3));
  });

  it('el orden del capítulo 5 coincide con las fechas de las pistas', () => {
    const dates: Record<string, string> = {
      o_padre: '2025-11-15',
      o_escape: '2026-01-10',
      o_sara: '2026-01-13',
      o_orientadora: '2026-01-20',
      o_buenasnoches: '2026-01-29',
      o_fiesta: '2026-01-31',
      o_traslado: '2026-02-02',
      o_saranacho: '2026-02-08',
      o_mensaje: '2026-02-12',
      o_hallazgo: '2026-03-19',
    };
    const order = chapters[4].questions[0].correct as string[];
    const sorted = [...order].sort((a, b) => dates[a].localeCompare(dates[b]));
    expect(order).toEqual(sorted);
  });
});

describe('Coherencia temporal', () => {
  it('los mensajes de cada chat están en orden cronológico', () => {
    chats.forEach((c) => {
      const ats = c.messages.map((m) => m.at);
      expect(ats, c.id).toEqual([...ats].sort());
    });
  });

  it('Marcos no envía nada desde el teléfono después de la última conexión', () => {
    chats.forEach((c) => c.messages.filter((m) => m.from === 'yo').forEach((m) => expect(m.at <= LAST_CONNECTION, `${c.id}/${m.id}`).toBe(true)));
  });

  it('no hay llamadas, fotos, notas ni búsquedas posteriores a la última conexión', () => {
    [...calls, ...photos.filter((p) => p.origin !== 'recibida'), ...notes, ...diary, ...browserHistory].forEach((x) =>
      expect(x.at <= LAST_CONNECTION, x.id).toBe(true),
    );
  });

  it('las actividades del centro juvenil caen en sábado', () => {
    calendarEvents
      .filter((e) => e.category === 'centro' && /Centro|CONVIVENCIA|Convivencia|FIESTA/.test(e.title))
      .forEach((e) => expect(parseIso(e.date).getDay(), e.title).toBe(6));
  });

  it('entre la última conexión y el hallazgo pasan 47 días', () => {
    const days = (parseIso('2026-03-19').getTime() - parseIso('2026-01-31').getTime()) / 86400000;
    expect(Math.round(days)).toBe(47);
  });

  it('el PIN corresponde al cumpleaños de Lucía', () => {
    const ev = calendarEvents.find((e) => e.id === 'e21')!;
    expect(ev.date.slice(5)).toBe('06-14');
  });
});

describe('Recursos visuales', () => {
  const root = join(__dirname, '..', 'public');
  it('cada foto tiene su archivo', () => {
    photos.forEach((p) => expect(existsSync(join(root, p.file)), p.file).toBe(true));
  });
  it('el manifiesto cubre todas las fotos y apunta a archivos existentes', () => {
    const manifest = JSON.parse(readFileSync(join(root, 'media', 'manifest.json'), 'utf8')) as Record<string, string>;
    photos.forEach((p) => expect(manifest[p.id]).toBeDefined());
    Object.entries(manifest)
      .filter(([k]) => !k.startsWith('_'))
      .forEach(([, v]) => expect(existsSync(join(root, v)), v).toBe(true));
  });
  it('los puntos interactivos están dentro de la imagen', () => {
    photos.forEach((p) =>
      p.hotspots.forEach((h) => {
        expect(h.x + h.w).toBeLessThanOrEqual(100);
        expect(h.y + h.h).toBeLessThanOrEqual(100);
      }),
    );
  });
});

