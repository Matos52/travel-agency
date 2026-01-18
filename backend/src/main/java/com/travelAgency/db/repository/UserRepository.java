package com.travelAgency.db.repository;

import com.travelAgency.db.model.Status;
import com.travelAgency.db.model.User;
import com.travelAgency.db.model.dto.dashboard.DailyCount;
import com.travelAgency.db.repository.projection.UserWithRatingCount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);

  long countByJoinedAtBetween(LocalDateTime start, LocalDateTime end);

  long countByStatus(Status status);

  long countByStatusAndJoinedAtBetween(Status status, LocalDateTime start, LocalDateTime end);

  @Query(
      """
          SELECT new com.travelAgency.db.model.dto.dashboard.DailyCount(
              CAST(u.joinedAt AS date),
              COUNT(u)
          )
          FROM User u
          GROUP BY CAST(u.joinedAt AS date)
          """)
  List<DailyCount> getUsersJoinedAtPerDay();

  @Query(
      """
          select u.id as id,
                 u.fullName as fullName,
                 u.email as email,
                 u.accountId as accountId,
                 u.imageUrl as imageUrl,
                 u.joinedAt as joinedAt,
                 u.itineraryCreated as itineraryCreated,
                 u.status as status,
                 count(tr.id) as ratedTripsCount
          from User u
          left join TripRating tr on tr.user.id = u.id
          group by u.id, u.fullName, u.email, u.accountId, u.imageUrl, u.joinedAt, u.itineraryCreated, u.status
          """)
  Page<UserWithRatingCount> findUsersWithRatingCount(Pageable pageable);
}
