import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, ShoppingBag, Bell, LogOut, Edit2, Camera, Package, Truck, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [userData, setUserData] = useState({
    id: '',
    username: '',
    email: '',
    phone: '',
    label: '',
    street: '',
    city: '',
    province: '',
    postal: '',
    country: '',
  });

  const [editData, setEditData] = useState({...userData});

  const API_BASE_URL = 'http://localhost:8080/api';

  // Fetch profile data
  useEffect(() => {
    fetchProfileData();
    fetchOrderHistory();
  }, []);

  const getPlaceholder = (value, placeholderText) => {
    return value && value.trim() !== '' ? '' : placeholderText;
  };

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      const user = data.user;

      const firstAddress = Array.isArray(user.addresses) && user.addresses.length > 0 
        ? user.addresses[0] 
        : {};

      const formattedData = {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone || '',
        label: firstAddress.label || '',
        street: firstAddress.street || '',
        city: firstAddress.city || '',
        province: firstAddress.province || '',
        postal: firstAddress.postal || '',
        country: firstAddress.country || '',
        avatar: `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff&size=200`
      };

      setUserData(formattedData);
      setEditData(formattedData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      const orders = Array.isArray(data.orders) ? data.orders : [];
      
      const formattedOrders = orders.map(order => ({
        id: order.id,
        orderNumber: `#ORD-${order.id}`,
        date: formatDate(order.created_at),
        total: order.total,
        status: order.status || 'Menunggu Pembayaran',
        items: order.items?.length || 0,
        itemsDetail: order.items || []
      }));

      setOrderHistory(formattedOrders);
      
      // Generate notifications from orders
      generateNotifications(formattedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrderHistory([]);
    }
  };

  const generateNotifications = (orders) => {
    const notifs = [];
    
    orders.forEach(order => {
      const baseNotif = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        date: order.date,
      };

      switch(order.status) {
        case 'Menunggu Pembayaran':
          notifs.push({
            ...baseNotif,
            id: `notif-${order.id}-pending`,
            type: 'order_placed',
            icon: Clock,
            iconColor: 'text-yellow-500',
            bgColor: 'bg-yellow-50',
            title: 'Pesanan Berhasil Dibuat',
            message: `Pesanan ${order.orderNumber} berhasil dibuat. Menunggu konfirmasi pembayaran COD.`,
            time: order.date,
            read: false
          });
          break;

        case 'Diproses':
          notifs.push({
            ...baseNotif,
            id: `notif-${order.id}-processing`,
            type: 'order_processing',
            icon: Package,
            iconColor: 'text-blue-500',
            bgColor: 'bg-blue-50',
            title: 'Pesanan Sedang Diproses',
            message: `Pesanan ${order.orderNumber} sedang diproses dan akan segera dikirim.`,
            time: order.date,
            read: false
          });
          break;

        case 'Dikirim':
          notifs.push({
            ...baseNotif,
            id: `notif-${order.id}-shipped`,
            type: 'order_shipped',
            icon: Truck,
            iconColor: 'text-purple-500',
            bgColor: 'bg-purple-50',
            title: 'Pesanan Dalam Pengiriman',
            message: `Pesanan ${order.orderNumber} sedang dalam perjalanan ke alamat Anda. Estimasi tiba 2-3 hari.`,
            time: order.date,
            read: false
          });
          break;

        case 'Selesai':
          notifs.push({
            ...baseNotif,
            id: `notif-${order.id}-delivered`,
            type: 'order_delivered',
            icon: CheckCircle,
            iconColor: 'text-green-500',
            bgColor: 'bg-green-50',
            title: 'Pesanan Telah Diterima',
            message: `Pesanan ${order.orderNumber} telah berhasil diterima. Terima kasih atas kepercayaan Anda!`,
            time: order.date,
            read: false
          });
          break;

        case 'Dibatalkan':
          notifs.push({
            ...baseNotif,
            id: `notif-${order.id}-cancelled`,
            type: 'order_cancelled',
            icon: XCircle,
            iconColor: 'text-red-500',
            bgColor: 'bg-red-50',
            title: 'Pesanan Dibatalkan',
            message: `Pesanan ${order.orderNumber} telah dibatalkan. Jika ada pertanyaan, hubungi customer service kami.`,
            time: order.date,
            read: false
          });
          break;

        default:
          break;
      }
    });

    // Sort by date (newest first)
    setNotifications(notifs.reverse());
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'Menunggu Pembayaran': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Diproses': 'bg-blue-100 text-blue-700 border-blue-300',
      'Dikirim': 'bg-purple-100 text-purple-700 border-purple-300',
      'Selesai': 'bg-green-100 text-green-700 border-green-300',
      'Dibatalkan': 'bg-red-100 text-red-700 border-red-300'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Menunggu Pembayaran':
        return <Clock className="text-yellow-500" size={20} />;
      case 'Diproses':
        return <Package className="text-blue-500" size={20} />;
      case 'Dikirim':
        return <Truck className="text-purple-500" size={20} />;
      case 'Selesai':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'Dibatalkan':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  const handleInputChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await fetchProfileData();
      setIsEditing(false);
      alert('Profile berhasil diperbarui!');
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error('Error updating profile:', err);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');

      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      localStorage.removeItem('token');
      window.location.href = '/login'; 
    }
  };

  const handleViewOrderDetail = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const markNotificationAsRead = (notifId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notifId ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f0f1] p-4 md:p-8 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f2f0f1] p-4 md:p-8 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f0f1] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative group">
              <img 
                src={userData.avatar} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
              />
              <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={18} />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{userData.username}</h1>
              <p className="text-gray-600 mb-1">{userData.email}</p>
              
              <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-600">Total Pesanan</p>
                  <p className="text-xl font-bold text-indigo-600">{orderHistory.length}</p>
                </div>
                <div className="bg-green-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-600">Selesai</p>
                  <p className="text-xl font-bold text-green-600">
                    {orderHistory.filter(o => o.status === 'Selesai').length}
                  </p>
                </div>
                <div className="bg-yellow-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-600">Dalam Proses</p>
                  <p className="text-xl font-bold text-yellow-600">
                    {orderHistory.filter(o => ['Menunggu Pembayaran', 'Diproses', 'Dikirim'].includes(o.status)).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'profile' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User size={20} />
                  <span className="font-medium">Profil Saya</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'orders' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ShoppingBag size={20} />
                  <span className="font-medium">Pesanan Saya</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                    activeTab === 'notifications' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Bell size={20} />
                  <span className="font-medium">Notifikasi</span>
                  {unreadCount > 0 && (
                    <span className="absolute right-3 top-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                <hr className="my-4" />
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Keluar</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Informasi Profil</h2>
                    <button
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Edit2 size={18} />
                      {isEditing ? 'Simpan' : 'Edit'}
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <input
                        type="text"
                        value={editData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline mr-2" size={16} />
                        Email
                      </label>
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline mr-2" size={16} />
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        placeholder={getPlaceholder(editData.phone, 'Masukkan nomor telepon')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <MapPin className="inline mr-2" size={16} />
                        Alamat
                      </label>

                      <input
                        type="text"
                        placeholder={getPlaceholder(editData.street, 'Jalan')}
                        value={editData.street || ''}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                        disabled={!isEditing}
                        className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input
                          type="text"
                          value={editData.city || ''}
                          placeholder={getPlaceholder(editData.city, 'Kota')}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          disabled={!isEditing}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                        />
                        <input
                          type="text"
                          placeholder={getPlaceholder(editData.province, 'Provinsi')}
                          value={editData.province}
                          onChange={(e) => handleInputChange('province', e.target.value)}
                          disabled={!isEditing}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder={getPlaceholder(editData.postal, 'Kode Pos')}
                          value={editData.postal}
                          onChange={(e) => handleInputChange('postal', e.target.value)}
                          disabled={!isEditing}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                        />
                        <input
                          type="text"
                          placeholder={getPlaceholder(editData.country, 'Negara')}
                          value={editData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          disabled={!isEditing}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Riwayat Pesanan</h2>
                  {orderHistory.length > 0 ? (
                    <div className="space-y-4">
                      {orderHistory.map((order) => (
                        <div key={order.id} className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-md transition-all">
                          <div className="flex flex-col gap-4">
                            {/* Order Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(order.status)}
                                <div>
                                  <span className="font-bold text-gray-900">{order.orderNumber}</span>
                                  <p className="text-sm text-gray-600">{order.date}</p>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>

                            {/* Order Items Preview */}
                            <div className="space-y-2">
                              {order.itemsDetail.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm">
                                  <img 
                                    src={item.product?.image_url || '/product1.png'}
                                    alt={item.product?.name}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{item.product?.name}</p>
                                    <p className="text-gray-600">Qty: {item.quantity}</p>
                                  </div>
                                  <p className="font-bold">{formatCurrency(item.price * item.quantity)}</p>
                                </div>
                              ))}
                              {order.items > 2 && (
                                <p className="text-sm text-gray-500 ml-15">+{order.items - 2} produk lainnya</p>
                              )}
                            </div>

                            {/* Order Footer */}
                            <div className="flex items-center justify-between pt-3 border-t">
                              <div>
                                <p className="text-sm text-gray-600">Total Pembayaran</p>
                                <p className="text-xl font-bold text-indigo-600">{formatCurrency(order.total)}</p>
                              </div>
                              <button 
                                onClick={() => handleViewOrderDetail(order.id)}
                                className="flex items-center gap-2 px-5 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                              >
                                <Eye size={18} />
                                Lihat Detail
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Package size={64} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">Belum ada pesanan.</p>
                      <button 
                        onClick={() => navigate('/productsAfterLogin')}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Mulai Belanja
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Notifikasi Pesanan</h2>
                    {unreadCount > 0 && (
                      <span className="text-sm text-gray-600">{unreadCount} belum dibaca</span>
                    )}
                  </div>

                  {notifications.length > 0 ? (
                    <div className="space-y-3">
                      {notifications.map((notif) => {
                        const IconComponent = notif.icon;
                        return (
                          <div 
                            key={notif.id}
                            onClick={() => {
                              markNotificationAsRead(notif.id);
                              handleViewOrderDetail(notif.orderId);
                            }}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                              notif.read ? 'bg-white border-gray-200' : `${notif.bgColor} border-gray-300`
                            }`}
                          >
                            <div className="flex gap-4">
                              <div className={`flex-shrink-0 ${notif.iconColor}`}>
                                <IconComponent size={24} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                  <h3 className="font-bold text-gray-900">{notif.title}</h3>
                                  {!notif.read && (
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{notif.message}</p>
                                <div className="flex items-center justify-between">
                                  <p className="text-xs text-gray-500">{notif.time}</p>
                                  <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                                    Lihat Detail →
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Bell size={64} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">Belum ada notifikasi.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;