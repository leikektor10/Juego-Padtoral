// Genera las ilustraciones provisionales de la galería (SVG) en public/media/fotos.
// Uso: npm run fotos
// Son ilustraciones coherentes con la historia (mismos personajes, ropa y lugares),
// pensadas para sustituirse por fotografías originales mediante public/media/manifest.json.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'media', 'fotos');
mkdirSync(OUT, { recursive: true });

const HAND = "'Segoe Print','Bradley Hand','Comic Sans MS','Chalkboard SE',cursive";
const SANS = "'Helvetica Neue',Arial,sans-serif";

// Paleta de personajes (se mantiene en todas las imágenes).
const CAST = {
  marcos: { skin: '#d9a37e', hair: '#2a1b12', hairStyle: 'curly', top: '#3f6b4f', bottom: '#2e3542' },
  ivan: { skin: '#c99272', hair: '#1c1712', hairStyle: 'buzz', top: '#b5483b', bottom: '#2c2f38' },
  sara: { skin: '#b9825f', hair: '#1f140f', hairStyle: 'long', top: '#c98a2b', bottom: '#3a3a4a' },
  claudia: { skin: '#efc6a6', hair: '#d8b25a', hairStyle: 'bob', top: '#4a6fa5', bottom: '#2f3540' },
  alvaro: { skin: '#e2b08c', hair: '#5a3b22', hairStyle: 'short', top: '#7a5c99', bottom: '#30333d' },
  nacho: { skin: '#d6a07a', hair: '#3b2a1e', hairStyle: 'beard', top: '#7d8086', bottom: '#2b3038' },
  lucia: { skin: '#e0ae88', hair: '#3a2416', hairStyle: 'pigtails', top: '#8a5aa8', bottom: '#4b3f5e' },
  mama: { skin: '#dcaa86', hair: '#4a2c1c', hairStyle: 'long', top: '#a0617a', bottom: '#3a3440' },
  papa: { skin: '#cf9c78', hair: '#5d5a55', hairStyle: 'shortgray', top: '#2f3e57', bottom: '#2a2a30' },
  rosa: { skin: '#e3b593', hair: '#8c8c8c', hairStyle: 'bob', top: '#7b6b3a', bottom: '#3a3530' },
  paco: { skin: '#d49c74', hair: '#d49c74', hairStyle: 'bald', top: '#5b4a3a', bottom: '#2c2a28' },
  noa: { skin: '#ecc0a0', hair: '#7a3a22', hairStyle: 'long', top: '#5b7f9e', bottom: '#2c3038' },
};

const extras = [
  { skin: '#e8b994', hair: '#2b2018', hairStyle: 'short', top: '#9a4f6e', bottom: '#33333d' },
  { skin: '#c48a64', hair: '#16100c', hairStyle: 'long', top: '#5a8a6e', bottom: '#2f2f3a' },
  { skin: '#f0c8a8', hair: '#6b4a2a', hairStyle: 'bob', top: '#c7744a', bottom: '#2d3440' },
  { skin: '#a8714f', hair: '#120c08', hairStyle: 'curly', top: '#3e5d86', bottom: '#2a2d36' },
  { skin: '#deb08e', hair: '#3c2a1c', hairStyle: 'short', top: '#8d6e3f', bottom: '#2f3138' },
  { skin: '#e6b48f', hair: '#2a1a10', hairStyle: 'long', top: '#6a6aa0', bottom: '#30303c' },
];

function head(cx, cy, r, p, mood = 'smile', look = 0) {
  const { skin, hair, hairStyle } = p;
  let back = '';
  let front = '';
  switch (hairStyle) {
    case 'curly':
      front = [[-0.7, -0.55], [-0.35, -0.85], [0.05, -0.95], [0.45, -0.82], [0.75, -0.5], [-0.85, -0.15], [0.88, -0.15]]
        .map(([dx, dy]) => `<circle cx="${cx + dx * r}" cy="${cy + dy * r}" r="${r * 0.42}" fill="${hair}"/>`)
        .join('');
      break;
    case 'buzz':
      front = `<path d="M${cx - r * 0.98} ${cy - r * 0.05} A${r} ${r} 0 0 1 ${cx + r * 0.98} ${cy - r * 0.05} Q${cx} ${cy - r * 0.55} ${cx - r * 0.98} ${cy - r * 0.05}Z" fill="${hair}" opacity="0.9"/>`;
      break;
    case 'long':
      back = `<path d="M${cx - r * 1.08} ${cy} Q${cx - r * 1.2} ${cy + r * 1.9} ${cx - r * 0.7} ${cy + r * 2.1} L${cx + r * 0.7} ${cy + r * 2.1} Q${cx + r * 1.2} ${cy + r * 1.9} ${cx + r * 1.08} ${cy}Z" fill="${hair}"/>`;
      front = `<path d="M${cx - r * 1.05} ${cy - r * 0.05} A${r * 1.05} ${r * 1.05} 0 0 1 ${cx + r * 1.05} ${cy - r * 0.05} Q${cx + r * 0.2} ${cy - r * 0.75} ${cx - r * 1.05} ${cy - r * 0.05}Z" fill="${hair}"/>`;
      break;
    case 'bob':
      back = `<path d="M${cx - r * 1.12} ${cy - r * 0.1} L${cx - r * 1.1} ${cy + r * 0.95} L${cx + r * 1.1} ${cy + r * 0.95} L${cx + r * 1.12} ${cy - r * 0.1}Z" fill="${hair}"/>`;
      front = `<path d="M${cx - r * 1.1} ${cy + r * 0.05} A${r * 1.1} ${r * 1.1} 0 0 1 ${cx + r * 1.1} ${cy + r * 0.05} L${cx + r * 0.9} ${cy - r * 0.25} Q${cx} ${cy - r * 0.5} ${cx - r * 0.6} ${cy - r * 0.2}Z" fill="${hair}"/>`;
      break;
    case 'pigtails':
      back = `<circle cx="${cx - r * 1.15}" cy="${cy + r * 0.2}" r="${r * 0.45}" fill="${hair}"/><circle cx="${cx + r * 1.15}" cy="${cy + r * 0.2}" r="${r * 0.45}" fill="${hair}"/>`;
      front = `<path d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} Q${cx} ${cy - r * 0.45} ${cx - r} ${cy}Z" fill="${hair}"/>`;
      break;
    case 'beard':
      front =
        `<path d="M${cx - r} ${cy - r * 0.05} A${r} ${r} 0 0 1 ${cx + r} ${cy - r * 0.05} Q${cx} ${cy - r * 0.5} ${cx - r} ${cy - r * 0.05}Z" fill="${hair}"/>` +
        `<path d="M${cx - r * 0.85} ${cy + r * 0.25} Q${cx} ${cy + r * 1.35} ${cx + r * 0.85} ${cy + r * 0.25} Q${cx} ${cy + r * 0.75} ${cx - r * 0.85} ${cy + r * 0.25}Z" fill="${hair}"/>` +
        `<rect x="${cx - r * 0.62}" y="${cy - r * 0.2}" width="${r * 0.5}" height="${r * 0.32}" rx="${r * 0.1}" fill="none" stroke="#222" stroke-width="${r * 0.06}"/>` +
        `<rect x="${cx + r * 0.12}" y="${cy - r * 0.2}" width="${r * 0.5}" height="${r * 0.32}" rx="${r * 0.1}" fill="none" stroke="#222" stroke-width="${r * 0.06}"/>`;
      break;
    case 'shortgray':
      front = `<path d="M${cx - r} ${cy - r * 0.05} A${r} ${r} 0 0 1 ${cx + r} ${cy - r * 0.05} Q${cx} ${cy - r * 0.45} ${cx - r} ${cy - r * 0.05}Z" fill="${hair}"/>`;
      break;
    case 'bald':
      front = `<path d="M${cx - r * 0.5} ${cy + r * 0.45} Q${cx} ${cy + r * 0.3} ${cx + r * 0.5} ${cy + r * 0.45}" stroke="#4a3426" stroke-width="${r * 0.18}" fill="none" stroke-linecap="round"/>`;
      break;
    default:
      front = `<path d="M${cx - r} ${cy - r * 0.02} A${r} ${r} 0 0 1 ${cx + r} ${cy - r * 0.02} Q${cx + r * 0.3} ${cy - r * 0.6} ${cx - r} ${cy - r * 0.02}Z" fill="${hair}"/>`;
  }
  const ey = mood === 'down' ? cy + r * 0.15 : cy + r * 0.02;
  const lx = look * r * 0.25;
  const eyes =
    mood === 'closed'
      ? `<path d="M${cx - r * 0.5 + lx} ${ey} q${r * 0.15} ${r * 0.12} ${r * 0.3} 0 M${cx + r * 0.2 + lx} ${ey} q${r * 0.15} ${r * 0.12} ${r * 0.3} 0" stroke="#2a1d16" stroke-width="${r * 0.08}" fill="none"/>`
      : `<circle cx="${cx - r * 0.35 + lx}" cy="${ey}" r="${r * (mood === 'down' ? 0.07 : 0.09)}" fill="#2a1d16"/><circle cx="${cx + r * 0.35 + lx}" cy="${ey}" r="${r * (mood === 'down' ? 0.07 : 0.09)}" fill="#2a1d16"/>`;
  let mouth = '';
  if (mood === 'smile' || mood === 'closed') mouth = `<path d="M${cx - r * 0.3 + lx} ${cy + r * 0.4} Q${cx + lx} ${cy + r * 0.65} ${cx + r * 0.3 + lx} ${cy + r * 0.4}" stroke="#7a3b2e" stroke-width="${r * 0.08}" fill="none" stroke-linecap="round"/>`;
  if (mood === 'laugh') mouth = `<path d="M${cx - r * 0.32 + lx} ${cy + r * 0.35} Q${cx + lx} ${cy + r * 0.85} ${cx + r * 0.32 + lx} ${cy + r * 0.35}Z" fill="#6b2a22"/>`;
  if (mood === 'down' || mood === 'neutral') mouth = `<path d="M${cx - r * 0.2 + lx} ${cy + r * 0.5} L${cx + r * 0.2 + lx} ${cy + r * 0.5}" stroke="#7a3b2e" stroke-width="${r * 0.07}" stroke-linecap="round"/>`;
  if (mood === 'none') return `${back}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${skin}"/>${front}`;
  return `${back}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${skin}"/>${front}${eyes}${mouth}`;
}

