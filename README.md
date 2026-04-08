# Travora - Your AI-Powered Travel Companion (with admin dashboard)

<div align="center">
  <img src="https://raw.githubusercontent.com/vanshsuri07/Travora/main/public/assets/icons/logo.svg" alt="Travora Logo" width="150"/>
  <h1>Travora</h1>
  <p>Your AI-powered travel companion to discover, plan, and book your next adventure.</p>

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://travora-agency.vercel.app/)
[![Build Status](https://github.com/vanshsuri07/Travora/actions/workflows/docker-build.yml/badge.svg)](https://github.com/vanshsuri07/Travora/actions)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

## ✨ Features

- **AI-Powered Recommendations**: Get personalized travel suggestions based on your preferences.
- **Interactive Globe**: Explore destinations on a beautiful 3D globe.
- **Seamless Booking**: Book flights, hotels, and activities with our integrated Stripe payment system.
- **Trip Management**: Organize your itineraries, track your expenses, and manage your bookings all in one place.
- **User Authentication**: Secure sign-up and login functionality.
- **Admin Dashboard**: Manage users, trips, and bookings with a powerful admin dashboard.
- **Responsive Design**: Enjoy a seamless experience on both desktop and mobile devices.

## 📸 Screenshots

<div align="center">
  <table>
    <tr>
      <td><img src="https://raw.githubusercontent.com/vanshsuri07/Travora/main/public/assets/images/sample4.JPG" alt="Screenshot 4" width="400"/></td>
      <td><img src="https://raw.githubusercontent.com/vanshsuri07/Travora/main/public/assets/images/sample1.JPG" alt="Screenshot 1" width="400"/></td>
    </tr>
    <tr>
      <td><img src="https://raw.githubusercontent.com/vanshsuri07/Travora/main/public/assets/images/sample2.JPG" alt="Screenshot 2" width="400"/></td>
      <td><img src="https://raw.githubusercontent.com/vanshsuri07/Travora/main/public/assets/images/sample3.JPG" alt="Screenshot 3" width="400"/></td>
    </tr>
  </table>
</div>

## 🚀 Tech Stack

- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Appwrite (Backend-as-a-Service)
- **3D Globe**: React Three Fiber, Three.js, React Globe.gl
- **AI**: Google Generative AI
- **Payments**: Stripe

## 🧭 How It Works

1. **Sign up / Log in** — authenticate securely via Appwrite
2. **Set your preferences** — choose your destination, budget, travel style, group type, and interests
3. **AI generates your trip** — Google Gemini AI builds a full day-by-day itinerary with activities, best time to visit, and weather info
4. **Explore visually** — browse your trip with destination photos pulled from Unsplash and an interactive 3D globe
5. **Manage your trips** — view all generated trips from your personal dashboard
6. **Admin controls** — admins can manage all users and trips via a dedicated dashboard

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vanshsuri07/Travora.git
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## 📦 Building for Production

Create a production-ready build:

```bash
npm run build
```

## 🚢 Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t travora .

# Run the container
docker run -p 5173:5173 travora
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`:

```
├── package.json
├── package-lock.json
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
