package com.thuong.backend.dto;

import lombok.Data;

@Data
public class OrderItemResponse {
    private Long productId;
    private String productName;
    private double price;
    private int quantity;
    private String selectedColor;

    public OrderItemResponse(Long productId, String productName, double price, int quantity, String selectedColor) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.selectedColor = selectedColor;
    }

    // Getters và Setters
}
