import { ArrowRight } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useRef } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import Slider from "react-slick";
const TestimonialSection = () => {
  let sliderRef = useRef(null);

  const next = () => {
    sliderRef.slickNext();
  };
  const previous = () => {
    sliderRef.slickPrev();
  };
  const settings = {
    dots: false,
    // infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 3, // Adjust based on your preference
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
  return (
    <section className="py-12 px-20 max-md:px-5">
      <div className="flex items-center justify-between">
        <h4 className="text-[48px] max-md:text-[32px] font-bold uppercase">
          Produk review kami
        </h4>
        <div className="flex items-center gap-4">
          <button onClick={previous}>
            <ArrowLeft />
          </button>
          <button onClick={next}>
            <ArrowRight />
          </button>
        </div>
      </div>
      <div className="w-full  mt-7 space-x-4">
        <Slider
          ref={(slider) => {
            sliderRef = slider;
          }}
          {...settings}
        >
          {[1, 2, 3, 4, 5, 6].map((service, index) => (
            <div
              key={index}
              className={`  border border-[#0000001A] rounded-[20px] py-[28px] px-[32px]`}
              aria-labelledby={`service-title-${index}`}
            >
              <div className="text-[#FFC633] flex items-center gap-1 text-lg">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalfAlt />
              </div>
              <div className="flex gap-2 items-center mt-4">
                <h4 className="text-[20px] font-bold">Cipa.</h4>
                <FaCircleCheck className="text-[20] text-[#01AB31]" />
              </div>
              <p className="text-base text-[#00000099] mt-3">
                "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis non quaerat expedita omnis reiciendis temporibus laboriosam distinctio et dolores eum dolorum, 
                nihil provident quia iure. Nulla iure et dolorum saepe!”
              </p>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TestimonialSection;
