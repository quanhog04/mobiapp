package com.thuong.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.thuong.backend.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByBrandId(Long brandId);
    Optional<Product> findByName(String name);
    @Query("SELECT COUNT(p) FROM Product p WHERE DATE(p.createdDate) = CURRENT_DATE")
    long countProductsAddedToday();
    @Query("SELECT p FROM Product p WHERE p.status = 1")
    List<Product> findAllVisibleProducts();
}
