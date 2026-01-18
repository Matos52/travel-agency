package com.travelAgency.db.model.dto.user;

import com.travelAgency.db.model.Status;

import java.time.LocalDateTime;

public record UserDTO(
    String fullName,
    String email,
    String accountId,
    String imageUrl,
    LocalDateTime joinedAt,
    Integer itineraryCreated,
    Status status,
    Long ratedTripsCount
) {
}
