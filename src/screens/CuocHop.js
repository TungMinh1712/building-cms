import React, { useState, useEffect } from "react";
import { initialData } from "./BanQuanTriList"; // Import initialData làm fallback

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
          assignee: "Nguyễn Văn An",
          content: "Thảo luận kế hoạch phát triển quý 2",
        },
        {
          id: 2,
          title: "Họp Dự án CNTT",
          datetime: "2025-05-26T14:00",
          location: "Tòa B.1.01",
          assignee: "Trần Thị Bình",
          content: "Cập nhật tiến độ dự án phần mềm mới",
        },
        {
          id: 3,
          title: "Họp Tổng kết năm",
          datetime: "2025-06-01T10:00",
          location: "Tòa A.1.01",
          assignee: "Hoàng Thị Hạnh",
          content: "Đánh giá hiệu suất năm và kế hoạch năm mới",
        },
        {
          id: 4,
          title: "Họp Đánh giá hiệu suất",
          datetime: "2025-06-05T11:00",
          location: "Tòa C.1.01",
          assignee: "Vũ Văn Khoa",
          content: "Xem xét KPI của các phòng ban",
        },
      ];
};

const BAN_QUAN_TRI_STORAGE_KEY = "banQuanTriData";

function CuocHop() {
  const [assignees, setAssignees] = useState(() => {
    const stored = localStorage.getItem(BAN_QUAN_TRI_STORAGE_KEY);
    const data = stored ? JSON.parse(stored) : initialData;
    return data.map((item) => item.name);
  });

  const [meetings, setMeetings] = useState(getSavedMeetings);
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    datetime: "",
    location: "",
    assignee: assignees[0] || "",
    content: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const itemsPerPage = 3;

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem(BAN_QUAN_TRI_STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : initialData;
      const newAssignees = data.map((item) => item.name);
      setAssignees(newAssignees);

      if (!newAssignees.includes(newMeeting.assignee)) {
        setNewMeeting((prev) => ({
          ...prev,
          assignee: newAssignees[0] || "",
        }));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [newMeeting.assignee]);

  useEffect(() => {
    localStorage.setItem("meetings", JSON.stringify(meetings));
  }, [meetings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMeeting((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    if (
      !newMeeting.title ||
      !newMeeting.datetime ||
      !newMeeting.location ||
      !newMeeting.assignee ||
      !newMeeting.content
    ) {
      alert("Điền đầy đủ thông tin cuộc họp, bao gồm nội dung!");
      return;
    }
    if (!assignees.includes(newMeeting.assignee)) {
      alert("Người phụ trách không hợp lệ!");
      return;
    }
    const newId = meetings.length
      ? Math.max(...meetings.map((m) => m.id)) + 1
      : 1;
    const newMeetings = [...meetings, { id: newId, ...newMeeting }];
    setMeetings(newMeetings);
    setCurrentPage(Math.ceil(newMeetings.length / itemsPerPage));
    setNewMeeting({
      title: "",
      datetime: "",
      location: "",
      assignee: assignees[0] || "",
      content: "",
    });
  };

  const handleEdit = (meeting) => {
    setEditingId(meeting.id);
    setNewMeeting({
      title: meeting.title,
      datetime: meeting.datetime,
      location: meeting.location,
      assignee: meeting.assignee,
      content: meeting.content,
    });
  };

  const handleSave = () => {
    if (
      !newMeeting.title ||
      !newMeeting.datetime ||
      !newMeeting.location ||
      !newMeeting.assignee ||
      !newMeeting.content
    ) {
      alert("Điền đầy đủ thông tin cuộc họp, bao gồm nội dung!");
      return;
    }
    if (!assignees.includes(newMeeting.assignee)) {
      alert("Người phụ trách không hợp lệ!");
      return;
    }
    const updatedMeetings = meetings.map((m) =>
      m.id === editingId ? { id: editingId, ...newMeeting } : m
    );
    setMeetings(updatedMeetings);
    setEditingId(null);
    setNewMeeting({
      title: "",
      datetime: "",
      location: "",
      assignee: assignees[0] || "",
      content: "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewMeeting({
      title: "",
      datetime: "",
      location: "",
      assignee: assignees[0] || "",
      content: "",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa cuộc họp này chứ?")) {
      const newMeetings = meetings.filter((m) => m.id !== id);
      setMeetings(newMeetings);
      const maxPage = Math.ceil(newMeetings.length / itemsPerPage);
      setCurrentPage((prev) => Math.min(prev, maxPage || 1));
      if (selectedMeeting && selectedMeeting.id === id) {
        setSelectedMeeting(null);
      }
    }
  };

  const handleSelectMeeting = (meeting) => {
    setSelectedMeeting(meeting);
  };

  const totalPages = Math.ceil(meetings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMeetings = meetings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div style={{ maxWidth: 900, margin: "auto", position: "relative" }}>
      <h2>Danh sách Cuộc họp</h2>

      <div
        style={{
          marginBottom: 20,
          border: "1px solid #ddd",
          padding: 15,
          borderRadius: 6,
        }}
      >
        <h3>{editingId ? "Chỉnh sửa cuộc họp" : "Thêm cuộc họp mới"}</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            type="text"
            name="title"
            placeholder="Tiêu đề"
            value={newMeeting.title}
            onChange={handleChange}
            style={{ flex: 1, minWidth: 200, padding: 8 }}
          />
          <input
            type="datetime-local"
            name="datetime"
            value={newMeeting.datetime}
            onChange={handleChange}
            style={{ padding: 8 }}
          />
          <input
            type="text"
            name="location"
            placeholder="Địa điểm"
            value={newMeeting.location}
            onChange={handleChange}
            style={{ padding: 8 }}
          />
          <select
            name="assignee"
            value={newMeeting.assignee}
            onChange={handleChange}
            style={{ padding: 8 }}
          >
            <option value="" disabled>
              Chọn người phụ trách
            </option>
            {assignees.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <textarea
            name="content"
            placeholder="Nội dung cuộc họp"
            value={newMeeting.content}
            onChange={handleChange}
            style={{ flex: 1, minWidth: 200, padding: 8, minHeight: 80 }}
          />
          {editingId ? (
            <>
              <button
                onClick={handleSave}
                style={{
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
              disabled={assignees.length === 0}
            >
              Thêm
            </button>
          )}
        </div>
      </div>

      {selectedMeeting && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 8,
              maxWidth: 500,
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h3>Chi tiết cuộc họp</h3>

            <p>
              <strong>Nội dung:</strong> {selectedMeeting.content}
            </p>
            <button
              onClick={() => setSelectedMeeting(null)}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                padding: "8px 16px",
                width: "100%",
                marginTop: 10,
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

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
            <th>Người phụ trách</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedMeetings.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Chưa có cuộc họp nào.
              </td>
            </tr>
          ) : (
            paginatedMeetings.map(
              ({ id, title, datetime, location, assignee, content }) => (
                <tr
                  key={id}
                  onClick={() =>
                    handleSelectMeeting({
                      id,
                      title,
                      datetime,
                      location,
                      assignee,
                      content,
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td>{id}</td>
                  <td>{title}</td>
                  <td>{new Date(datetime).toLocaleString()}</td>
                  <td>{location}</td>
                  <td>{assignee || "Chưa phân công"}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit({
                          id,
                          title,
                          datetime,
                          location,
                          assignee,
                          content,
                        });
                      }}
                      style={{ marginRight: 10, color: "blue" }}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(id);
                      }}
                      style={{ color: "red" }}
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>

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
