import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import RequireAuth from "./components/RequireAuth.jsx";

import Layout from "./components/Layout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import GamesPage from "./pages/GamesPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignInPage />} />
          <Route
            path="dashboard"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route path="games" element={<GamesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
