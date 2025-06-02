import React from "react";
import { Link } from "react-router-dom";

const HomeScreen = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Chào mừng đến với hệ thống quản lý 🏢</h1>
      <p style={styles.description}>
        Hệ thống giúp quản lý Ban Quản Trị, Văn bản, Nhiệm vụ, Cuộc họp và Khiếu
        nại trong chung cư một cách hiệu quả và hiện đại.
      </p>
      <div style={styles.buttonContainer}>
        <Link to="/login" style={styles.button}>
          Đăng nhập
        </Link>
        <Link
          to="/register"
          style={{ ...styles.button, backgroundColor: "#34d399" }}
        >
          Đăng ký
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "10%",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },
  description: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
    color: "#555",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "1rem",
  },
};

export default HomeScreen;
