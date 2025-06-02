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
      // Giả lập gọi API đăng nhập, bạn sửa endpoint thật sau nhé
      const res = await callApi("/login", "POST", { username, password });

      // Giả sử res trả về object { token, user }
      if (res.token) {
        localStorage.setItem("user", JSON.stringify(res));
        alert("Đăng nhập thành công");
        
        // Gọi callback báo cho App biết login thành công
        onLoginSuccess();

        // Redirect sau khi cập nhật state
        navigate("/bqt");
      } else {
        alert("Đăng nhập thất bại: " + (res.message || "Lỗi không rõ"));
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi đăng nhập, thử lại sau");
    }
  };

  return (
    <div>
      <h2>Đăng nhập</h2>
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
      <button onClick={handleLogin}>Đăng nhập</button>
    </div>
  );
};

export default Login;
