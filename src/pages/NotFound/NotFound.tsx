import { type NavigateFunction, useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

export const NotFound = () => {
  const navigate: NavigateFunction = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.subtitle}>Oops! Page not found.</p>
      <p className={styles.text}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button className={styles.button} onClick={() => {
        navigate('/', { replace: true });
      }}>
        Go to Homepage
      </button>
    </div>
  );
};
