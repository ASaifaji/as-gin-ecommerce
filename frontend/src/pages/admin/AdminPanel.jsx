import React, { useState } from "react";
import axios from "axios";
import AdminNavbar from "@/components/AdminNavbar";
import ProductManagement from "@/components/ProductManagement";
import CategoryManagement from "@/components/CategoryManagement";
import ReviewManagement from "@/components/ReviewManagement";
import {
  LayoutDashboard,
  Package,
  Layers,
  MessageSquare,
  ChevronRight,
  Trash2
} from "lucide-react";

const BASE_URL = 'http://localhost:5173';

const menu = [
  { label: "Dashboard", key: "dashboard", icon: LayoutDashboard },
  { label: "Manajemen Produk", key: "produk", icon: Package },
  { label: "Manajemen Kategori", key: "kategori", icon: Layers },
  { label: "Review & Ulasan", key: "review", icon: MessageSquare },
  { label: "Produk", key: "products", icon: Package },
  { label: "Pesanan", key: "orders", icon: Layers },
  { label: "Pengguna", key: "users", icon: MessageSquare },
];

const AdminPanel = () => {
  const [active, setActive] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

const [dashboardData, setDashboardData] = useState({
    total_checkout: '...',
    total_income: '...',
    total_products: '...',
    top_selling_products: [],
  });

const [loadingDashboard, setLoadingDashboard] = useState(true);
const [errorDashboard, setErrorDashboard] = useState(null);

const [transactions, setTransactions] = useState([]);
const [loadingTransactions, setLoadingTransactions] = useState(true);
const [errorTransactions, setErrorTransactions] = useState(null);

const getAdminToken = () => localStorage.getItem('adminToken');

const fetchDashboardData = async () => {
    setLoadingDashboard(true);
    setErrorDashboard(null);
    const adminToken = getAdminToken();

    if (!adminToken) {
      setErrorDashboard("Admin belum login. Mohon Login.");
      setLoadingDashboard(false);
      // PENTING: Lakukan redirect ke halaman login admin di sini!
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      setDashboardData(response.data);
    } catch (err) {
      console.error("Gagal fetch data dashboard:", err);
      setErrorDashboard(err.response?.data?.error || "Gagal mengambil data dashboard.");
    } finally {
      setLoadingDashboard(false);
    }
  };

  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    setErrorTransactions(null);
    const adminToken = getAdminToken();

    if (!adminToken) {
      setErrorTransactions("Admin belum login. Mohon Login.");
      setLoadingTransactions(false);
      // PENTING: Lakukan redirect ke halaman login admin di sini!
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/admin/transactions`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      setTransactions(response.data);
    } catch (err) {
      console.error("Gagal fetch transaksi:", err);
      setErrorTransactions(err.response?.data?.error || "Gagal mengambil data transaksi.");
    } finally {
      setLoadingTransactions(false);
    }
  };

const handleDeleteTransaction = async (id) => {
    const confirmDelete = window.confirm(`Yakin ingin menghapus transaksi ${id}?`);
    if (!confirmDelete) return;

    const adminToken = getAdminToken();
    if (!adminToken) {
      alert("Admin belum login.");
      return;
    }
    
    try {
      await axios.delete(`${BASE_URL}/api/admin/transactions/${id}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      alert(`Transaksi ${id} berhasil dihapus.`);
      // Refresh daftar transaksi setelah dihapus
      fetchTransactions(); 
    } catch (err) {
      console.error("Gagal menghapus transaksi:", err);
      alert(err.response?.data?.error || "Gagal menghapus transaksi.");
    }
  };

useEffect(() => {
    fetchDashboardData();
    fetchTransactions();
  }, [active]);  

const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

const handleMenuItemClick = (key) => {
    setActive(key);
    setMenuOpen(false);
  };

