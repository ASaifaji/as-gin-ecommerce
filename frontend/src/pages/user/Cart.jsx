import NewsletterSection from "@/components/NewsletterSection";
import { Minus, Plus, ArrowRight, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FaTag } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import NavbarCart from "@/components/produk/NavbarCart";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const navigate = useNavigate();

  // Fetch cart data from backend
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(response.data.cart);
      setError(null);
    } catch (err) {
      console.error("Error fetching cart:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError(err.response?.data?.error || "Gagal memuat keranjang");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = async (itemId) => {
    try {
      const item = cart.items.find((i) => i.id === itemId);
      const newQuantity = item.quantity + 1;

      const token = localStorage.getItem("token");
      await api.put(
        `/cart/${itemId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setCart((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.id === itemId ? { ...i, quantity: newQuantity } : i
        ),
      }));
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Gagal mengubah jumlah produk");
    }
  };

  const handleDecrement = async (itemId) => {
    try {
      const item = cart.items.find((i) => i.id === itemId);
      if (item.quantity <= 1) return;

      const newQuantity = item.quantity - 1;
      const token = localStorage.getItem("token");
      
      await api.put(
        `/cart/${itemId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setCart((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.id === itemId ? { ...i, quantity: newQuantity } : i
        ),
      }));
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Gagal mengubah jumlah produk");
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus item ini?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.id !== itemId),
      }));
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Gagal menghapus item dari keranjang");
    }
  };

  const calculateSubtotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const calculateShipping = () => {
    // Simple shipping calculation - bisa disesuaikan
    const subtotal = calculateSubtotal();
    if (subtotal === 0) return 0;
    if (subtotal > 100000) return 0; // Free shipping untuk pembelian > 100k
    return 10000;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  const handleApplyPromo = () => {
    // TODO: Implement promo code logic
    alert("Fitur kode promo akan segera tersedia");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Memuat keranjang...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const isEmpty = cartItems.length === 0;

  return (
    <>
      <NavbarCart />
      <section className="px-20 py-5 max-md:px-5">
        <div className="flex items-center gap-2 text-[#00000099] text-base">
          <Link to="/home">Home</Link>
          <span>/</span>
          <Link to="#" className="text-[#000000]">
            Keranjang
          </Link>
        </div>

        <div>
          <h4 className="uppercase text-[40px] max-sm:text-[32px] font-bold">
            KERANJANG SAYA
          </h4>

          {isEmpty ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-500 mb-4">
                Keranjang Anda kosong
              </p>
              <Link
                to="/products"
                className="inline-block px-8 py-3 bg-black text-white rounded-full hover:bg-neutral-700 transition-all"
              >
                Mulai Belanja
              </Link>
            </div>
          ) : (
            <div className="flex justify-between gap-5 mt-5 max-lg:flex-col">
              <div className="border border-[#0000001A] rounded-[20px] py-[20px] px-[24px] w-[60%] max-lg:w-full">
                <ul className="flex flex-col gap-[24px]">
                  {cartItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <li>
                        <div className="flex items-center gap-5">
                          <figure>
                            <img
                              src="/product1.png"
                              alt={item.product.name}
                              className="w-[124px] h-[124px] object-cover rounded-lg"
                            />
                          </figure>
                          <div className="w-full">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xl max-sm:text-sm font-bold">
                                {item.product.name}
                              </h4>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="bg-[#FF3333] text-white p-1 rounded hover:bg-red-700 transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            <div className="text-sm text-[#00000099] flex flex-col gap-1 max-sm:text-xs">
                              <span>Kategori: {item.product.category?.name || "N/A"}</span>
                              <span className="line-clamp-1">
                                {item.product.description}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-2xl max-sm:text-xl font-bold">
                                Rp.{formatPrice(item.product.price)}
                              </span>
                              <div className="flex items-center gap-4 rounded-full py-[12px] px-[20px] w-fit bg-[#F0F0F0]">
                                <button
                                  onClick={() => handleDecrement(item.id)}
                                  disabled={item.quantity <= 1}
                                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                                >
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
                      {index < cartItems.length - 1 && <hr />}
                    </React.Fragment>
                  ))}
                </ul>
              </div>

              <div className="border border-[#0000001A] rounded-[20px] py-[20px] px-[24px] w-[40%] flex flex-col gap-[24px] max-lg:w-full h-fit">
                <h4 className="text-2xl max-sm:text-xl font-bold">
                  Total Pesanan
                </h4>
                <ul className="flex flex-col gap-5 text-xl max-sm:text-base">
                  <li className="flex items-center justify-between">
                    <span className="text-[#00000099]">Subtotal</span>
                    <span className="font-bold">
                      Rp.{formatPrice(calculateSubtotal())}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-[#00000099]">Biaya Ongkir</span>
                    <span className="font-bold">
                      {calculateShipping() === 0
                        ? "GRATIS"
                        : `Rp.${formatPrice(calculateShipping())}`}
                    </span>
                  </li>
                  <hr />
                  <li className="flex items-center justify-between">
                    <span>Total</span>
                    <span className="text-2xl max-sm:text-xl font-bold">
                      Rp.{formatPrice(calculateTotal())}
                    </span>
                  </li>
                </ul>

                <div className="flex items-center gap-2 w-full">
                  <div className="py-[12px] px-[16px] bg-[#F0F0F0] rounded-full flex items-center gap-[12px] text-[#00000066] w-full">
                    <FaTag size={20} />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="bg-transparent w-full outline-none max-sm:text-sm"
                      placeholder="Tambahkan kode promo"
                    />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    className="bg-black py-[12px] px-[16px] text-white font-medium text-base rounded-full hover:bg-neutral-700 transition-all max-sm:text-sm ease-in-out duration-200"
                  >
                    Apply
                  </button>
                </div>
                <button
                  onClick={() => navigate("/checkout")}
                  className="flex items-center gap-2 py-[16px] px-[54px] rounded-full bg-black text-white max-sm:text-sm justify-center hover:bg-neutral-700 transition-all ease-in-out duration-200"
                >
                  Pergi ke Checkout <ArrowRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      <NewsletterSection />
    </>
  );
};

export default Cart;