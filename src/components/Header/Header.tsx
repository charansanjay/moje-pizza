import { useState, useRef, useEffect } from 'react';
import styles from './Header.module.css';
import { NavLink } from 'react-router-dom';

/* Redux */
import {  useSelector } from 'react-redux';

/* Components */
import { UserNavLinksDropdown } from './UserNavLinksDropdown/UserNavLinksDropdown.tsx';
import { UserNavLinks } from './UserNavLinks/UserNavLinks.tsx';
import { GuestNavLinks } from './GuestNavLinks/GuestNavLinks.tsx';
import { CompanyLogo } from './CompanyLogo/CompanyLogo.tsx';

/* Types */
import { type CustomerType } from '../../services/apiCustomer.ts';
import { type CartType } from '../../services/apiCart.ts';

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

        <GuestNavLinks
          customer={customer}
        />

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
