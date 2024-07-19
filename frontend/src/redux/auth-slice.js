import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isAuthenticated: false,
  user: null,
  userType: null,
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.userType = action.payload.userType;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.userType = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
