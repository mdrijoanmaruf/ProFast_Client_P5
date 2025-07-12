import { useQuery } from '@tanstack/react-query'
import useAuth from './useAuth'
import useAxiosSecure from './useAxiosSecure'

const useUserRole = () => {
    const { user, loading } = useAuth()
    const axiosSecure = useAxiosSecure()
    
    const { data: userRole, isLoading: roleLoading, error, refetch } = useQuery({
        queryKey: ['userRole', user?.email],
        queryFn: async () => {
            if (!user?.email) {
                return null;
            }
            
            try {
                const response = await axiosSecure.get(`/users/role/${user.email}`);
                return response.data;
            } catch (error) {
                // If user not found in database, return default user role
                if (error.response?.status === 404) {
                    return {
                        success: true,
                        email: user.email,
                        role: 'user',
                        name: user.displayName || null
                    };
                }
                throw error;
            }
        },
        enabled: !!user?.email && !loading, // Only run query when user email exists and auth is not loading
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    })
    
    return {
        role: userRole?.role || 'user',
        userRole: userRole,
        isLoading: loading || roleLoading,
        error,
        refetch
    }
}

export default useUserRole