import React, { useState, useEffect } from "react";
import { initialData as BanQuanTriList } from "./BanQuanTriList"; // Giả sử BanQuanTriList được import từ file khác

const KhieuNai = () => {
  const [khieuNaiList, setKhieuNaiList] = useState(() => {
    const saved = localStorage.getItem("khieuNaiList");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            hoTen: "Nguyễn Văn A",
            noiDung: "Tiếng ồn từ căn hộ tầng trên.",
            ngayGui: "2025-05-20",
            trangThai: "Chưa xử lý",
            nguoiPhuTrachId: null,
          },
          {
            id: 2,
            hoTen: "Trần Thị B",
            noiDung: "Mùi rác hành lang gây khó chịu.",
            ngayGui: "2025-05-21",
            trangThai: "Đã giải quyết",
            nguoiPhuTrachId: 2,
          },
          {
            id: 3,
            hoTen: "Lê Văn C",
            noiDung: "Thang máy hay bị hỏng.",
            ngayGui: "2025-05-22",
            trangThai: "Đang xử lý",
            nguoiPhuTrachId: 1, // Chưa gán
          },
          {
            id: 4,
            hoTen: "Phạm Thị D",
            noiDung: "Hành lang không được vệ sinh thường xuyên.",
            ngayGui: "2025-05-23",
            trangThai: "Chưa xử lý",
            nguoiPhuTrachId: 3,
          },
          {
            id: 5,
            hoTen: "Hoàng Văn E",
            noiDung: "Chó đi vệ sinh bừa bãi khu vực công cộng.",
            ngayGui: "2025-05-23",
            trangThai: "Đã giải quyết",
            nguoiPhuTrachId: 4,
          },
          {
            id: 6,
            hoTen: "Đỗ Thị F",
            noiDung: "Không có chỗ đậu xe cho khách.",
            ngayGui: "2025-05-24",
            trangThai: "Đang xử lý",
            nguoiPhuTrachId: 9,
          },
          {
            id: 7,
            hoTen: "Trịnh Văn G",
            noiDung: "Camera an ninh hoạt động không ổn định.",
            ngayGui: "2025-05-25",
            trangThai: "Chưa xử lý",
            nguoiPhuTrachId: 5,
          },
          {
            id: 8,
            hoTen: "Ngô Thị H",
            noiDung: "Ban quản lý không phản hồi email.",
            ngayGui: "2025-05-26",
            trangThai: "Chưa xử lý",
            nguoiPhuTrachId: null,
          },
          {
            id: 9,
            hoTen: "Bùi Văn I",
            noiDung: "Hệ thống điện hành lang chập chờn.",
            ngayGui: "2025-05-26",
            trangThai: "Đang xử lý",
            nguoiPhuTrachId: 6,
          },
          {
            id: 10,
            hoTen: "Lý Thị K",
            noiDung: "Không có nước nóng vào buổi sáng.",
            ngayGui: "2025-05-27",
            trangThai: "Đã giải quyết",
            nguoiPhuTrachId: 7,
          },
        ];
  });

  const [filterTrangThai, setFilterTrangThai] = useState("Tất cả");
  const [searchDate, setSearchDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingNguoiPhuTrachId, setEditingNguoiPhuTrachId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKhieuNai, setSelectedKhieuNai] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    localStorage.setItem("khieuNaiList", JSON.stringify(khieuNaiList));
  }, [khieuNaiList]);

  const handleTrangThaiChange = (id, newTrangThai) => {
    const updatedList = khieuNaiList.map((item) =>
      item.id === id ? { ...item, trangThai: newTrangThai } : item
    );
    setKhieuNaiList(updatedList);
    setSelectedKhieuNai((prev) =>
      prev && prev.id === id ? { ...prev, trangThai: newTrangThai } : prev
    );
    setEditingId(null);
  };

  const handleNguoiPhuTrachChange = (id, newNguoiPhuTrachId) => {
    const updatedList = khieuNaiList.map((item) =>
      item.id === id
        ? {
            ...item,
            nguoiPhuTrachId: newNguoiPhuTrachId
              ? Number(newNguoiPhuTrachId)
              : null,
          }
        : item
    );
    setKhieuNaiList(updatedList);
    setSelectedKhieuNai((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            nguoiPhuTrachId: newNguoiPhuTrachId
              ? Number(newNguoiPhuTrachId)
              : null,
          }
        : prev
    );
    setEditingNguoiPhuTrachId(null);
  };

  const handleDeleteKhieuNai = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khiếu nại này?")) {
      const updatedList = khieuNaiList.filter((item) => item.id !== id);
      setKhieuNaiList(updatedList);
      if (selectedKhieuNai && selectedKhieuNai.id === id) {
        setSelectedKhieuNai(null);
      }
      const totalPagesAfterDelete = Math.ceil(
        updatedList.length / itemsPerPage
      );
      if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
        setCurrentPage(totalPagesAfterDelete);
      }
    }
  };

  const getColor = (trangThai) => {
    switch (trangThai) {
      case "Chưa xử lý":
        return "red";
      case "Đang xử lý":
        return "orange";
      case "Đã giải quyết":
        return "green";
      default:
        return "black";
    }
  };

  const getNguoiPhuTrachName = (nguoiPhuTrachId) => {
    if (!nguoiPhuTrachId) return "Chưa phân công";
    const nguoiPhuTrach = BanQuanTriList.find(
      (member) => member.id === nguoiPhuTrachId
    );
    return nguoiPhuTrach ? nguoiPhuTrach.name : "Chưa phân công";
  };

  const filteredList = khieuNaiList.filter((item) => {
    const matchTrangThai =
      filterTrangThai === "Tất cả" || item.trangThai === filterTrangThai;
    const matchDate = !searchDate || item.ngayGui === searchDate;
    return matchTrangThai && matchDate;
  });

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = filteredList.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSelectKhieuNai = (item) => {
    setSelectedKhieuNai(item);
  };

  const handleCloseDetail = () => {
    setSelectedKhieuNai(null);
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <h2>🤬 Danh sách Khiếu Nại</h2>

      {/* Bộ lọc */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10 }}>Lọc theo trạng thái:</label>
        <select
          value={filterTrangThai}
          onChange={(e) => {
            setFilterTrangThai(e.target.value);
            setCurrentPage(1);
            setSelectedKhieuNai(null);
          }}
          style={{ marginRight: 20 }}
        >
          <option value="Tất cả">Tất cả</option>
          <option value="Chưa xử lý">Chưa xử lý</option>
          <option value="Đang xử lý">Đang xử lý</option>
          <option value="Đã giải quyết">Đã giải quyết</option>
        </select>

        <label style={{ marginRight: 10 }}>Tìm theo ngày gửi:</label>
        <input
          type="date"
          value={searchDate}
          onChange={(e) => {
            setSearchDate(e.target.value);
            setCurrentPage(1);
            setSelectedKhieuNai(null);
          }}
        />
      </div>

      {/* Bảng khiếu nại */}
      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead style={{ backgroundColor: "#f5f5f5" }}>
          <tr>
            <th>STT</th>
            <th>Họ tên</th>
            <th>Ngày gửi</th>
            <th>Trạng thái</th>
            <th>Người phụ trách</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedList.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Không tìm thấy khiếu nại phù hợp.
              </td>
            </tr>
          ) : (
            paginatedList.map((item, index) => (
              <tr
                key={item.id}
                onClick={() => handleSelectKhieuNai(item)}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedKhieuNai && selectedKhieuNai.id === item.id
                      ? "#fff3cd"
                      : "transparent",
                }}
              >
                <td>{startIndex + index + 1}</td>
                <td>{item.hoTen}</td>
                <td>{item.ngayGui}</td>
                <td>
                  {editingId === item.id ? (
                    <select
                      value={item.trangThai}
                      onChange={(e) =>
                        handleTrangThaiChange(item.id, e.target.value)
                      }
                    >
                      <option value="Chưa xử lý">Chưa xử lý</option>
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Đã giải quyết">Đã giải quyết</option>
                    </select>
                  ) : (
                    <span
                      style={{
                        color: getColor(item.trangThai),
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(item.id);
                      }}
                    >
                      {item.trangThai}
                    </span>
                  )}
                </td>
                <td>
                  {editingNguoiPhuTrachId === item.id ? (
                    <select
                      value={item.nguoiPhuTrachId || ""}
                      onChange={(e) =>
                        handleNguoiPhuTrachChange(item.id, e.target.value)
                      }
                    >
                      <option value="">Chưa phân công</option>
                      {BanQuanTriList.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      style={{
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingNguoiPhuTrachId(item.id);
                      }}
                    >
                      {getNguoiPhuTrachName(item.nguoiPhuTrachId)}
                    </span>
                  )}
                </td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteKhieuNai(item.id);
                    }}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Điều khiển phân trang */}
      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          ◀ Trước
        </button>
        <span style={{ margin: "0 10px" }}>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Sau ▶
        </button>
      </div>

      {/* Chi tiết khiếu nại */}
      {selectedKhieuNai && (
        <div
          style={{
            border: "1px solid #ddd",
            padding: 15,
            borderRadius: 6,
            marginTop: 20,
            backgroundColor: "#fafafa",
          }}
        >
          <h3>Chi tiết Khiếu Nại</h3>
          <p>
            <strong>ID:</strong> {selectedKhieuNai.id}
          </p>
          <p>
            <strong>Họ tên:</strong> {selectedKhieuNai.hoTen}
          </p>
          <p>
            <strong>Nội dung:</strong> {selectedKhieuNai.noiDung}
          </p>
          <p>
            <strong>Ngày gửi:</strong> {selectedKhieuNai.ngayGui}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            <span style={{ color: getColor(selectedKhieuNai.trangThai) }}>
              {selectedKhieuNai.trangThai}
            </span>
          </p>
          <p>
            <strong>Người phụ trách:</strong>{" "}
            {editingNguoiPhuTrachId === selectedKhieuNai.id ? (
              <select
                value={selectedKhieuNai.nguoiPhuTrachId || ""}
                onChange={(e) =>
                  handleNguoiPhuTrachChange(selectedKhieuNai.id, e.target.value)
                }
              >
                <option value="">Chưa phân công</option>
                {BanQuanTriList.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            ) : (
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setEditingNguoiPhuTrachId(selectedKhieuNai.id)}
              >
                {getNguoiPhuTrachName(selectedKhieuNai.nguoiPhuTrachId)}
              </span>
            )}
          </p>
          <button
            onClick={handleCloseDetail}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              padding: "8px 16px",
              marginRight: "10px",
            }}
          >
            Đóng
          </button>
          <button
            onClick={() => handleDeleteKhieuNai(selectedKhieuNai.id)}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              padding: "8px 16px",
            }}
          >
            🗑️ Xóa
          </button>
        </div>
      )}
    </div>
  );
};

export default KhieuNai;
