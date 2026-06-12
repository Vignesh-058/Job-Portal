# Complete Full Stack Role-Based Job Portal

A production-ready Full Stack Role-Based Job Portal application.

## 🚀 Features

### General
* **JWT Authentication** (Access tokens, Password Hashing)
* **Dark Mode & Modern UI** (CSS Variables, Glassmorphism)
* **Robust Security** (Helmet, Rate Limiting, XSS Protection, NoSQL Injection Protection)
* **Centralized Error Handling & Request Validation**

### Job Seeker Role
* Register, Login, Logout
* Build Profile & Upload Resume (Multer + Cloudinary)
* Search Jobs with Advanced Filtering & Pagination
* Apply for Jobs
* Save Jobs for later
* View Notifications
* View Applied Jobs & Application Status

### Recruiter Role
* Register, Login, Logout
* Manage Companies (Create, Edit, Upload Logo)
* Post Jobs (Linked to Companies)
* Manage Posted Jobs (Status: Active, Closed, Draft)
* View Applicants & Change Application Status (Pending, Shortlisted, Rejected)

### Admin Role
* View Dashboard Statistics
* Manage Users (Block/Unblock Fraudulent Users)
* Manage Jobs (Delete Fraudulent Jobs)

## 🛠️ Technology Stack

* **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Backend**: Node.js, Express.js
* **Database**: MongoDB, Mongoose
* **Uploads**: Multer, Cloudinary

## ⚙️ Setup & Installation

### Prerequisites
* Node.js
* MongoDB Server (Running locally or MongoDB Atlas)
* Cloudinary Account

### 1. Clone the repository
```bash
git clone <repository_url>
cd <repository_folder>
```

### 2. Install dependencies
```bash
cd backend
npm install
```

### 3. Environment Variables
Create a `.env` file in the `backend` folder and add:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/job-portal
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the application
Start the backend server:
```bash
cd backend
npm run dev
```

Open `index.html` in your browser (Preferably using a live server like VSCode Live Server).

## 📄 API Documentation
See `API_DOCS.md` for complete API references.

## 🔒 Security Best Practices Implemented
* Passwords hashed using bcrypt.
* JWT used for session management.
* Input validation via `express-validator`.
* Security headers managed by `helmet`.
* API rate limiting via `express-rate-limit`.
* NoSQL injection prevention via `express-mongo-sanitize`.
* XSS protection via `xss-clean`.
