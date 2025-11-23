package com.travelAgency.db.model.dto.dashboard;

import java.time.LocalDate;

public record DailyCount(
    LocalDate day,
    long count
) {

  //Custom constructor for @Query which needs Date as a parameter
  public DailyCount(java.sql.Date date, Long count) {
    this(date != null ? date.toLocalDate() : null,
         count != null ? count : 0L);
  }
}
