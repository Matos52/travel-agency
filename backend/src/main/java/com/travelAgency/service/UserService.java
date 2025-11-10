package com.travelAgency.service;

import com.travelAgency.db.model.dto.UserDTO;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.domain.Page;

public interface UserService {

  UserDTO getUser(String token);

  Page<UserDTO> getUsers(int pageRequest, int pageSize);

  void logout(HttpServletResponse response);
}
