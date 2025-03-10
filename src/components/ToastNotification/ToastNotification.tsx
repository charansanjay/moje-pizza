import styles from './ToastNotification.module.css';
import { memo, useEffect, useState, useCallback } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store.ts'; // Update with your store path

import { clearToast } from '../../redux/slices/settingsSlice/settingsSlice.ts';

import { MdCheckCircle, MdError, MdInfo, MdClose } from 'react-icons/md';

const selectToast = createSelector(
  (state: RootState) => state.settings.toast,
  (toast) => (toast?.message ? toast : null)
);

type ToastType = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  disableAutoClose?: boolean;
};

export const ToastContainer = memo(
  ({
    id,
    message,
    type,
    disableAutoClose,
    onClose,
  }: ToastType & { onClose: (id: string) => void }) => {
    useEffect(() => {
      if (!disableAutoClose) {
        const timer = setTimeout(() => onClose(id), 3000);
        return () => clearTimeout(timer);
      }
    }, [id, disableAutoClose, onClose]);

    return (
      <div className={`${styles.toast} ${styles[type]}`} data-testid='toast'>
        <div className={styles.content}>
          {type === 'success' && <MdCheckCircle className={styles.icon} />}
          {type === 'error' && <MdError className={styles.icon} />}
          {type === 'info' && <MdInfo className={styles.icon} />}
          <span className={styles.message}>{message}</span>
          {disableAutoClose && (
            <button
              className={styles.closeButton}
              onClick={() => onClose(id)}
              aria-label='Close toast'
            >
              <MdClose data-testid='close_toast_icon' />
            </button>
          )}
        </div>
        {!disableAutoClose && (
          <div className={styles.progressBar}>
            <div className={styles.progress} />
          </div>
        )}
      </div>
    );
  }
);

export const ToastNotification = () => {
  const dispatch = useDispatch();
  const reduxToast = useSelector(selectToast);
  const [toasts, setToasts] = useState<ToastType[]>([]);

  // Handle new toast from Redux
  useEffect(() => {
    if (reduxToast?.message) {
      const newToast = {
        id: Date.now().toString(),
        ...reduxToast,
      };
      setToasts((prev) => [...prev, newToast]);
      dispatch(clearToast());
    }
  }, [reduxToast, dispatch]);

  // Memoized removal function
  const handleRemove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  if (!toasts.length) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <ToastContainer key={toast.id} {...toast} onClose={handleRemove} />
      ))}
    </div>
  );
};
