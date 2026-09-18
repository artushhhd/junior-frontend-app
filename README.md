# Course Platform — Frontend

Frontend for a small course platform, built with Next.js App Router and React. It consumes the Laravel REST API and provides authentication, course browsing, course creation, likes, comments, and an admin panel.

Backend: [junior-backend-api](https://github.com/artushhhd/junior-backend-api)

## Tech Stack

- Next.js 16 — App Router
- React 19
- JavaScript
- Native fetch API client
- Tailwind CSS 4

## Features

### Authentication

- User registration and login
- Server-side validation errors displayed in forms
- Token-based authentication through the Laravel API
- Profile page
- Logout

### Courses

- Course list and course details
- Create a new course
- Course image upload
- Like / unlike courses
- Comments

### Admin Panel

Available at `/admin` for accounts with the required role from the Laravel API.

- Course moderation
- User management
- Account blocking

## Project Structure

```text
app/
├── page.js                  # Registration page
├── login/                   # Login page
├── profile/                 # Profile page
├── Course/                  # Course list and details
├── addCourse/               # Course creation
├── like/                    # Like functionality
├── admin/                   # Admin dashboard
├── layout.js                # Root layout
└── ClientLayoutHelper.jsx   # Client-side layout wrapper

lib/                         # Shared frontend utilities
public/                      # Static assets
```

Pages use the Next.js App Router. UI logic is kept in separate JSX components where client-side state or interaction is required.

## Backend Connection

The API base URL is configured through an environment variable:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

The frontend communicates with endpoints such as:

```text
/api/login
/api/register
/api/profile
/api/logout
/api/courses
/api/courses/{id}/like
/api/courses/{id}/comment
/api/admin/...
```

The Laravel backend must be running for authentication and API requests to work.

## Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the API URL

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Change the value if your Laravel API runs on another host or port.

### 3. Start the development server

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:3000
```

Make sure the Laravel backend is running at the same time:

**[junior-backend-api](https://github.com/artushhhd/junior-backend-api)**

## Production Build

```bash
npm run build
npm start
```
