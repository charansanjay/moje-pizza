import { renderHook, act, cleanup } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

/* component */
import { useAddressMutation } from './useAddressMutation.tsx';

/* redux-slice/service */
import {
  addNewAddress,
  deleteAddress,
  updateAddress,
  updateDeliveryAddress,
} from '../../services/apiAddress.ts';
import { setToast } from '../../redux/slices/settingsSlice/settingsSlice.ts';
import { invalidateQueries } from '../../utils/invalidateQueries.ts';

/* mock data */
import { mockAddress } from '../../assets/mockData/mockAddress.ts';
import { mockCustomer } from '../../assets/mockData/mockCustomer.ts';
import { queryClient } from '../../services/queryClient.ts';

// Mock the dependencies
vi.mock('../../services/apiAddress.ts', () => ({
  addNewAddress: vi.fn(),
  deleteAddress: vi.fn(),
  updateAddress: vi.fn(),
  updateDeliveryAddress: vi.fn(),
}));

vi.mock('../../utils/invalidateQueries.ts', () => ({
  invalidateQueries: vi.fn(),
}));

// Mock the store
const mockStore = configureStore([]);
const store = mockStore({});
store.dispatch = vi.fn();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  </Provider>
);

const mockDispatch = store.dispatch as Mock;
const mockAddNewAddress = addNewAddress as Mock;
const mockUpdateAddress = updateAddress as Mock;
const mockUpdateDeliveryAddress = updateDeliveryAddress as Mock;
const mockDeleteAddress = deleteAddress as Mock;

const mockInvalidateQueries = invalidateQueries as Mock;

describe('useAddressMutation - HOOK', async () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();

    mockDispatch.mockClear();
    mockAddNewAddress.mockResolvedValue(mockAddNewAddress);
    mockUpdateDeliveryAddress.mockResolvedValue(mockUpdateDeliveryAddress);
    mockUpdateAddress.mockResolvedValue(mockUpdateAddress);
    mockDeleteAddress.mockResolvedValue(mockDeleteAddress);
  });

  describe('addAddressMutation - MUTATION', () => {
    it('should dispatch setToast and navigate on successful addAddress', async () => {
      mockAddNewAddress.mockResolvedValue(mockAddress);

      const { result } = renderHook(() => useAddressMutation(), { wrapper });

      await act(async () => {
        await result.current.addAddress({
          newAddress: mockAddress,
          customer: mockCustomer,
        });
      });

      expect(mockAddNewAddress).toHaveBeenCalledWith(mockAddress, mockCustomer);
      expect(mockInvalidateQueries).toHaveBeenCalledWith('customerAddresses');
      expect(mockDispatch).toHaveBeenCalledWith(
        setToast({
          message: 'Address ADDED successfully',
          type: 'success',
        })
      );
    });

    it('should dispatch setToast when adding a new address fails', async () => {
      mockAddNewAddress.mockRejectedValue(new Error('Failed to add address'));

      const { result } = renderHook(() => useAddressMutation(), { wrapper });

      await act(async () => {
        await result.current.addAddress({
          newAddress: mockAddress,
          customer: mockCustomer,
        });
      });

      expect(mockAddNewAddress).toHaveBeenCalledWith(mockAddress, mockCustomer);
      expect(mockDispatch).toHaveBeenCalledWith(
        setToast({
          type: 'error',
          message: 'FAILED to add address !',
        })
      );
    });
  });

  describe('updateAddressMutation - MUTATION', () => {
    it('should dispatch setToast and navigate on successful updateAddress', async () => {
      const updatedAddress = {
        ...mockAddress,
        houseAddress: 'Updated house address',
      };

      const { result } = renderHook(() => useAddressMutation(), { wrapper });

      await act(async () => {
        await result.current.editAddress(updatedAddress);
      });

      expect(mockUpdateAddress).toHaveBeenCalledWith(updatedAddress);
      expect(mockInvalidateQueries).toHaveBeenCalledWith('customerAddresses');
      expect(mockDispatch).toHaveBeenCalledWith(
        setToast({
          message: 'Address UPDATED successfully',
          type: 'success',
        })
      );
    });

    it('should dispatch setToast when updating an address fails', async () => {
      mockUpdateAddress.mockRejectedValue(
        new Error('Failed to update address')
      );

      const { result } = renderHook(() => useAddressMutation(), { wrapper });

      await act(async () => {
        await result.current.editAddress(mockAddress);
      });

      expect(mockDispatch).toHaveBeenCalledWith(
        setToast({
          type: 'error',
          message: 'FAILED to update address !',
          disableAutoClose: true,
        })
      );
    });
  });

  describe('updateDefaultAddressMutation - MUTATION', () => {
    it('should dispatch setToast and navigate on successful updateDefaultAddress', async () => {
      const updatedAddress = {
        ...mockAddress,
        deliveryAddress: false,
      };

      mockUpdateDeliveryAddress.mockResolvedValue(updatedAddress);

      const { result } = renderHook(() => useAddressMutation(), { wrapper });

      await act(async () => {
        await result.current.updateDeliveryAddress({
          addresses: [mockAddress],
          address: updatedAddress,
        });
      });

      expect(mockUpdateDeliveryAddress).toHaveBeenCalledWith(
        [mockAddress],
        updatedAddress
      );
      expect(mockInvalidateQueries).toHaveBeenCalledWith('customerAddresses');
      expect(mockDispatch).toHaveBeenCalledWith(
        setToast({
          message: 'Address UPDATED successfully',
          type: 'success',
        })
      );
    });

    it('should dispatch setToast when updating a default address fails', async () => {
      const updatedAddress = {
        ...mockAddress,
        deliveryAddress: false,
      };

      mockUpdateDeliveryAddress.mockRejectedValue(
        new Error('Failed to update default address')
      );

      const { result } = renderHook(() => useAddressMutation(), { wrapper });

      await act(async () => {
        await result.current.updateDeliveryAddress({
          addresses: [mockAddress],
          address: updatedAddress,
        });
      });

      expect(mockDispatch).toHaveBeenCalledWith(
        setToast({
          type: 'error',
          message: 'FAILED to update address !',
        })
      );
    });
  });

  describe('deleteAddressMutation - MUTATION', () => {
    it('should dispatch setToast and navigate on successful deleteAddress', async () => {
      const { result } = renderHook(() => useAddressMutation(), { wrapper });

      await act(async () => {
        await result.current.deleteAddress(mockAddress);
      });

      expect(mockDeleteAddress).toHaveBeenCalledWith(mockAddress);
      expect(mockInvalidateQueries).toHaveBeenCalledWith('customerAddresses');
      expect(mockDispatch).toHaveBeenCalledWith(
        setToast({
          message: 'Address DELETED successfully',
          type: 'success',
          disableAutoClose: false,
        })
      );
    });

    it('should dispatch setToast when deleting an address fails', async () => {
      mockDeleteAddress.mockRejectedValue(
        new Error('Failed to delete address')
      );

      const { result } = renderHook(() => useAddressMutation(), { wrapper });

      await act(async () => {
        await result.current.deleteAddress(mockAddress);
      });

      expect(mockDispatch).toHaveBeenCalledWith(
        setToast({
          type: 'error',
          message: 'FAILED to delete address !',
          disableAutoClose: true,
        })
      );
    });
  });
});
