package com.nntan041299.bakeryservice.category.service;

import com.nntan041299.bakeryservice.category.dto.CategoryResponse;
import com.nntan041299.bakeryservice.category.entity.Category;
import com.nntan041299.bakeryservice.category.exception.CategoryNotFoundException;
import com.nntan041299.bakeryservice.category.repository.CategoryRepository;
import com.nntan041299.bakeryservice.product.repository.ProductRepository;
import com.nntan041299.bakeryservice.store.service.CurrentStoreProvider;
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
    private final CurrentStoreProvider currentStoreProvider;

    public List<CategoryResponse> listCategories() {
        Long storeId = currentStoreProvider.getCurrentStore().getId();
        return categoryRepository.findByStoreIdOrderByNameAsc(storeId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CategoryResponse createCategory(String name) {
        Category category = resolveOrCreate(List.of(name)).iterator().next();
        return toResponse(category);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, String name) {
        Long storeId = currentStoreProvider.getCurrentStore().getId();
        Category category = findOwnedCategory(storeId, id);

        String trimmed = name.trim();
        categoryRepository.findByStoreIdAndNameIgnoreCase(storeId, trimmed)
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Category already exists: " + trimmed);
                });

        category.setName(trimmed);
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        Long storeId = currentStoreProvider.getCurrentStore().getId();
        Category category = findOwnedCategory(storeId, id);
        categoryRepository.delete(category);
    }

    @Transactional
    public Set<Category> resolveOrCreate(List<String> names) {
        Long storeId = currentStoreProvider.getCurrentStore().getId();
        Set<Category> categories = new LinkedHashSet<>();
        if (names == null) {
            return categories;
        }
        for (String rawName : names) {
            if (!StringUtils.hasText(rawName)) {
                continue;
            }
            String name = rawName.trim();
            Category category = categoryRepository.findByStoreIdAndNameIgnoreCase(storeId, name)
                    .orElseGet(() -> categoryRepository.save(Category.builder()
                            .storeId(storeId)
                            .name(name)
                            .build()));
            categories.add(category);
        }
        return categories;
    }

    private Category findOwnedCategory(Long storeId, Long id) {
        return categoryRepository.findById(id)
                .filter(category -> category.getStoreId().equals(storeId))
                .orElseThrow(() -> new CategoryNotFoundException(id));
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getName(), productRepository.countByCategoriesId(category.getId()));
    }
}
