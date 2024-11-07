# Nacural Cycles Challenge - Backend

A Node.js backend service built with Express and TypeScript that handles phone authentication and user profile management using Firebase.

## Prerequisites

- Node.js
- npm
- Firebase project with Phone Authentication enabled
- Firebase Admin SDK credentials

## Project Setup

1. Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd backend
npm install
```

2. Configure Firebase Admin SDK:
   - Go to Firebase Console: https://console.firebase.google.com
   - Select your project
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key" and save the JSON file

3. make a copy of `.env.sample` with name `.env` file in the root directory and set missing variables

## Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Health Check
```
GET /health
```

### Profile Management
```
GET /api/profile
Authorization: Bearer {firebase-id-token}
```
```
PUT /api/profile
Authorization: Bearer {firebase-id-token}
Content-Type: application/json

{
    "name": "Per Gustafsson",
    "email": "per@example.com"
}
```

## Development

1. Start the development server:
```bash
npm run dev
```

2. The server will start on http://localhost:3000

3. Test the health check endpoint:
```bash
curl http://localhost:3000/health
```

## Deployment

1. Build the project:
```bash
npm run build
```

2. The compiled JavaScript will be in the `dist` directory.

3. Start the production server:
```bash
npm start
```

## Security

- Rate limiting is enabled (100 requests per 15 minutes per IP)
- All routes (except /health) require Firebase authentication
- CORS is configured to allow only the frontend origin

## Dependencies

Main dependencies:
- `express`: Web framework
- `firebase-admin`: Firebase Admin SDK
- `typescript`: TypeScript support
- `cors`: CORS middleware
- `dotenv`: Environment variables
- `express-rate-limit`: Rate limiting

Dev dependencies:
- `ts-node`: TypeScript execution
- `nodemon`: Development auto-reload
- `@types/node`: Node.js type definitions
- `@types/express`: Express type definitions
- `@typescript-eslint/parser`: TypeScript ESLint parser
- `@typescript-eslint/eslint-plugin`: TypeScript ESLint rules
- `jest`: Testing framework
- `supertest`: Superagent like library
- `prettier`: Code formatter