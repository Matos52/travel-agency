import { calculateTrendPercentage } from "lib/utils";

const StatsCard = ({
  headerTitle,
  total,
  currentMonthCount,
  lastMonthCount,
}: StatsCard) => {
  const { trend, percentage } = calculateTrendPercentage(
    currentMonthCount,
    lastMonthCount
  );

  const isDecrement = trend === "decrement";

  return (
    <article className="stats-card">
      <h3 className="text-base font-medium">{headerTitle}</h3>
    </article>
  );
};

export default StatsCard;
