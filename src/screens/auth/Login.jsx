import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import callApi from "../../apis/handleapi";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Vui lòng nhập đủ thông tin");
      return;
    }

    try {
      const res = await callApi("/login", "POST", { username, password });

      if (res.token) {
        localStorage.setItem("user", JSON.stringify(res));
        alert("Đăng nhập thành công");
        onLoginSuccess();
        const role = res.user.role;
        navigate(role === "bqt" ? "/bqt" : "/cudan"); // Chuyển hướng theo role
      } else {
        alert("Đăng nhập thất bại: " + (res.message || "Lỗi không rõ"));
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi đăng nhập, thử lại sau");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h3 className="text-center text-primary mb-4">Đăng nhập hệ thống</h3>

        <div className="mb-3">
          <label className="form-label">Tên đăng nhập</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập tên đăng nhập"
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Mật khẩu</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
          />
        </div>

        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default Login;
