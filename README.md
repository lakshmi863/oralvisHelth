
demo vedio link ( https://drive.google.com/file/d/1QSyl-p17OB92QH6zyOrLAaioGk03le7G/view?usp=drive_link )
🦷 OralVis Health

A full-stack dental health management platform with React frontend and Express + SQLite backend, deployed on Render.

🚀 Features

👩‍⚕️ User authentication (JWT-based login & register)

📊 Manage and view oral health scans

🔒 Role-based access (Dentist/Admin/User)

🌐 Fully deployed (Frontend + Backend) on Render

📱 Built with React, Node.js, Express, SQLite

🛠️ Tech Stack

Frontend: React + Axios + Tailwind

Backend: Node.js + Express + SQLite + bcryptjs + JWT

Database: SQLite (file-based)

Deployment: Render (Web Service + Static Site)

⚙️ Setup
1️⃣ Clone repository
git clone https://github.com/your-username/oralvisHelth.git
cd oralvisHelth

2️⃣ Backend setup
cd Backend
npm install


Create a .env file inside Backend/:

PORT=4000
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:5173


Run locally:

npm start


Backend will be live at:
👉 http://localhost:4000

3️⃣ Frontend setup
cd Frontend
npm install


Create a .env file inside Frontend/:

REACT_APP_API_URL=http://localhost:4000/api


Run locally:

npm start


Frontend will be live at:
👉 http://localhost:5173

🌍 Deployment (Render)
Backend (Web Service)

Connect Render to this repo.

Root Directory: Backend/

Build Command:

npm install && npm rebuild sqlite3 --build-from-source


Start Command:

node index.js


Add environment variables in Render Dashboard:

PORT=10000 (Render will override)

JWT_SECRET=your_jwt_secret

CLIENT_ORIGIN=https://your-frontend.onrender.com

Frontend (Static Site)

Root Directory: Frontend/

Build Command:

npm install && npm run build


Publish Directory:

build


Add environment variable in Render Dashboard:

REACT_APP_API_URL=https://your-backend.onrender.com/api

🧪 Default Admin User

When backend runs, it seeds an admin user:

Email: vasu@gmail.com

Password: vasu

📂 Project Structure
oralvisHelth/
│
├── Backend/              # Express + SQLite backend
│   ├── config/           # DB config
│   ├── controllers/      # Auth & Scan controllers
│   ├── models/           # DB models
│   ├── routes/           # API routes
│   ├── index.js          # Entry point
│   └── .env.example
│
├── Frontend/             # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api.js        # Axios setup
│   └── .env.example
│
└── README.md

✅ API Endpoints
Auth

POST /api/auth/login – login

POST /api/auth/register – register

Scans

GET /api/scans – fetch scans

POST /api/scans – upload new scan

📌 Notes

Always update .env values in Render Dashboard, not in code.

If login/register fails on deployment → check:

Backend URL includes /api

CORS allows frontend domain
