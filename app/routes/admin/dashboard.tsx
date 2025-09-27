import Header from "../../../components/Header";
import StatsCard from "../../../components/StatsCard";
import TripCard from "../../../components/TripCard";
import {getAllUsers, getUser} from "~/appwrite/auth";
import type { Route } from './+types/dashboard';
import {getTripsByTravelStyle, getUserGrowthPerDay, getUsersAndTripsStats} from "~/appwrite/dashboard";
import {getAllTrips} from "~/appwrite/trips";
import {parseTripData} from "~/lib/utlis";
import { Link } from "react-router";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart } from 'recharts';

export const clientLoader = async () => {
    const [
        user,
        dashboardStats,
        trips,
        userGrowth,
        tripsByTravelStyle,
        allUsers,
    ] = await Promise.all([
        await getUser(),
        await getUsersAndTripsStats(),
        await getAllTrips(4, 0),
        await getUserGrowthPerDay(),
        await getTripsByTravelStyle(),
        await getAllUsers(4, 0),
    ])

    const allTrips = trips.allTrips.map(({ $id, tripDetails, imageUrls }) => ({
        id: $id,
        ...parseTripData(tripDetails),
        imageUrls: imageUrls ?? []
    }))

    const mappedUsers: UsersItineraryCount[] = allUsers.users.map((user) => ({
        imageUrl: user.imageUrl,
        name: user.name,
        count: user.itineraryCount ?? Math.floor(Math.random() * 10),
    }))

    return {
        user,
        dashboardStats,
        allTrips,
        userGrowth,
        tripsByTravelStyle,
        allUsers: mappedUsers
    }
}

// Custom Table Component (replacing GridComponent)
interface CustomTableProps {
  title: string;
  dataSource: any[];
  field: string;
  headerText: string;
}

const CustomTable = ({ title, dataSource, field, headerText }: CustomTableProps) => (
  <div className="flex flex-col gap-5">
    <h3 className="p-20-semibold text-dark-100">{title}</h3>
    
    <div className="w-full overflow-hidden rounded-lg bg-white shadow-sm border">
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="grid grid-cols-2 gap-4 px-6 py-4">
          <div className="font-medium text-gray-700 text-sm">Name</div>
          <div className="font-medium text-gray-700 text-sm">{headerText}</div>
        </div>
      </div>
      
      {/* Body */}
      <div className="divide-y divide-gray-100">
        {dataSource.map((item, index) => (
          <div key={index} className="grid grid-cols-2 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-1.5">
              <img 
                src={item.imageUrl} 
                alt="user" 
                className="rounded-full size-8 aspect-square object-cover" 
                referrerPolicy="no-referrer"
              />
              <span className="text-sm text-gray-900">{item.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700">{item[field]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Custom Chart Components using Recharts
const UserGrowthChart = ({ data }: { data: any[] }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">User Growth</h3>
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="day" 
          tick={{ fontSize: 12 }}
          stroke="#666"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#666"
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
        />
        <Bar 
          dataKey="count" 
          fill="#4784EE" 
          radius={[10, 10, 0, 0]}
          maxBarSize={40}
        />
        <Area 
          type="monotone" 
          dataKey="count" 
          fill="rgba(71, 132, 238, 0.3)" 
          stroke="#4784EE"
          strokeWidth={2}
        />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
);

const TripTrendsChart = ({ data }: { data: any[] }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">Trip Trends</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="travelStyle" 
          tick={{ fontSize: 12 }}
          stroke="#666"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#666"
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
        />
        <Bar 
          dataKey="count" 
          fill="#4784EE" 
          radius={[10, 10, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const Dashboard = ({ loaderData }: Route.ComponentProps) => {
    const user = loaderData.user as User | null;
    const { dashboardStats, allTrips, userGrowth, tripsByTravelStyle, allUsers } = loaderData;

    const trips = allTrips.map((trip) => ({
        imageUrl: trip.imageUrls[0],
        name: trip.name,
        interest: trip.interests,
    }))

    const usersAndTrips = [
        {
            title: 'Latest user signups',
            dataSource: allUsers,
            field: 'count',
            headerText: 'Trips created'
        },
        {
            title: 'Trips based on interests',
            dataSource: trips,
            field: 'interest',
            headerText: 'Interests'
        }
    ]

    return (
        <main className="dashboard wrapper">
            <Header
                title={`Welcome ${user?.name ?? 'Guest'} 👋`}
                description="Track activity, trends and popular destinations in real time"
            />
           <div className="absolute top-8 right-8">
              <Link
                to="/user"
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow-md transition-colors"
              >
                Switch to user
              </Link>
            </div>

            <section className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <StatsCard
                        headerTitle="Total Users"
                        total={dashboardStats.totalUsers}
                        currentMonthCount={dashboardStats.usersJoined.currentMonth}
                        lastMonthCount={dashboardStats.usersJoined.lastMonth}
                    />
                    <StatsCard
                        headerTitle="Total Trips"
                        total={dashboardStats.totalTrips}
                        currentMonthCount={dashboardStats.tripsCreated.currentMonth}
                        lastMonthCount={dashboardStats.tripsCreated.lastMonth}
                    />
                    <StatsCard
                        headerTitle="Active Users"
                        total={dashboardStats.userRole.total}
                        currentMonthCount={dashboardStats.userRole.currentMonth}
                        lastMonthCount={dashboardStats.userRole.lastMonth}
                    />
                </div>
            </section>

            <section className="container">
                <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>

                <div className='trip-grid'>
                    {allTrips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            id={trip.id.toString()}
                            name={trip.name!}
                            imageUrl={trip.imageUrls[0]}
                            location={trip.itinerary?.[0]?.location ?? ''}
                            tags={trip.travelStyle ? [trip.travelStyle] : []}
                            price={trip.estimatedPrice!}
                            isWishlisted={false}
                            onToggleWishlist={() => {}}
                        />
                    ))}
                </div>
            </section>

            {/* Charts Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <UserGrowthChart data={userGrowth} />
                <TripTrendsChart data={tripsByTravelStyle} />
            </section>

            {/* Tables Section */}
            <section className="user-trip wrapper">
                {usersAndTrips.map((config, i) => (
                    <CustomTable
                        key={i}
                        title={config.title}
                        dataSource={config.dataSource}
                        field={config.field}
                        headerText={config.headerText}
                    />
                ))}
            </section>
        </main>
    )
}

export default Dashboard