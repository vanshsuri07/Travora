import { Link, redirect, useLocation } from "react-router"; // Corrected import for react-router v6+
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";
import { cn, getFirstWord } from "~/lib/utlis";

// Define TripCardProps if it's not already globally available
interface TripCardProps {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  tags: string[];
  price: string;
}

const TripCard = ({
  id,
  name,
  location,
  imageUrl,
  tags,
  price,
}: TripCardProps) => {
  const path = useLocation();

  // const handleBookNow = (e: React.MouseEvent) => {
  //   e.preventDefault(); // Stop Link navigation
  //   e.stopPropagation(); // Prevent bubbling
  //   console.log("Booking trip:", id);

  //   // TODO: replace with Stripe checkout call
  //   // Redirect to checkout page
  // };

  return (
    <div
  
      className="trip-card group overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col"
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
        <article className="absolute bottom-0 left-0 p-4 w-full">
          <h2 className="text-white text-lg font-bold truncate">{name}</h2>
          <figure className="flex items-center mt-1">
            <img
              src="/assets/icons/location-mark.svg"
              alt="location"
              className="size-4 filter invert brightness-0" // Inverted for visibility on dark gradient
            />
            <figcaption className="text-gray-200 text-sm ml-1.5 truncate">
              {location}
            </figcaption>
          </figure>
        </article>
      </div>

      <div className="p-4 flex-grow">
        <ChipListComponent id={`travel-chip-${id}`}>
          <ChipsDirective>
            {tags?.slice(0, 3).map((tag, index) => ( // Show max 3 tags
              <ChipDirective
                key={index}
                text={getFirstWord(tag)}
                cssClass={cn(
                  "!text-xs !font-medium !rounded-md",
                  index === 1
                    ? "!bg-pink-100 !text-pink-600"
                    : index === 2
                    ? "!bg-indigo-100 !text-indigo-600"
                    : "!bg-teal-100 !text-teal-600"
                )}
              />
            ))}
          </ChipsDirective>
        </ChipListComponent>
      </div>

       <article className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
    <div className="tripCard-pill">{price}</div>
     <Link
  to={path.pathname === "/" || path.pathname.startsWith("/travel")
    ? `/travel/${id}`
    : `/user/trip/${id}`}
    
      className="px-5 py-2 rounded-full bg-black text-white ..."
    >
      Book Now
    </Link>
  </article>
</div>
   
  );
};

export default TripCard;