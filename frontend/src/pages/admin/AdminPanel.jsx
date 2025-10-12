import React, { useState } from "react";

const menu = [
  { label: "Dashboard", key: "dashboard" },
  { label: "Manajemen Produk", key: "produk" },
  { label: "Manajemen Kategori", key: "kategori" },
  { label: "Review & Ulasan", key: "review" },
];

const AdminPanel = () => {
  const [active, setActive] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-[#F0F0F0]">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col py-8 px-6">
        <div className="mb-10 flex items-center gap-2">
          <img src="/infoMart.png" alt="Logo" className="w-10" />
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        <nav className="flex flex-col gap-2">
          {menu.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`text-left px-4 py-2 rounded transition-all ${
                active === item.key
                  ? "bg-black text-white font-semibold"
                  : "text-[#00000099] hover:bg-[#e5e5e5]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-6">
          {menu.find((m) => m.key === active)?.label}
        </h1>
        <section className="bg-white rounded-lg shadow p-6 min-h-[300px]">
          {active === "dashboard" && (
            <div>
              <p className="text-[#00000099]">Selamat datang di Dashboard Admin.</p>
              {/* Tambahkan statistik ringkas di sini */}
            </div>
          )}
          {active === "produk" && (
            <div>
              <p className="text-[#00000099]">Kelola produk di sini.</p>
              {/* Tabel/list produk */}
            </div>
          )}
          {active === "kategori" && (
            <div>
              <p className="text-[#00000099]">Kelola kategori produk di sini.</p>
              {/* Tabel/list kategori */}
            </div>
          )}
          {active === "review" && (
            <div>
              <p className="text-[#00000099]">Kelola review & ulasan pengguna di sini.</p>
              {/* Tabel/list review */}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminPanel;