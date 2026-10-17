import { useEffect, useRef, type ReactNode } from 'react';
import { Icon } from './Icons';

interface ModalProps {
  title: string;
  onClose?: () => void;
  children: ReactNode;
  wide?: boolean;
  className?: string;
  /** Oculta el título visualmente (sigue disponible para lectores de pantalla). */
  hideTitle?: boolean;
}

/** Diálogo accesible: foco inicial, Escape para cerrar y foco atrapado dentro. */
export function Modal({ title, onClose, children, wide, className, hideTitle }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const previous = useRef<Element | null>(null);

  useEffect(() => {
    previous.current = document.activeElement;
    const el = ref.current;
    const first = el?.querySelector<HTMLElement>('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
    (first ?? el)?.focus();
    return () => {
      if (previous.current instanceof HTMLElement) previous.current.focus();
    };
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && onClose) {
      e.stopPropagation();
      onClose();
    }
    if (e.key === 'Tab' && ref.current) {
      const items = Array.from(
        ref.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'),
      );
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div
        ref={ref}
        className={`modal ${wide ? 'modal-wide' : ''} ${className ?? ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onKeyDown={onKeyDown}
      >
        <header className={`modal-head ${hideTitle ? 'sr-only-head' : ''}`}>
          <h2 className={hideTitle ? 'sr-only' : ''}>{title}</h2>
          {onClose && (
            <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
              <Icon name="cerrar" />
            </button>
          )}
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

/** Confirmación sencilla para acciones irreversibles. */
export function Confirm({
  title,
  text,
  confirmLabel,
  onConfirm,
  onCancel,
  danger,
}: {
  title: string;
  text: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p>{text}</p>
      <div className="row-end">
        <button className="btn" onClick={onCancel}>
          Cancelar
        </button>
        <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
