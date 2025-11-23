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

interface DashboardContextType {
  dashboardStats: DashboardStats;
  setDashboardStats: (trip: DashboardStats) => void;
  fetchDashboardStats: () => Promise<void>;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(emptyDashboardStats);

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

  return (
    <DashboardContext.Provider
      value={{
        dashboardStats,
        setDashboardStats,
        fetchDashboardStats
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
};