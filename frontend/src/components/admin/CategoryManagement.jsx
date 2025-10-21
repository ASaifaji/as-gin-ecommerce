import React, { useEffect, useState } from "react";
import { Edit2, Trash2, X, Check, Layers } from "lucide-react";
import categoryService from "@/lib/categoryService";
import api from "@/lib/api";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", icon: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [recounting, setRecounting] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token") || "";
  useEffect(() => {
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [token]);

  const normalize = (c) => ({
    id: c.id ?? c.ID,
    name: c.name ?? c.Name ?? "",
    description: c.description ?? c.Description ?? "",
    icon: c.icon ?? c.Icon ?? "🛍️",
    productCount:
      c.product_count ?? c.productCount ?? c.products_count ?? c.ProductsCount ?? 0,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await categoryService.getAllCategories();
      const arr =
        Array.isArray(res) ? res :
        Array.isArray(res?.data) ? res.data :
        Array.isArray(res?.data?.data) ? res.data.data :
        Array.isArray(res?.categories) ? res.categories :
        [];
      setCategories(arr.map(normalize));
    } catch (e) {
      setError(e?.response?.data?.message || e?.response?.data?.error || e.message || "Gagal memuat kategori.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleRecount = async () => {
    if (!token) {
      alert("Harus login admin untuk recount.");
      return;
    }
    try {
      setRecounting(true);
      if (typeof categoryService.recountAll === "function") {
        await categoryService.recountAll(token);
        await fetchCategories();
      } else {
        alert("Endpoint recount belum tersedia.");
      }
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    } finally {
      setRecounting(false);
    }
  };

  const handleAddCategory = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", icon: "" });
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name || "",
      description: category.description || "",
      icon: category.icon || "🛍️",
    });
    setShowModal(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Hapus kategori ini?")) return;
    try {
      await categoryService.deleteCategory(id, token);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || e?.response?.data?.error || e.message || "Gagal menghapus kategori.");
    }
  };

  // --- slug helper ---
  const slugify = (s) =>
    String(s || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");

  const makeShapes = () => {
    const name = formData.name.trim();
    const description = formData.description.trim();
    const icon = (formData.icon || "🛍️").trim();
    const slug = slugify(name);

    // minimal panjang slug (kebanyakan backend go pakai min:3)
    if (slug.length < 3) {
      throw new Error("Slug minimal 3 karakter. Periksa nama kategori.");
    }

    const lower = { name, description, icon, slug };
    const pascal = { Name: name, Description: description, Icon: icon, Slug: slug };

    // urutan percobaan payload (tanpa ubah service)
    return [lower, { category: lower }, { CategoryInput: lower }, pascal];
  };

  const tryCreate = async () => {
    const shapes = makeShapes();
    let lastErr = null;
    for (const body of shapes) {
      try {
        const created = await categoryService.createCategory(body, token);
        return created;
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr;
  };

  const tryUpdate = async (id) => {
    const shapes = makeShapes();
    let lastErr = null;
    for (const body of shapes) {
      try {
        const updated = await categoryService.updateCategory(id, body, token);
        return updated;
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        const updated = await tryUpdate(editingId);
        const payload = updated?.data?.data || updated?.data || updated;
        const normalized = normalize(payload || { id: editingId, ...formData });
        setCategories((prev) => prev.map((c) => (c.id === editingId ? normalized : c)));
      } else {
        const created = await tryCreate();
        const payload = created?.data?.data || created?.data || created;
        const normalized = normalize(payload || formData);
        setCategories((prev) => [...prev, normalized]);
      }
      setShowModal(false);
      setFormData({ name: "", description: "", icon: "" });
      setEditingId(null);
    } catch (e2) {
      alert(
        e2?.response?.data?.message ||
          e2?.response?.data?.error ||
          e2.message ||
          "Gagal menyimpan kategori."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Kategori</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchCategories}
            className="bg-[#F0F0F0] hover:bg-[#e5e5e5] px-4 py-2 rounded text-sm"
            disabled={loading}
          >
            {loading ? "Merefresh…" : "Refresh"}
          </button>
          <button
            onClick={handleAddCategory}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            + Tambah Kategori
          </button>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded mb-4">{error}</div>}

      {loading ? (
        <p>Memuat kategori...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden group"
            >
              <div className="bg-gradient-to-r from-black to-gray-800 p-6 relative overflow-hidden">
                <div className="absolute top-3 right-3 text-4xl opacity-20">{category.icon}</div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="text-4xl">{category.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{category.name}</h3>
                    <p className="text-xs text-gray-300">{category.productCount ?? 0} produk</p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm text-[#00000099] mb-4 line-clamp-2">{category.description}</p>

                <div className="mb-4 p-3 bg-[#F0F0F0] rounded-lg">
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-[#00000066]" />
                    <span className="text-xs text-[#00000066]">Total Produk</span>
                    <span className="font-semibold text-sm ml-auto">{category.productCount}</span>
                  </div>
                </div>

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

          {!categories.length && (
            <div className="col-span-full text-center text-gray-500 py-10">Belum ada kategori.</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {editingId ? "Edit Kategori" : "Tambah Kategori Baru"}
              </h3>
              <button onClick={() => setShowModal(false)} className="hover:bg-[#F0F0F0] p-1 rounded transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nama Kategori</label>
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
                <label className="block text-sm font-medium mb-2">Deskripsi</label>
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
                <label className="block text-sm font-medium mb-2">Icon Emoji</label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  placeholder="Pilih emoji (contoh: 👕 💄 ⚽)"
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-2xl text-center"
                  required
                />
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
                  disabled={submitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
                  disabled={submitting}
                >
                  <Check size={18} />
                  {submitting ? "Menyimpan…" : editingId ? "Simpan Perubahan" : "Tambah Kategori"}
                </button>
              </div>
            </form>

            <div className="p-4 border-t flex items-center gap-2">
              <button
                onClick={handleRecount}
                className="bg-[#F0F0F0] hover:bg-[#e5e5e5] px-3 py-2 rounded text-sm"
                disabled={recounting}
              >
                {recounting ? "Recount…" : "Recount Produk per Kategori"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
