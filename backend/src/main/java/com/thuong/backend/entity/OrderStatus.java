package com.thuong.backend.entity;

public enum OrderStatus {
    PENDING_CONFIRMATION,    // Đang chờ xác nhận
    CONFIRMED,               // Đã xác nhận
    PREPARING,               // Đang chuẩn bị hàng
    ORDER_SUCCESS,           // Lên đơn hàng thành công
    SHIPPING,                // Đang vận chuyển
    DELIVERED_SUCCESSFULLY,  // Giao hàng thành công
    DELIVERY_FAILED          // Giao thất bại
}
