import styles from './Modal.module.css';
import { createPortal } from 'react-dom';

import { ContinueButton } from '../Button/ContinueButton.tsx';


type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
};

export const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div data-testid='modal_overlay' className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className={styles.modalActions}>
          <ContinueButton
            showIcon={false}
            onClick={onConfirm}
            text='Delete'
            type='delete'
          />
          <ContinueButton
            showIcon={false}
            onClick={onClose}
            text='Cancel'
            type='secondary'
          />
        </div>
      </div>
    </div>,
    document.body
  );
};
