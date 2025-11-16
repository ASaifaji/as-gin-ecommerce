import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Package, Clock, Truck, CheckCircle, XCircle, MapPin, CreditCard, ArrowLeft } from "lucide-react";
import api from "@/lib/api";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get(`/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrder(response.data.order);
      setError(null);
    } catch (err) {
      console.error("Error fetching order detail:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else if (err.response?.status === 404) {
        setError("Pesanan tidak ditemukan");
      } else {
        setError("Gagal memuat detail pesanan");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Menunggu Pembayaran":
        return <Clock className="text-yellow-500" size={24} />;
      case "Diproses":
        return <Package className="text-blue-500" size={24} />;
      case "Dikirim":
        return <Truck className="text-purple-500" size={24} />;
      case "Selesai":
        return <CheckCircle className="text-green-500" size={24} />;
      case "Dibatalkan":
        return <XCircle className="text-red-500" size={24} />;
      default:
        return <Package className="text-gray-500" size={24} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Menunggu Pembayaran":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Diproses":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Dikirim":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Selesai":
        return "bg-green-100 text-green-800 border-green-300";
      case "Dibatalkan":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getOrderTimeline = (status) => {
    const timeline = [
      { status: "Menunggu Pembayaran", label: "Pesanan Dibuat" },
      { status: "Diproses", label: "Diproses" },
      { status: "Dikirim", label: "Dikirim" },
      { status: "Selesai", label: "Selesai" },
    ];

    const currentIndex = timeline.findIndex((item) => item.status === status);
    return timeline.map((item, index) => ({
      ...item,
      isActive: index <= currentIndex,
      isCurrent: item.status === status,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Memuat detail pesanan...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">{error || "Pesanan tidak ditemukan"}</p>
          <Link to="/orders" className="text-blue-500 hover:underline">
            Kembali ke Pesanan
          </Link>
        </div>
      </div>
    );
  }

  const timeline = getOrderTimeline(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5 md:px-20">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/orders"
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-4 w-fit"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Pesanan</span>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Detail Pesanan</h1>
            <p className="text-gray-600">Order #{order.id}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium border-2 ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Order Timeline - Only show if not cancelled */}
      {order.status !== "Dibatalkan" && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-6">Status Pesanan</h2>
          <div className="flex items-center justify-between relative">
            {timeline.map((item, index) => (
              <React.Fragment key={item.status}>
                <div className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      item.isActive ? "bg-black text-white" : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {item.isCurrent ? (
                      getStatusIcon(item.status)
                    ) : item.isActive ? (
                      <CheckCircle size={24} />
                    ) : (
                      <Package size={24} />
                    )}
                  </div>
                  <p className={`text-sm text-center max-w-[100px] ${item.isActive ? "font-semibold" : ""}`}>
                    {item.label}
                  </p>
                </div>
                {index < timeline.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${item.isActive ? "bg-black" : "bg-gray-300"}`}
                    style={{ marginTop: "-50px" }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Produk yang Dipesan</h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <img
                    src={item.product?.image_url || "/product1.png"}
                    alt={item.product?.name || "Product"}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold">{item.product?.name || "Product"}</h4>
                    <p className="text-sm text-gray-600">
                      {item.product?.description?.substring(0, 60)}...
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                    <p className="text-sm text-gray-600">{formatPrice(item.price)} / item</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Informasi Pesanan</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tanggal Pesanan:</span>
                <span className="font-medium">{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">{order.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Metode Pembayaran:</span>
                <span className="font-medium">Cash on Delivery (COD)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-5">
            <h3 className="text-xl font-bold mb-4">Ringkasan Pesanan</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">
                  {formatPrice(order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Biaya Pengiriman</span>
                <span className="font-medium">
                  {formatPrice(
                    order.total - (order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0)
                  )}
                </span>
              </div>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>

            {order.status === "Menunggu Pembayaran" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
                <p className="text-yellow-800">
                  <strong>Catatan:</strong> Pesanan Anda sedang menunggu pembayaran COD saat pengiriman.
                </p>
              </div>
            )}

            {order.status === "Dikirim" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="text-blue-800">
                  <strong>Info:</strong> Pesanan Anda sedang dalam pengiriman. Siapkan pembayaran COD.
                </p>
              </div>
            )}

            {order.status === "Selesai" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
                <p className="text-green-800">
                  <strong>Terima kasih!</strong> Pesanan Anda telah selesai.
                </p>
              </div>
            )}
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Informasi Pelanggan</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nama</p>
                <p className="font-medium">{order.user?.username || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{order.user?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Telepon</p>
                <p className="font-medium">{order.user?.phone || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;