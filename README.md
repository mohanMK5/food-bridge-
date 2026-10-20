# Food Bridge - Food Donation Platform

Food Bridge connects food donors (restaurants, stores, individuals) with NGOs so extra food does not get wasted.

- Donors post food donations.
- NGOs browse, search and accept them.

## Tech used

- Frontend: React (Vite) + normal CSS
- Backend: Node.js + Express
- Database: MySQL

## Folder structure

```
food-bridge/
  database.sql        -> creates the database and tables
  backend/            -> Express API
    server.js
    db.js
    routes/auth.js
    routes/donations.js
    middleware/auth.js
  frontend/           -> React app
    src/
      App.jsx
      api.js
      styles.css
      components/Navbar.jsx
      pages/Home.jsx, Auth.jsx, DonorDashboard.jsx, NgoDashboard.jsx
```

## How to run

### 1. Database

Make sure MySQL is installed, then run:

```
mysql -u root -p < database.sql
```

### 2. Backend

```
cd backend
npm install
```

Copy `.env.example` to `.env` and put your MySQL password in it. Then:

```
npm start
```

The API runs on http://localhost:5000

### 3. Frontend

Open a new terminal:

```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in the browser.

## API list

| Method | URL | Who | What it does |
| ------ | --- | --- | ------------ |
| POST | /api/auth/register | everyone | create account |
| POST | /api/auth/login | everyone | login |
| GET | /api/donations?search= | NGO | see all donations |
| GET | /api/donations/mine | donor | see my donations |
| POST | /api/donations | donor | add a donation |
| PUT | /api/donations/:id/accept | NGO | accept a donation |
| DELETE | /api/donations/:id | donor | delete my pending donation |

## Database tables

- users: id, name, email, password (hashed), role (donor / ngo)
- donations: id, donor_id, food_name, quantity, expiry_date, location, contact, description, status (pending / accepted), accepted_by
