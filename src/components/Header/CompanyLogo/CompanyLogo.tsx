import styles from './CompanyLogo.module.css';
import { Link } from 'react-router-dom';

import pizza_logo from '../../../assets/images/moje_pizza_logo.png';

export const CompanyLogo = () => {
  return (
    <Link data-testid='logo_link' className={styles.title} to='/'>
      <img src={pizza_logo} alt='Moje Pizza' />
      <h4>Moje Pizza</h4>
    </Link>
  );
};
