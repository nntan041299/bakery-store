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
import com.nntan041299.bakeryservice.store.service.CurrentStoreProvider;
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
    private final CurrentStoreProvider currentStoreProvider;
    private final FileUploadingService fileUploadingService;

    public PageResponse<ProductResponse> listProducts(String search, Boolean active, Long categoryId, Pageable pageable) {
        Long storeId = currentStoreProvider.getCurrentStore().getId();

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

    public ProductResponse getProduct(Long id) {
        return productMapper.toResponse(findOwnedProduct(id));
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request, MultipartFile image) {
        Long storeId = currentStoreProvider.getCurrentStore().getId();

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
                .categories(categoryService.resolveOrCreate(request.getCategories()))
                .build();

        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request, MultipartFile image) {
        Product product = findOwnedProduct(id);

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
        product.setCategories(categoryService.resolveOrCreate(request.getCategories()));

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

    private Product findOwnedProduct(Long id) {
        Long storeId = currentStoreProvider.getCurrentStore().getId();
        return productRepository.findById(id)
                .filter(product -> product.getStoreId().equals(storeId))
                .orElseThrow(() -> new ProductNotFoundException(id));
    }
}
