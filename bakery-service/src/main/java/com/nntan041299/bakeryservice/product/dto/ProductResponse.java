package com.nntan041299.bakeryservice.product.dto;

import com.nntan041299.bakeryservice.category.dto.CategoryResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String sku;
    private Integer quantity;
    private String imageUrl;
    private boolean active;
    private List<CategoryResponse> categories;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
