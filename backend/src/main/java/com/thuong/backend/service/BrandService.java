package com.thuong.backend.service;

import com.thuong.backend.dto.BrandDTO;
import com.thuong.backend.entity.Brand;
import com.thuong.backend.entity.Category;
import com.thuong.backend.repository.BrandRepository;
import com.thuong.backend.repository.CategoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Brand> getBrandsByCategoryId(Long id) {
        return brandRepository.findAll()
                .stream()
                .filter(brand -> brand.getCategory().getId().equals(id))
                .toList();
    }
    public List<BrandDTO> getAllBrandDTOs() {
    return brandRepository.findAll().stream()
            .map(brand -> new BrandDTO(
                    brand.getId(),
                    brand.getName(),
                    brand.getImage(),
                    brand.getCategory() != null ? brand.getCategory().getId() : null
            ))
            .collect(Collectors.toList());
}

    public Brand getBrandById(Long id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found with ID: " + id));
    }

    public Brand createBrand(String name, Long categoryId, MultipartFile file) {
        // Lưu file và lấy đường dẫn
        String fileName = fileStorageService.saveFile(file);
        if (fileName == null) {
            throw new RuntimeException("Failed to save image file");
        }
    
        // Tìm category từ ID
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + categoryId));
    
        // Tạo brand mới
        Brand brand = new Brand();
        brand.setName(name);
        brand.setImage(fileName);
        brand.setCategory(category);
    
        return brandRepository.save(brand);
    }
    

    public Brand updateBrand(Long id, String name, Long categoryId, MultipartFile file) {
        Brand existingBrand = getBrandById(id);
    
        // Cập nhật thông tin
        existingBrand.setName(name);
    
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found with ID: " + categoryId));
            existingBrand.setCategory(category);
        }
    
        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.saveFile(file);
            if (fileName == null) {
                throw new RuntimeException("Failed to save image file");
            }
            existingBrand.setImage(fileName);
        }
    
        return brandRepository.save(existingBrand);
    }
    

    public void deleteBrand(Long id) {
        Brand brand = getBrandById(id);
        brandRepository.delete(brand);
    }

}
