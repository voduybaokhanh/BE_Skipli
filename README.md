# BE_Skipli

Backend API with Node.js, Express, and MongoDB (Mongoose).

## Setup
- Ensure MongoDB is running locally or set `MONGODB_URI` in `.env`.
- Install deps:
```
npm install
```
- Start dev server:
```
npm run dev
```
- Or start normally:
```
npm start
```

Env vars:
- `PORT` (default 3000)
- `MONGODB_URI` (default mongodb://127.0.0.1:27017/skipli)

## Endpoints

Owner:
- POST `/createNewAccessCode` body: `{ phoneNumber }` → `{ accessCode }`
- POST `/validateAccessCode` body: `{ accessCode, phoneNumber }` → `{ success: true }`
- POST `/getEmployee` body: `{ employeeId }` → Employee object
- POST `/createEmployee` body: `{ name, email, department }` → `{ success: true, employeeId }`
- POST `/deleteEmployee` body: `{ employeeId }` → `{ success: true }`

Employee:
- POST `/loginEmail` body: `{ email }` → `{ accessCode }`
- POST `/validateAccessCode` body: `{ accessCode, email }` → `{ success: true }`

New Employee endpoints:
- GET `/getAllEmployees` query: `page?`, `limit?`, `search?`, `department?`
  - Response: `{ page, limit, total, items }`
- PUT `/updateEmployee` body: `{ employeeId, name?, email?, department? }`
  - Response: `{ success: true }`

Notes:
- Access codes are 6 digits and expire after 10 minutes.
- Emails are logged to console in this demo.