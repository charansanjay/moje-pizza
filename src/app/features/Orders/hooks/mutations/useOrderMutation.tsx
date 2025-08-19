import { type NavigateFunction, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { setToast } from '../../../../store/slices/settingsSlice/settingsSlice';
import { setSelectedOrder } from '../../slice/orderSlice';
import { resetCartItems } from '../../../Cart/slice/cartSlice';
import { createOrder } from '../../services/apiOrder';
import { invalidateQueries } from '../../../../utils';

import { type AppDispatch } from '../../../../store/store';
import { type OrderType } from '../../types';

export const useOrderMutation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate: NavigateFunction = useNavigate();

  /* CREATE NEW ORDER - MUTATION */
  const createOrderMutation = useMutation({
    mutationFn: async (newOrderObject: OrderType) => {
      const data = await createOrder(newOrderObject);
      return data;
    },
    onSuccess: (data) => {
      invalidateQueries('customerOrders');
      dispatch(
        setToast({
          type: 'success',
          message: 'Order created successfully',
        })
      );
      dispatch(setSelectedOrder(data.data));
      dispatch(resetCartItems(data.resetCartData));

      navigate('/customer/order-details', { replace: true });
    },
    onError: () => {
      dispatch(
        setToast({
          type: 'error',
          message: 'FAILED to create order !',
        })
      );
    },
  });

  return {
    isLoading: createOrderMutation.isLoading,
    error: createOrderMutation.error,
    createOrder: createOrderMutation.mutate,
  };
};
