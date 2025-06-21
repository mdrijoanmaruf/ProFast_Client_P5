import React from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../../Hook/useAuth";

const SocialLogin = () => {

    const {signInWithGithub, singInWithGoogle} = useAuth()

    const handleGoogleLogin = () => {
        singInWithGoogle()
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.log(error);
        })
    }
    const handleGithubLogin = () => {
        signInWithGithub()
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.log(error);
        })
    }


  return (
    <div className="space-y-3">
      <button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 text-[#03373D] font-medium cursor-pointer"
      >
        <FcGoogle className="text-lg" />
        Register with Google
      </button>
      <button
        onClick={handleGithubLogin}
        type="button"
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 text-[#03373D] font-medium cursor-pointer"
      >
        <FaGithub className="text-lg text-gray-800" />
        Register with GitHub
      </button>
    </div>
  );
};

export default SocialLogin;
