import { createSlice } from "@reduxjs/toolkit";

interface AuthSliceType{
  isAuthenticated: boolean;
}

export const initialState: AuthSliceType = {
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
  },
})

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;