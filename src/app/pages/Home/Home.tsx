import { type NavigateFunction, useNavigate } from 'react-router-dom';

import styles from './Home.module.css';

import { ContinueButton } from '../../components';

export const Home = () => {
  const navigate: NavigateFunction = useNavigate();

  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeBanner}>
        <div className={styles.homeBannerContent}>
          <h1>Welcome to Moje Pizza 🍕</h1>
          <p>Order your favorite pizza now!</p>
          <ContinueButton
            float='left'
            text='Check Menu'
            type='primary'
            showIcon
            onClick={() => navigate('/menu')}
          />
        </div>
      </div>
    </div>
  );
};
