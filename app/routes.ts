import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";
export default [
  // ----------------------------
  // AUTH ROUTES
  // ----------------------------
  route("sign-in", "routes/root/sign-in.tsx"),
  route("auth/callback", "routes/root/auth-callback.tsx"), // ✅ Add this line

  route("api/create-trip", "routes/api/create-trip.ts"),
  route("api/checkout", "routes/api/checkout.ts"),

  // ----------------------------
  // PAYMENT ROUTES
  // ----------------------------
  route("payment/success", "routes/payment/success/page.tsx"),
  route("payment/cancel", "routes/payment/cancel/page.tsx"),

  // ----------------------------
  // ADMIN ROUTES
  // ----------------------------
  layout("routes/admin/admin-layout.tsx", [
    route("dashboard", "routes/admin/dashboard.tsx"),
    route("all-users", "routes/admin/all-users.tsx"),
    route("trips", "routes/admin/trips.tsx"),
    route("trips/create", "routes/admin/create-trip.tsx"),
    route("trips/:tripId", "routes/admin/trip-detail.tsx"),
  ]),

  // ----------------------------
  // PUBLIC WEBSITE (Landing + Users)
  // ----------------------------
  layout("routes/root/page-layout.tsx"
    , [
    route("aboutus", "routes/root/aboutus.tsx"),
    index("routes/root/page.tsx"),

    route("user", "routes/users/user-layout.tsx"),
      route("user/trip", "routes/users/create-trip.tsx"),
    route("user/my-trip", "routes/users/my-trip.tsx"),  // <- Outside user layout
      route("user/trip/:tripId", "routes/users/trip-detail.tsx"),
    ]),
] satisfies RouteConfig;
