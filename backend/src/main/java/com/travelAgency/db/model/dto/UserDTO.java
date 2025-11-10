package com.travelAgency.db.model.dto;

import com.travelAgency.db.model.Status;

import java.time.LocalDateTime;

public record UserDTO(
    String username,
    String email,
    String accountId,
    String imageUrl,
    LocalDateTime joinedAt,
    Integer itineraryCreated,
    Status status
) {
}
