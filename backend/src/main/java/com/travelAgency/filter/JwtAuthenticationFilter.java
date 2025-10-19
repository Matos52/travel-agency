package com.travelAgency.filter;

import com.travelAgency.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtService jwtService;
  private final UserDetailsService userDetailsService;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {

    // Get the JWT from the request
    String token = resolveTokenFromRequest(request);

    if (token != null && jwtService.validateToken(token)) {
      String email = jwtService.extractSubject(token);

      UserDetails userDetails = userDetailsService.loadUserByUsername(email);
      UsernamePasswordAuthenticationToken auth =
          new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
      auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
      SecurityContextHolder.getContext().setAuthentication(auth);
    }

    filterChain.doFilter(request, response);
  }

  private String resolveTokenFromRequest(HttpServletRequest request) {
    String bearer = request.getHeader("Authorization");

    //Get token from Authorization header
    if (bearer != null && bearer.startsWith("Bearer ")) {
      return bearer.substring(7);
    }

    //Or get a token from Cookie
    if (request.getCookies() != null) {
      return Arrays.stream(request.getCookies())
                   .filter(cookie -> "ACCESS_TOKEN".equals(cookie.getName()))
                   .map(Cookie::getValue)
                   .findFirst()
                   .orElse(null);
    }

    return null;
  }
}
