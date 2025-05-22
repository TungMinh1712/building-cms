// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import BanQuanTriList from "./screens/BanQuanTriList";
import VanBanList from "./screens/VanBanList";
import NhiemVu from "./screens/NhiemVu";
import CuocHop from "./screens/CuocHop";
import KhieuNai from "./screens/KhieuNai";
import CaiDat from "./screens/CaiDat";
import Login from "./screens/auth/Login";
import Register from "./screens/auth/Register";
import { getCurrentUser } from "./utils/auth";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "1rem" }}>
          <Routes>
            <Route path="/bqt" element={<BanQuanTriList />} />
            <Route path="/vanban" element={<VanBanList />} />
            <Route path="/nhiemvu" element={<NhiemVu />} />
            <Route path="/cuochop" element={<CuocHop />} />
            <Route path="/khieunai" element={<KhieuNai />} />
            <Route path="/caidat" element={<CaiDat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/bqt"
              element={
                getCurrentUser() ? (
                  <BanQuanTriList />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="*" element={<h2>Chào mừng đến hệ thống 🎉</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
