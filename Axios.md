# Complete Axios Implementation Guide for React

## 📋 Overview
This document provides a **complete step-by-step guide** for implementing Axios in React applications using professional best practices. Follow this guide to set up a scalable, maintainable HTTP client that can be used across any React project.

## 🎯 What You'll Learn
- How to create a custom Axios instance with React hooks
- Professional API integration patterns
- Error handling and performance optimization techniques
- Integration with popular React libraries

## 🔧 Setup & Installation

### Step 1: Install Axios
```bash
npm install axios
```

### Step 2: Create Project Structure
```
src/
├── hooks/
│   └── useAxiosSecure.js    # Custom Axios hook
├── components/
├── pages/
└── contexts/
```

### Step 3: Environment Setup
Create `.env` file in your project root:
```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🏗️ Step-by-Step Implementation

### Step 1: Create Custom Axios Hook

Create file: `src/hooks/useAxiosSecure.js`

```jsx
import axios from 'axios'

const axiosSecure = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
})

const useAxiosSecure = () => {
  return axiosSecure;
}

export default useAxiosSecure
```

### Step 2: Basic Usage Pattern

In any component where you need API calls:

```jsx
import useAxiosSecure from '../hooks/useAxiosSecure'

const YourComponent = () => {
  const axiosSecure = useAxiosSecure()

  // Example API call
  const fetchData = async () => {
    try {
      const response = await axiosSecure.get('/your-endpoint')
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }

  return <div>Your component JSX</div>
}
```

### Step 3: Advanced Configuration (Optional)

Enhanced version with interceptors:

```jsx
import axios from 'axios'

const axiosSecure = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})

// Request interceptor
axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

const useAxiosSecure = () => {
  return axiosSecure;
}

export default useAxiosSecure
```

---

## 🎯 Common Usage Patterns

### 1. **GET Requests** - Fetching Data

```jsx
import useAxiosSecure from '../hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query'

const DataList = () => {
  const axiosSecure = useAxiosSecure()

  const { data: items = [], refetch } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await axiosSecure.get('/items')
      return res.data
    }
  })

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

### 2. **POST Requests** - Creating Data

```jsx
import useAxiosSecure from '../hooks/useAxiosSecure'
import { useState } from 'react'

const CreateForm = () => {
  const axiosSecure = useAxiosSecure()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      const response = await axiosSecure.post('/items', formData)
      console.log('Created:', response.data)
      // Handle success
    } catch (error) {
      console.error('Error creating item:', error)
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Item'}
      </button>
    </form>
  )
}
```

### 3. **PUT/PATCH Requests** - Updating Data

```jsx
import useAxiosSecure from '../hooks/useAxiosSecure'

const UpdateItem = ({ itemId }) => {
  const axiosSecure = useAxiosSecure()

  const updateItem = async (updatedData) => {
    try {
      const response = await axiosSecure.put(`/items/${itemId}`, updatedData)
      return response.data
    } catch (error) {
      console.error('Error updating item:', error)
      throw error
    }
  }

  return (
    <div>
      {/* Your update form */}
    </div>
  )
}
```

### 4. **DELETE Requests** - Removing Data

```jsx
import useAxiosSecure from '../hooks/useAxiosSecure'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const DeleteButton = ({ itemId }) => {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()

  const { mutate: deleteItem, isLoading } = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/items/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['items'])
      // Show success message
    },
    onError: (error) => {
      console.error('Error deleting item:', error)
      // Show error message
    }
  })

  return (
    <button 
      onClick={() => deleteItem(itemId)}
      disabled={isLoading}
    >
      {isLoading ? 'Deleting...' : 'Delete'}
    </button>
  )
}
```

---

## 🔗 Common API Patterns

### RESTful API Endpoints

| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| `GET` | `/items` | Fetch all items | `axiosSecure.get('/items')` |
| `GET` | `/items/:id` | Fetch single item | `axiosSecure.get('/items/123')` |
| `POST` | `/items` | Create new item | `axiosSecure.post('/items', data)` |
| `PUT` | `/items/:id` | Update entire item | `axiosSecure.put('/items/123', data)` |
| `PATCH` | `/items/:id` | Update partial item | `axiosSecure.patch('/items/123', data)` |
| `DELETE` | `/items/:id` | Delete item | `axiosSecure.delete('/items/123')` |

### Query Parameters
```jsx
// Single parameter
const response = await axiosSecure.get('/items?category=electronics')

// Multiple parameters
const response = await axiosSecure.get('/items', {
  params: {
    category: 'electronics',
    limit: 10,
    page: 1
  }
})
```

### Request Headers
```jsx
// Custom headers for specific request
const response = await axiosSecure.post('/items', data, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
```

