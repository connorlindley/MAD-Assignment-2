import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCount = async () => {
      try {
        const stored = await AsyncStorage.getItem("cartCount");
        if (stored !== null) {
          setCartItems(new Array(parseInt(stored, 10)).fill(null));
        }
      } catch (error) {
        console.error("Error loading cart count:", error);
      }
    };
    loadCount();
  }, []);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const updated = [...prev, item];
      AsyncStorage.setItem("cartCount", String(updated.length));
      return updated;
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
