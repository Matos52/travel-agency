package com.travelAgency.db.model.dto.trip;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record RateTripRequest(
    @Min(1)
    @Max(5)
    @NotNull(message = "Rating is required")
    Integer rating
) {
}
