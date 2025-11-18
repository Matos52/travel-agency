package com.travelAgency.mapper;

import com.travelAgency.db.model.Trip;
import com.travelAgency.db.model.dto.TripDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TripMapper {

  TripDTO toTripDTO(Trip trip);
}
