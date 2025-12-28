package com.travelAgency.db.repository;

import com.travelAgency.db.model.TripRating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TripRatingRepository extends JpaRepository<TripRating, Long> {
  Optional<TripRating> findByTripIdAndUserEmail(Long tripId, String email);
}
