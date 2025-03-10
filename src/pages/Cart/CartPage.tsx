import styles from './CartPage.module.css';
import { useSelector } from 'react-redux';
import { type NavigateFunction, useNavigate } from 'react-router-dom';

/* Components */
import { CartItems } from './CartItems/CartItems.tsx';
import { CartSummary } from './CartSummary/CartSummary.tsx';
import { Coupon } from './Coupon/Coupon.tsx';
import { EmptyPage } from '../../components/EmptyPage/EmptyPage.tsx';
import { ContinueButton } from '../../components/Button/ContinueButton.tsx';

import { MdOutlineRemoveShoppingCart } from 'react-icons/md';
import { FaArrowRightLong } from 'react-icons/fa6';

import { type CartType } from '../../services/apiCart.ts';
import { PageHeading } from '../../components/PageHeading/PageHeading.tsx';

export const CartPage = () => {
  const navigate: NavigateFunction = useNavigate();

  const customerCart = useSelector(
    (state: { cart: { customerCart: CartType } }) => state.cart.customerCart
  );

  if (customerCart.items.length === 0) {
    return (
      <EmptyPage
        message='Your cart is empty'
        buttonText='Back to Menu'
        path='/menu'
        icon={<MdOutlineRemoveShoppingCart />}
      />
    );
  }

  const onCheckout = () => {
    navigate('/customer/checkout');
  };

  return (
    <div className={styles.cartPage}>
      <PageHeading title={`Your Cart (${customerCart.itemsQuantity})`} />
      <CartItems cartData={customerCart} showActions />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '1rem',
        }}
      >
        <Coupon cartData={customerCart} />
        <CartSummary cartData={customerCart} />
        <ContinueButton
          type='primary'
          text='Checkout'
          float='right'
          icon={<FaArrowRightLong />}
          showIcon
          onClick={onCheckout}
        />
      </div>
    </div>
  );
};
