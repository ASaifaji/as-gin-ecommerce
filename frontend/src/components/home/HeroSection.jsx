import React from "react";
import { ReactTyped } from "react-typed";

const HeroSection = () => {
  return (
    <section className="bg-[#F2F0F1] flex items-center justify-between px-5 md:px-20 max-xl:flex-col">
      <div className="w-1/2 flex flex-col gap-4 py-7 max-xl:w-11/12">
        <h1 className="text-[64px] font-extrabold leading-[64px] max-lg:text-[48px] max-sm:text-[36px] max-sm:leading-[34px]">
          TEMUKAN PAKAIAN YANG 
        </h1>
        <ReactTyped
        className="text-[64px] font-extrabold leading-[64px] max-lg:text-[48px] max-sm:text-[36px] max-sm:leading-[34px] xl:pb-10"
        strings={['SESUAI DENGAN ANDA', 'ANDA SUKA', 'ANDA INGINKAN']}
        typeSpeed={100}
        backSpeed={60}
        loop
        />

        <p className="text-base text-[#00000099]">
          Jelajahi berbagai macam koleksi pakaian kami yang dibuat dengan cermat, 
          yang dirancang untuk menonjolkan individualitas Anda dan memenuhi selera gaya Anda.
        </p>

        <button className="py-4 px-[52px] rounded-full text-base bg-black text-white hover:bg-white border-black border-2 hover:text-black transition-all ease-in-out duration-200 w-fit max-sm:w-full font-medium">
          Shop Now
        </button>

        <div className="flex items-center max-xl:justify-center gap-8 mt-5 flex-wrap">
          <div>
            <h4 className="text-[40px] font-bold max-sm:text-2xl">200+</h4>
            <span className="text-[#00000099] text-base">
              International Brands
            </span>
          </div>

          {/* verticle border line */}
          <div className="w-[1px] h-12 bg-[#0000001A]"></div>
          <div>
            <h4 className="text-[40px] font-bold max-sm:text-2xl">2,000+</h4>
            <span className="text-[#00000099] text-base">
              High-Quality Products
            </span>
          </div>
          <div className="w-[1px] h-12 bg-[#0000001A]"></div>
          <div>
            <h4 className="text-[40px] font-bold max-sm:text-2xl">30,000+</h4>
            <span className="text-[#00000099] text-base">Happy Customers</span>
          </div>
        </div>
      </div>

      {/* FOTO BESAR */}
      <div className="w-1/3 pt-8 relative max-xl:w-11/12 max-sm:pt-0 max-sm:mb-10">
        <figure>
          <img src="/hero.png" alt="hero image" className="w-full max-w-xl pl-10" />
        </figure>

        <img
          src="/star.png"
          alt="star image"
          className="absolute top-20 right-4 max-sm:top-5 w-20 max-sm:w-[76px]"
        />

        <img
          src="/star.png"
          alt="star image"
          className="absolute top-1/2 left-10 w-14 max-sm:left-3 max-sm:top-1/2"
        />
      </div>
    </section>
  );
};

export default HeroSection;
