# EduPulse — Student Feedback & Evaluation System
### FSAD-PS33 | SDP Review 1

---

## 🚀 How to Run This Project

### Step 1 — Install Node.js
Download from: https://nodejs.org (click "LTS" version)
Install it. Open Command Prompt and check: `node -v`

### Step 2 — Extract this ZIP
Extract the `edupulse` folder to your Desktop or anywhere you like.

### Step 3 — Open Terminal in the project folder
- Open the `edupulse` folder
- Right-click inside the folder → "Open in Terminal" (or "Open PowerShell here")

### Step 4 — Install dependencies
```
npm install
```
Wait for it to finish (downloads React, Router etc.)

### Step 5 — Start the development server
```
npm run dev
```

### Step 6 — Open in browser
Go to: **http://localhost:5173**

Your app is running! 🎉

---

## 📁 Project Structure
```
edupulse/
├── src/
│   ├── App.jsx              ← All routes defined here
│   ├── index.css            ← All global styles
│   ├── main.jsx             ← Entry point
│   ├── components/
│   │   ├── Navbar.jsx       ← Top navigation bar
│   │   ├── Sidebar.jsx      ← Left sidebar (admin)
│   │   └── Toast.jsx        ← Notification popup
│   └── pages/
│       ├── Login.jsx                ← /login
│       ├── AdminDashboard.jsx       ← /admin/dashboard
│       ├── AdminForms.jsx           ← /admin/forms
│       ├── AdminCreateForm.jsx      ← /admin/forms/create
│       ├── AdminAnalytics.jsx       ← /admin/analytics
│       ├── StudentDashboard.jsx     ← /student/dashboard
│       ├── StudentFeedback.jsx      ← /student/feedback
│       └── StudentResults.jsx       ← /student/results
```

## 🌐 Deploy to Vercel (Free)
1. Push this code to GitHub
2. Go to vercel.com → Import your repo
3. Click Deploy → Done! You get a public URL.

---

## 👥 Team Task Division (for Git commits)
- Person A: Login + AdminDashboard + AdminForms
- Person B: AdminCreateForm + AdminAnalytics
- Person C: StudentDashboard + StudentFeedback + StudentResults
