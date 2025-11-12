package com.travelAgency.service;

import com.travelAgency.db.model.dto.TripRequest;
import com.travelAgency.db.model.dto.TripResponse;

public interface TripService {

  TripResponse createTrip(TripRequest tripRequest);
}
