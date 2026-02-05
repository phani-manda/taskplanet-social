# TaskPlanet Social Feed

A full-stack social feed application inspired by the TaskPlanet app. Users can create accounts, share posts with text/images, like, and comment on content.

![Social Feed](https://via.placeholder.com/800x400?text=TaskPlanet+Social+Feed)

## 🚀 Features

- **User Authentication**: Signup and login with email/password
- **Create Posts**: Share text, images, or both
- **Social Interactions**: Like and comment on posts
- **Real-time Updates**: Instant UI updates for likes/comments
- **Feed Filters**: All Posts, For You, Most Liked, Most Commented, Most Shared
- **Search**: Search through posts
- **Responsive Design**: Works on desktop and mobile

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React.js |
| Backend | Node.js + Express |
| Database | MongoDB (2 collections: Users, Posts) |
| Styling | Material-UI (MUI) |

## 📁 Project Structure

```
ASSIGNMENT III/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── posts.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/          # Image uploads directory
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── BottomNav.js
    │   │   ├── CreatePost.js
    │   │   ├── PostCard.js
    │   │   └── FilterTabs.js
    │   ├── pages/
    │   │   ├── SocialFeed.js
    │   │   ├── Login.js
    │   │   └── Signup.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── .env.example
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/taskplanet-social.git
cd taskplanet-social
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials:
# PORT=5000
# MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/taskplanet-social
# JWT_SECRET=your-super-secret-jwt-key-here

# Start the server
npm run dev
```

### 3. Frontend Setup

```bash
# Open new terminal, navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file (optional for local development)
cp .env.example .env

# Start the React app
npm start
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🗄️ Database Schema

### Users Collection
```javascript
{
  firstName: String,
  lastName: String,
  username: String (unique, auto-generated),
  email: String (unique),
  password: String (hashed),
  avatar: String,
  coins: Number (default: 50),
  balance: Number (default: 0),
  followers: [ObjectId],
  following: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Posts Collection
```javascript
{
  user: ObjectId (ref: User),
  text: String,
  image: String,
  likes: [ObjectId],
  comments: [{
    user: ObjectId,
    text: String,
    createdAt: Date
  }],
  shares: Number,
  isPromotion: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/follow/:userId` | Follow/unfollow user |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts |
| GET | `/api/posts/search?q=query` | Search posts |
| POST | `/api/posts` | Create new post |
| PUT | `/api/posts/:postId/like` | Like/unlike post |
| POST | `/api/posts/:postId/comment` | Add comment |
| GET | `/api/posts/:postId/comments` | Get comments |
| DELETE | `/api/posts/:postId` | Delete post |

## 🚀 Deployment

### Backend Deployment (Render)

1. Create account at [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT` (set to 10000)
6. Deploy!

### Frontend Deployment (Vercel)

1. Create account at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App
4. Add environment variable:
   - `REACT_APP_API_URL`: Your Render backend URL
5. Deploy!

### Database Setup (MongoDB Atlas)

1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free M0 cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for all)
5. Get connection string and add to backend `.env`

## 📱 Screenshots

The UI is inspired by TaskPlanet's Social page featuring:
- Clean header with coins and balance display
- Search bar with user avatar
- Create Post card with text input and image upload
- Filter tabs for post sorting
- Post cards with user info, content, and interaction buttons
- Bottom navigation bar with Social tab highlighted

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes
- Input validation
- CORS configuration

## 📝 License

This project is created for educational purposes.

---

**Note**: Make sure to update the `.env` files with your actual credentials before deployment. Never commit sensitive information to version control.
