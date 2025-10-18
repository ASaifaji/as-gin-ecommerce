import api from "./api";

const productService = {
  // GET /products -> { products: [...] }
  getAllProducts: async () => {
    const res = await api.get("/products");
    return res.data?.products || [];
  },

  // GET /products/:id -> { data: {...} }
  getProductById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data?.data || res.data;
  },

  // POST /products  (admin)
  createProduct: async (payload, token) => {
    const res = await api.post("/products", payload, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  },

  // PUT /products/:id  (admin)
  updateProduct: async (id, payload, token) => {
    const res = await api.put(`/products/${id}`, payload, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  },

  // DELETE /products/:id  (admin)
  deleteProduct: async (id, token) => {
    const res = await api.delete(`/products/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  },
};

export default productService;
