package com.travelAgency.db.repository;

import com.travelAgency.db.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripRepository extends JpaRepository<Trip, Long> {
}
