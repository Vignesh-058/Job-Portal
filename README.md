# Enterprise Full Stack Role-Based Job Portal

A production-ready, highly scalable Full Stack Role-Based Job Portal application designed for enterprise deployment.

## 🚀 Enterprise Features

### Architecture & Pattern
* **MVC & Service Layer Pattern**: Clean abstraction of business logic from HTTP controllers.
* **REST API Standards**: Fully documented, standardized JSON responses.
* **Containerized Deployment**: Docker & Docker Compose setup.
* **CI/CD Pipeline**: GitHub Actions for automated testing.

### Advanced Authentication & Security
* **Access & Refresh Tokens**: Short-lived (15m) access tokens and long-lived (7d) refresh tokens.
* **Email Verification**: Nodemailer integration for account activation.
* **Secure Password Recovery**: Automated reset links via email.
* **Security Middleware**: Helmet, API rate limiting, XSS protection, NoSQL injection protection, API compression.
* **Winston & Morgan Logging**: Comprehensive request and error tracking stored in `logs/`.

### Core Enterprise Modules
* **Real-Time WebSockets**: Socket.io integration for instant recruiter notifications on new applications.
* **Recruiter Analytics Dashboard**: Aggregation pipelines calculating Hiring Rates and Monthly Trends powered by Chart.js.
* **Admin Audit Logs**: Automated tracking of all creation, update, and deletion events.
* **Soft Delete System**: Resources (Users, Jobs, Companies) are flagged rather than permanently deleted, with Admin restore capabilities.
* **Advanced Text Search**: Multi-field MongoDB Text Indexing for lightning-fast job discovery.
* **Company Followers**: Job seekers can follow companies for future updates.

## 🛠️ Technology Stack

* **Frontend**: HTML5, CSS3, Vanilla JS, Chart.js
* **Backend**: Node.js, Express.js, Socket.io
* **Database**: MongoDB, Mongoose
* **Testing**: Jest, Supertest, MongoDB-Memory-Server
* **Uploads & Email**: Multer, Cloudinary, Nodemailer
* **DevOps**: Docker, GitHub Actions

## ⚙️ Setup & Installation

### Local Development (Docker)
1. Provide a `.env` file in the root.
2. Run `docker-compose up --build`.

### Local Development (Manual)
1. Start local MongoDB.
2. Provide `.env` in `backend/` with:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/job-portal
   JWT_SECRET=access_key
   JWT_REFRESH_SECRET=refresh_key
   CLOUDINARY_CLOUD_NAME=...
   SMTP_HOST=...
   SMTP_USER=...
   SMTP_PASS=...
   ```
3. `npm run dev` in `backend`.

## 🚢 Deployment Guide

### Database (MongoDB Atlas)
1. Create a cluster on MongoDB Atlas.
2. Retrieve the connection string and set `MONGODB_URI`.

### Backend (Render / Heroku)
1. Connect your GitHub repository to Render as a Web Service.
2. Set Build Command: `npm install`
3. Set Start Command: `npm start`
4. Add all Environment Variables.

### Frontend (Vercel / Netlify)
1. Ensure all API calls in `frontend/js/*.js` point to your deployed backend URL instead of `localhost:5000`.
2. Connect your GitHub repository to Vercel/Netlify.
3. Deploy the `frontend/` directory.

## 🧪 Testing
Run unit and integration tests with:
```bash
npm run test
```

## 📄 API Documentation
See `API_DOCS.md` for complete API references including new endpoints for Refresh Tokens, Resets, Audit Logs, and Analytics.
