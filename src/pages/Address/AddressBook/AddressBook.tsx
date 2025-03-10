import styles from './AddressBook.module.css';

import { type AddressType } from '../../../redux/slices/addressSlice/addressSlice.ts';

import { EmptyPage } from '../../../components/EmptyPage/EmptyPage.tsx';

import { FaAddressCard } from 'react-icons/fa';
import { AddressItem } from './AddressItem/AddressItem.tsx';

import { Loader } from '../../../components/Loader/Loader.tsx';
import { useCustomerAddress } from '../../../customHooks/useCustomerAddress.tsx';
import { useSelector } from 'react-redux';
import { CustomerType } from '../../../services/apiCustomer.ts';
import { PageHeading } from '../../../components/PageHeading/PageHeading.tsx';

interface AddressBookPropsType {
  showHeading?: boolean;
}

export const AddressBook = ({ showHeading = true }: AddressBookPropsType) => {
  const customer = useSelector(
    (state: { customer: { customerData: CustomerType } }) =>
      state.customer.customerData
  );

  const { customerAddresses = [], isAddressLoading } = useCustomerAddress({
    customerId: customer.id!,
  });

  if (isAddressLoading) {
    return <Loader />;
  }

  if (customerAddresses.length === 0) {
    return (
      <div className={styles.emptyCartPage}>
        <EmptyPage
          message='No Saved Address !!'
          buttonText='Add Address'
          path='/customer/address-new'
          icon={<FaAddressCard className={styles.cartIcon} />}
        />
      </div>
    );
  }

  return (
    <div className={styles.addressBookContainer}>
      {showHeading && (
        <PageHeading title={`Your Addresses (${customerAddresses.length})`} />
      )}
      <ul className={styles.addressList}>
        {customerAddresses.map((item: AddressType) => {
          return <AddressItem key={item.id} address={item} showButtons />;
        })}
      </ul>
    </div>
  );
};
