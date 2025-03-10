import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

/* redux-slice */
import addressReducer, {
  setCustomerAddresses,
  setAddressToEdit,
  resetAddressToEdit,
  resetAddressSlice,
  AddressSliceType,
  initialState,
} from './addressSlice.ts';

/* mock data */
import { mockAddresses } from '../../../assets/mockData/mockAddress.ts';

// unit test - without store setup
describe('addressSlice - REDUCER LOGIC (pure function)', () => {
  it('should return the initial state', () => {
    expect(addressReducer(initialState, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should handle setCustomerAddresses', () => {
    const expectedState: AddressSliceType = {
      addresses: mockAddresses,
      addressToEdit: {},
      deliveryAddress: mockAddresses[0],
    };

    expect(
      addressReducer(initialState, setCustomerAddresses(mockAddresses))
    ).toEqual(expectedState);
  });

  it('should handle setAddressToEdit', () => {
    const expectedState: AddressSliceType = {
      addresses: [],
      addressToEdit: mockAddresses[0],
      deliveryAddress: {},
    };

    expect(
      addressReducer(initialState, setAddressToEdit(mockAddresses[0]))
    ).toEqual(expectedState);
  });

  it('should handle resetAddressToEdit', () => {
    const modifiedState: AddressSliceType = {
      addresses: [],
      addressToEdit: mockAddresses[0],
      deliveryAddress: {},
    };

    expect(addressReducer(modifiedState, resetAddressToEdit())).toEqual(
      initialState
    );
  });

  it('should handle resetAddressSlice', () => {
    const modifiedState: AddressSliceType = {
      addresses: mockAddresses,
      addressToEdit: mockAddresses[0],
      deliveryAddress: mockAddresses[0],
    };

    expect(addressReducer(modifiedState, resetAddressSlice())).toEqual(
      initialState
    );
  });
});

// integration testing with Redux store -
// test how Redux handles state updates in a real app
describe('addressSlice - REDUX STORE INTEGRATION', () => {
  const store = configureStore({
    reducer: {
      address: addressReducer,
    },
  });

  it('should return the initial state', () => {
    expect(store.getState().address).toEqual(initialState);
  });

  it('should handle setCustomerAddresses', () => {
    store.dispatch(setCustomerAddresses(mockAddresses));
    const state = store.getState().address;

    expect(state.addresses).toEqual(mockAddresses);
  });

  it('should handle setAddressToEdit', () => {
    store.dispatch(setAddressToEdit(mockAddresses[0]));
    const state = store.getState().address;

    expect(state.addressToEdit).toEqual(mockAddresses[0]);
  });

  it('should handle resetAddressToEdit', () => {
    store.dispatch(resetAddressToEdit());
    const state = store.getState().address;

    expect(state.addressToEdit).toEqual({});
  });

  it('should handle resetAddressSlice', () => {
    store.dispatch(resetAddressSlice());
    expect(store.getState().address).toEqual(initialState);
  });
});
