package com.thuong.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.thuong.backend.entity.User;
import com.thuong.backend.service.UserService;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User savedUser = userService.saveUser(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    // Phương thức lấy tất cả người dùng
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/login")
    public ResponseEntity<?> loginUser(@RequestParam String email, @RequestParam String phone) {
        User userByEmail = userService.findByEmail(email); // Tìm theo email
        User userByPhone = userService.findByPhone(phone); // Tìm theo phone

        if (userByEmail == null) {
            return new ResponseEntity<>("Email không tồn tại", HttpStatus.NOT_FOUND);
        }

        if (userByPhone == null) {
            return new ResponseEntity<>("Số điện thoại không tồn tại", HttpStatus.NOT_FOUND);
        }

        if (userByEmail.getId().equals(userByPhone.getId())) {
            return new ResponseEntity<>(userByEmail, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Email và số điện thoại không khớp", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        try {
            User existingUser = userService.updateUser(id, updatedUser);
            return new ResponseEntity<>(existingUser, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id); // Lấy người dùng theo ID
            if (user != null) {
                return new ResponseEntity<>(user, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Không tìm thấy người dùng với ID: " + id, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUserById(id);
            return new ResponseEntity<>("Người dùng đã được xóa thành công", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        User user = userService.findByEmail(email);
        if (user != null) {
            return new ResponseEntity<>("Email đã được đăng ký", HttpStatus.OK);
        }
        return new ResponseEntity<>("Email hợp lệ", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/check-phone")
    public ResponseEntity<?> checkPhone(@RequestParam String phone) {
        User user = userService.findByPhone(phone);
        if (user != null) {
            return new ResponseEntity<>("Số điện thoại đã được đăng ký", HttpStatus.OK);
        }
        return new ResponseEntity<>("Số điện thoại hợp lệ", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/check-email-login")
    public ResponseEntity<?> checkEmaillogin(@RequestParam String email) {
        User user = userService.findByEmail(email);
        if (user == null) {
            return new ResponseEntity<>("Email không đúng", HttpStatus.OK);
        }
        return new ResponseEntity<>("Email đã được đăng ký", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/check-phone-login")
    public ResponseEntity<?> checkPhonelogin(@RequestParam String phone) {
        User user = userService.findByPhone(phone);
        if (user == null) {
            return new ResponseEntity<>("Số điện thoại không đúng", HttpStatus.OK);
        }
        return new ResponseEntity<>("Số điện thoại đã được đăng ký", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/count-today")
    public ResponseEntity<Long> getTotalUsersAddedTodayWithRole() {
        try {
            long count = userService.getTotalUsersAddedTodayWithRole("user");
            return ResponseEntity.ok(count); // Trả về tổng số lượng người dùng mới trong ngày
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // Trả về lỗi nếu có
        }
    }
}
