import { useEffect, useMemo, useState } from 'react';
import { photos } from '../../data/photos';
import { fmtMonthYear, parseIso } from '../../lib/format';
import { isAvailable } from '../../state/game';
import { useGame } from '../../state/GameContext';
import { AppHeader } from './AppHeader';
import { PhotoViewer } from './PhotoViewer';

export function GalleryApp() {
  const { state, nav, media } = useGame();
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(
    () => photos.filter((p) => isAvailable(state, p.availableFrom)).sort((a, b) => b.at.localeCompare(a.at)),
    [state],
  );

  useEffect(() => {
    if (nav.app === 'galeria' && nav.target) setOpen(nav.target);
  }, [nav]);

  const groups = useMemo(() => {
    const g: { label: string; items: typeof list }[] = [];
    list.forEach((p) => {
      const d = parseIso(p.at);
      const label = fmtMonthYear(d.getFullYear(), d.getMonth());
      const last = g[g.length - 1];
      if (last && last.label === label) last.items.push(p);
      else g.push({ label, items: [p] });
    });
    return g;
  }, [list]);

  const go = (dir: -1 | 1) => {
    const i = list.findIndex((p) => p.id === open);
    const next = list[(i + dir + list.length) % list.length];
    setOpen(next.id);
  };

  return (
    <div className="app">
      <AppHeader title="Galería" subtitle={`${list.length} elementos`} />
      <div className="scroll">
        {groups.map((g) => (
          <section key={g.label} className="gallery-group">
            <h3 className="group-label">{g.label}</h3>
            <div className="gallery-grid">
              {g.items.map((p) => (
                <button key={p.id} className="thumb" onClick={() => setOpen(p.id)} aria-label={`${p.title}, ${p.at.slice(0, 10)}`}>
                  <img src={media(p.id, p.file)} alt="" loading="lazy" />
                  {p.origin !== 'camara' && <span className="thumb-tag">{p.origin === 'captura' ? 'Captura' : 'Recibida'}</span>}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
      {open && <PhotoViewer photoId={open} onClose={() => setOpen(null)} onNav={go} />}
    </div>
  );
}
