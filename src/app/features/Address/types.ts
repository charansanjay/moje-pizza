export interface AddressType {
  id: string;
  customer_id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  houseAddress: string;
  city: string;
  pinCode: string;
  landmark: string;
  useForBilling: boolean;
  deliveryAddress: boolean;
}

export type AddressSliceType = {
  addresses: AddressType[];
  addressToEdit: AddressType | {};
  deliveryAddress: AddressType | {};
};