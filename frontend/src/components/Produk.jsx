import React from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
const Produk = () => {
  return (
    <section className="py-10 px-20 max-md:px-5 border-b border-[#0000001A]">
      <div>
        <h4 className="text-[48px] font-bold text-center uppercase max-sm:text-[32px]">
          Produk
        </h4>
      </div>
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-4 gap-4 mt-7 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {[1, 2, 3, 4].map((item) => (
            <div key={item}>
              <figure className="h-[298px] rounded-[20px] overflow-hidden">
                <img
                  src="/product1.png"
                  alt="product image 1"
                  className="h-full w-full object-cover"
                />
              </figure>
              <div className="mt-3 flex flex-col gap-1">
                <Link to={`/product/1`}>
                  <h4 className="text-xl font-bold">
                    Jahim Informatika
                  </h4>
                </Link>
                <div className="flex gap-1 items-center">
                  <div className="text-[#FFC633] flex items-center gap-1 text-lg">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStarHalfAlt />
                  </div>
                  <span>4.5/5</span>
                </div>
                <span className="text-2xl font-bold">RP.2jt</span>
              </div>
            </div>
          ))}
        </div>
        
        <button className="py-4 px-[54px] w-[218px] hover:bg-zinc-50 rounded-full border font-medium border-[#0000001A] self-center mt-9">
          <Link to={`/products`}>
          View All
          </Link>
        </button>
      </div>
    </section>
  );
};

export default Produk;
