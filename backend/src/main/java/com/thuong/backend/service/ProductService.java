package com.thuong.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thuong.backend.entity.Brand;
import com.thuong.backend.entity.Category;
import com.thuong.backend.entity.Product;
import com.thuong.backend.repository.BrandRepository;
import com.thuong.backend.repository.CategoryRepository;
import com.thuong.backend.repository.ProductRepository;


@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private CategoryRepository categoryRepository;

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // Thêm phương thức này
    public List<Product> getProductsByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }
    public List<Product> getProductsByBrandId(Long brandId) {
        return productRepository.findByBrandId(brandId);
    }
    
    public List<Product> getAllProducts() {
        return productRepository.findAllVisibleProducts(); // Đảm bảo rằng repository không trả về danh sách rỗng
    }
    public List<Product> getAllProductss() {
        return productRepository.findAll(); // Đảm bảo rằng repository không trả về danh sách rỗng
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    public Product updateProduct(Long id, Product updatedProduct, Long categoryId, Long brandId) {
        Optional<Product> existingProductOpt = productRepository.findById(id);
        
        if (existingProductOpt.isPresent()) {
            Product existingProduct = existingProductOpt.get();
            
            // Cập nhật các thông tin của sản phẩm
            existingProduct.setName(updatedProduct.getName());
            existingProduct.setScreen(updatedProduct.getScreen());
            existingProduct.setDisplay(updatedProduct.getDisplay());
            existingProduct.setPrice(updatedProduct.getPrice());
            existingProduct.setSalePrice(updatedProduct.getSalePrice());
            existingProduct.setTotalStock(updatedProduct.getTotalStock());
            existingProduct.setStock(updatedProduct.getStock());
            existingProduct.setScreenTechnology(updatedProduct.getScreenTechnology());
            existingProduct.setScreenResolution(updatedProduct.getScreenResolution());
            existingProduct.setMainCamera(updatedProduct.getMainCamera());
            existingProduct.setFrontCamera(updatedProduct.getFrontCamera());
            existingProduct.setChipset(updatedProduct.getChipset());
            existingProduct.setRam(updatedProduct.getRam());
            existingProduct.setInternalMemory(updatedProduct.getInternalMemory());
            existingProduct.setOperatingSystem(updatedProduct.getOperatingSystem());
            existingProduct.setBattery(updatedProduct.getBattery());
            existingProduct.setWeight(updatedProduct.getWeight());
            existingProduct.setDescription(updatedProduct.getDescription());
            existingProduct.setColors(updatedProduct.getColors());
            existingProduct.setImagePaths(updatedProduct.getImagePaths());
             // Lấy đối tượng Category và Brand từ cơ sở dữ liệu
        Category category = categoryRepository.findById(categoryId).orElse(null);
        Brand brand = brandRepository.findById(brandId).orElse(null);

        if (category != null && brand != null) {
            // Cập nhật Category và Brand cho sản phẩm
            existingProduct.setCategory(category);
            existingProduct.setBrand(brand);
        } else {
            return null;  // Trả về null nếu không tìm thấy category hoặc brand
        }

            
            return productRepository.save(existingProduct);
        }
        
        return null;  // Trả về null nếu không tìm thấy sản phẩm
    }
    public void deleteProducts(Long id) {
        Optional<Product> productOpt = productRepository.findById(id);
    
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
    
            // If you want to delete related image paths, make sure to remove them from the file system
            if (product.getImagePaths() != null) {
                for (String imagePath : product.getImagePaths()) {
                    // Assuming fileStorageService.deleteFile() removes the file from the system
                    fileStorageService.deleteFile(imagePath);
                }
            }
    
            // Delete any related colors if necessary (depending on your application logic)
            // You may want to delete from a related table or handle it differently
            // product.getColors().clear(); // If you have a list of colors stored separately
    
            // Finally, delete the product itself
            productRepository.deleteById(id);
        }
    }
    public long getTotalProductsCount() {
        return productRepository.count();  // Trả về tổng số sản phẩm
    }
    public long getTotalProductsAddedToday() {
        return productRepository.countProductsAddedToday();
    }
    public void updateProductStatus(Long id, Integer status) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setStatus(status); // Cập nhật giá trị status
        productRepository.save(product); // Lưu thay đổi
    }
}