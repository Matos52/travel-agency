package com.travelAgency.db.model.dto.dashboard;

public record DashboardStats(
    long totalUsers,
    long totalUsersWithUserRole,
    long totalTrips,
    MonthCount usersJoined,
    MonthCount usersJoinedWithUserRole,
    MonthCount tripsCreated
) {
}
