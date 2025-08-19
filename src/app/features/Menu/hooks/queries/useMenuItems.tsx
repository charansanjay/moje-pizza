import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { setToast } from '../../../../store/slices/settingsSlice/settingsSlice';

import { fetchMenu } from '../../services/apiRestaurant';

import { type AppDispatch } from '../../../../store/store';

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
