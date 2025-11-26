import { createContext, useContext, useState } from "react";
import axios from "axios";

const emptyDashboardStats: DashboardStats = {
  totalUsers: 0,
  totalUsersWithUserRole: 0,
  totalTrips: 0,
  usersJoined: {
    currentMonth: 0,
    lastMonth: 0,
  },
  usersJoinedWithUserRole: {
    currentMonth: 0,
    lastMonth: 0,
  },
  tripsCreated: {
    currentMonth: 0,
    lastMonth: 0,
  },
};

const emptyDailyCount: DailyCount = {
  day: "",
  count: 0,
};

interface DashboardContextType {
  dashboardStats: DashboardStats;
  fetchDashboardStats: () => Promise<void>;
  usersPerDay: DailyCount;
  fetchUsersPerDay: () => Promise<void>;
  tripsPerDay: DailyCount;
  fetchTripsPerDay: () => Promise<void>;
  tripsByTravelStyle: TripByTravelStyle[];
  fetchTripsByTravelStyle: () => Promise<void>;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dashboardStats, setDashboardStats] =
    useState<DashboardStats>(emptyDashboardStats);
  const [usersPerDay, setUsersPerDay] = useState<DailyCount>(emptyDailyCount);
  const [tripsPerDay, setTripsPerDay] = useState<DailyCount>(emptyDailyCount);
  const [tripsByTravelStyle, setTripsByTravelStyle] = useState<
    TripByTravelStyle[]
  >([]);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/getDashboardStats`, {
        withCredentials: true,
      });
      setDashboardStats(data);
    } catch (error) {
      console.log("Failed to fetch dashboardStats", error);
      setDashboardStats(emptyDashboardStats);
    }
  };

  const fetchUsersPerDay = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/getUsersPerDay`, {
        withCredentials: true,
      });
      setUsersPerDay(data);
    } catch (error) {
      console.log("Failed to fetch usersPerDay", error);
      setUsersPerDay(emptyDailyCount);
    }
  };

  const fetchTripsPerDay = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/getTripsPerDay`, {
        withCredentials: true,
      });
      setTripsPerDay(data);
    } catch (error) {
      console.log("Failed to fetch tripsPerDay", error);
      setTripsPerDay(emptyDailyCount);
    }
  };

  const fetchTripsByTravelStyle = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/getTripsByTravelStyle`, {
        withCredentials: true,
      });
      setTripsByTravelStyle(data);
    } catch (error) {
      console.log("Failed to fetch tripsByTravelStyle", error);
      setTripsByTravelStyle([]);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        dashboardStats,
        fetchDashboardStats,
        usersPerDay,
        fetchUsersPerDay,
        tripsPerDay,
        fetchTripsPerDay,
        tripsByTravelStyle,
        fetchTripsByTravelStyle,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx)
    throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
};
