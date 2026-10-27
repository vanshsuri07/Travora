export interface Trip {
  $id: string;
  id: string;
  name: string;
  description: string;
  estimatedPrice: string;
  duration: number;
  budget: string;
  travelStyle: string;
  interests: string[];
  groupType: string;
  country: string;
  imageUrls: string[];
  itinerary: DayPlan[];        // DayPlan and Location can stay global
  bestTimeToVisit: string[];
  weatherInfo: string[];
  location: Location;
  payment_link: string;
}

export type TripCardData = Pick<Trip, "$id" | "id" | "name" | "imageUrls"> &
  Partial<Pick<Trip, "interests" | "travelStyle">> & {
    itinerary?: Array<{ location: string }>;
    estimatedPrice?: string | number;
  };