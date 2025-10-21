import React, { useEffect, useMemo, useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ProductManagement from "@/components/admin/ProductManagement";
import CategoryManagement from "@/components/admin/CategoryManagement";
import ReviewManagement from "@/components/admin/ReviewManagement";
import OrderManagement from "@/components/admin/OrderManagement";
import {
  LayoutDashboard,
  Package,
  Layers,
  MessageSquare,
  ChevronRight,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import productService from "@/lib/productService";
import categoryService from "@/lib/categoryService";
import orderService from "@/lib/orderService";
import api from "@/lib/api";

const menu = [
  { label: "Dashboard", key: "dashboard", icon: LayoutDashboard },
  { label: "Manajemen Produk", key: "produk", icon: Package },
  { label: "Manajemen Kategori", key: "kategori", icon: Layers },
  { label: "Pesanan", key: "pesanan", icon: ShoppingCart },
  { label: "Review & Ulasan", key: "review", icon: MessageSquare },
];

const AdminPanel = () => {
  const [active, setActive] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const token = useMemo(() => localStorage.getItem("token") || "", []);
  useEffect(() => {
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [token]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState("");
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    reviews: 0,
  });

  const pickArray = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.items)) return res.items;
    if (Array.isArray(res?.products)) return res.products;
    if (Array.isArray(res?.categories)) return res.categories;
    return [];
  };

  const loadStats = async () => {
    setLoadingStats(true);
    setErrorStats("");
    try {
      const [prodsRes, catsRes, ordersCount] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories(),
        orderService.getOrderCount(),
      ]);

      const products = pickArray(prodsRes);
      const categories = pickArray(catsRes);

      setStats((s) => ({
        ...s,
        products: products.length,
        categories: categories.length,
        orders: ordersCount,
      }));
    } catch (err) {
      console.error(err);
      setErrorStats("Gagal memuat statistik.");
      setStats((s) => ({ ...s, products: 0, categories: 0, orders: 0 }));
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleMenuToggle = () => setMenuOpen((v) => !v);
  const handleMenuItemClick = (key) => {
    setActive(key);
    setMenuOpen(false);
    if (key === "dashboard") loadStats();
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <AdminNavbar onMenuToggle={handleMenuToggle} menuOpen={menuOpen} />

      <div className="flex">
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        <aside
          className={`fixed md:static top-0 left-0 h-full md:h-auto w-64 bg-white shadow-md flex flex-col py-8 px-6 transition-transform duration-300 z-40 ${
            menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="mb-10 flex items-center gap-2 md:hidden">
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
                    isActive ? "bg-black text-white font-semibold" : "text-[#00000099] hover:bg-[#e5e5e5]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight
                    size={18}
                    className={`opacity-0 transition-all ${isActive ? "opacity-100" : "group-hover:opacity-50"}`}
                  />
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {menu.find((m) => m.key === active)?.label}
              </h1>
              <p className="text-[#00000066] mt-2">
                Kelola dan pantau {menu.find((m) => m.key === active)?.label.toLowerCase()} di sini
              </p>
            </div>

            {active === "dashboard" && (
              <button
                onClick={loadStats}
                className="inline-flex items-center gap-2 bg-black text-white px-3 py-2 rounded hover:bg-gray-800 text-sm"
                disabled={loadingStats}
              >
                <RefreshCw size={16} className={loadingStats ? "animate-spin" : ""} />
                {loadingStats ? "Merefresh…" : "Refresh"}
              </button>
            )}
          </div>

          <section className="bg-white rounded-lg shadow p-6 md:p-8 min-h-[300px]">
            {active === "dashboard" && (
              <div>
                {errorStats && (
                  <div className="mb-4 rounded bg-red-100 text-red-700 px-3 py-2 text-sm">
                    {errorStats}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-[#F0F0F0] p-6 rounded-lg">
                    <p className="text-[#00000066] text-sm font-medium">Total Produk</p>
                    <p className="text-3xl font-bold mt-2">
                      {loadingStats ? "…" : stats.products.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Terbaru dari database</p>
                  </div>

                  <div className="bg-[#F0F0F0] p-6 rounded-lg">
                    <p className="text-[#00000066] text-sm font-medium">Total Pesanan</p>
                    <p className="text-3xl font-bold mt-2">
                      {loadingStats ? "…" : stats.orders.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Terbaru dari database</p>
                  </div>

                  <div className="bg-[#F0F0F0] p-6 rounded-lg">
                    <p className="text-[#00000066] text-sm font-medium">Total Review</p>
                    <p className="text-3xl font-bold mt-2">
                      {loadingStats ? "…" : stats.reviews.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">—</p>
                  </div>

                  <div className="bg-[#F0F0F0] p-6 rounded-lg">
                    <p className="text-[#00000066] text-sm font-medium">Total Kategori</p>
                    <p className="text-3xl font-bold mt-2">
                      {loadingStats ? "…" : stats.categories.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Terbaru dari database</p>
                  </div>
                </div>

                <p className="text-[#00000099]">
                  Selamat datang di Dashboard Admin. Pantau performa toko Anda secara real-time.
                </p>
              </div>
            )}

            {active === "produk" && <ProductManagement />}
            {active === "kategori" && <CategoryManagement />}
            {active === "pesanan" && <OrderManagement />}
            {active === "review" && <ReviewManagement />}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