/** Persona de frente. x: centro; y: pies; h: altura total. */
function person(x, y, h, p, o = {}) {
  const { mood = 'smile', look = 0, sit = false, armUp = null, phone = false, opacity = 1, waistTie = null } = o;
  const r = h * 0.085;
  const headCY = y - h + r;
  const neckY = headCY + r * 0.95;
  const sw = h * 0.27;
  const hip = sit ? y - h * 0.3 : y - h * 0.43;
  const torsoTop = neckY + r * 0.1;
  const armW = sw * 0.22;
  const armL = (hip - torsoTop) * 1.02;
  let s = `<g opacity="${opacity}">`;
  // piernas
  if (sit) {
    s += `<rect x="${x - sw * 0.48}" y="${hip - h * 0.02}" width="${sw * 0.96}" height="${h * 0.14}" rx="${sw * 0.15}" fill="${p.bottom}"/>`;
    s += `<rect x="${x - sw * 0.42}" y="${hip + h * 0.1}" width="${sw * 0.3}" height="${h * 0.2}" rx="${sw * 0.1}" fill="${p.bottom}"/>`;
    s += `<rect x="${x + sw * 0.12}" y="${hip + h * 0.1}" width="${sw * 0.3}" height="${h * 0.2}" rx="${sw * 0.1}" fill="${p.bottom}"/>`;
  } else {
    s += `<rect x="${x - sw * 0.4}" y="${hip - h * 0.02}" width="${sw * 0.36}" height="${y - hip}" rx="${sw * 0.12}" fill="${p.bottom}"/>`;
    s += `<rect x="${x + sw * 0.04}" y="${hip - h * 0.02}" width="${sw * 0.36}" height="${y - hip}" rx="${sw * 0.12}" fill="${p.bottom}"/>`;
    s += `<ellipse cx="${x - sw * 0.22}" cy="${y}" rx="${sw * 0.24}" ry="${h * 0.02}" fill="#1d1d22"/><ellipse cx="${x + sw * 0.22}" cy="${y}" rx="${sw * 0.24}" ry="${h * 0.02}" fill="#1d1d22"/>`;
  }
  // brazos
  const armL_ = armUp === 'left' || armUp === 'both';
  const armR_ = armUp === 'right' || armUp === 'both';
  s += armL_
    ? `<rect x="${x - sw / 2 - armW * 0.9}" y="${torsoTop - armL * 0.85}" width="${armW}" height="${armL}" rx="${armW / 2}" fill="${p.top}"/><circle cx="${x - sw / 2 - armW * 0.4}" cy="${torsoTop - armL * 0.85}" r="${armW * 0.55}" fill="${p.skin}"/>`
    : `<rect x="${x - sw / 2 - armW * 0.75}" y="${torsoTop + r * 0.15}" width="${armW}" height="${armL}" rx="${armW / 2}" fill="${p.top}"/><circle cx="${x - sw / 2 - armW * 0.25}" cy="${torsoTop + armL + r * 0.1}" r="${armW * 0.5}" fill="${p.skin}"/>`;
  s += armR_
    ? `<rect x="${x + sw / 2 - armW * 0.1}" y="${torsoTop - armL * 0.85}" width="${armW}" height="${armL}" rx="${armW / 2}" fill="${p.top}"/><circle cx="${x + sw / 2 + armW * 0.4}" cy="${torsoTop - armL * 0.85}" r="${armW * 0.55}" fill="${p.skin}"/>`
    : phone
      ? ''
      : `<rect x="${x + sw / 2 - armW * 0.25}" y="${torsoTop + r * 0.15}" width="${armW}" height="${armL}" rx="${armW / 2}" fill="${p.top}"/><circle cx="${x + sw / 2 + armW * 0.25}" cy="${torsoTop + armL + r * 0.1}" r="${armW * 0.5}" fill="${p.skin}"/>`;
  // torso
  s += `<rect x="${x - sw / 2}" y="${torsoTop}" width="${sw}" height="${hip - torsoTop + h * 0.02}" rx="${sw * 0.28}" fill="${p.top}"/>`;
  if (waistTie) s += `<rect x="${x - sw * 0.52}" y="${hip - h * 0.05}" width="${sw * 1.04}" height="${h * 0.05}" rx="${h * 0.02}" fill="${waistTie}"/>`;
  if (phone) {
    // brazo doblado sujetando el móvil delante del pecho
    const py = torsoTop + (hip - torsoTop) * 0.45;
    s += `<rect x="${x - armW * 0.2}" y="${py}" width="${sw * 0.55}" height="${armW}" rx="${armW / 2}" fill="${p.top}" transform="rotate(-25 ${x} ${py})"/>`;
    s += `<rect x="${x - sw * 0.12}" y="${py - h * 0.06}" width="${sw * 0.26}" height="${h * 0.075}" rx="${sw * 0.03}" fill="#15181d" stroke="#555" stroke-width="1"/>`;
    s += `<circle cx="${x}" cy="${py + h * 0.02}" r="${armW * 0.45}" fill="${p.skin}"/>`;
  }
  s += `<rect x="${x - r * 0.35}" y="${neckY - r * 0.2}" width="${r * 0.7}" height="${r * 0.5}" fill="${p.skin}"/>`;
  s += head(x, headCY, r, p, mood, look);
  s += '</g>';
  return s;
}

