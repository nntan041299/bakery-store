package com.nntan041299.bakeryservice.store.service;

import com.nntan041299.bakeryservice.auth.service.CurrentUserProvider;
import com.nntan041299.bakeryservice.common.dto.PageResponse;
import com.nntan041299.bakeryservice.product.repository.ProductRepository;
import com.nntan041299.bakeryservice.store.dto.StoreResponse;
import com.nntan041299.bakeryservice.store.entity.Store;
import com.nntan041299.bakeryservice.store.exception.StoreNotFoundException;
import com.nntan041299.bakeryservice.store.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final CurrentUserProvider currentUserProvider;

    @Transactional
    public Store createStore(Long ownerId, String name) {
        return storeRepository.save(Store.builder()
                .ownerId(ownerId)
                .name(name)
                .build());
    }

    public List<StoreResponse> listMyStores() {
        Long ownerId = currentUserProvider.getCurrentUser().getId();
        return storeRepository.findByOwnerIdOrderByNameAsc(ownerId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public StoreResponse createMyStore(String name) {
        Long ownerId = currentUserProvider.getCurrentUser().getId();
        return toResponse(createStore(ownerId, name.trim()));
    }

    /**
     * Returns the given store, provided it belongs to the current user.
     */
    public Store getOwnedStore(Long storeId) {
        Long ownerId = currentUserProvider.getCurrentUser().getId();
        return storeRepository.findByIdAndOwnerId(storeId, ownerId)
                .orElseThrow(() -> new StoreNotFoundException(storeId));
    }

    /**
     * Validates that the given store belongs to the current user, without
     * loading it. Used by the product/category endpoints nested under
     * /stores/{storeId}/... to make sure a shop owner can't reach into a
     * store they don't own.
     */
    public void assertStoreOwnership(Long storeId) {
        Long ownerId = currentUserProvider.getCurrentUser().getId();
        if (!storeRepository.existsByIdAndOwnerId(storeId, ownerId)) {
            throw new StoreNotFoundException(storeId);
        }
    }

    /**
     * Returns the most popular stores. There is no order/purchase history yet,
     * so this ranks by product count as a stand-in signal.
     * TODO: rank by completed order count once the ordering feature exists.
     */
    public List<StoreResponse> listTopStores(int limit) {
        return storeRepository.findAll().stream()
                .map(this::toResponse)
                .sorted(Comparator.comparingLong(StoreResponse::getProductCount).reversed())
                .limit(limit)
                .toList();
    }

    public PageResponse<StoreResponse> searchStores(String search, Pageable pageable) {
        Page<Store> page = StringUtils.hasText(search)
                ? storeRepository.findByNameContainingIgnoreCase(search.trim(), pageable)
                : storeRepository.findAllByOrderByNameAsc(pageable);
        return PageResponse.from(page.map(this::toResponse));
    }

    private StoreResponse toResponse(Store store) {
        return new StoreResponse(store.getId(), store.getName(), productRepository.countByStoreId(store.getId()));
    }
}
