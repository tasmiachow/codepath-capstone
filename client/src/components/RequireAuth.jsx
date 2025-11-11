import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function RequireAuth({ children }) {
  const { logout } = useAuth();
  const [status, setStatus] = useState("loading"); // 'loading' | 'ok' | 'unauth'

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("unauth");
      return;
    }

    fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!mounted) return;
        if (res.ok) setStatus("ok");
        else {
          logout();
          setStatus("unauth");
        }
      })
      .catch(() => {
        if (mounted) {
          logout();
          setStatus("unauth");
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (status === "loading") return <div className="p-6">Loading...</div>;
  if (status === "unauth") return <Navigate to="/login" replace />;
  return children;
}
