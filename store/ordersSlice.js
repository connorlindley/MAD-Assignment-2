import { createSlice } from "@reduxjs/toolkit";

const ordersSlice = createSlice({
  name: "orders",
  initialState: { orders: [] },
  reducers: {
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
    },
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const order = state.orders.find((o) => o.id === id);
      if (order) order.status = status;
    },
    clearOrders: (state) => {
      state.orders = [];
    },
  },
});

export const { addOrder, updateOrderStatus, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
