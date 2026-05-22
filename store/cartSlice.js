import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          id: action.payload.id,
          title: action.payload.title,
          price: action.payload.price,
          image: action.payload.image,
          quantity: 1,
        });
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQuantity: (state, action) => {
      const index = state.items.findIndex((i) => i.id === action.payload);
      if (index !== -1) {
        if (state.items[index].quantity <= 1) {
          state.items.splice(index, 1);
        } else {
          state.items[index].quantity -= 1;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
