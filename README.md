# AI-Powered Resume Analyzer

A full-stack prototype that accepts PDF / DOCX / TXT resumes, extracts text, and returns an AI-generated analysis: summary, detected skills, gaps, resume suggestions, and a career development plan. The app runs locally without a database or OpenAI key using a deterministic fallback analyzer so it is easy to test.

Frontend: React + Vite + Material-UI  
Backend: Node.js + Express + Multer  
Text extraction: pdf-parse, mammoth  
AI: OpenAI (optional). If OPENAI_API_KEY is not set the server uses a built-in fallback generator.  
Persistence: Optional MongoDB (via Mongoose). By default the app runs without persistence.

Add screenshots to `assets/screenshots/` and reference them here.

## Features

- Upload PDF / DOCX / TXT resumes
- Server-side text extraction
- Structured AI analysis: summary, skills, gaps, suggestions, career path
- Responsive React UI with copy and download actions
- Optional OpenAI API integration
- Optional MongoDB persistence (disabled by default)

## Quick start (dev)

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- Optional: Docker (for local MongoDB)

### 1. Start the backend

Open a terminal:

cd server
npm install

# run server in fallback/no-DB mode (no OpenAI key required)
# the server listens on PORT (default 5001)
PORT=5001 npm start

### 2. Start the frontend (dev)

Open another terminal:

cd client
npm install
npm run dev

Vite will print a local URL, e.g. http://localhost:5177. Open that URL to use the polished React UI.  
Alternatively, for quick tests, you can visit the backend’s minimal uploader at:

http://localhost:5001/api/analyze

## Environment variables

Create a `.env` file (do not commit) or export env vars directly. Example `.env.example`:

PORT=5001
OPENAI_API_KEY=sk-...
MONGODB_URI=
AUTH_TOKEN=

OPENAI_API_KEY — optional. When set, the backend will send parsed text to OpenAI for richer analysis.  
MONGODB_URI — optional. When set and when mongoose is installed, uploads and analyses will be persisted.  
AUTH_TOKEN — optional. If set, endpoints require `x-api-key` header with this token.

Security note: never commit real keys to Git history. Use `.gitignore` to exclude `.env`.

## Enable OpenAI (real AI)

If you want GPT-powered analysis:

1. Obtain an API key from https://platform.openai.com/account/api-keys
2. Set it in your environment or `.env`:

export OPENAI_API_KEY="sk-..."

3. Restart the server:

cd server
npm start

The server will call the OpenAI Chat API when OPENAI_API_KEY is present.

## Optional MongoDB persistence

The project is designed to run without DB. If you want persistence:

1. Install mongoose in `server`:

cd server
npm install mongoose

2. Start MongoDB locally (example using Docker):

docker run -d -p 27017:27017 --name resume-mongo mongo:6

3. Set MONGODB_URI and restart the server:

export MONGODB_URI="mongodb://localhost:27017/resume_analyzer"
npm start

When MONGODB_URI is set and mongoose is available, uploads and analyses will be saved.

## API

### POST /api/analyze

Content-Type: multipart/form-data  
Field name: `file`

Returns JSON similar to:

{
  "parsedText": "extracted resume text...",
  "ai": {
    "summary": "...",
    "skills": ["JavaScript", "React"],
    "gaps": ["no backend project"],
    "suggestions": ["add API project"],
    "careerPath": ["junior developer", "frontend developer"]
  }
}

You can test using curl:

curl -X POST -F "file=@resume.pdf" http://localhost:5001/api/analyze

## Serve the frontend from the backend (production build)

To serve a bundled React frontend from the backend:

1. Build the frontend

cd client
npm run build

2. Copy the generated `dist` folder into `server/public`

3. Configure Express to serve static files from `public`

This way a single server serves both API and UI.

## Tests

Backend tests use Jest and Supertest and test the analyze endpoint.

cd server
npm test

## Files of interest

- server/index.js — Express server entry point
- server/routes/analyze.js — analyze API endpoint
- server/services/analyzeLocal.js — fallback local analyzer
- server/services/analyzeOpenAI.js — OpenAI powered analyzer
- client/src/pages/UploadPage.jsx — main upload page UI

## Contributing

Pull requests are welcome. 
