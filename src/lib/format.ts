// Utilidades de fecha. Las fechas de la historia son locales y sin zona horaria.

export function parseIso(iso: string): Date {
  const [d, t] = iso.split('T');
  const [y, m, day] = d.split('-').map(Number);
  const [h, mi] = (t ?? '00:00').split(':').map(Number);
  return new Date(y, m - 1, day, h, mi);
}

const DAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MONTHS_LONG = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DAYS_LONG = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

export const hasTime = (iso: string) => iso.includes('T');

export function fmtTime(iso: string) {
  return hasTime(iso) ? iso.split('T')[1].slice(0, 5) : '';
}

/** «sáb 31 ene 2026» */
export function fmtDate(iso: string, withYear = true) {
  const d = parseIso(iso);
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}${withYear ? ` ${d.getFullYear()}` : ''}`;
}

/** «sáb 31 ene 2026 · 21:47» */
export function fmtDateTime(iso: string, withYear = true) {
  return hasTime(iso) ? `${fmtDate(iso, withYear)} · ${fmtTime(iso)}` : fmtDate(iso, withYear);
}

/** «sábado, 31 de enero de 2026» */
export function fmtLong(iso: string) {
  const d = parseIso(iso);
  return `${DAYS_LONG[d.getDay()]}, ${d.getDate()} de ${MONTHS_LONG[d.getMonth()]} de ${d.getFullYear()}`;
}

export function fmtMonthYear(year: number, month: number) {
  return `${MONTHS_LONG[month]} ${year}`;
}

export function fmtDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function fmtCallDuration(seconds?: number) {
  if (!seconds) return '';
  if (seconds < 60) return `${seconds} s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s ? `${m} min ${s} s` : `${m} min`;
}

export const dayKey = (iso: string) => iso.slice(0, 10);

export const MONTH_NAMES = MONTHS_LONG;
