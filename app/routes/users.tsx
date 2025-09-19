import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "react-router";
import { getUser } from "~/appwrite/auth";
import { getAllTrips, getTripsByUserId } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utlis";
import UserLayout from "./users/user-layout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await getUser();
    if (!user) {
        return json({ transformedTrips: [] });
    }

    let trips;
    if (user.labels.includes('admin')) {
        trips = await getAllTrips(100, 0); // Fetch all trips for admin
    } else {
        trips = await getTripsByUserId(user.accountId);
    }

    const transformedTrips = trips.allTrips.map(({ $id, tripDetails, imageUrls }) => ({
        $id,
        id: $id,
        ...parseTripData(tripDetails),
        imageUrls: imageUrls ?? [],
    }));

    return json({ transformedTrips });
};

export default function UsersRoute() {
    const { transformedTrips } = useLoaderData<typeof loader>();

    return (
        <UserLayout trips={transformedTrips}>
            <Outlet />
        </UserLayout>
    );
}
