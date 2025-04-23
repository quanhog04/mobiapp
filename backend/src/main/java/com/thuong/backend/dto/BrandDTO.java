package com.thuong.backend.dto;

public class BrandDTO {
    private Long id;
    private String name;
    private String image;
    private Long categoryId;

    // Constructors
    public BrandDTO(Long id, String name, String image, Long categoryId) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.categoryId = categoryId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}