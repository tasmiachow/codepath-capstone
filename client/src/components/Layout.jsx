import React from "react";
import { Outlet, useLocation, matchPath } from "react-router-dom";
import Navbar from "./Navbar.jsx";

export default function Layout() {
  const location = useLocation();
  // hide navbar only on exact homepage path "/"
  const isHome = matchPath({ path: "/", end: true }, location.pathname);
  const isLogin = matchPath({ path: "/login", end: true }, location.pathname);

  const showNavbar = !(isHome || isLogin);

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-1 page-content">
        <Outlet />
      </main>
    </div>
  );
}
