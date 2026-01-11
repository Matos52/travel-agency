package com.travelAgency.db.repository;

public interface TripRatingSummaryForListProjection {
  Long getTripId();

  Double getAverageRating();

  Integer getRatingsCount();
}
