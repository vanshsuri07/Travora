import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { account, database, appwriteConfig } from "~/appwrite/client";
import { Query } from "appwrite";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Check if we have OAuth parameters in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const secret = urlParams.get('secret');
        
        console.log("OAuth params:", { userId, secret: secret ? "present" : "missing" });

        // If we have userId and secret, create the session
        if (userId && secret) {
          setStatus("Creating session...");
          await account.createSession(userId, secret);
          console.log("Session created from OAuth params");
          
          // Wait for session to settle
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          // If no params, wait for automatic session creation
          setStatus("Waiting for authentication...");
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // Try to get the authenticated user with retries
        setStatus("Verifying user...");
        let user = null;
        let attempts = 0;
        const maxAttempts = 5;
        
        while (!user && attempts < maxAttempts) {
          attempts++;
          try {
            user = await account.get();
            console.log("✅ User authenticated:", user.name);
          } catch (e: any) {
            console.log(`Attempt ${attempts}/${maxAttempts}: ${e.message}`);
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
              throw new Error("Session creation failed. Please check browser cookies are enabled.");
            }
          }
        }
        
        if (!user) {
          throw new Error("Failed to authenticate user");
        }

        // Fetch user data from database
        setStatus("Loading user data...");
        const { documents } = await database.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          [Query.equal("accountId", user.$id)]
        );

        let userDoc;
        if (documents.length === 0) {
          console.log("Creating user profile...");
          const { storeUserData } = await import("~/appwrite/auth");
          userDoc = await storeUserData();
          
          if (!userDoc) {
            console.error("Failed to create user data");
            navigate("/sign-in?error=user_creation_failed");
            return;
          }
        } else {
          userDoc = documents[0];
        }

        // Check role
        const role = userDoc.role || user.prefs?.role || "user";
        console.log(`Redirecting to ${role} dashboard...`);

        // Redirect based on role
        if (role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/user");
        }
        
      } catch (err: any) {
        console.error("❌ Auth callback failed:", err);
        navigate(`/sign-in?error=${encodeURIComponent(err.message || 'auth_failed')}`);
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-8 flex flex-col items-center gap-4 w-[90%] max-w-sm border border-indigo-100">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        
        <h2 className="text-lg font-semibold text-gray-800">{status}</h2>
        <p className="text-sm text-gray-500 text-center">
          Please wait while we complete your login.
        </p>
      </div>
    </div>
  );
}