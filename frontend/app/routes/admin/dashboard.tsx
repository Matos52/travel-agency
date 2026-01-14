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
import {
  GridComponent,
  ColumnDirective,
  ColumnsDirective,
} from "@syncfusion/ej2-react-grids";
import { Header, StatsCard, TripCard } from "components";
import { useEffect, useMemo } from "react";
import { tripXAxis, tripYAxis, userXAxis, userYAxis } from "~/constants";
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
    tripsByTravelStyle,
    fetchTripsByTravelStyle,
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
    name: user.fullName,
    count: Number(user.itineraryCreated),
  }));

  const showedTrips = allTrips.map((trip) => ({
    imageUrl: trip.imageUrls[0],
    name: trip.name,
    interest: trip.interests,
  }));

  const usersAndTrips = [
    {
      title: "Latest user signups",
      dataSource: mappedUsers,
      field: "count",
      headerText: "Trips created",
    },
    {
      title: "Trips based on interests",
      dataSource: showedTrips,
      field: "interest",
      headertext: "Interests",
    },
  ];

  useEffect(() => {
    Promise.all([
      fetchDashboardStats(),
      fetchUsersPerDay(),
      fetchTripsPerDay(),
      fetchUsers(0, 4),
      fetchTrips(0, 4),
      fetchTripsByTravelStyle(),
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
        title={`Welcome ${user?.fullName.trim().split(/\s+/)[0] ?? "Guest"} 👋`}
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
          tooltip={{ enable: true, opacity: 0.9 }}
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
            {/* Column – Users */}
            <SeriesDirective
              dataSource={usersPerDay}
              xName="day"
              yName="count"
              type="Column"
              name="Users"
              columnWidth={0.3}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
              fill="#4D7C0F" // olive
            />

            {/* Spline Area – Trend */}
            <SeriesDirective
              dataSource={usersPerDay}
              xName="day"
              yName="count"
              type="SplineArea"
              name="Trend"
              fill="rgba(77, 124, 15, 0.25)" // light olive
              border={{ width: 2, color: "#365314" }} // dark olive
            />
          </SeriesCollectionDirective>
        </ChartComponent>

        <ChartComponent
          id="chart-2"
          primaryXAxis={tripXAxis}
          primaryYAxis={tripYAxis}
          title="Trip Trends"
          tooltip={{ enable: true, opacity: 0.9 }}
        >
          <Inject services={[ColumnSeries, Category, DataLabel, Tooltip]} />

          <SeriesCollectionDirective>
            {/* Column – Trips */}
            <SeriesDirective
              dataSource={tripsByTravelStyle}
              xName="travelStyle"
              yName="count"
              type="Column"
              name="Trips"
              columnWidth={0.3}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
              fill="#4D7C0F" // olive
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </section>

      <section className="user-trip wrapper">
        {usersAndTrips.map(({ title, dataSource, field, headerText }, i) => (
          <div key={i} className="flex flex-col gap-5">
            <h3 className="p-20-semibold text-dark-100">{title}</h3>

            <GridComponent dataSource={dataSource} gridLines="None">
              <ColumnsDirective>
                <ColumnDirective
                  field="name"
                  headerText="Name"
                  width="200"
                  textAlign="Left"
                  template={(props: UsersItineraryCount) => (
                    <div className="flex items-center gap-1.5">
                      <img
                        src={props.imageUrl}
                        alt="user"
                        className="rounded-full size-8 aspect-square"
                        referrerPolicy="no-referrer"
                      />
                      <span>{props.name}</span>
                    </div>
                  )}
                />
                <ColumnDirective
                  field={field}
                  headerText={headerText}
                  width="150"
                  textAlign="Left"
                />
              </ColumnsDirective>
            </GridComponent>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Dashboard;
