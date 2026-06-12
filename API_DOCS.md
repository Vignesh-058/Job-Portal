# JobPortal API Documentation

## Authentication (`/api/auth`)

### Register
* **POST** `/api/auth/register`
* **Body**: `{ "name": "User", "email": "user@example.com", "password": "password123", "role": "jobseeker" | "recruiter" }`
* **Response**: `201 Created` with JWT token.

### Login
* **POST** `/api/auth/login`
* **Body**: `{ "email": "user@example.com", "password": "password123" }`
* **Response**: `200 OK` with JWT token.

## Profile (`/api/profile`)

### Upload Resume
* **POST** `/api/profile/upload-resume`
* **Headers**: `Authorization: Bearer <token>`
* **Body**: `multipart/form-data` with `resume` file field.
* **Response**: `200 OK` with resume URL.

### Remove Resume
* **DELETE** `/api/profile/remove-resume`
* **Headers**: `Authorization: Bearer <token>`
* **Response**: `200 OK`

## Company (`/api/company`) - *Recruiter Only*

### Create Company
* **POST** `/api/company`
* **Headers**: `Authorization: Bearer <token>`
* **Body**: `{ "name": "TechCorp", "website": "https://techcorp.com", "description": "Tech company" }`
* **Response**: `201 Created`

### Get My Companies
* **GET** `/api/company/my`
* **Headers**: `Authorization: Bearer <token>`
* **Response**: `200 OK`

## Jobs (`/api/jobs`)

### Get All Active Jobs (Paginated & Advanced Search)
* **GET** `/api/jobs?page=1&limit=10&title=developer&location=NY&jobType=remote`
* **Response**: `200 OK`

### Get Recruiter's Jobs (Paginated)
* **GET** `/api/jobs/my-jobs?page=1&limit=10`
* **Headers**: `Authorization: Bearer <token>`
* **Response**: `200 OK`

### Create Job
* **POST** `/api/jobs`
* **Headers**: `Authorization: Bearer <token>`
* **Body**: `{ "title": "Developer", "companyId": "...", "location": "NY", "type": "full-time", "description": "...", "status": "Active" }`
* **Response**: `201 Created`

## Applications (`/api/applications`)

### Apply for Job
* **POST** `/api/applications/apply/:jobId`
* **Headers**: `Authorization: Bearer <token>`
* **Body**: `{ "coverLetter": "Optional text" }`
* **Response**: `201 Created`

### Get Job Applicants (Paginated) - *Recruiter Only*
* **GET** `/api/applications/job/:jobId?page=1&limit=10`
* **Headers**: `Authorization: Bearer <token>`
* **Response**: `200 OK`

## Saved Jobs (`/api/saved-jobs`) - *Job Seeker Only*

### Save Job
* **POST** `/api/saved-jobs/:jobId`
* **Headers**: `Authorization: Bearer <token>`
* **Response**: `201 Created`

### Get Saved Jobs
* **GET** `/api/saved-jobs`
* **Headers**: `Authorization: Bearer <token>`
* **Response**: `200 OK`

## Notifications (`/api/notifications`)

### Get Notifications
* **GET** `/api/notifications`
* **Headers**: `Authorization: Bearer <token>`
* **Response**: `200 OK`

### Mark as Read
* **PATCH** `/api/notifications/:id/read`
* **Headers**: `Authorization: Bearer <token>`
* **Response**: `200 OK`

## Admin (`/api/admin`) - *Admin Only*

### Dashboard Stats
* **GET** `/api/admin/stats`
* **Headers**: `Authorization: Bearer <token>`
* **Response**: `200 OK`

### Get All Users
* **GET** `/api/admin/users?page=1&limit=10`
* **Headers**: `Authorization: Bearer <token>`
* **Response**: `200 OK`

### Toggle Block User
* **PATCH** `/api/admin/users/:id/block`
* **Headers**: `Authorization: Bearer <token>`
* **Response**: `200 OK`

### Delete Job (Fraud)
* **DELETE** `/api/admin/jobs/:id`
* **Headers**: `Authorization: Bearer <token>`
* **Response**: `200 OK`
