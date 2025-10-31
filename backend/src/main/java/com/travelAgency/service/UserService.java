package com.travelAgency.service;

import com.travelAgency.db.model.dto.UserDTO;

public interface UserService {

  UserDTO getUser(String token);
}