const defs = (w, h, { grain = 0.07, vignette = 0.45 } = {}) => `
<defs>
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 ${grain} 0"/>
  </filter>
  <radialGradient id="vig" cx="50%" cy="50%" r="75%">
    <stop offset="55%" stop-color="#000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000" stop-opacity="${vignette}"/>
  </radialGradient>
  <filter id="soft"><feGaussianBlur stdDeviation="${Math.round(w / 300)}"/></filter>
  <filter id="blurry"><feGaussianBlur stdDeviation="5 2"/></filter>
  <filter id="glow"><feGaussianBlur stdDeviation="4"/></filter>
</defs>`;

const finish = (w, h, tint = null) =>
  (tint ? `<rect width="${w}" height="${h}" fill="${tint}" opacity="0.08"/>` : '') +
  `<rect width="${w}" height="${h}" fill="url(#vig)"/><rect width="${w}" height="${h}" filter="url(#grain)"/>`;

const svg = (w, h, body, opts) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${defs(w, h, opts)}${body}</svg>\n`;

const txt = (x, y, s, { size = 28, fill = '#222', font = SANS, weight = 400, anchor = 'start', rotate = 0, ls = 0 } = {}) =>
  `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" fill="${fill}" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${ls}"${rotate ? ` transform="rotate(${rotate} ${x} ${y})"` : ''}>${s}</text>`;

const files = {};

// ───────── P01 · Lago ─────────
files['p01-campamento-lago.svg'] = svg(1200, 900, `
<linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fc0e3"/><stop offset="1" stop-color="#e6f0f2"/></linearGradient>
<linearGradient id="lake1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6aa2b6"/><stop offset="1" stop-color="#3d6f82"/></linearGradient>
<rect width="1200" height="900" fill="url(#sky1)"/>
<circle cx="980" cy="140" r="60" fill="#fff6d8" opacity="0.9"/>
<polygon points="0,520 160,330 300,450 470,280 640,470 820,320 1000,460 1200,350 1200,560 0,560" fill="#7d9a8f"/>
<polygon points="0,560 220,420 380,520 560,400 760,540 940,430 1200,520 1200,600 0,600" fill="#5d7c70"/>
<rect y="560" width="1200" height="230" fill="url(#lake1)"/>
${Array.from({ length: 14 }, (_, i) => `<rect x="${60 + i * 85}" y="${600 + (i % 3) * 40}" width="${40 + (i % 4) * 12}" height="3" fill="#fff" opacity="0.35"/>`).join('')}
<rect y="770" width="1200" height="130" fill="#c8b38a"/>
${person(520, 900, 560, CAST.marcos, { mood: 'laugh', waistTie: '#3f6b4f', look: 0.3 })}
${person(700, 900, 580, { ...CAST.ivan }, { mood: 'laugh', look: -0.3 })}
<rect x="530" y="430" width="190" height="34" rx="17" fill="${CAST.ivan.skin}" transform="rotate(-4 620 447)"/>
${finish(1200, 900, '#f2c27a')}
`);

// ───────── P02 · Hoguera ─────────
files['p02-hoguera.svg'] = svg(1200, 900, `
<linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1222"/><stop offset="1" stop-color="#1e2742"/></linearGradient>
<radialGradient id="fire2" cx="50%" cy="78%" r="45%"><stop offset="0" stop-color="#ffb04a" stop-opacity="0.75"/><stop offset="1" stop-color="#ffb04a" stop-opacity="0"/></radialGradient>
<rect width="1200" height="900" fill="url(#sky2)"/>
${Array.from({ length: 70 }, (_, i) => `<circle cx="${(i * 173) % 1200}" cy="${(i * 97) % 380}" r="${(i % 3) * 0.8 + 0.8}" fill="#fff" opacity="${0.3 + (i % 5) * 0.12}"/>`).join('')}
<polygon points="0,470 200,420 420,460 640,400 900,450 1200,410 1200,900 0,900" fill="#121618"/>
<rect width="1200" height="900" fill="url(#fire2)"/>
${[[180, 0.3], [300, -0.2], [420, 0.1], [780, -0.1], [900, 0.2], [1020, -0.3]].map(([x, l], i) => person(x, 830, 330, { ...extras[i % 6], top: '#3a2c26', bottom: '#241c19' }, { sit: true, mood: 'smile', look: x < 600 ? 0.5 : -0.5 })).join('')}
${person(540, 860, 300, { ...CAST.marcos, top: '#4a3a2c' }, { sit: true, mood: 'laugh', look: 0.4 })}
${person(660, 860, 300, { ...CAST.ivan, top: '#4a2c26' }, { sit: true, mood: 'laugh', look: -0.4 })}
<polygon points="560,780 600,640 640,780" fill="#ff8a2a"/><polygon points="580,780 610,690 640,780" fill="#ffd166"/><polygon points="545,790 575,720 600,790" fill="#ff6a2a"/>
<rect x="530" y="780" width="140" height="18" rx="9" fill="#3b2516"/>
${finish(1200, 900, '#ff9a3a')}
`);

// ───────── P03 · Colador ─────────
files['p03-colador.svg'] = svg(1200, 900, `
<rect width="1200" height="900" fill="#ebe5d6"/>
${Array.from({ length: 13 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="620" stroke="#d6cfbd" stroke-width="3"/>`).join('')}
${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${i * 100}" x2="1200" y2="${i * 100}" stroke="#d6cfbd" stroke-width="3"/>`).join('')}
<rect y="620" width="1200" height="280" fill="#8a6f55"/><rect y="620" width="1200" height="22" fill="#a4886c"/>
<rect x="80" y="520" width="150" height="100" rx="10" fill="#9aa3aa"/><rect x="960" y="540" width="120" height="80" rx="10" fill="#b5483b"/>
${person(600, 1180, 900, CAST.marcos, { mood: 'laugh', armUp: 'right' })}
<path d="M470 205 A135 135 0 0 1 740 205 Z" fill="#b9c0c6" stroke="#8b949b" stroke-width="5"/>
${Array.from({ length: 22 }, (_, i) => `<circle cx="${500 + (i % 8) * 30 + (Math.floor(i / 8) % 2) * 15}" cy="${120 + Math.floor(i / 8) * 30 + 20}" r="5" fill="#7d868d"/>`).join('')}
<rect x="430" y="196" width="60" height="16" rx="8" fill="#8b949b"/><rect x="720" y="196" width="60" height="16" rx="8" fill="#8b949b"/>
<rect x="845" y="40" width="14" height="230" rx="7" fill="#9aa3aa" transform="rotate(18 852 155)"/>
<ellipse cx="820" cy="40" rx="40" ry="28" fill="#9aa3aa" transform="rotate(18 852 155)"/>
${finish(1200, 900, '#f3d9a0')}
`);

// ───────── P04 · Los pequeños ─────────
files['p04-pequenos.svg'] = svg(1200, 900, `
<rect width="1200" height="900" fill="#f0e6d2"/>
<rect y="600" width="1200" height="300" fill="#c9b79a"/>
${['#e57373', '#64b5f6', '#81c784', '#ffd54f', '#ba68c8', '#4db6ac'].map((c, i) => `<rect x="${i * 200}" y="640" width="200" height="260" fill="${c}" opacity="0.55"/>`).join('')}
<rect x="80" y="100" width="190" height="150" fill="#fff" transform="rotate(-3 175 175)"/>
<circle cx="170" cy="175" r="48" fill="#6dbb6d"/><circle cx="152" cy="160" r="8" fill="#222"/><circle cx="188" cy="160" r="8" fill="#222"/><path d="M140 188 Q170 215 200 188" stroke="#222" stroke-width="6" fill="none"/>
<rect x="300" y="120" width="190" height="150" fill="#fff" transform="rotate(4 395 195)"/>
<circle cx="390" cy="195" r="44" fill="#4caf50"/><path d="M360 205 Q390 230 420 205" stroke="#222" stroke-width="6" fill="none"/><circle cx="375" cy="182" r="7" fill="#222"/><circle cx="405" cy="182" r="7" fill="#222"/>
${txt(90, 300, 'EL MONSTRUO AMABLE', { size: 30, font: HAND, fill: '#c0392b', weight: 700 })}
<rect x="700" y="110" width="330" height="200" fill="#fff8e1" stroke="#d7ccc8" stroke-width="4"/>
${txt(720, 160, 'Grupo Pequeños', { size: 28, font: HAND, fill: '#5d4037' })}${txt(720, 205, 'sábados 17:00', { size: 26, font: HAND, fill: '#5d4037' })}
${person(600, 860, 440, CAST.marcos, { sit: true, mood: 'laugh', armUp: 'both' })}
${[[330, 0.5], [430, 0.4], [780, -0.4], [880, -0.5], [980, -0.6]].map(([x, l], i) => person(x, 880, 300, { ...extras[(i + 2) % 6] }, { mood: 'laugh', look: l })).join('')}
${finish(1200, 900, '#ffd8a0')}
`);

// ───────── P05 · Cajas ─────────
files['p05-cajas.svg'] = svg(1200, 900, `
<rect width="1200" height="900" fill="#d6cfc0"/>
<polygon points="0,0 260,120 260,720 0,900" fill="#c2bba9"/>
<polygon points="260,720 1200,720 1200,900 0,900" fill="#9b7a55"/>
${Array.from({ length: 9 }, (_, i) => `<line x1="${260 + i * 110}" y1="720" x2="${i * 150 - 100}" y2="900" stroke="#8a6b48" stroke-width="3"/>`).join('')}
<rect x="900" y="160" width="220" height="560" fill="#6d5a46"/><circle cx="930" cy="450" r="10" fill="#d4b483"/>
<rect x="760" y="210" width="10" height="70" fill="#5a4a3a"/><path d="M730 290 L765 270 L800 290" stroke="#5a4a3a" stroke-width="5" fill="none"/>
${[[360, 560], [600, 560], [380, 400], [600, 410]].map(([x, y], i) => `<rect x="${x}" y="${y}" width="230" height="${i < 2 ? 165 : 155}" fill="${i % 2 ? '#b58956' : '#c09462'}" stroke="#8e6a40" stroke-width="3"/><rect x="${x}" y="${y + 30}" width="230" height="10" fill="#d9c3a0" opacity="0.6"/><rect x="${x + 40}" y="${y + 70}" width="150" height="50" fill="#f4f1ea"/>`).join('')}
${txt(475, 645, 'PAPÁ – LIBROS', { size: 22, font: HAND, anchor: 'middle', weight: 700 })}
${txt(715, 645, 'PAPÁ – ROPA', { size: 22, font: HAND, anchor: 'middle', weight: 700 })}
${txt(495, 485, 'PAPÁ – VARIOS', { size: 22, font: HAND, anchor: 'middle', weight: 700 })}
${txt(715, 495, 'PAPÁ – HERRAM.', { size: 22, font: HAND, anchor: 'middle', weight: 700 })}
<polygon points="0,0 1200,0 1200,80 0,40" fill="#000" opacity="0.08"/>
${finish(1200, 900, '#8aa0b8')}
`);

// ───────── P06 · Cómic NADIE ─────────
{
  const W = 900, H = 1200;
  const panel = (x, y, w, h, inner) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#555" stroke-width="4"/><g>${inner}</g>`;
  const pencil = (x, y, h, op, dashed = false) => `<g opacity="${op}" fill="none" stroke="#444" stroke-width="4" ${dashed ? 'stroke-dasharray="10 8"' : ''}>
    <circle cx="${x}" cy="${y - h + h * 0.12}" r="${h * 0.11}"/>
    <path d="M${x - h * 0.14} ${y - h * 0.72} L${x + h * 0.14} ${y - h * 0.72} L${x + h * 0.12} ${y - h * 0.35} L${x - h * 0.12} ${y - h * 0.35}Z"/>
    <path d="M${x - h * 0.08} ${y - h * 0.35} L${x - h * 0.1} ${y} M${x + h * 0.08} ${y - h * 0.35} L${x + h * 0.1} ${y}"/>
  </g>`;
  files['p06-comic-nadie.svg'] = svg(W, H, `
<rect width="${W}" height="${H}" fill="#f5f1e6"/>
${Array.from({ length: 30 }, (_, i) => `<line x1="0" y1="${60 + i * 40}" x2="${W}" y2="${60 + i * 40}" stroke="#b9cde0" stroke-width="1.5" opacity="0.5"/>`).join('')}
${Array.from({ length: 14 }, (_, i) => `<circle cx="30" cy="${60 + i * 80}" r="11" fill="#ddd4c0" stroke="#bbb" />`).join('')}
${txt(W / 2, 110, 'NADIE — capítulo 3', { size: 58, font: HAND, anchor: 'middle', fill: '#333', weight: 700 })}
${panel(72, 192, 360, 456, pencil(250, 600, 330, 1) + txt(100, 240, 'Lunes.', { size: 28, font: HAND, fill: '#444' }))}
${panel(468, 192, 360, 456, pencil(650, 600, 330, 0.75) + `<g stroke="#444" stroke-width="3" stroke-dasharray="6 6" fill="none"><circle cx="560" cy="460" r="22"/><circle cx="740" cy="460" r="22"/></g>` + txt(496, 240, 'Ayuda a todos.', { size: 28, font: HAND, fill: '#444' }))}
${panel(72, 696, 360, 432, pencil(160, 1080, 260, 0.9) + pencil(250, 1080, 300, 0.45, true) + pencil(345, 1080, 260, 0.9) + txt(100, 744, 'Nadie le ve.', { size: 28, font: HAND, fill: '#444' }))}
${panel(468, 696, 360, 432, pencil(560, 1090, 290, 0.25, true) + pencil(760, 1090, 280, 0.95) +
    `<path d="M500 760 h220 a20 20 0 0 1 20 20 v80 a20 20 0 0 1 -20 20 h-150 l-30 30 v-30 h-40 a20 20 0 0 1 -20 -20 v-80 a20 20 0 0 1 20 -20z" fill="#fff" stroke="#444" stroke-width="3"/>` +
    txt(615, 800, '¿Alguien se ha dado', { size: 23, font: HAND, anchor: 'middle', fill: '#333' }) + txt(615, 832, 'cuenta de que', { size: 23, font: HAND, anchor: 'middle', fill: '#333' }) + txt(615, 864, 'no estoy?', { size: 23, font: HAND, anchor: 'middle', fill: '#333' }) +
    `<rect x="680" y="920" width="140" height="56" rx="16" fill="#fff" stroke="#444" stroke-width="3"/>` + txt(750, 955, '¡Gracias!', { size: 24, font: HAND, anchor: 'middle', fill: '#333' }))}
${finish(W, H)}
`, { grain: 0.05, vignette: 0.25 });
}

