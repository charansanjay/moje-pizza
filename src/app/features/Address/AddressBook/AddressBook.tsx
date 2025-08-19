import styles from './AddressBook.module.css';
import { useSelector } from 'react-redux';

import { EmptyPage, Loader, PageHeading } from '../../../components';
import { AddressItem } from './AddressItem/AddressItem';

import { useCustomerAddress } from '../hooks/queries/useCustomerAddress';

import { FaAddressCard } from 'react-icons/fa';

import { type CustomerType } from '../../Authorization';
import { type AddressType } from '../types';

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
