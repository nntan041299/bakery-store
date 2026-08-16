package com.nntan041299.bakeryservice.store.repository;

import com.nntan041299.bakeryservice.store.entity.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StoreRepository extends JpaRepository<Store, Long> {

    List<Store> findByOwnerIdOrderByNameAsc(Long ownerId);

    Optional<Store> findByIdAndOwnerId(Long id, Long ownerId);

    boolean existsByIdAndOwnerId(Long id, Long ownerId);

    Page<Store> findAllByOrderByNameAsc(Pageable pageable);

    Page<Store> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
