package com.thuong.backend.dto;

import java.util.List;

import lombok.Data;
@Data
public class OrderRequest {
    private Long userId;
    private double totalAmount; 
    private String address; 
    private String orderCode;
    private List<OrderItemRequest> orderItems; // Danh sách sản phẩm

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<OrderItemRequest> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemRequest> orderItems) {
        this.orderItems = orderItems;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }
}