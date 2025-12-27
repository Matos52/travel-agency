import { createContext, useContext, useState } from "react";
import axios from "axios";

const emptyCreatedTrip: CreatedTrip = {
  id: 0,
  tripDetail: "",
  imageUrls: [],
  createdAt: "",
  createdBy: "",
  userImageUrl: ""
};

interface TripContextType {
  trip: CreatedTrip;
  setTrip: (trip: CreatedTrip) => void;
  trips: CreatedTrip[];
  fetchTrip: (tripId: number) => Promise<void>;
  fetchTrips: (pageIndex: number, pageSize: number) => Promise<void>;
  pageIndex: number;
  pageSize: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  totalElements: number;
}

export const TripContext = createContext<TripContextType | undefined>(
  undefined
);

export const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [trip, setTrip] = useState<CreatedTrip>(emptyCreatedTrip);
  const [trips, setTrips] = useState<CreatedTrip[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [totalElements, setTotalElements] = useState(0);

  const fetchTrip = async (tripId: number) => {
    try {
      const { data } = await axios.get(`${backendUrl}/trips/${tripId}`, {
        withCredentials: true,
      });
      setTrip(data);
    } catch (error) {
      console.log(`Failed to fetch trip with id: ${tripId}`, error);
      setTrip(emptyCreatedTrip);
    }
  };

  const fetchTrips = async (pageIndex: number, pageSize: number) => {
    try {
      const { data } = await axios.get(`${backendUrl}/trips`, {
        params: { pageIndex, pageSize },
        withCredentials: true,
      });
      setTrips(data.content);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.log("Failed to fetch trips", error);
    }
  };

  return (
    <TripContext.Provider
      value={{
        trip,
        setTrip,
        trips,
        fetchTrip,
        fetchTrips,
        pageIndex,
        pageSize,
        setPageIndex,
        setPageSize,
        totalElements,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used inside TripProvider");
  return ctx;
};
