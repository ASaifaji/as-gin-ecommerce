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

  // === NEW: total count ===
  getTotalCount: async () => {
    try {
      const res = await api.get("/products/count");
      const n = Number(res.data?.total_products);
      if (Number.isFinite(n)) return n;
      const list = await productService.getAllProducts();
      return Array.isArray(list) ? list.length : 0;
    } catch (e) {
      console.warn("fallback count products", e?.message);
      const list = await productService.getAllProducts();
      return Array.isArray(list) ? list.length : 0;
    }
  },
};

export default productService;
