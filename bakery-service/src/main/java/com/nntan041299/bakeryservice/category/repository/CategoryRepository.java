package com.nntan041299.bakeryservice.category.repository;

import com.nntan041299.bakeryservice.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByStoreIdOrderByNameAsc(Long storeId);

    Optional<Category> findByStoreIdAndNameIgnoreCase(Long storeId, String name);
}
