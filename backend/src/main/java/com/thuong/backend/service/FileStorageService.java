package com.thuong.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Date;


@Component
public class FileStorageService {

    // Đường dẫn thư mục lưu ảnh được cấu hình trong application.properties
    @Value("${file.upload-dir}")
    private String uploadDir;

    // Phương thức lưu file và trả về đường dẫn file đã lưu
     // Phương thức lưu file và trả về đường dẫn file đã lưu
    public String saveFile(MultipartFile file) {
        try {
            String originalFileName = file.getOriginalFilename(); // Lấy tên file gốc
            if (originalFileName == null || originalFileName.isEmpty()) {
                throw new RuntimeException("File name is invalid");
            }

            // Tách phần tên và phần mở rộng của file
            String fileExtension = "";
            int dotIndex = originalFileName.lastIndexOf(".");
            if (dotIndex > 0) {
                fileExtension = originalFileName.substring(dotIndex);
                originalFileName = originalFileName.substring(0, dotIndex);
            }

            // Tạo tên file mới với timestamp
            String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
            String newFileName = originalFileName + "_" + timestamp + fileExtension;

            Path filePath = Paths.get(uploadDir, newFileName); // Tạo đường dẫn lưu trữ file
            
            // Lưu file vào đường dẫn đã định nghĩa
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Trả về tên file mới
            return newFileName;
        } catch (IOException e) {
            e.printStackTrace();
            return null; // Trả về null nếu có lỗi khi lưu file
        }
    }
    public void deleteFile(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir, fileName);
            Files.deleteIfExists(filePath); // Xóa file nếu tồn tại
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to delete file: " + fileName, e);
        }
    }
}
