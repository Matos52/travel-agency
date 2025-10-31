package com.travelAgency.controller;

import com.travelAgency.db.model.dto.UserDTO;
import com.travelAgency.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@CommonsLog
@RestController
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @GetMapping("/getUser")
  ResponseEntity<UserDTO> getUser(@CookieValue("ACCESS_TOKEN") String token) {
    return ResponseEntity.ok().body(userService.getUser(token));
  }
}
