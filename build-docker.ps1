# Read .env.local
Get-Content .env.local | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        Set-Variable -Name $matches[1] -Value $matches[2]
    }
}

docker build `
  --build-arg NODE_ENV=production `
  --build-arg VITE_APPWRITE_PROJECT_ID="$VITE_APPWRITE_PROJECT_ID" `
  --build-arg VITE_APPWRITE_API_ENDPOINT="$VITE_APPWRITE_API_ENDPOINT" `
  --build-arg VITE_APPWRITE_DATABASE_ID="$VITE_APPWRITE_DATABASE_ID" `
  --build-arg VITE_APPWRITE_USERS_COLLECTION_ID="$VITE_APPWRITE_USERS_COLLECTION_ID" `
  --build-arg VITE_APPWRITE_TRIPS_COLLECTION_ID="$VITE_APPWRITE_TRIPS_COLLECTION_ID" `
  --build-arg VITE_APPWRITE_BOOKING_COLLECTION_ID="$VITE_APPWRITE_BOOKING_COLLECTION_ID" `
  --build-arg VITE_STRIPE_PUBLISHABLE_KEY="$VITE_STRIPE_PUBLISHABLE_KEY" `
  --build-arg VITE_APP_URL="$VITE_APP_URL" `
  -f Dockerfile.github `
  -t vanshsuri07/travel-agency-app:latest `
  .