import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Clock, Truck, CheckCircle, XCircle, Eye } from "lucide-react";
import api from "@/lib/api";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Gagal memuat pesanan");
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
        return <Clock className="text-yellow-500" size={20} />;
      case "Diproses":
        return <Package className="text-blue-500" size={20} />;
      case "Dikirim":
        return <Truck className="text-purple-500" size={20} />;
      case "Selesai":
        return <CheckCircle className="text-green-500" size={20} />;
      case "Dibatalkan":
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Menunggu Pembayaran":
        return "bg-yellow-100 text-yellow-800";
      case "Diproses":
        return "bg-blue-100 text-blue-800";
      case "Dikirim":
        return "bg-purple-100 text-purple-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      case "Dibatalkan":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Memuat pesanan...</div>
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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5 md:px-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Pesanan Saya</h1>
        <p className="text-gray-600">Kelola dan lacak pesanan Anda</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center">
          <Package size={64} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold mb-2">Belum Ada Pesanan</h3>
          <p className="text-gray-600 mb-6">Mulai belanja dan buat pesanan pertama Anda</p>
          <Link
            to="/productsAfterLogin"
            className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-neutral-700 transition-all"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold">Order #{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                </div>
                <Link
                  to={`/orders/${order.id}`}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-all"
                >
                  <Eye size={18} />
                  <span className="text-sm font-medium">Detail</span>
                </Link>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.items?.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={item.product?.image_url || "/product1.png"}
                      alt={item.product?.name || "Product"}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product?.name || "Product"}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <p className="text-sm text-gray-600">+{order.items.length - 3} produk lainnya</p>
                )}
              </div>

              {/* Order Footer */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className="text-sm text-gray-600">{order.status}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Pesanan</p>
                  <p className="text-xl font-bold">{formatPrice(order.total)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;