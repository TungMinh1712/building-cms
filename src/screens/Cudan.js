import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cudan = ({ onLogout }) => {
  const navigate = useNavigate();

  // State for complaint form
  const [hoTen, setHoTen] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);

  // State for document list
  const [vanBanList, setVanBanList] = useState([]);
  const [selectedVanBan, setSelectedVanBan] = useState(null);
  const [fileURLs, setFileURLs] = useState({}); // id -> objectURL

  // Load documents from localStorage on mount
  useEffect(() => {
    const savedVanBan = localStorage.getItem("vanBanDocuments");
    if (savedVanBan) {
      try {
        setVanBanList(JSON.parse(savedVanBan));
      } catch (e) {
        console.error("Lỗi khi parse vanBanDocuments:", e);
      }
    }
  }, []);

  // Create and cleanup URL objects for file downloads
  useEffect(() => {
    const newFileURLs = {};
    vanBanList.forEach((doc) => {
      if (doc.file && doc.file.data) {
        const byteCharacters = atob(doc.file.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: doc.file.type });
        newFileURLs[doc.id] = URL.createObjectURL(blob);
      }
    });
    // Cleanup old URLs
    Object.values(fileURLs).forEach((url) => URL.revokeObjectURL(url));
    setFileURLs(newFileURLs);

    // Cleanup when unmount
    return () => {
      Object.values(newFileURLs).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [vanBanList]);

  // Check localStorage size to prevent QuotaExceededError
  const checkStorageSize = () => {
    let total = 0;
    for (let x in localStorage) {
      if (localStorage.hasOwnProperty(x)) {
        total += (localStorage[x].length + x.length) * 2;
      }
    }
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    return total < maxSize * 0.9; // Allow 90% of max size
  };

  // Handle complaint form submission
  const handleSubmitKhieuNai = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!hoTen.trim() || !noiDung.trim()) {
      setError("Vui lòng nhập đầy đủ họ tên và nội dung khiếu nại.");
      setSuccess("");
      return;
    }

    // Check storage availability
    if (!checkStorageSize()) {
      setError("Dung lượng lưu trữ đầy. Vui lòng xóa bớt dữ liệu.");
      setSuccess("");
      return;
    }

    // Get current complaints from localStorage
    const savedKhieuNai = localStorage.getItem("khieuNaiList");
    let khieuNaiList = savedKhieuNai ? JSON.parse(savedKhieuNai) : [];

    // Limit complaint list to prevent storage issues
    if (khieuNaiList.length >= 100) {
      khieuNaiList = khieuNaiList.slice(-99); // Keep last 99 complaints
    }

    // Generate new complaint
    const newKhieuNai = {
      id:
        khieuNaiList.length > 0
          ? Math.max(...khieuNaiList.map((item) => item.id)) + 1
          : 1,
      hoTen: hoTen.trim(),
      noiDung: noiDung.trim(),
      ngayGui: new Date().toISOString().split("T")[0],
      trangThai: "Chưa xử lý",
    };

    // Update localStorage
    khieuNaiList.push(newKhieuNai);
    try {
      localStorage.setItem("khieuNaiList", JSON.stringify(khieuNaiList));
      setHoTen("");
      setNoiDung("");
      setError("");
      setSuccess("Khiếu nại đã được gửi thành công!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError("Lỗi lưu trữ: Dung lượng localStorage đã đầy.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    navigate("/login");
  };

  // Handle modal open/close
  const handleOpenModal = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setHoTen("");
    setNoiDung("");
    setError("");
    setSuccess("");
  };

  // Handle document selection
  const handleSelectVanBan = (vanBan) => {
    setSelectedVanBan(vanBan);
  };

  const handleCloseVanBan = () => {
    setSelectedVanBan(null);
  };

  // Render file link for download
  const renderFileLink = (doc) => {
    if (!doc.file) return <i style={{ color: "gray" }}>Chưa có file</i>;
    const url = fileURLs[doc.id];
    if (!url) return <i style={{ color: "gray" }}>Đang tải...</i>;
    return (
      <a href={url} download={doc.file.name} title="Tải xuống file văn bản">
        📄 {doc.file.name}
      </a>
    );
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Bootstrap CSS CDN */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossOrigin="anonymous"
      />

      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            Cổng Cư Dân
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={handleOpenModal}>
                  Gửi Khiếu Nại
                </a>
              </li>

              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light ms-2"
                >
                  Đăng Xuất
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Welcome Section */}
      <section className="container py-5 text-center">
        <h2 className="display-6 fw-semibold mb-4">
          Chào mừng bạn đến với trang dành cho cư dân!
        </h2>
        <p className="lead text-muted col-md-8 mx-auto">
          Đây là nơi bạn có thể xem văn bản và gửi khiếu nại của bạn!
        </p>
      </section>

      {/* Document List Section */}
      <section className="container py-5">
        <h3 className="fw-semibold mb-4 text-center">Danh Sách Văn Bản</h3>
        <div className="card shadow-sm p-4 col-md-8 mx-auto">
          {vanBanList.length === 0 ? (
            <p className="text-center text-muted">Không có văn bản nào.</p>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">STT</th>
                  <th scope="col">Tiêu Đề</th>
                  <th scope="col">Loại Văn Bản</th>
                  <th scope="col">Ngày Ban Hành</th>
                  <th scope="col">File</th>
                </tr>
              </thead>
              <tbody>
                {vanBanList.map((vanBan, index) => (
                  <tr
                    key={vanBan.id}
                    onClick={() => handleSelectVanBan(vanBan)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{index + 1}</td>
                    <td>{vanBan.title}</td>
                    <td>{vanBan.type}</td>
                    <td>{vanBan.issuedDate}</td>
                    <td>{renderFileLink(vanBan)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Document Detail Modal */}
      {selectedVanBan && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          aria-labelledby="vanBanModalLabel"
          aria-hidden="false"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="vanBanModalLabel">
                  {selectedVanBan.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseVanBan}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Loại Văn Bản:</strong> {selectedVanBan.type}
                </p>
                <p>
                  <strong>Ngày Ban Hành:</strong> {selectedVanBan.issuedDate}
                </p>
                <p>
                  <strong>File:</strong>{" "}
                  {selectedVanBan.file ? (
                    renderFileLink(selectedVanBan)
                  ) : (
                    <i style={{ color: "gray" }}>Chưa có file</i>
                  )}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseVanBan}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedVanBan && <div className="modal-backdrop fade show"></div>}

      {/* Complaint Form Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        aria-labelledby="khieuNaiModalLabel"
        aria-hidden={!showModal}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="khieuNaiModalLabel">
                Gửi Khiếu Nại
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="hoTen" className="form-label fw-bold">
                  Họ Tên
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="hoTen"
                  value={hoTen}
                  onChange={(e) => setHoTen(e.target.value)}
                  placeholder="Nhập họ tên của bạn"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="noiDung" className="form-label fw-bold">
                  Nội Dung Khiếu Nại
                </label>
                <textarea
                  className="form-control"
                  id="noiDung"
                  rows="4"
                  value={noiDung}
                  onChange={(e) => setNoiDung(e.target.value)}
                  placeholder="Mô tả vấn đề bạn gặp phải"
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Đóng
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmitKhieuNai}
              >
                Gửi Khiếu Nại
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && <div className="modal-backdrop fade show"></div>}

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">© 2025 Cổng Cư Dân. All rights reserved.</p>
      </footer>

      {/* Bootstrap JS CDN */}
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossOrigin="anonymous"
      ></script>
    </div>
  );
};

export default Cudan;
