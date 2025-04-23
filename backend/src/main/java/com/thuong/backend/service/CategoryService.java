package com.thuong.backend.service;

import com.thuong.backend.entity.Category;
import com.thuong.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private FileStorageService fileStorageService;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));
    }
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category createCategory(String name, MultipartFile image) {
        String fileName = fileStorageService.saveFile(image); // Lưu file sử dụng FileStorageService
        if (fileName == null) {
            throw new RuntimeException("Failed to save image file");
        }

        Category category = new Category();
        category.setName(name);
        category.setImage(fileName); // Lưu tên file vào database
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, String name, MultipartFile file) {
        Category existingCategory = getCategoryById(id);
    
        // Cập nhật thông tin
        existingCategory.setName(name);
    
        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.saveFile(file);
            if (fileName == null) {
                throw new RuntimeException("Failed to save image file");
            }
            existingCategory.setImage(fileName);
        }
    
        return categoryRepository.save(existingCategory);
    }
    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}