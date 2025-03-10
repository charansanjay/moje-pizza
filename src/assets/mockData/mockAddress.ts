import { AddressType } from '../../redux/slices/addressSlice/addressSlice';

export const mockAddress: AddressType = {
  firstName: 'firstName',
  lastName: 'lastName',
  phoneNumber: '+420 771 234 567',
  emailAddress: 'charan@example.com',
  houseAddress: 'streetAddress',
  city: 'city',
  pinCode: '123456',
  useForBilling: false,
  deliveryAddress: true,
  landmark: '',
  customer_id: '123',
  id: '10',
};

export const mockAddresses: AddressType[] = [
  {
    firstName: 'firstName',
    lastName: 'lastName',
    phoneNumber: '+420 771 234 567',
    emailAddress: 'charan@example.com',
    houseAddress: 'streetAddress',
    city: 'city',
    pinCode: '123456',
    useForBilling: false,
    deliveryAddress: true,
    landmark: '',
    customer_id: '123',
    id: '10',
  },
];
