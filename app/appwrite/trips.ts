import {appwriteConfig, database} from "~/appwrite/client";
import {ID, Query} from "appwrite";

export const getAllTrips = async (limit: number, offset: number) => {
    const allTrips = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.tripCollectionId,
        [Query.limit(limit), Query.offset(offset), Query.orderDesc('createdAt')]
    )

    if(allTrips.total === 0) {
        console.error('No trips found');
        return { allTrips: [], total: 0 }
    }

    return {
        allTrips: allTrips.documents,
        total: allTrips.total,
    }
}

export const getTripById = async (tripId: string) => {
    const trip = await database.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.tripCollectionId,
        tripId
    );

    if(!trip.$id) {
        console.log('Trip not found')
        return null;
    }

    return trip;
}

export const addToWishlist = async (tripId: string, userId: string) => {
    try {
        const wishlistItem = await database.createDocument(
            appwriteConfig.databaseId,
            'wishlist', // Assuming 'wishlist' is the collection ID
            ID.unique(),
            {
                tripId,
                userId,
            }
        );
        return wishlistItem;
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return null;
    }
}

export const getWishlist = async (userId: string) => {
    try {
        const { documents } = await database.listDocuments(
            appwriteConfig.databaseId,
            'wishlist', // Assuming 'wishlist' is the collection ID
            [Query.equal('userId', userId)]
        );
        return documents;
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return [];
    }
}