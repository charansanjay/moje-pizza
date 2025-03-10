import { useQuery } from '@tanstack/react-query';
import { setToast } from '../redux/slices/settingsSlice/settingsSlice.ts';
import { useDispatch } from 'react-redux';

import { fetchMenu } from '../services/apiRestaurant.ts';
import { AppDispatch } from '../redux/store.ts';

export const useMenuItems = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    data: menuItems,
    isLoading: isMenuLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['menuItems'],
    queryFn: fetchMenu,
  });

  if (isError) {
    dispatch(
      setToast({
        message: 'Failed to fetch menu items',
        type: 'error',
      })
    );
  }

  return { menuItems, isMenuLoading, error, isError };
};
