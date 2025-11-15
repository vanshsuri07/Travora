import { ID, OAuthProvider, Query } from "appwrite";
import { account, database, appwriteConfig } from "~/appwrite/client";
import { redirect } from "react-router";
import { logger } from "~/lib/logger";

export const getExistingUser = async (id: string) => {
    try {
        const { documents, total } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", id)]
        );
        return total > 0 ? documents[0] : null;
    } catch (error) {
        logger.error("Error fetching user:", error);
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
            logger.log("User already exists in database");
            return existingUser;
        }

        const { providerAccessToken } = (await account.getSession("current")) || {};
        const profilePicture = providerAccessToken
            ? await getGooglePicture(providerAccessToken)
            : null;

        logger.log("Creating new user in database");
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

        logger.log("User created successfully");
        return createdUser;
    } catch (error) {
        logger.error("Error storing user data:", error);
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
        logger.error("Error fetching Google picture:", error);
        return null;
    }
};



export const loginWithGoogle = () => {
  try {
    // Use window.location.origin to get the correct base URL
    const successUrl = `${window.location.origin}/auth-callback`;
    const failureUrl = `${window.location.origin}/sign-in?error=oauth_failed`;
    
    logger.log("OAuth URLs configured");
    
    account.createOAuth2Session(
      OAuthProvider.Google,
      successUrl,
      failureUrl
    );
  } catch (error) {
    logger.error("Error during OAuth2 session creation:", error);
  }
}


// NEW: OAuth callback handler
export const handleOAuthCallback = async () => {
  try {
    logger.log("Handling OAuth callback");

    // Get authenticated user
    const user = await account.get();
    if (!user) {
      logger.error("No authenticated user found");
      return redirect("/sign-in");
    }

    logger.log("User authenticated successfully");

    // Store/get user data (make sure this includes `role`)
    const userData = await storeUserData();
    if (!userData) {
      logger.error("Failed to create user data");
      return redirect("/sign-in");
    }

    // Check role (from userData or prefs)
    const role = userData.role || user.prefs?.role || "user";

    logger.log("User role detected");

    // Redirect based on role
    if (role === "admin") {
      logger.log("Redirecting to admin dashboard");
      return redirect("/dashboard");
    } else {
      logger.log("Redirecting to user area");
      return redirect("/user");
    }
  } catch (error) {
    logger.error("OAuth callback error:", error);
    return redirect("/sign-in?error=callback_failed");
  }
};


export const logoutUser = async () => {
    try {
        logger.log("Attempting to delete session");
        
        // Delete current session from Appwrite
        await account.deleteSession("current");
        
        logger.log("Session deleted successfully");
        return { success: true };
        
    } catch (error) {
        logger.error("Error during logout:", error);
        
        // Check if it's a session not found error (user might already be logged out)
        if ((error as any)?.code === 401 || (error as any)?.type === 'user_unauthorized') {
            logger.log("Session was already expired/invalid");
            return { success: true, message: "Session was already expired" };
        }
        
        // For other errors, still return so we can continue with local cleanup
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
};

export const getUser = async () => {
    try {
        logger.log("Getting current user");
        
        // First, check if user is authenticated with Appwrite
        const user = await account.get();
        if (!user) {
            logger.log("No authenticated user found");
            return redirect("/sign-in");
        }

        logger.log("User data loaded successfully");

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
            logger.log("User data not found in database, creating");
            // If user data doesn't exist, create it
            const userData = await storeUserData();
            return userData || redirect("/sign-in");
        }

        logger.log("User data retrieved successfully");
        return documents[0];
    } catch (error) {
        logger.error("Error fetching user:", error);
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
        logger.error('Error fetching users', e)
        return { users: [], total: 0 }
    }
}