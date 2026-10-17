// En la versión web normal las imágenes se sirven desde public/media.
// La versión de un solo archivo (npm run build:web) sustituye este módulo
// por inlineMedia.single.ts, que incrusta las ilustraciones.
export const INLINE_MEDIA: Record<string, string> = {};
