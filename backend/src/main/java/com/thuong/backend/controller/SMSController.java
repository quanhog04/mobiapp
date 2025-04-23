package com.thuong.backend.controller;

import org.springframework.web.bind.annotation.*;
import com.thuong.backend.otp.SpeedSMSAPI;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@RestController
@RequestMapping("/api/sms")
public class SMSController {

    private static final String API_ACCESS_TOKEN = "m7UkFg2mH5fQDTcXSR9ENYzYa51pRVBz"; // Thay thế bằng access token của bạn
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    // Inject JavaMailSender và TemplateEngine vào controller
    @Autowired
    public SMSController(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    /**
     * Endpoint lấy thông tin tài khoản (email và số dư)
     * 
     * @return Thông tin tài khoản của bạn
     */
    @GetMapping("/userinfo")
    public Map<String, String> getUserInfo() {
        Map<String, String> response = new HashMap<>();
        
        // Khởi tạo SpeedSMSAPI với access token
        SpeedSMSAPI api = new SpeedSMSAPI(API_ACCESS_TOKEN);
        
        try {
            // Lấy thông tin tài khoản
            String userInfo = api.getUserInfo();
            response.put("status", "success");
            response.put("userInfo", userInfo);
        } catch (IOException e) {
            response.put("status", "error");
            response.put("message", "Không thể lấy thông tin tài khoản: " + e.getMessage());
        }
        
        return response;
    }

    /**
     * Endpoint gửi tin nhắn SMS
     * 
     * @param phoneNumber Số điện thoại người nhận
     * @param content Nội dung tin nhắn
     * @param type Loại tin nhắn (2: ngẫu nhiên, 3: brandname, v.v.)
     * @param sender Tên thương hiệu hoặc số điện thoại
     * @return Kết quả gửi SMS
     */
    @PostMapping("/send")
    public Map<String, Object> sendSMS(@RequestParam String phoneNumber, 
                                       @RequestParam String content, 
                                       @RequestParam int type, 
                                       @RequestParam String sender) {
        Map<String, Object> response = new HashMap<>();
        
        // Khởi tạo SpeedSMSAPI với access token
        SpeedSMSAPI api = new SpeedSMSAPI(API_ACCESS_TOKEN);
        
        try {
            // Gửi SMS
            String sendResponse = api.sendSMS(phoneNumber, content, type, sender);
            // Trả về kết quả
            response.put("status", "success");
            response.put("response", sendResponse);
        } catch (IOException e) {
            response.put("status", "error");
            response.put("message", "Lỗi khi gửi SMS: " + e.getMessage());
        }
        
        return response;
    }

    /**
     * Endpoint gửi OTP đến số điện thoại
     * 
     * @param phoneNumber Số điện thoại người nhận OTP
     * @return Kết quả gửi OTP
     */
    @PostMapping("/sendotp")
    public Map<String, Object> sendOTP(@RequestParam String phoneNumber) {
        Map<String, Object> response = new HashMap<>();
        
        // Tạo OTP ngẫu nhiên (6 chữ số)
        String otp = generateOTP();
        
        // Nội dung tin nhắn
        String content = "Mã xác thực của bạn là: " + otp;
        int type = 2;  // Loại tin nhắn là ngẫu nhiên
        String sender = "84702775390";  // Thay thế bằng tên thương hiệu của bạn
        
        try {
            // Gửi OTP
            String sendResponse = new SpeedSMSAPI(API_ACCESS_TOKEN).sendSMS(phoneNumber, content, type, sender);
            response.put("status", "success");
            response.put("message", "OTP đã được gửi thành công.");
            response.put("otp", otp);  // Trả về OTP để kiểm tra trong frontend
            response.put("response", sendResponse);
        } catch (IOException e) {
            response.put("status", "error");
            response.put("message", "Lỗi khi gửi OTP: " + e.getMessage());
        }
        
        return response;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, Object>> sendOtpEmail(@RequestParam String email) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Sinh mã OTP ngẫu nhiên (6 chữ số)
            String otp = generateOTP();

            // Sử dụng Thymeleaf để render template
            Context context = new Context();
            context.setVariable("otp", otp); // Truyền OTP vào template
            String emailContent = templateEngine.process("email-template", context);

            // Tạo đối tượng MimeMessage để gửi email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("nt.6924.thuong@gmail.com");  // Địa chỉ email người gửi
            helper.setTo(email);  // Địa chỉ email người nhận
            helper.setSubject("Mã OTP của bạn");  // Tiêu đề email
            helper.setText(emailContent, true);  // Nội dung email (HTML)

            // Gửi email
            mailSender.send(message);

            // Trả về OTP cho frontend để kiểm tra
            response.put("status", "success");
            response.put("otp", otp);  // Trả về OTP
            return ResponseEntity.ok(response);
        } catch (MessagingException e) {
            response.put("status", "error");
            response.put("message", "Có lỗi xảy ra khi gửi email: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Phương thức tạo mã OTP ngẫu nhiên gồm 6 chữ số
     * 
     * @return Mã OTP dưới dạng chuỗi
     */
    private String generateOTP() {
        return String.valueOf((int) (Math.random() * 900000) + 100000);
    }
}
