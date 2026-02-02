# Document Access Control Backend

This backend implements the assignment:
- JWT-based authentication
- Role-based authorization (USER, ADMIN)
- MongoDB persistence via Mongoose
- Document upload, request, review, and download with approval enforcement

## Setup

1. Create a `.env` file and set `MONGO_URI`, `ADMIN_CODE`, `JWT_SECRET`, and `EMAIL_USER`/`EMAIL_PASS` if needed.
2. Install dependencies: `npm install`
3. Start server: `npm run dev` (requires `nodemon`) or `npm start`

## API Endpoints (summary)
- POST /api/auth/register
- POST /api/auth/login
- GET /api/documents             (authenticated)
- POST /api/documents            (ADMIN only, form-data with `file`)
- GET /api/documents/:id/download (download; USER requires approved access)
- POST /api/access/request/:id  (USER)
- GET /api/access               (USER = own requests; ADMIN = all requests)
- POST /api/access/review/:id   (ADMIN; body { action: 'APPROVE'|'REJECT' })

Environment variables (required):
- `PORT` (default 8080)
- `MONGO_URI` (MongoDB connection string)
- `ADMIN_CODE` (shared secret required to register an ADMIN account)
- `JWT_SECRET`

Business rule enforced: only approved access requests allow a USER to download a document.
