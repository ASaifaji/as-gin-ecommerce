import React, { useEffect, useMemo, useState } from "react";
import { Edit2, Trash2, X, Check, Plus, Image as ImageIcon } from "lucide-react";
import productService from "@/lib/productService";
import categoryService from "@/lib/categoryService";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form data produk - disesuaikan dengan backend
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category_id: "",
    is_active: true,
    image: "",
  });

  // Form data kategori baru
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  const token = useMemo(() => localStorage.getItem("token") || "", []);

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [prodsRes, catsRes] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories(),
      ]);
      
      // Handle berbagai format response dari backend
      const prodsData = prodsRes?.products || prodsRes || [];
      const catsData = catsRes?.categories || catsRes || [];
      
      setProducts(Array.isArray(prodsData) ? prodsData : []);
      setCategories(Array.isArray(catsData) ? catsData : []);
    } catch (e) {
      console.error(e);
      setError("Gagal memuat data produk/kategori.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const resetForm = () =>
    setFormData({
      name: "",
      description: "",
      price: "",
      stock_quantity: "",
      category_id: "",
      is_active: true,
      image: "",
    });

  const resetCategoryForm = () =>
    setNewCategory({
      name: "",
      description: "",
    });

  const handleAddProduct = () => {
    setEditingId(null);
    resetForm();
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      stock_quantity: String(product.stock_quantity ?? ""),
      category_id: String(product.category_id ?? product.category?.id ?? ""),
      is_active: Boolean(product.is_active),
      image: product.image || "",
    });
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Hapus produk ini?")) return;
    try {
      await productService.deleteProduct(id, token);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      await loadAll(); // Refresh untuk update count kategori
    } catch (e) {
      console.error(e);
      alert("Gagal menghapus produk.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Validasi URL gambar
    if (formData.image && !isValidUrl(formData.image)) {
      setError("URL gambar tidak valid. Gunakan format URL yang benar.");
      setSaving(false);
      return;
    }

    const toNum = (v, def = 0) =>
      Number.isFinite(Number(v)) ? Number(v) : def;

    // Payload sesuai dengan ProductInput / UpdateProductInput di backend
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: toNum(formData.price, 0),
      stock_quantity: toNum(formData.stock_quantity, 0),
      category_id: toNum(formData.category_id, 0),
      is_active: Boolean(formData.is_active),
      image: formData.image.trim() || undefined, // omitempty di backend
    };

    try {
      if (editingId) {
        await productService.updateProduct(editingId, payload, token);
      } else {
        await productService.createProduct(payload, token);
      }
      setShowModal(false);
      resetForm();
      await loadAll(); // Sinkronkan dengan database
    } catch (e) {
      console.error(e);
      setError(
        e.response?.data?.error || 
        "Gagal menyimpan produk. Periksa input & koneksi."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      alert("Nama kategori wajib diisi.");
      return;
    }

    try {
      const created = await categoryService.createCategory(
        {
          name: newCategory.name.trim(),
          description: newCategory.description.trim(),
        },
        token
      );
      
      // Tambahkan kategori baru ke state
      const catData = created?.category || created;
      setCategories((prev) => [...prev, catData]);
      
      // Auto-select kategori yang baru dibuat
      setFormData((prev) => ({
        ...prev,
        category_id: String(catData.id),
      }));
      
      setShowCategoryModal(false);
      resetCategoryForm();
    } catch (e) {
      console.error(e);
      alert("Gagal membuat kategori baru.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const findCategoryName = (product) => {
    if (product?.category?.name) return product.category.name;
    const cid = product.category_id ?? product.category?.id;
    const found = Array.isArray(categories)
      ? categories.find((c) => String(c.id) === String(cid))
      : undefined;
    return found?.name || "-";
  };

  if (loading) return <p className="text-center py-8">Memuat data…</p>;

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

      {error && (
        <div className="mb-4 rounded bg-red-100 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Belum ada produk. Klik "Tambah Produk" untuk memulai.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
            >
              <div className="relative w-full h-48 bg-[#F0F0F0] overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/600x400?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-black text-white px-2 py-1 rounded text-xs font-semibold">
                  {findCategoryName(product)}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description || "—"}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#F0F0F0] p-2 rounded">
                    <p className="text-xs text-[#00000066]">Harga</p>
                    <p className="font-semibold text-sm">
                      Rp {Number(product.price || 0).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="bg-[#F0F0F0] p-2 rounded">
                    <p className="text-xs text-[#00000066]">Stok</p>
                    <p className="font-semibold text-sm">
                      {Number(product.stock_quantity) > 0 ? (
                        <span className="text-green-600">
                          {product.stock_quantity}
                        </span>
                      ) : (
                        <span className="text-red-600">Habis</span>
                      )}
                    </p>
                  </div>
                </div>

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
      )}

      {/* Modal Tambah/Edit Produk */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {editingId ? "Edit Produk" : "Tambah Produk Baru"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError("");
                }}
                className="hover:bg-[#F0F0F0] p-1 rounded transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="rounded bg-red-100 text-red-700 px-3 py-2 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Min. 5 karakter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                  minLength={5}
                  maxLength={255}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Min. 10 karakter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  rows={3}
                  required
                  minLength={10}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {Array.isArray(categories) &&
                      categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(true)}
                    className="bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    title="Tambah Kategori Baru"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Harga (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Stok <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  URL Gambar Produk
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Masukkan URL gambar yang valid (https://...)
                </p>
              </div>

              {formData.image && (
                <div className="w-full h-40 bg-[#F0F0F0] rounded-lg overflow-hidden">
                  <img
                    src={formData.image}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/600x400?text=Invalid+URL";
                    }}
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  id="is_active"
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                <label htmlFor="is_active" className="text-sm">
                  Produk Aktif
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                  }}
                  className="flex-1 bg-[#F0F0F0] hover:bg-[#e5e5e5] px-4 py-2 rounded transition-colors text-sm font-medium"
                  disabled={saving}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
                  disabled={saving}
                >
                  <Check size={18} />
                  {saving
                    ? "Menyimpan…"
                    : editingId
                    ? "Simpan Perubahan"
                    : "Tambah Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Kategori */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Tambah Kategori Baru</h3>
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  resetCategoryForm();
                }}
                className="hover:bg-[#F0F0F0] p-1 rounded transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nama Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleCategoryInputChange}
                  placeholder="Contoh: Elektronik"
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
                  value={newCategory.description}
                  onChange={handleCategoryInputChange}
                  placeholder="Deskripsi kategori (opsional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryModal(false);
                    resetCategoryForm();
                  }}
                  className="flex-1 bg-[#F0F0F0] hover:bg-[#e5e5e5] px-4 py-2 rounded transition-colors text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Tambah
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