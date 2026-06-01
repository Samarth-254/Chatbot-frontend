# Frontend - Customer Query Replying Chatbot

This frontend powers a customer-facing support chatbot and an admin-facing dashboard for managing knowledge sources, custom Q&A data, and chatbot interactions.

## Overview

The frontend is designed around two separate user experiences:

- A **public chatbot** that customers can use without friction.
- A **protected admin dashboard** where admins can manage documents, custom Q&A entries, and chatbot logs.

This separation was intentional. The chatbot remains easy to access for customers, while admin functionality stays secure and role-restricted.

## Features

### Public chatbot

- Public route for customer support queries.
- Conversational UI with chat bubbles and timestamps.
- Quick suggestion prompts for common support questions.
- Safe handling of unsupported or low-context queries.
- Optional user login for saved chat history.
- Session-based chat history loading for authenticated users.

### Authentication flows

- User login/register flow.
- Separate admin login flow.
- Role-aware redirects after login and logout.
- Protected admin-only dashboard route.
- Redirect normal users away from `/dashboard` to the public chatbot.

### Admin dashboard

- Overview page with metrics and activity visualization.
- Document upload and management UI.
- Custom Q&A create/edit/delete workflow.
- User interaction logs.
- Unresolved query tracking.
- Search and refresh behavior for Q&A management.

## Tech stack

- **React** - UI library
- **React Router** - client-side routing
- **Vite** - frontend build tool
- **Tailwind CSS** - styling
- **Recharts** - analytics charts in dashboard
- **Lucide React** - icons

## Routing structure

```txt
/            -> Public chatbot
/login       -> User login/register
/admin-login -> Admin login
/dashboard   -> Admin-only dashboard
```

## Key frontend decisions

### 1. Public chatbot route

The chatbot was kept public because the product is primarily a customer-support experience. This reduces friction and makes the app more aligned with the problem statement.

### 2. Separate admin route protection

Admin functionality is not mixed with general authenticated user flows. Admins have a dedicated login route and dashboard route, which keeps authorization clearer and easier to maintain.

### 3. Role-aware redirects

- Normal users trying to access `/dashboard` are redirected back to the public chatbot.
- Admin logout redirects to `/admin-login`.
- User logout redirects to `/`.

### 4. Shared API/auth layer

Authentication state, token management, and role checks are centralized in the frontend API/auth utility rather than duplicated across components.

## Folder structure

```bash
src/
  components/
    Sidebar.jsx
  pages/
    Chatbot.jsx
    Dashboard.jsx
    Login.jsx
  api.js
  App.jsx
  main.jsx
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the frontend root if needed.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

## Main pages

### `Chatbot.jsx`

Handles:

- public customer chat flow
- optional authenticated history loading
- session management
- logout flow for user/admin
- suggestion prompts
- message rendering with timestamps and date separators

### `Login.jsx`

Handles:

- user login
- user registration
- admin login mode
- post-login role-based navigation

### `Dashboard.jsx`

Handles:

- admin-only dashboard rendering
- document upload and delete actions
- custom Q&A management
- chat analytics and logs
- role-aware redirect for unauthorized access

## Frontend UX goals

- Keep the chatbot fast and easy to access.
- Make the dashboard feel clean and operational.
- Reduce friction for customer support use cases.
- Keep admin workflows direct and easy to verify during demo.

