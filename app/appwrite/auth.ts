import { ID, OAuthProvider, Query } from "appwrite";
import { account, database, appwriteConfig } from "~/appwrite/client";
import { redirect } from "react-router";

export const getExistingUser = async (id: string) => {
    try {
        const { documents, total } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", id)]
        );
        return total > 0 ? documents[0] : null;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

export const storeUserData = async () => {
    try {
        const user = await account.get();
        if (!user) throw new Error("User not found");

        // Check if user already exists to avoid duplicates
        const existingUser = await getExistingUser(user.$id);
        if (existingUser) {
            console.log("User already exists in database");
            return existingUser;
        }

        const { providerAccessToken } = (await account.getSession("current")) || {};
        const profilePicture = providerAccessToken
            ? await getGooglePicture(providerAccessToken)
            : null;

        console.log("Creating new user in database...");
        const createdUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: user.$id,
                email: user.email,
                name: user.name,
                imageUrl: profilePicture,
                joinedAt: new Date().toISOString(),
                
            }
        );

        console.log("User created successfully:", createdUser.$id);
        return createdUser;
    } catch (error) {
        console.error("Error storing user data:", error);
        throw error; // Re-throw to handle in caller
    }
};

const getGooglePicture = async (accessToken: string) => {
    try {
        const response = await fetch(
            "https://people.googleapis.com/v1/people/me?personFields=photos",
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (!response.ok) throw new Error("Failed to fetch Google profile picture");

        const { photos } = await response.json();
        return photos?.[0]?.url || null;
    } catch (error) {
        console.error("Error fetching Google picture:", error);
        return null;
    }
};



export const loginWithGoogle = () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/auth/callback`,   // Success redirect
      `${window.location.origin}/sign-in?error=oauth_failed` // Failure redirect
    );
  } catch (error) {
    console.error("Error during OAuth2 session creation:", error);
  }
};


// NEW: OAuth callback handler
export const handleOAuthCallback = async () => {
  try {
    console.log("Handling OAuth callback...");

    // Get authenticated user
    const user = await account.get();
    if (!user) {
      console.error("No authenticated user found");
      return redirect("/sign-in");
    }

    console.log("Authenticated user:", user.name);

    // Store/get user data (make sure this includes `role`)
    const userData = await storeUserData();
    if (!userData) {
      console.error("Failed to create user data");
      return redirect("/sign-in");
    }

    // Check role (from userData or prefs)
    const role = userData.role || user.prefs?.role || "user";

    console.log(`User role detected: ${role}`);

    // Redirect based on role
    if (role === "admin") {
      console.log("Redirecting to admin dashboard...");
      return redirect("/dashboard");
    } else {
      console.log("Redirecting to user area...");
      return redirect("/user");
    }
  } catch (error) {
    console.error("OAuth callback error:", error);
    return redirect("/sign-in?error=callback_failed");
  }
};


export const logoutUser = async () => {
    try {
        console.log("Attempting to delete Appwrite session...");
        
        // Delete current session from Appwrite
        await account.deleteSession("current");
        
        console.log("Appwrite session deleted successfully");
        return { success: true };
        
    } catch (error) {
        console.error("Error during Appwrite logout:", error);
        
        // Check if it's a session not found error (user might already be logged out)
        if ((error as any)?.code === 401 || (error as any)?.type === 'user_unauthorized') {
            console.log("Session was already expired/invalid", error);
            return { success: true, message: "Session was already expired" };
        }
        
        // For other errors, still return so we can continue with local cleanup
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
};

export const getUser = async () => {
    try {
        console.log("Getting current user...");
        
        // First, check if user is authenticated with Appwrite
        const user = await account.get();
        if (!user) {
            console.log("No authenticated user found");
            return redirect("/sign-in");
        }

        console.log("Current user loaded:", user);

        // Then, get user data from database
        const { documents } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal("accountId", user.$id),
                Query.select(["name", "email", "imageUrl", "joinedAt", "accountId", "wishlist"]),
            ]
        );

        if (documents.length === 0) {
            console.log("User data not found in database, creating...");
            // If user data doesn't exist, create it
            const userData = await storeUserData();
            return userData || redirect("/sign-in");
        }

        console.log("User data retrieved:", documents[0]);
        return documents[0];
    } catch (error) {
        console.error("Error fetching user:", error);
        // Don't redirect on error, return null to handle gracefully
        return null;
    }
};

export const getAllUsers = async (limit: number, offset: number) => {
    try {
        const { documents: users, total } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.limit(limit), Query.offset(offset)]
        )

        if(total === 0) return { users: [], total };

        return { users, total };
    } catch (e) {
        console.log('Error fetching users')
        return { users: [], total: 0 }
    }
}