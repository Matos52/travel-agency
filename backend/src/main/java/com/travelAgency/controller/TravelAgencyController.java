package com.travelAgency.controller;

import com.travelAgency.db.model.dto.dashboard.DailyCount;
import com.travelAgency.db.model.dto.dashboard.DashboardStats;
import com.travelAgency.db.model.dto.trip.TripDTO;
import com.travelAgency.db.model.dto.trip.TripRequest;
import com.travelAgency.db.model.dto.trip.TripResponse;
import com.travelAgency.db.model.dto.user.UserDTO;
import com.travelAgency.service.DashboardService;
import com.travelAgency.service.TripService;
import com.travelAgency.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CommonsLog
@RestController
@RequiredArgsConstructor
public class TravelAgencyController {

  private final UserService userService;
  private final TripService tripService;
  private final DashboardService dashboardService;

  @GetMapping("/getUser")
  ResponseEntity<UserDTO> getUser(@CookieValue("ACCESS_TOKEN") String token) {
    return ResponseEntity.ok().body(userService.getUser(token));
  }

  @GetMapping("/getUsers")
  ResponseEntity<Page<UserDTO>> getUsers(
      @RequestParam(defaultValue = "0") @Min(0) int pageIndex,
      @RequestParam(defaultValue = "5") @Min(0) int pageSize) {
    Page<UserDTO> users = userService.getUsers(pageIndex, pageSize);
    return ResponseEntity.ok().body(users);
  }

  @PostMapping("/userLogout")
  ResponseEntity<HttpStatus> logout(HttpServletResponse response) {
    userService.logout(response);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/create-trip")
  ResponseEntity<TripResponse> createTrip(@RequestBody TripRequest tripRequest) {
    return ResponseEntity.ok().body(tripService.createTrip(tripRequest));
  }

  @GetMapping("/trips/{tripId}")
  ResponseEntity<TripDTO> getTrip(@PathVariable Long tripId) {
    return ResponseEntity.ok().body(tripService.getTrip(tripId));
  }

  @GetMapping("/trips")
  ResponseEntity<Page<TripDTO>> getTrips(
      @RequestParam(defaultValue = "0") @Min(0) int pageIndex,
      @RequestParam(defaultValue = "5") @Min(0) int pageSize) {
    Page<TripDTO> trips = tripService.getTrips(pageIndex, pageSize);
    return ResponseEntity.ok().body(trips);
  }

  @GetMapping("/getDashboardStats")
  ResponseEntity<DashboardStats> getDashboardStats() {
    return ResponseEntity.ok().body(dashboardService.getDashboardStats());
  }

  @GetMapping("/getUsersPerDay")
  ResponseEntity<List<DailyCount>> getUsersPerDay() {
    return ResponseEntity.ok().body(dashboardService.getUsersJoinedAtPerDay());
  }

  @GetMapping("/getTripsPerDay")
  ResponseEntity<List<DailyCount>> getTripsPerDay() {
    return ResponseEntity.ok().body(dashboardService.getTripsCreatedPerDay());
  }
}
