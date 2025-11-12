# Gait-Pass Frontend

A modern React + Vite frontend for the Gait-Pass facial and gait recognition ticketing system.

## Features

- ✅ User Registration & Authentication
- ✅ Face Recognition Registration
- ✅ Digital Wallet Management
- ✅ Journey Tracking & History
- ✅ Fare Calculator
- ✅ Admin Dashboard
- ✅ Station & Fare Management
- ✅ Responsive Design

## Tech Stack

- React 18
- Vite
- React Router DOM
- Axios
- React Icons
- React Toastify
- date-fns

## Installation

1. Install dependencies:
npm install

text

2. Create `.env` file:
VITE_API_BASE_URL=https://gait-pass-backend.onrender.com
VITE_ML_SERVICE_URL=https://kcshashank-gait-pass-ml-service.hf.space

text

3. Run development server:
npm run dev

text

4. Build for production:
npm run build

text

## Project Structure

src/
├── api/ # API integration layer
├── components/ # Reusable components
├── context/ # React context
├── hooks/ # Custom hooks
├── pages/ # Page components
├── styles/ # CSS files
├── utils/ # Utility functions
├── App.jsx # Main app component
├── main.jsx # Entry point
└── router.jsx # Route configuration

text

## Environment Variables

- `VITE_API_BASE_URL` - Backend API URL
- `VITE_ML_SERVICE_URL` - ML Service URL

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

MIT