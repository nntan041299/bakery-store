package com.nntan041299.bakeryservice.store.web;

import com.nntan041299.bakeryservice.store.service.CurrentStoreProvider;
import com.nntan041299.bakeryservice.store.service.StoreService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import java.util.Map;

/**
 * Runs before any {@code /stores/{storeId}/...} handler. Resolves the
 * {@code storeId} path variable, validates it belongs to the current user,
 * and stashes the {@link com.nntan041299.bakeryservice.store.entity.Store}
 * in the request-scoped {@link CurrentStoreProvider} so controllers/services
 * downstream don't each have to re-validate it.
 */
@Component
@RequiredArgsConstructor
public class StoreOwnershipInterceptor implements HandlerInterceptor {

    private final StoreService storeService;
    private final CurrentStoreProvider currentStoreProvider;

    @Override
    @SuppressWarnings("unchecked")
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        Map<String, String> pathVariables =
                (Map<String, String>) request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);

        if (pathVariables != null && pathVariables.containsKey("storeId")) {
            Long storeId = Long.valueOf(pathVariables.get("storeId"));
            currentStoreProvider.setCurrentStore(storeService.getOwnedStore(storeId));
        }

        return true;
    }
}
