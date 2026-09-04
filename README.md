# iChat

A real-time one-to-one chat application built with React, Express, MongoDB, Clerk, Socket.IO, and ImageKit.

## Features

- Clerk authentication with protected API routes
- User discovery and conversation sidebar
- One-to-one text messaging
- Real-time message delivery and online-user presence with Socket.IO
- Image and video messages stored in ImageKit
- 25 MB media upload limit
- Light/dark themes, accent presets, wallpapers, and keyboard sounds
- Responsive chat interface
- Production Docker image that serves the frontend from Express

## Architecture

```text
frontend/  React 19 + Vite + HeroUI + Tailwind CSS + Zustand
backend/   Express 5 + MongoDB/Mongoose + Clerk + Socket.IO
```

In development, Vite serves the frontend at `http://localhost:5173` and the API/socket server runs at `http://localhost:3000`. In production, the backend serves the compiled frontend from its `public/` directory.

## Prerequisites

- Node.js 22 or newer (the Dockerfile uses Node 22)
- npm
- MongoDB database
- Clerk application
- ImageKit account, if image/video messages are needed

## Configuration

Create `backend/.env`:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/ichat
FRONTEND_URL=http://localhost:5173
CLERK_SECRET_KEY=sk_test_your_secret_key
CLERK_WEBHOOK_SIGNING_SECRET=whsec_your_webhook_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

Create `frontend/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

The frontend reads the Clerk publishable key through Vite. The backend uses `CLERK_SECRET_KEY` to validate sessions and `CLERK_WEBHOOK_SIGNING_SECRET` to verify Clerk webhooks. Keep all secret keys out of source control.

### Clerk webhook

Configure a Clerk webhook for:

```text
POST http://localhost:3000/api/webhooks/clerk
```

For a deployed app, use the public backend URL. Subscribe to `user.created`, `user.updated`, and `user.deleted`. The webhook keeps the MongoDB `users` collection synchronized with Clerk profiles. A local webhook URL requires a tunnel or another publicly reachable development endpoint.

## Installation

Install dependencies in both packages:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Development

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in a browser.

To add the sample users to MongoDB:

```bash
cd backend
npm run db:seed
```

The seed command is idempotent for the bundled sample Clerk IDs. Seed users are useful for UI testing, but they are not Clerk accounts and cannot authenticate through Clerk.

## Production build

Build the frontend and backend separately:

```bash
cd frontend
npm run build

cd ../backend
npm run build
npm start
```

The backend build copies `server.js` and `src/` into `backend/dist/`. When `frontend/dist/` is available at the repository root's expected production location, Express serves the SPA and API from the same origin. Set `NODE_ENV=production` and use a production `FRONTEND_URL`; the production cron job sends a health request every 14 minutes.

## Docker

Build the image, passing the public Clerk key at build time:

```bash
docker build --build-arg VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_publishable_key -t ichat .
```

Run it with the backend configuration:

```bash
docker run --rm -p 3000:3000 \
  -e MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/ichat" \
  -e CLERK_SECRET_KEY="sk_live_your_secret_key" \
  -e CLERK_WEBHOOK_SIGNING_SECRET="whsec_your_webhook_secret" \
  -e IMAGEKIT_PRIVATE_KEY="your_imagekit_private_key" \
  -e FRONTEND_URL="http://localhost:3000" \
  -e NODE_ENV="production" \
  ichat
```

Open `http://localhost:3000`. The Docker runtime uses Node 22, installs production backend dependencies, and serves the Vite output through Express.

## API

All routes below are prefixed with `/api` and protected routes require a valid Clerk bearer token.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Server health check; not prefixed with `/api` |
| `GET` | `/api/auth/check` | Resolve the authenticated application user |
| `GET` | `/api/messages/users` | List users except the authenticated user |
| `GET` | `/api/messages/conversations` | List conversations ordered by latest message |
| `GET` | `/api/messages/:id` | Get messages with a user |
| `POST` | `/api/messages/send/:id` | Send text or image/video media using `text` and/or `media` |
| `POST` | `/api/webhooks/clerk` | Receive verified Clerk user lifecycle events |

Media uploads accept images and videos up to 25 MB. ImageKit must be configured before sending media.

## Project structure

```text
.
├── backend/
│   ├── server.js              # HTTP server entry point
│   └── src/
│       ├── app.js             # Express middleware, routes, and static serving
│       ├── controller/        # Authentication and message handlers
│       ├── lib/               # MongoDB, Socket.IO, ImageKit, and cron setup
│       ├── middleware/         # Clerk route protection and media uploads
│       ├── model/              # Mongoose user and message models
│       ├── routes/             # API route definitions
│       ├── seeds/              # Sample user data
│       └── webhooks/           # Clerk webhook handler
├── frontend/
│   ├── src/
│   │   ├── components/         # Auth and chat UI
│   │   ├── context/            # Theme and wallpaper state
│   │   ├── pages/              # Auth and chat pages
│   │   └── store/              # Zustand auth and chat stores
│   └── public/                 # Wallpapers and sounds
├── Dockerfile
└── README.md
```

## Scripts

### Backend

- `npm run dev` - start with Nodemon
- `npm run build` - copy the server into `dist/`
- `npm start` - start the built server
- `npm run db:seed` - upsert sample users

### Frontend

- `npm run dev` - start the Vite development server
- `npm run build` - create the production frontend bundle
- `npm run preview` - preview the production bundle locally
- `npm run lint` - run ESLint
