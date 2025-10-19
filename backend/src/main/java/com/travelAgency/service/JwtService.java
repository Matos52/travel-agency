package com.travelAgency.service;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

  @Value("${app.jwt.secret}")
  private String secret;

  @Value("${app.jwt.expiration-ms}")
  private long expirationMs;

  public String generateToken(String subject) {
    Date now = new Date();
    Date expiration = new Date(now.getTime() + expirationMs);
    return Jwts.builder()
               .subject(subject)
               .issuedAt(now)
               .expiration(expiration)
               .signWith(getSigningKey())
               .compact();
  }

  public boolean validateToken(String token) {
    try {
      Jwts.parser()
          .verifyWith(getSigningKey())
          .build()
          .parseSignedClaims(token);
      return true;
    }
    catch (JwtException e) {
      return false;
    }
  }

  public String extractSubject(String token) {
    return Jwts.parser()
               .verifyWith(getSigningKey())
               .build()
               .parseSignedClaims(token)
               .getPayload()
               .getSubject();
  }

  private SecretKey getSigningKey() {
    byte[] keyBytes = Decoders.BASE64URL.decode(secret);
    return Keys.hmacShaKeyFor(keyBytes);
  }
}
