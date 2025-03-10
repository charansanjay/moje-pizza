import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './services/queryClient.ts';
import { AppRoute } from './routes/AppRoute.tsx';
import { BrowserRouter } from 'react-router-dom';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoute />
      </BrowserRouter>
    </QueryClientProvider>
  );
};
