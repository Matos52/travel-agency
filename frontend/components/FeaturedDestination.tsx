import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";

const FeaturedDestination = ({
  id,
  containerClass = "",
  bigCard = false,
  rating,
  title,
  activityCount,
  bgImage,
  userImageUrl,
  createdBy
}: DestinationProps) => {
  const path = useLocation();

  return (
    <Link
      className={cn(
        "rounded-[14px] overflow-hidden bg-cover bg-center size-full min-w-[280px]",
        containerClass
      )}
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
      to={
        path.pathname === "/" || path.pathname.startsWith("/travel")
          ? `/travel/${id}`
          : `/trips/${id}`
      }
    >
      <div className="bg-linear200 h-full">
        <article className="featured-card">
          <div
            className={cn(
              "bg-white rounded-20 font-bold text-red-100 w-fit py-px px-3 text-sm"
            )}
          >
            {rating}
          </div>

          <article className="flex flex-col gap-3.5">
            <h2
              className={cn("text-lg font-semibold text-white", {
                "p-30-bold": bigCard,
              })}
            >
              {title}
            </h2>
            <figure className="flex gap-2 items-center">
              <img
                src={userImageUrl}
                alt={createdBy}
                className={cn("size-4 rounded-full aspect-square", {
                  "size-11": bigCard,
                })}
              />
              <p
                className={cn("text-sm font-normal text-white", {
                  "text-lg": bigCard,
                })}
              >
                {activityCount}
              </p>
            </figure>
          </article>
        </article>
      </div>
    </Link>
  );
};

export default FeaturedDestination;
