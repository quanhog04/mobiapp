package com.thuong.backend.controller;

import com.thuong.backend.entity.Category;
import com.thuong.backend.service.CategoryService;
import com.thuong.backend.service.FileStorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;
    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/categories")
    public List<Category> getCategories() {
        return categoryService.getAllCategories();
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> uploadBanner(
    @RequestParam("name") String name,  // Tham số 'name'
    @RequestParam("file") MultipartFile file) {  // Tham số 'file' chứa ảnh

    // Kiểm tra xem file có tồn tại hay không
    if (file.isEmpty()) {
        return ResponseEntity.badRequest().body(null);  // Trả về lỗi nếu file trống
    }

    // Lưu file và lấy tên file
    String image = fileStorageService.saveFile(file);
    if (image == null) {
        throw new RuntimeException("Failed to save image file");
    }

    // Tạo mới đối tượng Banner
    Category Category = new Category();
    Category.setName(name);   // Lưu tên Category
    Category.setImage(image); // Lưu tên file ảnh vào database

    // Lưu Category vào database và trả về kết quả
    Category savedCategory = categoryService.saveCategory(Category);
    return ResponseEntity.ok(savedCategory);
}
@PutMapping("/categories/{id}")
public ResponseEntity<Category> updateCategory(
        @PathVariable Long id,
        @RequestParam("name") String name,
        @RequestParam(value = "file", required = false) MultipartFile file) {

    try {
        // Gọi CategoryService để cập nhật Category
        Category updatedCategory = categoryService.updateCategory(id, name, file);
        return ResponseEntity.ok(updatedCategory);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(null);
    }
}
// Xóa Category
@DeleteMapping("/categories/{id}")
public void deleteCategory(@PathVariable Long id) {
    categoryService.deleteCategory(id);
}
}