package com.thuong.backend.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.apache.poi.ss.usermodel.*;
import java.util.Iterator;

import com.thuong.backend.entity.Brand;
import com.thuong.backend.entity.Category;
import com.thuong.backend.entity.Product;
import com.thuong.backend.repository.BrandRepository;
import com.thuong.backend.repository.CategoryRepository;
import com.thuong.backend.repository.ProductRepository;
import com.thuong.backend.service.FileStorageService;
import com.thuong.backend.service.ProductService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private FileStorageService fileStorageService; // Sử dụng service lưu file
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private ProductRepository productRepository;

    public void setProductCategory(Product product, Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElse(null);
        if (category != null) {
            product.setCategory(category);
        } else {
            // Xử lý trường hợp không tìm thấy category với ID đã cho
        }
    }

    @GetMapping("/products")
    public List<Product> getProducts() {
        return productService.getAllProducts();
    }
    @GetMapping("/productss")
    public List<Product> getProductss() {
        return productService.getAllProductss();
    }

    @PostMapping("/product")
    public ResponseEntity<Product> uploadProduct(
            @RequestParam("name") String name,
            @RequestParam("screen") String screen,
            @RequestParam("display") String display,
            @RequestParam("price") double price,
            @RequestParam("salePrice") double salePrice,
            @RequestParam("totalStock") Long totalStock,
            @RequestParam("stock") Long stock,
            @RequestParam("screenTechnology") String screenTechnology,
            @RequestParam("screenResolution") String screenResolution,
            @RequestParam("mainCamera") String mainCamera,
            @RequestParam("frontCamera") String frontCamera,
            @RequestParam("chipset") String chipset,
            @RequestParam("ram") String ram,
            @RequestParam("internalMemory") String internalMemory,
            @RequestParam("operatingSystem") String operatingSystem,
            @RequestParam("battery") String battery,
            @RequestParam("weight") String weight,
            @RequestParam("description") String description,
            @RequestParam("categoryId") Long categoryId, // Thêm categoryId
            @RequestParam("brandId") Long brandId, // Thêm brandId
            @RequestParam("colors") List<String> colors,
            @RequestParam("files") List<MultipartFile> files) {
        List<String> imagePaths = new ArrayList<>();

        for (MultipartFile file : files) {
            String imagePath = fileStorageService.saveFile(file);
            if (imagePath != null) {
                imagePaths.add(imagePath);
            }
        }

        Product product = new Product();
        product.setName(name);
        product.setScreen(screen);
        product.setDisplay(display);
        product.setPrice(price);
        product.setSalePrice(salePrice);
        product.setTotalStock(totalStock);
        product.setStock(stock);
        product.setScreenTechnology(screenTechnology);
        product.setScreenResolution(screenResolution);
        product.setMainCamera(mainCamera);
        product.setFrontCamera(frontCamera);
        product.setChipset(chipset);
        product.setRam(ram);
        product.setInternalMemory(internalMemory);
        product.setOperatingSystem(operatingSystem);
        product.setBattery(battery);
        product.setWeight(weight);
        product.setDescription(description);
        product.setColors(colors); // Lưu danh sách các màu sắc
        product.setImagePaths(imagePaths); // Lưu nhiều đường dẫn hình ảnh
        Category category = categoryRepository.findById(categoryId).orElse(null);
        Brand brand = brandRepository.findById(brandId).orElse(null);

        if (category != null && brand != null) {
            // Gán đối tượng Category và Brand vào Product
            product.setCategory(category);
            product.setBrand(brand);
        } else {
            // Xử lý nếu không tìm thấy Category hoặc Brand
            // Trả về lỗi hoặc gán giá trị mặc định
            return ResponseEntity.badRequest().build(); // Trả về lỗi nếu không tìm thấy category hoặc brand
        }
        Product savedProduct = productService.saveProduct(product);
        return ResponseEntity.ok(savedProduct);
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy sản phẩm
        }
    }

    @GetMapping("/products/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategoryId(@PathVariable Long categoryId) {
        List<Product> products = productService.getProductsByCategoryId(categoryId);
        if (products.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("/products/brand/{brandId}")
    public ResponseEntity<List<Product>> getProductsByBrandId(@PathVariable Long brandId) {
        List<Product> products = productService.getProductsByBrandId(brandId);
        if (products.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }

    @PutMapping("/product/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("screen") String screen,
            @RequestParam("display") String display,
            @RequestParam("price") double price,
            @RequestParam("salePrice") double salePrice,
            @RequestParam("totalStock") Long totalStock,
            @RequestParam("stock") Long stock,
            @RequestParam("screenTechnology") String screenTechnology,
            @RequestParam("screenResolution") String screenResolution,
            @RequestParam("mainCamera") String mainCamera,
            @RequestParam("frontCamera") String frontCamera,
            @RequestParam("chipset") String chipset,
            @RequestParam("ram") String ram,
            @RequestParam("internalMemory") String internalMemory,
            @RequestParam("operatingSystem") String operatingSystem,
            @RequestParam("battery") String battery,
            @RequestParam("weight") String weight,
            @RequestParam("description") String description,

            @RequestParam("colors") List<String> colors,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("categoryId") Long categoryId, // Thêm categoryId
            @RequestParam("brandId") Long brandId) { // Thêm brandId) {
        List<String> imagePaths = new ArrayList<>();

        for (MultipartFile file : files) {
            String imagePath = fileStorageService.saveFile(file);
            if (imagePath != null) {
                imagePaths.add(imagePath);
            }
        }

        Product updatedProduct = new Product();
        updatedProduct.setName(name);
        updatedProduct.setScreen(screen);
        updatedProduct.setDisplay(display);
        updatedProduct.setPrice(price);
        updatedProduct.setSalePrice(salePrice);
        updatedProduct.setTotalStock(totalStock);
        updatedProduct.setStock(stock);
        updatedProduct.setScreenTechnology(screenTechnology);
        updatedProduct.setScreenResolution(screenResolution);
        updatedProduct.setMainCamera(mainCamera);
        updatedProduct.setFrontCamera(frontCamera);
        updatedProduct.setChipset(chipset);
        updatedProduct.setRam(ram);
        updatedProduct.setInternalMemory(internalMemory);
        updatedProduct.setOperatingSystem(operatingSystem);
        updatedProduct.setBattery(battery);
        updatedProduct.setWeight(weight);
        updatedProduct.setDescription(description);
        updatedProduct.setColors(colors);
        updatedProduct.setImagePaths(imagePaths);

        Product product = productService.updateProduct(id, updatedProduct, categoryId, brandId);
        if (product != null) {
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy sản phẩm
        }
    }

    @PutMapping("/product/{id}/update-stock")
    public ResponseEntity<Product> updateProductStock(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        Integer quantity = body.get("quantity");
        Product product = productService.getProductById(id);

        if (product != null) {
            if (product.getStock() >= quantity) {
                product.setStock(product.getStock() - quantity); // Giảm số lượng trong kho
                Product updatedProduct = productService.saveProduct(product);
                return ResponseEntity.ok(updatedProduct);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Nếu không đủ số lượng
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<Void> deleteProducts(@PathVariable Long id) {
        Product product = productService.getProductById(id);

        if (product != null) {
            productService.deleteProducts(id); // Call the service layer to delete the product
            return ResponseEntity.noContent().build(); // Return a 204 No Content status
        } else {
            return ResponseEntity.notFound().build(); // Return 404 if the product is not found
        }
    }

    @GetMapping("/products/count")
    public ResponseEntity<Long> getTotalProductsCount() {
        long count = productService.getTotalProductsCount();
        return ResponseEntity.ok(count); // Trả về số lượng sản phẩm
    }

    @GetMapping("/count-today")
    public ResponseEntity<Long> getTotalProductsAddedToday() {
        try {
            long count = productService.getTotalProductsAddedToday();
            return ResponseEntity.ok(count); // Trả về tổng số lượng sản phẩm trong ngày
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // Trả về lỗi nếu xảy ra
        }
    }

    @PostMapping("/upload-excel")
    public String uploadExcelFile(@RequestParam("file") MultipartFile file) {
        try {
            // Đọc file Excel
            Workbook workbook = new XSSFWorkbook(file.getInputStream());
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            // Danh sách sản phẩm không hợp lệ
            List<Product> invalidProducts = new ArrayList<>();

            // Bỏ qua dòng đầu tiên (tiêu đề cột)
            if (rows.hasNext())
                rows.next();

            // Duyệt qua các dòng trong sheet
            while (rows.hasNext()) {
                Row row = rows.next();

                // Kiểm tra dữ liệu quan trọng (ví dụ: name và price)
                if (row.getCell(0) == null || row.getCell(0).getStringCellValue().isEmpty() ||
                        row.getCell(3) == null || row.getCell(3).getCellType() != CellType.NUMERIC) {
                    Product invalidProduct = new Product();
                    invalidProduct.setName(row.getCell(0) != null ? getCellValue(row.getCell(0)) : "");
                    invalidProduct.setPrice(row.getCell(3) != null ? parseDouble(getCellValue(row.getCell(3))) : 0);
                    invalidProducts.add(invalidProduct);
                    continue; // Bỏ qua sản phẩm không hợp lệ
                }

                // Lấy các giá trị từ các cột trong dòng hiện tại
                Product product = new Product();
                product.setName(getCellValue(row.getCell(0))); // Name
                product.setScreen(getCellValue(row.getCell(1))); // Screen
                product.setDisplay(getCellValue(row.getCell(2))); // Display
                product.setPrice(parseDouble(getCellValue(row.getCell(3)))); // Price
                product.setSalePrice(parseDouble(getCellValue(row.getCell(4)))); // SalePrice
                product.setTotalStock(parseLong(getCellValue(row.getCell(5)))); // TotalStock
                product.setStock(parseLong(getCellValue(row.getCell(6)))); // Stock
                product.setDescription(getCellValue(row.getCell(7))); // Description

                // Kiểm tra trùng lặp và lưu vào cơ sở dữ liệu
                Optional<Product> existingProduct = productRepository.findByName(product.getName());
                if (existingProduct.isPresent()) {
                    Product existing = existingProduct.get();
                    existing.setPrice(product.getPrice());
                    existing.setTotalStock(product.getTotalStock()); // Không cộng dồn TotalStock
                    existing.setStock(product.getStock()); // Cập nhật Stock
                    productRepository.save(existing);
                } else {
                    productRepository.save(product);
                }
            }

            workbook.close();

            // Ghi log hoặc hiển thị sản phẩm không hợp lệ
            if (!invalidProducts.isEmpty()) {
                System.out.println("Danh sách sản phẩm không hợp lệ:");
                invalidProducts.forEach(invalid -> {
                    System.out.println("Tên: " + invalid.getName() + ", Giá: " + invalid.getPrice());
                });
            }

            return "File Excel đã được nhập thành công!";
        } catch (IOException e) {
            e.printStackTrace();
            return "Lỗi khi đọc file Excel: " + e.getMessage();
        }
    }

    private String getCellValue(Cell cell) {
        if (cell == null)
            return ""; // Trả về chuỗi rỗng nếu cell null

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                // Đảm bảo không chuyển đổi nhầm kiểu
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                }
                return String.valueOf((long) cell.getNumericCellValue()); // Ép kiểu về long nếu là số
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return ""; // Trả về chuỗi rỗng nếu không phải kiểu trên
        }
    }

    private double parseDouble(String value) {
        if (value == null || value.isEmpty())
            return 0.0; // Trả về 0 nếu giá trị rỗng
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return 0.0; // Trả về 0 nếu không thể chuyển đổi
        }
    }

    private long parseLong(String value) {
        if (value == null || value.trim().isEmpty())
            return 0L; // Kiểm tra chuỗi trống
        try {
            return Long.parseLong(value.trim()); // Loại bỏ khoảng trắng trước khi parse
        } catch (NumberFormatException e) {
            e.printStackTrace(); // In lỗi ra console để debug
            return 0L;
        }
    }
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateProductStatus(@PathVariable Long id, @RequestBody Map<String, Integer> statusUpdate) {
        Integer newStatus = statusUpdate.get("status");
        productService.updateProductStatus(id, newStatus);
        return ResponseEntity.ok().build();
    }
}