# ChatFlow 💬

A production-quality real-time chat application built with the MERN stack + Socket.io.

## Features

- 🔐 JWT Authentication (Register / Login)
- 💬 Real-time one-on-one messaging via Socket.io
- 🟢 Online / Offline user presence indicators
- ✍️ Typing indicators
- ✅ Message read receipts (sent → delivered → seen)
- 🔔 Unread message count badges
- 📜 Persistent message history in MongoDB
- 🌑 Dark, modern UI (inspired by WhatsApp Web / Telegram)
- 📱 Mobile responsive

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 18, Vite, Tailwind CSS      |
| Backend     | Node.js, Express (ES Modules)     |
| Database    | MongoDB + Mongoose                |
| Auth        | JWT + bcryptjs                    |
| Real-time   | Socket.io (client + server)       |
| HTTP Client | Axios                             |

---

## Project Structure

```
chatflow/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Route handlers
│   ├── middleware/     # JWT auth middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── socket/         # Socket.io event handlers
│   ├── .env            # Environment variables
│   ├── package.json
│   └── server.js       # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/   # Login, Register
    │   │   ├── chat/   # Sidebar, ChatWindow, MessageBubble, etc.
    │   │   └── shared/ # ProtectedRoute
    │   ├── context/    # AuthContext, SocketContext
    │   ├── pages/      # ChatPage
    │   ├── utils/      # api.js (Axios), helpers.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Setup & Installation

### Prerequisites

- Node.js v18+
- MongoDB running locally (`mongodb://localhost:27017`) **or** a MongoDB Atlas URI

---

### 1. Clone / Extract the project

```bash
cd chatflow
```

### 2. Backend setup

```bash
cd backend
npm install
```

Edit `.env` if needed (especially `MONGO_URI` if using Atlas):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/chatflow
JWT_SECRET=chatflow_super_secret_jwt_key_2024
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Backend runs on **http://localhost:5000**

---

### 3. Frontend setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## Socket.io Events Reference

| Event              | Direction         | Description                          |
|--------------------|-------------------|--------------------------------------|
| `user:online`      | Client → Server   | User connects and goes online        |
| `users:online`     | Server → All      | Broadcast updated online user list   |
| `message:send`     | Client → Server   | Send a new message                   |
| `message:received` | Server → Client   | Deliver message to sender + receiver |
| `message:seen`     | Client → Server   | Mark messages as seen                |
| `message:seen:ack` | Server → Client   | Notify sender their message was seen |
| `typing:start`     | Client → Server   | User started typing                  |
| `typing:stop`      | Client → Server   | User stopped typing                  |

---

## API Endpoints

### Auth
| Method | Endpoint             | Access  | Description        |
|--------|----------------------|---------|--------------------|
| POST   | `/api/auth/register` | Public  | Register new user  |
| POST   | `/api/auth/login`    | Public  | Login user         |
| GET    | `/api/auth/me`       | Private | Get current user   |

### Users
| Method | Endpoint     | Access  | Description         |
|--------|--------------|---------|---------------------|
| GET    | `/api/users` | Private | Get all other users |

### Messages
| Method | Endpoint                  | Access  | Description               |
|--------|---------------------------|---------|---------------------------|
| GET    | `/api/messages/unread`    | Private | Get unread message counts |
| GET    | `/api/messages/:userId`   | Private | Get conversation history  |
| POST   | `/api/messages`           | Private | Send a message (HTTP)     |

---

## Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/chatflow
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

Built with ❤️ using the MERN stack.
