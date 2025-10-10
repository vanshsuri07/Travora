// app/lib/appwrite.config.ts
import {Account, Client, Databases, Storage} from "appwrite";

// Helper to get env vars that work both client and server side
const getEnv = (key: string) => {
    // Browser/client-side
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env[key];
    }
    // Server-side (Node.js)
    return process.env[key];
};

export const appwriteConfig = {
    endpointUrl: getEnv('VITE_APPWRITE_API_ENDPOINT'),
    projectId: getEnv('VITE_APPWRITE_PROJECT_ID'),
    apiKey: getEnv('APPWRITE_API_KEY'),
    databaseId: getEnv('VITE_APPWRITE_DATABASE_ID'),
    userCollectionId: getEnv('VITE_APPWRITE_USERS_COLLECTION_ID'),
    tripCollectionId: getEnv('VITE_APPWRITE_TRIPS_COLLECTION_ID'),
    bookingCollectionId: getEnv('VITE_APPWRITE_BOOKING_COLLECTION_ID'),
}

const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);

export { client, account, database, storage };