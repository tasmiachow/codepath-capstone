import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON response:", text);
        throw new Error("Unexpected server response");
      }

      console.log("login response:", res.status, data);

      if (!res.ok) throw new Error(data?.error || "Login failed");
      if (!data?.token) throw new Error("No token returned from server");

      localStorage.setItem("token", data.token);
      // navigate after token is stored
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("login error:", err);
      setError(err.message);
    }
  };
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body ">
            <form onSubmit={handleSubmit} className="space-y-4 m-2">
              <label className="label">Email</label>
              <input
                name="email"
                type="email"
                className="input"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <label className="label">Password</label>
              <input
                name="password"
                type="password"
                className="input"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <div className="flex justify-between">
                <a className="link link-hover">Forgot password?</a>
                <a className="link link-hover" href="/signup">
                  Signup
                </a>
              </div>
              <button className="btn btn-neutral mt-4 " type="submit">
                Login
              </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
// ...existing code...
