package com.nntan041299.bakeryservice.product.mapper;

import com.nntan041299.bakeryservice.category.dto.CategoryResponse;
import com.nntan041299.bakeryservice.category.entity.Category;
import com.nntan041299.bakeryservice.product.dto.ProductResponse;
import com.nntan041299.bakeryservice.product.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProductResponse toResponse(Product product);

    @Mapping(target = "productCount", ignore = true)
    CategoryResponse toCategoryResponse(Category category);
}
