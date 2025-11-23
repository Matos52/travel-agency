package com.travelAgency.service;

import com.travelAgency.db.model.dto.trip.TripDTO;
import com.travelAgency.db.model.dto.trip.TripRequest;
import com.travelAgency.db.model.dto.trip.TripResponse;
import org.springframework.data.domain.Page;

public interface TripService {

  TripResponse createTrip(TripRequest tripRequest);

  Page<TripDTO> getTrips(int pageIndex, int pageSize);

  TripDTO getTrip(Long id);
}
