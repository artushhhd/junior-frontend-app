# Course Platform — Frontend (Next.js)
 
Frontend for a course platform, built with Next.js App Router + React. Talks to the Laravel API here: [Laravel-juniorProject](https://github.com/yourname/Laravel-juniorProject).
 
## Stack
 
- Next.js 16 (App Router), React 19
- Tailwind CSS 4
- Plain fetch/axios to hit the API, token stored in `localStorage`
## What it does
 
- Register / login, with server-side validation errors shown on the form
- Profile page (view user info, logout)
- Course list + course detail
- Create a new course (`addCourse`)
- Like/unlike a course
- Admin panel (`/admin`) — moderate courses and users, only useful if your API account has an admin/moderator role
## Project structure
 
```
app/
├── page.js               # register page (root)
├── login/                 # login page + form
├── profile/                # profile page
├── Course/                  # course list/detail
├── addCourse/                # create course form
├── like/                      # like button component
├── admin/                      # admin dashboard
├── layout.js                    # root layout
└── ClientLayoutHelper.jsx        # client-side layout wrapper (nav etc.)
```
 
Each page is a folder with `page.js` (the route) plus a `*.jsx` component and its own `*.css` file.
 
## Connecting to the backend
 
The API base URL comes from an env variable:
 
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```
 
Endpoints used: `/api/login`, `/api/register`, `/api/profile`, `/api/logout`, `/api/courses`, `/api/courses/{id}/like`, `/api/admin/...`.
 
## Running locally
 
```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev
```
 
App runs on `http://localhost:3000`. Needs the Laravel backend running too ([Laravel-juniorProject](https://github.com/yourname/Laravel-juniorProject)).
