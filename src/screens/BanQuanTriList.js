import React, { useState, useEffect } from "react";

const initialData = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    role: "Trưởng Ban",
    email: "an.nguyen@chungcu.vn",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    role: "Phó Ban",
    email: "binh.tran@chungcu.vn",
  },
  {
    id: 3,
    name: "Lê Văn Cường",
    role: "Thành viên",
    email: "cuong.le@chungcu.vn",
  },
  {
    id: 4,
    name: "Phạm Thị Dung",
    role: "Thành viên",
    email: "dung.pham@chungcu.vn",
  },
  { id: 5, name: "Đỗ Mạnh Hùng", role: "Thư ký", email: "hung.do@chungcu.vn" },
  {
    id: 6,
    name: "Hoàng Thị Hạnh",
    role: "Kế toán",
    email: "hanh.hoang@chungcu.vn",
  },
  { id: 7, name: "Vũ Văn Khoa", role: "Giám sát", email: "khoa.vu@chungcu.vn" },
  {
    id: 8,
    name: "Ngô Thị Lan",
    role: "Thành viên",
    email: "lan.ngo@chungcu.vn",
  },
  {
    id: 9,
    name: "Bùi Quang Minh",
    role: "Thành viên",
    email: "minh.bui@chungcu.vn",
  },
  { id: 10, name: "Tạ Thị Ngọc", role: "Ủy viên", email: "ngoc.ta@chungcu.vn" },
];

const BanQuanTriList = () => {
  const [data, setData] = useState(() => {
    const stored = localStorage.getItem("banQuanTriData");
    return stored ? JSON.parse(stored) : initialData;
  });

  const [originalOrderData, setOriginalOrderData] = useState(initialData);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", role: "", email: "" });
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    localStorage.setItem("banQuanTriData", JSON.stringify(data));
  }, [data]);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({ name: item.name, role: item.role, email: item.email });
  };

  const handleSave = () => {
    const updated = data.map((item) =>
      item.id === editingId ? { ...item, ...form } : item
    );
    setData(updated);
    setEditingId(null);
    setForm({ name: "", role: "", email: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa?")) {
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
      // Giữ người dùng ở trang hiện tại hợp lệ
      const maxPage = Math.ceil(updatedData.length / itemsPerPage);
      setCurrentPage((prev) => Math.min(prev, maxPage));
    }
  };

  const handleAdd = () => {
    if (!form.name || !form.role || !form.email) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }
    const newId = data.length ? Math.max(...data.map((i) => i.id)) + 1 : 1;
    const newItem = { id: newId, ...form };
    const newData = [...data, newItem];
    setData(newData);
    setOriginalOrderData(newData);
    setForm({ name: "", role: "", email: "" });
    setCurrentPage(Math.ceil(newData.length / itemsPerPage)); // chuyển tới trang cuối
  };

  const handleSort = () => {
    const sorted = [...data].sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    setData(sorted);
    setSortAsc(!sortAsc);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setData(originalOrderData);
    setCurrentPage(1);
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div>
      <h2>Danh sách Ban Quản Trị</h2>

      <div style={{ marginBottom: 10, display: "flex", gap: 10 }}>
        <input
          type="text"
          placeholder="🔍 Tìm theo tên hoặc email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          style={{ flex: 1 }}
        />
        <button onClick={handleSort}>{sortAsc ? "🔼 A-Z" : "🔽 Z-A"}</button>
        <button onClick={handleReset}>🔄 Reset</button>
      </div>

      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ width: "100%", marginBottom: 20 }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>ID</th>
            <th>Họ và tên</th>
            <th>Vai trò</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr
              key={item.id}
              style={
                editingId === item.id
                  ? { backgroundColor: "#ffeeba" }
                  : undefined
              }
            >
              <td>{item.id}</td>
              <td>
                {editingId === item.id ? (
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                ) : (
                  item.name
                )}
              </td>
              <td>
                {editingId === item.id ? (
                  <input
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
                ) : (
                  item.role
                )}
              </td>
              <td>
                {editingId === item.id ? (
                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                ) : (
                  item.email
                )}
              </td>
              <td>
                {editingId === item.id ? (
                  <>
                    <button onClick={handleSave} style={{ marginRight: 8 }}>
                      💾 Lưu
                    </button>
                    <button onClick={() => setEditingId(null)}>❌ Hủy</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(item)}
                      style={{ marginRight: 8 }}
                    >
                      ✏️ Sửa
                    </button>
                    <button onClick={() => handleDelete(item.id)}>
                      🗑️ Xóa
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {paginatedData.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", color: "gray" }}>
                Không tìm thấy thành viên nào...
              </td>
            </tr>
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

      <h3>Thêm thành viên mới</h3>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Họ và tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Vai trò"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <button onClick={handleAdd}>➕ Thêm</button>
      </div>
    </div>
  );
};

export default BanQuanTriList;
