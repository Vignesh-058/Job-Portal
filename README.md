# Enterprise Role-Based Job Portal

A production-grade, highly scalable Job Portal application featuring robust Role-Based Access Control (RBAC), background processing, real-time WebSockets, and enterprise security configurations.

## 🚀 Features

- **RBAC Authentication**: Secure JWT-based auth separating Admins, Recruiters, and Job Seekers.
- **Enterprise Security**: Implements `helmet`, `xss-clean`, `express-mongo-sanitize`, and Redis-backed rate limiting.
- **Real-Time WebSockets**: Instant notifications for applications, status changes, and platform alerts using `socket.io`.
- **Background Jobs**: Robust asynchronous job queues using `BullMQ` and Redis for email sending and heavy computations.
- **Docker Ready**: Fully containerized using multi-stage builds and `docker-compose`.
- **CI/CD Integrated**: Automated linting, security audits, and testing via GitHub Actions.

## 🏗 Architecture & Tech Stack

- **Frontend**: Vanilla HTML/JS/CSS (Optimized and completely decoupled).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose Schema Validation).
- **Caching & Queues**: Redis.
- **Architecture Pattern**: Clean MVC (Routes → Controllers → Services → Repositories).

## 🛠 Installation & Setup

### Using Docker (Recommended)

1. Ensure Docker and Docker Compose are installed.
2. Clone the repository.
3. Run the complete orchestration stack:
   ```bash
   docker-compose up -d --build
   ```
4. Access the application at `http://localhost:3000`.

### Manual Setup

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```
2. **Environment Variables**:
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/jobportal
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_super_secret_jwt_key
   JWT_REFRESH_SECRET=your_refresh_secret
   NODE_ENV=development
   ```
3. **Start the backend**:
   ```bash
   npm run dev
   ```
4. **Start the frontend**:
   Use `npx serve -l 3000` inside the project root, or use a Live Server extension on the `/frontend` directory.

## 🧪 Testing

We use Jest and Supertest for TDD and Integration Testing.

```bash
cd backend
npm run test
```
*Coverage aims for >95% statements and branches.*

## 🔒 Security Posture

- **Rate Limiting**: Throttles brute force login attempts using Redis.
- **Data Sanitization**: Protects against NoSQL injection.
- **Helmet**: Secures HTTP headers.
- **CORS**: Strictly managed across environments.

## 📖 API Documentation

Swagger documentation is automatically generated. When the backend is running, visit:
`http://localhost:5000/api-docs`

## 🔮 Future Enhancements (Phase 2 & 3)

- Complete React Migration (Next.js)
- Job Recommendation Engine
- Advanced Admin Analytics Dashboard
