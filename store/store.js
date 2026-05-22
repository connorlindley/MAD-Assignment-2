import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, combineReducers } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cartReducer from "./cartSlice";
import ordersReducer from "./ordersSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  cart: cartReducer,
  orders: ordersReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
