import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { PagerComponent } from "@syncfusion/ej2-react-grids";
import { FeaturedDestination, Header, TripCard } from "components";
import { useEffect, useMemo } from "react";
import { Link } from "react-router";
import { useTrip } from "~/context/TripContext";
import { parseTripData } from "~/lib/utils";

const TravelPage = () => {
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
    <main className="flex flex-col">
      <section className="travel-hero">
        <div>
          <section className="wrapper">
            <article>
              <h1 className="p-72-bold text-dark-100">
                Plan Your Trip with Ease
              </h1>
              <p className="text-dark-100">
                Customize your travel itinerary in minutes - pick your
                destination, set your preferences, and explore witth confidence.
              </p>
            </article>

            <Link to="#trips">
              <ButtonComponent
                type="button"
                className="button-class !h-11 !w-full md:!w-[240px]"
              >
                <span className="p-16-semibold text-white">Get Started</span>
              </ButtonComponent>
            </Link>
          </section>
        </div>
      </section>

      <section className="pt-20 wrapper flex flex-col gap-10 h-full">
        <Header
          title="Featured Travel Destinations"
          description="Check out some of the best places you visit around the world"
        />
        <div className="featured">
          <article>
            <FeaturedDestination
              bgImage="bg-card-1"
              containerClass="h-1/3 lg:h-1/2"
              bigCard
              title="Barcelona Tour"
              rating={4.2}
              activityCount={196}
            />

            <div className="travel-featured">
              <FeaturedDestination
                bgImage="bg-card-2"
                bigCard
                title="London"
                rating={4.5}
                activityCount={512}
              />
              <FeaturedDestination
                bgImage="bg-card-3"
                bigCard
                title="Australia Tour"
                rating={3.5}
                activityCount={250}
              />
            </div>
          </article>
          <div className="flex flex-col gap-[30px]">
            <FeaturedDestination
              containerClass="w-full h-[240px]"
              bgImage="bg-card-4"
              title="Spain Tour"
              rating={3.8}
              activityCount={150}
            />
            <FeaturedDestination
              containerClass="w-full h-[240px]"
              bgImage="bg-card-5"
              title="Japan"
              rating={5}
              activityCount={150}
            />
            <FeaturedDestination
              containerClass="w-full h-[240px]"
              bgImage="bg-card-6"
              title="Italy Tour"
              rating={4.2}
              activityCount={500}
            />
          </div>
        </div>
      </section>

      <section id="trips" className="py-20 wrapper flex flex-col gap-10">
        <Header
          title="Handpicked Trips"
          description="Browse well-planned trips designes for your travel style"
        />
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
        <PagerComponent
          totalRecordsCount={totalElements}
          pageSize={pageSize}
          currentPage={pageIndex + 1} // Syncfusion starts from 1
          click={(args) => handlePageChange(args.currentPage)}
          cssClass="!mb-4"
        />
      </section>

      <footer className="h-28 bg-white">
        <div className="wrapper footer-container">
          <Link to="/">
            <img
              src="/assets/icons/logo.svg"
              alt="logo"
              className="size-[30px]"
            />
            <h1>Tourvisto</h1>
          </Link>

          <div>
            {["Terms & Conditions", "Privacy Policy"].map((item) => (
              <Link to="/" key={item}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
};

export default TravelPage;
