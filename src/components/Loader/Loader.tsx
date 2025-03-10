import styles from './Loader.module.css';

import pizza_image from '../../assets/images/pizza.svg';

export const Loader = () => {
  return (
    <div data-testid="loader" className={styles.overlay}>
      <div className={styles.spinner}>
        <div className={styles.spinnerInner}>
          <img alt='Pizza' src={pizza_image} />
        </div>
      </div>
    </div>
  );
};
