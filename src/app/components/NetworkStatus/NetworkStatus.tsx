// ui/NetworkStatus/NetworkStatus.tsx
import { useEffect, useState } from 'react';
import styles from './NetworkStatus.module.css';

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <p className={styles.offlineBanner}>
      You're currently offline. Some features might not be available.
    </p>
  );
};