import React from "react";
import { Link } from "react-router-dom";

const HomeScreen = () => {
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div
        className="card shadow-lg p-4 p-md-5"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <div className="card-body text-center">
          <h1 className="display-4 fw-bold mb-3">
            Chào mừng đến với hệ thống quản lý 🏢
          </h1>
          <p className="lead text-muted mb-4">
            Hệ thống giúp quản lý Ban Quản Trị, Văn bản, Nhiệm vụ, Cuộc họp và
            Khiếu nại trong chung cư một cách hiệu quả và hiện đại.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/login" className="btn btn-primary btn-lg px-4">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
