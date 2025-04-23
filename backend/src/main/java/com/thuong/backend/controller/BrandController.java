package com.thuong.backend.controller;

import com.thuong.backend.dto.BrandDTO;
import com.thuong.backend.entity.Brand;
import com.thuong.backend.service.BrandService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class BrandController {

    @Autowired
    private BrandService brandService;

    @GetMapping("/brands/category/{id}")
    public List<Brand> getBrandsByCategory(@PathVariable Long id) {
        return brandService.getBrandsByCategoryId(id);
    }

    @GetMapping("/brands")
    public List<BrandDTO> getAllBrands() {
        return brandService.getAllBrandDTOs();
    }

    // Lấy brand theo ID
    @GetMapping("/brands/{id}")
    public Brand getBrandById(@PathVariable Long id) {
        return brandService.getBrandById(id);
    }

    // Thêm mới một brand
    @PostMapping("/brands")
public ResponseEntity<Brand> createBrand(
        @RequestParam("name") String name,
        @RequestParam("categoryId") Long categoryId,
        @RequestParam("file") MultipartFile file) {

    try {
        // Gọi BrandService để tạo Brand
        Brand newBrand = brandService.createBrand(name, categoryId, file);
        return ResponseEntity.ok(newBrand);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(null);
    }
}



@PutMapping("/brands/{id}")
public ResponseEntity<Brand> updateBrand(
        @PathVariable Long id,
        @RequestParam("name") String name,
        @RequestParam(value = "categoryId", required = false) Long categoryId,
        @RequestParam(value = "file", required = false) MultipartFile file) {

    try {
        // Gọi BrandService để cập nhật Brand
        Brand updatedBrand = brandService.updateBrand(id, name, categoryId, file);
        return ResponseEntity.ok(updatedBrand);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(null);
    }
}


    // Xóa brand
    @DeleteMapping("/brands/{id}")
    public void deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
    }
}