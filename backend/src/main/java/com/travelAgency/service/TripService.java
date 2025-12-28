package com.travelAgency.service;

import com.travelAgency.db.model.dto.trip.TripDTO;
import com.travelAgency.db.model.dto.trip.CreateTripRequest;
import com.travelAgency.db.model.dto.trip.TripResponse;
import org.springframework.data.domain.Page;

public interface TripService {

  TripResponse createTrip(CreateTripRequest createTripRequest, String userEmail);

  Page<TripDTO> getTrips(int pageIndex, int pageSize);

  TripDTO getTrip(Long id);

  void rateTrip(Long id, int rating, String userEmail);
}
