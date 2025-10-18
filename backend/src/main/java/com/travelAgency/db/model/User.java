package com.travelAgency.db.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
  private String email;
  private String accountId;
  private String imageUrl;
  private LocalDateTime joinedAt;
  @Enumerated(EnumType.STRING)
  private Status status;
}
