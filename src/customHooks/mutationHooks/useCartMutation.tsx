import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

/* redux-slice/services */
import { setCustomerCart } from '../../redux/slices/cartSlice/cartSlice.ts';
import { setToast } from '../../redux/slices/settingsSlice/settingsSlice.ts';
import {
  addOrUpdateCartItem,
  applyCouponDiscount,
  CartItemType,
  CartType,
  deleteCartItem,
  updateCartItemQuantity,
} from '../../services/apiCart.ts';

/* types */
import { type AppDispatch } from '../../redux/store.ts';
import { type MenuItemType } from '../../pages/Menu/Menu.tsx';
export const useCartMutation = () => {
  const dispatch = useDispatch<AppDispatch>();

  /* ADD or UPDATE CART ITEMS - MUTATION */
  const addOrUpdateCartItemMutation = useMutation({
    mutationFn: async (cartObject: {
      itemToAdd: MenuItemType;
      customerCart: CartType;
    }) => {
      const data = await addOrUpdateCartItem(
        cartObject.itemToAdd,
        cartObject.customerCart
      );
      return data;
    },
    onSuccess: (data) => {
      dispatch(setCustomerCart(data));
      dispatch(
        setToast({
          message: 'Item ADDED to cart',
          type: 'success',
          disableAutoClose: false,
        })
      );
    },
    onError: (error: Error) => {
      dispatch(
        setToast({
          message: error.message || 'Failed to add item to cart',
          type: 'error',
          disableAutoClose: true,
        })
      );
    },
  });

  /* UPDATE ITEM QUANTITY FROM CART - MUTATION */
  const updateCartItemQuantityMutation = useMutation({
    mutationFn: async (cartObject: {
      itemToUpdate: CartItemType;
      cartData: CartType;
    }) => {
      const data = await updateCartItemQuantity(
        cartObject.itemToUpdate,
        cartObject.cartData
      );
      return data;
    },
    onSuccess: (data) => {
      dispatch(setCustomerCart(data));
      dispatch(
        setToast({
          message: 'Item quantity UPDATED',
          type: 'success',
          disableAutoClose: false,
        })
      );
    },
    onError: () => {
      dispatch(
        setToast({
          message: 'Failed to update item quantity',
          type: 'error',
          disableAutoClose: true,
        })
      );
    },
  });

  /* DELETE ITEM FROM CART- MUTATION */
  const deleteCartItemMutation = useMutation({
    mutationFn: async (cartObject: {
      itemToDelete: CartItemType;
      cartData: CartType;
    }) => {
      const data = await deleteCartItem(
        cartObject.itemToDelete,
        cartObject.cartData
      );
      return data;
    },
    onSuccess: (data) => {
      dispatch(setCustomerCart(data));
      dispatch(
        setToast({
          message: 'Item REMOVED from the cart',
          type: 'success',
          disableAutoClose: false,
        })
      );
    },
    onError: () => {
      dispatch(
        setToast({
          message: 'Failed to remove item from cart',
          type: 'error',
          disableAutoClose: true,
        })
      );
    },
  });

  /* APPLY COUPON - MUTATION */
  const applyCouponMutation = useMutation({
    mutationFn: async (cartObject: {
      cartData: CartType;
      couponCode: string;
    }) => {
      const data = await applyCouponDiscount(
        cartObject.cartData,
        cartObject.couponCode
      );
      return data;
    },
    onSuccess: (data) => {
      dispatch(setCustomerCart(data));
      dispatch(
        setToast({ message: 'Coupon applied successfully', type: 'success' })
      );
    },
    onError: (error: Error) => {
      dispatch(
        setToast({
          message: error.message || 'Failed to apply coupon',
          type: 'error',
        })
      );
    },
  });

  return {
    isLoading:
      addOrUpdateCartItemMutation.isLoading ||
      updateCartItemQuantityMutation.isLoading ||
      deleteCartItemMutation.isLoading ||
      applyCouponMutation.isLoading,
    error:
      addOrUpdateCartItemMutation.error ||
      updateCartItemQuantityMutation.error ||
      deleteCartItemMutation.error ||
      applyCouponMutation.error,
    addOrUpdateCartItem: addOrUpdateCartItemMutation.mutate,
    updateCartItemQuantity: updateCartItemQuantityMutation.mutate,
    deleteCartItem: deleteCartItemMutation.mutate,
    applyCouponDiscount: applyCouponMutation.mutate,
  };
};
