package com.travelAgency.controller;

import com.travelAgency.db.model.dto.dashboard.DailyCount;
import com.travelAgency.db.model.dto.dashboard.DashboardStats;
import com.travelAgency.db.model.dto.dashboard.TripByTravelStyle;
import com.travelAgency.db.model.dto.trip.*;
import com.travelAgency.db.model.dto.user.UserDTO;
import com.travelAgency.service.DashboardService;
import com.travelAgency.service.TripService;
import com.travelAgency.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@CommonsLog
@RestController
@RequiredArgsConstructor
public class TravelAgencyController {

  private final UserService userService;
  private final TripService tripService;
  private final DashboardService dashboardService;

  @GetMapping("/users/me")
  ResponseEntity<UserDTO> getUser(Principal principal) {
    String userEmail = principal.getName();
    return ResponseEntity.ok().body(userService.getUser(userEmail));
  }

  @GetMapping("/users")
  ResponseEntity<Page<UserDTO>> getUsers(
      @RequestParam(defaultValue = "0") @Min(0) int pageIndex,
      @RequestParam(defaultValue = "5") @Min(0) int pageSize) {
    Page<UserDTO> users = userService.getUsers(pageIndex, pageSize);
    return ResponseEntity.ok().body(users);
  }

  @PostMapping("/auth/logout")
  ResponseEntity<HttpStatus> logout(HttpServletResponse response) {
    userService.logout(response);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/trips")
  ResponseEntity<TripResponse> createTrip(
      @RequestBody @Valid CreateTripRequest createTripRequest, Principal principal) {
    String userEmail = principal.getName();
    return ResponseEntity.ok().body(tripService.createTrip(createTripRequest, userEmail));
  }

  @GetMapping("/trips/{tripId}")
  ResponseEntity<TripDTO> getTrip(@PathVariable Long tripId, Principal principal) {
    String userEmail = principal.getName();
    return ResponseEntity.ok().body(tripService.getTrip(tripId, userEmail));
  }

  @GetMapping("/trips")
  ResponseEntity<Page<TripForListDTO>> getTrips(
      @RequestParam(defaultValue = "0") @Min(0) int pageIndex,
      @RequestParam(defaultValue = "5") @Min(0) int pageSize) {
    Page<TripForListDTO> trips = tripService.getTrips(pageIndex, pageSize);
    return ResponseEntity.ok().body(trips);
  }

  @PostMapping("/trips/{tripId}/rating")
  ResponseEntity<TripDTO> rateTrip(
      @PathVariable Long tripId, @RequestBody @Valid RateTripRequest rateTripRequest, Principal principal) {
    String userEmail = principal.getName();
    return ResponseEntity.ok().body(tripService.rateTrip(tripId, rateTripRequest.rating(), userEmail));
  }

  @GetMapping("/dashboardStats")
  ResponseEntity<DashboardStats> getDashboardStats() {
    return ResponseEntity.ok().body(dashboardService.getDashboardStats());
  }

  @GetMapping("/usersPerDay")
  ResponseEntity<List<DailyCount>> getUsersPerDay() {
    return ResponseEntity.ok().body(dashboardService.getUsersJoinedAtPerDay());
  }

  @GetMapping("/tripsPerDay")
  ResponseEntity<List<DailyCount>> getTripsPerDay() {
    return ResponseEntity.ok().body(dashboardService.getTripsCreatedPerDay());
  }

  @GetMapping("/tripsByTravelStyle")
  ResponseEntity<List<TripByTravelStyle>> getTripsByTravelStyle() {
    return ResponseEntity.ok().body(dashboardService.getTripsByTravelStyle());
  }
}
