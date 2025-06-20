import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Shared/Navbar/Navbar";
import Footer from "../Shared/Footer/Footer";

const Root = () => {
  return (
    <div className="bg-[#EAECED]">
      <div className=" md:max-w-11/12 mx-auto w-[94%]">
        <div className="pt-6">
          <Navbar></Navbar>
        </div>
        <Outlet></Outlet>
        <div className="py-6">

        <Footer></Footer>
        </div>
      </div>
    </div>
  );
};

export default Root;
