import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      // Check if item already exists in cart
      const existingIndex = prev.findIndex(
        (cartItem) => cartItem.name === item.name
      );

      if (existingIndex > -1) {
        // Item exists, increase quantity
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + 1,
        };
        return updated;
      } else {
        // New item, add with quantity 1
        return [...prev, { ...item, quantity: 1 }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity: newQuantity };
      return updated;
    });
  };

  const increaseQuantity = (index) => {
    setCart((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantity: (updated[index].quantity || 1) + 1,
      };
      return updated;
    });
  };

  const decreaseQuantity = (index) => {
    setCart((prev) => {
      const updated = [...prev];
      const currentQuantity = updated[index].quantity || 1;

      if (currentQuantity <= 1) {
        return prev.filter((_, i) => i !== index);
      }

      updated[index] = {
        ...updated[index],
        quantity: currentQuantity - 1,
      };
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const openCart = () => setIsCartOpen(true);

  const closeCart = () => setIsCartOpen(false);

  const cartItemCount = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
        isCartOpen,
        openCart,
        closeCart,
        cartItemCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
