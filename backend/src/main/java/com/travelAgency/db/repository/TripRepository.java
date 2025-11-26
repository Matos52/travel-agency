package com.travelAgency.db.repository;

import com.travelAgency.db.model.Trip;
import com.travelAgency.db.model.dto.dashboard.DailyCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
  long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

  @Query(
      """
          SELECT new com.travelAgency.db.model.dto.dashboard.DailyCount(
              CAST(t.createdAt AS date),
              COUNT(t)
          )
          FROM Trip t
          GROUP BY CAST(t.createdAt AS date)
          """)
  List<DailyCount> getTripsCreatedPerDay();

  @Query(
      value = """
          SELECT 
            JSON_UNQUOTE(JSON_EXTRACT(t.trip_detail, '$.travelStyle')) AS travelStyle,
            COUNT(*) AS count
          FROM trip t
          GROUP BY JSON_UNQUOTE(JSON_EXTRACT(t.trip_detail, '$.travelStyle'))
          """,
      nativeQuery = true
  )
  List<TravelStyleAggregation> getTripsByTravelStyleAggregation();
}
