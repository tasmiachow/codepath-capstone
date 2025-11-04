// ...existing code...
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <NavLink className="btn btn-ghost text-xl" to="/">
          CogPath
        </NavLink>
      </div>
      <div className="flex gap-2">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Dashboard
        </NavLink>

        {!localStorage.getItem("token") ? (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Login
            </NavLink>
          </>
        ) : (
          <button onClick={handleLogout} className="nav-logout">
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
// ...existing code...
