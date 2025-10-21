import React, { useEffect, useMemo, useState } from "react";
import { RefreshCw, Truck, CheckCircle2, XCircle, Loader2, Eye } from "lucide-react";
import orderService from "@/lib/orderService";
import api from "@/lib/api";

const ORDER_STATUSES = [
  "Menunggu Pembayaran",
  "Diproses",
  "Dikirim",
  "Selesai",
  "Dibatalkan",
];

const statusBadgeClass = (s) => {
  switch (s) {
    case "Menunggu Pembayaran":
      return "bg-yellow-100 text-yellow-800";
    case "Diproses":
      return "bg-blue-100 text-blue-800";
    case "Dikirim":
      return "bg-indigo-100 text-indigo-800";
    case "Selesai":
      return "bg-green-100 text-green-800";
    case "Dibatalkan":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [expanded, setExpanded] = useState({}); // { [orderId]: true/false }

  // pastikan Authorization ke-set (kalau AdminPanel sudah set juga gapapa, idempotent)
  const token = useMemo(() => localStorage.getItem("token") || "", []);
  useEffect(() => {
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [token]);

  const fetchOrders = async () => {
    setLoadingList(true);
    setError("");
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
      setError("Gagal memuat daftar pesanan.");
      setOrders([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (e) {
      console.error(e);
      alert("Gagal mengubah status pesanan.");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (orderId) =>
    setExpanded((ex) => ({ ...ex, [orderId]: !ex[orderId] }));

  const formatCurrency = (n) =>
    (n ?? 0).toLocaleString("id-ID", { style: "currency", currency: "IDR" });

  const formatDateTime = (iso) =>
    iso ? new Date(iso).toLocaleString("id-ID") : "-";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manajemen Pesanan</h2>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 bg-black text-white px-3 py-2 rounded hover:bg-gray-800 text-sm"
          disabled={loadingList}
        >
          <RefreshCw size={16} className={loadingList ? "animate-spin" : ""} />
          {loadingList ? "Memuat…" : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="rounded bg-red-100 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-3 pr-4">ID</th>
              <th className="py-3 pr-4">Pengguna</th>
              <th className="py-3 pr-4">Tanggal</th>
              <th className="py-3 pr-4">Total</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loadingList ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  <Loader2 className="inline-block animate-spin mr-2" />
                  Memuat data pesanan…
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  Belum ada pesanan.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <React.Fragment key={o.id}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 pr-4 font-medium">#{o.id}</td>
                    <td className="py-3 pr-4">{o?.user?.name ?? `User #${o.user_id}`}</td>
                    <td className="py-3 pr-4">{formatDateTime(o.created_at)}</td>
                    <td className="py-3 pr-4">{formatCurrency(o.total)}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${statusBadgeClass(
                          o.status
                        )}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpand(o.id)}
                          className="inline-flex items-center gap-1 border rounded px-2 py-1 text-xs hover:bg-gray-100"
                          title="Lihat detail item"
                        >
                          <Eye size={14} />
                          Detail
                        </button>

                        <select
                          className="border rounded px-2 py-1 text-xs"
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          disabled={updatingId === o.id}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        {o.status === "Dikirim" && (
                          <span title="Dalam pengiriman" className="inline-flex items-center">
                            <Truck size={16} />
                          </span>
                        )}
                        {o.status === "Selesai" && (
                          <span title="Selesai" className="inline-flex items-center text-green-600">
                            <CheckCircle2 size={16} />
                          </span>
                        )}
                        {o.status === "Dibatalkan" && (
                          <span title="Dibatalkan" className="inline-flex items-center text-red-600">
                            <XCircle size={16} />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Row detail expandable */}
                  {expanded[o.id] && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="py-4 px-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium mb-2">Item Pesanan</p>
                            <div className="border rounded">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="text-left text-gray-600 border-b">
                                    <th className="py-2 px-2">Produk</th>
                                    <th className="py-2 px-2">Qty</th>
                                    <th className="py-2 px-2">Harga</th>
                                    <th className="py-2 px-2">Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(o.items ?? []).map((it) => (
                                    <tr key={it.id} className="border-b">
                                      <td className="py-2 px-2">
                                        {it?.product?.name ?? `#${it.product_id}`}
                                      </td>
                                      <td className="py-2 px-2">{it.quantity}</td>
                                      <td className="py-2 px-2">{formatCurrency(it.price)}</td>
                                      <td className="py-2 px-2">
                                        {formatCurrency((it.price ?? 0) * (it.quantity ?? 0))}
                                      </td>
                                    </tr>
                                  ))}
                                  {(o.items ?? []).length === 0 && (
                                    <tr>
                                      <td colSpan={4} className="py-3 px-2 text-center text-gray-500">
                                        Tidak ada item.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div>
                            <p className="font-medium mb-2">Ringkasan</p>
                            <div className="bg-white border rounded p-3 text-sm">
                              <div className="flex justify-between py-1">
                                <span>Status</span>
                                <span className={`px-2 py-0.5 rounded text-xs ${statusBadgeClass(o.status)}`}>
                                  {o.status}
                                </span>
                              </div>
                              <div className="flex justify-between py-1">
                                <span>Tanggal</span>
                                <span>{formatDateTime(o.created_at)}</span>
                              </div>
                              <div className="flex justify-between py-1 font-semibold">
                                <span>Total</span>
                                <span>{formatCurrency(o.total)}</span>
                              </div>
                              {o?.user && (
                                <div className="pt-2 mt-2 border-t text-xs text-gray-600">
                                  <div>Nama: {o.user.name ?? "-"}</div>
                                  <div>Email: {o.user.email ?? "-"}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
