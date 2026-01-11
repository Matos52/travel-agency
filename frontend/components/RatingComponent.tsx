import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { useTrip } from "~/context/TripContext";
import { useParams } from "react-router";

const RatingComponent = () => {
  const { trip, rateTrip } = useTrip();
  const { tripId } = useParams();

  return (
    <div className="flex items-center gap-3">
      <Rating
        className="!text-amber-400 !text-[32px]"
        name="half-rating"
        value={trip.myRating ?? 0}
        icon={<StarIcon fontSize="inherit" />}
        emptyIcon={<StarIcon fontSize="inherit" />}
        onChange={(_, newValue) => {
          if (newValue !== null) {
            rateTrip(newValue, Number(tripId));
          }
        }}
      />
      <span className="text-lg font-medium">{trip.myRating ?? 0}/5</span>
    </div>
  );
};

export default RatingComponent;
