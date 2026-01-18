package com.travelAgency.db.repository;

import com.travelAgency.db.model.TripRating;
import com.travelAgency.db.repository.projection.TripRatingSummaryForListProjection;
import com.travelAgency.db.repository.projection.TripRatingSummaryProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TripRatingRepository extends JpaRepository<TripRating, Long> {
  Optional<TripRating> findByTripIdAndUserEmail(Long tripId, String email);

  @Query(
      """
            SELECT
              AVG(r.rating) AS averageRating,
              COUNT(r.id) AS ratingsCount,
              MAX(
                CASE WHEN u.email = :email THEN r.rating END
              ) AS myRating
            FROM TripRating r
            JOIN r.user u
            WHERE r.trip.id = :tripId
          """)
  TripRatingSummaryProjection getSummary(
      @Param("tripId") Long tripId,
      @Param("email") String email
  );

  @Query(
      """
              SELECT
                  t.id AS tripId,
                  AVG(r.rating) AS averageRating,
                  COUNT(r.id) AS ratingsCount
              FROM Trip t
              LEFT JOIN t.ratings r
              WHERE t.id IN :tripIds
              GROUP BY t.id
          """)
  List<TripRatingSummaryForListProjection> getSummariesForTripsByIds(@Param("tripIds") List<Long> tripIds);
}
