package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ASaifaji/as-gin-ecommerce/models" 
	"github.com/ASaifaji/as-gin-ecommerce/database" 
)

type DashboardStats struct {
	TotalCheckout      int    `json:"total_checkout"`
	TotalIncome        int64  `json:"total_income"`
	TotalProducts      int    `json:"total_products"`
	TopSellingProducts []ProductInfo `json:"top_selling_products"`
}

type ProductInfo struct {
	ID    uint   `json:"id"`
	Name  string `json:"name"`
	Price int    `json:"price"`
	Image string `json:"image"`
}

type TransactionInfo struct {
	ID         uint   `json:"id"`
	Username   string `json:"username"`
	TotalPrice int    `json:"total_price"` 
	Status     string `json:"status"` 
}

func GetDashboardData(c *gin.Context) {
	var stats DashboardStats

	// --- 1. Total Checkout (Total Orders) ---
	// Menghitung jumlah total order
	if err := database.DB.Model(&models.Order{}).Count(&stats.TotalCheckout).Error; err != nil {
		stats.TotalCheckout = 0 // Tetap nol jika error
	}

	// --- 2. Total Pemasukan (Total Income) ---
	// Menghitung SUM dari kolom 'total_price' di tabel orders
	var totalIncome int64 = 0
	// COALESCE digunakan agar hasilnya 0 jika tidak ada data, bukan NULL
	database.DB.Model(&models.Order{}).Select("COALESCE(SUM(total_price), 0)").Row().Scan(&totalIncome)
	stats.TotalIncome = totalIncome

	// --- 3. Total Produk ---
	// Menghitung jumlah total produk
	if err := database.DB.Model(&models.Product{}).Count(&stats.TotalProducts).Error; err != nil {
		stats.TotalProducts = 0 // Tetap nol jika error
	}

	// --- 4. Produk Terlaris (MOCKUP SEMENTARA) ---
	// Logika query produk terlaris sebenarnya rumit, jadi kita gunakan data statis/mockup ini.
	stats.TopSellingProducts = []ProductInfo{
		{ID: 1, Name: "Jamu Kunyit Asam", Price: 15000, Image: "/images/kunyit.jpg"},
		{ID: 2, Name: "Beras Organik 5Kg", Price: 85000, Image: "/images/rice.jpg"},
	}
	
	c.JSON(http.StatusOK, stats)
}

func GetAllOrders(c *gin.Context) {
	var orders []models.Order
	
	if err := database.DB.Preload("User").Order("created_at DESC").Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch all transactions"})
		return
	}

    // Konversi model.Order ke TransactionInfo untuk respons yang bersih ke React
    var transactions []TransactionInfo
    for _, order := range orders {
        username := ""
        if order.User != nil {
            username = order.User.Username // Mengambil Username dari relasi User
        }

        transactions = append(transactions, TransactionInfo{
            ID:         order.ID,
            Username:   username,
            TotalPrice: order.TotalPrice, 
            Status:     order.Status,     
        })
    }
	
	c.JSON(http.StatusOK, transactions)
}


// =========================================================================
// 3. HANDLER: DELETE TRANSACTION [Route: DELETE /api/admin/transactions/:id]
// =========================================================================

func DeleteTransaction(c *gin.Context) {
    transactionIDStr := c.Param("id")
    
    // Konversi ID dari string ke uint
    transactionID, err := strconv.ParseUint(transactionIDStr, 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid transaction ID format"})
        return
    }

    // 1. Cari transaksi
    var order models.Order
    if result := database.DB.First(&order, transactionID); result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Transaction not found"})
        return
    }

    // 2. Hapus Order Items terkait (untuk mencegah error foreign key)
    // Asumsi: model.OrderItem memiliki field OrderID sebagai foreign key
    if err := database.DB.Where("order_id = ?", order.ID).Delete(&models.OrderItem{}).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete related order items"})
        return
    }
    
    // 3. Hapus Order itu sendiri
    if err := database.DB.Delete(&order).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete transaction"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Transaksi ID " + transactionIDStr + " berhasil dihapus."})
}