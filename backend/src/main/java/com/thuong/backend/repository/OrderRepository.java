package com.thuong.backend.repository;

import com.thuong.backend.entity.Order;
import com.thuong.backend.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
   List<Order> findByStatus(OrderStatus status);

   @Query("SELECT o FROM Order o JOIN FETCH o.orderItems WHERE o.id = :orderId")
   Order findOrderWithItems(@Param("orderId") Long orderId);

   List<Order> findByUserId(Long userId);

   @Query("SELECT COUNT(o) " +
         "FROM Order o " +
         "WHERE DATE(o.orderDate) = CURRENT_DATE")
   Long countTodayOrders();

   @Query("SELECT COUNT(o) FROM Order o " +
         "WHERE o.status = :status AND DATE(o.orderDate) = CURRENT_DATE")
   Long countTodaySuccessfulOrders(@Param("status") OrderStatus status);

   // Truy vấn để lấy các đơn hàng với trạng thái khác DELIVERED_SUCCESSFULLY và
   // DELIVERY_FAILED
   @Query("SELECT o FROM Order o WHERE o.status NOT IN (:excludedStatuses)")
   List<Order> findOrdersExcludingStatuses(@Param("excludedStatuses") List<OrderStatus> excludedStatuses);

   @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) " +
         "FROM Order o " +
         "WHERE o.status = :status AND DATE(o.orderDate) = CURRENT_DATE")
   Double calculateTodayRevenueByStatus(@Param("status") OrderStatus status);

   @Query(value = """
             SELECT
                 WEEK(o.order_date) AS week,
                 SUM(o.total_amount) AS revenue
             FROM `orders` o
             WHERE YEAR(o.order_date) = :year
               AND MONTH(o.order_date) = :month
               AND o.status = 'DELIVERED_SUCCESSFULLY'
             GROUP BY WEEK(o.order_date)
             ORDER BY WEEK(o.order_date)
         """, nativeQuery = true)
   List<Object[]> findWeeklyRevenue(@Param("year") int year, @Param("month") int month);

}
