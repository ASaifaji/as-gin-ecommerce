import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Search, ShoppingCart, User, LogOut, Settings, Package, Menu, X, CircleUserRound } from "lucide-react";
import productService from "@/lib/productService";

const NavbarCart = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Get user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Get cart count (you can implement this properly later)
    const cartCount = localStorage.getItem("cartCount") || 0;
    setCartItemCount(parseInt(cartCount));
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search products with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const data = await productService.getAllProducts();
      const filtered = (data.products || []).filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        product.is_active
      );
      setSearchResults(filtered.slice(0, 5)); // Limit to 5 results
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      setSearchQuery("");
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setShowResults(false);
    setSearchQuery("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cartCount");
    navigate("/login");
  };

  const formatPrice = (priceInCents) => {
    const rupiah = priceInCents / 100;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(rupiah);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="px-20 py-4 max-lg:px-5">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 flex-shrink-0">
            <img 
              src="/infoMart.png" 
              alt="InfoMart Logo" 
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="flex-1 max-w-2xl max-lg:hidden" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Search 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  size={20} 
                />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0"
                    >
                      <img
                        src={product.image_url || "/product1.png"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{product.name}</h4>
                        <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                  ))}
                  {searchResults.length === 5 && (
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full p-3 text-center text-sm text-gray-600 hover:bg-gray-50 font-medium"
                    >
                      Lihat semua hasil pencarian
                    </button>
                  )}
                </div>
              )}

              {showResults && searchResults.length === 0 && searchQuery.trim() && !isSearching && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                  <p className="text-center text-gray-500">Produk tidak ditemukan</p>
                </div>
              )}
            </form>
          </div>

          {/* Desktop Actions */}
          <div className="flex items-center gap-6 max-lg:hidden">

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User size={18} className="text-gray-700" />
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="font-semibold text-sm">{user.name || user.email}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User size={18} className="text-gray-600" />
                      <span className="text-sm">Profil Saya</span>
                    </Link>
                    
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Package size={18} className="text-gray-600" />
                      <span className="text-sm">Pesanan Saya</span>
                    </Link>
                    
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings size={18} className="text-gray-600" />
                      <span className="text-sm">Pengaturan</span>
                    </Link>
                    
                    <hr className="my-2" />
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors w-full text-left text-red-600"
                    >
                      <LogOut size={18} />
                      <span className="text-sm">Keluar</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to={"/profile"}>
                    <button>
                        <CircleUserRound size={24} />
                    </button>
                </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-4 lg:hidden" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                size={20} 
              />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>

            {/* Mobile Search Results */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden max-h-80 overflow-y-auto">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0"
                  >
                    <img
                      src={product.image_url || "/product1.png"}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{product.name}</h4>
                      <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-4">
              {/* Cart Link */}

              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={20} className="text-gray-700" />
                    <span className="font-medium">Profil Saya</span>
                  </Link>
                  
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Package size={20} className="text-gray-700" />
                    <span className="font-medium">Pesanan Saya</span>
                  </Link>
                  
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings size={20} className="text-gray-700" />
                    <span className="font-medium">Pengaturan</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-red-600 w-full text-left"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Keluar</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Masuk
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarCart;