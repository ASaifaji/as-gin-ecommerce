import api from "@/utils/api";

const orderService = {
  // Create new order
  createOrder: async (orderData, token) => {
    try {
      const response = await api.post("/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Get all user's orders
  getAllOrders: async (token) => {
    try {
      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Get order detail by ID
  getOrderDetail: async (orderId, token) => {
    try {
      const response = await api.get(`/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  },

  // Get all orders (Admin only)
  getAllOrdersAdmin: async (token) => {
    try {
      const response = await api.get("/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all orders (admin):", error);
      throw error;
    }
  },

  // Update order status (Admin only)
  updateOrderStatus: async (orderId, status, token) => {
    try {
      const response = await api.put(
        `/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${orderId} status:`, error);
      throw error;
    }
  },
};

export default orderService;