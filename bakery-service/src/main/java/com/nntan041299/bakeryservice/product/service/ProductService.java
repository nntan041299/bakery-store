package com.nntan041299.bakeryservice.product.service;

import com.nntan041299.bakeryservice.category.service.CategoryService;
import com.nntan041299.bakeryservice.common.dto.PageResponse;
import com.nntan041299.bakeryservice.file.FileUploadingResponse;
import com.nntan041299.bakeryservice.file.FileUploadingService;
import com.nntan041299.bakeryservice.file.MultipartFileUtils;
import com.nntan041299.bakeryservice.product.dto.ProductRequest;
import com.nntan041299.bakeryservice.product.dto.ProductResponse;
import com.nntan041299.bakeryservice.product.entity.Product;
import com.nntan041299.bakeryservice.product.exception.ProductNotFoundException;
import com.nntan041299.bakeryservice.product.mapper.ProductMapper;
import com.nntan041299.bakeryservice.product.repository.ProductRepository;
import com.nntan041299.bakeryservice.store.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final CategoryService categoryService;
    private final StoreService storeService;
    private final FileUploadingService fileUploadingService;

    public PageResponse<ProductResponse> listProducts(Long storeId, String search, Boolean active, Long categoryId, Pageable pageable) {
        storeService.assertStoreOwnership(storeId);

        Specification<Product> spec = Specification.allOf(Stream.of(
                        ProductSpecifications.storeIs(storeId),
                        ProductSpecifications.searchNameOrSku(search),
                        ProductSpecifications.activeIs(active),
                        ProductSpecifications.hasCategory(categoryId))
                .filter(Objects::nonNull)
                .toList());

        Page<Product> page = productRepository.findAll(spec, pageable);
        return PageResponse.from(page.map(productMapper::toResponse));
    }

    public ProductResponse getProduct(Long storeId, Long id) {
        return productMapper.toResponse(findOwnedProduct(storeId, id));
    }

    @Transactional
    public ProductResponse createProduct(Long storeId, ProductRequest request, MultipartFile image) {
        storeService.assertStoreOwnership(storeId);

        if (productRepository.existsBySku(request.getSku())) {
            throw new IllegalArgumentException("SKU already exists: " + request.getSku());
        }

        Product product = Product.builder()
                .storeId(storeId)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .sku(request.getSku())
                .quantity(request.getQuantity())
                .imageUrl(uploadImageIfPresent(image))
                .active(request.getActive() == null || request.getActive())
                .categories(categoryService.resolveOrCreate(storeId, request.getCategories()))
                .build();

        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long storeId, Long id, ProductRequest request, MultipartFile image) {
        Product product = findOwnedProduct(storeId, id);

        if (!product.getSku().equals(request.getSku()) && productRepository.existsBySkuAndIdNot(request.getSku(), id)) {
            throw new IllegalArgumentException("SKU already exists: " + request.getSku());
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setSku(request.getSku());
        product.setQuantity(request.getQuantity());
        if (image != null && !image.isEmpty()) {
            product.setImageUrl(uploadImageIfPresent(image));
        } else if (Boolean.TRUE.equals(request.getRemoveImage())) {
            product.setImageUrl(null);
        }
        product.setActive(request.getActive() == null || request.getActive());
        product.setCategories(categoryService.resolveOrCreate(storeId, request.getCategories()));

        return productMapper.toResponse(productRepository.save(product));
    }

    private String uploadImageIfPresent(MultipartFile image) {
        if (image == null || image.isEmpty()) {
            return null;
        }
        return fileUploadingService.upload(MultipartFileUtils.toTempFile(image))
                .map(FileUploadingResponse::getUrl)
                .orElseThrow(() -> new IllegalStateException("Failed to upload product image"));
    }

    private Product findOwnedProduct(Long storeId, Long id) {
        storeService.assertStoreOwnership(storeId);
        return productRepository.findById(id)
                .filter(product -> product.getStoreId().equals(storeId))
                .orElseThrow(() -> new ProductNotFoundException(id));
    }
}
