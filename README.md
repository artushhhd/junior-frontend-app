# Course Platform — Frontend

A Next.js 16 frontend for a course platform, connected to a Laravel REST API.

**Backend:** [junior-backend-api](https://github.com/artushhhd/junior-backend-api)

## What this project demonstrates

- Next.js App Router
- React 19
- JavaScript frontend architecture
- Integration with a separate Laravel REST API
- Token-based authentication
- Protected user flows
- Course CRUD and interactions
- Form handling and server validation errors
- Role-aware administration UI
- Centralized API client
- Environment-based backend configuration
- Responsive UI with Tailwind CSS

## Tech Stack

| Technology | Usage |
|---|---|
| Next.js 16 | React framework / App Router |
| React 19 | UI |
| JavaScript | Application code |
| Tailwind CSS 4 | Styling |
| Native Fetch API | HTTP client |
| Laravel Sanctum | Backend authentication |

## Core Features

### Authentication

- Registration
- Login
- Logout
- Token persistence
- Profile page
- Backend validation errors displayed in forms
- Automatic handling of expired/invalid authentication responses

### Course Platform

- Browse courses
- View course details
- Create courses
- Upload course images
- Edit/delete owned courses
- Like / unlike courses
- Add comments
- Connect directly to the Laravel API

### Administration

The application includes an `/admin` area for staff users.

The admin interface provides:

- Course moderation
- Course approval
- User management
- Account blocking
- Administrative actions backed by the Laravel authorization layer

The frontend does not replace backend authorization. The Laravel API remains responsible for deciding whether an administrative request is allowed.

## API Layer

All backend communication is centralized in `lib/api.js`.

It handles:

- API base URL configuration
- Bearer token attachment
- JSON requests
- FormData requests
- HTTP error handling
- Automatic token cleanup on `401 Unauthorized`
- Media URL construction

The API URL is configured through an environment variable rather than hardcoded throughout the application.

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

## Project Structure

```text
app/
├── page.js                    # Registration
├── login/                     # Login
├── profile/                   # User profile
├── Course/                    # Course UI
├── addCourse/                 # Course creation
├── admin/                     # Administration
├── layout.js                  # Root layout
└── ClientLayoutHelper.jsx     # Client-side layout handling

lib/
├── api.js                     # Central API client
├── auth.js                    # Authentication state
└── ...

public/
└── ...                        # Static assets
```

The App Router is used for application routing, while interactive UI is isolated into client components where browser state or events are required.

## Backend Contract

The frontend consumes endpoints including:

```text
POST   /api/register
POST   /api/login
GET    /api/profile
POST   /api/logout

GET    /api/courses
POST   /api/courses
PUT    /api/courses/{id}
DELETE /api/courses/{id}

POST   /api/courses/{id}/like
POST   /api/courses/{id}/comment

GET    /api/admin/...
```

See the backend repository for the complete API and authorization rules.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/artushhhd/junior-frontend-app.git
cd junior-frontend-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Make sure the Laravel backend is running.

### 4. Start development

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Production build

```bash
npm run build
npm start
```

## Quality Notes

The project keeps the frontend and backend independently deployable. Authentication, API requests and media URL construction are centralized instead of being duplicated across pages.

For a full-stack view of the project, see the backend repository:

**[junior-backend-api](https://github.com/artushhhd/junior-backend-api)**
