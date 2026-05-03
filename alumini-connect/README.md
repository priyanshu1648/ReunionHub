# Alumni Connect Portal

A simple full-stack web app where students can connect with alumni, send networking requests, and explore opportunities shared by alumni.


## Contributors:

- Priyanshu Birkhani
- Riya Garjola
- Sagar Bhatiya
- Manav Sati

## Tech Stack

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Auth: JWT

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root and copy values from `.env.example`.

3. Make sure MongoDB is running locally.

4. Start the backend:

```bash
npm start
```

5. Open `frontend/index.html` in your browser.

## API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/alumni`
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `POST /api/jobs`
- `POST /api/connections/:alumniId`
- `GET /api/connections/received`
- `GET /api/connections/sent`
- `PATCH /api/connections/:id`

## Notes

- Alumni can create profiles, receive student requests, and post jobs.
- Students can browse alumni profiles, send connection requests, and explore jobs.
- JWT token is stored in `localStorage`.
