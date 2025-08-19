import { queryClient } from '../services/queryClient';

export const invalidateQueries = (key: string) => {
  queryClient.invalidateQueries({
    queryKey: [key.toString()],
  });
};
