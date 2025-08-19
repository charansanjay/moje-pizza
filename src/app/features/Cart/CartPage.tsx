import styles from './CartPage.module.css';
import { useSelector } from 'react-redux';
import { type NavigateFunction, useNavigate } from 'react-router-dom';

import { CartItems, CartSummary, Coupon } from './components';
import { EmptyPage, ContinueButton, PageHeading } from '../../components';

import { MdOutlineRemoveShoppingCart } from 'react-icons/md';
import { FaArrowRightLong } from 'react-icons/fa6';

import { type CartType } from './types';

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