---

## 🛠️ Integration with Popular Libraries

### 1. **TanStack Query (React Query) Integration**

Install TanStack Query:
```bash
npm install @tanstack/react-query
```

Setup Query Client:
```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  )
}
```

Usage with Axios:
```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '../hooks/useAxiosSecure'

const DataComponent = () => {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()

  // GET with useQuery
  const { data: items = [], refetch } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await axiosSecure.get('/items')
      return res.data
    }
  })

  // POST with useMutation
  const { mutate: createItem } = useMutation({
    mutationFn: async (newItem) => {
      const res = await axiosSecure.post('/items', newItem)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['items'])
    }
  })

  return <div>{/* Your component */}</div>
}
```

### 2. **Authentication Integration**

```jsx
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

const AuthenticatedComponent = () => {
  const { user } = useContext(AuthContext)
  const axiosSecure = useAxiosSecure()

  const fetchUserData = async () => {
    if (user) {
      const res = await axiosSecure.get(`/users/${user.id}`)
      return res.data
    }
  }

  return <div>{/* Your component */}</div>
}
```

### 3. **Loading States and Error Handling**

```jsx
import { useState, useEffect } from 'react'
import useAxiosSecure from '../hooks/useAxiosSecure'

const DataComponent = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const axiosSecure = useAxiosSecure()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axiosSecure.get('/items')
        setData(response.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [axiosSecure])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

---

## 🔐 Security Best Practices

### 1. **Environment Variables**
```env
# .env file
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_KEY=your-api-key-here
```

### 2. **Token Management**
```jsx
// Store tokens securely
const token = localStorage.getItem('authToken')
// or use more secure options like httpOnly cookies

// Add to requests
const axiosSecure = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### 3. **Request/Response Interceptors**
```jsx
// Request interceptor
axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### 4. **CORS Configuration**
Ensure your backend properly handles CORS:
```javascript
// Express.js example
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
```

---

## 📊 Error Handling Patterns

### 1. **Basic Try-Catch**
```jsx
const fetchData = async () => {
  try {
    const response = await axiosSecure.get('/items')
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
```

### 2. **Detailed Error Handling**
```jsx
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    console.error('Response error:', error.response.data)
    console.error('Status code:', error.response.status)
  } else if (error.request) {
    // Request made but no response
    console.error('Network error:', error.request)
  } else {
    // Something else happened
    console.error('Error:', error.message)
  }
}

const fetchData = async () => {
  try {
    const response = await axiosSecure.get('/items')
    return response.data
  } catch (error) {
    handleApiError(error)
    throw error
  }
}
```

### 3. **Global Error Handler**
```jsx
// Create a global error handler
const globalErrorHandler = (error) => {
  const message = error.response?.data?.message || 'Something went wrong'
  
  // Show toast notification
  toast.error(message)
  
  // Log to error tracking service
  console.error('API Error:', error)
}

