package com.nntan041299.bakeryservice.category.service;

import com.nntan041299.bakeryservice.auth.service.CurrentUserProvider;
import com.nntan041299.bakeryservice.category.dto.CategoryResponse;
import com.nntan041299.bakeryservice.category.entity.Category;
import com.nntan041299.bakeryservice.category.repository.CategoryRepository;
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
    private final CurrentUserProvider currentUserProvider;

    public List<CategoryResponse> listCategories() {
        Long ownerId = currentUserProvider.getCurrentUser().getId();
        return categoryRepository.findByOwnerIdOrderByNameAsc(ownerId).stream()
                .map(category -> new CategoryResponse(category.getId(), category.getName()))
                .toList();
    }

    @Transactional
    public CategoryResponse createCategory(String name) {
        Long ownerId = currentUserProvider.getCurrentUser().getId();
        Category category = resolveOrCreate(ownerId, List.of(name)).iterator().next();
        return new CategoryResponse(category.getId(), category.getName());
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
}
