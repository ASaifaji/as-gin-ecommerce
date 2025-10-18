import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { SlidersVertical, ChevronRight, ChevronUp, ChevronDown, Check, ArrowLeft, ArrowRight, X } from "lucide-react";
import { Range } from "react-range";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import productService from "@/lib/productService";
import categoryService from "@/lib/categoryService";
import NavbarProduct from "@/components/produk/NavbarProduct";

const itemsPerPage = 9;

const ProductListAfterLogin = () => {
  // State for filters
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState([0, 5000000]); // Price in rupiah (cents)
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  
  // State for data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  
  // Responsive
  const [isMobile, setIsMobile] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState("name");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAllProducts();
        setProducts(data.products || []);
        setError(null);
      } catch (err) {
        setError("Gagal memuat produk. Silakan coba lagi.");
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle functions
  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleColorsDropdown = () => setIsColorOpen((prev) => !prev);
  const toggleSizesDropdown = () => setIsSizeOpen((prev) => !prev);
  const toggleStylesDropdown = () => setIsStyleOpen((prev) => !prev);

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // Filter by category
      if (selectedCategory && product.category_id !== selectedCategory) {
        return false;
      }

      // Filter by price range
      const priceInRupiah = product.price / 100;
      if (priceInRupiah < values[0] || priceInRupiah > values[1]) {
        return false;
      }

      // ✅ Filter by search keyword
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery)) {
        return false;
      }

      // Filter by active status
      if (!product.is_active) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  // Pagination
  const offset = currentPage * itemsPerPage;
  const currentProducts = filteredProducts.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format price to Rupiah
  const formatPrice = (priceInCents) => {
    const rupiah = priceInCents / 100;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(rupiah);
  };

  // Render star rating (mock - you'd need to add rating to backend)
  const renderStars = () => (
    <div className="text-[#FFC633] flex items-center gap-1 text-lg">
      <FaStar />
      <FaStar />
      <FaStar />
      <FaStar />
      <FaStarHalfAlt />
    </div>
  );

  // Colors and sizes (these should come from backend in real app)
  const colors = ["#FF5733", "#33FF57", "#5733FF", "#F0F0F0", "#FF33A1", "#33D9FF", "#FFC300", "#DAF7A6", "#581845", "#FF1493"];
  const sizes = ["XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "3X-Large", "4X-Large"];

  // Filter component (reusable for desktop and mobile)
  const FilterContent = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold">Filters</h4>
        <SlidersVertical size={20} className="text-[#00000066]" />
      </div>
      <hr />
      
      {/* Categories */}
      <div>
        <ul className="flex flex-col gap-5">
          <li 
            onClick={() => setSelectedCategory(null)}
            className={`flex items-center justify-between text-base cursor-pointer ${!selectedCategory ? 'text-black font-semibold' : 'text-[#00000099]'}`}
          >
            Semua Kategori
            <ChevronRight size={18} />
          </li>
          {categories.map((category) => (
            <li
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center justify-between text-base cursor-pointer ${selectedCategory === category.id ? 'text-black font-semibold' : 'text-[#00000099]'}`}
            >
              {category.name}
              <ChevronRight size={18} />
            </li>
          ))}
        </ul>
      </div>
      <hr />
      
      {/* Price Range */}
      <div className="relative">
        <button onClick={toggleDropdown} className="flex items-center justify-between w-full">
          <span className="text-gray-700 font-semibold">Harga</span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        <div className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100 scale-100 visible py-5" : "max-h-0 opacity-0 scale-95 invisible"}`}>
          <div className="mx-auto">
            <Range
              step={100000}
              min={0}
              max={10000000}
              values={values}
              onChange={(values) => setValues(values)}
              renderTrack={({ props, children }) => {
                const [min, max] = values;
                const leftPercentage = ((min - 0) / (10000000 - 0)) * 100;
                const rightPercentage = ((max - 0) / (10000000 - 0)) * 100;
                return (
                  <div {...props} className="relative h-1 w-full bg-gray-300 rounded-md">
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
                  <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white"></div>
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-black px-2 py-1 text-sm font-medium whitespace-nowrap">
                    {formatPrice(values[index] * 100)}
                  </span>
                </div>
              )}
            />
          </div>
        </div>
      </div>
      <hr />
      
      <button 
        onClick={() => {
          setCurrentPage(0);
          if (isMobile) setFilterVisible(false);
        }}
        className="bg-black text-white text-sm font-medium py-[16px] px-[54px] rounded-full hover:bg-neutral-700 transition-all ease-in-out duration-200"
      >
        Terapkan Filter
      </button>
    </div>
  );

  if (loading) {
    return (
      <section className="px-20 py-10 max-lg:px-5">
        <div className="flex items-center justify-center h-64">
          <p className="text-xl">Memuat produk...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-20 py-10 max-lg:px-5">
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <>
    <NavbarProduct />
    
    <section className="px-20 py-10 max-lg:px-5">
      <div className="flex items-center gap-2 text-[#00000099] text-base">
        <Link to={`/`}>Home</Link>
        <span>/</span>
        <Link to={`#`} className="text-[#000000]">
          Produk
        </Link>
      </div>
      
      <div className="flex justify-between gap-5 mt-5">
        {/* Desktop Filter Sidebar */}
        <div className="py-5 px-6 rounded-[20px] w-[25%] border border-[#0000001A] max-lg:hidden">
          <FilterContent />
        </div>
        
        {/* Products Grid */}
        <div className="w-[75%] max-lg:w-full">
          <div className="flex justify-between items-center max-sm:flex-col max-sm:items-start">
            <h4 className="text-[32px] font-bold max-sm:text-[24px]">
              {selectedCategory 
                ? categories.find(c => c.id === selectedCategory)?.name 
                : "Semua Produk"}
            </h4>
            
            <div className="flex items-center gap-3 max-sm:justify-between max-sm:w-full">
              <p className="text-base max-sm:text-sm text-[#00000099]">
                Menampilkan {offset + 1}-{Math.min(offset + itemsPerPage, filteredProducts.length)} dari {filteredProducts.length} Produk
              </p>
              
              <div className="flex items-center gap-2 max-sm:hidden">
                <span className="text-[#00000099]">Urutkan:</span>
                <div className="flex items-center relative w-[120px]">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none w-full outline-none"
                  >
                    <option value="name">Nama</option>
                    <option value="price">Harga Terendah</option>
                    <option value="price_desc">Harga Tertinggi</option>
                  </select>
                  <ChevronDown className="absolute top-1/2 right-2 transform -translate-y-1/2" size={16} />
                </div>
              </div>
              
              {/* Mobile Filter Button */}
              {isMobile && (
                <Drawer open={filterVisible} onOpenChange={setFilterVisible}>
                  <DrawerTrigger className="lg:hidden bg-[#f0f0f0] py-[16px] px-[20px] rounded-full">
                    <SlidersVertical size={20} />
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerDescription>
                        <div className="px-4">
                          <FilterContent />
                        </div>
                      </DrawerDescription>
                    </DrawerHeader>
                  </DrawerContent>
                </Drawer>
              )}
            </div>
          </div>
          
          {/* Products Grid */}
          {currentProducts.length === 0 ? (
            <div className="flex items-center justify-center h-64 mt-7">
              <p className="text-xl text-gray-500">Tidak ada produk ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 mt-7 max-md:grid-cols-2 max-sm:grid-cols-1">
              {currentProducts.map((product) => (
                <div key={product.id}>
                  <figure className="h-[298px] rounded-[20px] overflow-hidden bg-gray-200">
                    <img
                      src={product.image_url || "/product1.png"}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </figure>
                  <div className="mt-3 flex flex-col gap-1">
                    <Link to={`/product/${product.id}`}>
                      <h4 className="text-xl font-bold hover:text-gray-600 transition-colors">
                        {product.name}
                      </h4>
                    </Link>
                    <div className="flex gap-1 items-center">
                      {renderStars()}
                      <span className="text-sm">4.5/5</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">
                        {formatPrice(product.price)}
                      </span>
                      {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                        <span className="text-xs text-orange-500">
                          Stok: {product.stock_quantity}
                        </span>
                      )}
                      {product.stock_quantity === 0 && (
                        <span className="text-xs text-red-500">Habis</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {pageCount > 1 && (
            <>
              <hr className="my-8" />
              <ReactPaginate
                previousLabel={
                  <span className="flex items-center gap-2 text-sm">
                    <ArrowLeft size={18} />
                    Sebelumnya
                  </span>
                }
                nextLabel={
                  <span className="flex items-center gap-2 text-sm">
                    Selanjutnya
                    <ArrowRight size={18} />
                  </span>
                }
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                forcePage={currentPage}
                containerClassName="flex items-center justify-center mt-6 space-x-2"
                pageClassName="px-4 py-2 text-[#00000080] cursor-pointer"
                pageLinkClassName="text-gray-600"
                activeClassName="bg-[#0000000F] text-white rounded-[8px]"
                previousClassName="border rounded-md px-3 py-2 cursor-pointer"
                nextClassName="border rounded-md px-3 py-2 cursor-pointer"
                disabledClassName="opacity-50 cursor-not-allowed"
              />
            </>
          )}
        </div>
      </div>
    </section>
    </>
  );
};

export default ProductListAfterLogin;