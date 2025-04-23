package com.thuong.backend.controller;

import jakarta.mail.internet.MimeMessage;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thuong.backend.model.OrderConfirmationRequest;
import com.thuong.backend.model.OrderDetailRequest;

import java.text.DecimalFormat;
import java.time.LocalDate;

@RequestMapping("/api/email-order")
@RestController
public class OrderEmailController {
    private final JavaMailSender mailSender;

    public OrderEmailController(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @PostMapping("/success")
    public String sendOrderConfirmation(@RequestBody OrderConfirmationRequest emailRequest) {
    try {
        // Kiểm tra đầu vào
        if (emailRequest == null || emailRequest.getOrderDetailRequests() == null) {
            return "Dữ liệu đơn hàng không hợp lệ!";
        }

        // Xây dựng nội dung chi tiết đơn hàng
        StringBuilder orderDetailsHtml = new StringBuilder();
        double totalAmount = 0;
        int totalQuantity = 0;
        orderDetailsHtml.append("<table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>")
                .append("<thead>")
                .append("<tr style='background-color: #f8f8f8; text-align: left;'>")
                .append("<th style='padding: 10px; border: 1px solid #ddd; text-align: center;'>Sản phẩm</th>")
                .append("<th style='padding: 10px; border: 1px solid #ddd; text-align: center;'>Số lượng</th>")
                .append("<th style='padding: 10px; border: 1px solid #ddd; text-align: center;'>Thành tiền</th>")
                .append("</tr>")
                .append("</thead>")
                .append("<tbody>");

        for (OrderDetailRequest detail : emailRequest.getOrderDetailRequests()) {
            double price = Double.parseDouble(detail.getPrice());
            double productTotal = detail.getQuantity() * price;
            totalAmount += productTotal;
            totalQuantity += detail.getQuantity();

            orderDetailsHtml.append("<tr>")
                    .append("<td style='padding: 10px; border: 1px solid #ddd;'>")
                    .append(detail.getProductName())
                    .append("</td>")
                    .append("<td style='padding: 10px; border: 1px solid #ddd; text-align: center;'>")
                    .append(detail.getQuantity())
                    .append("</td>")
                    .append("<td style='padding: 10px; border: 1px solid #ddd; text-align: center;'>")
                    .append(CurrencyFormatter.formatAmount(String.valueOf(detail.getPrice())))
                    .append("</td>")
                    .append("</tr>");

        }
        orderDetailsHtml.append("</tbody>")
                .append("</table>");
                // Tổng tiền và thông tin khác
        orderDetailsHtml.append("<div style='margin-top: 20px; padding: 10px; background-color: #fff8f5; border: 1px solid #f5c6cb;'>")
        .append("<p class='total-order'><b>Tổng giá trị sản phẩm:</b> " + CurrencyFormatter.formatAmount(String.valueOf(totalAmount)) + "</p>")
        .append("<p>(Đã bao gồm VAT)</p>")
        .append("</div>");

        // Tạo nội dung email
        String emailContent = buildEmailContent(emailRequest, orderDetailsHtml.toString(), totalAmount, totalQuantity);

        // Gửi email
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom("hogquan1122@gmail.com");
        helper.setTo(emailRequest.getUserEmail());
        helper.setSubject("Xác nhận đơn hàng #" + emailRequest.getOrderCode());
        helper.setText(emailContent, true);

        mailSender.send(message);

        return "Email xác nhận đã được gửi thành công!";
    } catch (Exception e) {
        // Ghi log lỗi
        System.err.println("Lỗi khi gửi email xác nhận: " + e.getMessage());
        return "Có lỗi xảy ra khi gửi email: " + e.getMessage();
    }
}

private String buildEmailContent(OrderConfirmationRequest emailRequest, String orderDetailsHtml, double totalAmount,
        int totalQuantity) {
    LocalDate estimatedDeliveryDate = LocalDate.now().plusDays(3);

    return "<html>" +
        "<head>" +
        "<style>" +
        "body { font-family: Arial, sans-serif; background-color: #f9f9f9; line-height: 1.6; margin: 0; padding: 20px; }" +
        ".email-container { max-width: 800px; margin: auto; background: #fff; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1); padding: 20px; }" +
        ".header { background-color: rgb(216, 231, 6); padding: 10px; border-radius: 5px 5px 0 0; }" +
        ".header h1 { margin: 0; color: #fff; font-size: 24px; }" +
        ".content { margin-top: 20px; text-align: center; }" +
        ".order-details { margin-top: 20px; }" +
        ".info-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 5px 0; border-bottom: 1px solid #f1f1f1; }" +
        ".info-row .label { font-weight: bold; color: #555; }" +
        ".info-row .value { text-align: right; color: #000; }" +
        ".footer { margin-top: 40px; font-size: 14px; color: #555; }" +
        ".total-order { color: #d70018; font-weight: bold; font-size: 18px; }" +
        "</style>" +
        "</head>" +
        "<body>" +
        "<div class='email-container'>" +
        "<div class='header'>" +
        "<h1 style='text-align: center;'>PNT <span style='color:#000'>Shop</span></h1>" +
        "</div>" +
        "<div class='content'>" +
        "<p style='text-align: left;'>Kính chào khách hàng&nbsp;<span style='color:rgb(8, 8, 8); font-weight: bold;'>" + emailRequest.getCustomerName() + "</span></p>" +
        "<p style='text-align: left;'>Đơn hàng #" + emailRequest.getOrderCode() + " quý khách đặt tại <span style='color: #007bff; font-weight: bold;'>PNTShop</span> đã được xác nhận thanh toán thành công.</p>" +
        "<div style='margin-bottom: 30px;'>" +
        "<h3 style='color: #d70018;'>THÔNG TIN KHÁCH HÀNG</h3>" +
        "<div class='info-row'><span class='label'>Người nhận:&nbsp;</span><span class='value'>" +emailRequest.getCustomerName() + "</span></div>" +
        "<div class='info-row'><span class='label'>Số điện thoại:&nbsp;</span><span class='value'>" +emailRequest.getCustomerPhone() + "</span></div>" +
        "<div class='info-row'><span class='label'>Email:&nbsp;</span><span class='value'>" +emailRequest.getUserEmail() + "</span></div>" +
        "<div class='info-row'><span class='label'>Địa chỉ nhận hàng:&nbsp;</span><span class='value'>" +emailRequest.getCustomerAddress() + "</span></div>" +
        "</div>" +
        "<h3 style='color: #d70018;'>THÔNG TIN ĐƠN HÀNG</h3>" +
        "<div class='info-row'><span class='label'>Ngày đặt hàng:&nbsp;</span><span class='value'>"+LocalDate.now() + "</span></div>" +
        "<div class='info-row'><span class='label'>Dự kiến giao:&nbsp;</span><span class='value'>" +estimatedDeliveryDate + "</span></div>" +
        "<div class='order-details'>" + orderDetailsHtml + "</div>" +
        
        "</div>" +
        "<div class='footer' style='text-align: center;'>" +
        "<p>Chúc bạn luôn có những trải nghiệm tuyệt vời khi mua sắm tại <span style='color: #007bff; font-weight: bold;'>PNTShop</span>.</p>" +
        "<p>Tổng đài hỗ trợ miễn phí: <span style='color:#d70018;'>0702775390</span></p>" +
        "<p>Email hỗ trợ: nt.6924.thuong@gmail.com</p>" +
        "<p style='font-weight: bold;'><span style='color: #007bff; font-weight: bold;'>PNTShop</span> cảm ơn quý khách.</p>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</body>" +
        "</html>";
        }


    public class CurrencyFormatter {
    public static String formatAmount(String amountString) {
        try {
            double amount = Double.parseDouble(amountString);
            DecimalFormat formatter = new DecimalFormat("#,###");
            return formatter.format(amount) + " VNĐ";
        } catch (NumberFormatException e) {
            return "Invalid amount";
        }
    }
}

}
