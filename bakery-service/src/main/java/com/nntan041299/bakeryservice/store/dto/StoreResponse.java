package com.nntan041299.bakeryservice.store.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StoreResponse {

    private Long id;
    private String name;
    private long productCount;
}
