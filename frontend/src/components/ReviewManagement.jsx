import React, { useState } from "react";
import { Trash2, Check, X } from "lucide-react";

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      productName: "Kaos Premium",
      customerName: "Budi Santoso",
      rating: 5,
      comment: "Produk sangat bagus, kualitas terbaik, pengiriman cepat!",
      status: "pending",
      date: "2024-01-15",
    },
    {
      id: 2,
      productName: "Sepatu Olahraga",
      customerName: "Siti Nurhaliza",
      rating: 4,
      comment: "Nyaman dipakai, tapi harganya agak mahal.",
      status: "approved",
      date: "2024-01-14",
    },
    {
      id: 3,
      productName: "Kaos Premium",
      customerName: "Ahmad Wijaya",
      rating: 3,
      comment: "Warnanya tidak sesuai dengan gambar di website.",
      status: "pending",
      date: "2024-01-13",
    },
    {
      id: 4,
      productName: "Sepatu Olahraga",
      customerName: "Dewi Lestari",
      rating: 2,
      comment: "Produk rusak saat sampai, kecewa dengan kualitas.",
      status: "rejected",
      date: "2024-01-12",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState("all");

  const handleApproveReview = (id) => {
    setReviews(
      reviews.map((r) =>
        r.id === id ? { ...r, status: "approved" } : r
      )
    );
  };

  const handleRejectReview = (id) => {
    setReviews(
      reviews.map((r) =>
        r.id === id ? { ...r, status: "rejected" } : r
      )
    );
  };

  const handleDeleteReview = (id) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  const filteredReviews =
    filterStatus === "all"
      ? reviews
      : reviews.filter((r) => r.status === filterStatus);

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        label: "Menunggu",
      },
      approved: {
        bg: "bg-green-50",
        text: "text-green-700",
        label: "Disetujui",
      },
      rejected: {
        bg: "bg-red-50",
        text: "text-red-700",
        label: "Ditolak",
      },
    };
    return badges[status];
  };

  const getStarRating = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Review & Ulasan Pengguna</h2>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              filterStatus === "all"
                ? "bg-black text-white"
                : "bg-[#F0F0F0] hover:bg-[#e5e5e5]"
            }`}
          >
            Semua ({reviews.length})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              filterStatus === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
            }`}
          >
            Menunggu ({reviews.filter((r) => r.status === "pending").length})
          </button>
          <button
            onClick={() => setFilterStatus("approved")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              filterStatus === "approved"
                ? "bg-green-600 text-white"
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            Disetujui ({reviews.filter((r) => r.status === "approved").length})
          </button>
          <button
            onClick={() => setFilterStatus("rejected")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              filterStatus === "rejected"
                ? "bg-red-600 text-white"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            Ditolak ({reviews.filter((r) => r.status === "rejected").length})
          </button>
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => {
            const statusBadge = getStatusBadge(review.status);
            return (
              <div
                key={review.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 p-6"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {review.productName}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-[#00000066]">
                        Oleh: {review.customerName}
                      </span>
                      <span className="text-xs text-[#00000099]">
                        {review.date}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}
                  >
                    {statusBadge.label}
                  </span>
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl text-yellow-400">
                      {getStarRating(review.rating)}
                    </span>
                    <span className="text-sm text-[#00000066]">
                      {review.rating} dari 5
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div className="mb-4 p-3 bg-[#F0F0F0] rounded-lg">
                  <p className="text-sm text-[#00000099]">"{review.comment}"</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  {review.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApproveReview(review.id)}
                        className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Check size={18} />
                        Setujui
                      </button>
                      <button
                        onClick={() => handleRejectReview(review.id)}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <X size={18} />
                        Tolak
                      </button>
                    </>
                  )}

                  {(review.status === "approved" ||
                    review.status === "rejected") && (
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} />
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <p className="text-[#00000066] mb-2">Tidak ada review ditemukan</p>
            <p className="text-xs text-[#00000099]">
              Tidak ada review dengan status "{filterStatus}"
            </p>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#F0F0F0] p-4 rounded-lg">
          <p className="text-xs text-[#00000066] font-medium">Total Review</p>
          <p className="text-2xl font-bold mt-2">{reviews.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-700 font-medium">Menunggu Disetujui</p>
          <p className="text-2xl font-bold text-yellow-700 mt-2">
            {reviews.filter((r) => r.status === "pending").length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-xs text-green-700 font-medium">Disetujui</p>
          <p className="text-2xl font-bold text-green-700 mt-2">
            {reviews.filter((r) => r.status === "approved").length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-xs text-red-700 font-medium">Ditolak</p>
          <p className="text-2xl font-bold text-red-700 mt-2">
            {reviews.filter((r) => r.status === "rejected").length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewManagement;