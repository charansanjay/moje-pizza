import { useSelector } from 'react-redux';

import styles from './AddAddress.module.css';

import { PageHeading } from '../../../components';
import { AddressForm } from '../AddressForm/AddressForm';

import { type AddressType } from '../types';

export const AddAddress = () => {
  const addressToEdit = useSelector(
    (state: { address: { addressToEdit: AddressType } }) =>
      state.address.addressToEdit
  );

  return (
    <div className={styles.addAddressContainer}>
      <PageHeading
        title={addressToEdit.id ? 'Edit Address' : 'Add New Address'}
      />
      <AddressForm />
    </div>
  );
};
