import styles from './AppLayout.module.css';
import { Outlet } from 'react-router-dom';

/* components */
import { Header } from '../components/Header/Header.tsx';
import { Footer } from '../components/Footer/Footer.tsx';
import { ScrollToTop } from '../components/ScrollToTop/ScrollToTop.tsx';
import { ScrollToTopButton } from '../components/ScrollToTop/ScrollToTopButton.tsx';

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
