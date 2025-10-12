import FAQItem from "@/components/FAQItem";
import NewsletterSection from "@/components/NewsletterSection";
import SimiliarProductSection from "@/components/SimiliarProductSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";
import { SlidersVertical } from "lucide-react";
import { Ellipsis } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Check } from "lucide-react";
import React from "react";
import { useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";
const ProductDetails = () => {
  const productImages = ["/product2.png", "/product3.png", "/alan.png"];

  const [selectedImage, setSelectedImage] = useState(productImages[0]);

  const [selectedColor, setSelectedColor] = useState(null); // State to store the selected color
  // List of colors for the dropdown
  const colors = ["#FF5733", "#33FF57", "#5733FF"];

  const sizes = ["Small", "Medium", "Large", "X-Large"];
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const faqs = [
    {
      question: "What is the return policy?",
      answer:
        "You can return the product within 30 days of purchase, provided it is in its original condition and packaging.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship worldwide. Shipping fees and delivery time depend on your location.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you will receive an email with the tracking details.",
    },
    {
      question: "Are there any discounts for bulk orders?",
      answer:
        "Yes, we offer special discounts on bulk purchases. Please contact our support team for details.",
    },
  ];
  return (
    <>
      <section className="px-20 py-5 max-md:px-5">
        <div className="flex items-center gap-2 text-[#00000099] text-base">
          <Link to={`/`}>Home</Link>
          <span>/</span>
          <Link to={`/products`}>Shop</Link>
          <span>/</span>
          <Link to={`/products`}>Men</Link>
          <span>/</span>
          <Link to={`#`} className="text-[#000000]">
            T-Shirts
          </Link>
        </div>

        <div className="mt-7 flex gap-8 max-lg:flex-col">
          <div className="flex gap-5 w-1/2 max-lg:flex-col-reverse max-lg:w-full">
            <div className="w-[25%] flex flex-col gap-3 max-lg:flex-row max-lg:w-full">
              {productImages.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  alt="product image"
                  className={`w-full max-lg:w-1/2 h-full max-lg:h-[200px] max-sm:h-[127px] object-cover rounded-[20px] cursor-pointer ${
                    selectedImage === item ? "border border-black" : ""
                  }`}
                  onClick={() => setSelectedImage(item)}
                />
              ))}
            </div>
            <div className="w-[75%] max-lg:w-full">
              <img
                src={selectedImage}
                alt="product2 image"
                className="w-full h-full object-cover rounded-[20px]"
              />
            </div>
          </div>
          <div className="w-1/2 flex flex-col gap-3 max-lg:w-full">
            <h1 className="uppercase text-[40px] font-bold max-sm:text-2xl">
              Barang yang anda mau
            </h1>
            <div className="flex gap-1 items-center">
              <div className="text-[#FFC633] flex items-center gap-1 text-base">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalfAlt />
              </div>
              <span className="text-base">4.5/5</span>
            </div>
            <div className="flex items-center gap-3 text-[32px] max-sm:text-2xl font-bold">
              <span>Rp.240.000,00</span>
              <span className="text-[#0000004D]">Rp.300.000,00</span>
              <span className="py-[6px] px-[14px] rounded-full bg-[#FF33331A] text-[#FF3333] text-base max-sm:text-sm">
                -20%
              </span>
            </div>
            <p className="text-base text-[#00000099] max-sm:text-sm">
              Deskripsi product. Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste repellat recusandae sint ea a neque libero unde accusantium repudiandae officiis voluptate reprehenderit esse incidunt in, rerum voluptates quam eos facilis.
            </p>
            <hr />
            <div>
              <h4 className="text-[#00000099] max-sm:text-sm">Select Colors</h4>
              <div className="flex items-center gap-[16px] bg-white p-1">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedColor(color)} // Update selected color on click
                    className={`relative w-[37px] h-[37px] rounded-full cursor-pointer transition-all duration-300 ease-in-out `}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && (
                      <Check
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
                        size={16}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <hr />
            <div>
              <h4 className="text-[#00000099] max-sm:text-sm">Choose Size</h4>
              <div className="flex flex-wrap gap-[8px] gap-y-[24px] bg-white p-1 mt-2">
                {sizes.map((size, index) => (
                  <>
                    <label key={index} htmlFor={`size-${index}`}>
                      <input
                        type="radio"
                        id={`size-${index}`}
                        name="size"
                        value={size}
                        className="hidden peer"
                      />
                      <span className="peer-checked:bg-black peer-checked:text-white text-sm text-[#00000099] bg-[#F0F0F0] py-[10px] px-[20px] rounded-full cursor-pointer transition-all duration-200">
                        {size}
                      </span>
                    </label>
                  </>
                ))}
              </div>
            </div>
            <hr className="my-4" />
            <div className="flex items-center gap-5">
              <div className="flex items-center justify-between gap-4 rounded-full py-[16px] px-[20px] bg-[#F0F0F0] w-[30%]">
                <button onClick={handleDecrement}>
                  <Minus size={16} />
                </button>
                <span className="text-sm font-medium">{quantity}</span>
                <button onClick={handleIncrement}>
                  <Plus size={16} />
                </button>
              </div>
              <button className="bg-black py-[12px] px-[16px] text-white font-medium text-base  rounded-full hover:bg-neutral-700 transition-all max-sm:text-sm ease-in-out duration-200 w-full">
                Masukan keranjang
              </button>
            </div>
          </div>
        </div>
      </section>
      <Tabs defaultValue="details" className="w-full px-20 py-5 max-md:px-4">
        <TabsList className="w-full bg-transparent mb-3 pb-3 border-b-2 border-[#0000001A] flex items-center justify-between">
          <TabsTrigger
            value="details"
            className="text-xl max-sm:text-base font-normal text-[#00000099] data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:rounded-none pb-3 w-full"
          >
            Detail Produk
          </TabsTrigger>
          <TabsTrigger
            value="rating"
            className="text-xl w-full max-sm:text-base font-normal text-[#00000099] data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:rounded-none pb-3"
          >
            Rating & Reviews
          </TabsTrigger>
          <TabsTrigger
            value="faq"
            className="text-xl w-full max-sm:text-base font-normal text-[#00000099] data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:rounded-none pb-3"
          >
            FAQs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <div className="p-6 max-sm:px-0 space-y-6">
            {/* Product Title */}
            <h2 className="text-2xl font-bold">Gradient Graphic T-shirt</h2>

            {/* Price and Availability */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-black">Rp.300.000,00</span>
              <span className="text-sm text-green-600 font-medium">
                In Stock
              </span>
            </div>

            {/* Product Description */}
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga ab laudantium quia, nam dicta culpa assumenda laborum quaerat voluptatem quas maiores minus necessitatibus reprehenderit inventore, eaque suscipit? Labore, incidunt suscipit..
            </p>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Fitur utama:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>100% Cotton Fabric</li>
                <li>Breathable & Soft Material</li>
                <li>Machine Washable</li>
                <li>Unisex Fit with Various Sizes</li>
              </ul>
            </div>

            {/* Size & Color Options */}
            <div className="flex flex-col space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Size yang tersedia:</h3>
                <div className="flex gap-3 mt-2">
                  <span className="px-3 py-1 border rounded-md">S</span>
                  <span className="px-3 py-1 border rounded-md">M</span>
                  <span className="px-3 py-1 border rounded-md">L</span>
                  <span className="px-3 py-1 border rounded-md">XL</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Available Colors:</h3>
                <div className="flex gap-3 mt-2">
                  <span className="w-6 h-6 rounded-full bg-black border"></span>
                  <span className="w-6 h-6 rounded-full bg-gray-400 border"></span>
                  <span className="w-6 h-6 rounded-full bg-blue-600 border"></span>
                </div>
              </div>
            </div>

            {/* Masukan keranjang Button */}
            <button className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition">
              Masukan keranjang
            </button>
          </div>
        </TabsContent>

        <TabsContent value="rating">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl max-sm:text-xl font-bold">
                All Reviews{" "}
                <span className="text-base font-normal max-sm:text-sm text-[#00000099]">
                  (45)
                </span>
              </h4>
              <div className="flex gap-[10px] items-center w-1/2 justify-end">
                <button className=" bg-[#f0f0f0] py-[16px] px-[20px] rounded-full">
                  <SlidersVertical size={20} />
                </button>
                <div className="flex items-center relative py-3 px-5 w-36 bg-[#F0F0F0] rounded-full max-sm:hidden">
                  <select className="appearance-none w-full outline-none bg-transparent">
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                    <option value="name">Name</option>
                  </select>
                  <ChevronDown
                    className="absolute top-1/2 right-3 transform -translate-y-1/2"
                    size={16}
                  />
                </div>
                <button className=" bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition w-fit max-sm:text-xs px-5">
                  Write a Review
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5 mt-6">
              {[1, 2, 3, 4, 5, 6].map((item, index) => (
                <div
                  key={index}
                  className="py-[28px] px-[32px] rounded-[20px] border border-[#0000001A] flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[#FFC633] flex items-center gap-1 text-lg">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStarHalfAlt />
                    </div>
                    <button className="text-[#00000066]">
                      <Ellipsis />
                    </button>
                  </div>
                  <div className="flex gap-2 items-center">
                    <h4 className="text-[20px] font-bold">Cipa.</h4>
                    <FaCircleCheck className="text-[20] text-[#01AB31]" />
                  </div>
                  <p className="text-[#00000099]">
                    "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                  </p>
                  <span className="text-[#00000099]">
                    Posted on August 14, 2023
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center mt-6">
              <button className="border border-[#0000001A] rounded-full py-[16px] px-[54px] text-base font-medium hover:bg-zinc-50 transition-all ease-in-out duration-200">
                Load More Reviews
              </button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="faq">
          <TabsContent value="faq">
            <div className="p-6 max-sm:px-0 space-y-6">
              {/* FAQ Title */}
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>

              {/* FAQ List */}
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          ;
        </TabsContent>
      </Tabs>
      <SimiliarProductSection />
      <NewsletterSection />
    </>
  );
};

export default ProductDetails;
