// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import BanQuanTriList from "./screens/BanQuanTriList";
import VanBanList from "./screens/VanBanList";
import NhiemVu from "./screens/NhiemVu";
import CuocHop from "./screens/CuocHop";
import KhieuNai from "./screens/KhieuNai";

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

            <Route path="*" element={<h2>Chào mừng đến hệ thống 🎉</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
