import React, { useState, useEffect } from "react";
import { Trash2, Eye, Search, Filter } from "lucide-react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import api from "@/lib/api";
import reviewService from "@/lib/reviewService";

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [searchTerm, filterRating, reviews]);

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch all products first
      const productsResponse = await api.get("/products");
      const products = productsResponse.data.products || [];

      // Fetch reviews for all products
      const reviewPromises = products.map(product =>
        api.get(`/products/${product.id}/reviews`)
          .then(res => res.data.map(review => ({
            ...review,
            product_name: product.name,
            product_id: product.id
          })))
          .catch(() => [])
      );

      const reviewsArrays = await Promise.all(reviewPromises);
      const allReviews = reviewsArrays.flat();

      // Sort by created_at (newest first)
      allReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setReviews(allReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      alert("Gagal memuat review");
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = [...reviews];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by rating
    if (filterRating !== "all") {
      filtered = filtered.filter(review => review.rating === parseInt(filterRating));
    }

    setFilteredReviews(filtered);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus review ini?")) return;

    try {
      const token = localStorage.getItem("token");
      await reviewService.deleteReviewByAdmin(reviewId, token);
      alert("Review berhasil dihapus");
      fetchAllReviews();
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Gagal menghapus review");
    }
  };

  const handleViewDetail = (review) => {
    setSelectedReview(review);
    setShowDetailModal(true);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-[#FFC633]" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Memuat review...</p>
      </div>
    );
  }

  const distribution = getRatingDistribution();
  const averageRating = getAverageRating();

  return (
    <div>
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#F0F0F0] p-6 rounded-lg">
          <p className="text-[#00000066] text-sm font-medium">Total Review</p>
          <p className="text-3xl font-bold mt-2">{reviews.length}</p>
        </div>
        <div className="bg-[#F0F0F0] p-6 rounded-lg">
          <p className="text-[#00000066] text-sm font-medium">Rating Rata-rata</p>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-3xl font-bold">{averageRating}</p>
            <div className="flex text-[#FFC633]">
              {renderStars(Math.round(parseFloat(averageRating)))}
            </div>
          </div>
        </div>
        <div className="bg-[#F0F0F0] p-6 rounded-lg">
          <p className="text-[#00000066] text-sm font-medium">Review 5 Bintang</p>
          <p className="text-3xl font-bold mt-2">{distribution[5]}</p>
          <p className="text-xs text-green-600 mt-2">
            {reviews.length > 0 ? ((distribution[5] / reviews.length) * 100).toFixed(0) : 0}% dari total
          </p>
        </div>
        <div className="bg-[#F0F0F0] p-6 rounded-lg">
          <p className="text-[#00000066] text-sm font-medium">Review Rendah (1-2★)</p>
          <p className="text-3xl font-bold mt-2">{distribution[1] + distribution[2]}</p>
          <p className="text-xs text-red-600 mt-2">Perlu perhatian</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari review berdasarkan user, produk, atau komentar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="all">Semua Rating</option>
            <option value="5">5 Bintang</option>
            <option value="4">4 Bintang</option>
            <option value="3">3 Bintang</option>
            <option value="2">2 Bintang</option>
            <option value="1">1 Bintang</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex text-[#FFC633]">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">{review.rating}/5</span>
                  </div>

                  <h4 className="font-bold text-lg mb-1">
                    {review.user?.username || "Anonymous"}
                  </h4>

                  <p className="text-sm text-gray-600 mb-2">
                    Produk: <span className="font-medium">{review.product_name}</span>
                  </p>

                  <p className="text-gray-700 mb-3 line-clamp-2">
                    "{review.comment}"
                  </p>

                  <p className="text-xs text-gray-500">
                    {formatDate(review.created_at)}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleViewDetail(review)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Lihat Detail"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus Review"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          {searchTerm || filterRating !== "all"
            ? "Tidak ada review yang sesuai dengan filter"
            : "Belum ada review"}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Detail Review</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Rating</label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-[#FFC633] text-2xl">
                    {renderStars(selectedReview.rating)}
                  </div>
                  <span className="font-bold text-xl">{selectedReview.rating}/5</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">User</label>
                <p className="text-lg font-bold mt-1">
                  {selectedReview.user?.username || "Anonymous"}
                </p>
                <p className="text-sm text-gray-500">{selectedReview.user?.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Produk</label>
                <p className="text-lg font-bold mt-1">{selectedReview.product_name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Komentar</label>
                <p className="text-gray-700 mt-1 bg-gray-50 p-4 rounded-lg">
                  "{selectedReview.comment}"
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Tanggal Dibuat</label>
                <p className="text-gray-700 mt-1">{formatDate(selectedReview.created_at)}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    handleDeleteReview(selectedReview.id);
                    setShowDetailModal(false);
                  }}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition"
                >
                  Hapus Review
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;