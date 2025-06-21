import React from "react";
import { FaEye, FaGithub, FaUser, FaEnvelope, FaImage, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import useAuth from "../../../Hook/useAuth";
import SocialLogin from "../SocialLogin/SocialLogin";

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const {createUser} = useAuth()

  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email , data.password)
    .then(result => {
        console.log(result.user);
    })
    .catch(error => {
        console.log(error);
    })
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 mt-12 md:mt-0">
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

        {/* Photo URL Input */}
        <div>
          <label
            htmlFor="photoURL"
            className="block text-sm font-medium text-[#03373D] mb-1"
          >
            Photo URL <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <div className="relative">
            <input
              {...register('photoURL')}
              type="url"
              name="photoURL"
              id="photoURL"
              placeholder="Enter your photo URL (optional)"
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200"
            />
            <FaImage className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {errors.photoURL && (
            <p className="text-red-500 text-sm mt-1">{errors.photoURL.message}</p>
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
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200"
            />
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <FaEye />
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
        <SocialLogin></SocialLogin>
      </form>
    </div>
  );
};

export default Register;