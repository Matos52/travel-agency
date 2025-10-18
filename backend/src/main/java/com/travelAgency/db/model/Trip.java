package com.travelAgency.db.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Trip {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String tripDetail;

  @ElementCollection
  @CollectionTable(
      name = "trip_images",
      joinColumns = @JoinColumn(name = "trip_id")
  )
  @Column(name = "image_url")
  private List<String> imageUrls = new ArrayList<>();

  private LocalDateTime createdAt;
  private String paymentLink;
  private String userId;
}
