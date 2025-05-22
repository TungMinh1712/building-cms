import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const menuItems = [
    { to: "/bqt", label: "Ban Quản Trị", icon: "👥" },
    { to: "/vanban", label: "Văn Bản", icon: "📄" },
    { to: "/nhiemvu", label: "Nhiệm Vụ", icon: "📋" },
    { to: "/cuochop", label: "Cuộc Họp", icon: "☎️" },
    { to: "/khieunai", label: "Khiếu Nại", icon: "🤬" },
    { to: "/caidat", label: "Cài Đặt", icon: "⚙️" },
  ];

  return (
    <div className="sidebar-container">
      <h3 className="sidebar-title">
        <span>🏢</span> Admin
      </h3>
      <ul className="nav-list">
        {menuItems.map((item) => (
          <li key={item.to} className="nav-item">
            <NavLink to={item.to} className="nav-link" activeClassName="active">
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
