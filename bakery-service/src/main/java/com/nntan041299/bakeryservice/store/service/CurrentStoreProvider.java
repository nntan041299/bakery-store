package com.nntan041299.bakeryservice.store.service;

import com.nntan041299.bakeryservice.store.entity.Store;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

/**
 * Holds the store resolved for the current request by
 * {@link com.nntan041299.bakeryservice.store.web.StoreOwnershipInterceptor},
 * for {@code /stores/{storeId}/...} endpoints. Request-scoped so each HTTP
 * request gets its own instance — services can just inject this instead of
 * threading a {@code storeId} parameter through every method.
 */
@Component
@RequestScope
public class CurrentStoreProvider {

    private Store store;

    public Store getCurrentStore() {
        if (store == null) {
            throw new IllegalStateException("No store resolved for the current request");
        }
        return store;
    }

    public void setCurrentStore(Store store) {
        this.store = store;
    }
}
