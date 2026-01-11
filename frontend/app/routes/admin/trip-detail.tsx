import {
  ChipsDirective,
  ChipDirective,
  ChipListComponent,
} from "@syncfusion/ej2-react-buttons";
import StarIcon from "@mui/icons-material/Star";
import { Header, InfoPill, RatingComponent, TripCard } from "components";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { useTrip } from "~/context/TripContext";
import { cn, getFirstWord, parseTripData } from "~/lib/utils";

const TripDetail = () => {
  const { tripId } = useParams();
  const { fetchTrip, fetchTrips, trip, trips } = useTrip();
  const imageUrls = trip.imageUrls;

  const tripData = useMemo(() => {
    if (!trip.tripDetail) {
      return null;
    }

    return parseTripData(trip.tripDetail);
  }, [trip]);

  const allTrips = useMemo(() => {
    return trips.map(({ id, tripDetail, imageUrls }) => ({
      id,
      ...(tripDetail ? parseTripData(tripDetail) : {}),
      imageUrls: imageUrls,
    }));
  }, [trips]);

  const {
    name,
    duration,
    itinerary,
    travelStyle,
    groupType,
    budget,
    interests,
    estimatedPrice,
    description,
    bestTimeToVisit,
    weatherInfo,
    country,
  } = tripData || {};

  const displayRating =
    typeof trip.averageRating === "number"
      ? trip.averageRating.toFixed(1)
      : "?";

  const pillsItems = [
    { text: travelStyle, bg: "!bg-pink-50 !text-pink-500" },
    { text: groupType, bg: "!bg-primary-50 !text-primary-500" },
    { text: budget, bg: "!bg-success-50 !text-success-700" },
    { text: interests, bg: "!bg-navy-50 !text-navy-500" },
  ];

  const visitTimeAndWeatherInfo = [
    { title: "Best Time to Visit:", items: bestTimeToVisit },
    { title: "Weather:", items: weatherInfo },
  ];

  useEffect(() => {
    fetchTrip(Number(tripId));
  }, [tripId]);

  useEffect(() => {
    fetchTrips(0, 4);
  }, []);

  return (
    <main className="travel-detail wrapper">
      <Header
        title="Trip Details"
        description="View and edit AI-generated travel plans"
      />

      <section className="container wrapper-md">
        <header>
          <div className="flex justify-between">
            <h1 className="p-40-semibold text-dark-100">{name}</h1>
            <div className="flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-0.5">
              <span className="text-2xl font-semibold text-amber-700">
                {displayRating}
              </span>
              <StarIcon className="!h-6 !w-6 text-amber-400" />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <InfoPill
              text={`${duration} day plan`}
              image="/assets/icons/calendar.svg"
            />

            <InfoPill
              text={
                itinerary
                  ?.slice(0, 3)
                  .map((item) => item.location)
                  .join(", ") || ""
              }
              image="/assets/icons/location-mark.svg"
            />
          </div>
        </header>

        <section className="gallery">
          {imageUrls.map((url: string, i: number) => (
            <img
              src={url}
              alt="picture"
              key={i}
              className={cn(
                "w-full rounded-xl object-cover",
                i === 0
                  ? "md:col-span-2 md:row-span-2 h-[330px]"
                  : "md:row-span-1 h-[150px]"
              )}
            />
          ))}
        </section>

        <section className="flex gap-3 md:gap-5 items-center justify-between flex-wrap">
          <ChipListComponent id="travel-chip" cssClass="!p-0 !m-0 !pl-0 !ml-0">
            <ChipsDirective>
              {pillsItems
                .filter((p) => p.text)
                .map((pill, i) => (
                  <ChipDirective
                    key={i}
                    text={getFirstWord(pill.text)}
                    cssClass={`${pill.bg} !text-base !font-medium !px-4`}
                  />
                ))}
            </ChipsDirective>
          </ChipListComponent>
          <RatingComponent />
        </section>

        <div className="flex items-center gap-5">
          <p className="text-gray-600 text-xs md:text-sm font-normal">
            Created by
          </p>
          <div className="flex items-center gap-2">
            <img
              className="size-10 rounded-full aspect-square"
              src={trip.userImageUrl}
              alt={trip.createdBy}
            />
            <p className="text-xs md:text-sm font-normal text-dark-400">
              {trip.createdBy}
            </p>
          </div>
        </div>

        <section className="title">
          <article>
            <h3>
              {duration}-Day {country} {travelStyle} Trip
            </h3>
            <p>
              {budget}, {groupType} and {interests}
            </p>
          </article>

          <h2>{estimatedPrice}</h2>
        </section>

        <p className="text-sm md:text-lg font-normal text-dark-400">
          {description}
        </p>

        <ul className="itinerary">
          {itinerary?.map((dayPlan: DayPlan, index: number) => (
            <li key={index}>
              <h3>
                Day {dayPlan.day}: {dayPlan.location}
              </h3>

              <ul>
                {dayPlan.activities.map((activity: Activity, index: number) => (
                  <li key={index}>
                    <span className="flex-shrink-0 p-18-semibold">
                      {activity.time}
                    </span>
                    <p className="flex-grow">{activity.description}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {visitTimeAndWeatherInfo.map((section) => (
          <section key={section.title} className="visit">
            <div>
              <h3>{section.title}</h3>

              <ul>
                {section.items?.map((item) => (
                  <li key={item}>
                    <p className="flex-grow">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="p-24-semibold text-dark-100">Popular Trips</h2>
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
    </main>
  );
};

export default TripDetail;
