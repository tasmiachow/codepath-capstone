import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import RequireAuth from "./components/RequireAuth.jsx";

import Layout from "./components/Layout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import GamesPage from "./pages/GamesPage.jsx";
import LicensePlateGame from "./components/games/LicensePlateGame.jsx";
import { AuthProvider } from "./AuthContext.jsx";

const GAME_ROUTES = {
  // [gameId]: component
  1: <LicensePlateGame />
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route
              path="dashboard"
              element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              }
            />
            <Route path="games">
              <Route index element={<GamesPage />} />
              {Object.entries(GAME_ROUTES).map(([gameId, component], index) => {
                return <Route path={gameId} element={component} key={index} />;
              })}
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
