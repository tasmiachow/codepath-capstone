import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
// ...existing code...
import LoginPage from "./pages/LoginPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{" "}
        <Link to="/signup">Sign up</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="max-w-md">
                <h1>Vite + React</h1>
                <div className="card">
                  <button
                    onClick={() => setCount((c) => c + 1)}
                    className="btn"
                  >
                    count is {count}
                  </button>
                </div>
              </div>
            </>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
