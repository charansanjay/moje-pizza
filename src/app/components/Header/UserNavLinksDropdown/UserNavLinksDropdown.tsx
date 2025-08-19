import styles from './UserNavLinksDropdown.module.css';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

/* redux */
import {
  resetAddressSlice,
  resetAddressToEdit,
} from '../../../features/Address/slice/addressSlice.ts';
import { logout } from '../../../features/Authorization/slice/authSlice.ts';
import { resetCustomerSlice } from '../../../shared/slices/customerSlice/customerSlice.ts';
import { resetCartSlice } from '../../../features/Cart/slice/cartSlice.ts';
import { resetSettingsSlice } from '../../../store/slices/settingsSlice/settingsSlice.ts';
import { resetOrderSlice } from '../../../features/Orders/slice/orderSlice.ts';

import { queryClient } from '../../../services/queryClient.ts';

import { MdOutlineLogout } from 'react-icons/md';

import { type CustomerType } from '../../../features/Authorization';
import { type AppDispatch } from '../../../store/store.ts';

interface UserNavLinksDropdownProps {
  isDropdownOpen: boolean;
  customer: CustomerType;
  setIsDropdownOpen: (isOpen: boolean) => void;
}

export const UserNavLinksDropdown = ({
  isDropdownOpen,
  customer,
  setIsDropdownOpen,
}: UserNavLinksDropdownProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCustomerSlice());
    dispatch(resetCartSlice());
    dispatch(resetAddressSlice());
    dispatch(resetSettingsSlice());
    dispatch(resetOrderSlice());

    queryClient.removeQueries();
    setIsDropdownOpen(false);
  };

  if (isDropdownOpen) {
    return (
      <div className={styles.dropdown}>
        {customer.id && (
          <>
            <NavLink
              data-testid='orders_link'
              to='/customer/orders'
              className={styles.dropdownLink}
              onClick={() => setIsDropdownOpen(false)}
            >
              Orders
            </NavLink>

            <NavLink
              data-testid='address_book_link'
              to='/customer/address-book'
              className={styles.dropdownLink}
              onClick={() => setIsDropdownOpen(false)}
            >
              Addresses
            </NavLink>

            <NavLink
              data-testid='address_new_link'
              to='/customer/address-new'
              className={styles.dropdownLink}
              onClick={() => {
                dispatch(resetAddressToEdit());
                setIsDropdownOpen(false);
              }}
            >
              Add New Address
            </NavLink>

            <hr className={styles.divider} />

            <NavLink
              to='/'
              className={styles.dropdownLink}
              onClick={handleLogout}
            >
              Signout&nbsp;
              <MdOutlineLogout data-testid='signout_icon' size={18} />
            </NavLink>
          </>
        )}
      </div>
    );
  }
};
