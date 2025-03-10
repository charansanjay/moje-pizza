import styles from './UserNavLinks.module.css';

import { CartType } from '../../../services/apiCart';
import { Link } from 'react-router-dom';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { FiUser } from 'react-icons/fi';
import { CustomerType } from '../../../services/apiCustomer';

interface UserNavLinksProps {
  isDropdownOpen: boolean;
  customer: CustomerType;
  customerCart: CartType;
  setIsDropdownOpen: (isOpen: boolean) => void;
}

export const UserNavLinks = ({
  isDropdownOpen,
  customer,
  customerCart,
  setIsDropdownOpen,
}: UserNavLinksProps) => {
  if (customer.id) {
    return (
      <>
        <Link to='customer/cart' className={styles.cartIconContainer}>
          <MdOutlineShoppingCart data-testid="cart-icon" className={styles.Icon} />
          {customerCart && customerCart.itemsQuantity > 0 ? (
            <div className={styles.cartBadge}>{customerCart.itemsQuantity}</div>
          ) : (
            <div className={styles.cartBadge}>0</div>
          )}
        </Link>

        <button
          className={styles.accountButton}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <FiUser data-testid="user-icon" className={styles.Icon} />
        </button>
      </>
    );
  }
};
