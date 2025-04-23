package com.thuong.backend.service;

import com.thuong.backend.entity.Banner;
import com.thuong.backend.repository.BannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class BannerService {

    @Autowired
    private BannerRepository bannerRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public List<Banner> getAllBanners() {
        return bannerRepository.findAll();
    }

    public Banner createBanner(String name, MultipartFile image) {
        String fileName = fileStorageService.saveFile(image); // Lưu file sử dụng FileStorageService
        if (fileName == null) {
            throw new RuntimeException("Failed to save image file");
        }

        Banner banner = new Banner();
        banner.setName(name);
        banner.setImage(fileName); // Lưu tên file vào database
        return bannerRepository.save(banner);
    }

    
    // Xóa banner theo ID
    public void deleteBanner(Long id) {
        Banner banner = bannerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Banner not found"));

        String imageName = banner.getImage();
        if (imageName != null) {
            fileStorageService.deleteFile(imageName); // Xóa file thông qua FileStorageService
        }

        bannerRepository.deleteById(id);
    }

    // Xóa tất cả banners
    public void deleteAllBanners() {
        List<Banner> banners = bannerRepository.findAll();
        for (Banner banner : banners) {
            String imageName = banner.getImage();
            if (imageName != null) {
                fileStorageService.deleteFile(imageName); // Xóa file
            }
        }
        bannerRepository.deleteAll();
    }
    public Banner saveBanner(Banner banner) {
        return bannerRepository.save(banner);
    }
}
