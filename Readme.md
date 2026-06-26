# Project Name

## Overview
This project consists of:

- **Frontend:** React + Vite
- **Backend:** Python

Make sure the frontend and backend URLs match so the application works correctly.

---

## Prerequisites

- Node.js (v18+ recommended)
- Python 3.10+
- Pip package manager

---

## Environment Variables

Create a `.env` file in the **backend** folder:

```env
GEMINI_API_KEY=your_api_key_here
Replace your_api_key_here with your actual Gemini API key.

Step-by-Step Instructions
1. Frontend
Open a terminal in the root folder and run:


cd frontend
npm install       # Install dependencies
npm run dev       # Start React + Vite development server
Note: Vite will show a local URL, e.g., http://localhost:5173. Remember this for connecting with the backend.

2. Backend
Open a new terminal window and run:

bash
Copy code
cd backend
pip install -r requirements.txt   # Install Python dependencies (if not already done)
python .\main.py                  # Start backend server
Ensure the backend is running on the expected URL and port. Update the frontend if the backend URL differs.
