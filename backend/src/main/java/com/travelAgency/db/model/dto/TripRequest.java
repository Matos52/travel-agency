package com.travelAgency.db.model.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TripRequest(
    @NotBlank(message = "Country is required")
    String country,
    @Min(1)
    @Max(10)
    @NotNull(message = "Number of days is required")
    Integer numberOfDays,
    @NotBlank(message = "Travel Style is required")
    String travelStyle,
    @NotBlank(message = "Interest is required")
    String interest,
    @NotBlank(message = "Budget is required")
    String budget,
    @NotBlank(message = "Group Type is required")
    String groupType,
    @NotNull(message = "User email is required")
    String userEmail
) {
}
