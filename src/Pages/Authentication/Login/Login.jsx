import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SocialLogin from "../SocialLogin/SocialLogin";
import useAuth from "../../../Hook/useAuth";
import useAxios from "../../../Hook/useAxios";
import Swal from 'sweetalert2';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosInstance = useAxios();

  // Get the intended path from location state, default to '/' if not available
  const from = location.state?.from?.pathname || '/';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (data) => {
    console.log(data);
    signIn(data.email, data.password)
    .then(async (result) => {
      console.log(result);

      // Create or update user in database
      const userInfo = {
        email: result.user.email,
        name: result.user.displayName || '',
        photoURL: result.user.photoURL || '',
        emailVerified: result.user.emailVerified,
        uid: result.user.uid,
        provider: 'email',
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
        text: `Welcome back, ${result.user?.displayName || 'User'}!`,
        icon: 'success',
        confirmButtonText: 'Continue',
        confirmButtonColor: '#CAEB66',
        timer: 3000,
        timerProgressBar: true
      }).then(() => {
        // Navigate to intended path or home page
        navigate(from, { replace: true });
      });
    })
    .catch(error => {
      console.log(error);
      
      // Determine error message based on error code
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      // Show error alert
      Swal.fire({
        title: 'Login Failed!',
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
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-[#03373D] mb-2">
          Welcome back
        </h1>
        <p className="text-gray-600 text-base lg:text-lg">Login with ProFast</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#03373D] mb-2"
          >
            Email Address
          </label>
          <input
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address'
              }
            })}
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#03373D] mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <a
            href="#"
            className="text-sm text-[#03373D] hover:text-[#CAEB66] transition-colors duration-200"
          >
            Forgot password?
          </a>
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          className="w-full bg-[#CAEB66] text-[#03373D] py-3 px-4 rounded-lg font-semibold text-base hover:bg-opacity-90 hover:transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          Continue
        </button>

        {/* Register Link */}
        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <Link to='/register'
            className="text-[#03373D] font-semibold hover:text-[#CAEB66] transition-colors duration-200"
          >
            Register
          </Link>
        </p>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <SocialLogin redirectTo={from}></SocialLogin>
      </form>
    </div>
  );
};

export default Login;
