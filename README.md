# Wired: Student-Mentor Connect Platform

**Connect. Collaborate. Create.**

Join Wired to find the perfect project teammates and mentors. Whether you're a student aiming to build something amazing or a mentor ready to guide the next generation, Wired connects you with the right people.

## Features

- **User Registration & Authentication:** Secure signup and login for students, mentors, and admins.
- **Profile Management:** Update your skills, contact information, and other profile details.
- **Project Management:** Create projects, view ongoing projects, and connect with team members.
- **Mentor & Teammate Search:** Search for mentors or teammates based on technological stack.
- **Request System:** Send and manage connection requests (teammate or mentor requests) with real-time status updates.
- **Event & Notification Management:** Admins can create events and notifications are sent to target audiences.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose, JSON Web Tokens (JWT)
- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons
- **Others:** GitHub Actions for keeping server alive (see .github/workflows)

## Installation

### Prerequisites

- Node.js and npm installed
- MongoDB running (local or remote)

### Setup Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend root with your MongoDB connection string and JWT secret:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the backend server:
   ```bash
   npm run start
   ```

### Setup Frontend

1. In a new terminal, navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the client root with your base url of backend api:
   ```
   VITE_API_BASE_URL = http://localhost:8080/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage

- **Authentication:** New users can register and existing users can log in.
- **Profile:** After logging in, update your profile with skills, phone number, etc.
- **Projects:** Create projects, view projects, and send requests to join as a teammate or mentor.
- **Search:** Students can search for mentors based on their tech stack and vice versa.
- **Events & Notifications:** Admins can post events, which generate notifications for targeted users.


