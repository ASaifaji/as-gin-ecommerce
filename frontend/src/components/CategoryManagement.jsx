import React, { useState } from "react";
import { Edit2, Trash2, X, Check, Layers } from "lucide-react";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Fashion",
      description: "Pakaian dan aksesori fashion terbaru",
      icon: "👕",
      productCount: 125,
    },
    {
      id: 2,
      name: "Kecantikan",
      description: "Produk kecantikan dan perawatan kulit",
      icon: "💄",
      productCount: 87,
    },
    {
      id: 3,
      name: "Sport",
      description: "Perlengkapan olahraga dan aktivitas outdoor",
      icon: "⚽",
      productCount: 64,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
  });

  const handleAddCategory = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", icon: "" });
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
    });
    setShowModal(true);
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setCategories(
        categories.map((c) =>
          c.id === editingId
            ? { ...c, ...formData }
            : c
        )
      );
    } else {
      setCategories([
        ...categories,
        {
          ...formData,
          id: Date.now(),
          productCount: 0,
        },
      ]);
    }

    setShowModal(false);
    setFormData({ name: "", description: "", icon: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Kategori</h2>
        <button
          onClick={handleAddCategory}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          + Tambah Kategori
        </button>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden group"
          >
            {/* Category Header */}
            <div className="bg-gradient-to-r from-black to-gray-800 p-6 relative overflow-hidden">
              <div className="absolute top-3 right-3 text-4xl opacity-20">
                {category.icon}
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="text-4xl">{category.icon}</div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-300">
                    {category.productCount} produk
                  </p>
                </div>
              </div>
            </div>

            {/* Category Info */}
            <div className="p-4">
              <p className="text-sm text-[#00000099] mb-4 line-clamp-2">
                {category.description}
              </p>

              <div className="mb-4 p-3 bg-[#F0F0F0] rounded-lg">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-[#00000066]" />
                  <span className="text-xs text-[#00000066]">Total Produk</span>
                  <span className="font-semibold text-sm ml-auto">
                    {category.productCount}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
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

      {/* Modal Add/Edit Category */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {editingId ? "Edit Kategori" : "Tambah Kategori Baru"}
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
                  Nama Kategori
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Fashion, Kecantikan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Masukkan deskripsi kategori"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Icon Emoji
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  placeholder="Pilih emoji (contoh: 👕 💄 ⚽)"
                  maxLength="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-2xl text-center"
                  required
                />
                <p className="text-xs text-[#00000066] mt-2">
                  Salin emoji dari: emojipedia.org atau gunakan keyboard emoji
                </p>
              </div>

              {formData.icon && (
                <div className="text-center py-4 bg-[#F0F0F0] rounded-lg">
                  <div className="text-5xl mb-2">{formData.icon}</div>
                  <p className="text-xs text-[#00000066]">Preview icon</p>
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
                  {editingId ? "Simpan Perubahan" : "Tambah Kategori"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;