import api from "./api";

const categoryService = {
  getAllCategories: async () => {
    try {
      const res = await api.get("/categories");
      return res.data?.categories || res.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  getCategoriesWithProductCount: async () => {
    try {
      const res = await api.get("/categories");
      return res.data?.categories || res.data || [];
    } catch (error) {
      console.error("Error fetching categories with product count:", error);
      throw error;
    }
  },

  // SINGLE: selalu return object category
  getCategoryById: async (id) => {
    try {
      const res = await api.get(`/categories/${id}`);
      return res.data?.category || res.data?.data || res.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  // CREATE
  createCategory: async (categoryData, token) => {
    try {
      const res = await api.post("/categories", categoryData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.data?.category || res.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  // UPDATE
  updateCategory: async (id, categoryData, token) => {
    try {
      const res = await api.put(`/categories/${id}`, categoryData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.data?.category || res.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  // DELETE
  deleteCategory: async (id, token) => {
    try {
      const res = await api.delete(`/categories/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.data;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },

  recountAll: async (token) => {
    try {
      const res = await api.post(
        "/categories/recount",
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      return res.data;
    } catch (error) {
      console.error("Error recounting categories:", error);
      throw error;
    }
  },
  
  // === NEW: total count ===
  getTotalCount: async () => {
    try {
      const res = await api.get("/categories/count");
      const n = Number(res.data?.total_categories);
      if (Number.isFinite(n)) return n;
      const list = await categoryService.getAllCategories();
      return Array.isArray(list) ? list.length : 0;
    } catch (e) {
      console.warn("fallback count categories", e?.message);
      const list = await categoryService.getAllCategories();
      return Array.isArray(list) ? list.length : 0;
    }
  },
};

export default categoryService;
