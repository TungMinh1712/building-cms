import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cudan = ({ onLogout }) => {
  const navigate = useNavigate();

  // Trạng thái cho form khiếu nại
  const [hoTen, setHoTen] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Trạng thái cho danh sách văn bản
  const [vanBanList, setVanBanList] = useState([]);
  const [selectedVanBan, setSelectedVanBan] = useState(null);
  const [fileURLs, setFileURLs] = useState({});
  const [showVanBanModal, setShowVanBanModal] = useState(false);

  // Dữ liệu thông báo mẫu
  const announcements = [
    {
      id: 1,
      title: "Thông báo bảo trì thang máy",
      date: "2025-06-10",
      content:
        "Thang máy tòa A sẽ được bảo trì từ 9:00 đến 12:00 ngày 10/06/2025.",
    },
    {
      id: 2,
      title: "Họp cư dân quý 2",
      date: "2025-06-15",
      content:
        "Mời cư dân tham dự họp tại hội trường B vào 19:00 ngày 15/06/2025.",
    },
    {
      id: 3,
      title: "Cập nhật quy định gửi xe",
      date: "2025-06-05",
      content: "Quy định mới về gửi xe có hiệu lực từ 10/06/2025.",
    },
  ];

  // Tải văn bản từ localStorage khi mount
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

  // Tạo và dọn dẹp URL cho file tải xuống
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
    Object.values(fileURLs).forEach((url) => URL.revokeObjectURL(url));
    setFileURLs(newFileURLs);

    return () => {
      Object.values(newFileURLs).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [vanBanList]);

  // Kiểm tra dung lượng localStorage
  const checkStorageSize = () => {
    let total = 0;
    for (let x in localStorage) {
      if (localStorage.hasOwnProperty(x)) {
        total += (localStorage[x].length + x.length) * 2;
      }
    }
    const maxSize = 5 * 1024 * 1024;
    return total < maxSize * 0.9;
  };

  // Xử lý gửi form khiếu nại
  const handleSubmitKhieuNai = (e) => {
    e.preventDefault();
    if (!hoTen.trim() || !noiDung.trim()) {
      setError("Vui lòng nhập đầy đủ họ tên và nội dung khiếu nại.");
      setSuccess("");
      return;
    }
    if (!checkStorageSize()) {
      setError("Dung lượng lưu trữ đầy. Vui lòng xóa bớt dữ liệu.");
      setSuccess("");
      return;
    }
    const savedKhieuNai = localStorage.getItem("khieuNaiList");
    let khieuNaiList = savedKhieuNai ? JSON.parse(savedKhieuNai) : [];
    if (khieuNaiList.length >= 100) {
      khieuNaiList = khieuNaiList.slice(-99);
    }
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

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    navigate("/login");
  };

  // Xử lý mở/đóng modal
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

  // Xử lý modal danh sách văn bản
  const handleOpenVanBanModal = (e) => {
    e.preventDefault();
    setShowVanBanModal(true);
  };

  const handleCloseVanBanModal = () => {
    setShowVanBanModal(false);
    setSelectedVanBan(null);
  };

  // Xử lý chọn văn bản
  const handleSelectVanBan = (vanBan) => {
    setSelectedVanBan(vanBan);
  };

  // Hiển thị liên kết tải file
  const renderFileLink = (doc) => {
    if (!doc.file) return <i style={{ color: "#6c757d" }}>Chưa có file</i>;
    const url = fileURLs[doc.id];
    if (!url) return <i style={{ color: "#6c757d" }}>Đang tải...</i>;
    return (
      <a
        href={url}
        download={doc.file.name}
        className="text-primary text-decoration-underline"
        title="Tải xuống file văn bản"
      >
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

      {/* CSS tùy chỉnh */}
      <style>
        {`
          .navbar {
            background: linear-gradient(to right, #0062cc, #6610f2);
          }
          .navbar-brand, .nav-link {
            font-weight: 600;
          }
          .nav-link:hover {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
          }
          .welcome-section {
            background: linear-gradient(to bottom, #ffffff, #f8f9fa);
            border-radius: 10px;
            padding: 3rem;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .card {
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          }
          .quick-link-btn {
            padding: 1rem;
            font-size: 1.1rem;
            font-weight: 500;
            border-radius: 8px;
            transition: background-color 0.2s;
          }
          .quick-link-btn:hover {
            filter: brightness(90%);
          }
          .modal-header {
            background: linear-gradient(to right, #0062cc, #6610f2);
            color: white;
          }
          .footer {
            background-color: #212529;
            padding: 1.5rem;
          }
        `}
      </style>

      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark shadow">
        <div className="container">
          <a className="navbar-brand" href="#">
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
                <a
                  className="nav-link"
                  href="#"
                  onClick={handleOpenVanBanModal}
                >
                  Văn Bản
                </a>
              </li>
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
      <section className="container py-5 text-center welcome-section">
        <h2 className="display-5 fw-bold mb-4">
          Chào mừng đến với Cổng Cư Dân!
        </h2>
        <p className="lead text-muted col-md-8 mx-auto mb-5">
          Kết nối với ban quản lý, xem thông báo mới nhất, gửi khiếu nại, và
          truy cập các văn bản quan trọng một cách dễ dàng.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-primary px-5 py-2"
            onClick={handleOpenVanBanModal}
          >
            Xem Văn Bản
          </button>
          <button
            className="btn btn-outline-primary px-5 py-2"
            onClick={handleOpenModal}
          >
            Gửi Khiếu Nại
          </button>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="container py-5">
        <h3 className="text-center fw-bold mb-4">Thông Báo Nổi Bật</h3>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="col">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{announcement.title}</h5>
                  <p className="card-text text-muted">
                    <strong>Ngày:</strong> {announcement.date}
                  </p>
                  <p className="card-text">{announcement.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="container py-5">
        <h3 className="text-center fw-bold mb-4">Liên Kết Nhanh</h3>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
          <div className="col">
            <button
              className="btn btn-primary quick-link-btn w-100"
              style={{ backgroundColor: "#007bff" }}
              onClick={handleOpenVanBanModal}
            >
              📜 Xem Văn Bản
            </button>
          </div>
          <div className="col">
            <button
              className="btn btn-success quick-link-btn w-100"
              style={{ backgroundColor: "#28a745" }}
              onClick={handleOpenModal}
            >
              📩 Gửi Khiếu Nại
            </button>
          </div>
          <div className="col">
            <button
              className="btn btn-warning quick-link-btn w-100"
              style={{ backgroundColor: "#ffc107" }}
              onClick={() => alert("Tính năng đang phát triển!")}
            >
              🔔 Xem Thông Báo
            </button>
          </div>
          <div className="col">
            <button
              className="btn btn-info quick-link-btn w-100"
              style={{ backgroundColor: "#17a2b8" }}
              onClick={() => alert("Tính năng đang phát triển!")}
            >
              📅 Lịch Sự Kiện
            </button>
          </div>
        </div>
      </section>

      {/* Document List Modal */}
      <div
        className={`modal fade ${showVanBanModal ? "show" : ""}`}
        style={{ display: showVanBanModal ? "block" : "none" }}
        tabIndex="-1"
        aria-labelledby="vanBanListModalLabel"
        aria-hidden={!showVanBanModal}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="vanBanListModalLabel">
                Danh Sách Văn Bản
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseVanBanModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {vanBanList.length === 0 ? (
                <p className="text-center text-muted">Không có văn bản nào.</p>
              ) : (
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Tiêu Đề</th>
                      <th scope="col">Ngày Ban Hành</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vanBanList.map((vanBan) => (
                      <tr
                        key={vanBan.id}
                        onClick={() => handleSelectVanBan(vanBan)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{vanBan.title}</td>
                        <td>{vanBan.issuedDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseVanBanModal}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
      {showVanBanModal && <div className="modal-backdrop fade show"></div>}

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
                  onClick={() => setSelectedVanBan(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-3">
                  <strong>Loại Văn Bản:</strong> {selectedVanBan.type}
                </p>
                <p className="mb-3">
                  <strong>Ngày Ban Hành:</strong> {selectedVanBan.issuedDate}
                </p>
                <p className="mb-3">
                  <strong>File:</strong> {renderFileLink(selectedVanBan)}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedVanBan(null)}
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
              <div className="mb-4">
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
              <div className="mb-4">
                <label htmlFor="noiDung" className="form-label fw-bold">
                  Nội Dung Khiếu Nại
                </label>
                <textarea
                  className="form-control"
                  id="noiDung"
                  rows="5"
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
      <footer className="text-white text-center py-3 footer">
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
