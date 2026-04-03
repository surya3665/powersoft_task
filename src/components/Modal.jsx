import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const sizeClass = size === 'sm' ? 'modal-sm' : size === 'lg' ? 'modal-lg' : '';

  return createPortal(
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down ${sizeClass}`}>
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 pb-0 px-4 px-sm-4">
              <h5 className="modal-title fw-bold">{title}</h5>
              <button type="button" className="btn btn-link text-secondary p-0" aria-label="Close dialog" onClick={onClose}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body px-4 pt-3 pb-4">{children}</div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose} />
    </>,
    document.body,
  );
};

export default Modal;
