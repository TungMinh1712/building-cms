import React, { useState, useEffect } from "react";

function CuocHop() {
  // Load dữ liệu từ localStorage (nếu có)
  const getSavedMeetings = () => {
    const saved = localStorage.getItem("meetings");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            title: "Họp Ban Quản Trị",
            datetime: "2025-05-25T09:00",
            location: "Tòa A.1.01",
          },
          {
            id: 2,
            title: "Họp Dự án CNTT",
            datetime: "2025-05-26T14:00",
            location: "Tòa B.1.01",
          },
        ];
  };

  const [meetings, setMeetings] = useState(getSavedMeetings);
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    datetime: "",
    location: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const itemsPerPage = 5;

  // Cập nhật localStorage mỗi khi meetings thay đổi
  useEffect(() => {
    localStorage.setItem("meetings", JSON.stringify(meetings));
  }, [meetings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMeeting((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    if (!newMeeting.title || !newMeeting.datetime || !newMeeting.location) {
      alert("Điền đầy đủ thông tin cuộc họp đi bạn!");
      return;
    }
    const newId = meetings.length
      ? Math.max(...meetings.map((m) => m.id)) + 1
      : 1;
    const newMeetings = [...meetings, { id: newId, ...newMeeting }];
    setMeetings(newMeetings);
    setCurrentPage(Math.ceil(newMeetings.length / itemsPerPage)); // Chuyển tới trang cuối
    setNewMeeting({ title: "", datetime: "", location: "" });
  };

  const handleEdit = (meeting) => {
    setEditingId(meeting.id);
    setNewMeeting({
      title: meeting.title,
      datetime: meeting.datetime,
      location: meeting.location,
    });
  };

  const handleSave = () => {
    if (!newMeeting.title || !newMeeting.datetime || !newMeeting.location) {
      alert("Điền đầy đủ thông tin cuộc họp đi bạn!");
      return;
    }
    const updatedMeetings = meetings.map((m) =>
      m.id === editingId ? { id: editingId, ...newMeeting } : m
    );
    setMeetings(updatedMeetings);
    setEditingId(null);
    setNewMeeting({ title: "", datetime: "", location: "" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewMeeting({ title: "", datetime: "", location: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa cuộc họp này chứ?")) {
      const newMeetings = meetings.filter((m) => m.id !== id);
      setMeetings(newMeetings);
      // Điều chỉnh trang hiện tại nếu cần
      const maxPage = Math.ceil(newMeetings.length / itemsPerPage);
      setCurrentPage((prev) => Math.min(prev, maxPage || 1));
    }
  };

  // Phân trang
  const totalPages = Math.ceil(meetings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMeetings = meetings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <h2>Quản lý Cuộc họp</h2>

      <div
        style={{
          marginBottom: 20,
          border: "1px solid #ddd",
          padding: 15,
          borderRadius: 6,
        }}
      >
        <h3>{editingId ? "Chỉnh sửa cuộc họp" : "Thêm cuộc họp mới"}</h3>
        <input
          type="text"
          name="title"
          placeholder="Tiêu đề"
          value={newMeeting.title}
          onChange={handleChange}
          style={{ marginRight: 10, padding: 8 }}
        />
        <input
          type="datetime-local"
          name="datetime"
          value={newMeeting.datetime}
          onChange={handleChange}
          style={{ marginRight: 10, padding: 8 }}
        />
        <input
          type="text"
          name="location"
          placeholder="Địa điểm"
          value={newMeeting.location}
          onChange={handleChange}
          style={{ marginRight: 10, padding: 8 }}
        />
        {editingId ? (
          <>
            <button
              onClick={handleSave}
              style={{
                marginRight: 10,
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "8px 16px",
              }}
            >
              Lưu
            </button>
            <button
              onClick={handleCancel}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                padding: "8px 16px",
              }}
            >
              Hủy
            </button>
          </>
        ) : (
          <button
            onClick={handleAdd}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "8px 16px",
            }}
          >
            Thêm
          </button>
        )}
      </div>

      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Ngày giờ</th>
            <th>Địa điểm</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedMeetings.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Chưa có cuộc họp nào.
              </td>
            </tr>
          ) : (
            paginatedMeetings.map(({ id, title, datetime, location }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{title}</td>
                <td>{new Date(datetime).toLocaleString()}</td>
                <td>{location}</td>
                <td>
                  <button
                    onClick={() =>
                      handleEdit({ id, title, datetime, location })
                    }
                    style={{ marginRight: 10, color: "blue" }}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(id)}
                    style={{ color: "red" }}
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
    </div>
  );
}

export default CuocHop;
