import React from "react";
import Logo from "../Shared/Logo/Logo";
import authImage from '../assets/authImage.png'
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa'
import { FcGoogle } from "react-icons/fc";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen">
      {/* Logo - Top Left */}
      <div className="absolute top-0 left-0 p-8 lg:p-8 z-10">
        <Logo />
      </div>

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side - Form */}
        <div className="flex items-center justify-center p-6 lg:p-8 pt-24 lg:pt-32">
          <div className="w-full max-w-md">
            <Outlet></Outlet>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:flex bg-[#FAFDF0] justify-center items-center p-8">
          <div className="max-w-lg">
            <img 
              src={authImage} 
              alt="Authentication" 
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
