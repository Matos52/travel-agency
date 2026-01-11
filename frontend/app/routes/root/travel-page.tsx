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
    return trips.map(
      ({
        id,
        tripDetail,
        imageUrls,
        createdBy,
        userImageUrl,
        averageRating,
        ratingsCount,
      }) => ({
        id,
        ...(tripDetail ? parseTripData(tripDetail) : {}),
        imageUrls,
        createdBy,
        userImageUrl,
        averageRating,
        ratingsCount,
      })
    );
  }, [trips]);

  console.log(allTrips);

  const featuredTrips = allTrips.slice(0, 7);

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
            {featuredTrips[0] && (
              <FeaturedDestination
                id={featuredTrips[0].id}
                bgImage={featuredTrips[0].imageUrls?.[0] ?? ""}
                containerClass="h-1/3 lg:h-1/2"
                bigCard
                title={featuredTrips[0].name ?? ""}
                rating={featuredTrips[0].averageRating ?? "?"}
                activityCount={featuredTrips[0].ratingsCount ?? 0}
                userImageUrl={featuredTrips[0].userImageUrl}
                createdBy={featuredTrips[0].createdBy}
              />
            )}
            <div className="travel-featured">
              {featuredTrips.slice(1, 3).map((item) => (
                <FeaturedDestination
                  id={item.id}
                  key={item.id}
                  bgImage={item.imageUrls?.[0] ?? ""}
                  bigCard
                  title={item.name ?? ""}
                  rating={item.averageRating ?? "?"}
                  activityCount={item.ratingsCount ?? 0}
                  userImageUrl={item.userImageUrl}
                  createdBy={item.createdBy}
                />
              ))}
            </div>
          </article>
          <div className="flex flex-col gap-[30px]">
            {featuredTrips.slice(3, 7).map((item) => (
              <FeaturedDestination
                id={item.id}
                key={item.id}
                containerClass="w-full h-[240px]"
                bgImage={item.imageUrls?.[0] ?? ""}
                title={item.name ?? ""}
                rating={item.averageRating ?? "?"}
                activityCount={item.ratingsCount ?? 0}
                userImageUrl={item.userImageUrl}
                createdBy={item.createdBy}
              />
            ))}
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
