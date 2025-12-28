# 📄 AI-Powered Resume Analyzer

A full-stack web application where users can upload resumes (PDF/DOCX), the content is parsed, analyzed using OpenAI, and the results are stored in MongoDB.

This project contains two main folders:
- server → Node.js + Express backend
- client → React + Vite frontend (Material-UI)

---------------------------------------
✅ Requirements
---------------------------------------
- Node.js v16 or higher
- npm
- MongoDB (local or remote connection string)
- OpenAI API key

---------------------------------------
⚡ Quickstart — Run Locally
---------------------------------------

1️⃣ Backend Setup

cd "AI-Powered Resume Analyzer/server"
cp .env.example .env
# open .env and set:
# OPENAI_API_KEY=your_key
# MONGODB_URI=your_connection_string
npm install
npm run dev

2️⃣ Frontend Setup

cd "AI-Powered Resume Analyzer/client"
# create a .env if backend is on custom URL:
# REACT_APP_API_URL=http://localhost:5000
npm install
npm run dev

---------------------------------------
🧩 Features Implemented
---------------------------------------
- JWT-based authentication (login/register)
- Resume upload with Multer
- PDF and DOCX parsing (pdf-parse + mammoth)
- Integration with OpenAI API for resume analysis
- MongoDB models for:
  - User
  - Resume
  - Analysis
- React UI for uploading resumes and viewing results
- Basic unit tests for auth and upload routes

---------------------------------------
🛠️ API Endpoints (Server)
---------------------------------------
POST /api/auth/register
POST /api/auth/login
POST /api/resumes/upload     (multipart/form-data, field: resume)
GET  /api/resumes            (protected)
GET  /api/resumes/:id/file   (protected)

---------------------------------------
🧪 Running Tests (Backend)
---------------------------------------
Tests use Jest + supertest and require MongoDB running.

cd server
npm test

---------------------------------------
📂 File Upload Notes
---------------------------------------
- uploaded files are stored in: server/uploads
- ensure this folder has write permission
- do not commit real resumes to GitHub

---------------------------------------
🔐 Environment Variables
---------------------------------------
Copy template:

cp .env.example .env

Then set values:

OPENAI_API_KEY=your_key
MONGODB_URI=your_mongodb_uri
JWT_SECRET=any_random_string

(Optional)
ALLOW_ANON_UPLOADS=true

---------------------------------------
⚠️ Limitations
---------------------------------------
- npm install could not be executed in the remote session
- You must run installation locally
- OpenAI API key required for real analysis

---------------------------------------
🎯 Summary
---------------------------------------
This project lets users:
✔ upload resumes
✔ parse and analyze content using AI
✔ securely store results in MongoDB
✔ access everything through a simple web UI
