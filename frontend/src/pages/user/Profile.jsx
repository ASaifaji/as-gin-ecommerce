import React from 'react'
import { useState } from 'react';
import { User, MapPin, Phone, Mail, ShoppingBag, Heart, CreditCard, Bell, LogOut, Edit2, Camera } from 'lucide-react';


const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const [userData, setUserData] = useState({
    name: 'Rina Kusuma',
    email: 'rina.kusuma@email.com',
    phone: '+62 812-3456-7890',
    address: 'Jl. Pemuda No. 123, Semarang, Jawa Tengah 50132',
    joinDate: 'Bergabung sejak Januari 2023',
    avatar: 'https://ui-avatars.com/api/?name=Rina+Kusuma&background=6366f1&color=fff&size=200'
  });

  const orderHistory = [
    { id: '#ORD-2024-001', date: '15 Sep 2024', total: 'Rp 450.000', status: 'Dikirim', items: 3 },
    { id: '#ORD-2024-002', date: '08 Sep 2024', total: 'Rp 280.000', status: 'Selesai', items: 2 },
    { id: '#ORD-2024-003', date: '01 Sep 2024', total: 'Rp 650.000', status: 'Selesai', items: 5 },
  ];

  const wishlistItems = [
    { id: 1, name: 'Tas Kulit Premium', price: 'Rp 850.000', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop' },
    { id: 2, name: 'Sepatu Sneakers', price: 'Rp 1.200.000', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop' },
    { id: 3, name: 'Jam Tangan', price: 'Rp 2.500.000', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop' },
  ];

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{userData.name}</h1>
              <p className="text-gray-600 mb-1">{userData.email}</p>
              <p className="text-sm text-gray-500">{userData.joinDate}</p>
              
              <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-600">Total Pesanan</p>
                  <p className="text-xl font-bold text-indigo-600">24</p>
                </div>
                <div className="bg-pink-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-600">Wishlist</p>
                  <p className="text-xl font-bold text-pink-600">12</p>
                </div>
                <div className="bg-green-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-600">Poin</p>
                  <p className="text-xl font-bold text-green-600">1,250</p>
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
                
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all">
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                      <input
                        type="text"
                        value={userData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
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
                        value={userData.email}
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
                        value={userData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="inline mr-2" size={16} />
                        Alamat
                      </label>
                      <textarea
                        value={userData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Riwayat Pesanan</h2>
                  <div className="space-y-4">
                    {orderHistory.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-gray-900">{order.id}</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === 'Dikirim' 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
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
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Wishlist Saya</h2>
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

export default Profile