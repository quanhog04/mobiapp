package com.thuong.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thuong.backend.entity.OrderItem;
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
