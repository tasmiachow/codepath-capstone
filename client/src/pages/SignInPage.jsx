import React, { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

const SignInPage = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); // <- important: stop the browser from doing a GET form submit
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
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
      if (!res.ok) throw new Error(data.error || "Signup failed");
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-col">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Sign Up</h1>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4 m-2">
              <label className="label">Username</label>
              <input
                name="username"
                type="text"
                className="input"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
              />
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
                <a className="link link-hover" href="/login">
                  Already have an account?
                </a>
              </div>
              <button className="btn btn-neutral mt-4 " type="submit">
                Sign Up
              </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
