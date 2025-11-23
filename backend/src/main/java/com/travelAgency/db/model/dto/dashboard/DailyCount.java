package com.travelAgency.db.model.dto.dashboard;

import java.time.LocalDate;

public record DailyCount(
    LocalDate day,
    long count
) {
}
