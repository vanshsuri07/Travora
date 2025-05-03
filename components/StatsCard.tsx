import { calculateTrendPercentage } from "~/lib/utlis"

const StatsCard = ({
    headerTitle,
    total,
    lastMonthCount,
    currentMonthCount }: StatsCard) => {
    const {trend, percentage } = calculateTrendPercentage 
    (currentMonthCount, lastMonthCount);
    
    const isDecrement = trend === "decrement";
    
 
  return (
    <article className="stats-card">
    <h3 className="text-base font-medium">
        {headerTitle}
    </h3>
      
    </article>
  )
}
export default StatsCard