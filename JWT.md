# Firebase JWT Authentication 

## 🎯 What You'll Learn
This guide shows you how to implement secure JWT authentication using Firebase in any React + Node.js project. No complex configurations - just copy, paste, and customize!

## 📋 Quick Start Checklist
- [ ] React frontend with Vite/Create React App
- [ ] Node.js/Express backend  
- [ ] Firebase project created
- [ ] Firebase service account key downloaded

---

## 🔥 Step 1: Firebase Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" 
3. Enable Authentication → Sign-in method → Email/Password
4. Go to Project Settings → Service Accounts → Generate new private key
5. Download the JSON file (keep it secure!)

### 1.2 Get Firebase Config
```javascript
// Your Firebase config (found in Project Settings → General)
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## 🖥️ Step 2: Backend Implementation (Node.js/Express)

### 2.1 Install Dependencies
```bash
npm install express cors dotenv mongodb firebase-admin
```

### 2.2 Basic Server Setup
```javascript
// server.js or index.js
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Load environment variables
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin (replace with your service account)
const serviceAccount = require("./path-to-your-firebase-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2.3 JWT Verification Middleware
```javascript
// Add this middleware to your server file
const verifyToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract token (format: "Bearer TOKEN")
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // Verify token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Add user info to request object
    req.user = decodedToken;
    
    // Continue to next middleware/route
    next();
    
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
```

### 2.4 Protected Routes Example
```javascript
// Public route (no authentication required)
app.get("/", (req, res) => {
  res.json({ message: "API is working!" });
});

// Protected route (authentication required)
app.get("/protected", verifyToken, (req, res) => {
  res.json({ 
    message: "This is protected data",
    user: req.user.email 
  });
});

// User data route
app.get("/users", verifyToken, async (req, res) => {
  try {
    // Your database logic here
    res.json({ users: ["user1", "user2"] });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
```

---

## ⚛️ Step 3: Frontend Implementation (React)

### 3.1 Install Dependencies
```bash
npm install firebase axios @tanstack/react-query
```

### 3.2 Firebase Configuration
```javascript
// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // Paste your Firebase config here
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
```

### 3.3 Authentication Context
```javascript
// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get fresh JWT token
  const getToken = async () => {
    if (user) {
      try {
        return await user.getIdToken();
      } catch (error) {
        console.error('Error getting token:', error);
        return null;
      }
    }
    return null;
  };

  // Auth functions
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    getToken,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
```

### 3.4 Axios Setup with Auto Token
```javascript
// src/api/axios.js
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000', // Your server URL
});

// This will be set from your components
let getTokenFunction = null;

// Function to set the token getter
export const setTokenGetter = (tokenGetter) => {
  getTokenFunction = tokenGetter;
};

// Request interceptor - automatically add token
api.interceptors.request.use(
  async (config) => {
    if (getTokenFunction) {
      const token = await getTokenFunction();
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - handle logout
      console.log('Authentication failed');
      // You can trigger logout here if needed
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3.5 Hook for API Calls
```javascript
// src/hooks/useApi.js
import { useEffect } from 'react';
import api, { setTokenGetter } from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

export const useApi = () => {
  const { getToken } = useAuth();

  // Set token getter for axios
  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);

  return api;
};
```

---

## 🎨 Step 4: Usage Examples

### 4.1 Login Component
```javascript
// src/components/Login.jsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      console.log('Logged in successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
```

### 4.2 Protected Component with API Call
```javascript
// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/protected');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email}!</p>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
```

### 4.3 App Component Setup
```javascript
// src/App.jsx
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const AppContent = () => {
  const { user } = useAuth();
  
  return (
    <div>
      {user ? <Dashboard /> : <Login />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
```

---

## 🔒 Step 5: Security Best Practices

### ✅ DO's
- Always verify tokens on the server side
- Use HTTPS in production
- Store Firebase service account key securely
- Handle token expiration gracefully
- Use environment variables for sensitive data

### ❌ DON'Ts
- Never store JWT tokens in localStorage
- Don't expose Firebase service account key
- Don't skip token verification on protected routes
- Don't hardcode API URLs or keys

---

## 🐛 Step 6: Common Issues & Solutions

### Issue: "Unauthorized Access"
**Problem**: Token not being sent
**Solution**: Check if Authorization header is properly set
```javascript
// Debug: Check if token is being sent
console.log('Token:', await getToken());
```

### Issue: "Invalid Token"
**Problem**: Token verification failing
**Solution**: 
1. Check Firebase project configuration
2. Verify service account key is correct
3. Ensure token format is `Bearer <token>`

### Issue: CORS Errors
**Problem**: Cross-origin requests blocked
**Solution**: Add CORS configuration to server
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URLs
  credentials: true
}));
```

---

## 🚀 Step 7: Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

---

## ✨ Complete Implementation Summary

### What This Guide Gives You:
1. **Secure Authentication**: Firebase handles user management
2. **Automatic Token Handling**: Tokens automatically attached to requests
3. **Protected Routes**: Server-side verification for all protected endpoints
4. **Error Handling**: Graceful handling of auth failures
5. **Production Ready**: Best practices and security considerations

### File Structure:
```
project/
├── backend/
│   ├── server.js
│   ├── firebase-key.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── contexts/AuthContext.jsx
    │   ├── hooks/useApi.js
    │   ├── api/axios.js
    │   ├── firebase/config.js
    │   ├── components/Login.jsx
    │   ├── components/Dashboard.jsx
    │   └── App.jsx
    └── .env
```

### Key Benefits:
- 🔐 **Secure**: Firebase handles all security aspects
- 🚀 **Fast Setup**: Copy-paste implementation 
- 🔧 **Flexible**: Easy to customize for any project
- 📱 **Universal**: Works with any React + Node.js app
- 🛡️ **Production Ready**: Includes best practices and error handling

**🎉 You now have a complete, secure JWT authentication system that you can use in any project!**