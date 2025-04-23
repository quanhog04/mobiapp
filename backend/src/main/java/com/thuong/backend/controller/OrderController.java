package com.thuong.backend.controller;

import java.text.DecimalFormat;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.thuong.backend.dto.OrderItemResponse;
import com.thuong.backend.dto.OrderRequest;
import com.thuong.backend.dto.OrderResponse;
import com.thuong.backend.entity.Order;
import com.thuong.backend.entity.OrderStatus;
import com.thuong.backend.service.OrderService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;
    // Cấu hình thông tin QR Code
    @Value("${vietqr.base-url}")
    private String vietQRBaseUrl;

    @Value("${vietqr.bank-code}")
    private String bankCode;

    @Value("${vietqr.account-number}")
    private String accountNumber;

    @Value("${vietqr.account-name}")
    private String accountName;

    private final ConcurrentHashMap<String, Double> orderCodeMap = new ConcurrentHashMap<>();

    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    private OrderResponse toOrderResponse(Order order) {
        List<OrderItemResponse> items = order.getOrderItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getProductId(),
                        item.getProductName(),
                        item.getPrice(),
                        item.getQuantity(),
                        item.getSelectedColor()))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getStatus().toString(),
                order.getAddress(),
                order.getOrderCode(),
                items);
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Long orderId) {
        try {
            Order order = orderService.getOrderWithItems(orderId);
            return ResponseEntity.ok(toOrderResponse(order)); // Chuyển đổi sang DTO
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng");
        }
    }

    @PutMapping("/orders/{orderId}/status")
    public Order updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        return orderService.updateOrderStatus(orderId, status);
    }

    @GetMapping("/orders/status/{status}")
    public List<Order> getOrdersByStatus(@PathVariable OrderStatus status) {
        return orderService.getOrdersByStatus(status);
    }

    @PostMapping("/orders/payment")
	public ResponseEntity<?> createOrderWithQR(@RequestBody OrderRequest orderRequest) {
		try {
			double totalAmount = orderRequest.getTotalAmount();
			System.out.println("Total Amount: " + totalAmount);

			// Format lại số tiền để bỏ ".00" nếu là số nguyên
			DecimalFormat df = new DecimalFormat("#.##");
			String amountFormatted = df.format(totalAmount);

			String orderCode = "ORD" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
			synchronized (orderCodeMap) {
				if (orderCodeMap.containsKey(orderCode)) {
					orderCodeMap.remove(orderCode);
				}

				String description = "Thanh toán đơn hàng. " + orderCode + ". PNTShop";
				if (description.length() > 50) {
					description = description.substring(0, 50);
				}

				String qrCodeUrl = String.format(
						"%s/image/%s-%s-compact2.png?amount=%s&addInfo=%s&accountName=%s",
						vietQRBaseUrl,
						bankCode,
						accountNumber,
						amountFormatted,
						description,
						accountName);

				orderCodeMap.put(orderCode, totalAmount);

				return ResponseEntity.ok(Map.of(
						"qrCodeUrl", qrCodeUrl,
						"orderCode", orderCode));
			}

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi tạo mã QR");
		}
	}


    @PostMapping("/orders/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
        String matchedOrderCode = null;

        try {
            // Lấy dữ liệu từ Google Sheets
            String sheetUrl = "https://script.google.com/macros/s/AKfycbyrcmEW3i37DgG4KRHHE-vSt5Tzwlm76BziOXQnlAc6AJENY_FxIQWvVeBg7Ju5yTSyHg/exec";
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.getForEntity(sheetUrl, Map.class);

            if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Không thể lấy dữ liệu từ Google Sheets");
            }

            // Lấy danh sách giao dịch từ Google Sheets
            List<Map<String, Object>> transactions = (List<Map<String, Object>>) response.getBody().get("data");

            // Kiểm tra thanh toán
            boolean isPaid = false;

            synchronized (orderCodeMap) {
                for (Map.Entry<String, Double> entry : orderCodeMap.entrySet()) {
                    String orderCode = entry.getKey();
                    String orderNumber = orderCode.substring(3); // Lấy phần số sau "PNT"

                    // Kiểm tra trong danh sách giao dịch
                    isPaid = transactions.stream().anyMatch(tx -> {
                        String description = (String) tx.get("description"); // Lấy chuỗi mô tả
                        if (description == null) {
                            return false; // Bỏ qua nếu mô tả bị null
                        }

                        // Sử dụng regex để tìm "ORD" + số ngẫu nhiên trong description
                        String regex = "\\bORD" + orderNumber + "\\b";
                        return description.matches(".*" + regex + ".*");
                    });

                    if (isPaid) {
                        matchedOrderCode = orderCode; // Gán mã đơn hàng khớp
                        break;
                    }
                }
            }

            if (!isPaid) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Thanh toán chưa hoàn tất");
            }

            // Xóa orderCode khỏi bộ nhớ tạm
            synchronized (orderCodeMap) {
                orderCodeMap.remove(matchedOrderCode);
            }

            // Tạo đơn hàng
            Order createdOrder = orderService.createOrder(orderRequest);
            return ResponseEntity.ok(createdOrder);          
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi tạo đơn hàng: " + e.getMessage());
        }
    }

    @PostMapping("/orders/create-cash")
    public ResponseEntity<?> createOrderCash(@RequestBody OrderRequest orderRequest) {
        try {
            Order createdOrderCash = orderService.createOrderCash(orderRequest);
            return ResponseEntity.ok(createdOrderCash);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi tạo đơn hàng");
        }
    }

    @DeleteMapping("/orders/delete/{orderId}")
    public ResponseEntity<?> deleteOrderById(@PathVariable Long orderId) {
        try {
            orderService.deleteOrderById(orderId); // Gọi service để xóa
            return ResponseEntity.ok("Đã xóa đơn hàng với ID: " + orderId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng với ID: " + orderId);
        }
    }

    @GetMapping("/orders/user/{userId}")
    public ResponseEntity<?> getOrdersByUserId(@PathVariable Long userId) {
        try {
            List<Order> orders = orderService.getOrdersByUserId(userId); // Gọi service để lấy đơn hàng theo userId
            if (orders.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không có đơn hàng nào cho người dùng này");
            }
            return ResponseEntity.ok(orders); // Trả về danh sách đơn hàng
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lấy đơn hàng");
        }
    }
    //tổng doanh thu hôm nay
    @GetMapping("/orders/revenue")
    public ResponseEntity<?> getTodayRevenue() {
        try {
            Double todayRevenue = orderService.getTodayRevenueFromSuccessfulOrders();
            if (todayRevenue == null) {
                todayRevenue = 0.0; // Nếu không có đơn hàng nào, trả về 0
            }
            return ResponseEntity.ok(todayRevenue); // Trả về doanh thu hôm nay dạng JSON
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi tính doanh thu hôm nay");
        }
    }

    // Lấy tổng số lượng tất cả đơn hàng
    @GetMapping("/orders/total")
    public ResponseEntity<?> getTodayTotalOrders() {
        try {
            Long todayOrders = orderService.getTodayOrders();
            if (todayOrders == null || todayOrders == 0) {
                todayOrders = 0L; // Nếu không có đơn hàng nào trong ngày, trả về 0
            }
            return ResponseEntity.ok(todayOrders); // Trả về tổng số lượng đơn hàng trong ngày dưới dạng JSON
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi lấy tổng số lượng đơn hàng trong ngày");
        }
    }

    // Lấy tổng số lượng đơn hàng với trạng thái DELIVERED_SUCCESSFULLY
    @GetMapping("/orders/total-successful")
    public ResponseEntity<?> getTotalTodaySuccessfulOrders() {
        try {
            Long totalTodaySuccessfulOrders = orderService.getTotalTodaySuccessfulOrders();
            if (totalTodaySuccessfulOrders == null || totalTodaySuccessfulOrders == 0) {
                totalTodaySuccessfulOrders = 0L;
            }
            return ResponseEntity.ok(totalTodaySuccessfulOrders); // Trả về tổng số lượng đơn hàng trong ngày
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi lấy tổng số lượng đơn hàng thành công trong ngày");
        }
    }

    @GetMapping("/orders/excluding-status")
    public ResponseEntity<?> getOrdersExcludingStatuses() {
        try {
            List<Order> orders = orderService.getOrdersExcludingStatuses();
            if (orders.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không có đơn hàng nào phù hợp");
            }
            return ResponseEntity.ok(orders); // Trả về danh sách đơn hàng
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lấy danh sách đơn hàng");
        }
    }

    @GetMapping("/revenue-by-week")
    public ResponseEntity<?> getWeeklyRevenue(
        @RequestParam int year,
        @RequestParam int month
    ) {
        try {
            List<Map<String, Object>> weeklyRevenue = orderService.getWeeklyRevenue(year, month);
            return ResponseEntity.ok(weeklyRevenue);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lấy doanh thu từng tuần");
        }
    }
}