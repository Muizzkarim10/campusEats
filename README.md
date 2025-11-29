# UniFoods 🍽️

UniFoods is a full-stack web application designed for students, teachers, and admins to order and manage food on campus.

## Features

- Role-based login (Student, Teacher, Admin)
- View and order food items
- Admin dashboard for managing menu and orders
- Fully responsive design for desktop and mobile

## Tech Stack

- **Frontend:** React, Vite, TailwindCSS, React Router, Axios
- **Backend:** Node.js, Express, MySQL, JWT Authentication

## Folder Structure

UniFoods/ </br>
├─ frontend/ # React + Vite frontend </br>
└─ backend/ # Node + Express backend

## Getting Started

### Prerequisites

- Node.js and npm installed
- MySQL installed and running

### Backend Setup

```bash
cd backend
npm install
# Create .env file with your DB credentials and JWT secret
node server.js

cd frontend
npm install
npm run dev
