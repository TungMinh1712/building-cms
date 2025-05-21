import React, { useState } from "react";

const initialData = [
  { id: 1, name: "Nguyễn Văn A", role: "Trưởng Ban", email: "a@example.com" },
  { id: 2, name: "Trần Thị B", role: "Thành viên", email: "b@example.com" },
];

const BanQuanTriList = () => {
  const [data, setData] = useState(initialData);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", role: "", email: "" });

  // Xử lý mở form sửa
  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({ name: item.name, role: item.role, email: item.email });
  };

  // Xử lý lưu sửa
  const handleSave = () => {
    setData(
      data.map((item) => (item.id === editingId ? { ...item, ...form } : item))
    );
    setEditingId(null);
    setForm({ name: "", role: "", email: "" });
  };

  // Xử lý xóa
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa?")) {
      setData(data.filter((item) => item.id !== id));
    }
  };

  // Xử lý thêm mới
  const handleAdd = () => {
    if (!form.name || !form.role || !form.email) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }
    const newId = data.length ? Math.max(...data.map((i) => i.id)) + 1 : 1;
    setData([...data, { id: newId, ...form }]);
    setForm({ name: "", role: "", email: "" });
  };

  return (
    <div>
      <h2>Danh sách Ban Quản Trị</h2>

      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ width: "100%", marginBottom: 20 }}
      >
        <thead>
          <tr style={{ backgroundColor: "#0d6efd", color: "white" }}>
            <th>ID</th>
            <th>Họ và tên</th>
            <th>Vai trò</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
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
        </tbody>
      </table>

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
