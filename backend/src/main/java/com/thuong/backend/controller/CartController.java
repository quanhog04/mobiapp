package com.thuong.backend.controller;

import com.thuong.backend.entity.CartItem;
import com.thuong.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // Thêm sản phẩm vào giỏ hàng của người dùng
    @PostMapping("/add/{userId}")
    public ResponseEntity<CartItem> addToCart(@PathVariable Long userId, @RequestBody CartItem cartItem) {
        CartItem addedItem = cartService.addToCart(userId, cartItem);
        if (addedItem != null) {
            return ResponseEntity.ok(addedItem);
        }
        return ResponseEntity.status(404).body(null); // Người dùng không tồn tại
    }

    // Lấy tất cả sản phẩm trong giỏ hàng của người dùng
    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long userId) {
        List<CartItem> cartItems = cartService.getCartItems(userId);
        if (!cartItems.isEmpty()) {
            return ResponseEntity.ok(cartItems);
        }
        return ResponseEntity.status(404).body(null); // Giỏ hàng trống hoặc không tìm thấy người dùng
    }

    // Xóa sản phẩm khỏi giỏ hàng theo ID người dùng và ID sản phẩm
    @DeleteMapping("/remove/{userId}/{itemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long userId, @PathVariable Long itemId) {
        boolean removed = cartService.removeFromCart(userId, itemId);
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{userId}")
public ResponseEntity<Void> deleteAllCartItems(@PathVariable Long userId) {
    boolean deleted = cartService.deleteAllCartItems(userId);
    return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
}


    // Cập nhật số lượng sản phẩm trong giỏ hàng
    @PutMapping("/update/{userId}/{itemId}")
    public ResponseEntity<CartItem> updateQuantity(@PathVariable Long userId, @PathVariable Long itemId, @RequestBody Map<String, Integer> requestBody) {
        Integer quantity = requestBody.get("quantity");
        CartItem updatedItem = cartService.updateQuantity(userId, itemId, quantity);
        return updatedItem != null ? ResponseEntity.ok(updatedItem) : ResponseEntity.notFound().build();
    }
}
