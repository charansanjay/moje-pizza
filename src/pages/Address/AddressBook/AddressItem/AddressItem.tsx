import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type NavigateFunction, useNavigate } from 'react-router-dom';

/* css */
import styles from './AddressItem.module.css';

/* redux-slice */
import {
  type AddressType,
  setAddressToEdit,
} from '../../../../redux/slices/addressSlice/addressSlice.ts';

/* components */
import { Modal } from '../../../../components/Modal/Modal.tsx';
import { AddressDetails } from '../AddressDetails/AddressDetails.tsx';
import { Loader } from '../../../../components/Loader/Loader.tsx';

/* icons */
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';

/* hooks */
import { useCustomerAddress } from '../../../../customHooks/useCustomerAddress.tsx';
import { useAddressMutation } from '../../../../customHooks/mutationHooks/useAddressMutation.tsx';

import { type AppDispatch } from '../../../../redux/store.ts';
import { type CustomerType } from '../../../../services/apiCustomer.ts';

interface AddressItemProps {
  address: AddressType;
  showButtons: boolean;
}

export const AddressItem = ({ address, showButtons }: AddressItemProps) => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const customer = useSelector(
    (state: { customer: { customerData: CustomerType } }) =>
      state.customer.customerData
  );

  /* fetch addresses query */
  const { customerAddresses = [], isAddressLoading } = useCustomerAddress({
    customerId: customer.id || '',
  });

  /* react-query mutation hook */
  const { isLoading, updateDeliveryAddress, deleteAddress } =
    useAddressMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  /* HANDLERS */
  const handleDefaultAddress = () => {
    const updateAddressObject = {
      addresses: [...customerAddresses],
      address: { ...address },
    };
    updateDeliveryAddress(updateAddressObject);
  };

  const handleEditAddress = () => {
    dispatch(setAddressToEdit(address));
    navigate('/customer/address-new');
  };

  if (isLoading || isAddressLoading) {
    return <Loader />;
  }

  return (
    <li className={styles.addressCard}>
      <AddressDetails address={address} />

      {showButtons && (
        <>
          <hr />
          <div className={styles.actionButtonsContainer}>
            <div className={styles.actionButtons}>
              <FaEdit
                title='Edit'
                className={styles.editIcon}
                onClick={handleEditAddress}
              />
              <MdDelete
                title='Delete'
                onClick={() => setIsModalOpen(true)}
                className={styles.deleteIcon}
              />
            </div>

            {/* set default address button */}
            <p
              className={`${styles.setDefaultText} ${
                address.deliveryAddress && styles.default
              } `}
              onClick={handleDefaultAddress}
            >
              {address.deliveryAddress
                ? 'Delivery Address'
                : 'Set as delivery address'}
            </p>

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={() => deleteAddress(address)}
              title='Delete Product'
              message='Are you sure you want to delete this address from the list?'
            />
          </div>
        </>
      )}
    </li>
  );
};
