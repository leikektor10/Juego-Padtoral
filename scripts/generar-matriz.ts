// Genera docs/MATRIZ_EVIDENCIAS.md a partir de los datos del juego.
// Uso: npm run matriz
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { audios } from '../src/data/audios';
import { chapters } from '../src/data/chapters';
import { chats } from '../src/data/chats';
import { clues } from '../src/data/clues';
import { diary, notes } from '../src/data/diary';
import { photos } from '../src/data/photos';
import { browserHistory, calendarEvents, calls, files, places } from '../src/data/records';

const CERT = { hecho: 'Hecho', testimonio: 'Testimonio', interpretacion: 'Interpretación' };

// Dónde se descubre cada pista (puede haber varias pruebas para la misma revelación).
const where = new Map<string, string[]>();
const add = (id: string | undefined, label: string) => {
  if (!id) return;
  where.set(id, [...(where.get(id) ?? []), label]);
};
chats.forEach((c) => c.messages.forEach((m) => add(m.clue, `Mensajes · ${c.title} (${m.at.slice(0, 10)})${c.availableFrom ? ` · cap. ${c.availableFrom}` : ''}`)));
photos.forEach((p) => {
  add(p.clue, `Galería · ${p.title}`);
  p.hotspots.forEach((h) => add(h.clue, `Galería · ${p.title} → detalle «${h.label}»`));
});
diary.forEach((d) => add(d.clue, `Notas · Cosas mías (diario) · ${d.at.slice(0, 10)}`));
notes.forEach((n) => add(n.clue, `Notas · ${n.title}`));
audios.forEach((a) => add(a.clue, `Grabadora · ${a.title}${a.location === 'eliminado' ? ' (recuperado)' : ''}`));
calls.forEach((c) => add(c.clue, `Teléfono · llamada ${c.at.replace('T', ' ')}`));
calendarEvents.forEach((e) => add(e.clue, `Calendario · ${e.title}`));
files.forEach((f) => add(f.clue, `Archivos · ${f.folder} · ${f.name}${f.deleted ? ` (requiere: ${f.deleted.requires.join(', ')})` : ''}`));
browserHistory.forEach((b) => add(b.clue, `Navegador · «${b.query}»`));
places.forEach((p) => p.visits.forEach((v) => add(v.clue, `Mapas · ${p.name}`)));
add('c_propietario', 'Ajustes · Información');
add('c_ultima_conexion', 'Ajustes · Wi‑Fi');
add('c_bateria', 'Ajustes · Batería');
add('c_pin_lucia', 'Pantalla de bloqueo / Ajustes · Fondo');

const usedBy = new Map<string, string[]>();
chapters.forEach((ch) => ch.questions.forEach((q) => q.support?.forEach((s) => usedBy.set(s, [...(usedBy.get(s) ?? []), `Cap. ${ch.id}`]))));

const esc = (s: string) => s.replace(/\|/g, '\\|');
let md = `# Matriz de evidencias\n\n> Generada automáticamente con \`npm run matriz\` a partir de \`src/data\`. No editar a mano.\n\n`;
md += `Cada fila es una pista: qué revela, cómo de fiable es, dónde se encuentra (a veces en varias pruebas) y qué deducción de capítulo sostiene.\n\n`;
md += `Total: **${clues.length} pistas**.\n\n`;
md += `| Pista | Revela | Certeza | Fecha | Dónde se encuentra | Sostiene | Contradice |\n|---|---|---|---|---|---|---|\n`;
[...clues]
  .sort((a, b) => (a.date ?? '0').localeCompare(b.date ?? '0'))
  .forEach((c) => {
    md += `| **${esc(c.title)}** | ${esc(c.detail)} | ${CERT[c.certainty]} | ${c.date?.replace('T', ' ') ?? '—'} | ${(where.get(c.id) ?? []).map(esc).join('<br>')} | ${[...new Set(usedBy.get(c.id) ?? [])].join(', ') || '—'} | ${(c.contradicts ?? []).map((x) => esc(clues.find((k) => k.id === x)?.title ?? x)).join('<br>') || '—'} |\n`;
  });

md += `\n## Deducciones por capítulo\n\n`;
chapters.forEach((ch) => {
  md += `### Capítulo ${ch.id} · ${ch.title}\n\n${ch.objective}\n\n`;
  ch.questions.forEach((q) => {
    if (q.type === 'texto') {
      md += `- *(abierta, no se corrige)* ${q.prompt}\n`;
      return;
    }
    const answer = q.type === 'orden' ? 'orden cronológico' : q.options?.find((o) => o.id === q.correct)?.label;
    md += `- **${q.prompt}** → ${answer}${q.support ? ` · pruebas: ${q.support.map((s) => clues.find((c) => c.id === s)?.title).join('; ')}` : ''}\n`;
  });
  md += '\n';
});

writeFileSync(join(__dirname, '..', 'docs', 'MATRIZ_EVIDENCIAS.md'), md);
console.log(`Matriz generada: ${clues.length} pistas.`);
