# Full Stack Role-Based Job Portal

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

A complete, production-ready full-stack web application that allows Job Seekers to find and apply for jobs, and Recruiters to post and manage listings.

## Features

**Job Seeker:**
- Register & Login
- Search for jobs by title, company, location, and type
- Apply to jobs with a cover letter
- View applied jobs and track application status
- Manage profile information (bio, skills, resume)

**Recruiter:**
- Register & Login
- Post new job listings
- Manage (Edit/Close/Delete) own job listings
- View applicants for each job
- Update applicant status (Pending, Reviewed, Shortlisted, Rejected)

## Tech Stack
- **Frontend:** HTML5, CSS3 (Vanilla), Vanilla JavaScript (ES6+), Fetch API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens), bcryptjs

## Folder Structure

```text
job-portal/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── Job.js                 # Job schema
│   │   └── Application.js         # Application schema
│   ├── routes/
│   │   ├── auth.js                # Register & Login
│   │   ├── jobs.js                # Job CRUD
│   │   └── applications.js        # Apply & track
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification + role guard
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── applicationController.js
│   ├── server.js                  # Express app entry point
│   ├── package.json
│   └── .env                       # Environment Variables
│
├── frontend/
│   ├── index.html                 # Landing page
│   ├── login.html
│   ├── register.html
│   ├── jobseeker/
│   │   ├── dashboard.html
│   │   ├── search-jobs.html
│   │   ├── applied-jobs.html
│   │   └── profile.html
│   ├── recruiter/
│   │   ├── dashboard.html
│   │   ├── post-job.html
│   │   ├── manage-jobs.html
│   │   └── view-applicants.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── auth.js
│       ├── jobs.js
│       └── applications.js
│
└── README.md
```

## Installation Guide

### Prerequisites
- Node.js installed on your local machine
- MongoDB installed locally or a MongoDB Atlas connection string

### Steps

1. **Clone the repository (or navigate to the directory):**
   ```bash
   cd "Role-Based job portal"
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Variables:**
   Ensure your `backend/.env` file has the following sample content:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/job-portal
   JWT_SECRET=super_secret_jwt_key_12345
   JWT_EXPIRES_IN=7d
   ```

4. **Start the Backend Server:**
   ```bash
   # Make sure you are in the backend directory
   npm run dev
   ```

5. **Start the Frontend:**
   You can serve the frontend directory using any static server. For example:
   - Use the VS Code Live Server extension on `index.html`.
   - Or, run `npx serve .` in the root `Role-Based job portal` folder.
   - Navigate to `http://localhost:<port>` (usually 3000 or 5500).

## API Endpoints

### Auth APIs (`/api/auth`)
- `POST /register`: Register user
- `POST /login`: Authenticate user & get token
- `GET /profile`: Get logged in user profile

### Job APIs (`/api/jobs`)
- `GET /`: Get all active jobs (Public)
- `GET /:id`: Get single job by ID (Public)
- `GET /my-jobs`: Get recruiter's posted jobs (Private/Recruiter)
- `POST /`: Create a job (Private/Recruiter)
- `PUT /:id`: Update a job (Private/Recruiter)
- `DELETE /:id`: Delete a job (Private/Recruiter)

### Application APIs (`/api/applications`)
- `POST /apply/:jobId`: Apply for a job (Private/JobSeeker)
- `GET /my-applications`: Get user's applications (Private/JobSeeker)
- `GET /job/:jobId`: Get applicants for a job (Private/Recruiter)
- `PATCH /:id/status`: Update application status (Private/Recruiter)

## Postman Collection
To test these APIs via Postman:
1. Set the Base URL to `http://localhost:5000/api`.
2. For private routes, set the `Authorization` header to `Bearer <your_token>`.
3. Use `application/json` for the `Content-Type` header on POST/PUT/PATCH requests.
