import { cleanup, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ProtectedRoute } from './ProtectedRoute.tsx';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockStore = configureStore([]);

const mockNavigate = useNavigate as Mock;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();

    mockNavigate.mockReturnValue(mockNavigate);
  });

  it('redirects to "/" if not authenticated', () => {
    const store = mockStore({
      auth: { isAuthenticated: false },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path='/protected'
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders children if authenticated', () => {
    const store = mockStore({
      auth: { isAuthenticated: true },
    });

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path='/protected'
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(getByText('Protected Content')).toBeInTheDocument();
  });
});
