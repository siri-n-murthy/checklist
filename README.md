# � Checklist Application

A modern, full-stack productivity dashboard with authentication, light/dark themes, daily task management, and advanced analytics.

## 🌟 Features

### 🔐 Authentication
- **Signup/Login System** - Create and manage user accounts
- **MongoDB Integration** - Secure password hashing with bcryptjs
- **JWT Tokens** - Secure session management
- **Email-based Profiles** - Name and email automatically loaded from login

### 🎨 Theming
- **Light & Dark Modes** - Toggle between warm amber and dark slate themes
- **Persistent Preferences** - Theme choice saved to localStorage
- **Smooth Transitions** - Beautiful theme switching animation

### 📅 Calendar & Task Management
- **Daily Tasks** - Add, edit, and delete tasks for any day
- **Smart Task Locking** - Can only mark tasks complete on today or past dates (prevents bias in analytics)
- **Future Planning** - Add tasks to future dates for planning ahead
- **Task Customization** - Choose from 8 emojis and 6 colors per task
- **Real-time Completion Tracking** - See daily completion percentage

### 👤 User Profile
- **Auto-populated Data** - Name and email from login
- **Editable Fields** - Location, title, bio
- **Clean Card Layout** - Beautiful profile display

### 📊 Analytics Dashboard
- **7-Day Metrics** - Track completion trends
- **Streak Counter** - Monitor current streak
- **Overall Statistics** - Completion rates and achievements
- **Visual Charts** - Bar charts with daily breakdowns

### 🎯 Weekly Goals
- **Target Setting** - Set completion percentage, tasks per day, streak goals
- **Progress Notes** - Add weekly notes and reflections

### 🏆 Achievements
- **Badge System** - 10 different achievement badges
- **Rarity Levels** - Common to Legendary tiers
- **Unlock Conditions** - Based on user activity and milestones

## 🚀 Quick Start

### Windows Users
```bash
# Double-click QUICKSTART.bat
# Or run in Command Prompt:
QUICKSTART.bat
```

### Mac/Linux Users
```bash
bash QUICKSTART.sh
```

### Manual Setup

**Terminal 1 - Frontend:**
```bash
cd d:\checklist
npm install
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd d:\checklist\server
npm install
npm run dev
```

Then open: **http://localhost:5173**

---

## 🌐 Deploy to Vercel (Recommended)

Ready to go live? We've configured this app for easy Vercel deployment!

### Quick Deploy (5 minutes)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy frontend:**
   ```bash
   vercel --prod
   ```

3. **Deploy backend:**
   ```bash
   cd server
   vercel --prod
   ```

4. **Set environment variables** (in Vercel Dashboard):
   - Frontend: `VITE_API_URL` = your backend URL
   - Backend: `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGINS`

5. **Done!** Your app is live.

📚 **Detailed Guide:** See [VERCEL_QUICK_START.md](VERCEL_QUICK_START.md)

🛠️ **Helper Tool:**
```bash
node deploy-helper.js secret    # Generate JWT secret
node deploy-helper.js check     # Verify environment files
node deploy-helper.js checklist # See deployment checklist
```

---

## 📋 Setup Requirements

### Frontend
- Node.js 14+
- npm or yarn
- Modern browser (Chrome, Firefox, Safari, Edge)

### Backend
- Node.js 14+
- MongoDB (local or Atlas)
- 512MB RAM minimum

### Environment Variables

