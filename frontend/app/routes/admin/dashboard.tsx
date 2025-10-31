import { Header, StatsCard, TripCard } from "components";
import { useEffect, useState } from "react";
import { dashboardStats, allTrips } from "~/constants";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

const { totalUsers, usersJoined, totalTrips, tripsCreated, userRole } =
  dashboardStats;

const dashboard = () => {
  const [user, setUser] = useState({
      username: "",
      email: "",
      accountId: 0,
      imageUrl: "",
      joinedAt: "",
      status: "",
  });
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

useEffect(() => {
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/getUser`, {
        withCredentials: true,
      });
      console.log(data)
      setUser(data);
    } catch (error) {
      toast.error("Failed to fetch user");
      console.log("Failed to fetch user", error);
    }
  };

  fetchUser();
}, []);

  return (
    <main className="dashboard wrapper">
      <ToastContainer />
      <Header
        title={`Welcome ${user?.username ?? "Guest"}`}
        description="Track activity, trends and popular destinations in real time"
      />
      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <StatsCard
            headerTitle="Total Users"
            total={totalUsers}
            currentMonthCount={usersJoined.currentMonth}
            lastMonthCount={usersJoined.lastMonth}
          />
          <StatsCard
            headerTitle="Total Trips"
            total={totalTrips}
            currentMonthCount={tripsCreated.currentMonth}
            lastMonthCount={tripsCreated.lastMonth}
          />
          <StatsCard
            headerTitle="Active Users"
            total={userRole.total}
            currentMonthCount={userRole.currentMonth}
            lastMonthCount={userRole.lastMonth}
          />
        </div>
      </section>

      <section className="container">
        <h1 className="text-xl font-semibold">Created Trips</h1>
        <div className="trip-grid">
          {allTrips
            .slice(0, 4)
            .map(({ id, name, imageUrls, itinerary, tags, estimatedPrice }) => (
              <TripCard
                key={id}
                id={id.toString()}
                name={name}
                imageUrl={imageUrls[0]}
                location={itinerary?.[0]?.location ?? ""}
                tags={tags}
                price={estimatedPrice}
              />
            ))}
        </div>
      </section>
    </main>
  );
};

export default dashboard;
