import React, { useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
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

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemClick = (key) => {
    setActive(key);
    setMenuOpen(false); // Close menu on mobile after selection
  };

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
          ></div>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {menu.find((m) => m.key === active)?.label}
            </h1>
            <p className="text-[#00000066] mt-2">
              Kelola dan pantau {menu.find((m) => m.key === active)?.label.toLowerCase()} di sini
            </p>
          </div>

          <section className="bg-white rounded-lg shadow p-6 md:p-8 min-h-[300px]">
            {active === "dashboard" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-[#F0F0F0] p-6 rounded-lg">
                    <p className="text-[#00000066] text-sm font-medium">Total Produk</p>
                    <p className="text-3xl font-bold mt-2">1,234</p>
                    <p className="text-xs text-green-600 mt-2">+12% dari bulan lalu</p>
                  </div>
                  <div className="bg-[#F0F0F0] p-6 rounded-lg">
                    <p className="text-[#00000066] text-sm font-medium">Total Pesanan</p>
                    <p className="text-3xl font-bold mt-2">856</p>
                    <p className="text-xs text-green-600 mt-2">+8% dari bulan lalu</p>
                  </div>
                  <div className="bg-[#F0F0F0] p-6 rounded-lg">
                    <p className="text-[#00000066] text-sm font-medium">Total Review</p>
                    <p className="text-3xl font-bold mt-2">342</p>
                    <p className="text-xs text-green-600 mt-2">+15% dari bulan lalu</p>
                  </div>
                  <div className="bg-[#F0F0F0] p-6 rounded-lg">
                    <p className="text-[#00000066] text-sm font-medium">Total Kategori</p>
                    <p className="text-3xl font-bold mt-2">28</p>
                    <p className="text-xs text-gray-500 mt-2">Stabil</p>
                  </div>
                </div>
                <p className="text-[#00000099]">Selamat datang di Dashboard Admin. Pantau performa toko Anda secara real-time.</p>
              </div>
            )}

            {active === "produk" && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Daftar Produk</h2>
                  <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm font-medium">
                    + Tambah Produk
                  </button>
                </div>
                <p className="text-[#00000099]">Kelola produk di sini. Fitur edit, hapus, dan tambah produk akan ditampilkan di sini.</p>
                {/* Tabel produk akan ditambahkan di sini */}
              </div>
            )}

            {active === "kategori" && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Daftar Kategori</h2>
                  <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm font-medium">
                    + Tambah Kategori
                  </button>
                </div>
                <p className="text-[#00000099]">Kelola kategori produk di sini. Tambah, edit, atau hapus kategori sesuai kebutuhan.</p>
                {/* Tabel kategori akan ditambahkan di sini */}
              </div>
            )}

            {active === "review" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">Review & Ulasan Pengguna</h2>
                </div>
                <p className="text-[#00000099]">Kelola review & ulasan pengguna di sini. Lihat, setujui, atau tolak review produk dari pelanggan.</p>
                {/* Tabel review akan ditambahkan di sini */}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;