import React, { useState } from "react";

function CaiDat() {
  const [settings, setSettings] = useState({
    systemName: "Hệ thống quản lý chung cư",
    adminEmail: "admin@example.com",
    language: "vi",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Lưu cài đặt:", settings);
    alert("✅ Cài đặt đã được lưu!");
  };

  return (
    <div>
      <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>
        ⚙️ Cài đặt hệ thống
      </h2>

      <div
        style={{
          maxWidth: "600px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Tên hệ thống
          </label>
          <input
            type="text"
            name="systemName"
            value={settings.systemName}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Email quản trị
          </label>
          <input
            type="email"
            name="adminEmail"
            value={settings.adminEmail}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Ngôn ngữ
          </label>
          <select
            name="language"
            value={settings.language}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          style={{
            padding: "10px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          💾 Lưu thay đổi
        </button>
      </div>
    </div>
  );
}

export default CaiDat;
