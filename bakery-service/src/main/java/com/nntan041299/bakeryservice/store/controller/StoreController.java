package com.nntan041299.bakeryservice.store.controller;

import com.nntan041299.bakeryservice.common.dto.PageResponse;
import com.nntan041299.bakeryservice.store.dto.StoreRequest;
import com.nntan041299.bakeryservice.store.dto.StoreResponse;
import com.nntan041299.bakeryservice.store.service.StoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @GetMapping("/mine")
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<List<StoreResponse>> listMyStores() {
        return ResponseEntity.ok(storeService.listMyStores());
    }

    @PostMapping
    @PreAuthorize("hasRole('SHOP_OWNER')")
    public ResponseEntity<StoreResponse> createStore(@Valid @RequestBody StoreRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(storeService.createMyStore(request.getName()));
    }

    @GetMapping("/top")
    public ResponseEntity<List<StoreResponse>> listTopStores(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(storeService.listTopStores(limit));
    }

    @GetMapping
    public ResponseEntity<PageResponse<StoreResponse>> searchStores(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(storeService.searchStores(search, pageable));
    }
}
