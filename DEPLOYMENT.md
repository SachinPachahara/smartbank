# 🚀 SmartBank Deployment Guide: Render (Backend) & Vercel (Frontend)

This guide walks you through deploying **SmartBank** completely free using **Render** for the Express/Node.js API and **Vercel** for the Vite/React frontend.

---

## 📋 Prerequisites
1. **GitHub Repository**: Pushed and up-to-date with your latest code (`main` branch).
2. **MongoDB Atlas**: Cluster running with Network Access set to `0.0.0.0/0` (Allow Access from Anywhere).
3. **Render Account**: [render.com](https://render.com)
4. **Vercel Account**: [vercel.com](https://vercel.com)

---

## Part 1: Deploy Backend on Render

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** in the top right corner and select **Web Service**.
3. Under **Connect a repository**, select your GitHub repository: `smartbank` (or your repo name).
4. Fill in the service configuration:
   - **Name**: `smartbank-backend` (or any unique name you prefer)
   - **Region**: Choose closest to you (e.g., Singapore / Oregon / Frankfurt)
   - **Branch**: `main`
   - **Root Directory**: *(Leave empty or enter `./`)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` *(or `node Backend/server.js`)*
   - **Instance Type**: `Free`
5. Scroll down to **Environment Variables** and add the following:
   | Key | Value | Notes |
   |---|---|---|
   | `NODE_ENV` | `production` | Enables production optimizations |
   | `MONGO_URI` | `mongodb+srv://...` | Your full MongoDB Atlas connection string |
   | `JWT_SECRET` | `smartbank_secret_key_2025@cse` | Your JWT secret key |
   | `CORS_DOMAINS` | `https://your-frontend.vercel.app` | *(You can update this after Vercel gives you your URL)* |
6. Click **Create Web Service**.
7. Wait 2-3 minutes for the build to finish. Once live, Render will give you a public URL, for example:
   👉 `https://smartbank-backend-xxxx.onrender.com`
8. Test the backend by visiting:
   `https://smartbank-backend-xxxx.onrender.com/api/health`
   You should see: `{"status": "healthy", "environment": "production", ...}`

---

## Part 2: Deploy Frontend on Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository: `smartbank`.
4. Configure the Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and select **`Frontend`**.
   - **Build Command**: `npm run build` *(Vercel detects this automatically)*
   - **Output Directory**: `dist` *(Vercel detects this automatically)*
5. Open the **Environment Variables** section and add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://your-backend-name.onrender.com/api` |
   *(⚠️ Important: Ensure it ends with `/api` and has no trailing slash after `/api`)*
6. Click **Deploy**.
7. In ~60 seconds, Vercel will deploy your site and provide a live URL, for example:
   👉 `https://smartbank-xxxx.vercel.app`

---

## Part 3: Final Link (CORS sync)

1. Copy your new Vercel frontend URL (e.g. `https://smartbank-xxxx.vercel.app`).
2. Go back to your **Render Dashboard** -> Select `smartbank-backend` -> **Environment**.
3. In `CORS_DOMAINS`, add your Vercel URL:
   `https://smartbank-xxxx.vercel.app`
4. Click **Save Changes**. Render will automatically redeploy the backend with the new allowed origin.
*(Note: SmartBank's backend is pre-configured to automatically allow any `*.vercel.app` origin as well!)*

---

## 🔐 Admin Default Credentials
Once deployed, you can immediately log in as an administrator using the seeded credentials:
- **Admin Portal URL**: `https://your-frontend.vercel.app/admins/login`
- **Email**: `admin@smartbank.com`
- **Password**: `AdminPassword123!`
