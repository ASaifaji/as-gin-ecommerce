import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  Settings,
  Bell,
  CircleUserRound,
} from "lucide-react";

export const AdminNavbar = ({ onMenuToggle, menuOpen }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        
        {/* Left Section - Menu Toggle & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden hover:bg-[#F0F0F0] p-2 rounded transition-colors"
          >
            {menuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

          <div className="hidden md:flex items-center gap-2">
            <figure>
              <img
                src="/infoMart.png"
                alt="admin panel logo"
                className="w-28"
              />
            </figure>
            <span className="text-xs text-[#00000066] font-medium">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Right Section - Icons & User Menu */}
        <div className="flex items-center gap-6">
          
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative hover:bg-[#F0F0F0] p-2 rounded transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notifications Dropdown */}
            <div
              className={`absolute right-0 top-12 w-72 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-300 ${
                showNotifications
                  ? "opacity-100 visible scale-100"
                  : "opacity-0 invisible scale-95"
              }`}
            >
              <div className="p-4 border-b bg-[#F0F0F0]">
                <h3 className="font-semibold text-sm">Notifikasi</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-4 hover:bg-[#F0F0F0] border-b transition-colors cursor-pointer">
                  <p className="text-sm font-medium">Pesanan baru diterima</p>
                  <p className="text-xs text-[#00000066] mt-1">2 menit lalu</p>
                </div>
                <div className="p-4 hover:bg-[#F0F0F0] border-b transition-colors cursor-pointer">
                  <p className="text-sm font-medium">Review produk baru</p>
                  <p className="text-xs text-[#00000066] mt-1">15 menit lalu</p>
                </div>
                <div className="p-4 hover:bg-[#F0F0F0] transition-colors cursor-pointer">
                  <p className="text-sm font-medium">Stok produk menipis</p>
                  <p className="text-xs text-[#00000066] mt-1">1 jam lalu</p>
                </div>
              </div>
              <div className="p-3 text-center border-t bg-[#F0F0F0]">
                <button className="text-xs text-black hover:underline underline-offset-2">
                  Lihat semua notifikasi
                </button>
              </div>
            </div>
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 hover:bg-[#F0F0F0] px-3 py-2 rounded transition-colors"
            >
              <CircleUserRound size={20} />
              <span className="hidden sm:inline text-sm font-medium">Admin</span>
            </button>

            {/* Profile Dropdown */}
            <div
              className={`absolute right-0 top-12 w-48 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-300 ${
                showProfileMenu
                  ? "opacity-100 visible scale-100"
                  : "opacity-0 invisible scale-95"
              }`}
            >
              <div className="p-3 border-b bg-[#F0F0F0]">
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs text-[#00000066]">admin@infomart.com</p>
              </div>
              <ul className="py-2">
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-[#F0F0F0] flex items-center gap-2 transition-colors text-sm">
                    <Settings size={16} />
                    Pengaturan Profil
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-[#F0F0F0] flex items-center gap-2 transition-colors text-sm">
                    <Settings size={16} />
                    Keamanan
                  </button>
                </li>
              </ul>
              <div className="border-t p-2">
                <Link
                  to="/"
                  className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 transition-colors text-sm text-red-600 hover:text-red-700 rounded"
                >
                  <LogOut size={16} />
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;