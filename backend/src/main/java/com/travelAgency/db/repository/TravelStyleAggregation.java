package com.travelAgency.db.repository;

// Projection interface for a native query in tripRepository
public interface TravelStyleAggregation {
  String getTravelStyle();
  Integer getCount();
}
