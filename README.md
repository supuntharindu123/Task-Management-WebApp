# Task Management Web Application

## Overview
A full-stack web application for managing tasks and team collaboration built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features
- User authentication (Login/Register)
- Role-based access control (Admin/User)
- Task management (Create, Read, Update, Delete)
- Task filtering and sorting
- PDF report generation
- Responsive design

## Tech Stack
- **Frontend**
  - React 18
  - React Router v6
  - Tailwind CSS
  - Date-fns
  - React DatePicker
- **Backend**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT Authentication
  - PDFKit

## Setup and Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/task-management-webapp.git
cd task-management-webapp
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```plaintext
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:
```plaintext
VITE_API_URL=http://localhost:5000
```

## Running the Application

1. **Start Backend Server**
```bash
cd backend
npm start
```

2. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/generate-pdf` - Generate PDF report

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get single user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)

## Directory Structure
```
task-management-webapp/
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.jsx
│   └── index.html
└── README.md
```

