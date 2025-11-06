import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { IoIosLogIn } from "react-icons/io";
const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 ">
      <div className="flex-1">
        <NavLink
          className="btn btn-ghost text-xl"
          to={token ? "/dashboard" : "/"}
        >
          <FaGear />
          CogPath
        </NavLink>
      </div>
      <div className="flex gap-2">
        {token && (
          <>
            <NavLink to="/dashboard" className="btn btn-ghost text-md">
              Dashboard
            </NavLink>
            <NavLink to="/games" className="btn btn-ghost text-md">
              Games
            </NavLink>
          </>
        )}

        {!token ? (
          <NavLink to="/login" className="btn btn-ghost text-md">
            Login
            <IoIosLogIn size={"2em"} />
          </NavLink>
        ) : (
          <button
            onClick={handleLogout}
            className="nav-logout btn btn-ghost text-md"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};
export default Navbar;
