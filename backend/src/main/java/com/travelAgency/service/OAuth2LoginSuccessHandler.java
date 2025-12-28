package com.travelAgency.service;

import com.travelAgency.db.model.User;
import com.travelAgency.db.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.Duration;

@Service
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

  private final JwtService jwtService;
  private final UserRepository userRepository;
  private final String frontendUrl;
  private final String cookieName;

  public OAuth2LoginSuccessHandler(
      JwtService jwtService,
      UserRepository userRepository,
      @Value("${app.frontend.url}") String frontendUrl,
      @Value("${app.jwt.cookie-name}") String cookieName) {
    this.jwtService = jwtService;
    this.userRepository = userRepository;
    this.frontendUrl = frontendUrl;
    this.cookieName = cookieName;
  }

  @Override
  @Transactional
  public void onAuthenticationSuccess(
      HttpServletRequest request, HttpServletResponse response,
      Authentication authentication) throws IOException {

    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

    String fullName = oAuth2User.getAttribute("name");
    String email = oAuth2User.getAttribute("email");
    String accountId = oAuth2User.getAttribute("sub");
    String imageUrl = oAuth2User.getAttribute("picture");

    userRepository.findByEmail(email).orElseGet(() -> {
      User user = User.builder()
                      .fullName(fullName)
                      .email(email)
                      .accountId(accountId)
                      .imageUrl(imageUrl)
                      .build();
      return userRepository.save(user);
    });

    //Generate JWT
    String jwt = jwtService.generateToken(email);

    //Set cookie
    Cookie cookie = new Cookie(cookieName, jwt);
    cookie.setHttpOnly(true);
    cookie.setPath("/");
    cookie.setMaxAge((int) (Duration.ofDays(7).getSeconds()));

    response.addCookie(cookie);
    response.sendRedirect(frontendUrl);
  }
}
