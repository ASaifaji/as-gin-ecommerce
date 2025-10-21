import api from "./api";

const pickArray = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  const d = res.data ?? res;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.orders)) return d.orders;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.data)) return d.data;
  return [];
};

const orderService = {
  async getAllOrders(params = {}) {
    const res = await api.get("/admin/orders", { params });
    return pickArray(res);
  },
  async getOrderDetail(orderId) {
    const res = await api.get(`/orders/${orderId}`);
    return res.data?.order ?? res.data ?? res;
  },
  async updateOrderStatus(orderId, status) {
    const res = await api.put(`/orders/${orderId}/status`, { status });
    return res.data ?? res;
  },
  async getMyOrders(params = {}) {
    const res = await api.get("/orders", { params });
    return pickArray(res);
  },
  async createOrder(payload) {
    const res = await api.post("/orders", payload);
    return res.data ?? res;
  },
  async getOrderCount() {
    try {
      const all = await this.getAllOrders();
      return all.length;
    } catch {
      return 0;
    }
  },
};

export default orderService;
