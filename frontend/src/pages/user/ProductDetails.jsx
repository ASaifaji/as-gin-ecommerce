import FAQItem from "@/components/FAQItem";
import NewsletterSection from "@/components/NewsletterSection";
import SimiliarProductSection from "@/components/SimiliarProductSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus, SlidersVertical, Ellipsis, ChevronDown, Check } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State for product data
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  
  // State for product selection
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Mock data for images, colors, and sizes (should come from backend in production)
  const productImages = ["/product2.png", "/product3.png", "/alan.png"];
  const colors = ["#FF5733", "#33FF57", "#5733FF"];
  const sizes = ["Small", "Medium", "Large", "X-Large"];

  const faqs = [
    {
      question: "Bagaimana kebijakan pengembalian?",
      answer: "Anda dapat mengembalikan produk dalam 30 hari sejak pembelian, dengan kondisi masih dalam keadaan asli dan kemasan.",
    },
    {
      question: "Apakah tersedia pengiriman internasional?",
      answer: "Ya, kami mengirim ke seluruh dunia. Biaya pengiriman dan waktu pengiriman tergantung lokasi Anda.",
    },
    {
      question: "Bagaimana cara melacak pesanan saya?",
      answer: "Setelah pesanan Anda dikirim, Anda akan menerima email dengan detail pelacakan.",
    },
    {
      question: "Apakah ada diskon untuk pembelian dalam jumlah besar?",
      answer: "Ya, kami menawarkan diskon khusus untuk pembelian dalam jumlah besar. Silakan hubungi tim dukungan kami untuk detail.",
    },
  ];

  // Fetch product details
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.data);
        setSelectedImage(response.data.data.image_url || productImages[0]);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Produk tidak ditemukan");
        if (err.response?.status === 404) {
          setTimeout(() => navigate("/products"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    }
  }, [id, navigate]);

  const handleIncrement = () => {
    if (product && quantity < product.stock_quantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Silakan login terlebih dahulu");
        navigate("/login");
        return;
      }

      if (!product) return;

      // Validasi stock
      if (product.stock_quantity === 0) {
        alert("Produk sedang habis stok");
        return;
      }

      if (quantity > product.stock_quantity) {
        alert(`Stok tidak mencukupi. Stok tersedia: ${product.stock_quantity}`);
        return;
      }

      setAddingToCart(true);

      const response = await api.post(
        "/cart",
        {
          product_id: product.id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Produk berhasil ditambahkan ke keranjang!");
      
      // Optional: Navigate to cart
      const goToCart = confirm("Lihat keranjang sekarang?");
      if (goToCart) {
        navigate("/cart");
      } else {
        // Reset quantity after adding
        setQuantity(1);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      if (err.response?.status === 401) {
        alert("Sesi Anda telah berakhir. Silakan login kembali.");
        navigate("/login");
      } else {
        alert(err.response?.data?.error || "Gagal menambahkan produk ke keranjang");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const calculateDiscount = (price, originalPrice) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  if (loading) {
    return (
      <section className="px-20 py-10 max-md:px-5">
        <div className="flex items-center justify-center h-64">
          <p className="text-xl">Memuat detail produk...</p>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="px-20 py-10 max-md:px-5">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-xl text-red-500 mb-4">{error || "Produk tidak ditemukan"}</p>
            <Link to="/products" className="text-blue-500 hover:underline">
              Kembali ke halaman produk
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Mock original price for discount calculation (should come from backend)
  const originalPrice = product.price * 1.25; // Assume 20% discount
  const discount = calculateDiscount(product.price, originalPrice);

  return (
    <>
      <section className="px-20 py-5 max-md:px-5">
        <div className="flex items-center gap-2 text-[#00000099] text-base">
          <Link to={`/`}>Home</Link>
          <span>/</span>
          <Link to={`/products`}>Shop</Link>
          <span>/</span>
          <Link to={`/products`}>{product.category?.name || "Produk"}</Link>
          <span>/</span>
          <Link to={`#`} className="text-[#000000]">
            {product.name}
          </Link>
        </div>

        <div className="mt-7 flex gap-8 max-lg:flex-col">
          <div className="flex gap-5 w-1/2 max-lg:flex-col-reverse max-lg:w-full">
            <div className="w-[25%] flex flex-col gap-3 max-lg:flex-row max-lg:w-full">
              {productImages.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  alt={`${product.name} - image ${index + 1}`}
                  className={`w-full max-lg:w-1/2 h-full max-lg:h-[200px] max-sm:h-[127px] object-cover rounded-[20px] cursor-pointer ${
                    selectedImage === item ? "border-2 border-black" : ""
                  }`}
                  onClick={() => setSelectedImage(item)}
                />
              ))}
            </div>
            <div className="w-[75%] max-lg:w-full">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover rounded-[20px]"
              />
            </div>
          </div>

          <div className="w-1/2 flex flex-col gap-3 max-lg:w-full">
            <h1 className="uppercase text-[40px] font-bold max-sm:text-2xl">
              {product.name}
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
              <span>{formatPrice(product.price)}</span>
              {discount > 0 && (
                <>
                  <span className="text-[#0000004D] line-through">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="py-[6px] px-[14px] rounded-full bg-[#FF33331A] text-[#FF3333] text-base max-sm:text-sm">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-base text-[#00000099] max-sm:text-sm">
              {product.description}
            </p>

            {/* Stock Information */}
            <div className="flex items-center gap-2">
              {product.stock_quantity > 0 ? (
                <>
                  <span className="text-green-600 font-semibold">Tersedia</span>
                  <span className="text-[#00000099]">
                    (Stok: {product.stock_quantity})
                  </span>
                </>
              ) : (
                <span className="text-red-600 font-semibold">Stok Habis</span>
              )}
            </div>

            <hr />

            {/* Colors */}
            <div>
              <h4 className="text-[#00000099] max-sm:text-sm">Pilih Warna</h4>
              <div className="flex items-center gap-[16px] bg-white p-1">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-[37px] h-[37px] rounded-full cursor-pointer transition-all duration-300 ease-in-out`}
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

            {/* Sizes */}
            <div>
              <h4 className="text-[#00000099] max-sm:text-sm">Pilih Ukuran</h4>
              <div className="flex flex-wrap gap-[8px] gap-y-[24px] bg-white p-1 mt-2">
                {sizes.map((size, index) => (
                  <label key={index} htmlFor={`size-${index}`}>
                    <input
                      type="radio"
                      id={`size-${index}`}
                      name="size"
                      value={size}
                      checked={selectedSize === size}
                      onChange={() => setSelectedSize(size)}
                      className="hidden peer"
                    />
                    <span className="peer-checked:bg-black peer-checked:text-white text-sm text-[#00000099] bg-[#F0F0F0] py-[10px] px-[20px] rounded-full cursor-pointer transition-all duration-200">
                      {size}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="my-4" />

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-5">
              <div className="flex items-center justify-between gap-4 rounded-full py-[16px] px-[20px] bg-[#F0F0F0] w-[30%]">
                <button 
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus size={16} />
                </button>
                <span className="text-sm font-medium">{quantity}</span>
                <button 
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock_quantity}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock_quantity === 0}
                className="bg-black py-[12px] px-[16px] text-white font-medium text-base rounded-full hover:bg-neutral-700 transition-all max-sm:text-sm ease-in-out duration-200 w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {addingToCart 
                  ? "Menambahkan..." 
                  : product.stock_quantity === 0 
                    ? "Stok Habis" 
                    : "Masukkan Keranjang"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
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
            <h2 className="text-2xl font-bold">{product.name}</h2>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-black">
                {formatPrice(product.price)}
              </span>
              <span className={`text-sm font-medium ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <p className="text-gray-600">{product.description}</p>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Informasi Produk:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Kategori: {product.category?.name || "N/A"}</li>
                <li>Stok Tersedia: {product.stock_quantity} unit</li>
                <li>Status: {product.is_active ? "Aktif" : "Tidak Aktif"}</li>
                <li>Harga: {formatPrice(product.price)}</li>
              </ul>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition disabled:bg-gray-400"
            >
              Masukkan Keranjang
            </button>
          </div>
        </TabsContent>

        <TabsContent value="rating">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl max-sm:text-xl font-bold">
                Semua Review{" "}
                <span className="text-base font-normal max-sm:text-sm text-[#00000099]">
                  (45)
                </span>
              </h4>
              <div className="flex gap-[10px] items-center w-1/2 justify-end">
                <button className="bg-[#f0f0f0] py-[16px] px-[20px] rounded-full">
                  <SlidersVertical size={20} />
                </button>
                <div className="flex items-center relative py-3 px-5 w-36 bg-[#F0F0F0] rounded-full max-sm:hidden">
                  <select className="appearance-none w-full outline-none bg-transparent">
                    <option value="price">Harga</option>
                    <option value="rating">Rating</option>
                    <option value="name">Nama</option>
                  </select>
                  <ChevronDown
                    className="absolute top-1/2 right-3 transform -translate-y-1/2"
                    size={16}
                  />
                </div>
                <button className="bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition w-fit max-sm:text-xs px-5">
                  Tulis Review
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
                    <h4 className="text-[20px] font-bold">User {item}</h4>
                    <FaCircleCheck className="text-[20] text-[#01AB31]" />
                  </div>
                  <p className="text-[#00000099]">
                    "Produk sangat bagus dan sesuai dengan deskripsi. Pengiriman cepat dan packaging rapi. Sangat merekomendasikan!"
                  </p>
                  <span className="text-[#00000099]">
                    Posted on August 14, 2023
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center mt-6">
              <button className="border border-[#0000001A] rounded-full py-[16px] px-[54px] text-base font-medium hover:bg-zinc-50 transition-all ease-in-out duration-200">
                Muat Review Lainnya
              </button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq">
          <div className="p-6 max-sm:px-0 space-y-6">
            <h2 className="text-2xl font-bold">Pertanyaan yang Sering Diajukan</h2>
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
      </Tabs>

      <SimiliarProductSection categoryId={product.category_id} currentProductId={product.id} />
      <NewsletterSection />
    </>
  );
};

export default ProductDetails;