import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import BanQuanTriList from "./screens/BanQuanTriList";
import VanBanList from "./screens/VanBanList";
import NhiemVu from "./screens/NhiemVu";
import CuocHop from "./screens/CuocHop";
import KhieuNai from "./screens/KhieuNai";
import Login from "./screens/auth/Login";
import CuDan from "./screens/Cudan";
import { getCurrentUser } from "./utils/auth";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getCurrentUser());

  useEffect(() => {
    setIsLoggedIn(!!getCurrentUser());
  }, []);

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {isLoggedIn && <Sidebar onLogout={handleLogout} />}
        <div style={{ flex: 1, padding: "1rem" }}>
          <Routes>
            <Route path="/" element={<Login onLoginSuccess={handleLogin} />} />
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLogin} />}
            />
            <Route
              path="/bqt"
              element={
                isLoggedIn ? (
                  <BanQuanTriList />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/cudan"
              element={
                isLoggedIn ? <CuDan /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/vanban"
              element={
                isLoggedIn ? <VanBanList /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/nhiemvu"
              element={
                isLoggedIn ? <NhiemVu /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/cuochop"
              element={
                isLoggedIn ? <CuocHop /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/khieunai"
              element={
                isLoggedIn ? <KhieuNai /> : <Navigate to="/login" replace />
              }
            />
            <Route path="*" element={<h2>Không tìm thấy trang 🥲</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
