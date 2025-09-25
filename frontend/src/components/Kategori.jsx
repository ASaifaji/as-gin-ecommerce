import React from "react";

const Kategori = () => {
  return (
    <section>
      <div className="bg-[#F0F0F0] mx-20 rounded-[40px] py-16 px-10 max-md:mx-5">
        <div>
          <h4 className="font-bold text-4xl uppercase text-center max-lg:text-[32px]">
            TELUSURI BERDASARKAN KATEGORI BARANG KESUKAAN ANDA
          </h4>
        </div>
        <div className="mt-10">
          <div className="flex items-center gap-6 mt-6 max-lg:flex-col">
            <figure className="relative w-[40%] h-[289px] max-lg:w-full bg-white rounded-[20px]">
              <img
                src="/dressimg1.png"
                alt="dress image 1"
                className="rounded-[20px] w-full h-full object-cover"
              />
              <span className="text-4xl text-white font-bold  absolute top-5 left-7 [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">
                Makeup
              </span>
            </figure>
            <figure className="relative min-w-[60%] h-[289px] max-lg:w-full">
              <img
                src="/dressimg2.png"
                alt="dress image 2"
                className="rounded-[20px] w-full h-full object-cover"
              />
              <span className="text-4xl text-white font-bold absolute top-5 left-7 [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">
                Fashion
              </span>
            </figure>
          </div>
          <div className="flex items-center gap-6 mt-6 max-lg:flex-col">
            <figure className="relative min-w-[60%] h-[289px] max-lg:w-full">
              <img
                src="/dressimg3.png"
                alt="dress image 3"
                className="rounded-[20px] w-full h-full object-cover"
              />
              <span className="text-4xl text-white font-bold absolute top-5 left-7 [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">
                Gym
              </span>
            </figure>
            <figure className="relative md:min-w-[30%] xl:min-w-[38%] 2xl:min-w-[39%] h-[289px] max-lg:w-full bg-white rounded-[20px]">
              <img
                src="/dressimg4.png"
                alt="dress image 4"
                className="rounded-[20px] w-full h-full object-cover"
              />
              <span className="text-4xl text-white font-bold absolute top-5 left-7 [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">
                Furniture
              </span>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Kategori;
