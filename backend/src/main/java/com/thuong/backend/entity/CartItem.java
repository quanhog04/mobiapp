package com.thuong.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId; // ID sản phẩm
    private String productName; // Tên sản phẩm
    private double price; // Giá sản phẩm (thay đổi kiểu dữ liệu thành double)
    private int quantity; // Số lượng sản phẩm
    private int stock;
    private String selectedColor; // Màu sản phẩm đã chọn
    private String selectedImagePath; // Đường dẫn hình ảnh tương ứng với màu đã chọn

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    // Constructors, getters, setters
    public CartItem() {}

    public CartItem(Long productId, String productName, double price, int quantity, int stock, String selectedColor, String selectedImagePath) {
        this.productId = productId;
        this.productName = productName;
        this.price = price; // Chỉnh sửa kiểu dữ liệu thành double
        this.quantity = quantity;
        this.stock = stock;
        this.selectedColor = selectedColor;
        this.selectedImagePath = selectedImagePath;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public double getPrice() {
        return price; // Thay đổi kiểu trả về thành double
    }

    public void setPrice(double price) { // Thay đổi kiểu tham số thành double
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getSelectedColor() {
        return selectedColor;
    }

    public void setSelectedColor(String selectedColor) {
        this.selectedColor = selectedColor;
    }

    public String getSelectedImagePath() {
        return selectedImagePath;
    }

    public void setSelectedImagePath(String selectedImagePath) {
        this.selectedImagePath = selectedImagePath;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }
}
