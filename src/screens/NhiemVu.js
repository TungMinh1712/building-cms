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
    assignee: "Trần Thị Bình",
    deadline: "2025-05-15",
  },
  {
    id: 3,
    title: "Cập nhật tài liệu dự án",
    status: "Chưa hoàn thành",
    assignee: "",
    deadline: "2025-06-01",
  },
  {
    id: 4,
    title: "Kiểm tra hệ thống PCCC",
    status: "Chưa hoàn thành",
    assignee: "Nguyễn Văn An",
    deadline: "2025-06-05",
  },
  {
    id: 5,
    title: "Chuẩn bị nội dung họp tháng 6",
    status: "Đã hoàn thành",
    assignee: "Lê Văn Cường",
    deadline: "2025-05-28",
  },
  {
    id: 6,
    title: "Gửi email mời họp",
    status: "Đã hoàn thành",
    assignee: "Phạm Thị Dung",
    deadline: "2025-05-20",
  },
  {
    id: 7,
    title: "Tổng hợp ý kiến cư dân",
    status: "Chưa hoàn thành",
    assignee: "Trần Thị Bình",
    deadline: "2025-06-07",
  },
  {
    id: 8,
    title: "Hoàn thiện báo cáo tài chính quý II",
    status: "Chưa hoàn thành",
    assignee: "Nguyễn Văn An",
    deadline: "2025-06-10",
  },
  {
    id: 9,
    title: "Cập nhật phần mềm quản lý",
    status: "Chưa hoàn thành",
    assignee: "Lê Văn Cường",
    deadline: "2025-06-12",
  },
  {
    id: 10,
    title: "Kiểm kê trang thiết bị văn phòng",
    status: "Chưa hoàn thành",
    assignee: "",
    deadline: "2025-06-15",
  },
];

const assignees = [
  "Nguyễn Văn An",
  "Trần Thị Bình",
  "Lê Văn Cường",
  "Phạm Thị Dung",
  "Hoàng Thị Hạnh",
  "Vũ Văn Khoa",
  "Ngô Thị Lan",
  "Bùi Quang Minh",
  "Tạ Thị Ngọc",
];

const STORAGE_KEY = "tasks_nhiemvu";

const NhiemVu = () => {
  // Lấy data từ localStorage nếu có, không thì dùng initialTasks
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [form, setForm] = useState({
    title: "",
    status: "Chưa hoàn thành",
    assignee: assignees[0],
    deadline: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Hàm cập nhật task và đồng bộ localStorage luôn
  const updateTasks = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
  };

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
    const newTasks = [...tasks, { id: newId, ...form }];
    updateTasks(newTasks);
    setCurrentPage(Math.ceil(newTasks.length / itemsPerPage)); // Chuyển tới trang cuối
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
    const newTasks = tasks.map((t) =>
      t.id === editingId ? { id: editingId, ...form } : t
    );
    updateTasks(newTasks);
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
      const newTasks = tasks.filter((t) => t.id !== id);
      updateTasks(newTasks);
      // Điều chỉnh trang hiện tại nếu cần
      const maxPage = Math.ceil(newTasks.length / itemsPerPage);
      setCurrentPage((prev) => Math.min(prev, maxPage || 1));
    }
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  // Phân trang
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = filteredTasks.slice(
    startIndex,
    startIndex + itemsPerPage
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
          {paginatedTasks.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", color: "gray" }}>
                Không có nhiệm vụ phù hợp.
              </td>
            </tr>
          )}

          {paginatedTasks.map((task) => (
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
        />
        {!editingId && (
          <button
            onClick={handleAdd}
            style={{ backgroundColor: "#4CAF50", color: "white" }}
          >
            ➕ Thêm
          </button>
        )}
      </div>
    </div>
  );
};

export default NhiemVu;
