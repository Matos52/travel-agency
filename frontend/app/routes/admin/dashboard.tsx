import {
  Category,
  ChartComponent,
  ColumnSeries,
  DataLabel,
  Inject,
  SeriesCollectionDirective,
  SeriesDirective,
  SplineAreaSeries,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import { Header, StatsCard, TripCard } from "components";
import { useEffect, useMemo } from "react";
import { userXAxis, userYAxis } from "~/constants";
import { useDashboard } from "~/context/DashboardContext";
import { useTrip } from "~/context/TripContext";
import { useUser } from "~/context/UserContext";
import { parseTripData } from "~/lib/utils";

const Dashboard = () => {
  const { user, users, fetchUsers } = useUser();
  const {
    dashboardStats,
    fetchDashboardStats,
    fetchTripsPerDay,
    fetchUsersPerDay,
    tripsPerDay,
    usersPerDay,
  } = useDashboard();
  const { trips, fetchTrips } = useTrip();

  const allTrips = useMemo(() => {
    return trips.map(({ id, tripDetail, imageUrls }) => ({
      id,
      ...(tripDetail ? parseTripData(tripDetail) : {}),
      imageUrls: imageUrls,
    }));
  }, [trips]);

  const mappedUsers: UsersItineraryCount[] = users.map((user) => ({
    imageUrl: user.imageUrl,
    name: user.username,
    count: user.itineraryCreated ?? Math.floor(Math.random() * 10),
  }));

  useEffect(() => {
    Promise.all([
      fetchDashboardStats(),
      fetchUsersPerDay(),
      fetchTripsPerDay(),
      fetchUsers(0, 4),
      fetchTrips(0, 4),
    ]);
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
          {allTrips.map(
            ({
              id,
              name,
              imageUrls,
              itinerary,
              interests,
              travelStyle,
              estimatedPrice,
            }) => (
              <TripCard
                key={id}
                id={id.toString()}
                name={name ?? ""}
                location={itinerary?.[0]?.location ?? ""}
                imageUrl={imageUrls?.[0] ?? ""}
                tags={[interests ?? "", travelStyle ?? ""]}
                price={estimatedPrice ?? ""}
              />
            )
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartComponent
          id="chart-1"
          primaryXAxis={userXAxis}
          primaryYAxis={userYAxis}
          title="User Growth"
          tooltip={{ enable: true }}
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
            ]}
          />

          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={usersPerDay}
              xName="day"
              yName="count"
              type="Column"
              name="Column"
              columnWidth={0.3}
              cornerRadius={{topLeft: 10, topRight: 10}}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </section>
    </main>
  );
};

export default Dashboard;
