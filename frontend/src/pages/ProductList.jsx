import { Link } from "react-router-dom";
import React from "react";
import { SlidersVertical } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Range } from "react-range";
import { Check } from "lucide-react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import { ArrowRight } from "lucide-react";
import ReactPaginate from "react-paginate";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useEffect } from "react";
import { X } from "lucide-react";
const itemsPerPage = 9; // Adjust items per page
const ProductList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState([500, 1500]); // Default range

  const toggleDropdown = () => setIsOpen(!isOpen);

  const [isColorOpen, setIsColorOpen] = useState(false); // State to control dropdown visibility
  const [isSizeOpen, setIsSizeOpen] = useState(false); // State to control dropdown visibility
  const [isStyleOpen, setIsStyleOpen] = useState(false); // State to control dropdown visibility
  const [selectedColor, setSelectedColor] = useState(null); // State to store the selected color

  const [filterVisible, setFilterVisible] = useState(false);

  // List of colors for the dropdown
  const colors = [
    "#FF5733",
    "#33FF57",
    "#5733FF",
    "#F0F0F0",
    "#FF33A1",
    "#33D9FF",
    "#FFC300",
    "#DAF7A6",
    "#581845",
    "#FF1493",
  ];

  const sizes = [
    "XX-Small",
    "X-Small",
    "Small",
    "Medium",
    "Large",
    "X-Large",
    "XX-Large",
    "3X-Large",
    "4X_large",
  ];

  // Toggle dropdown visibility
  const toggleColorsDropdown = () => setIsColorOpen((prev) => !prev);
  const toggleSizesDropdown = () => setIsSizeOpen((prev) => !prev);
  const toggleStylesDropdown = () => setIsStyleOpen((prev) => !prev);

  const allProducts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // Example data
  const [currentPage, setCurrentPage] = useState(0);

  // Get the current page's products
  const offset = currentPage * itemsPerPage;
  const currentProducts = allProducts.slice(offset, offset + itemsPerPage);

  // Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Set initial screen width and update state on resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px is the 'lg' breakpoint
    };

    // Set the initial state
    handleResize();

    // Listen for window resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <section className="px-20 py-10 max-lg:px-5">
        <div className="flex items-center gap-2 text-[#00000099] text-base">
          <Link to={`/`}>Home</Link>
          <span>/</span>
          <Link to={`#`} className="text-[#000000]">
            Casual
          </Link>
        </div>
        <div className="flex ] justify-between gap-5 mt-5">
          <div
            className={`py-5 px-6 rounded-[20px] w-[25%] border border-[#0000001A] flex flex-col gap-6 max-lg:hidden `}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold">Filters</h4>
              <SlidersVertical size={20} className="text-[#00000066]" />
            </div>
            <hr />
            <div>
              <ul className="flex flex-col gap-5">
                <Link>
                  <li className="flex items-center justify-between text-[#00000099] text-base ">
                    T-Shirts
                    <ChevronRight size={18} />
                  </li>
                </Link>
                <Link>
                  <li className="flex items-center justify-between text-[#00000099] text-base ">
                    Shorts
                    <ChevronRight size={18} />
                  </li>
                </Link>
                <Link>
                  <li className="flex items-center justify-between text-[#00000099] text-base ">
                    Shirts
                    <ChevronRight size={18} />
                  </li>
                </Link>
                <Link>
                  <li className="flex items-center justify-between text-[#00000099] text-base ">
                    Hoodies
                    <ChevronRight size={18} />
                  </li>
                </Link>
                <Link>
                  <li className="flex items-center justify-between text-[#00000099] text-base ">
                    Jeans
                    <ChevronRight size={18} />
                  </li>
                </Link>
              </ul>
            </div>
            <hr />
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-between w-full"
              >
                <span className="text-gray-700 font-semibold">Harga</span>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {/* Dropdown */}
              <div
                className={`  transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "max-h-96 opacity-100 scale-100 visible py-5"
                    : "max-h-0 opacity-0 scale-95 invisible"
                } `}
              >
                {/* Price Range Selector */}
                <div className="mx-auto">
                  <Range
                    step={10}
                    min={0}
                    max={2000}
                    values={values}
                    onChange={(values) => setValues(values)}
                    renderTrack={({ props, children }) => {
                      const [min, max] = values;
                      const leftPercentage = ((min - 0) / (2000 - 0)) * 100;
                      const rightPercentage = ((max - 0) / (2000 - 0)) * 100;

                      return (
                        <div
                          {...props}
                          className="relative h-1 w-full bg-gray-300 rounded-md"
                        >
                          {/* Black range bar between min and max */}
                          <div
                            className="absolute h-1 bg-black rounded-md"
                            style={{
                              left: `${leftPercentage}%`,
                              width: `${rightPercentage - leftPercentage}%`,
                            }}
                          ></div>
                          {children}
                        </div>
                      );
                    }}
                    renderThumb={({ props, index }) => (
                      <div {...props} className="relative">
                        {/* Thumb (Circle) */}
                        <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white"></div>

                        {/* Dynamic Price Label */}
                        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-black px-2 py-1 text-sm font-medium ">
                          Rp.{values[index]}
                        </span>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
            <hr />
            <div className="relative">
              {/* Filter Button */}
              <button
                onClick={toggleColorsDropdown}
                className="flex items-center justify-between w-full text-gray-700 font-semibold "
              >
                <span>Color</span>
                {isColorOpen ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              {/* Dropdown */}
              <div
                className={` transition-all duration-300 ease-in-out ${
                  isColorOpen
                    ? "max-h-96 opacity-100 scale-100 visible"
                    : "max-h-0 opacity-0 scale-95 invisible"
                } overflow-hidden`}
              >
                <div className="grid grid-cols-5 gap-[16px] bg-white p-1">
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
            </div>
            <hr />
            <div className="relative">
              {/* Filter Button */}
              <button
                onClick={toggleSizesDropdown}
                className="flex items-center justify-between w-full text-gray-700 font-semibold "
              >
                <span>Size</span>
                {isSizeOpen ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              {/* Dropdown */}
              <div
                className={`  transition-all duration-300 ease-in-out ${
                  isSizeOpen
                    ? "max-h-96 opacity-100 scale-100 visible mt-5"
                    : "max-h-0 opacity-0 scale-95 invisible"
                } overflow-hidden`}
              >
                <div className="flex flex-wrap gap-[8px] gap-y-[24px] bg-white p-1">
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
            </div>
            <hr />
            <div className="relative">
              {/* Filter Button */}
              <button
                onClick={toggleStylesDropdown}
                className="flex items-center justify-between w-full text-gray-700 font-semibold "
              >
                <span>Dress Styles</span>
                {isStyleOpen ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              {/* Dropdown */}
              <div
                className={`  transition-all duration-300 ease-in-out ${
                  isStyleOpen
                    ? "max-h-96 opacity-100 scale-100 visible mt-5"
                    : "max-h-0 opacity-0 scale-95 invisible"
                } overflow-hidden`}
              >
                <div className="flex flex-wrap gap-[8px] gap-y-[24px] bg-white p-1">
                  <ul className="flex flex-col gap-5 w-full">
                    <Link>
                      <li className="flex items-center justify-between text-[#00000099] text-base ">
                        Casual
                        <ChevronRight size={18} />
                      </li>
                    </Link>
                    <Link>
                      <li className="flex items-center justify-between text-[#00000099] text-base ">
                        Formal
                        <ChevronRight size={18} />
                      </li>
                    </Link>
                    <Link>
                      <li className="flex items-center justify-between text-[#00000099] text-base ">
                        Party
                        <ChevronRight size={18} />
                      </li>
                    </Link>
                    <Link>
                      <li className="flex items-center justify-between text-[#00000099] text-base ">
                        Gym
                        <ChevronRight size={18} />
                      </li>
                    </Link>
                  </ul>
                </div>
              </div>
            </div>
            <button className="bg-black text-white text-sm font-medium py-[16px] px-[54px] rounded-full hover:bg-neutral-700 transition-all ease-in-out duration-200">
              Terapkan Filter
            </button>
          </div>
          <div className="w-[75%] max-lg:w-full">
            <div className="flex justify-between items-center max-sm:flex-col max-sm:items-start">
              <h4 className="text-[32px]  font-bold max-sm:text-[24px]">
                Casual
              </h4>
              <div className="flex items-center gap-3 max-sm:justify-between max-sm:w-full">
                <p className="text-base max-sm:text-sm text-[#00000099]">
                  Menampilkan 1-10 dari 100 Produk
                </p>
                <div className="flex items-center gap-2 max-sm:hidden">
                  <span className="text-[#00000099]">Berdasarkan:</span>
                  <div className="flex items-center relative w-[100px]">
                    <select className="appearance-none w-full outline-none">
                      <option value="price">Harga</option>
                      <option value="rating">Rating</option>
                      <option value="name">Name</option>
                    </select>
                    <ChevronDown
                      className="absolute top-1/2 right-2 transform -translate-y-1/2"
                      size={16}
                    />
                  </div>
                </div>
                {isMobile && (
                  <Drawer open={filterVisible} onOpenChange={setFilterVisible}>
                    <DrawerTrigger className="lg:hidden bg-[#f0f0f0] py-[16px] px-[20px] rounded-full">
                      <SlidersVertical size={20} />
                    </DrawerTrigger>

                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerDescription>
                          <div className="  rounded-[20px] w-full  flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xl font-bold">Filters</h4>
                              <DrawerClose>
                                <X size={20} />
                              </DrawerClose>
                            </div>
                            <hr />
                            <div>
                              <ul className="flex flex-col gap-5">
                                <Link>
                                  <li className="flex items-center justify-between text-[#00000099] text-base ">
                                    T-Shirts
                                    <ChevronRight size={18} />
                                  </li>
                                </Link>
                                <Link>
                                  <li className="flex items-center justify-between text-[#00000099] text-base ">
                                    Shorts
                                    <ChevronRight size={18} />
                                  </li>
                                </Link>
                                <Link>
                                  <li className="flex items-center justify-between text-[#00000099] text-base ">
                                    Shirts
                                    <ChevronRight size={18} />
                                  </li>
                                </Link>
                                <Link>
                                  <li className="flex items-center justify-between text-[#00000099] text-base ">
                                    Hoodies
                                    <ChevronRight size={18} />
                                  </li>
                                </Link>
                                <Link>
                                  <li className="flex items-center justify-between text-[#00000099] text-base ">
                                    Jeans
                                    <ChevronRight size={18} />
                                  </li>
                                </Link>
                              </ul>
                            </div>
                            <hr />

                            {/* Price Range Section */}
                            <div className="relative">
                              <button
                                onClick={toggleDropdown}
                                className="flex items-center justify-between w-full"
                              >
                                <span className="text-gray-700 font-semibold">
                                  Harga
                                </span>
                                {isOpen ? (
                                  <ChevronUp size={20} />
                                ) : (
                                  <ChevronDown size={20} />
                                )}
                              </button>

                              <div
                                className={`transition-all duration-300 ease-in-out ${
                                  isOpen
                                    ? "max-h-96 opacity-100 scale-100 visible py-5 mt-2"
                                    : "max-h-0 opacity-0 scale-95 invisible"
                                }`}
                              >
                                <div className="mx-auto">
                                  <Range
                                    step={10}
                                    min={0}
                                    max={2000}
                                    values={values}
                                    onChange={(values) => setValues(values)}
                                    renderTrack={({ props, children }) => {
                                      const [min, max] = values;
                                      const leftPercentage =
                                        ((min - 0) / (2000 - 0)) * 100;
                                      const rightPercentage =
                                        ((max - 0) / (2000 - 0)) * 100;

                                      return (
                                        <div
                                          {...props}
                                          className="relative h-1 w-full bg-gray-300 rounded-md"
                                        >
                                          <div
                                            className="absolute h-1 bg-black rounded-md"
                                            style={{
                                              left: `${leftPercentage}%`,
                                              width: `${
                                                rightPercentage - leftPercentage
                                              }%`,
                                            }}
                                          ></div>
                                          {children}
                                        </div>
                                      );
                                    }}
                                    renderThumb={({ props, index }) => (
                                      <div {...props} className="relative">
                                        <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white"></div>
                                        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-black px-2 py-1 text-sm font-medium ">
                                          Rp.{values[index]}
                                        </span>
                                      </div>
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                            <hr />

                            {/* Color Filter Section */}
                            <div className="relative">
                              <button
                                onClick={toggleColorsDropdown}
                                className="flex items-center justify-between w-full text-gray-700 font-semibold"
                              >
                                <span>Color</span>
                                {isColorOpen ? (
                                  <ChevronUp size={20} />
                                ) : (
                                  <ChevronDown size={20} />
                                )}
                              </button>

                              <div
                                className={`transition-all duration-300 ease-in-out ${
                                  isColorOpen
                                    ? "max-h-96 opacity-100 scale-100 visible mt-2"
                                    : "max-h-0 opacity-0 scale-95 invisible"
                                } overflow-hidden`}
                              >
                                <div className="grid grid-cols-5 gap-[16px] bg-white p-1">
                                  {colors.map((color, index) => (
                                    <div
                                      key={index}
                                      onClick={() => setSelectedColor(color)}
                                      className="relative w-[37px] h-[37px] rounded-full cursor-pointer"
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
                            </div>
                            <hr />

                            {/* Size Filter Section */}
                            <div className="relative">
                              <button
                                onClick={toggleSizesDropdown}
                                className="flex items-center justify-between w-full text-gray-700 font-semibold"
                              >
                                <span>Size</span>
                                {isSizeOpen ? (
                                  <ChevronUp size={20} />
                                ) : (
                                  <ChevronDown size={20} />
                                )}
                              </button>

                              <div
                                className={`transition-all duration-300 ease-in-out ${
                                  isSizeOpen
                                    ? "max-h-96 opacity-100 scale-100 visible mt-2"
                                    : "max-h-0 opacity-0 scale-95 invisible"
                                }`}
                              >
                                <div className="flex flex-wrap gap-[8px] gap-y-[24px] bg-white p-1">
                                  {sizes.map((size, index) => (
                                    <label
                                      key={index}
                                      htmlFor={`size-${index}`}
                                    >
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
                                  ))}
                                </div>
                              </div>
                            </div>
                            <hr />

                            {/* Dress Styles Section */}
                            <div className="relative">
                              <button
                                onClick={toggleStylesDropdown}
                                className="flex items-center justify-between w-full text-gray-700 font-semibold"
                              >
                                <span>Dress Styles</span>
                                {isStyleOpen ? (
                                  <ChevronUp size={20} />
                                ) : (
                                  <ChevronDown size={20} />
                                )}
                              </button>

                              <div
                                className={`transition-all duration-300 ease-in-out ${
                                  isStyleOpen
                                    ? "max-h-96 opacity-100 scale-100 visible mt-2"
                                    : "max-h-0 opacity-0 scale-95 invisible"
                                }`}
                              >
                                <div className="flex flex-wrap gap-[8px] gap-y-[24px] bg-white p-1">
                                  <ul className="flex flex-col gap-5 w-full">
                                    <Link>
                                      <li className="flex items-center justify-between text-[#00000099] text-base ">
                                        Casual
                                        <ChevronRight size={18} />
                                      </li>
                                    </Link>
                                    <Link>
                                      <li className="flex items-center justify-between text-[#00000099] text-base ">
                                        Formal
                                        <ChevronRight size={18} />
                                      </li>
                                    </Link>
                                    <Link>
                                      <li className="flex items-center justify-between text-[#00000099] text-base ">
                                        Party
                                        <ChevronRight size={18} />
                                      </li>
                                    </Link>
                                    <Link>
                                      <li className="flex items-center justify-between text-[#00000099] text-base ">
                                        Gym
                                        <ChevronRight size={18} />
                                      </li>
                                    </Link>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <hr />

                            {/* Apply Filters Button */}
                            <button className="bg-black text-white text-sm font-medium py-[16px] px-[54px] rounded-full hover:bg-neutral-700 transition-all ease-in-out duration-200">
                              Apply Filters
                            </button>
                          </div>
                        </DrawerDescription>
                      </DrawerHeader>
                    </DrawerContent>
                  </Drawer>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-7 max-md:grid-cols-2 max-sm:grid-cols-1">
              {currentProducts.map((item) => (
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
            <hr className="my-8" />
            {/* Pagination */}
            <ReactPaginate
              previousLabel={
                <span className="flex items-center gap-2 text-sm">
                  <ArrowLeft size={18} />
                  Previous
                </span>
              }
              nextLabel={
                <span className="flex items-center gap-2 text-sm">
                  Next
                  <ArrowRight size={18} />
                </span>
              }
              breakLabel={"..."}
              pageCount={Math.ceil(allProducts.length / itemsPerPage)}
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName="flex items-center justify-center mt-6 space-x-2"
              pageClassName="px-4 py-2 text-[#00000080] cursor-pointer"
              pageLinkClassName="text-gray-600"
              activeClassName="bg-[#0000000F] text-white rounded-[8px]"
              previousClassName="border rounded-md px-3 py-2 cursor-pointer"
              nextClassName="border rounded-md px-3 py-2 cursor-pointer"
              disabledClassName="opacity-50 cursor-not-allowed"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductList;
