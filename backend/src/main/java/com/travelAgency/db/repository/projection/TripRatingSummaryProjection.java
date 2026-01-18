package com.travelAgency.db.repository.projection;

public interface TripRatingSummaryProjection {
  Double getAverageRating();

  Integer getRatingsCount();

  Integer getMyRating();
}
