# College News Portal — Frontend

A React + Tailwind CSS frontend for a college news portal, matching the
provided UI design: Home, News, Events, Gallery, Contact, Login, and an
Admin Dashboard.

This is the **frontend only**. It's built to talk to a Node.js + Express +
MongoDB backend (REST API) — see the "Connecting a backend" section below.

## Tech stack

- React 18 + React Router 6
- Tailwind CSS
- Vite (build tool / dev server)
- lucide-react (icons)
- axios (ready to use for API calls)

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/
    Navbar.jsx           Top navigation bar (logo, links, register, login, mobile menu)
    Footer.jsx            Site footer
    Breadcrumb.jsx         Page header + breadcrumb used on News/Events/Gallery/Contact
    DashboardLayout.jsx    Shared sidebar + topbar shell used by all 3 dashboards
  pages/
    Home.jsx               Hero + quick links + latest news + upcoming events
    News.jsx                News listing with category sidebar + pagination
    Events.jsx              Upcoming events grid
    Gallery.jsx             Filterable image gallery
    Contact.jsx             Contact info + message form
    Login.jsx               Role-based login (Student / Teacher / Admin)
    Register.jsx            Role-based registration (Student / Teacher / Admin)
    StudentDashboard.jsx    Courses, assignments, attendance stats
    TeacherDashboard.jsx    Classes, student submissions, stats
    AdminDashboard.jsx      Site-wide stats + recent news table
  data/
    mockData.js             Mock data currently powering the UI
  App.jsx                  Routes + layout switching (dashboards vs public site)
  main.jsx                 App entry point
```

## Authentication & roles

This frontend is now wired to a real Express + MongoDB backend (see the
separate `college-news-portal-backend` project) for:

- **Register** (`/register`) — `POST /api/auth/register`, role-specific
  fields included (roll number/course, employee ID/department, or admin
  invite code).
- **Login** (`/login`) — `POST /api/auth/login`, redirects to the
  matching dashboard on success.
- **Logout** — calls `POST /api/auth/logout` (clears the server-side
  httpOnly cookie) from the Navbar or any dashboard sidebar.
- **Session persistence** — on every page load, `AuthContext` calls
  `GET /api/auth/me` to check if you're still logged in via the cookie.
- **Contact form** (`/contact`) — `POST /api/contact`, saved to MongoDB.
- **Route guarding** — `/student/dashboard`, `/teacher/dashboard`, and
  `/admin/dashboard` are wrapped in `<ProtectedRoute role="...">`, which
  redirects to `/login` if you're not authenticated, or to your own
  dashboard if you're logged in as the wrong role.

Set the backend's URL in `.env`:
```
VITE_API_URL=http://localhost:5000/api
```
(already included, pointing at `localhost:5000` by default)

**Still using mock data** inside each dashboard: the course/assignment
lists in the Student dashboard and the class/submission lists in the
Teacher dashboard. Everything else (News, Events, Gallery, Notices,
Contact, and all Admin management screens) is fully live against MongoDB.

## Admin management screens

Logged in as `admin`, the dashboard sidebar links to dedicated add/delete
screens for every content type, all backed by the real API:

- `/admin/news` — publish or delete news articles (with category + draft/published status)
- `/admin/events` — create or delete events; shows live registration counts
- `/admin/gallery` — add or delete gallery images by category
- `/admin/notices` — post or delete notices, targeted at All / Students / Teachers, with priority levels
- `/admin/users` — create any-role user accounts, deactivate/reactivate, or delete users
- `/admin/messages` — view, mark as read, or delete contact form submissions

All deletions ask for confirmation first, and every list refreshes from
the database immediately after an add/delete so the UI never shows stale
data.

## Notices — visible to every logged-in role

Notices are the one feature designed to be seen by **everyone**, with
visibility controlled server-side by audience:
- Guests and the public `/notices` page see only `audience: "All"` notices.
- Logged-in **students** additionally see `audience: "Student"` notices —
  shown both on `/notices` and as a panel on the Student dashboard.
- Logged-in **teachers** additionally see `audience: "Teacher"` notices —
  shown both on `/notices` and as a panel on the Teacher dashboard.
- **Admins** see and manage everything from `/admin/notices`.




## Connecting a backend (Node.js + Express + MongoDB)

Right now every page reads from `src/data/mockData.js` so the UI works
standalone. To wire it up to a real API:

1. Build an Express + MongoDB API exposing endpoints such as:
   - `GET /api/news`, `GET /api/news/:id`
   - `GET /api/events`
   - `GET /api/gallery`
   - `POST /api/contact`
   - `POST /api/auth/register` (accepts `role`: student / teacher / admin)
   - `POST /api/auth/login` (accepts `role`, returns a JWT + user profile)
   - `GET /api/student/dashboard`, `GET /api/teacher/dashboard`, `GET /api/admin/stats`
2. Set the API base URL, e.g. create a `.env` file:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. Replace the imports from `mockData.js` with `axios` calls, e.g.:
   ```js
   import axios from 'axios'
   const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/news`)
   ```
4. `vite.config.js` already proxies `/api` to `http://localhost:5000`
   during development, so you can call `axios.get('/api/news')` directly
   without CORS issues while developing locally.

## Notes

- Images currently use Unsplash URLs as placeholders — swap these for your
  college's real photos/uploads once the backend (e.g. MongoDB + GridFS,
  or a local `/uploads` folder served by Express) is in place.
- The Student, Teacher, and Admin dashboards (`/student/dashboard`,
  `/teacher/dashboard`, `/admin/dashboard`) use their own sidebar layout
  (no public navbar/footer). Add real authentication and role-based route
  guarding before deploying — currently anyone can visit any dashboard URL
  directly.
