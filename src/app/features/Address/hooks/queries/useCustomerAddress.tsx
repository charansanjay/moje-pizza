import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { setCustomerAddresses } from '../../slice/addressSlice';
import { setToast } from '../../../../store/slices/settingsSlice/settingsSlice';

import { fetchCustomerAddress } from '../../services/apiAddress';

import { type AppDispatch } from '../../../../store/store';

export const useCustomerAddress = ({ customerId }: { customerId: string }) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    data: customerAddresses,
    isLoading: isAddressLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ['customerAddresses'],
    queryFn: () => fetchCustomerAddress(customerId),
  });

  if (isSuccess) {
    dispatch(setCustomerAddresses(customerAddresses));
  }

  if (isError) {
    dispatch(
      setToast({
        message: 'Failed to fetch customer address',
        type: 'error',
      })
    );
  }

  return { customerAddresses, isAddressLoading, error, isError, isSuccess };
};
