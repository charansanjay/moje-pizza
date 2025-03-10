import { useSelector } from 'react-redux';

import styles from './AddAddress.module.css';

/* Components */
import { AddressForm } from '../AddressForm/AddressForm.tsx';

import { type AddressType } from '../../../redux/slices/addressSlice/addressSlice.ts';
import { PageHeading } from '../../../components/PageHeading/PageHeading.tsx';

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
