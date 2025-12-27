import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { useState } from "react";

const RatingComponent = () => {
  const [ratingValue, setRatingValue] = useState(4);

  return (
    <div className="flex items-center gap-3">
      <Rating
        className="!text-amber-400 !text-[32px]"
        name="half-rating"
        value={ratingValue}
        icon={<StarIcon fontSize="inherit" />}
        emptyIcon={<StarIcon fontSize="inherit" />}
        onChange={(_, newValue) => {
          if (newValue !== null) setRatingValue(newValue);
        }}
      />
      <span className="text-lg font-medium">{ratingValue}/5</span>
    </div>
  );
};

export default RatingComponent;
