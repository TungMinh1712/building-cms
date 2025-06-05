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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Đăng ký tài khoản</h3>

              <div className="mb-3">
                <label className="form-label">Tên đăng nhập</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Mật khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                className="btn btn-success w-100"
                onClick={handleRegister}
              >
                Đăng ký
              </button>
              <p className="text-center mt-3">
                Đã có tài khoản?{" "}
                <span
                  className="text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
// This code defines a Register component that allows users to create a new account.
