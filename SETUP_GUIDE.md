# Checklist Application - Full Setup Guide

## Features Implemented
✅ **Authentication System** - Login & Signup with MongoDB
✅ **Light & Dark Theme** - Toggle between themes, persisted to localStorage
✅ **User Profile** - Profile info fetched from login email/name, with edit functionality
✅ **Calendar with Daily Tasks** - Add tasks to any day, check them off only on past/today
✅ **Analytics Dashboard** - Track completion, streaks, and achievements
✅ **Weekly Goals & Recurring Tasks** - Set goals and create recurring tasks

---

## Frontend Setup (Already Complete)

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Install Frontend Dependencies
```bash
cd d:\checklist
npm install
```

### Start Frontend Dev Server
```bash
npm run dev
```
Frontend will run on: **http://localhost:5173**

---

## Backend Setup (MongoDB + Express)

### Prerequisites
- **MongoDB** - Local or Atlas cloud database
- Node.js installed

### Step 1: Install Backend Dependencies
```bash
cd d:\checklist\server
npm install
```

### Step 2: Configure MongoDB

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Default connection: `mongodb://localhost:27017/checklist`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/checklist`
4. Update in `.env` file

### Step 3: Update Environment Variables
Edit `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/checklist
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
```

### Step 4: Start Backend Server
```bash
# From d:\checklist\server
npm run dev
```
Backend will run on: **http://localhost:5000**

---

## How to Use

### 1. Create Account
- Go to signup page
- Enter name, email, and password (6+ characters)
- Account created automatically with MongoDB

### 2. Login
- Use your email and password to log in
- Profile name and email fetched from database

### 3. Theme Toggle
- Click sun/moon icon in top right
- Switch between dark and light modes
- Auto-saved preference

### 4. Profile Management
- Click "Profile" tab
- Click "Edit" button
- Update location, title, bio
- Changes saved to localStorage (and can be extended to MongoDB)

### 5. Calendar & Tasks
- Click "Calendar" tab
- Click any day to add tasks
- Add tasks with custom colors and icons
- Check off tasks (only available on today/past dates)
- Delete tasks with trash icon

### 6. Logout
- Click "Logout" button (top right)
- All local data cleared
- Session ended

---

## Project Structure

### Frontend (src/)
```
src/
├── context/
│   ├── ThemeContext.jsx      # Light/Dark theme management
│   └── AuthContext.jsx       # User authentication state
├── pages/
│   ├── Login.jsx             # Login page
│   └── Signup.jsx            # Signup page
├── components/
│   ├── Dashboard.jsx         # Main dashboard
│   ├── UserProfile.jsx       # Profile with edit
│   ├── Analytics.jsx         # Analytics charts
│   ├── WeeklyGoals.jsx       # Goal tracker
│   ├── CalendarView.jsx      # Calendar with tasks
│   └── Achievements.jsx      # Achievements badges
├── App.jsx                   # Main app wrapper
└── main.jsx                  # Entry point with providers
```

### Backend (server/)
```
server/
├── models/
│   └── User.js              # MongoDB User schema
├── routes/
│   └── auth.js              # Auth endpoints (signup/login)
├── server.js                # Express server
├── .env                     # Environment variables
└── package.json
```

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login to account
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

Response includes: `token`, `userId`, `email`, `name`

---

## Data Storage

### Frontend (localStorage)
- `user` - Current logged-in user
- `theme` - Light/Dark mode preference
- `dashboardData` - Checklist completion state
- `checklistTasks` - List of tasks
- `userProfile` - Profile info
- `weeklyGoals` - Weekly goals

### Backend (MongoDB)
- `User` collection - User accounts with hashed passwords

---

## Color Scheme

### Light Mode
- Background: Soft amber and yellow tones
- Buttons: Amber/Gold (#F59E0B)
- Text: Dark slate-900

### Dark Mode
- Background: Slate-900 gradient
- Buttons: Amber-600
- Text: White

---

## Troubleshooting

### Backend won't connect
- Ensure MongoDB is running
- Check `.env` file for correct MONGODB_URI
- Test with: `http://localhost:5000/api/health`

### Login fails
- Clear browser cache and localStorage
- Ensure backend server is running
- Check network tab in DevTools for errors

### Theme not changing
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check localStorage in DevTools

### Styles not showing
- Clear node_modules and reinstall: `npm install`
- Ensure Tailwind CSS is processing

---

## Next Steps

1. **Deploy Backend**: Use Render, Heroku, or Railway
2. **Connect to MongoDB Atlas**: Update MONGODB_URI with cloud database
3. **Add Email Verification**: Implement email verification on signup
4. **Add Password Reset**: Implement forgot password functionality
5. **Sync Profile to Database**: Store profile updates in MongoDB
6. **Add Export Features**: Export data as PDF/CSV
7. **Mobile App**: Convert to React Native

---

## Support

For issues or questions, check:
- Browser console for errors
- Network tab in DevTools for API calls
- Backend logs in terminal
- MongoDB Atlas dashboard for database issues

Happy coding! 🚀
