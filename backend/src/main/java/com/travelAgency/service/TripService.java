package com.travelAgency.service;

import com.travelAgency.db.model.dto.TripDTO;
import com.travelAgency.db.model.dto.TripRequest;
import com.travelAgency.db.model.dto.TripResponse;
import org.springframework.data.domain.Page;

public interface TripService {

  TripResponse createTrip(TripRequest tripRequest);

  Page<TripDTO> getTrips(int pageIndex, int pageSize);

  TripDTO getTrip(Long id);
}
