package com.travelAgency.db.repository.projection;

// Projection interface for a native query in tripRepository
public interface TravelStyleAggregation {
  String getTravelStyle();
  Integer getCount();
}
