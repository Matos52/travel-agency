package com.travelAgency.db.repository.projection;

public interface TripRatingSummaryForListProjection {
  Long getTripId();

  Double getAverageRating();

  Integer getRatingsCount();
}
