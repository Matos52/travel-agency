package com.travelAgency.db.model.dto;

import java.time.LocalDateTime;
import java.util.List;

public record TripDTO(
    Long id,
    String tripDetail,
    List<String> imageUrls,
    LocalDateTime createdAt,
    String paymentLink) {
}
