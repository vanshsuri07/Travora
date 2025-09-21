import type { AxisModel } from "@syncfusion/ej2-react-charts";
import {formatDate} from "~/lib/utlis";

export const sidebarItems = [
  {
    id: 1,
    icon: "/assets/icons/home.svg",
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    id: 3,
    icon: "/assets/icons/users.svg",
    label: "All Users",
    href: "/all-users",
  },
  {
    id: 4,
    icon: "/assets/icons/itinerary.svg",
    label: "AI Trips",
    href: "/trips",
  },
];

export const chartOneData: object[] = [
  {
    x: "Jan",
    y1: 0.5,
    y2: 1.5,
    y3: 0.7,
  },
  {
    x: "Feb",
    y1: 0.8,
    y2: 1.2,
    y3: 0.9,
  },
  {
    x: "Mar",
    y1: 1.2,
    y2: 1.8,
    y3: 1.5,
  },
  {
    x: "Apr",
    y1: 1.5,
    y2: 2.0,
    y3: 1.8,
  },
  {
    x: "May",
    y1: 1.8,
    y2: 2.5,
    y3: 2.0,
  },
  {
    x: "Jun",
    y1: 2.0,
    y2: 2.8,
    y3: 2.5,
  },
];

export const travelStyles = [
  "Relaxed",
  "Luxury",
  "Adventure",
  "Cultural",
  "Nature & Outdoors",
  "City Exploration",
];

export const interests = [
  "Food & Culinary",
  "Historical Sites",
  "Hiking & Nature Walks",
  "Beaches & Water Activities",
  "Museums & Art",
  "Nightlife & Bars",
  "Photography Spots",
  "Shopping",
  "Local Experiences",
];

export const budgetOptions = ["Budget", "Mid-range", "Luxury", "Premium"];

export const groupTypes = ["Solo", "Couple", "Family", "Friends", "Business"];

export const footers = ["Terms & Condition", "Privacy Policy"];

export const selectItems = [
  "groupType",
  "travelStyle",
  "interest",
  "budget",
] as (keyof TripFormData)[];

export const comboBoxItems = {
  groupType: groupTypes,
  travelStyle: travelStyles,
  interest: interests,
  budget: budgetOptions,
} as Record<keyof TripFormData, string[]>;

export const userXAxis: AxisModel = { valueType: "Category", title: "Day" };
export const useryAxis: AxisModel = {
  minimum: 0,
  maximum: 10,
  interval: 2,
  title: "Count",
};

export const tripXAxis: AxisModel = {
  valueType: "Category",
  title: "Travel Styles",
  majorGridLines: { width: 0 },
};

export const tripyAxis: AxisModel = {
  minimum: 0,
  maximum: 10,
  interval: 2,
  title: "Count",
};

export const CONFETTI_SETTINGS = {
  particleCount: 200, // Number of confetti pieces
  spread: 60, // Spread of the confetti burst
  colors: ["#ff0", "#ff7f00", "#ff0044", "#4c94f4", "#f4f4f4"], // Confetti colors
  decay: 0.95, // Gravity decay of the confetti
};

export const LEFT_CONFETTI = {
  ...CONFETTI_SETTINGS,
  angle: 45, // Direction of the confetti burst (90 degrees is top)
  origin: { x: 0, y: 1 }, // Center of the screen
};

export const RIGHT_CONFETTI = {
  ...CONFETTI_SETTINGS,
  angle: 135,
  origin: { x: 1, y: 1 },
};

export const user = { name: 'Adrian'};
export const dashboardStats = {
  totalUsers: 12450,
  usersJoined: { currentMonth: 218, lastMonth: 176 },
  totalTrips: 3210,
  tripsCreated: { currentMonth: 150, lastMonth: 250},
  userRole: { total: 62, currentMonth: 25, lastMonth: 15},
}
export const allTrips = [
  {
    id: "681d07b400326b612839",
    name: "Belarusian Bar Crawl & Adventure: A Premium Friends Getaway",
    imageUrls: ["/assets/images/card-img1.jpeg"],
    itinerary: [{ location: "Minsk" }],
    tags: ["Nightlife", "Adventure"],
    travelStyle: "Friends",
    estimatedPrice: "$2,500",
  },
  {
    id: '68ced9cc00355ec3743b',
    name: "UAE Luxury Business & Leisure: Desert Nights & City Lights",
    imageUrls: ["/assets/images/card-img2.jpeg"],
    itinerary: [{ location: "Abu Dhabi" }],
    tags: ["Nightlife", "Nature"],
    travelStyle: "Family",
    estimatedPrice: "$8,000",
  },
  {
    id: "68ceb70d0033ed07901b",
    name: "Luxurious Nile Adventure & Shopping Spree for the Family",
    imageUrls: ["/assets/images/card-img3.jpeg"],
    itinerary: [{ location: "Aswan" }],
    tags: ["Shopping", "Luxury"],
    travelStyle: "Couple",
    estimatedPrice: "$2,500",
  },
  {
    id: "681d0f69002ec43a19e4",
    name: "Athens Historical Family Adventure",
    imageUrls: ["/assets/images/card-img5.jpeg"],
    itinerary: [{ location: "Athens" }],
    tags: ["Historical", "Culture"],
    travelStyle: "Family",
    estimatedPrice: "$900",
  },
 
  
  {
    id: "68c971db003db70bee7a",
    name: "Hong Kong Nights: A Luxurious Couple's Escape",
    imageUrls: ["/assets/images/img-card7.jpeg"],
    itinerary: [{ location: "Dubai" }],
    tags: ["Luxury", "Nightlife"],
    travelStyle: "Couple",
    estimatedPrice: "$12,000",
  },
  
  {
    id: "68cd299a001183a2ee89",
    name: "Åland Islands Family Photography Adventure",
    imageUrls: ["/assets/images/card-img9.jpeg"],
    itinerary: [{ location: "Eckero" }],
    tags: ["City", "Photography"],
    travelStyle: "Family",
    estimatedPrice: "$2,500",
  },
  {
    id: "68cd587e0026516cc36f",
    name: "American Samoa: Volcanic Peaks & Turquoise Waters",
    imageUrls: ["/assets/images/card-img10.jpeg"],
    itinerary: [{ location: "Tutuila" }],
    tags: ["Adventure", "Photography"],
    travelStyle: "Friends",
    estimatedPrice: "$2,500",
  },
];

export const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    imageUrl: "/assets/images/david.webp",
    dateJoined: formatDate("2025-01-01"),
    itineraryCreated: 10,
    status: "user",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    imageUrl: "/assets/images/david.webp",
    dateJoined: formatDate("2025-01-02"),
    itineraryCreated: 4,
    status: "user",
  },
  {
    id: 3,
    name: "John Smith",
    email: "john.smith@example.com",
    imageUrl: "/assets/images/david.webp",
    dateJoined: formatDate("2025-01-03"),
    itineraryCreated: 8,
    status: "admin",
  },
];