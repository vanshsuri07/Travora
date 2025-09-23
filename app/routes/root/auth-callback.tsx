import { useEffect } from "react";
import { useNavigate } from "react-router";
import { account, database, appwriteConfig } from "~/appwrite/client";
import { Query } from "appwrite";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        console.log("Handling OAuth callback...");
        
        // Get the logged in user
        const user = await account.get();
        if (!user) {
          console.error("No authenticated user found");
          navigate("/sign-in?error=no_user");
          return;
        }

        console.log("Authenticated user:", user.name);

        // Fetch user data from database using the same method as your auth service
        const { documents } = await database.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          [Query.equal("accountId", user.$id)]
        );

        let userDoc;
        if (documents.length === 0) {
          console.log("User data not found in database, creating...");
          // If user data doesn't exist, create it using your storeUserData function
          const { storeUserData } = await import("~/appwrite/auth"); // Update this path
          userDoc = await storeUserData();
          
          if (!userDoc) {
            console.error("Failed to create user data");
            navigate("/sign-in?error=user_creation_failed");
            return;
          }
        } else {
          userDoc = documents[0];
        }

        // Check role (from userDoc or user prefs)
        const role = userDoc.role || user.prefs?.role || "user";
        console.log(`User role detected: ${role}`);

        // Redirect based on role
        if (role === "admin") {
          console.log("Redirecting to admin dashboard...");
          navigate("/dashboard");
        } else {
          console.log("Redirecting to user area...");
          navigate("/user");
        }
        
      } catch (err) {
        console.error("Auth callback failed:", err);
        navigate("/sign-in?error=auth_failed");
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-8 flex flex-col items-center gap-4 w-[90%] max-w-sm border border-indigo-100">
        {/* Spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        
        {/* Text */}
        <h2 className="text-lg font-semibold text-gray-800">Signing you in...</h2>
        <p className="text-sm text-gray-500 text-center">
          Please wait a moment while we complete your login.
        </p>
      </div>
    </div>
  );
}