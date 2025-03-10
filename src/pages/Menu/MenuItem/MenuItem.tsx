import { useDispatch, useSelector } from 'react-redux';

import styles from './MenuItem.module.css';

/* custom hooks */
import { useCartMutation } from '../../../customHooks/mutationHooks/useCartMutation.tsx';

/* components */
import { Loader } from '../../../components/Loader/Loader.tsx';

/* redux */
import { setToast } from '../../../redux/slices/settingsSlice/settingsSlice.ts';

/* icons */
import { FaPlus } from 'react-icons/fa6';

/* types */
import { type MenuItemType } from '../Menu.tsx';
import { type CustomerType } from '../../../services/apiCustomer.ts';
import { type AppDispatch } from '../../../redux/store.ts';
import { type CartType } from '../../../services/apiCart.ts';

interface MenuItemPropsType {
  menuItem: MenuItemType;
}

export const MenuItem = ({ menuItem }: MenuItemPropsType) => {
  const dispatch = useDispatch<AppDispatch>();

  const { name, price, description, sold_out, image_url, currency } = menuItem;

  const customerCart = useSelector(
    (state: { cart: { customerCart: CartType } }) => state.cart.customerCart
  );

  const customer = useSelector(
    (state: { customer: { customerData: CustomerType } }) =>
      state.customer.customerData
  );

  /* react-query cart mutation query */
  const { isLoading: isCartUpdating, addOrUpdateCartItem } = useCartMutation();

  const handleAddOrUpdate = (item: MenuItemType) => {
    if (Object.keys(customer).length === 0) {
      dispatch(
        setToast({
          message: 'Please signin to add item to cart',
          type: 'info',
          disableAutoClose: false,
        })
      );
      return;
    }

    const cartObject = {
      itemToAdd: item,
      customerCart: customerCart,
    };
    addOrUpdateCartItem(cartObject);
  };

  if (isCartUpdating) {
    return <Loader />;
  }

  return (
    <li
      className={
        sold_out
          ? `${styles.menuItem} ${styles.menuItemDisabled}`
          : styles.menuItem
      }
    >
      <div className={styles.menuItemImageContainer}>
        <img alt={name} src={image_url} />
      </div>

      <div className={styles.menuItemContent}>
        <p className={styles.title}>{name}</p>
        <p className={styles.description}>{description}</p>

        {!sold_out ? (
          <p className={styles.price}>
            {currency}&nbsp;{price.toFixed(2)}
          </p>
        ) : (
          <p className={styles.price}>{currency}&nbsp;{price.toFixed(2)} - (Sold out)</p>
        )}

        {!isCartUpdating && (
          <div
            className={styles.addToCartButton}
            onClick={() => handleAddOrUpdate(menuItem)}
          >
            <FaPlus /> Cart
          </div>
        )}
      </div>
    </li>
  );
};
