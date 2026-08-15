package com.nntan041299.bakeryservice.product.mapper;

import com.nntan041299.bakeryservice.product.dto.ProductResponse;
import com.nntan041299.bakeryservice.product.entity.Product;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProductResponse toResponse(Product product);
}
