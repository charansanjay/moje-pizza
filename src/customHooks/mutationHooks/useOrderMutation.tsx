import { type NavigateFunction, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

/* redux-slice/services/utils */
import { setToast } from '../../redux/slices/settingsSlice/settingsSlice.ts';
import { setSelectedOrder } from '../../redux/slices/orderSlice/orderSlice.ts';
import { resetCartItems } from '../../redux/slices/cartSlice/cartSlice.ts';
import { createOrder, OrderType } from '../../services/apiOrder.ts';
import { invalidateQueries } from '../../utils/invalidateQueries.ts';

/* types */
import { type AppDispatch } from '../../redux/store';

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