// Use in components
const fetchData = async () => {
  try {
    const response = await axiosSecure.get('/items')
    return response.data
  } catch (error) {
    globalErrorHandler(error)
    throw error
  }
}
```

### 4. **React Error Boundaries**
```jsx
class ApiErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('API Error Boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong with the API call.</h2>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

---

## 🚀 Performance Optimization

### With TanStack Query:
- **Caching**: Automatic response caching
- **Background Refetching**: Keeps data fresh
- **Optimistic Updates**: Better user experience
- **Query Invalidation**: Efficient data synchronization

### Best Practices:
1. **Centralized Instance**: Use the custom hook consistently
2. **Error Boundaries**: Implement proper error handling
3. **Loading States**: Show loading indicators during requests
4. **Request Cancellation**: Handle component unmounting

---

## 📝 Usage Guidelines

### Do's:
✅ Use the `useAxiosSecure` hook consistently  
✅ Handle errors appropriately  
✅ Show loading states to users  
✅ Validate responses before using data  
✅ Use async/await for better readability  

### Don'ts:
❌ Don't import axios directly in components  
❌ Don't forget error handling  
❌ Don't make unnecessary API calls  
❌ Don't hardcode API endpoints  
❌ Don't ignore response status codes  

---

## 🔧 Troubleshooting Guide

### Common Issues and Solutions

#### 1. **CORS Errors**
```
Access to XMLHttpRequest at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution**: Configure your backend to allow your frontend origin
```javascript
// Express.js
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
```

#### 2. **Network Errors**
```
Error: Network Error
```
**Solutions**:
- Check if backend server is running
- Verify the API URL in your `.env` file
- Check firewall settings

#### 3. **404 Errors**
```
Request failed with status code 404
```
**Solutions**:
- Verify endpoint URLs are correct
- Check API documentation for correct paths
- Ensure backend routes are properly defined

#### 4. **Authentication Issues**
```
Request failed with status code 401
```
**Solutions**:
- Check if token is properly stored and sent
- Verify token hasn't expired
- Ensure proper authentication flow

#### 5. **Request Timeout**
```
Request failed with timeout
```
**Solutions**:
```jsx
const axiosSecure = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000 // Increase timeout
})
```

### Debug Tips

#### 1. **Request Logging**
```jsx
axiosSecure.interceptors.request.use(
  (config) => {
    console.log('Request:', config)
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)
```

#### 2. **Response Logging**
```jsx
axiosSecure.interceptors.response.use(
  (response) => {
    console.log('Response:', response)
    return response
  },
  (error) => {
    console.error('Response Error:', error)
    return Promise.reject(error)
  }
)
```

#### 3. **Network Tab Inspection**
- Open browser DevTools
- Go to Network tab
- Check request/response details
- Verify headers and status codes

---

## 📈 Advanced Features

### 1. **Request Cancellation**
```jsx
import { useEffect, useRef } from 'react'

const DataComponent = () => {
  const axiosSecure = useAxiosSecure()
  const cancelTokenRef = useRef()

  useEffect(() => {
    const fetchData = async () => {
      // Cancel previous request if exists
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Operation cancelled by user')
      }

      // Create new cancel token
      const source = axios.CancelToken.source()
      cancelTokenRef.current = source

      try {
        const response = await axiosSecure.get('/items', {
          cancelToken: source.token
        })
        setData(response.data)
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request cancelled:', error.message)
        } else {
          console.error('Error:', error)
        }
      }
    }

    fetchData()

    // Cleanup on unmount
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Component unmounted')
      }
    }
  }, [axiosSecure])

  return <div>{/* Your component */}</div>
}
```

### 2. **Request Retry Logic**
```jsx
const retryRequest = async (requestFn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)))
    }
  }
}

const fetchDataWithRetry = async () => {
  return retryRequest(async () => {
    const response = await axiosSecure.get('/items')
    return response.data
  })
}
```

### 3. **Request Caching**
```jsx
const cache = new Map()

const cachedRequest = async (url, options = {}) => {
  const cacheKey = `${url}${JSON.stringify(options)}`
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  const response = await axiosSecure.get(url, options)
  cache.set(cacheKey, response.data)
  
  // Clear cache after 5 minutes
  setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000)
  
  return response.data
}
```

### 4. **File Upload with Progress**
```jsx
const uploadFile = async (file, onProgress) => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axiosSecure.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        onProgress(percentCompleted)
      }
    })
    return response.data
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}
```

---

## 📋 Complete Implementation Checklist

### ✅ Setup Checklist
- [ ] Install Axios (`npm install axios`)
- [ ] Create `src/hooks/useAxiosSecure.js` file
- [ ] Set up environment variables in `.env`
- [ ] Configure base URL and timeout
- [ ] Add request/response interceptors (optional)

### ✅ Implementation Checklist
- [ ] Import `useAxiosSecure` in components
- [ ] Handle loading states
- [ ] Implement proper error handling
- [ ] Add request cancellation for long-running requests
- [ ] Configure CORS on backend
- [ ] Set up authentication headers

### ✅ Best Practices Checklist
- [ ] Use consistent error handling patterns
- [ ] Show loading indicators to users
- [ ] Validate responses before using data
- [ ] Use async/await for better readability
- [ ] Implement request retry logic for critical operations
- [ ] Add proper TypeScript types (if using TypeScript)

### ✅ Production Checklist
- [ ] Use environment-specific API URLs
- [ ] Implement proper error logging
- [ ] Add request/response monitoring
- [ ] Set up error boundaries
- [ ] Configure proper timeout values
- [ ] Add security headers

---

## 🎉 Summary

This guide provides a complete, production-ready Axios implementation for React applications. The approach offers:

**Key Benefits:**
- ✅ **Centralized Configuration**: One place to manage all API settings
- ✅ **Reusable**: Use the same pattern across all components
- ✅ **Scalable**: Easy to extend with interceptors and middleware
- ✅ **Error Handling**: Consistent error handling throughout the app
- ✅ **Security**: Built-in token management and security features
- ✅ **Performance**: Optimized with caching and request cancellation
- ✅ **Developer Experience**: Clean, readable code with proper TypeScript support

**Perfect for:**
- React applications of any size
- Projects requiring API integration
- Applications with authentication
- Teams following modern React patterns
- Projects requiring maintainable code

Follow this guide step-by-step to implement a professional HTTP client that will serve your application well in development and production environments.