// ───────── P07 · Boletín ─────────
{
  const W = 900, H = 1200;
  const rows = [['Lengua Castellana y Literatura II', '5'], ['Historia de España', '4'], ['Inglés II', '6'], ['Matemáticas Aplicadas a las CC. SS. II', '3'], ['Economía de la Empresa', '5'], ['Dibujo Artístico II', '9']];
  files['p07-boletin.svg'] = svg(W, H, `
<rect width="${W}" height="${H}" fill="#7a5a3e"/>
<g transform="rotate(-1.5 450 600)">
<rect x="50" y="60" width="800" height="1080" fill="#fbfaf6"/>
${txt(450, 140, 'IES RÍO CLARO', { size: 34, anchor: 'middle', weight: 700, fill: '#1f3a5a' })}
${txt(450, 185, 'BOLETÍN DE CALIFICACIONES · 1.ª EVALUACIÓN · CURSO 2025-26', { size: 20, anchor: 'middle', fill: '#333' })}
${txt(100, 260, 'Alumno: FERRER LOZANO, MARCOS', { size: 24, fill: '#222' })}${txt(100, 296, 'Grupo: 2.º Bachillerato B', { size: 22, fill: '#444' })}
<line x1="100" y1="345" x2="800" y2="345" stroke="#1f3a5a" stroke-width="3"/>
${rows.map(([a, n], i) => `${txt(100, 410 + i * 62, a, { size: 23, fill: '#222' })}${txt(770, 410 + i * 62, n, { size: 30, fill: Number(n) < 5 ? '#b0302a' : '#222', weight: 700, anchor: 'end' })}<line x1="100" y1="${430 + i * 62}" x2="800" y2="${430 + i * 62}" stroke="#ddd" stroke-width="2"/>`).join('')}
<rect x="100" y="880" width="700" height="210" fill="none" stroke="#999" stroke-width="2"/>
${txt(115, 915, 'Observaciones de la tutora:', { size: 21, fill: '#333', weight: 700 })}
${txt(115, 955, 'Se observa cansancio y falta de concentración en las', { size: 21, fill: '#333', font: HAND })}
${txt(115, 990, 'últimas semanas. Se recomienda una entrevista con la', { size: 21, fill: '#333', font: HAND })}
${txt(115, 1025, 'familia.', { size: 21, fill: '#333', font: HAND })}
</g>
${finish(W, H, '#f0d0a0')}
`);
}

