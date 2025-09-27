import { Link, useLocation } from "react-router";
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


const Chip = ({ text, className }: { text: string; className?: string }) => (
  <span className={cn(
    "inline-block px-3 py-1 text-xs font-medium rounded-md",
    className
  )}>
    {text}
  </span>
);

const TripCard = ({
  id,
  name,
  location,
  imageUrl,
  tags,
  price,
  isWishlisted,
  onToggleWishlist,
  clickable = true,
}: TripCardProps) => {
  const path = useLocation();

  // Define chip colors for different indices
  const getChipStyle = (index: number) => {
    switch (index) {
      case 0:
        return "bg-teal-100 text-teal-600";
      case 1:
        return "bg-pink-100 text-pink-600";
      case 2:
        return "bg-indigo-100 text-indigo-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

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

      {/* Tags - Custom implementation */}
      <div className="p-4 flex-grow">
        <div className="flex flex-wrap gap-2">
          {tags?.slice(0, 3).map((tag, index) => (
            <Chip
              key={index}
              text={getFirstWord(tag)}
              className={getChipStyle(index)}
            />
          ))}
        </div>
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
            className="px-5 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
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