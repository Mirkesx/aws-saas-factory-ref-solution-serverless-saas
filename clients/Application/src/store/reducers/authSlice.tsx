import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  access_token?: any;
  id_token?: any;
  logged: boolean;
}

const initialState: AuthState = {
  access_token: undefined,
  id_token: undefined,
  logged: false
};

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    init: (state: AuthState, action: PayloadAction<any>) => {
      state.access_token = action.payload.access_token;
      state.id_token = action.payload.id_token;
      state.logged = action.payload.logged;
    },
    login: (state: AuthState, action: PayloadAction<any>) => {
      state.access_token = action.payload.access_token;
      state.id_token = action.payload.id_token;
      state.logged = true;
    },
    logout: (state: AuthState) => {
      state.access_token = undefined;
      state.id_token = undefined;
      state.logged = false;
    },
  },
});

export const { init, login, logout } = authSlice.actions;

export default authSlice.reducer;