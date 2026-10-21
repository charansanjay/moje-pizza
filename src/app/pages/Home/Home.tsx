import { type NavigateFunction, useNavigate } from 'react-router-dom';

import styles from './Home.module.css';

import { ContinueButton } from '../../components';

export const Home = () => {
  const navigate: NavigateFunction = useNavigate();

  return (
    <div className={styles.homeContainer}>
      <img
        className={styles.heroImage}
        src='/images/pizza-banner-1280.webp' // fallback for old browsers
        srcSet='/images/pizza-banner-768.webp 768w, /images/pizza-banner-1280.webp 1280w, /images/pizza-banner-1920.webp 1920w'
        sizes='100vw' // the image is as wide as the screen
        alt='' // decorative: screen readers skip it
        aria-hidden='true'
        loading='eager' // never lazy: it's the main content (LCP)
        decoding='async' // decode off the main thread
      />
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
