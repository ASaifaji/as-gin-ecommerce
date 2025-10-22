import { ArrowRight, ArrowLeft } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import reviewService from "@/lib/reviewService";

const TestimonialSection = () => {
  let sliderRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const reviewsPerPage = 12;

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getAllReviews(reviewsPerPage, 0);
      
      const fetchedReviews = response.reviews || [];
      setReviews(fetchedReviews.slice(0, 12)); // For slider
      setAllReviews(fetchedReviews);
      setTotalReviews(response.total || 0);
      setCurrentPage(0);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
      setAllReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreReviews = async () => {
    try {
      const offset = allReviews.length;
      const response = await reviewService.getAllReviews(reviewsPerPage, offset);

      const newReviews = response.reviews || [];
      setAllReviews(prev => [...prev, ...newReviews]);
      setCurrentPage(prev => prev + 1);
    } catch (err) {
      console.error("Error loading more reviews:", err);
    }
  };

  const next = () => {
    sliderRef.slickNext();
  };

  const previous = () => {
    sliderRef.slickPrev();
  };

  const settings = {
    dots: false,
    autoplay: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1290,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="py-12 px-20 max-md:px-5">
        <div className="text-center">
          <p className="text-gray-500">Memuat review...</p>
        </div>
      </section>
    );
  }

  if (reviews.length === 0 && !showAll) {
    return (
      <section className="py-12 px-20 max-md:px-5">
        <div className="text-center">
          <h4 className="text-[48px] max-md:text-[32px] font-bold uppercase mb-4">
            Produk Review Kami
          </h4>
          <p className="text-gray-500">Belum ada review untuk ditampilkan</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-20 max-md:px-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-[48px] max-md:text-[32px] font-bold uppercase">
            Produk Review Kami
          </h4>
          <p className="text-gray-600 mt-2">
            {totalReviews} review dari pelanggan kami
          </p>
        </div>
        {!showAll && reviews.length > 0 && (
          <div className="flex items-center gap-4">
            <button 
              onClick={previous}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft />
            </button>
            <button 
              onClick={next}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowRight />
            </button>
          </div>
        )}
      </div>

      {/* Toggle View Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
        >
          {showAll ? "Tampilkan Slider" : "Lihat Semua Review"}
        </button>
      </div>
      
      {/* Slider View */}
      {!showAll && reviews.length > 0 && (
        <div className="w-full mt-7">
          <Slider
            ref={(slider) => {
              sliderRef = slider;
            }}
            {...settings}
          >
            {reviews.map((review, index) => (
              <div key={review.id || index} className="px-2">
                <div className="border border-[#0000001A] rounded-[20px] py-[28px] px-[32px] h-full">
                  <div className="text-[#FFC633] flex items-center gap-1 text-lg">
                    {renderStars(review.rating)}
                  </div>
                  <div className="flex gap-2 items-center mt-4">
                    <h4 className="text-[20px] font-bold">
                      {review.user?.username || "Anonymous"}
                    </h4>
                    <FaCircleCheck className="text-[20px] text-[#01AB31]" />
                  </div>
                  <p className="text-base text-[#00000099] mt-3 line-clamp-4">
                    "{review.comment}"
                  </p>
                  {review.product && (
                    <Link 
                      to={`/productDetailAfterLog/${review.product.id}`}
                      className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                    >
                      {review.product.name}
                    </Link>
                  )}
                  <p className="text-sm text-[#00000066] mt-2">
                    {formatDate(review.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}

      {/* Grid View - All Reviews */}
      {showAll && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-7">
            {allReviews.map((review, index) => (
              <div 
                key={review.id || index} 
                className="border border-[#0000001A] rounded-[20px] py-[28px] px-[32px] hover:shadow-lg transition-shadow"
              >
                <div className="text-[#FFC633] flex items-center gap-1 text-lg">
                  {renderStars(review.rating)}
                </div>
                <div className="flex gap-2 items-center mt-4">
                  <h4 className="text-[20px] font-bold">
                    {review.user?.username || "Anonymous"}
                  </h4>
                  <FaCircleCheck className="text-[20px] text-[#01AB31]" />
                </div>
                <p className="text-base text-[#00000099] mt-3 line-clamp-4">
                  "{review.comment}"
                </p>
                {review.product && (
                  <Link 
                    to={`/productDetailAfterLog/${review.product.id}`}
                    className="text-sm text-blue-600 hover:underline mt-3 inline-block font-medium"
                  >
                    Produk: {review.product.name}
                  </Link>
                )}
                <p className="text-sm text-[#00000066] mt-2">
                  {formatDate(review.created_at)}
                </p>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {allReviews.length < totalReviews && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMoreReviews}
                className="px-8 py-3 border-2 border-black text-black rounded-full hover:bg-black hover:text-white transition-all font-medium"
              >
                Muat Lebih Banyak Review
              </button>
            </div>
          )}

          {/* Show total */}
          <div className="text-center mt-6 text-gray-600">
            Menampilkan {allReviews.length} dari {totalReviews} review
          </div>
        </div>
      )}
    </section>
  );
};

export default TestimonialSection;