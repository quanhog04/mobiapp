package com.thuong.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderDetailRequest {
    private Long id;
    private Long orderId;
    private String productName;
    private Integer quantity;
    private String price;
}

