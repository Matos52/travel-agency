package com.travelAgency.mapper;

import com.travelAgency.db.model.Trip;
import com.travelAgency.db.model.dto.trip.TripDTO;
import com.travelAgency.db.model.dto.trip.TripForListDTO;
import com.travelAgency.db.repository.TripRatingSummaryForListProjection;
import com.travelAgency.db.repository.TripRatingSummaryProjection;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TripMapper {

  @Mapping(source = "trip.user.imageUrl", target = "userImageUrl")
  @Mapping(source = "trip.user.fullName", target = "createdBy")
  @Mapping(source = "summary.averageRating", target = "averageRating")
  @Mapping(source = "summary.ratingsCount", target = "ratingsCount")
  @Mapping(source = "summary.myRating", target = "myRating")
  TripDTO toTripDTO(Trip trip, TripRatingSummaryProjection summary);

  @Mapping(source = "trip.user.imageUrl", target = "userImageUrl")
  @Mapping(source = "trip.user.fullName", target = "createdBy")
  @Mapping(source = "summary.averageRating", target = "averageRating")
  @Mapping(source = "summary.ratingsCount", target = "ratingsCount")
  TripForListDTO toTripForListDTO(Trip trip, TripRatingSummaryForListProjection summary);
}
