import { createSlice } from "@reduxjs/toolkit";

const sessionSlice = createSlice({
  name: "session",
  initialState: { userEmail: null, displayName: null },
  reducers: {
    setUserEmail: (state, action) => {
      state.userEmail = action.payload;
    },
    setDisplayName: (state, action) => {
      state.displayName = action.payload;
    },
    clearSession: (state) => {
      state.userEmail = null;
      state.displayName = null;
    },
  },
});

export const { setUserEmail, setDisplayName, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
