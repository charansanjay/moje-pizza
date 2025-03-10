import styles from './GuestNavLinks.module.css';

import { NavLink } from 'react-router-dom';
import { type CustomerType } from '../../../services/apiCustomer';

interface GuestNavLinksProps {
  customer: CustomerType;
}

export const GuestNavLinks = ({ customer }: GuestNavLinksProps) => {
  if (!customer.id) {
    return (
      <>
        <NavLink to='/signin' className={styles.link}>
          Sign in
        </NavLink>

        <NavLink to='/signup' className={styles.link}>
          Register
        </NavLink>
      </>
    );
  }
};
