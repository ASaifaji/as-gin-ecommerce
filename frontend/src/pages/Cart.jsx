import NewsletterSection from "@/components/NewsletterSection";
import { Minus } from "lucide-react";
import { Plus } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Trash2 } from "lucide-react";
import React from "react";
import { useState } from "react";
import { FaTag } from "react-icons/fa";
import { Link } from "react-router-dom";
const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Gradient Graphic T-shirt",
      price: 145,
      size: "Large",
      color: "White",
      quantity: 1,
    },
    {
      id: 2,
      name: "Gradient Graphic T-shirt",
      price: 145,
      size: "Large",
      color: "White",
      quantity: 1,
    },
    {
      id: 3,
      name: "Gradient Graphic T-shirt",
      price: 145,
      size: "Large",
      color: "White",
      quantity: 1,
    },
  ]);

  const handleIncrement = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };
  return (
    <>
      <section className="px-20 py-5 max-md:px-5">
        <div className="flex items-center gap-2 text-[#00000099] text-base">
          <Link to={`/`}>Home</Link>
          <span>/</span>
          <Link to={`#`} className="text-[#000000]">
            Cart
          </Link>
        </div>

        <div>
          <h4 className="uppercase text-[40px] max-sm:text-[32px] font-bold">
            Your cart
          </h4>
          <div className="flex justify-between gap-5 mt-5 max-lg:flex-col">
            <div className="border border-[#0000001A] rounded-[20px] py-[20px] px-[24px] w-[60%] max-lg:w-full">
              <ul className="flex flex-col gap-[24px]">
                {cartItems.map((item) => (
                  <>
                    <li key={item.id}>
                      <div className="flex items-center gap-5">
                        <figure>
                          <img
                            src="/product1.png"
                            alt="product image"
                            className="w-[124px] h-[124px] object-cover rounded-lg"
                          />
                        </figure>
                        <div className="w-full">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xl max-sm:text-sm font-bold">
                              {item.name}
                            </h4>
                            <button className="bg-[#FF3333] text-white p-1 rounded">
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <div className="text-sm text-[#00000099] flex flex-col gap-1 max-sm:text-xs">
                            <span>Size: {item.size}</span>
                            <span>Color: {item.color}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl max-sm:text-xl font-bold">
                              ${item.price}
                            </span>
                            <div className="flex items-center gap-4 rounded-full py-[12px] px-[20px] w-fit bg-[#F0F0F0]">
                              <button onClick={() => handleDecrement(item.id)}>
                                <Minus size={16} />
                              </button>
                              <span className="text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button onClick={() => handleIncrement(item.id)}>
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    {item.id < cartItems.length && <hr />}
                  </>
                ))}
              </ul>
            </div>
            <div className="border border-[#0000001A] rounded-[20px] py-[20px] px-[24px] w-[40%] flex flex-col gap-[24px] max-lg:w-full">
              <h4 className="text-2xl max-sm:text-xl font-bold">
                Order Summary
              </h4>
              <ul className="flex flex-col gap-5 text-xl max-sm:text-base">
                <li className="flex items-center justify-between">
                  <span className="text-[#00000099]">Subtotal</span>
                  <span className="font-bold">$565</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-[#00000099]">Discount (-20%)</span>
                  <span className="text-[#FF3333] font-bold">-$113</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-[#00000099]">Delivery Fee</span>
                  <span className="font-bold">$15</span>
                </li>
                <hr />
                <li className="flex items-center justify-between">
                  <span>Total</span>
                  <span className="text-2xl max-sm:text-xl font-bold">
                    $467
                  </span>
                </li>
              </ul>

              <div className="flex items-center gap-2 w-full">
                <div className="py-[12px] px-[16px] bg-[#F0F0F0] rounded-full flex items-center gap-[12px] text-[#00000066] w-full">
                  <FaTag size={20} />
                  <input
                    type="text"
                    name="promocode"
                    id="promocode"
                    className="bg-transparent w-full outline-none max-sm:text-sm"
                    placeholder="Add a Promocode"
                  />
                </div>
                <button className="bg-black py-[12px] px-[16px] text-white font-medium text-base rounded-full hover:bg-neutral-700 transition-all max-sm:text-sm ease-in-out duration-200">
                  Apply
                </button>
              </div>
              <button className="flex items-center gap-2 py-[16px] px-[54px] rounded-full bg-black text-white max-sm:text-sm justify-center hover:bg-neutral-700 transition-all ease-in-out duration-200">
                Go to Checkout <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>
      <NewsletterSection />
    </>
  );
};

export default Cart;
