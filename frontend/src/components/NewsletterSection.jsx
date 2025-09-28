import { Mail } from "lucide-react";
import React from "react";

const NewsletterSection = () => {
  return (
    <section className="px-20 py-10 max-md:px-5">
      <div className="py-[36px] px-[64px] bg-black rounded-[20px] flex items-center justify-between gap-5 max-lg:flex-col max-sm:px-5">
        <div className="w-1/2 max-lg:w-full">
          <h4 className="text-[30px] max-md:text-[32px] max-md:leading-[40px] font-bold text-white">
            DAPATKAN UPDATE DENGAN PROMO DAN DISKON MENARIK
          </h4>
        </div>
        <div className="w-1/3 max-lg:w-full flex flex-col gap-[14px]">
          <div className="bg-white text-[#00000066] flex items-center gap-[12px] py-[12px] px-[16px] rounded-full ">
            <Mail size={20} />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email address"
              className="text-base outline-none w-full"
            />
          </div>
          <button className="py-[12px] px-[16px] rounded-full text-center text-base font-medium bg-white w-full">
            Subscribe to Newsletter
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