// ───────── P08 · Videollamada ─────────
files['p08-videollamada.svg'] = svg(1200, 900, `
<rect width="1200" height="900" fill="#101215"/>
<rect x="0" y="0" width="1200" height="760" fill="#5a3f2e"/>
<rect x="0" y="0" width="1200" height="420" fill="#7a5a43"/>
${Array.from({ length: 26 }, (_, i) => `<circle cx="${20 + i * 46}" cy="${60 + Math.sin(i) * 18}" r="7" fill="${['#ffd166', '#ef476f', '#06d6a0', '#ffd166'][i % 4]}"/>`).join('')}
<path d="M0 60 Q300 100 600 60 T1200 60" stroke="#333" stroke-width="2" fill="none"/>
${person(180, 860, 560, CAST.paco, { mood: 'smile', look: 0.3 })}
${person(370, 860, 540, CAST.rosa, { mood: 'laugh', look: 0.2 })}
${person(560, 860, 560, CAST.mama, { mood: 'smile' })}
${person(740, 860, 380, CAST.lucia, { mood: 'laugh', armUp: 'both' })}
${person(920, 860, 600, CAST.marcos, { mood: 'smile', look: -0.2 })}
<rect x="0" y="600" width="1200" height="170" fill="#9b2f2f"/><rect x="0" y="600" width="1200" height="14" fill="#7e2424"/>
<ellipse cx="420" cy="660" rx="80" ry="22" fill="#eee"/><ellipse cx="760" cy="660" rx="80" ry="22" fill="#eee"/><rect x="580" y="620" width="40" height="60" fill="#c7a26a"/>
<rect x="768" y="54" width="372" height="216" rx="14" fill="#2b2e33" stroke="#fff" stroke-width="3"/>
<clipPath id="small8"><rect x="768" y="54" width="372" height="216" rx="14"/></clipPath>
<g clip-path="url(#small8)"><rect x="768" y="54" width="372" height="216" fill="#cfcac0"/>${person(955, 420, 380, CAST.papa, { mood: 'smile' })}</g>
${txt(786, 255, 'Papá', { size: 22, fill: '#fff' })}
<rect x="0" y="760" width="1200" height="140" fill="#16181c"/>
${txt(48, 812, 'Llamada desde: Casa Rosa · Santa Olaria', { size: 26, fill: '#d0d4da' })}
${txt(48, 850, '24 dic · 22:14 · 00:47:12', { size: 22, fill: '#8a9099' })}
<circle cx="960" cy="830" r="34" fill="#3a3d43"/><circle cx="1050" cy="830" r="34" fill="#3a3d43"/><circle cx="1140" cy="830" r="34" fill="#d64545"/>
`, { grain: 0.04, vignette: 0.15 });

