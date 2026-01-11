package com.travelAgency.db.repository;

public interface TripRatingSummaryProjection {
  Double getAverageRating();

  Integer getRatingsCount();

  Integer getMyRating();
}
