# SpendWise Deployment Guide

This repository contains two main parts:
1. `backend_service/backend`: The FastAPI backend.
2. `frontend`: The React frontend.

## 1. Backend Deployment (Render)

1. **Push to GitHub**: Ensure this code is in a GitHub repository.
2. **Create New Web Service**: In Render dashboard, select "New Web Service" and connect your repo.
3. **Settings**:
   - **Root Directory**: `backend_service/backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables**:
   Add the following environment variables in Render:
   - `MONGO_URI`: Your MongoDB Atlas Connection String
   - `DB_NAME`: `fingenius` (or your preferred name)
   - `GEMINI_API_KEY`: Your Google Gemini API Key
   - `ALLOWED_ORIGINS`: `https://your-frontend-app.vercel.app` (Add frontend URL after deploying frontend)

## 2. Frontend Deployment (Vercel)

1. **Install Vercel CLI** (Optional, or use dashboard): `npm i -g vercel`
2. **Deploy**:
   Run `vercel` inside the `frontend` folder or connect your repo to Vercel.
3. **Environment Variables**:
   - Go to Project Settings -> Environment Variables.
   - Add `VITE_API_URL` = `https://your-backend-app.onrender.com` (The URL providing by Render).
4. **Redeploy**: If you added env vars after deploy, redeploy to apply changes.

## 3. Post-Deployment Verification
- Open the Frontend URL.
- Try to Login/Register.
- Check if Dashboard loads data from Backend (Inspect Network tab).
- If CORS errors appear, ensure `ALLOWED_ORIGINS` in Backend includes the Frontend URL.
