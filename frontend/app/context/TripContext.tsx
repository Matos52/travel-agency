import { createContext, useContext, useState } from "react";
import axios from "axios";

const emptyCreatedTrip: CreatedTrip = {
  id: 0,
  tripDetail: "",
  imageUrls: [],
  createdAt: "",
  createdBy: "",
  userImageUrl: "",
  averageRating: 0,
  ratingsCount: 0,
  myRating: 0,
};

interface TripContextType {
  trip: CreatedTrip;
  setTrip: (trip: CreatedTrip) => void;
  trips: CreatedTrip[];
  createTrip: (tripData: TripFormData) => Promise<CreateTripResponse | null>;
  fetchTrip: (tripId: number) => Promise<void>;
  fetchTrips: (pageIndex: number, pageSize: number) => Promise<void>;
  pageIndex: number;
  pageSize: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  totalElements: number;
  rateTrip: (rating: number, tripId: number) => Promise<void>;
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

  const rateTrip = async (rating: number, tripId: number) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/trips/${tripId}/rating`,
        {
          rating,
        },
        {
          withCredentials: true,
        }
      );
      setTrip(data);
    } catch (error) {
      console.log(`Failed to rate trip with id: ${tripId}`, error);
    }
  };

  const createTrip = async (tripData: TripFormData) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/trips`,
        {
          country: tripData.country,
          numberOfDays: tripData.duration,
          travelStyle: tripData.travelStyle,
          interest: tripData.interest,
          budget: tripData.budget,
          groupType: tripData.groupType,
        },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      console.error("Error generating trip", error);
      return null;
    }
  };

  const fetchTrip = async (tripId: number) => {
    try {
      const { data } = await axios.get(`${backendUrl}/trips/${tripId}`, {
        withCredentials: true,
      });
      setTrip(data);
    } catch (error) {
      console.error(`Failed to fetch trip with id: ${tripId}`, error);
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
      console.error("Failed to fetch trips", error);
    }
  };

  return (
    <TripContext.Provider
      value={{
        trip,
        setTrip,
        trips,
        createTrip,
        fetchTrip,
        fetchTrips,
        pageIndex,
        pageSize,
        setPageIndex,
        setPageSize,
        totalElements,
        rateTrip,
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
