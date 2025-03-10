import { type NavigateFunction, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';

/* redux-slice/services/utils */
import { AppDispatch } from '../../redux/store.ts';
import { setToast } from '../../redux/slices/settingsSlice/settingsSlice.ts';
import {
  addNewAddress,
  deleteAddress,
  updateAddress,
  updateDeliveryAddress,
} from '../../services/apiAddress.ts';
import { invalidateQueries } from '../../utils/invalidateQueries.ts';

/* types */
import { type AddressType } from '../../redux/slices/addressSlice/addressSlice.ts';
import { type CustomerType } from '../../services/apiCustomer.ts';

export const useAddressMutation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate: NavigateFunction = useNavigate();

  /* ADD NEW ADDRESS - MUTATION */
  const addAddressMutation = useMutation({
    mutationFn: async (addressObject: {
      newAddress: AddressType;
      customer: CustomerType;
    }) => {
      const data = await addNewAddress(
        addressObject.newAddress,
        addressObject.customer
      );
      return data;
    },
    onSuccess: () => {
      invalidateQueries('customerAddresses');
      dispatch(
        setToast({
          type: 'success',
          message: 'Address ADDED successfully',
        })
      );

      navigate('/customer/address-book', { replace: true });
    },
    onError: () => {
      dispatch(
        setToast({
          type: 'error',
          message: 'FAILED to add address !',
        })
      );
    },
  });

  /* UPDATE ADDRESS */
  const updateAddressMutation = useMutation({
    mutationFn: async (address: AddressType) => {
      const data = await updateAddress(address);
      return data;
    },
    onSuccess: () => {
      invalidateQueries('customerAddresses');
      dispatch(
        setToast({
          type: 'success',
          message: 'Address UPDATED successfully',
        })
      );
      navigate('/customer/address-book', { replace: true });
    },
    onError: () => {
      dispatch(
        setToast({
          type: 'error',
          message: 'FAILED to update address !',
          disableAutoClose: true,
        })
      );
    },
  });

  /* UPDATE DELIVERY ADDRESS - MUTATION */
  const updateDeliveryAddressMutation = useMutation({
    mutationFn: async (addressObject: {
      addresses: AddressType[];
      address: AddressType;
    }) => {
      const data = await updateDeliveryAddress(
        addressObject.addresses,
        addressObject.address
      );
      return data;
    },
    onSuccess: () => {
      invalidateQueries('customerAddresses');
      dispatch(
        setToast({
          type: 'success',
          message: 'Address UPDATED successfully',
        })
      );
    },
    onError: () => {
      dispatch(
        setToast({
          type: 'error',
          message: 'FAILED to update address !',
        })
      );
    },
  });

  /* DELETE ADDRESS - MUTATION */
  const deleteAddressMutation = useMutation({
    mutationFn: async (address: AddressType) => {
      const data = await deleteAddress(address);
      return data;
    },
    onSuccess: () => {
      invalidateQueries('customerAddresses');
      dispatch(
        setToast({
          type: 'success',
          message: 'Address DELETED successfully',
          disableAutoClose: false,
        })
      );
    },
    onError: () => {
      dispatch(
        setToast({
          type: 'error',
          message: 'FAILED to delete address !',
          disableAutoClose: true,
        })
      );
    },
  });

  return {
    isLoading:
      addAddressMutation.isLoading ||
      updateAddressMutation.isLoading ||
      updateDeliveryAddressMutation.isLoading ||
      deleteAddressMutation.isLoading,
    error:
      addAddressMutation.error ||
      updateAddressMutation.error ||
      updateDeliveryAddressMutation.error ||
      deleteAddressMutation.error,
    addAddress: addAddressMutation.mutate,
    editAddress: updateAddressMutation.mutate,
    updateDeliveryAddress: updateDeliveryAddressMutation.mutate,
    deleteAddress: deleteAddressMutation.mutate,
  };
};