// ───────── P09 · Nevera ─────────
{
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const start = 3; // 1 de enero de 2026 = jueves (L=0)
  const cell = (d) => {
    const idx = d - 1 + start;
    const col = idx % 7;
    const row = Math.floor(idx / 7);
    const x = 195 + col * 92;
    const y = 255 + row * 62;
    const dow = col;
    const mark = dow < 5 || d === 24 ? 'T' : '';
    return `<rect x="${x}" y="${y}" width="92" height="62" fill="none" stroke="#bbb" stroke-width="1.5"/>${txt(x + 6, y + 20, d, { size: 16, fill: '#555' })}${mark ? txt(x + 46, y + 50, mark, { size: 26, fill: d === 24 ? '#b0302a' : '#2b4a7a', font: HAND, anchor: 'middle', weight: 700 }) : ''}`;
  };
  files['p09-nevera.svg'] = svg(1200, 900, `
<rect width="1200" height="900" fill="#e9ecec"/>
<rect x="1110" y="200" width="40" height="420" rx="18" fill="#c9cfd1"/>
<rect x="160" y="120" width="690" height="460" fill="#fff" stroke="#ccc" stroke-width="2" transform="rotate(-1 505 350)"/>
<g transform="rotate(-1 505 350)">
${txt(505, 175, 'MAMÁ — ENERO — TURNOS', { size: 30, anchor: 'middle', weight: 700, fill: '#333' })}
${txt(505, 215, 'T = tarde 15:00–23:00   ·   sáb 24: entra 14:00', { size: 20, anchor: 'middle', fill: '#555' })}
${['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => txt(241 + i * 92, 248, d, { size: 18, anchor: 'middle', fill: '#333', weight: 700 })).join('')}
${days.map(cell).join('')}
</g>
<circle cx="505" cy="120" r="16" fill="#e74c3c"/>
<g transform="rotate(4 900 650)">
<rect x="730" y="520" width="350" height="260" fill="#ffe680"/><rect x="730" y="520" width="350" height="26" fill="#f2d65c"/>
${txt(752, 580, 'Marcos:', { size: 28, font: HAND, fill: '#333', weight: 700 })}
${txt(752, 618, '· recoger a Lucía 17:00', { size: 24, font: HAND, fill: '#333' })}
${txt(752, 652, '· cena · deberes · baño', { size: 24, font: HAND, fill: '#333' })}
${txt(752, 696, 'GRACIAS. Te debo una', { size: 24, font: HAND, fill: '#333' })}
${txt(752, 728, 'vida entera. Mamá ♥', { size: 24, font: HAND, fill: '#333' })}
</g>
<rect x="60" y="640" width="200" height="160" fill="#fff" transform="rotate(-6 160 720)"/>
<circle cx="140" cy="720" r="34" fill="#81c784"/><circle cx="200" cy="740" r="22" fill="#ba68c8"/>
${txt(90, 790, 'Lucía', { size: 24, font: HAND, fill: '#7b3fa0', rotate: -6 })}
<circle cx="160" cy="640" r="12" fill="#3498db"/>
${finish(1200, 900, '#d0e0f0')}
`);
}

// ───────── P10 · Historia escape room ─────────
files['p10-historia-escape.svg'] = svg(900, 1600, `
<rect width="900" height="1600" fill="#0d0d12"/>
${[0, 1, 2].map((i) => `<rect x="${24 + i * 286}" y="30" width="270" height="6" rx="3" fill="#fff" opacity="${i === 1 ? 0.95 : 0.4}"/>`).join('')}
<circle cx="64" cy="90" r="30" fill="${CAST.ivan.top}"/>${txt(110, 100, 'ivan.mrls', { size: 30, fill: '#fff', weight: 700 })}${txt(270, 100, '2 h', { size: 28, fill: '#bbb' })}
<rect x="0" y="150" width="900" height="1240" fill="#2a1f3d"/>
<rect x="250" y="250" width="400" height="120" rx="12" fill="#1a1028" stroke="#c77dff" stroke-width="6"/>
${txt(450, 335, 'ESCAPE', { size: 72, fill: '#e0aaff', anchor: 'middle', weight: 700, ls: 8 })}
<rect x="300" y="420" width="300" height="560" fill="#3d2b55"/><circle cx="560" cy="700" r="12" fill="#c9a227"/>
${person(200, 1300, 700, CAST.noa, { mood: 'laugh', armUp: 'left' })}
${person(380, 1310, 760, CAST.ivan, { mood: 'laugh' })}
${person(560, 1305, 720, CAST.claudia, { mood: 'laugh' })}
${person(730, 1300, 740, CAST.alvaro, { mood: 'laugh', armUp: 'right' })}
<rect x="40" y="1110" width="820" height="150" rx="20" fill="#000" opacity="0.55"/>
${txt(450, 1182, 'ESCAPE ROOM', { size: 54, fill: '#fff', anchor: 'middle', weight: 700 })}
${txt(450, 1236, 'con los de siempre 🔐', { size: 40, fill: '#fff', anchor: 'middle' })}
<rect x="40" y="1460" width="680" height="80" rx="40" fill="none" stroke="#777" stroke-width="3"/>${txt(80, 1512, 'Enviar mensaje', { size: 30, fill: '#999' })}
<path d="M780 1480 l40 20 l-40 20z" fill="#ddd"/>
`, { grain: 0.04, vignette: 0.1 });

// ───────── P11 · Convivencia ─────────
{
  let back = '';
  let front = '';
  const backRow = [180, 290, 400, 510, 620, 730, 840];
  backRow.forEach((x, i) => (back += person(x, 690, 420, extras[i % 6], { mood: 'laugh' })));
  const frontRow = [[230, CAST.claudia], [350, CAST.sara], [470, CAST.ivan], [590, CAST.noa], [710, CAST.alvaro], [820, CAST.nacho]];
  frontRow.forEach(([x, p]) => (front += person(x, 790, 430, p, { mood: 'laugh' })));
  files['p11-convivencia.svg'] = svg(1200, 900, `
<linearGradient id="sky11" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9d3e6"/><stop offset="1" stop-color="#eef3f3"/></linearGradient>
<rect width="1200" height="900" fill="url(#sky11)"/>
<rect x="60" y="150" width="1080" height="420" fill="#b8a690"/>
${Array.from({ length: 40 }, (_, i) => `<rect x="${60 + (i % 10) * 108 + (Math.floor(i / 10) % 2) * 54}" y="${150 + Math.floor(i / 10) * 105}" width="104" height="101" fill="none" stroke="#a08f78" stroke-width="3"/>`).join('')}
<rect x="500" y="300" width="200" height="270" fill="#5b4636"/>
${txt(600, 130, 'ALBERGUE LOS PINOS', { size: 30, anchor: 'middle', fill: '#4a3d30', weight: 700 })}
<rect y="570" width="1200" height="330" fill="#7f9a5a"/>
${back}${front}
${person(1062, 780, 450, CAST.marcos, { mood: 'down', phone: true })}
${finish(1200, 900, '#e8d8b0')}
`);
}

// ───────── P12 · Mirador ─────────
files['p12-mirador.svg'] = svg(1200, 900, `
<linearGradient id="sky12" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b18"/><stop offset="1" stop-color="#1c2846"/></linearGradient>
<rect width="1200" height="900" fill="url(#sky12)"/>
${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 211) % 1200}" cy="${(i * 53) % 300}" r="1.2" fill="#fff" opacity="0.5"/>`).join('')}
<polygon points="0,430 160,380 330,410 520,360 760,400 980,370 1200,410 1200,900 0,900" fill="#0d1220"/>
<g filter="url(#glow)">${Array.from({ length: 420 }, (_, i) => `<circle cx="${(i * 97 + (i % 7) * 13) % 1200}" cy="${450 + ((i * 37) % 260)}" r="${1.5 + (i % 3)}" fill="${['#ffcf6b', '#ffa94d', '#fff2c4', '#9ecbff'][i % 4]}"/>`).join('')}</g>
${Array.from({ length: 300 }, (_, i) => `<circle cx="${(i * 131) % 1200}" cy="${455 + ((i * 41) % 250)}" r="1.4" fill="#fff4d0" opacity="0.9"/>`).join('')}
<rect y="700" width="1200" height="200" fill="#05070d"/>
<rect y="690" width="1200" height="12" fill="#2a2f3a"/><rect y="740" width="1200" height="8" fill="#2a2f3a"/>
${Array.from({ length: 9 }, (_, i) => `<rect x="${40 + i * 140}" y="690" width="10" height="210" fill="#2a2f3a"/>`).join('')}
${txt(30, 860, '18/01/2026  23:49   MIRADOR DEL CERRO', { size: 30, fill: '#ff9f43', font: "'Courier New',monospace", weight: 700 })}
`, { grain: 0.09, vignette: 0.5 });

// ───────── P13 · Lucía deberes ─────────
files['p13-lucia-deberes.svg'] = svg(1200, 900, `
<rect width="1200" height="900" fill="#e8e0cf"/>
${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 100}" y="0" width="98" height="98" fill="#f3efe4"/><rect x="${i * 100}" y="100" width="98" height="98" fill="#f3efe4"/>`).join('')}
<rect x="900" y="230" width="220" height="140" fill="#cfd8dc"/><rect x="920" y="250" width="180" height="100" fill="#90a4ae"/>
${person(330, 1000, 620, CAST.lucia, { sit: true, mood: 'neutral', look: 0.6 })}
<rect y="560" width="1200" height="340" fill="#c19a6b"/><rect y="560" width="1200" height="16" fill="#a77f52"/>
<rect x="160" y="600" width="300" height="200" fill="#fff" transform="rotate(-8 310 700)"/>
${Array.from({ length: 6 }, (_, i) => `<line x1="180" y1="${640 + i * 26}" x2="430" y2="${620 + i * 26}" stroke="#90a4ae" stroke-width="2"/>`).join('')}
<rect x="440" y="700" width="140" height="14" rx="7" fill="#f4c542" transform="rotate(20 510 707)"/>
<g transform="rotate(3 840 720)">
<rect x="650" y="470" width="480" height="370" fill="#fffdf6" stroke="#ddd" stroke-width="3"/>
${txt(890, 530, 'MI HERMANO EL QUE ME CUIDA', { size: 30, font: HAND, anchor: 'middle', fill: '#d35400', weight: 700 })}
<circle cx="820" cy="610" r="36" fill="#e8b48c" stroke="#333" stroke-width="3"/>${Array.from({ length: 6 }, (_, i) => `<circle cx="${795 + i * 10}" cy="${582 - (i % 2) * 8}" r="12" fill="#3b2412"/>`).join('')}
<path d="M790 650 L850 650 L870 760 L770 760Z" fill="#3f9b4f" stroke="#333" stroke-width="3"/>
<path d="M790 650 L730 780 L800 760Z" fill="#2e7d32" stroke="#333" stroke-width="3"/>
<circle cx="980" cy="660" r="28" fill="#e8b48c" stroke="#333" stroke-width="3"/><circle cx="950" cy="650" r="12" fill="#3b2412"/><circle cx="1010" cy="650" r="12" fill="#3b2412"/>
<path d="M955 690 L1005 690 L1020 770 L940 770Z" fill="#9b59b6" stroke="#333" stroke-width="3"/>
<path d="M865 700 Q910 690 945 710" stroke="#333" stroke-width="5" fill="none"/>
<circle cx="700" cy="600" r="30" fill="#f9d71c"/>
</g>
${finish(1200, 900, '#ffd9a0')}
`);

// ───────── P14 · Pancarta (selfi) ─────────
files['p14-pancarta.svg'] = svg(1200, 900, `
<rect width="1200" height="900" fill="#c9c2b5"/>
<rect y="520" width="1200" height="380" fill="#9c958a"/>
<rect x="40" y="70" width="1120" height="300" fill="#fbf8f1" stroke="#ddd" stroke-width="4"/>
${txt(70, 230, 'FIESTA DON B', { size: 150, fill: '#2f6f9f', weight: 700 })}
<path d="M70 260 q60 30 140 0 t160 0" stroke="#e67e22" stroke-width="14" fill="none"/>
<circle cx="1050" cy="220" r="40" fill="#f1c40f" opacity="0.8"/><circle cx="1100" cy="290" r="18" fill="#e74c3c" opacity="0.8"/>
${person(420, 1500, 1300, CAST.sara, { mood: 'laugh', look: 0.2 })}
${person(780, 1500, 1320, CAST.marcos, { mood: 'laugh', look: -0.2 })}
<circle cx="380" cy="420" r="16" fill="#2f6f9f" opacity="0.85"/><circle cx="830" cy="430" r="14" fill="#e67e22" opacity="0.85"/><circle cx="755" cy="400" r="9" fill="#f1c40f"/>
<rect x="900" y="720" width="300" height="80" rx="40" fill="${CAST.marcos.top}" transform="rotate(-25 1050 760)"/>
${finish(1200, 900, '#ffe0b0')}
`);

// ───────── P15 · Cartel ─────────
{
  const poster = `
<rect x="264" y="72" width="672" height="738" fill="#23395b"/>
${txt(600, 160, 'FIESTA DE DON BOSCO', { size: 50, anchor: 'middle', fill: '#f6e7c1', weight: 700, ls: 2 })}
${txt(600, 205, 'Centro Juvenil Domingo Savio', { size: 24, anchor: 'middle', fill: '#c9d6e8' })}
<circle cx="600" cy="420" r="150" fill="#2f4a73"/>
<path d="M470 640 Q480 420 560 360 Q610 330 640 380 Q690 470 700 640Z" fill="#111"/>
<circle cx="600" cy="330" r="42" fill="#e0b08a"/><path d="M558 322 A42 42 0 0 1 642 322 Q600 300 558 322Z" fill="#555"/>
<path d="M570 345 Q600 360 630 345" stroke="#6b3a2a" stroke-width="4" fill="none"/>
<rect x="660" y="500" width="70" height="140" rx="20" fill="#7a4b2a"/><circle cx="695" cy="470" r="30" fill="#c99272"/><circle cx="695" cy="455" r="22" fill="#2a1b12"/>
<path d="M640 470 Q665 470 670 490" stroke="#111" stroke-width="18" fill="none" stroke-linecap="round"/>
${txt(600, 700, '¿SABES SILBAR?', { size: 54, anchor: 'middle', fill: '#f6c445', weight: 700, font: HAND })}
${txt(600, 752, 'SÁBADO 31 DE ENERO · 17:00', { size: 26, anchor: 'middle', fill: '#f6e7c1', ls: 2 })}
${txt(905, 790, 'M.F. 2026', { size: 20, anchor: 'end', fill: '#c9d6e8', font: HAND })}
<rect x="250" y="62" width="70" height="26" fill="#f0e6c8" opacity="0.8" transform="rotate(-20 285 75)"/>
<rect x="880" y="62" width="70" height="26" fill="#f0e6c8" opacity="0.8" transform="rotate(20 915 75)"/>`;
  files['p15-cartel.svg'] = svg(1200, 900, `
