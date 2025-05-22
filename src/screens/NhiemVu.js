// src/screens/NhiemVu.js
import React, { useState } from "react";

const initialTasks = [
  {
    id: 1,
    title: "Kiểm tra báo cáo tháng 5",
    status: "Chưa hoàn thành",
    assignee: "",
    deadline: "2025-05-30",
  },
  {
    id: 2,
    title: "Họp Ban quản trị",
    status: "Đã hoàn thành",
    assignee: "Trần Thị B",
    deadline: "2025-05-15",
  },
  {
    id: 3,
    title: "Cập nhật tài liệu dự án",
    status: "Chưa hoàn thành",
    assignee: "",
    deadline: "2025-06-01",
  },
];

const assignees = ["Bùi Thạch Đức", "Nguyễn Phương Nam"];

const NhiemVu = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [form, setForm] = useState({
    title: "",
    status: "Chưa hoàn thành",
    assignee: assignees[0],
    deadline: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 5;

  const handleAdd = () => {
    if (!form.title.trim()) {
      alert("Cần nhập tiêu đề nhiệm vụ!");
      return;
    }
    if (!form.assignee) {
      alert("Cần chọn người phụ trách!");
      return;
    }
    if (!form.deadline) {
      alert("Cần chọn hạn chót cho nhiệm vụ!");
      return;
    }
    const newId =
      tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    setTasks([...tasks, { id: newId, ...form }]);
    setForm({
      title: "",
      status: "Chưa hoàn thành",
      assignee: assignees[0],
      deadline: "",
    });
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setForm({
      title: task.title,
      status: task.status,
      assignee: task.assignee,
      deadline: task.deadline,
    });
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      alert("Cần nhập tiêu đề nhiệm vụ!");
      return;
    }
    if (!form.assignee) {
      alert("Cần chọn người phụ trách!");
      return;
    }
    if (!form.deadline) {
      alert("Cần chọn hạn chót cho nhiệm vụ!");
      return;
    }
    setTasks(
      tasks.map((t) => (t.id === editingId ? { id: editingId, ...form } : t))
    );
    setEditingId(null);
    setForm({
      title: "",
      status: "Chưa hoàn thành",
      assignee: assignees[0],
      deadline: "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      title: "",
      status: "Chưa hoàn thành",
      assignee: assignees[0],
      deadline: "",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhiệm vụ này?")) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const pagedTasks = filteredTasks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <h2>Danh sách Nhiệm Vụ</h2>

      <input
        type="text"
        placeholder="🔍 Tìm theo tiêu đề nhiệm vụ..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />

      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ width: "100%", marginBottom: 20, borderCollapse: "collapse" }}
      >
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th>ID</th>
            <th>Tiêu đề nhiệm vụ</th>
            <th>Trạng thái</th>
            <th>Người phụ trách</th>
            <th>Hạn chót</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {pagedTasks.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", color: "gray" }}>
                Không có nhiệm vụ phù hợp.
              </td>
            </tr>
          )}

          {pagedTasks.map((task) => (
            <tr
              key={task.id}
              style={
                editingId === task.id ? { backgroundColor: "#f0f0f0" } : {}
              }
            >
              <td>{task.id}</td>

              <td>
                {editingId === task.id ? (
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    style={{ width: "100%" }}
                  />
                ) : (
                  task.title
                )}
              </td>

              <td>
                {editingId === task.id ? (
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    <option value="Chưa hoàn thành">Chưa hoàn thành</option>
                    <option value="Đã hoàn thành">Đã hoàn thành</option>
                  </select>
                ) : (
                  task.status
                )}
              </td>

              <td>
                {editingId === task.id ? (
                  <select
                    value={form.assignee}
                    onChange={(e) =>
                      setForm({ ...form, assignee: e.target.value })
                    }
                  >
                    {assignees.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                ) : (
                  task.assignee
                )}
              </td>

              <td>
                {editingId === task.id ? (
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) =>
                      setForm({ ...form, deadline: e.target.value })
                    }
                  />
                ) : (
                  task.deadline
                )}
              </td>

              <td>
                {editingId === task.id ? (
                  <>
                    <button
                      onClick={handleSave}
                      style={{ marginRight: 8 }}
                      title="Lưu thay đổi"
                    >
                      💾 Lưu
                    </button>
                    <button onClick={handleCancel} title="Hủy">
                      ❌ Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(task)}
                      style={{ marginRight: 8 }}
                      title="Sửa"
                    >
                      ✏️ Sửa
                    </button>
                    <button onClick={() => handleDelete(task.id)} title="Xóa">
                      🗑️ Xóa
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form thêm mới */}
      <h3>Thêm nhiệm vụ mới</h3>
      <div
        style={{ display: "flex", gap: 10, marginBottom: 40, flexWrap: "wrap" }}
      >
        <input
          type="text"
          placeholder="Tiêu đề nhiệm vụ"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ flexGrow: 1, minWidth: 200 }}
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Chưa hoàn thành">Chưa hoàn thành</option>
          <option value="Đã hoàn thành">Đã hoàn thành</option>
        </select>
        <select
          value={form.assignee}
          onChange={(e) => setForm({ ...form, assignee: e.target.value })}
        >
          {assignees.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          title="Hạn chót nhiệm vụ"
        />
        <button onClick={handleAdd}>➕ Thêm</button>
      </div>
    </div>
  );
};

export default NhiemVu;
