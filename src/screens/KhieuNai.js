import React, { useState } from "react";

const KhieuNai = () => {
  const [khieuNaiList, setKhieuNaiList] = useState([
    {
      id: 1,
      hoTen: "Nguyễn Văn A",
      noiDung: "Tiếng ồn từ căn hộ tầng trên.",
      ngayGui: "2025-05-20",
      trangThai: "Chưa xử lý",
    },
    {
      id: 2,
      hoTen: "Trần Thị B",
      noiDung: "Mùi rác hành lang gây khó chịu.",
      ngayGui: "2025-05-21",
      trangThai: "Đã giải quyết",
    },
  ]);

  const [filterTrangThai, setFilterTrangThai] = useState("Tất cả");
  const [searchDate, setSearchDate] = useState("");
  const [editingId, setEditingId] = useState(null); // ID của khiếu nại đang chỉnh sửa

  const handleTrangThaiChange = (id, newTrangThai) => {
    const updatedList = khieuNaiList.map((item) =>
      item.id === id ? { ...item, trangThai: newTrangThai } : item
    );
    setKhieuNaiList(updatedList);
    setEditingId(null); // Thoát chế độ chỉnh sửa sau khi chọn
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

  const filteredList = khieuNaiList.filter((item) => {
    const matchTrangThai =
      filterTrangThai === "Tất cả" || item.trangThai === filterTrangThai;
    const matchDate = !searchDate || item.ngayGui === searchDate;
    return matchTrangThai && matchDate;
  });

  return (
    <div>
      <h2>🤬 Danh sách Khiếu Nại</h2>

      {/* Bộ lọc */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10 }}>Lọc theo trạng thái:</label>
        <select
          value={filterTrangThai}
          onChange={(e) => setFilterTrangThai(e.target.value)}
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
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>

      {/* Bảng khiếu nại */}
      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead style={{ backgroundColor: "#f5f5f5" }}>
          <tr>
            <th>STT</th>
            <th>Họ tên</th>
            <th>Nội dung</th>
            <th>Ngày gửi</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Không tìm thấy khiếu nại phù hợp.
              </td>
            </tr>
          ) : (
            filteredList.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.hoTen}</td>
                <td>{item.noiDung}</td>
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
                      onClick={() => setEditingId(item.id)}
                    >
                      🖊️ {item.trangThai}
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default KhieuNai;
