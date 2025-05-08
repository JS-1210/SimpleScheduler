# SimpleScheduler – Full Stack Appointment Booking System

## Overview

SimpleScheduler is a minimalist full-stack appointment scheduling system built for a take-home assignment. It supports service management, booking, availability display, and a smart scheduling algorithm to optimize time slot suggestions.

---

## Tech Stack

* **Frontend**: React.js (JavaScript)
* **Backend**: Node.js + Express.js
* **Database**: MongoDB + Mongoose
* **Styling**: Basic HTML & CSS (no framework)
* **Notifications**: react-hot-toast

---

## Features

### Admin: Manage Service Types

* Add service with:

  * Name
  * Price
  * Duration (in minutes)
* View all services in a list

### Customer: Book Appointments

* Select a service
* Choose a date
* View available slots
* Provide name and email to confirm booking
* Toggle smart scheduling mode for better slot suggestions

### Weekly Availability

* Displays all time slots from 9 AM – 5 PM, Mon–Fri
* Highlights booked vs available slots
* Click to select a time slot for booking

### Smart Scheduling Logic

* Scores slots based on proximity to existing appointments with the same duration
* Returns only scored slots, and falls back to full list if no matches
* Optimizes employee time and reduces gaps

---

## Folder Structure

```
frontend/src/        # React frontend
  components/        # ServiceType
  pages/             #Weekly Appointments, BookAppointment
  App.tsx            # Main app routes
  main.tsx           # React DOM entry

backend/src/          # Node.js backend
  models/            # Mongoose models (Service, Appointment)
  routes/            # Express routes for services, appointments, availability
  controllers/       # Route handlers
  utils/             # Smart scheduling algorithm, Error handling
  middleware/        # async wrapper
  .env               # MongoDB connection
```

---

## Setup Instructions

### Prerequisites

* Node.js >= 18
* MongoDB Atlas or Local MongoDB

### 1. Clone Repository

```bash
git clone https://github.com/JS-1210/SimpleScheduler
cd SimpleScheduler
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `backend/` with:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/scheduler
```

Seed Data: 
npm run seed

Start backend:
npm run start

### 3. Frontend Setup

cd client
npm install
npm run dev

The app runs at:

* Frontend: `http://localhost:5173`
* Backend: `http://localhost:5000`

---

## API Endpoints

### Service Types

* `GET /api/services` → Get all service types
* `POST /api/services` → Create a new service

### Appointments

* `GET /api/appointments` → Get all appointments
* `POST /api/appointments` → Book a new appointment

### Availability

* `GET /api/availability?date=YYYY-MM-DD&serviceId=ID` → Get standard slots
* `GET /api/availability/smart?date=YYYY-MM-DD&serviceId=ID` → Get smart scheduled slots

---

## Smart Scheduling Algorithm

* Takes available slots and booked appointments
* Assigns score based on adjacent appointments with same duration
* Returns only high-score slots, or full list if none
* Helps cluster similar durations to avoid downtime

---

## Approach

* Clean folder structure separating backend and frontend
* Reusable, minimalist UI design pattern across all components
* Form validation with HTML5 + runtime checks
* Consistent error handling and toast feedback
* Fully working end-to-end with minimal external dependencies

---

## Author

Built by Jay Shah as part of a take-home assignment.

> For any queries, please reach out via email: [jayshah3076@gmail.com](mailto:jayshah3076j@gmail.com)
