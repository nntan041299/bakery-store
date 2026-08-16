package com.nntan041299.bakeryservice.store.exception;

public class StoreNotFoundException extends RuntimeException {

    public StoreNotFoundException(Long id) {
        super("Store not found: " + id);
    }
}
