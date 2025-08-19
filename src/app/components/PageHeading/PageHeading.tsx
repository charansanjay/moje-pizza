import styles from './PageHeading.module.css';

import { IoArrowBack } from 'react-icons/io5';
import { NavigateFunction, useNavigate } from 'react-router-dom';

interface PageHeadingPropsType {
  title: string;
  showBackButton?: boolean;
}

export const PageHeading = ({
  title,
  showBackButton = true,
}: PageHeadingPropsType) => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <div className={styles.title}>
      {showBackButton && (
        <IoArrowBack data-testid='back_button' onClick={() => navigate(-1)} className={styles.backIcon} />
      )}
      <h1>{title}</h1>
    </div>
  );
};
