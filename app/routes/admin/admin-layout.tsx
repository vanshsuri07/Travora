import { Outlet } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { MobileSlidebar, NavItems } from "../../../components";
import { account } from "~/appwrite/client";
import { redirect } from "react-router";
import { getExistingUser, storeUserData } from "~/appwrite/auth";

export async function clientLoader() {
  try {
    console.log('Checking admin authentication...');
    
    // Get current user from Appwrite
    const user = await account.get();
    
    if (!user.$id) {
      console.log('No user found, redirecting to sign-in');
      return redirect('/sign-in');
    }
    
    // Get existing user data
    const existingUser = await getExistingUser(user.$id);
    
    // Check if user has admin status
    if (existingUser?.status !== 'admin') {
      console.log('User is not admin, redirecting to user area');
      
      // If user exists but is not admin, redirect to user area
      if (existingUser?.status === 'user') {
        return redirect('/user');
      }
      
      // If status is neither admin nor user, redirect to home
      return redirect('/user');
    }
    
    console.log('Admin user authenticated:', existingUser);
    
    // Return existing user or create/store new user data
    return existingUser?.$id ? existingUser : await storeUserData();
    
  } catch (error) {
    console.error('Error in admin clientLoader:', error);
    
    // Handle specific error types
  if (error instanceof Error && (error as any).code === 401) {
  console.log('User session expired, redirecting to sign-in', error);
  return redirect('/sign-in');
}
    
    // For other errors, redirect to sign-in
    return redirect('/sign-in');
  }
}

export default function AdminLayout() {
  return (
    <div className="admin-layout-container">
      {/* Mobile Sidebar */}
      <MobileSlidebar />

      <div className="admin-layout flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="w-full max-w-[270px] hidden lg:block bg-white shadow-lg">
          <SidebarComponent 
            width={270} 
            enableGestures={false}
            className="h-full"
          >
            <NavItems />
          </SidebarComponent>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-50">
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}