package models

import ()

// untuk update status order
type UpdateOrderStatusInput struct{
	Status string `json:"status" binding:"required,oneof='Menunggu Pembayaran' 'Diproses' 'Dikirim' 'Selesai' 'Dibatalkan'"` 
}