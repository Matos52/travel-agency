package com.travelAgency.db.repository.projection;

import com.travelAgency.db.model.Status;

import java.time.LocalDateTime;

public interface UserWithRatingCount {
  Long getId();
  String getFullName();
  String getEmail();
  String getAccountId();
  String getImageUrl();
  LocalDateTime getJoinedAt();
  Integer getItineraryCreated();
  Status getStatus();
  Long getRatedTripsCount();
}