const formatRupiah = (amount) => {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-full w-64 bg-white shadow-md flex flex-col py-8 px-6 transition-transform duration-300 z-40 ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:translate-x-0`} 
      >
        <div className="mb-10 flex items-center gap-2">
          <span className="font-bold text-lg">info.mart</span>
        </div>

        <nav className="flex flex-col gap-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleMenuItemClick(item.key)}
                className={`flex items-center justify-between px-4 py-3 rounded transition-all group ${
                  isActive
                    ? "bg-black text-white font-semibold"
                    : "text-[#00000099] hover:bg-[#e5e5e5]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight
                  size={18}
                  className={`opacity-0 transition-all ${
                    isActive ? "opacity-100" : "group-hover:opacity-50"
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </aside>
      {/* Sidebar Overlay (Mobile) */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-10">
        <AdminNavbar onMenuToggle={handleMenuToggle} menuOpen={menuOpen} /> {/* Navbar di sini, sesuai mockup */}
        
        {/* Header Konten Utama */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {menu.find((m) => m.key === active)?.label}
            </h1>
            <p className="text-[#00000066] mt-2">
              Kelola dan pantau {menu.find((m) => m.key === active)?.label.toLowerCase()} di sini
            </p>
          </div>
          {/* Dropdown "All Time" */}
          <select className="bg-white border border-gray-300 rounded-md py-2 px-4">
            <option>All Time</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>

        {active === "dashboard" && (
          <section className="bg-white rounded-lg shadow p-6 md:p-8">
            {/* OVERVIEW STATS */}
            <h2 className="text-2xl font-semibold mb-6">Overview</h2>
            {loadingDashboard ? (
                <div className="text-center py-10 text-lg text-gray-500">
                    <LayoutDashboard className="mx-auto animate-spin" size={30} />
                    <p className="mt-3">Memuat data Dashboard...</p>
                </div>
            ) : errorDashboard ? (
                <div className="text-center py-10 text-red-600">
                    <p className="font-semibold">Gagal Memuat Overview:</p>
                    <p>{errorDashboard}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-[#F0F0F0] p-6 rounded-lg">
                        <p className="text-[#00000099] text-sm">Total CheckOut</p>
                        <p className="text-3xl font-bold mt-2">{dashboardData.total_checkout}</p>
                    </div>
                    <div className="bg-[#F0F0F0] p-6 rounded-lg">
                        <p className="text-[#00000099] text-sm">Pemasukan</p>
                        <p className="text-3xl font-bold mt-2">{formatRupiah(dashboardData.total_income)}</p>
                    </div>
                    <div className="bg-[#F0F0F0] p-6 rounded-lg">
                        <p className="text-[#00000099] text-sm">Jumlah Produk</p>
                        <p className="text-3xl font-bold mt-2">{dashboardData.total_products} Produk</p>
                    </div>
                </div>
            )}

            {/* TRANSAKSI PENGGUNA */}
            <h2 className="text-2xl font-semibold mb-6 mt-10">Transaksi Pengguna</h2>
            <p className="text-[#00000066] mb-4">Catatan transaksi terbaru</p>
            {loadingTransactions ? (
                <div className="text-center py-8 text-gray-500">
                    <p>Memuat Transaksi...</p>
                </div>
            ) : errorTransactions ? (
                <div className="text-center py-8 text-red-600">
                    <p className="font-semibold">Gagal Memuat Transaksi:</p>
                    <p>{errorTransactions}</p>
                </div>
            ) : transactions.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="py-3 px-4 text-left border-b">
                                  <input type="checkbox" className="form-checkbox" />
                                </th>
                                <th className="py-3 px-4 text-left border-b">ID Transaksi</th>
                                <th className="py-3 px-4 text-left border-b">Username</th>
                                <th className="py-3 px-4 text-left border-b">Total Harga</th>
                                <th className="py-3 px-4 text-left border-b">Status Transaksi</th>
                                <th className="py-3 px-4 text-left border-b">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t) => (
                                <tr key={t.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4"><input type="checkbox" className="form-checkbox" /></td>
                                    <td className="py-3 px-4">{t.id}</td>
                                    <td className="py-3 px-4">{t.username}</td>
                                    <td className="py-3 px-4">{formatRupiah(t.total_price)}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            t.status === "Selesai" ? "bg-green-100 text-green-700" :
                                            t.status === "Menunggu Pembayaran" ? "bg-yellow-100 text-yellow-700" :
                                            t.status === "Dikemas" ? "bg-blue-100 text-blue-700" :
                                            t.status === "Dikirim" ? "bg-purple-100 text-purple-700" :
                                            "bg-gray-100 text-gray-700"
                                        }`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                      <button 
                                        onClick={() => handleDeleteTransaction(t.id)} 
                                        className="text-red-600 hover:text-red-800"
                                        title="Hapus Transaksi"
                                      >
                                        <Trash2 size={18} />
                                      </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !loadingTransactions && <p className="text-center py-8 text-gray-500">Tidak ada transaksi terbaru.</p>
            )}

          </section>
        )}

        {/* Bagian Kanan: Produk Terlaris & Distribusi Kategori */}
        <aside className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow ml-0 md:ml-10 mt-10 md:mt-0">
            {/* PRODUK TERLARIS */}
            <h2 className="text-xl font-semibold mb-4">Produk Terlaris</h2>
            {loadingDashboard ? (
                <p className="text-gray-500">Memuat produk terlaris...</p>
            ) : errorDashboard ? (
                <p className="text-red-600">{errorDashboard}</p>
            ) : dashboardData.top_selling_products.length > 0 ? (
                <div className="space-y-4">
                    {dashboardData.top_selling_products.map((product) => (
                        <div key={product.id} className="flex items-center gap-3">
                            <img src={product.image || '/path/to/default-product.jpg'} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">{product.name}</p>
                                <p className="text-sm text-gray-600">{formatRupiah(product.price)}</p>
                            </div>
                        </div>
                    ))}
                    <button className="w-full bg-gray-100 text-gray-800 py-2 rounded-md hover:bg-gray-200 mt-4">Semua Produk</button>
                </div>
            ) : (
                <p className="text-gray-500">Tidak ada produk terlaris.</p>
            )}

            {/* DISTRIBUSI KATEGORI */}
            <h2 className="text-xl font-semibold mt-8 mb-4">Distribusi Kategori</h2>
            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                {/* Placeholder untuk grafik / list kategori */}
                Grafik atau Daftar Kategori Akan Muncul Di Sini
            </div>
        </aside>

        {active === "products" && <ProductManagement />}
        {active === "categories" && <CategoryManagement />}
        {active === "reviews" && <ReviewManagement />} 

      </main>
    </div>
  );
};

export default AdminPanel;