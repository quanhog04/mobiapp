package com.thuong.backend.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thuong.backend.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.email = ?1 AND u.phone = ?2")
    User findByEmailAndPhone(String email, String phone);
    // Tìm kiếm người dùng theo email
    @Query("SELECT u FROM User u WHERE u.email = ?1")
    User findByEmail(String email);

    // Tìm kiếm người dùng theo số điện thoại
    @Query("SELECT u FROM User u WHERE u.phone = ?1")
    User findByPhone(String phone);
    List<User> findByRole(String role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND DATE(u.createdDate) = CURRENT_DATE")
    long countUsersByRoleAddedToday(@Param("role") String role);
}