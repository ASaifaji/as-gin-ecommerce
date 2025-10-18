import React, { useState } from "react";
import { Edit2, Trash2, X, Check } from "lucide-react";

const ProductManagement = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Kaos Premium",
      category: "Fashion",
      price: 150000,
      stock: 50,
      image: "https://via.placeholder.com/200x200?text=Kaos+Premium",
    },
    {
      id: 2,
      name: "Sepatu Olahraga",
      category: "Sport",
      price: 450000,
      stock: 30,
      image: "https://via.placeholder.com/200x200?text=Sepatu+Olahraga",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  });

  const handleAddProduct = () => {
    setEditingId(null);
    setFormData({ name: "", category: "", price: "", stock: "", image: "" });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingId(product.id);
    setFormData(product);
    setShowModal(true);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setProducts(
        products.map((p) =>
          p.id === editingId
            ? { ...formData, id: editingId }
            : p
        )
      );
    } else {
      setProducts([
        ...products,
        {
          ...formData,
          id: Date.now(),
          price: parseInt(formData.price),
          stock: parseInt(formData.stock),
        },
      ]);
    }

    setShowModal(false);
    setFormData({ name: "", category: "", price: "", stock: "", image: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Produk</h2>
        <button
          onClick={handleAddProduct}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          + Tambah Produk
        </button>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
          >
            {/* Product Image */}
            <div className="relative w-full h-48 bg-[#F0F0F0] overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
              <div className="absolute top-3 right-3 bg-black text-white px-2 py-1 rounded text-xs font-semibold">
                {product.category}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {product.name}
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#F0F0F0] p-2 rounded">
                  <p className="text-xs text-[#00000066]">Harga</p>
                  <p className="font-semibold text-sm">
                    Rp {product.price.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="bg-[#F0F0F0] p-2 rounded">
                  <p className="text-xs text-[#00000066]">Stok</p>
                  <p className="font-semibold text-sm">
                    {product.stock > 0 ? (
                      <span className="text-green-600">{product.stock}</span>
                    ) : (
                      <span className="text-red-600">Habis</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit Product */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {editingId ? "Edit Produk" : "Tambah Produk Baru"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="hover:bg-[#F0F0F0] p-1 rounded transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nama Produk
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama produk"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Kategori
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Kecantikan">Kecantikan</option>
                  <option value="Sport">Sport</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Masukkan harga"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Stok
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Masukkan jumlah stok"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  URL Gambar
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              {formData.image && (
                <div className="w-full h-32 bg-[#F0F0F0] rounded-lg overflow-hidden">
                  <img
                    src={formData.image}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/200x200?text=Invalid")}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-[#F0F0F0] hover:bg-[#e5e5e5] px-4 py-2 rounded transition-colors text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  {editingId ? "Simpan Perubahan" : "Tambah Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;