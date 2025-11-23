import { Header, StatsCard, TripCard } from "components";
import { useEffect } from "react";
import { allTrips } from "~/constants";
import { useDashboard } from "~/context/DashboardContext";
import { useUser } from "~/context/UserContext";

const Dashboard = () => {
  const { user } = useUser();
  const { dashboardStats, fetchDashboardStats } = useDashboard();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const {
    totalTrips,
    totalUsers,
    totalUsersWithUserRole,
    tripsCreated,
    usersJoined,
    usersJoinedWithUserRole,
  } = dashboardStats;

  return (
    <main className="dashboard wrapper">
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
            total={totalUsersWithUserRole}
            currentMonthCount={usersJoinedWithUserRole.currentMonth}
            lastMonthCount={usersJoinedWithUserRole.lastMonth}
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

export default Dashboard;
