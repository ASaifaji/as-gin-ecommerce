import api from "./api";

const cartService = {
  // Get user's cart
  getCart: async (token) => {
    try {
      const response = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  // Add product to cart
  addToCart: async (productId, quantity, token) => {
    try {
      const response = await api.post(
        "/cart",
        {
          product_id: productId,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity, token) => {
    try {
      const response = await api.put(
        `/cart/${itemId}`,
        {
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId, token) => {
    try {
      const response = await api.delete(`/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  },

  // Clear entire cart
  clearCart: async (token) => {
    try {
      const response = await api.delete("/cart/clear", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  },
};

export default cartService;