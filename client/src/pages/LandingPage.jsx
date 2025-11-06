import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="hero bg-[radial-gradient(50%_50%_at_50%_50%,#FFFFFF_0%,#B7A3FF_100%)] min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Welcome to CogPath</h1>
          <div className="py-6">
            <p className="">Train your brain — five minutes a day.</p>
            <p className="">Sharpen memory. Boost focus.</p>
          </div>
          <div className="max-w-lg flex justify-between">
            <Link to="/games">
              <button className="btn btn-primary bg-[linear-gradient(0deg,#C6EF8D,#C6EF8D),radial-gradient(50%_50%_at_50%_50%,rgba(191,138,227,0)_0%,rgba(226,98,98,0.2)_100%)] font-inter font-normal text-3xl text-center align-middle leading-none tracking-normal text-black w-[216px] h-[84px] rotate-0 opacity-100 top-[415px] left-[295px] rounded-[15px]">
                Play Now
              </button>
            </Link>
            <Link to="/login">
              <button className="btn btn-primary bg-[#B2BFFE] font-inter font-normal text-3xl text-center align-middle leading-none tracking-normal text-black w-[216px] h-[84px] rotate-0 opacity-100 top-[415px] left-[295px] rounded-[15px] ">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
