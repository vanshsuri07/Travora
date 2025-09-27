import { Link, useLocation } from "react-router";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { cn, getFirstWord } from "~/lib/utlis";

interface TripCardProps {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  tags: string[];
  price: string;
  isWishlisted: boolean;
  onToggleWishlist: (tripId: string) => void;
  clickable?: boolean;
}

const TripCard = ({
  id,
  name,
  location,
  imageUrl,
  tags,
  price,
  isWishlisted,
  onToggleWishlist,
  clickable = true, // default true
}: TripCardProps) => {
  const path = useLocation();

  return (
    <div
      className={cn(
        "trip-card group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 ease-in-out transform flex flex-col",
        clickable ? "hover:shadow-2xl hover:-translate-y-1 cursor-pointer" : "cursor-default"
      )}
    >
      {/* Image + Wishlist */}
      <div className="relative">
        <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
        <button
          onClick={() => onToggleWishlist(id)}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 text-red-500 hover:text-red-600 shadow-md transition-all"
        >
          {isWishlisted ? <FaHeart className="w-5 h-5" /> : <FaRegHeart className="w-5 h-5" />}
        </button>

        <article className="absolute bottom-0 left-0 p-4 w-full">
          <h2 className="text-white text-lg font-bold truncate">{name}</h2>
          <figure className="flex items-center mt-1">
            <img
              src="/assets/icons/location-mark.svg"
              alt="location"
              className="size-4 filter invert brightness-0"
            />
            <figcaption className="text-gray-200 text-sm ml-1.5 truncate">
              {location}
            </figcaption>
          </figure>
        </article>
      </div>

      {/* Tags */}
      <div className="p-4 flex-grow">
        <ChipListComponent id={`travel-chip-${id}`}>
          <ChipsDirective>
            {tags?.slice(0, 3).map((tag, index) => (
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

      {/* Price + Book Now */}
      <article className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
        <div className="tripCard-pill">{price}</div>

        {clickable ? (
          <Link
            to={
              path.pathname === "/" || path.pathname.startsWith("/travel")
                ? `/travel/${id}`
                : `/user/trip/${id}`
            }
            className="px-5 py-2 rounded-full bg-black text-white"
          >
            Book Now
          </Link>
        ) : (
          <button
            disabled
            className="px-5 py-2 rounded-full bg-gray-300 text-gray-600 cursor-not-allowed"
          >
            Book Now
          </button>
        )}
      </article>
    </div>
  );
};

export default TripCard;
