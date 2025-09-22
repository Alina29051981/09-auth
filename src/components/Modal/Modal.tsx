import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import css from './Modal.module.css';

type Props = { children: React.ReactNode; onClose: () => void };

const Modal: React.FC<Props> = ({ children, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) onClose();
  };

  return ReactDOM.createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdrop}>
      <div className={css.modal}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
