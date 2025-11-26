package com.travelAgency.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelAgency.db.model.Status;
import com.travelAgency.db.model.dto.dashboard.DailyCount;
import com.travelAgency.db.model.dto.dashboard.DashboardStats;
import com.travelAgency.db.model.dto.dashboard.MonthCount;
import com.travelAgency.db.model.dto.dashboard.TripByTravelStyle;
import com.travelAgency.db.repository.TravelStyleAggregation;
import com.travelAgency.db.repository.TripRepository;
import com.travelAgency.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

  private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
  private final UserRepository userRepository;
  private final TripRepository tripRepository;

  @Override
  public DashboardStats getDashboardStats() {
    LocalDate now = LocalDate.now();
    LocalDateTime startCurrent = now.withDayOfMonth(1).atStartOfDay();
    LocalDateTime startPrev = now.minusMonths(1).withDayOfMonth(1).atStartOfDay();
    LocalDateTime endPrev = now.withDayOfMonth(1).atStartOfDay().minusSeconds(1);

    long totalUsers = userRepository.count();
    long usersJoinedCurrentMonth = userRepository.countByJoinedAtBetween(startCurrent, LocalDateTime.now());
    long usersJoinedLastMonth = userRepository.countByJoinedAtBetween(startPrev, endPrev);

    long totalUsersWithUserRole = userRepository.countByStatus(Status.USER);
    long usersWithUserRoleCurrentMonth =
        userRepository.countByStatusAndJoinedAtBetween(Status.USER, startCurrent, LocalDateTime.now());
    long usersWithUserRoleLastMonth = userRepository.countByStatusAndJoinedAtBetween(Status.USER, startPrev, endPrev);

    long totalTrips = tripRepository.count();
    long tripsCreatedCurrentMonth = tripRepository.countByCreatedAtBetween(startCurrent, LocalDateTime.now());
    long tripsCreatedLastMonth = tripRepository.countByCreatedAtBetween(startPrev, endPrev);

    return new DashboardStats(
        totalUsers,
        totalUsersWithUserRole,
        totalTrips,
        new MonthCount(usersJoinedCurrentMonth, usersJoinedLastMonth),
        new MonthCount(usersWithUserRoleCurrentMonth, usersWithUserRoleLastMonth),
        new MonthCount(tripsCreatedCurrentMonth, tripsCreatedLastMonth)
    );
  }

  @Override
  public List<DailyCount> getUsersJoinedAtPerDay() {
    return userRepository.getUsersJoinedAtPerDay();
  }

  @Override
  public List<DailyCount> getTripsCreatedPerDay() {
    return tripRepository.getTripsCreatedPerDay();
  }

  @Override
  public List<TripByTravelStyle> getTripsByTravelStyle() {
    List<TravelStyleAggregation> projections = tripRepository.getTripsByTravelStyleAggregation();

    return projections.stream()
        .map(p -> new TripByTravelStyle(p.getTravelStyle(), p.getCount()))
        .toList();
  }
}
