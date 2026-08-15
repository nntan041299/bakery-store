package com.nntan041299.bakeryservice.product.service;

import com.nntan041299.bakeryservice.auth.service.CurrentUserProvider;
import com.nntan041299.bakeryservice.common.dto.PageResponse;
import com.nntan041299.bakeryservice.product.dto.ProductRequest;
import com.nntan041299.bakeryservice.product.dto.ProductResponse;
import com.nntan041299.bakeryservice.product.entity.Product;
import com.nntan041299.bakeryservice.product.exception.ProductNotFoundException;
import com.nntan041299.bakeryservice.product.mapper.ProductMapper;
import com.nntan041299.bakeryservice.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final CurrentUserProvider currentUserProvider;

    public PageResponse<ProductResponse> listProducts(String search, Boolean active, Pageable pageable) {
        Long ownerId = currentUserProvider.getCurrentUser().getId();

        Specification<Product> spec = Specification.allOf(Stream.of(
                        ProductSpecifications.ownerIs(ownerId),
                        ProductSpecifications.searchNameOrSku(search),
                        ProductSpecifications.activeIs(active))
                .filter(Objects::nonNull)
                .toList());

        Page<Product> page = productRepository.findAll(spec, pageable);
        return PageResponse.from(page.map(productMapper::toResponse));
    }

    public ProductResponse getProduct(Long id) {
        return productMapper.toResponse(findOwnedProduct(id));
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsBySku(request.getSku())) {
            throw new IllegalArgumentException("SKU already exists: " + request.getSku());
        }

        Long ownerId = currentUserProvider.getCurrentUser().getId();
        Product product = Product.builder()
                .ownerId(ownerId)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .sku(request.getSku())
                .quantity(request.getQuantity())
                .imageUrl(request.getImageUrl())
                .active(request.getActive() == null || request.getActive())
                .build();

        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = findOwnedProduct(id);

        if (!product.getSku().equals(request.getSku()) && productRepository.existsBySkuAndIdNot(request.getSku(), id)) {
            throw new IllegalArgumentException("SKU already exists: " + request.getSku());
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setSku(request.getSku());
        product.setQuantity(request.getQuantity());
        product.setImageUrl(request.getImageUrl());
        product.setActive(request.getActive() == null || request.getActive());

        return productMapper.toResponse(productRepository.save(product));
    }

    private Product findOwnedProduct(Long id) {
        Long ownerId = currentUserProvider.getCurrentUser().getId();
        return productRepository.findById(id)
                .filter(product -> product.getOwnerId().equals(ownerId))
                .orElseThrow(() -> new ProductNotFoundException(id));
    }
}
