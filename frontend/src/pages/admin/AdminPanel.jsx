// src/pages/admin/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import ProductManagement from "@/components/ProductManagement";
import CategoryManagement from "@/components/CategoryManagement";
import ReviewManagement from "@/components/ReviewManagement";
import productService from "@/lib/productService";
import categoryService from "@/lib/categoryService";
import reviewService from "@/lib/reviewService";

import {
  LayoutDashboard,
  Package,
  Layers,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

const menu = [
  { label: "Dashboard", key: "dashboard", icon: LayoutDashboard },
  { label: "Manajemen Produk", key: "produk", icon: Package },
  { label: "Manajemen Kategori", key: "kategori", icon: Layers },
  { label: "Review & Ulasan", key: "review", icon: MessageSquare },
];

const AdminPanel = () => {
  const [active, setActive] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  // COUNTERS
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  const handleMenuToggle = () => setMenuOpen((v) => !v);
  const handleMenuItemClick = (key) => {
    setActive(key);
    setMenuOpen(false);
  };

  useEffect(() => {
    const loadStats = async () => {
      setLoadingStats(true);
      try {
        const [p, c, r] = await Promise.all([
          productService.getTotalCount(),
          categoryService.getTotalCount(),
          reviewService.getTotalCount(),
        ]);
        setTotalProducts(p);
        setTotalCategories(c);
        setTotalReviews(r);
      } catch (e) {
        console.error("Gagal memuat statistik dashboard:", e);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      {/* Navbar */}
      <AdminNavbar onMenuToggle={handleMenuToggle} menuOpen={menuOpen} />

      <div className="flex">
        {/* Sidebar Overlay (Mobile) */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
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

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {menu.find((m) => m.key === active)?.label}
            </h1>
            <p className="text-[#00000066] mt-2">
              Kelola dan pantau{" "}
              {menu.find((m) => m.key === active)?.label.toLowerCase()} di sini
            </p>
          </div>

          {/* Content Section */}
          <section className="bg-white rounded-lg shadow p-6 md:p-8 min-h-[300px]">
            {/* DASHBOARD */}
            {active === "dashboard" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Produk */}
                  <div className="bg-[#F0F0F0] p-6 rounded-lg">
                    <p className="text-[#00000066] text-sm font-medium">
                      Total Produk
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      {loadingStats
                        ? "..."
                        : totalProducts.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">—</p>
                  </div>

                  {/* Kategori */}
                  <div className="bg-[#F0F0F0] p-6 rounded-lg">
                    <p className="text-[#00000066] text-sm font-medium">
                      Total Kategori
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      {loadingStats
                        ? "..."
                        : totalCategories.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">—</p>
                  </div>

                  {/* Review */}
                  <div className="bg-[#F0F0F0] p-6 rounded-lg">
                    <p className="text-[#00000066] text-sm font-medium">
                      Total Review
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      {loadingStats
                        ? "..."
                        : totalReviews.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">—</p>
                  </div>
                </div>

                <p className="text-[#00000099]">
                  Selamat datang di Dashboard Admin. Angka di atas diambil
                  langsung dari server.
                </p>
              </div>
            )}

            {/* Produk */}
            {active === "produk" && <ProductManagement />}

            {/* Kategori */}
            {active === "kategori" && <CategoryManagement />}

            {/* Review */}
            {active === "review" && <ReviewManagement />}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;