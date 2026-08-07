package com.nntan041299.bakeryservice.auth.dto;

import com.nntan041299.bakeryservice.auth.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private Role role;
    private boolean active;
}
