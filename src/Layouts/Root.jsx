import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Shared/Navbar/Navbar";
import Footer from "../Shared/Footer/Footer";

const Root = () => {
  return (
    <div className="bg-[#EAECED]">
      <div className=" md:max-w-7xl mx-auto w-[94%]">
        <div className="pt-4">
          <Navbar></Navbar>
        </div>
        <Outlet></Outlet>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default Root;
