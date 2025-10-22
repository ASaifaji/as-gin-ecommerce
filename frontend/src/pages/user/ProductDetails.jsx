import FAQItem from "@/components/FAQItem";
import NewsletterSection from "@/components/NewsletterSection";
import SimiliarProductSection from "@/components/SimiliarProductSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus, SlidersVertical, Ellipsis, ChevronDown, Check, Edit2, Trash2, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { Link, useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import api from "@/lib/api";
import reviewService from "@/lib/reviewService";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State for product data
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  
  // Review states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // State for product selection
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const productImages = ["/product2.png", "/product3.png", "/alan.png"];
  const colors = ["#FF5733", "#33FF57", "#5733FF"];
  const sizes = ["Small", "Medium", "Large", "X-Large"];

  const faqs = [
    {
      question: "Bagaimana kebijakan pengembalian?",
      answer: "Anda dapat mengembalikan produk dalam 30 hari sejak pembelian, dengan kondisi masih dalam keadaan asli dan kemasan.",
    },
    {
      question: "Apakah tersedia pengiriman internasional?",
      answer: "Ya, kami mengirim ke seluruh dunia. Biaya pengiriman dan waktu pengiriman tergantung lokasi Anda.",
    },
    {
      question: "Bagaimana cara melacak pesanan saya?",
      answer: "Setelah pesanan Anda dikirim, Anda akan menerima email dengan detail pelacakan.",
    },
    {
      question: "Apakah ada diskon untuk pembelian dalam jumlah besar?",
      answer: "Ya, kami menawarkan diskon khusus untuk pembelian dalam jumlah besar. Silakan hubungi tim dukungan kami untuk detail.",
    },
  ];

  // Get current user ID from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id);
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
  }, []);

  // Fetch product details and reviews
  useEffect(() => {
    if (id) {
      fetchProductDetail();
      fetchReviews();
    }
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.data);
      setSelectedImage(response.data.data.image_url || productImages[0]);
      setError(null);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Produk tidak ditemukan");
      if (err.response?.status === 404) {
        setTimeout(() => navigate("/productsAfterLogin"), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const reviewsData = await reviewService.getProductReviews(id);
      setReviews(reviewsData || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    }
  };

  const handleSubmitReview = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Silakan login untuk memberikan review");
        navigate("/login");
        return;
      }

      if (!reviewComment.trim()) {
        alert("Mohon isi komentar review");
        return;
      }

      setSubmittingReview(true);

      const reviewData = {
        rating: reviewRating,
        comment: reviewComment,
      };

      if (editingReview) {
        // Update existing review
        await reviewService.updateReview(editingReview.id, reviewData, token);
        alert("Review berhasil diupdate!");
      } else {
        // Create new review
        await reviewService.createReview(id, reviewData, token);
        alert("Review berhasil ditambahkan!");
      }

      // Reset form
      setShowReviewModal(false);
      setReviewRating(5);
      setReviewComment("");
      setEditingReview(null);

      // Refresh reviews
      fetchReviews();
    } catch (err) {
      console.error("Error submitting review:", err);
      if (err.response?.status === 409) {
        alert("Anda sudah memberikan review untuk produk ini. Anda dapat mengedit review Anda.");
      } else {
        alert(err.response?.data?.error || "Gagal menambahkan review");
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewRating(review.rating);
    setReviewComment(review.comment);
    setShowReviewModal(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus review ini?")) return;

    try {
      const token = localStorage.getItem("token");
      await reviewService.deleteReview(reviewId, token);
      alert("Review berhasil dihapus");
      fetchReviews();
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Gagal menghapus review");
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} />);
    }
    return stars;
  };

  const handleIncrement = () => {
    if (product && quantity < product.stock_quantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Silakan login terlebih dahulu");
        navigate("/login");
        return;
      }

      if (!product) return;

      if (product.stock_quantity === 0) {
        alert("Produk sedang habis stok");
        return;
      }

      if (quantity > product.stock_quantity) {
        alert(`Stok tidak mencukupi. Stok tersedia: ${product.stock_quantity}`);
        return;
      }

      setAddingToCart(true);

      await api.post(
        "/cart",
        {
          product_id: product.id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Produk berhasil ditambahkan ke keranjang!");
      
      const goToCart = confirm("Lihat keranjang sekarang?");
      if (goToCart) {
        navigate("/cart");
      } else {
        setQuantity(1);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      if (err.response?.status === 401) {
        alert("Sesi Anda telah berakhir. Silakan login kembali.");
        navigate("/login");
      } else {
        alert(err.response?.data?.error || "Gagal menambahkan produk ke keranjang");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <section className="px-20 py-10 max-md:px-5">
        <div className="flex items-center justify-center h-64">
          <p className="text-xl">Memuat detail produk...</p>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="px-20 py-10 max-md:px-5">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-xl text-red-500 mb-4">{error || "Produk tidak ditemukan"}</p>
            <Link to="/productsAfterLogin" className="text-blue-500 hover:underline">
              Kembali ke halaman produk
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const originalPrice = product.price * 1.25;
  const discount = originalPrice > product.price ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0;
  const averageRating = calculateAverageRating();
  const userHasReviewed = reviews.some(r => r.user_id === currentUserId);
  const userReview = reviews.find(r => r.user_id === currentUserId);

  return (
    <>
      <section className="px-20 py-5 max-md:px-5">
        <div className="flex items-center gap-2 text-[#00000099] text-base">
          <Link to="/home">Home</Link>
          <span>/</span>
          <Link to="/productsAfterLogin">Shop</Link>
          <span>/</span>
          <Link to="#" className="text-[#000000]">{product.name}</Link>
        </div>

        <div className="mt-7 flex gap-8 max-lg:flex-col">
          {/* Product Images */}
          <div className="flex gap-5 w-1/2 max-lg:flex-col-reverse max-lg:w-full">
            <div className="w-[25%] flex flex-col gap-3 max-lg:flex-row max-lg:w-full">
              {productImages.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  alt={`${product.name} - ${index + 1}`}
                  className={`w-full max-lg:w-1/2 h-full max-lg:h-[200px] max-sm:h-[127px] object-cover rounded-[20px] cursor-pointer ${
                    selectedImage === item ? "border-2 border-black" : ""
                  }`}
                  onClick={() => setSelectedImage(item)}
                />
              ))}
            </div>
            <div className="w-[75%] max-lg:w-full">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover rounded-[20px]"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="w-1/2 flex flex-col gap-3 max-lg:w-full">
            <h1 className="uppercase text-[40px] font-bold max-sm:text-2xl">
              {product.name}
            </h1>
            
            <div className="flex gap-2 items-center">
              <div className="text-[#FFC633] flex items-center gap-1 text-base">
                {renderStars(parseFloat(averageRating))}
              </div>
              <span className="text-base">{averageRating}/5</span>
              <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
            </div>

            <div className="flex items-center gap-3 text-[32px] max-sm:text-2xl font-bold">
              <span>{formatPrice(product.price)}</span>
              {discount > 0 && (
                <>
                  <span className="text-[#0000004D] line-through">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="py-[6px] px-[14px] rounded-full bg-[#FF33331A] text-[#FF3333] text-base max-sm:text-sm">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-base text-[#00000099] max-sm:text-sm">
              {product.description}
            </p>

            <div className="flex items-center gap-2">
              {product.stock_quantity > 0 ? (
                <>
                  <span className="text-green-600 font-semibold">Tersedia</span>
                  <span className="text-[#00000099]">(Stok: {product.stock_quantity})</span>
                </>
              ) : (
                <span className="text-red-600 font-semibold">Stok Habis</span>
              )}
            </div>

            <hr />

            {/* Colors */}
            <div>
              <h4 className="text-[#00000099] max-sm:text-sm">Pilih Warna</h4>
              <div className="flex items-center gap-[16px] bg-white p-1">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className="relative w-[37px] h-[37px] rounded-full cursor-pointer transition-all"
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && (
                      <Check className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" size={16} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <hr />

            {/* Sizes */}
            <div>
              <h4 className="text-[#00000099] max-sm:text-sm">Pilih Ukuran</h4>
              <div className="flex flex-wrap gap-[8px] gap-y-[24px] bg-white p-1 mt-2">
                {sizes.map((size, index) => (
                  <label key={index} htmlFor={`size-${index}`}>
                    <input
                      type="radio"
                      id={`size-${index}`}
                      name="size"
                      value={size}
                      checked={selectedSize === size}
                      onChange={() => setSelectedSize(size)}
                      className="hidden peer"
                    />
                    <span className="peer-checked:bg-black peer-checked:text-white text-sm text-[#00000099] bg-[#F0F0F0] py-[10px] px-[20px] rounded-full cursor-pointer transition-all duration-200">
                      {size}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="my-4" />

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-5">
              <div className="flex items-center justify-between gap-4 rounded-full py-[16px] px-[20px] bg-[#F0F0F0] w-[30%]">
                <button 
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus size={16} />
                </button>
                <span className="text-sm font-medium">{quantity}</span>
                <button 
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock_quantity}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock_quantity === 0}
                className="bg-black py-[12px] px-[16px] text-white font-medium text-base rounded-full hover:bg-neutral-700 transition-all max-sm:text-sm ease-in-out duration-200 w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {addingToCart ? "Menambahkan..." : product.stock_quantity === 0 ? "Stok Habis" : "Masukkan Keranjang"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <Tabs defaultValue="rating" className="w-full px-20 py-5 max-md:px-4">
        <TabsList className="w-full bg-transparent mb-3 pb-3 border-b-2 border-[#0000001A] flex items-center justify-between">
          <TabsTrigger value="details" className="text-xl max-sm:text-base font-normal text-[#00000099] data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:rounded-none pb-3 w-full">
            Detail Produk
          </TabsTrigger>
          <TabsTrigger value="rating" className="text-xl w-full max-sm:text-base font-normal text-[#00000099] data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:rounded-none pb-3">
            Rating & Reviews ({reviews.length})
          </TabsTrigger>
          <TabsTrigger value="faq" className="text-xl w-full max-sm:text-base font-normal text-[#00000099] data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:rounded-none pb-3">
            FAQs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="p-6 max-sm:px-0 space-y-6">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-black">{formatPrice(product.price)}</span>
              <span className={`text-sm font-medium ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <p className="text-gray-600">{product.description}</p>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Informasi Produk:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Kategori: {product.category?.name || "N/A"}</li>
                <li>Stok Tersedia: {product.stock_quantity} unit</li>
                <li>Status: {product.is_active ? "Aktif" : "Tidak Aktif"}</li>
                <li>Harga: {formatPrice(product.price)}</li>
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rating">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-2xl max-sm:text-xl font-bold">
                  Semua Review <span className="text-base font-normal max-sm:text-sm text-[#00000099]">({reviews.length})</span>
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-[#FFC633] flex items-center gap-1">
                    {renderStars(parseFloat(averageRating))}
                  </div>
                  <span className="font-bold">{averageRating}</span>
                  <span className="text-gray-500">dari {reviews.length} review</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (userHasReviewed) {
                    handleEditReview(userReview);
                  } else {
                    setShowReviewModal(true);
                  }
                }}
                className="bg-black text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 transition max-sm:text-xs"
              >
                {userHasReviewed ? "Edit Review Anda" : "Tulis Review"}
              </button>
            </div>

            {reviews.length > 0 ? (
              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5 mt-6">
                {reviews.map((review) => (
                  <div key={review.id} className="py-[28px] px-[32px] rounded-[20px] border border-[#0000001A] flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[#FFC633] flex items-center gap-1 text-lg">
                        {renderStars(review.rating)}
                      </div>
                      {review.user_id === currentUserId && (
                        <div className="flex gap-2">
                          <button onClick={() => handleEditReview(review)} className="text-blue-600 hover:text-blue-800">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDeleteReview(review.id)} className="text-red-600 hover:text-red-800">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 items-center">
                      <h4 className="text-[20px] font-bold">{review.user?.username || "User"}</h4>
                      <FaCircleCheck className="text-[20px] text-[#01AB31]" />
                    </div>
                    <p className="text-[#00000099]">"{review.comment}"</p>
                    <span className="text-[#00000099] text-sm">Posted on {formatDate(review.created_at)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">Belum ada review untuk produk ini</p>
                <button 
                  onClick={() => setShowReviewModal(true)}
                  className="bg-black text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 transition"
                >
                  Jadilah yang pertama memberikan review
                </button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="faq">
          <div className="p-6 max-sm:px-0 space-y-6">
            <h2 className="text-2xl font-bold">Pertanyaan yang Sering Diajukan</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">{editingReview ? "Edit Review" : "Tulis Review"}</h3>
              <button onClick={() => {
                setShowReviewModal(false);
                setEditingReview(null);
                setReviewRating(5);
                setReviewComment("");
              }} className="text-gray-500 hover:text-black">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="text-3xl transition-colors"
                    >
                      {star <= reviewRating ? (
                        <FaStar className="text-[#FFC633]" />
                      ) : (
                        <FaRegStar className="text-gray-300" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Komentar</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={5}
                  placeholder="Ceritakan pengalaman Anda dengan produk ini..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview || !reviewComment.trim()}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submittingReview ? "Mengirim..." : editingReview ? "Update Review" : "Kirim Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      <SimiliarProductSection categoryId={product.category_id} currentProductId={product.id} />
      <NewsletterSection />
    </>
  );
};

export default ProductDetails;