<rect width="1200" height="900" fill="#d8d0c0"/>
<rect y="830" width="1200" height="70" fill="#8a7b66"/>
${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 100} 20 l50 40 l50 -40" fill="${['#e74c3c', '#f1c40f', '#3498db', '#2ecc71'][i % 4]}" opacity="0.85"/>`).join('')}
<circle cx="120" cy="600" r="60" fill="#e74c3c" opacity="0.85"/><line x1="120" y1="660" x2="140" y2="830" stroke="#555" stroke-width="2"/>
<circle cx="1080" cy="560" r="55" fill="#3498db" opacity="0.85"/><line x1="1080" y1="615" x2="1060" y2="830" stroke="#555" stroke-width="2"/>
${poster}
${finish(1200, 900, '#ffd9a0')}
`);
}

// ───────── P16 · Almacén (foto movida) ─────────
files['p16-almacen.svg'] = svg(1200, 900, `
<rect width="1200" height="900" fill="#15130f"/>
<g filter="url(#blurry)">
<rect x="0" y="0" width="1200" height="900" fill="#221d17"/>
<rect x="60" y="180" width="760" height="560" fill="#6e5236"/><rect x="60" y="180" width="760" height="40" fill="#7d5f40"/>
<rect x="160" y="270" width="640" height="240" fill="#d9d2c0"/>
${txt(480, 360, 'DECORACIÓN FIESTA DB', { size: 54, anchor: 'middle', fill: '#222', font: HAND, weight: 700 })}
${txt(480, 440, '— ALMACÉN 2 —', { size: 50, anchor: 'middle', fill: '#222', font: HAND, weight: 700 })}
<rect x="80" y="620" width="300" height="200" fill="#5c442c"/>
<rect x="840" y="90" width="300" height="420" fill="#4a3826"/>
<rect x="870" y="520" width="190" height="230" rx="12" fill="#e9e6df"/>
<circle cx="935" cy="610" r="14" fill="#333"/><circle cx="995" cy="610" r="14" fill="#333"/>
<rect x="915" y="640" width="100" height="70" rx="10" fill="#fafafa"/>
<path d="M965 710 C960 800 760 760 720 880" stroke="#f5f5f5" stroke-width="12" fill="none"/>
</g>
<rect width="1200" height="900" fill="#ffb347" opacity="0.06"/>
`, { grain: 0.14, vignette: 0.7 });

// ───────── P17 · Sillas ─────────
{
  const seats = [];
  const n = 12;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + Math.PI / 2;
    seats.push({ x: 600 + Math.cos(a) * 420, y: 560 + Math.sin(a) * 190, i });
  }
  seats.sort((a, b) => a.y - b.y);
  const chair = (x, y, s) => `<rect x="${x - 50 * s}" y="${y - 120 * s}" width="${100 * s}" height="${80 * s}" rx="${10 * s}" fill="#2f5d50"/><rect x="${x - 55 * s}" y="${y - 40 * s}" width="${110 * s}" height="${22 * s}" rx="${6 * s}" fill="#264c42"/><rect x="${x - 50 * s}" y="${y - 20 * s}" width="${8 * s}" height="${60 * s}" fill="#222"/><rect x="${x + 42 * s}" y="${y - 20 * s}" width="${8 * s}" height="${60 * s}" fill="#222"/>`;
  let body = '';
  seats.forEach(({ x, y, i }) => {
    const s = 0.75 + (y - 370) / 760;
    body += chair(x, y, s);
    if (i === 10) body += `<rect x="${x - 48 * s}" y="${y - 58 * s}" width="${96 * s}" height="${26 * s}" rx="${8 * s}" fill="${CAST.marcos.top}"/>`;
    else if (i !== 4) body += person(x, y + 40 * s, 300 * s, extras[i % 6], { sit: true, mood: 'smile', look: x > 600 ? -0.4 : 0.4 });
  });
  files['p17-sillas.svg'] = svg(1200, 900, `
<rect width="1200" height="900" fill="#e3dccd"/>
<rect y="380" width="1200" height="520" fill="#b9a88d"/>
<rect x="80" y="80" width="260" height="190" fill="#fff" stroke="#ccc" stroke-width="3"/>${txt(210, 160, 'GRUPO 17+', { size: 34, anchor: 'middle', fill: '#2f5d50', weight: 700 })}${txt(210, 210, '¿Cómo estás?', { size: 26, anchor: 'middle', fill: '#555', font: HAND })}
<rect x="860" y="70" width="240" height="230" fill="#9fc5e8" stroke="#7a8b99" stroke-width="6"/>
${body}
${finish(1200, 900, '#f0d8a8')}
`);
}

// ───────── Fondo de bloqueo ─────────
// El reloj de la pantalla de bloqueo ocupa el tercio superior: la pista (14·06) va en la mitad inferior.
files['fondo-bloqueo.svg'] = svg(900, 1950, `
<linearGradient id="bg0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f2638"/><stop offset="0.4" stop-color="#5a4c44"/><stop offset="1" stop-color="#3a2e26"/></linearGradient>
<rect width="900" height="1950" fill="url(#bg0)"/>
${Array.from({ length: 22 }, (_, i) => `<circle cx="${(i * 157) % 900}" cy="${700 + ((i * 89) % 260)}" r="${10 + (i % 4) * 6}" fill="${['#ffd166', '#ef476f', '#06d6a0', '#118ab2'][i % 4]}" opacity="0.4"/>`).join('')}
<path d="M30 960 Q450 1040 870 960" stroke="#ddd" stroke-width="3" fill="none"/>
${Array.from({ length: 15 }, (_, i) => `<path d="M${40 + i * 55} ${962 + Math.sin((i / 14) * Math.PI) * 38} l27 52 l27 -52z" fill="${['#ef476f', '#ffd166', '#06d6a0', '#118ab2'][i % 4]}"/>`).join('')}
<rect x="80" y="1050" width="740" height="190" rx="24" fill="#000" opacity="0.35"/>
${txt(450, 1130, '¡FELIZ CUMPLE, ENANA!', { size: 62, anchor: 'middle', fill: '#fff4d6', weight: 700, font: HAND })}
${txt(450, 1212, '14 · 06', { size: 70, anchor: 'middle', fill: '#ffd166', weight: 700, font: HAND, ls: 6 })}
${person(250, 1990, 760, CAST.marcos, { mood: 'laugh', look: 0.3 })}
${person(700, 1990, 560, CAST.lucia, { mood: 'laugh', look: -0.3, armUp: 'both' })}
<rect x="300" y="1640" width="330" height="310" fill="#5a3a2a"/>
<rect x="330" y="1610" width="270" height="120" fill="#f3d7e3"/><ellipse cx="465" cy="1610" rx="135" ry="26" fill="#fbeaf1"/>
<path d="M330 1660 q22 16 45 0 t45 0 t45 0 t45 0 t45 0 t45 0" stroke="#e58fb0" stroke-width="8" fill="none"/>
${txt(465, 1712, 'Lucía · 9', { size: 30, anchor: 'middle', fill: '#a0306a', font: HAND, weight: 700 })}
<rect x="448" y="1520" width="34" height="88" rx="6" fill="#6ec6ff"/>
${txt(465, 1592, '9', { size: 50, anchor: 'middle', fill: '#fff', weight: 700 })}
<path d="M465 1520 q-12 -26 0 -48 q12 22 0 48z" fill="#ffb703"/>
${finish(900, 1950, '#ffc890')}
`, { grain: 0.05, vignette: 0.35 });

for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(OUT, name), content);
}
console.log(`Generadas ${Object.keys(files).length} ilustraciones en ${OUT}`);
