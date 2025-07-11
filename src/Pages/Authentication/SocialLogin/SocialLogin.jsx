import React from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../Hook/useAuth";
import useAxios from "../../../Hook/useAxios";
import Swal from 'sweetalert2';

const SocialLogin = ({ redirectTo = '/' }) => {
    const { signInWithGithub, singInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const axiosInstance = useAxios();

    const handleGoogleLogin = () => {
        singInWithGoogle()
        .then(async (result) => {
            console.log(result);

            // Create or update user in database
            const userInfo = {
                email: result.user.email,
                name: result.user.displayName || '',
                photoURL: result.user.photoURL || '',
                emailVerified: result.user.emailVerified,
                uid: result.user.uid,
                provider: 'google',
                phoneNumber: result.user.phoneNumber || '',
                role: 'user',
                created_at: new Date().toISOString(),
                last_log_in: new Date().toISOString()
            };

            try {
                const userRes = await axiosInstance.post('/users', userInfo);
                console.log(userRes.data);
            } catch (error) {
                console.error('Error saving user data:', error);
            }
            
            // Show success alert
            Swal.fire({
                title: 'Login Successful!',
                text: `Welcome, ${result.user?.displayName || 'User'}!`,
                icon: 'success',
                confirmButtonText: 'Continue',
                confirmButtonColor: '#CAEB66',
                timer: 3000,
                timerProgressBar: true
            }).then(() => {
                // Navigate to intended path or home page
                navigate(redirectTo, { replace: true });
            });
        })
        .catch(error => {
            console.log(error);
            
            // Determine error message based on error code
            let errorMessage = 'Google login failed. Please try again.';
            
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Login cancelled. Please try again.';
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Popup blocked by browser. Please enable popups and try again.';
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                errorMessage = 'An account with this email already exists. Please use a different login method.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (error.code === 'auth/unauthorized-domain') {
                errorMessage = 'This domain is not authorized for OAuth operations.';
            }
            
            // Show error alert
            Swal.fire({
                title: 'Google Login Failed!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#ef4444',
                timer: 5000,
                timerProgressBar: true
            });
        });
    };

    const handleGithubLogin = () => {
        signInWithGithub()
        .then(async (result) => {
            console.log(result);

            // Create or update user in database
            const userInfo = {
                email: result.user.email,
                name: result.user.displayName || '',
                photoURL: result.user.photoURL || '',
                emailVerified: result.user.emailVerified,
                uid: result.user.uid,
                provider: 'github',
                phoneNumber: result.user.phoneNumber || '',
                role: 'user',
                created_at: new Date().toISOString(),
                last_log_in: new Date().toISOString()
            };

            try {
                const userRes = await axiosInstance.post('/users', userInfo);
                console.log(userRes.data);
            } catch (error) {
                console.error('Error saving user data:', error);
            }
            
            // Show success alert
            Swal.fire({
                title: 'Login Successful!',
                text: `Welcome, ${result.user?.displayName || result.user?.email || 'User'}!`,
                icon: 'success',
                confirmButtonText: 'Continue',
                confirmButtonColor: '#CAEB66',
                timer: 3000,
                timerProgressBar: true
            }).then(() => {
                // Navigate to intended path or home page
                navigate(redirectTo, { replace: true });
            });
        })
        .catch(error => {
            console.log(error);
            
            // Determine error message based on error code
            let errorMessage = 'GitHub login failed. Please try again.';
            
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Login cancelled. Please try again.';
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Popup blocked by browser. Please enable popups and try again.';
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                errorMessage = 'An account with this email already exists. Please use a different login method.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (error.code === 'auth/unauthorized-domain') {
                errorMessage = 'This domain is not authorized for OAuth operations.';
            }
            
            // Show error alert
            Swal.fire({
                title: 'GitHub Login Failed!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#ef4444',
                timer: 5000,
                timerProgressBar: true
            });
        });
    };

    return (
        <div className="space-y-3">
            <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 text-[#03373D] font-medium cursor-pointer"
            >
                <FcGoogle className="text-lg" />
                Continue with Google
            </button>
            <button
                onClick={handleGithubLogin}
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 text-[#03373D] font-medium cursor-pointer"
            >
                <FaGithub className="text-lg text-gray-800" />
                Continue with GitHub
            </button>
        </div>
    );
};

export default SocialLogin;
