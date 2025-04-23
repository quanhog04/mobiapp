package com.thuong.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thuong.backend.entity.CartItem;
import com.thuong.backend.entity.User;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByProductId(Long productId); 
    List<CartItem> findByUser(User user);
    List<CartItem> findByProductIdAndUserId(Long productId, Long userId);
}