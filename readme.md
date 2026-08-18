# CareTaker

CareTaker is a full-stack web application that connects people who need care with caretakers who can advertise their services. Users can discover caretaker profiles, review profile details, request bookings, manage those bookings, and leave reviews after a completed service.

This repository contains the version-one release of the application, with a React frontend and an Express/MongoDB backend.

## Features

- User registration, login, logout, and persistent authentication
- Public caretaker discovery and individual caretaker profiles
- Caretaker advertisements with profile information, availability, pricing, and images
- Location-aware caretaker profiles through address geocoding
- Booking creation and booking management
- Separate booking views for a user's bookings and caretaker requests
- Reviews and star ratings for completed bookings
- Protected routes for authenticated users
- Cloudinary integration for uploaded profile or advertisement images
- Automatic access-token refresh through HTTP-only cookies

## Project Structure

```text
care-taker/
├── client/             # React + Vite frontend
│   └── src/
│       ├── components/  # Shared UI and route guards
│       ├── context/     # Authentication state
│       ├── pages/       # Application screens
│       └── api/         # Axios API client
└── server/             # Express + MongoDB backend
	└── src/
		├── controllers/ # Request handlers
		├── models/      # Mongoose models
		├── routes/      # API route definitions
		├── middlewares/ # Auth, validation, uploads, and errors
		└── utils/       # Cloudinary, geocoding, and shared helpers
```

## Tech Stack

**Frontend:** React, React Router, Vite, Tailwind CSS, Axios, React Toastify

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Zod, Multer, Cloudinary

## Requirements

- Node.js 18 or newer
- npm
- A MongoDB database
- A Cloudinary account for image uploads

## Getting Started

Clone the repository and install dependencies in both applications:

```bash
git clone <repository-url>
cd care-taker

cd server
npm install

cd ../client
npm install
```

Create `server/.env` with the backend configuration:

```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/caretaker

ACCESS_TOKEN_SECRET=replace-with-a-long-random-secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=replace-with-another-long-random-secret
REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Optional: defaults to the Nominatim search endpoint
GEOCODE_PROVIDER_URL=https://nominatim.openstreetmap.org/search
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the backend and frontend in separate terminals:

```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm run dev
```

The frontend is available at `http://localhost:5173` by default. The API is available under `http://localhost:5000/api/v1` when using the example configuration.

## Application Routes

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Browse caretaker advertisements | Public |
| `/caretaker/:id` | View a caretaker profile | Public |
| `/login` | Sign in | Logged-out users |
| `/register` | Create an account | Logged-out users |
| `/advertise` | Create a caretaker advertisement | Non-caretaker users |
| `/my-bookings` | View personal bookings | Authenticated users |
| `/requests` | Manage caretaker booking requests | Authenticated users |
| `/account` | View account details | Authenticated users |
| `/edit-profile` | Edit caretaker profile | Authenticated users |
| `/post-review/:bookingId` | Review a booking | Authenticated users |

## API Areas

The backend exposes versioned endpoints under `/api/v1`:

- `/users` for registration, authentication, sessions, and account data
- `/caretakers` for caretaker profiles and advertisements
- `/bookings` for creating and managing bookings
- `/review` for ratings and reviews

Authentication uses cookies, so the frontend and backend must use the configured CORS origin and credentials support together.

## Available Scripts

### Client

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build locally
```

### Server

```bash
npm run dev      # Start the API with nodemon
```
