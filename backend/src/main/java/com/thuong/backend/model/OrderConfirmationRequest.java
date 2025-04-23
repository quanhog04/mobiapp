package com.thuong.backend.model;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderConfirmationRequest {
    private String userEmail;
    private String orderCode;
    private String total;
    private String customerName;
    private String customerAddress;
    private String customerPhone;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private String otherName;
    private String otherPhone;
    private String note;
    private String shopName;

    private List<OrderDetailRequest> orderDetailRequests;
}