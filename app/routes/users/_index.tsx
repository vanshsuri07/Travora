export default function UsersIndex() {
  // This component will be rendered inside the UserLayout's <Outlet />
  // when the user navigates to "/users"
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Your Dashboard</h2>
      <p>Welcome to your dashboard. Your upcoming trips are shown above.</p>
    </div>
  );
}
