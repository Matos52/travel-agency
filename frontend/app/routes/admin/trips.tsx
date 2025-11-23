import { Header, TripCard } from "../../../components";
import { useEffect, useMemo } from "react";
import { useTrip } from "~/context/TripContext";
import { PagerComponent } from "@syncfusion/ej2-react-grids";
import { parseTripData } from "~/lib/utils";

const Trips = () => {
  const {
    trips,
    fetchTrips,
    pageIndex,
    pageSize,
    setPageIndex,
    totalElements,
  } = useTrip();

  const allTrips = useMemo(() => {
    return trips.map(({ id, tripDetail, imageUrls }) => ({
      id,
      ...(tripDetail ? parseTripData(tripDetail) : {}),
      imageUrls: imageUrls,
    }));
  }, [trips]);

  useEffect(() => {
    fetchTrips(pageIndex, pageSize);
  }, [pageIndex, pageSize]);

  const handlePageChange = (page: number) => {
    // Syncfusion Pager start from 1 → backend wants 0-index
    const newIndex = page - 1;

    setPageIndex(newIndex);

    window.history.replaceState({}, "", `?page=${page}`);
  };

  return (
    <main className="all-users wrapper">
      <Header
        title="Trips"
        description="View and edit AI-generated travel plans"
        ctaText="Create a trip"
        ctaUrl="/trips/create"
      />

      <section>
        <h1 className="p-24-semibold text-dark-100 mb-4">
          Manage Created Trips
        </h1>

        <div className="trip-grid mb-4">
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

        <PagerComponent
          totalRecordsCount={totalElements}
          pageSize={pageSize}
          currentPage={pageIndex + 1} // Syncfusion starts from 1
          click={(args) => handlePageChange(args.currentPage)}
          cssClass="!mb-4"
        />
      </section>
    </main>
  );
};

export default Trips;
