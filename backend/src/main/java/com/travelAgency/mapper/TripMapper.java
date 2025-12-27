package com.travelAgency.mapper;

import com.travelAgency.db.model.Trip;
import com.travelAgency.db.model.dto.trip.TripDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TripMapper {

  @Mapping(source = "user.imageUrl", target = "userImageUrl")
  @Mapping(source = "user.username", target = "createdBy")
  TripDTO toTripDTO(Trip trip);
}
