import styles from './CompanyLogo.module.css';
import { Link } from 'react-router-dom';

import pizza_logo from '../../../../assets/images/moje_pizza_logo.webp';

export const CompanyLogo = () => {
  return (
    <Link data-testid='logo_link' className={styles.title} to='/'>
      <img src={pizza_logo} alt='Moje Pizza' width={160} height={143} />
      <h4>Moje Pizza</h4>
    </Link>
  );
};
