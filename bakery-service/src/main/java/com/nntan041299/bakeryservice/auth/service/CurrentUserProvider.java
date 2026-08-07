package com.nntan041299.bakeryservice.auth.service;

import com.nntan041299.bakeryservice.auth.entity.User;
import com.nntan041299.bakeryservice.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

/**
 * Resolves the {@link User} entity for the currently authenticated principal.
 * Centralized here so services don't duplicate the SecurityContextHolder + lookup logic.
 */
@Component
@RequiredArgsConstructor
public class CurrentUserProvider {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}
