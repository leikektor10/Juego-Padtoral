// Ilustraciones incrustadas como data: URI para la versión de un solo archivo.
const raw = import.meta.glob('../../public/media/fotos/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const INLINE_MEDIA: Record<string, string> = Object.fromEntries(
  Object.entries(raw).map(([path, svg]) => [
    `media/fotos/${path.split('/').pop()}`,
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
  ]),
);
