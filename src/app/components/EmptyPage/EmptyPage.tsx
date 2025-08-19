import styles from './EmptyPage.module.css';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { ContinueButton } from '../Button/ContinueButton.tsx';

interface EmptyDetailsProps {
  message: string;
  icon: React.ReactNode;
  buttonText: string;
  path: string;
}

export const EmptyPage = ({
  message,
  icon,
  buttonText,
  path,
}: EmptyDetailsProps) => {
  const navigate: NavigateFunction = useNavigate();

  return (
    <div className={styles.emptyDetailsContainer}>
      <div className={styles.emptyPageIcon}>{icon}</div>

      <h2 className={styles.message}>{message}</h2>

      <ContinueButton
        type='primary'
        float='right'
        text={buttonText}
        showIcon
        onClick={() => navigate(path)}
      />
    </div>
  );
};
