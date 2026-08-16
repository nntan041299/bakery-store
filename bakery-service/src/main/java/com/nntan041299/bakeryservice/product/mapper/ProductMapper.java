package com.nntan041299.bakeryservice.product.mapper;

import com.nntan041299.bakeryservice.category.dto.CategoryResponse;
import com.nntan041299.bakeryservice.category.entity.Category;
import com.nntan041299.bakeryservice.product.dto.ProductResponse;
import com.nntan041299.bakeryservice.product.entity.Product;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProductResponse toResponse(Product product);

    CategoryResponse toCategoryResponse(Category category);
}
