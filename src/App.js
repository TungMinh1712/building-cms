import React, { useState, useEffect } from "react";
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
import Register from "./screens/auth/Register";
import HomeScreen from "./screens/HomeScreen";
import { getCurrentUser } from "./utils/auth";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getCurrentUser());

  useEffect(() => {
    setIsLoggedIn(!!getCurrentUser());
  }, []);

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Xoá user khỏi localStorage
    setIsLoggedIn(false); // Cập nhật lại state
  };

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {isLoggedIn && <Sidebar onLogout={handleLogout} />}
        <div style={{ flex: 1, padding: "1rem" }}>
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? <Navigate to="/bqt" replace /> : <HomeScreen />
              }
            />
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLogin} />}
            />
            <Route
              path="/register"
              element={<Register onRegisterSuccess={handleLogin} />}
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
