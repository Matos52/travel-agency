package com.travelAgency.service;

import com.travelAgency.db.model.dto.dashboard.DailyCount;
import com.travelAgency.db.model.dto.dashboard.DashboardStats;
import com.travelAgency.db.model.dto.dashboard.TripByTravelStyle;

import java.util.List;

public interface DashboardService {

  DashboardStats getDashboardStats();

  List<DailyCount> getUsersJoinedAtPerDay();

  List<DailyCount> getTripsCreatedPerDay();

  List<TripByTravelStyle> getTripsByTravelStyle();
}
