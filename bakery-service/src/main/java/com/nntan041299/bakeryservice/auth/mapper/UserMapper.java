package com.nntan041299.bakeryservice.auth.mapper;

import com.nntan041299.bakeryservice.auth.dto.UserResponse;
import com.nntan041299.bakeryservice.auth.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toResponse(User user);
}