**Frontend** - No setup needed (uses backend at http://localhost:5000)

**Backend** - Configure `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/checklist
JWT_SECRET=change_this_to_a_strong_secret_in_production
PORT=5000
```

---

## 📁 Project Structure

```
checklist/
├── src/
│   ├── context/
│   │   ├── ThemeContext.jsx
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── UserProfile.jsx
│   │   ├── Analytics.jsx
│   │   ├── CalendarView.jsx
│   │   ├── WeeklyGoals.jsx
│   │   └── Achievements.jsx
│   ├── App.jsx
│   └── main.jsx
├── server/
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── package.json
├── vite.config.js
├── tailwind.config.js
└── SETUP_GUIDE.md
```

---

## 🎨 Color Scheme

### Dark Mode (Default)
- **Primary**: Amber-600 (#D97706)
- **Background**: Slate-900 (#0F172A)
- **Cards**: Slate-800 (#1E293B)
- **Text**: White for headings, Slate-300 for secondary

### Light Mode
- **Primary**: Amber-500 (#F59E0B)
- **Background**: Amber-50 (#FFFBEB)
- **Cards**: White with amber borders
- **Text**: Slate-900 for headings, Slate-600 for secondary

---

## 🔗 API Endpoints

### Authentication
```
POST /api/auth/signup
POST /api/auth/login
GET /api/health
```

### Request/Response Examples

**Signup:**
```json
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "success": true,
  "token": "jwt_token_here",
  "userId": "mongo_id",
  "email": "john@example.com",
  "name": "John Doe"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "token": "jwt_token_here",
  "userId": "mongo_id",
  "email": "john@example.com",
  "name": "John Doe"
}
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Context** - State management

### Backend
- **Express.js** - REST API framework
- **Node.js** - Runtime
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcryptjs** - Password hashing
- **JWT** - Authentication
- **CORS** - Cross-origin requests

---

## 🔐 Security

- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ JWT tokens for session management
- ✅ CORS enabled for authorized domains only
- ✅ Input validation on both frontend and backend
- ✅ Email uniqueness enforced
- ✅ XSS protection via React's built-in escaping

**Note:** Change JWT_SECRET in production!

---

## 📊 Data Model

### User (MongoDB)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  location: String,
  title: String,
  bio: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Local Storage (Frontend)
- `user` - Current logged-in user
- `theme` - 'dark' or 'light'
- `dashboardData` - Daily task completions
- `checklistTasks` - Task definitions
- `userProfile` - Additional profile info
- `weeklyGoals` - Weekly goal settings

---

## 🐛 Troubleshooting

### Backend Connection Failed
```
❌ Error: Connection refused at localhost:5000
✅ Solution: Ensure backend is running: npm run dev (in server folder)
```

### MongoDB Connection Error
```
❌ Error: connect ECONNREFUSED 127.0.0.1:27017
✅ Solution: 
   1. Verify MongoDB is running
   2. Check MONGODB_URI in .env
   3. Use MongoDB Atlas: Update connection string
```

### Login/Signup Not Working
```
❌ Error: POST /api/auth/login failed
✅ Solution: 
   1. Check backend is running
   2. Verify MongoDB is accessible
   3. Check browser console for specific error
   4. Clear localStorage and try again
```

### Theme Not Persisting
```
❌ Dark mode reverts on page refresh
✅ Solution: Check localStorage not full (storage quota)
```

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set start command: `npm run preview`
4. Update API endpoint in code

### Backend (Render/Railway/Heroku)
1. Push to GitHub
2. Connect deployment service
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create free tier cluster
2. Update MONGODB_URI with connection string
3. Add IP whitelist for server

---

## 📈 Future Enhancements

- [ ] Email notifications
- [ ] Data export (PDF/CSV)
- [ ] Mobile app (React Native)
- [ ] Dark mode for login pages
- [ ] Password reset flow
- [ ] Email verification
- [ ] Team/shared tasks
- [ ] Habit tracking
- [ ] Daily streaks UI
- [ ] Cloud sync

---

## 📝 License

MIT License - Feel free to use and modify!

---

## 👨‍💻 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 💬 Support

For issues or questions:
1. Check SETUP_GUIDE.md
2. Review Project Structure section
3. Check browser console for errors
4. Verify backend is running: `http://localhost:5000/api/health`

---

**Happy productivity! 🎯** 

Remember: Consistency is key. Use this dashboard daily to build better habits! ✨
