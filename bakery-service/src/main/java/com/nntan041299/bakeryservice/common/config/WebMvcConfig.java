package com.nntan041299.bakeryservice.common.config;

import com.nntan041299.bakeryservice.store.web.StoreOwnershipInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final StoreOwnershipInterceptor storeOwnershipInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(storeOwnershipInterceptor)
                .addPathPatterns("/stores/*/products/**", "/stores/*/categories/**");
    }
}
