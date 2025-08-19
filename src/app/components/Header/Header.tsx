import { useState, useRef, useEffect } from 'react';
import styles from './Header.module.css';
import { NavLink } from 'react-router-dom';

import { UserNavLinksDropdown } from './UserNavLinksDropdown/UserNavLinksDropdown';
import { UserNavLinks } from './UserNavLinks/UserNavLinks';
import { GuestNavLinks } from './GuestNavLinks/GuestNavLinks';
import { CompanyLogo } from './CompanyLogo/CompanyLogo';

import { useSelector } from 'react-redux';

import { type CustomerType } from '../../features/Authorization/types';
import { type CartType } from '../../features/Cart/types';

export const Header = () => {
  const customer = useSelector(
    (state: { customer: { customerData: CustomerType } }) =>
      state.customer.customerData
  );

  const customerCart = useSelector(
    (state: { cart: { customerCart: CartType } }) => state.cart.customerCart
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={styles.header} ref={dropdownRef}>
      <CompanyLogo />

      <div className={styles.headerLinks}>
        <NavLink className={styles.link} to='/menu'>
          Menu
        </NavLink>

        <GuestNavLinks customer={customer} />

        <UserNavLinks
          isDropdownOpen={isDropdownOpen}
          customer={customer}
          customerCart={customerCart}
          setIsDropdownOpen={setIsDropdownOpen}
        />

        <UserNavLinksDropdown
          isDropdownOpen={isDropdownOpen}
          customer={customer}
          setIsDropdownOpen={setIsDropdownOpen}
        />
      </div>
    </header>
  );
};
