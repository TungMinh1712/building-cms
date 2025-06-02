import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // xóa localStorage để logout thật sự
    if (onLogout) onLogout(); // gọi hàm cập nhật trạng thái đăng nhập ở App
    navigate("/login"); // chuyển về trang login luôn
  };

  const menuItems = [
    { to: "/bqt", label: "Ban Quản Trị", icon: "👥" },
    { to: "/vanban", label: "Văn Bản", icon: "📄" },
    { to: "/nhiemvu", label: "Nhiệm Vụ", icon: "📋" },
    { to: "/cuochop", label: "Cuộc Họp", icon: "☎️" },
    { to: "/khieunai", label: "Khiếu Nại", icon: "🤬" },
  ];

  return (
    <div className="sidebar-container">
      <h3 className="sidebar-title">
        <span>🏢</span> Admin
      </h3>
      <ul className="nav-list">
        {menuItems.map((item) => (
          <li key={item.to} className="nav-item">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <button
        onClick={handleLogout}
        style={{
          marginTop: "auto",
          width: "100%",
          padding: "0.5rem",
          backgroundColor: "#e74c3c",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default Sidebar;
