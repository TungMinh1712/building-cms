import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import callApi from "../../apis/handleapi";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      alert("Vui lòng nhập đủ thông tin");
      return;
    }
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }

    try {
      // Giả lập gọi API đăng ký
      const res = await callApi("/register", "POST", { username, password });

      if (res.success) {
        alert("Đăng ký thành công, mời đăng nhập");
        navigate("/login");
      } else {
        alert("Đăng ký thất bại: " + (res.message || "Lỗi không rõ"));
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi đăng ký, thử lại sau");
    }
  };

  return (
    <div>
      <h2>Đăng ký</h2>
      <input
        type="text"
        placeholder="Tên đăng nhập"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <br />
      <button onClick={handleRegister}>Đăng ký</button>
    </div>
  );
};

export default Register;
