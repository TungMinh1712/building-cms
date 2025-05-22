import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import callApi from "../../apis/handleapi";
import { login } from "../../utils/auth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await callApi("/login", "POST", { username, password });

      if (res && res.token) {
        login({ username, token: res.token }); // lưu token & username vào localStorage
        alert("Đăng nhập thành công!");
        navigate("/bqt"); // chuyển trang sau khi login
      } else {
        alert("Đăng nhập thất bại!");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi server hoặc thông tin không đúng");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>🔐 Đăng nhập</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default Login;
