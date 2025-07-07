# TanStack Query Usage Notes

## 📦 Installation & Setup

### 1. Install TanStack Query
```bash
npm install @tanstack/react-query
```

### 2. Setup QueryClient in main.jsx
```jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Wrap app with QueryClientProvider
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

## 🔧 Basic Usage

### 1. useQuery Hook - Fetch Data
```jsx
import { useQuery } from '@tanstack/react-query'

const { data: parcels = [], refetch } = useQuery({
  queryKey: ['my-parcels', user.email],
  queryFn: async () => {
    const res = await axiosSecure.get(`/parcels?email=${user.email}`)
    return res.data
  }
})
```

### 2. Key Components:
- **queryKey**: Unique identifier for the query
- **queryFn**: Function that fetches the data
- **data**: The fetched data (with default fallback)
- **refetch**: Function to manually refetch data

## 🎯 Real Example from MyParcels Component

```jsx
const MyParcels = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()

  // Fetch user's parcels
  const { data: parcels = [], refetch } = useQuery({
    queryKey: ['my-parcels', user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`)
      return res.data
    }
  })

  // Use data in component
  return (
    <div>
      <h1>Total Parcels: {parcels.length}</h1>
      {parcels.map(parcel => (
        <div key={parcel._id}>{parcel.title}</div>
      ))}
    </div>
  )
}
```

## ✨ Benefits Used in Project

1. **Automatic Caching**: Data is cached and reused
2. **Background Refetching**: Keeps data fresh automatically
3. **Loading States**: Built-in loading management
4. **Manual Refetch**: `refetch()` after operations like delete
5. **Dependent Queries**: Query depends on user.email

## 🔄 Common Patterns

### Refetch After Mutations
```jsx
const handleDelete = async (id) => {
  await axiosSecure.delete(`/parcels/${id}`)
  refetch() // Refresh the data after delete
}
```

### Query Key with Dependencies
```jsx
queryKey: ['my-parcels', user.email] // Refetches when user.email changes
```

### Default Values
```jsx
const { data: parcels = [] } = useQuery(...) // Empty array if no data
```

## 🎯 What We Achieved

- ✅ Fetch parcels data automatically
- ✅ Cache data for better performance  
- ✅ Refresh data after delete operations
- ✅ Handle loading states seamlessly
- ✅ Depend on user authentication state

## 🚀 Next Steps (Optional)

- Add loading and error states
- Use useMutation for POST/PUT/DELETE
- Add optimistic updates
- Implement infinite queries for pagination