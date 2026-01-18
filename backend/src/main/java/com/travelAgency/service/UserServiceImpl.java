package com.travelAgency.service;

import com.travelAgency.db.model.User;
import com.travelAgency.db.model.dto.user.UserDTO;
import com.travelAgency.db.repository.UserRepository;
import com.travelAgency.db.repository.projection.UserWithRatingCount;
import com.travelAgency.exception.UserNotFoundException;
import com.travelAgency.mapper.UserMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final UserMapper userMapper;

  @Override
  public UserDTO getUser(String userEmail) {
    User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new UserNotFoundException(userEmail, User.class));
    return userMapper.toUserDTO(user);
  }

  @Override
  public Page<UserDTO> getUsers(int pageIndex, int pageSize) {
    PageRequest pageRequest = PageRequest.of(pageIndex, pageSize);
    Page<UserWithRatingCount> users = userRepository.findUsersWithRatingCount(pageRequest);
    return users.map(userMapper::toUserDTOWithRating);
  }

  @Override
  public void logout(HttpServletResponse response) {
    Cookie cookie = new Cookie("ACCESS_TOKEN", "");
    cookie.setPath("/");
    cookie.setMaxAge(0);
    cookie.setHttpOnly(true);
    response.addCookie(cookie);
  }
}
