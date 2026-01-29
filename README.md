# Node.js Express Mongoose Backend

A basic Node.js backend setup with Express and Mongoose.

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/nodejs-backend
```

## Running the Server

```bash
# Start the server
npm start

# For development with auto-restart (requires nodemon)
npm run dev
```

## API Endpoints

- `GET /` - Welcome message
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID

## Project Structure

```
backendNode/
├── models/
│   └── User.js          # User model
├── routes/
│   └── users.js         # User routes
├── server.js            # Main server file
├── .env                 # Environment variables
├── .gitignore           # Git ignore file
├── package.json         # Dependencies and scripts
└── README.md            # This file
```
