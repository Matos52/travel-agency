package com.travelAgency.db.model.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TripByTravelStyle {
  private String travelStyle;
  private int count;
}
