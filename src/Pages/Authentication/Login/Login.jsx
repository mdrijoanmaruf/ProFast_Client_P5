import React from "react";
import { FaEye, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
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
      <form className="space-y-6">
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#03373D] mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200"
          />
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
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <FaEye />
            </button>
          </div>
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
          <a
            href="#"
            className="text-[#03373D] font-semibold hover:text-[#CAEB66] transition-colors duration-200"
          >
            Register
          </a>
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
        <div className="space-y-3">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 text-[#03373D] font-medium"
          >
            <FcGoogle className="text-lg"></FcGoogle>
            Login with Google
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 text-[#03373D] font-medium"
          >
            <FaGithub className="text-lg text-gray-800" />
            Login with GitHub
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
