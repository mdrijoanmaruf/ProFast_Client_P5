import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaGithub, FaUser, FaEnvelope, FaImage, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../../Hook/useAuth";
import SocialLogin from "../SocialLogin/SocialLogin";
import Swal from 'sweetalert2';
import axios from "axios";

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { createUser, updateUserProfile } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended path from location state, default to '/' if not available
  const from = location.state?.from?.pathname || '/';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [uploadedImageURL, setUploadedImageURL] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;
    
    console.log('Selected image:', image);
    setImageUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', image);

      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_ImageBB_API_Key}`, formData);
      console.log('Upload response:', res.data);
    } catch (error) {
      console.error('Image upload error:', error);
      Swal.fire({
        title: 'Upload Failed!',
        text: 'Failed to upload image. Please try again.',
        icon: 'error',
        timer: 3000,
        showConfirmButton: false
      });
    } finally {
      setImageUploading(false);
    }
  }

  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then(result => {
        console.log(result.user);
        
        // Update user profile with name and photo URL if uploaded
        const profileData = {
          displayName: data.name
        };
        
        if (uploadedImageURL) {
          profileData.photoURL = uploadedImageURL;
        }
        
        // Update profile and show success message
        updateUserProfile(profileData)
          .then(() => {
            // Show success alert
            Swal.fire({
              title: 'Registration Successful!',
              text: `Welcome to ProFast, ${data.name}!`,
              icon: 'success',
              confirmButtonText: 'Get Started',
              confirmButtonColor: '#CAEB66',
              timer: 3000,
              timerProgressBar: true
            }).then(() => {
              // Navigate to intended path or home page
              navigate(from, { replace: true });
            });
          })
          .catch(profileError => {
            console.log("Profile update error:", profileError);
            // Still show success but mention profile update issue
            Swal.fire({
              title: 'Registration Successful!',
              text: `Welcome to ProFast! Your account has been created.`,
              icon: 'success',
              confirmButtonText: 'Continue',
              confirmButtonColor: '#CAEB66',
              timer: 3000,
              timerProgressBar: true
            }).then(() => {
              navigate(from, { replace: true });
            });
          });
      })
      .catch(error => {
        console.log(error);
        
        // Determine error message based on error code
        let errorMessage = 'Registration failed. Please try again.';
        
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'This email is already registered. Please use a different email or try logging in.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'Password is too weak. Please use a stronger password.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address format.';
        } else if (error.code === 'auth/operation-not-allowed') {
          errorMessage = 'Email/password accounts are not enabled. Please contact support.';
        } else if (error.code === 'auth/network-request-failed') {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
        
        // Show error alert
        Swal.fire({
          title: 'Registration Failed!',
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
      <div className="mb-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-[#03373D] mb-2">
          Create Account
        </h1>
        <p className="text-gray-600 text-base lg:text-lg">Join ProFast today</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[#03373D] mb-1"
          >
            Full Name
          </label>
          <div className="relative">
            <input
              {...register('name', { 
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
              type="text"
              name="name"
              id="name"
              placeholder="Enter your full name"
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200"
            />
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#03373D] mb-1"
          >
            Email Address
          </label>
          <div className="relative">
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
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200"
            />
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Profile Picture Input */}
        <div>
          <label
            htmlFor="profilePicture"
            className="block text-sm font-medium text-[#03373D] mb-1"
          >
            Profile Picture <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <div className="relative">
            <input
              {...register('profilePicture')}
              type="file"
              name="profilePicture"
              id="profilePicture"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-[#CAEB66] file:text-[#03373D] hover:file:bg-opacity-90"
              disabled={imageUploading}
            />
            <FaImage className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {imageUploading && (
            <p className="text-blue-500 text-sm mt-1">Uploading image...</p>
          )}
          {uploadedImageURL && (
            <div className="mt-2 flex items-center gap-2">
              <img 
                src={uploadedImageURL} 
                alt="Uploaded profile" 
                className="w-12 h-12 rounded-full object-cover border-2 border-[#CAEB66]"
              />
              <p className="text-green-500 text-sm">✓ Image uploaded successfully</p>
            </div>
          )}
          {errors.profilePicture && (
            <p className="text-red-500 text-sm mt-1">{errors.profilePicture.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#03373D] mb-1"
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
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain at least one uppercase, one lowercase, and one number'
                }
              })}
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200"
            />
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
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

        {/* Terms and Conditions */}
        <div className="flex items-start gap-3 pt-2">
          <input
            {...register('terms', { 
              required: 'You must accept the terms and conditions'
            })}
            type="checkbox"
            name="terms"
            id="terms"
            className="mt-1 w-4 h-4 text-[#CAEB66] border-gray-300 rounded focus:ring-[#CAEB66] focus:ring-2"
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the{" "}
            <a href="#" className="text-[#03373D] hover:text-[#CAEB66] transition-colors duration-200">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#03373D] hover:text-[#CAEB66] transition-colors duration-200">
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.terms && (
          <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>
        )}

        {/* Register Button */}
        <button
          type="submit"
          className="w-full bg-[#CAEB66] text-[#03373D] py-3 px-4 rounded-lg font-semibold text-base hover:bg-opacity-90 hover:transform hover:scale-105 transition-all duration-300 shadow-lg mt-6"
        >
          Create Account
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-600 pt-2">
          Already have an account?{" "}
          <Link to='/login'
            className="text-[#03373D] font-semibold hover:text-[#CAEB66] transition-colors duration-200"
          >
            Login
          </Link>
        </p>

        {/* Divider */}
        <div className="relative my-4">
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

export default Register;