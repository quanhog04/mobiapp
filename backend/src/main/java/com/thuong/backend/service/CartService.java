package com.thuong.backend.service;

import com.thuong.backend.entity.CartItem;
import com.thuong.backend.entity.User;
import com.thuong.backend.repository.CartItemRepository;
import com.thuong.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    // Thêm sản phẩm vào giỏ hàng của người dùng
    public CartItem addToCart(Long userId, CartItem cartItem) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            cartItem.setUser(user); // Gắn người dùng vào sản phẩm
    
            // Kiểm tra sản phẩm đã có trong giỏ hàng của người dùng chưa
            List<CartItem> existingItems = cartItemRepository.findByProductIdAndUserId(cartItem.getProductId(), userId);
    
            for (CartItem existingItem : existingItems) {
                // Kiểm tra xem sản phẩm có cùng màu sắc và hình ảnh không
                if (existingItem.getSelectedColor().equals(cartItem.getSelectedColor()) && 
                    existingItem.getSelectedImagePath().equals(cartItem.getSelectedImagePath())) {
                    // Nếu cùng màu và hình ảnh, cập nhật số lượng
                    existingItem.setQuantity(existingItem.getQuantity() + cartItem.getQuantity());
                    return cartItemRepository.save(existingItem); // Cập nhật vào database
                }
            }
    
            // Nếu không tìm thấy sản phẩm giống, thêm sản phẩm mới vào giỏ hàng
            return cartItemRepository.save(cartItem);
        }
    
        return null; // Trả về null nếu người dùng không tồn tại
    }
    

    // Lấy tất cả sản phẩm trong giỏ hàng của người dùng
    public List<CartItem> getCartItems(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return user.getCartItems(); // Lấy tất cả sản phẩm trong giỏ hàng của người dùng
        }
        return List.of(); // Trả về danh sách trống nếu người dùng không tồn tại
    }

    // Xóa sản phẩm khỏi giỏ hàng của người dùng
    public boolean removeFromCart(Long userId, Long itemId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            CartItem cartItem = cartItemRepository.findById(itemId).orElse(null);
            if (cartItem != null && cartItem.getUser().equals(user)) {
                cartItemRepository.delete(cartItem);
                return true;
            }
        }
        return false;
    }

    public boolean deleteAllCartItems(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Lấy tất cả các sản phẩm trong giỏ hàng của người dùng
            List<CartItem> cartItems = cartItemRepository.findByUser(user);
            if (!cartItems.isEmpty()) {
                // Xóa tất cả sản phẩm trong giỏ hàng của người dùng
                cartItemRepository.deleteAll(cartItems);
                return true;
            }
        }
        return false;
    }
    

    // Cập nhật số lượng sản phẩm trong giỏ hàng của người dùng
    public CartItem updateQuantity(Long userId, Long itemId, int quantity) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            CartItem cartItem = cartItemRepository.findById(itemId).orElse(null);
            if (cartItem != null && cartItem.getUser().equals(user)) {
                cartItem.setQuantity(quantity);
                return cartItemRepository.save(cartItem);
            }
        }
        return null;
    }
}
