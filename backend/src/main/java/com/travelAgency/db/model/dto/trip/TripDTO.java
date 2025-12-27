package com.travelAgency.db.model.dto.trip;

import java.time.LocalDateTime;
import java.util.List;

public record TripDTO(
    Long id,
    String tripDetail,
    List<String> imageUrls,
    LocalDateTime createdAt,
    String userImageUrl,
    String createdBy) {
}
