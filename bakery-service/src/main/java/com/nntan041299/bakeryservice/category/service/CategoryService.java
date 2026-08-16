package com.nntan041299.bakeryservice.category.service;

import com.nntan041299.bakeryservice.auth.service.CurrentUserProvider;
import com.nntan041299.bakeryservice.category.dto.CategoryResponse;
import com.nntan041299.bakeryservice.category.entity.Category;
import com.nntan041299.bakeryservice.category.exception.CategoryNotFoundException;
import com.nntan041299.bakeryservice.category.repository.CategoryRepository;
import com.nntan041299.bakeryservice.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CurrentUserProvider currentUserProvider;

    public List<CategoryResponse> listCategories() {
        Long ownerId = currentUserProvider.getCurrentUser().getId();
        return categoryRepository.findByOwnerIdOrderByNameAsc(ownerId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CategoryResponse createCategory(String name) {
        Long ownerId = currentUserProvider.getCurrentUser().getId();
        Category category = resolveOrCreate(ownerId, List.of(name)).iterator().next();
        return toResponse(category);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, String name) {
        Long ownerId = currentUserProvider.getCurrentUser().getId();
        Category category = findOwnedCategory(id, ownerId);

        String trimmed = name.trim();
        categoryRepository.findByOwnerIdAndNameIgnoreCase(ownerId, trimmed)
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Category already exists: " + trimmed);
                });

        category.setName(trimmed);
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        Long ownerId = currentUserProvider.getCurrentUser().getId();
        Category category = findOwnedCategory(id, ownerId);
        categoryRepository.delete(category);
    }

    @Transactional
    public Set<Category> resolveOrCreate(Long ownerId, List<String> names) {
        Set<Category> categories = new LinkedHashSet<>();
        if (names == null) {
            return categories;
        }
        for (String rawName : names) {
            if (!StringUtils.hasText(rawName)) {
                continue;
            }
            String name = rawName.trim();
            Category category = categoryRepository.findByOwnerIdAndNameIgnoreCase(ownerId, name)
                    .orElseGet(() -> categoryRepository.save(Category.builder()
                            .ownerId(ownerId)
                            .name(name)
                            .build()));
            categories.add(category);
        }
        return categories;
    }

    private Category findOwnedCategory(Long id, Long ownerId) {
        return categoryRepository.findById(id)
                .filter(category -> category.getOwnerId().equals(ownerId))
                .orElseThrow(() -> new CategoryNotFoundException(id));
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getName(), productRepository.countByCategoriesId(category.getId()));
    }
}
