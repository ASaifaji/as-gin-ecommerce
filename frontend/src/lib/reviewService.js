import api from "./api";

const reviewService = {
  // Get review by ID
  getReviewById: async (reviewId) => {
    try {
      const response = await api.get(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching review ${reviewId}:`, error);
      throw error;
    }
  },

  // Get all reviews from all products (for testimonials section)
  getAllReviews: async (limit = 12, offset = 0) => {
    try {
      const response = await api.get("/reviews", {
        params: {
          limit,
          offset
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      throw error;
    }
  },

  // Get all reviews for a specific product
  getProductReviews: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/reviews`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      throw error;
    }
  },

  // Create a new review
  createReview: async (productId, reviewData, token) => {
    try {
      const response = await api.post(
        `/products/${productId}/reviews`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  },

  // Update a review
  updateReview: async (reviewId, reviewData, token) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating review ${reviewId}:`, error);
      throw error;
    }
  },

  // Delete a review (user)
  deleteReview: async (reviewId, token) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting review ${reviewId}:`, error);
      throw error;
    }
  },

  // Delete a review (admin)
  deleteReviewByAdmin: async (reviewId, token) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting review ${reviewId} (admin):`, error);
      throw error;
    }
  },
};

export default reviewService;