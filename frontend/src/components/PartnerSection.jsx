import React from "react";

const PartnerSection = () => {
  return (
    <section className="bg-black">
      <div className="flex items-center justify-between px-5 md:px-20 py-10 flex-wrap max-xl:gap-10 max-xl:justify-center ">
        <img
          src="/partner1.png"
          alt="partner1 image"
          className="max-xl:h-[24px] h-[34px]"
        />
        <img
          src="/partner2.png"
          alt="partner2 image"
          className="max-xl:h-[24px] h-[34px]"
        />
        <img
          src="/partner3.png"
          alt="partner3 image"
          className="max-xl:h-[24px] h-[34px]"
        />
        <img
          src="/partner4.png"
          alt="partner4 image"
          className="max-xl:h-[24px] h-[34px]"
        />
        <img
          src="/partner5.png"
          alt="partner5 image"
          className="max-xl:h-[24px] h-[34px]"
        />
      </div>
    </section>
  );
};

export default PartnerSection;
