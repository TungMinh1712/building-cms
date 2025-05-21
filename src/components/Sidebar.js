// src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
//import "./Sidebar.css"; // nếu muốn style riêng

const Sidebar = () => {
  return (
    <div
      style={{
        width: "200px",
        background: "#0d6efd",
        height: "100vh",
        color: "white",
        padding: "1rem",
      }}
    >
      <h3>🏢 Admin</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <Link to="/bqt" style={{ color: "white" }}>
            👥 Ban Quản Trị
          </Link>
        </li>
        <li>
          <Link to="/vanban" style={{ color: "white" }}>
            📄 Văn Bản
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
