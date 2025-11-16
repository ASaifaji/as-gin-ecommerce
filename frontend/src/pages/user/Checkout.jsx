import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, MapPin, CreditCard, Package, ChevronRight } from "lucide-react";
import api from "@/lib/api";

const Checkout = () => {
  const navigate = useNavigate();
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { id: 1, name: "Informasi Pengiriman", icon: MapPin },
    { id: 2, name: "Metode Pembayaran", icon: CreditCard },
    { id: 3, name: "Tinjau Pesanan", icon: Package },
  ];

  // Data state
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod] = useState("cod"); // COD only
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Shipping methods
  const shippingMethods = [
    { id: "standard", name: "Pengiriman Standard", price: 10000, estimate: "3-5 hari kerja" },
    { id: "express", name: "Pengiriman Express", price: 25000, estimate: "1-2 hari kerja" },
    { id: "free", name: "Pengiriman Gratis", price: 0, estimate: "7-10 hari kerja" },
  ];

  // Fetch cart and addresses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch cart
        const cartResponse = await api.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(cartResponse.data.cart);

        // Fetch user profile with addresses
        const profileResponse = await api.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const userAddresses = profileResponse.data.user.addresses || [];
        setAddresses(userAddresses);
        
        // Set default address if available
        if (userAddresses.length > 0) {
          setSelectedAddress(userAddresses[0]);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateSubtotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getShippingCost = () => {
    const method = shippingMethods.find((m) => m.id === shippingMethod);
    return method ? method.price : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + getShippingCost();
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedAddress) {
        alert("Silakan pilih alamat pengiriman");
        return;
      }
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmitOrder = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      if (!selectedAddress) {
        alert("Silakan pilih alamat pengiriman");
        return;
      }

      if (!cart?.items || cart.items.length === 0) {
        alert("Keranjang Anda kosong");
        navigate("/cart");
        return;
      }

      // Submit order to backend
      const orderData = {
        address_id: selectedAddress.id,
        shipping_method: shippingMethod,
        payment_method: paymentMethod,
        shipping_cost: getShippingCost(),
        total: calculateTotal(),
      };

      const response = await api.post("/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Success
      alert("Pesanan berhasil dibuat!");
      
      // Clear cart (optional - backend should handle this)
      await api.delete("/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Redirect to orders page
      navigate("/orders");
      
    } catch (err) {
      console.error("Error creating order:", err);
      alert(err.response?.data?.error || "Gagal membuat pesanan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Memuat data checkout...</p>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Keranjang Anda kosong</p>
          <button
            onClick={() => navigate("/productsAfterLogin")}
            className="bg-black text-white px-6 py-3 rounded-full"
          >
            Mulai Belanja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5 md:px-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-600">Selesaikan pesanan Anda</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-black text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {isCompleted ? <Check size={24} /> : <Icon size={24} />}
                  </div>
                  <p className={`text-sm text-center max-w-[100px] ${isActive ? "font-semibold" : ""}`}>
                    {step.name}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${isCompleted ? "bg-green-500" : "bg-gray-300"}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="flex gap-8 max-lg:flex-col">
        {/* Main Content */}
        <div className="flex-1">
          {/* Step 1: Shipping Information */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Informasi Pengiriman</h2>

              {addresses.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-4">Anda belum memiliki alamat tersimpan</p>
                  <button
                    onClick={() => navigate("/profile")}
                    className="bg-black text-white px-6 py-2 rounded-full"
                  >
                    Tambah Alamat
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => setSelectedAddress(address)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedAddress?.id === address.id
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin size={18} />
                            <h3 className="font-bold">{address.label || "Alamat"}</h3>
                          </div>
                          <p className="text-gray-700">{address.street}</p>
                          <p className="text-gray-600">
                            {address.city}, {address.province} {address.postal}
                          </p>
                          <p className="text-gray-600">{address.country}</p>
                        </div>
                        {selectedAddress?.id === address.id && (
                          <div className="bg-black text-white rounded-full p-1">
                            <Check size={18} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {addresses.length > 0 && (
                <button
                  onClick={() => navigate("/profile")}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  + Tambah alamat baru
                </button>
              )}
            </div>
          )}

          {/* Step 2: Payment Method */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Shipping Method */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Metode Pengiriman</h2>
                <div className="space-y-4">
                  {shippingMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setShippingMethod(method.id)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        shippingMethod === method.id
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.estimate}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-bold">
                            {method.price === 0 ? "GRATIS" : formatPrice(method.price)}
                          </p>
                          {shippingMethod === method.id && (
                            <div className="bg-black text-white rounded-full p-1">
                              <Check size={18} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Metode Pembayaran</h2>
                <div className="border-2 border-black rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard size={24} />
                      <div>
                        <h3 className="font-bold">Cash on Delivery (COD)</h3>
                        <p className="text-sm text-gray-600">Bayar saat barang diterima</p>
                      </div>
                    </div>
                    <div className="bg-black text-white rounded-full p-1">
                      <Check size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review Order */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Alamat Pengiriman</h2>
                {selectedAddress && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-bold mb-1">{selectedAddress.label}</p>
                    <p className="text-gray-700">{selectedAddress.street}</p>
                    <p className="text-gray-600">
                      {selectedAddress.city}, {selectedAddress.province} {selectedAddress.postal}
                    </p>
                    <p className="text-gray-600">{selectedAddress.country}</p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Produk yang Dipesan</h2>
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                      <img
                        src={item.product.image_url || "/product1.png"}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & Payment Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Informasi Pengiriman & Pembayaran</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Metode Pengiriman:</span>
                    <span className="font-medium">
                      {shippingMethods.find((m) => m.id === shippingMethod)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Metode Pembayaran:</span>
                    <span className="font-medium">Cash on Delivery (COD)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-6">
            {currentStep > 1 && (
              <button
                onClick={handlePrevStep}
                className="px-8 py-3 border-2 border-black rounded-full font-medium hover:bg-gray-50 transition-all"
              >
                Kembali
              </button>
            )}
            {currentStep < 3 ? (
              <button
                onClick={handleNextStep}
                disabled={currentStep === 1 && !selectedAddress}
                className="flex-1 px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-neutral-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Lanjutkan
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmitOrder}
                disabled={submitting}
                className="flex-1 px-8 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? "Memproses..." : "Buat Pesanan"}
              </button>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-5">
            <h3 className="text-xl font-bold mb-4">Ringkasan Pesanan</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.items.length} item)</span>
                <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Biaya Pengiriman</span>
                <span className="font-medium">
                  {getShippingCost() === 0 ? "GRATIS" : formatPrice(getShippingCost())}
                </span>
              </div>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <p className="text-blue-800">
                <strong>Pembayaran COD:</strong> Bayar saat barang tiba di alamat Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;