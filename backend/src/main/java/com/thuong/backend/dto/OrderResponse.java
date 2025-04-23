package com.thuong.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;
@Data
public class OrderResponse {
    private Long id;
    private LocalDateTime orderDate;
    private double totalAmount;
    private String status;
    private String address;
    private String orderCode;
    private List<OrderItemResponse> orderItems;

    public OrderResponse(Long id, LocalDateTime orderDate, double totalAmount, String status, String address, String orderCode, List<OrderItemResponse> orderItems) {
        this.id = id;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.status = status;
        this.address = address;
        this.orderCode = orderCode;
        this.orderItems = orderItems;
    }

    // Getters và Setters
}
