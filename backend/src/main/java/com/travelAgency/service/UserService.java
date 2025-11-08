package com.travelAgency.service;

import com.travelAgency.db.model.dto.UserDTO;
import jakarta.servlet.http.HttpServletResponse;

public interface UserService {

  UserDTO getUser(String token);

  void logout(HttpServletResponse response);
}
