import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Welcome to CogPath</h1>
          <div className="py-6">
            <p className="">Train your brain — five minutes a day.</p>
            <p className="">Sharpen memory. Boost focus.</p>
          </div>
          <Link to="/login">
            <button className="btn btn-primary">Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
