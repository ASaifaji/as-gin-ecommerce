import api from "./api";

const authHeader = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};

const reviewService = {
  getById: async (id) => {
    const res = await api.get(`/reviews/${id}`);
    return res.data;
  },

  getByProduct: async (productId) => {
    const res = await api.get(`/products/${productId}/reviews`);
    return Array.isArray(res.data) ? res.data : [];
  },

  create: async (productId, payload, token) => {
    const res = await api.post(
      `/products/${productId}/reviews`,
      payload,
      { headers: authHeader(token) }
    );
    return res.data;
  },

  update: async (id, payload, token) => {
    const res = await api.put(`/reviews/${id}`, payload, {
      headers: authHeader(token),
    });
    return res.data;
  },

  remove: async (id, token) => {
    const res = await api.delete(`/reviews/${id}`, {
      headers: authHeader(token),
    });
    return res.data;
  },

  adminRemove: async (id, token) => {
    const res = await api.delete(`/reviews/${id}/admin`, {
      headers: authHeader(token),
    });
    return res.data;
  },

  // di dashboard
  getTotalCount: async () => {
    const res = await api.get(`/reviews/count`);
    return Number(res.data?.total_reviews ?? 0);
  },
};

export default reviewService;
