# Node Auth API

A backend-only Express API using MongoDB, organized with an MVC-style structure.

## Requirements

- Node.js 18 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and set `JWT_SECRET` to a private random value of at least 32 characters.

   In Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Start MongoDB. For a local installation, the example URI connects to `mongodb://127.0.0.1:27017/node_auth_api`. In MongoDB Compass, connect to `mongodb://127.0.0.1:27017` and the `node_auth_api` database will appear after the first signup.

4. Start the API:

   ```sh
   npm run dev
   ```

   Or use `npm start` for a regular start.

The server listens on `http://localhost:3000` by default. It does not serve a frontend.

## Endpoints

### `POST /api/auth/signup`

Request JSON:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "a-strong-password"
}
```

Creates an account and returns a JWT and public user details. Email addresses are stored lowercase. Passwords must be at least 8 characters and no more than 72 UTF-8 bytes.

### `POST /api/auth/login`

Request JSON:

```json
{
  "email": "ada@example.com",
  "password": "a-strong-password"
}
```

Returns a JWT and public user details when credentials are valid.

### `GET /api/health`

Returns API health and the current MongoDB connection status.

## Project structure

```text
src/
  config/       Environment and database connection
  controllers/  Signup and login request handling
  models/       Mongoose user model
  routes/       Authentication endpoints
  app.js        Express application
  server.js     Database connection and server startup
```
