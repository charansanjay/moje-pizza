import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

/* redux-slice/services */
import { setToast } from '../redux/slices/settingsSlice/settingsSlice.ts';
import { setCustomer } from '../redux/slices/customerSlice/customerSlice.ts';
import { fetchCustomerById } from '../services/apiCustomer.ts';

/* types */
import { type AppDispatch } from '../redux/store.ts';

export const useCustomer = ({ customerId }: { customerId: string }) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    isLoading: isCustomerLoading,
    isError,
    error,
    data: customer,
    isSuccess,
  } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => fetchCustomerById(customerId),
  });

  if (isSuccess) {
    dispatch(setCustomer(customer[0]));
  }

  if (isError) {
    dispatch(
      setToast({
        message: 'Failed to fetch customer',
        type: 'error',
      })
    );
  }

  return { customer, isCustomerLoading, isError, error, isSuccess };
};
