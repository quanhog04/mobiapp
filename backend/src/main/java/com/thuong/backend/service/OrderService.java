package com.thuong.backend.service;

import com.thuong.backend.dto.OrderItemRequest;
import com.thuong.backend.dto.OrderRequest;
import com.thuong.backend.entity.Order;
import com.thuong.backend.entity.OrderItem;
import com.thuong.backend.entity.OrderStatus;
import com.thuong.backend.entity.User;
import com.thuong.backend.repository.OrderItemRepository;
import com.thuong.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    // Lấy tất cả đơn hàng
    public List<Order> getAllOrders() {
        return orderRepository.findAll(); // Lấy tất cả các đơn hàng từ database
    }

    // Lấy đơn hàng theo ID
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    public Order createOrder(OrderRequest orderRequest) {
        Order order = new Order();
        order.setUser(new User(orderRequest.getUserId())); // Sử dụng constructor User(Long id)
        order.setOrderDate(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING_CONFIRMATION);
        order.setAddress(orderRequest.getAddress());
        order.setOrderCode(orderRequest.getOrderCode());

        double totalAmount = orderRequest.getTotalAmount();
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        for (OrderItemRequest item : orderRequest.getOrderItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProductId(item.getProductId());
            orderItem.setProductName(item.getProductName());
            orderItem.setPrice(item.getPrice());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setSelectedColor(item.getSelectedColor());
            orderItemRepository.save(orderItem);
        }

        return savedOrder;
    }

    public Order createOrderCash(OrderRequest orderRequest) {
        Order order = new Order();
        order.setUser(new User(orderRequest.getUserId())); // Sử dụng constructor User(Long id)
        order.setOrderDate(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING_CONFIRMATION);
        order.setAddress(orderRequest.getAddress());
        order.setOrderCode(orderRequest.getOrderCode());

        double totalAmount = orderRequest.getTotalAmount();
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        for (OrderItemRequest item : orderRequest.getOrderItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProductId(item.getProductId());
            orderItem.setProductName(item.getProductName());
            orderItem.setPrice(item.getPrice());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setSelectedColor(item.getSelectedColor());
            orderItemRepository.save(orderItem);
        }

        return savedOrder;
    }

    public Order getOrderWithItems(Long orderId) {
        return orderRepository.findOrderWithItems(orderId); // Truy vấn từ repository
    }

    public void deleteOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng với ID: " + orderId));
        orderRepository.delete(order); // Xóa đơn hàng
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId); // Tạo phương thức trong repository để tìm đơn hàng theo userId
    }

    public Double getTodayRevenueFromSuccessfulOrders() {
        return orderRepository.calculateTodayRevenueByStatus(OrderStatus.DELIVERED_SUCCESSFULLY);
    }

    public Long getTodayOrders() {
        return orderRepository.countTodayOrders();
    }

    // Lấy tổng số lượng đơn hàng thành công trong ngày
    public Long getTotalTodaySuccessfulOrders() {
        return orderRepository.countTodaySuccessfulOrders(OrderStatus.DELIVERED_SUCCESSFULLY);
    }

    public List<Order> getOrdersExcludingStatuses() {
        return orderRepository.findOrdersExcludingStatuses(
                Arrays.asList(OrderStatus.DELIVERED_SUCCESSFULLY, OrderStatus.DELIVERY_FAILED));
    }

    public List<Map<String, Object>> getWeeklyRevenue(int year, int month) {
        // Lấy dữ liệu doanh thu từng tuần từ database
        List<Object[]> weeklyRevenueData = orderRepository.findWeeklyRevenue(year, month);
    
        // Tạo Map để dễ dàng kiểm tra tuần có doanh thu
        Map<Integer, Double> revenueMap = new HashMap<>();
        for (Object[] row : weeklyRevenueData) {
            int week = (int) row[0];
            double revenue = (double) row[1];
            revenueMap.put(week, revenue);
        }
    
        // Tạo danh sách tất cả các tuần trong tháng
        List<Map<String, Object>> weeklyRevenue = new ArrayList<>();
        LocalDate firstDayOfMonth = LocalDate.of(year, month, 1);
        LocalDate lastDayOfMonth = firstDayOfMonth.withDayOfMonth(firstDayOfMonth.lengthOfMonth());
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
    
        int firstWeek = firstDayOfMonth.get(weekFields.weekOfYear());
        int lastWeek = lastDayOfMonth.get(weekFields.weekOfYear());
    
        for (int week = firstWeek; week <= lastWeek; week++) {
            Map<String, Object> weekData = new HashMap<>();
            weekData.put("week", week);
            weekData.put("revenue", revenueMap.getOrDefault(week, 0.0)); // Nếu không có, gán giá trị 0
            weeklyRevenue.add(weekData);
        }
    
        return weeklyRevenue;
    }
}