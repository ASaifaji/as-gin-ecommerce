import { ArrowRight, ArrowLeft } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import Slider from "react-slick";
import api from "@/lib/api";

const TestimonialSection = () => {
  let sliderRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Fetch products first
      const productsResponse = await api.get("/products");
      const products = productsResponse.data.products || [];

      // Fetch reviews from multiple products (limit to first 5 products)
      const reviewPromises = products.slice(0, 5).map(product =>
        api.get(`/products/${product.id}/reviews`).catch(() => [])
      );

      const reviewsArrays = await Promise.all(reviewPromises);
      
      // Flatten and combine all reviews
      const allReviews = reviewsArrays.flat();
      
      // Sort by rating (highest first) and limit to 12
      const sortedReviews = allReviews
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 12);

      setReviews(sortedReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
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

  if (reviews.length === 0) {
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
      <div className="flex items-center justify-between">
        <h4 className="text-[48px] max-md:text-[32px] font-bold uppercase">
          Produk Review Kami
        </h4>
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
      </div>
      
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
                <p className="text-sm text-[#00000066] mt-4">
                  {formatDate(review.created_at)}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TestimonialSection;