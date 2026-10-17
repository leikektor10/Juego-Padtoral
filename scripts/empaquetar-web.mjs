// Une el build «single» en un único archivo HTML autocontenido:
// dist-web/ultima-conexion.html (JS, CSS e ilustraciones dentro).
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(import.meta.dirname, '..', 'dist-web');
const html = readFileSync(join(dir, 'index.html'), 'utf8');
const assets = join(dir, 'assets');
const files = readdirSync(assets);
const js = files.filter((f) => f.endsWith('.js')).map((f) => readFileSync(join(assets, f), 'utf8')).join('\n');
const css = files.filter((f) => f.endsWith('.css')).map((f) => readFileSync(join(assets, f), 'utf8')).join('\n');

const favicon = html.match(/<link rel="icon"[^>]*>/)?.[0] ?? '';
const description = html.match(/<meta name="description"[^>]*>/)?.[0] ?? '';
const safeJs = js.replace(/<\/script/gi, '<\\/script');

const out = `<title>Última conexión</title>
${description}
<meta name="theme-color" content="#0e1013">
${favicon}
<style>
:root { color-scheme: dark; }
body { background: #0e1013; color: #ebe8e2; }
${css}
</style>
<div id="root"></div>
<noscript>Este juego necesita JavaScript activado.</noscript>
<script type="module">
${safeJs}
</script>
`;
writeFileSync(join(dir, 'ultima-conexion.html'), out);
console.log(`dist-web/ultima-conexion.html · ${(out.length / 1024).toFixed(0)} KB`);
