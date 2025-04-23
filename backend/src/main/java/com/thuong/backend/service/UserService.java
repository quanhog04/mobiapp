package com.thuong.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thuong.backend.entity.User;
import com.thuong.backend.repository.UserRepository;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findByRole("user"); // Lấy tất cả người dùng có role là "user"
    }

    // Phương thức tìm người dùng theo email và số điện thoại
    public User findByEmailAndPhone(String email, String phone) {
        return userRepository.findByEmailAndPhone(email, phone);
    }

    // Tìm kiếm người dùng theo email
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Tìm kiếm người dùng theo số điện thoại
    public User findByPhone(String phone) {
        return userRepository.findByPhone(phone);
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setName(updatedUser.getName());
            user.setGender(updatedUser.getGender());
            user.setPhone(updatedUser.getPhone());
            user.setAddress(updatedUser.getAddress());
            user.setEmail(updatedUser.getEmail());
            return userRepository.save(user);
        }).orElseThrow(() -> new IllegalArgumentException("User with ID " + id + " not found"));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null); // Tìm người dùng trong cơ sở dữ liệu
    }

    public void deleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User với ID " + id + " không tồn tại");
        }
        userRepository.deleteById(id);
    }

    public long getTotalUsersAddedTodayWithRole(String role) {
        return userRepository.countUsersByRoleAddedToday(role);
    }

}
