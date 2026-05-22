import { createSlice } from "@reduxjs/toolkit";

const sessionSlice = createSlice({
  name: "session",
  initialState: { userEmail: null, displayName: null, localUsers: {} },
  reducers: {
    setUserEmail: (state, action) => {
      state.userEmail = action.payload;
    },
    setDisplayName: (state, action) => {
      state.displayName = action.payload;
    },
    registerLocalUser: (state, action) => {
      const { email, password, name } = action.payload;
      if (!state.localUsers) state.localUsers = {};
      state.localUsers[email] = { password, name };
    },
    clearSession: (state) => {
      state.userEmail = null;
      state.displayName = null;
    },
  },
});

export const { setUserEmail, setDisplayName, registerLocalUser, clearSession } =
  sessionSlice.actions;
export default sessionSlice.reducer;
