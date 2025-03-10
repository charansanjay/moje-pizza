import styles from './AddressDetails.module.css';
import { type AddressType } from '../../../../redux/slices/addressSlice/addressSlice.ts';

export const AddressDetails = ({ address }: { address: AddressType }) => {
  return (
    <div className={styles.addressDetails}>
      <p className={styles.name}>
        {address.firstName} {address.lastName}
      </p>
      <p className={styles.address}>
        <b>Street: </b>
        {address.houseAddress}
      </p>
      <p className={styles.address}>
        <b>City: </b>
        {address.city ? address.city : 'N/A'}
      </p>
      <p className={styles.address}>
        <b>PinCode: </b>
        {address.pinCode ? address.pinCode : 'N/A'}
      </p>

      <p className={styles.address}>
        <b>Land Mark: </b>
        {address.landmark ? address.landmark : 'N/A'}
      </p>

      <p className={styles.phone}>
        <b>Phone:</b> {address.phoneNumber}
      </p>
      <p className={styles.phone}>
        <b>Email:</b> {address.emailAddress}
      </p>
    </div>
  );
};
