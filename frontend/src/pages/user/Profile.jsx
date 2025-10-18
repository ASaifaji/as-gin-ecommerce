import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, ShoppingBag, Heart, CreditCard, Bell, LogOut, Edit2, Camera } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

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
      
      const decoded = jwtDecode(token);
      const response = await fetch(`${API_BASE_URL}/profile`,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(Response.status);
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
        phone: user.phone,
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
        id: order.order_number || `#ORD-${order.id}`,
        date: formatDate(order.created_at),
        total: formatCurrency(order.total_amount),
        status: order.status || 'Pending',
        items: order.order_items?.length || 0
      }));

      setOrderHistory(formattedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'shipped': 'bg-blue-100 text-blue-700',
      'delivered': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700'
    };
    return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-700';
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

      await fetchProfileData(); // ⬅️ refresh data dari server
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
              <p className="text-sm text-gray-500">Bergabung sejak {userData.createdAt}</p>
              
              <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-600">Total Pesanan</p>
                  <p className="text-xl font-bold text-indigo-600">{orderHistory.length}</p>
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
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'wishlist' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Heart size={20} />
                  <span className="font-medium">Wishlist</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'payment' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <CreditCard size={20} />
                  <span className="font-medium">Pembayaran</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'notifications' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Bell size={20} />
                  <span className="font-medium">Notifikasi</span>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <MapPin className="inline mr-2" size={16} />
                        Alamat
                      </label>

                      {/* Street */}
                      <input
                        type="text"
                        placeholder={getPlaceholder(editData.street, 'Jalan')}
                        value={editData.street || ''}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                        disabled={!isEditing}
                        className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                      />

                      {/* City & Province */}
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
                          placeholder={getPlaceholder(editData.province, 'Profinsi')}
                          value={editData.province}
                          onChange={(e) => handleInputChange('province', e.target.value)}
                          disabled={!isEditing}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                        />
                      </div>

                      {/* Postal & Country */}
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
                        <div key={order.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-semibold text-gray-900">{order.id}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{order.date} • {order.items} item</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className="text-lg font-bold text-indigo-600">{order.total}</p>
                              <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                                Detail
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Belum ada pesanan.</p>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Wishlist Saya</h2>
                  {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                          <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                            <p className="text-lg font-bold text-indigo-600 mb-3">{item.price}</p>
                            <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                              Tambah ke Keranjang
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Wishlist Anda kosong.</p>
                  )}
                </div>
              )}

              {/* Payment Tab */}
              {activeTab === 'payment' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Metode Pembayaran</h2>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-xl p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg"></div>
                        <div>
                          <p className="font-semibold text-gray-900">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-600">Berakhir 12/25</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Utama</span>
                    </div>
                    
                    <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-indigo-600 hover:text-indigo-600 transition-colors">
                      + Tambah Metode Pembayaran Baru
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Pengaturan Notifikasi</h2>
                  <div className="space-y-4">
                    {['Pesanan & Pengiriman', 'Promosi & Penawaran', 'Newsletter', 'Update Produk'].map((item) => (
                      <div key={item} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <span className="font-medium text-gray-900">{item}</span>
                        <label className="relative inline-block w-12 h-6">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 transition-colors"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                        </label>
                      </div>
                    ))}
                  </div>
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