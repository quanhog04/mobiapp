package com.thuong.backend.controller;

import com.thuong.backend.entity.Banner;
import com.thuong.backend.service.BannerService;
import com.thuong.backend.service.FileStorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BannerController {

    @Autowired
    private BannerService bannerService;
    @Autowired
    private FileStorageService fileStorageService;

   @GetMapping("/banners")
    public List<Banner> getBanners() {
        return bannerService.getAllBanners();
    }

    @PostMapping("/banners")
    public ResponseEntity<Banner> uploadBanner(
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
    Banner banner = new Banner();
    banner.setName(name);   // Lưu tên Banner
    banner.setImage(image); // Lưu tên file ảnh vào database

    // Lưu banner vào database và trả về kết quả
    Banner savedBanner = bannerService.saveBanner(banner);
    return ResponseEntity.ok(savedBanner);
}


    @DeleteMapping("/banners/{id}")
    public ResponseEntity<Void> deleteBanner(@PathVariable Long id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/banners")
    public ResponseEntity<Void> deleteAllBanners() {
        bannerService.deleteAllBanners();
        return ResponseEntity.noContent().build();
    }
}