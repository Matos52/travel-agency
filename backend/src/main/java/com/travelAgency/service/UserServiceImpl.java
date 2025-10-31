package com.travelAgency.service;

import com.travelAgency.db.model.User;
import com.travelAgency.db.model.dto.UserDTO;
import com.travelAgency.db.repository.UserRepository;
import com.travelAgency.exception.UserNotFoundException;
import com.travelAgency.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final JwtService jwtService;
  private final UserMapper userMapper;

  @Override
  public UserDTO getUser(String token) {

    String email = jwtService.extractSubject(token);

    User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException(email, User.class));

    return userMapper.toUserDTO(user);
  }
}
