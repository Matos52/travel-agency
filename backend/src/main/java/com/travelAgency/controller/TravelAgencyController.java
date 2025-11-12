package com.travelAgency.controller;

import com.travelAgency.db.model.dto.TripRequest;
import com.travelAgency.db.model.dto.TripResponse;
import com.travelAgency.db.model.dto.UserDTO;
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

@CommonsLog
@RestController
@RequiredArgsConstructor
public class TravelAgencyController {

  private final UserService userService;
  private final TripService tripService;

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
}
