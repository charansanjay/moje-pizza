import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export const initialState: AddressSliceType = {
  addresses: [],
  addressToEdit: {},
  deliveryAddress: {},
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setCustomerAddresses(state, action: PayloadAction<AddressType[]>) {
      const deliveryAddress = action.payload.find(
        (address) => address.deliveryAddress === true
      );

      state.addresses = action.payload;
      state.deliveryAddress = deliveryAddress || {};
    },
    setAddressToEdit(state, action: PayloadAction<AddressType>) {
      state.addressToEdit = action.payload;
    },
    resetAddressToEdit(state) {
      state.addressToEdit = initialState.addressToEdit;
    },
    resetAddressSlice(state) {
      state.addressToEdit = initialState.addressToEdit;
      state.deliveryAddress = initialState.deliveryAddress;
      state.addresses = initialState.addresses;
    },
  },
});

export const {
  setCustomerAddresses,
  setAddressToEdit,
  resetAddressToEdit,
  resetAddressSlice,
} = addressSlice.actions;

export default addressSlice.reducer;
