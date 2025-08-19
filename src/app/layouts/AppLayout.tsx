import styles from './AppLayout.module.css';
import { Outlet } from 'react-router-dom';

import { Header, Footer, ScrollToTop, ScrollToTopButton } from '../components';

export const AppLayout = () => {
  return (
    <div className={styles.appLayoutContainer}>
      <Header />
      <main className={styles.mainContentContainer}>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
      <ScrollToTop />
    </div>
  );
};
