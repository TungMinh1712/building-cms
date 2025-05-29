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
    setMeetings((prev) => [...prev, { id: newId, ...newMeeting }]);
    setNewMeeting({ title: "", datetime: "", location: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa cuộc họp này chứ?")) {
      setMeetings((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <div>
      <h2>Quản lý Cuộc họp</h2>

      <div
        style={{
          marginBottom: 20,
          border: "1px solid #ddd",
          padding: 15,
          borderRadius: 6,
        }}
      >
        <h3>Thêm cuộc họp mới</h3>
        <input
          type="text"
          name="title"
          placeholder="Tiêu đề"
          value={newMeeting.title}
          onChange={handleChange}
          style={{ marginRight: 10 }}
        />
        <input
          type="datetime-local"
          name="datetime"
          value={newMeeting.datetime}
          onChange={handleChange}
          style={{ marginRight: 10 }}
        />
        <input
          type="text"
          name="location"
          placeholder="Địa điểm"
          value={newMeeting.location}
          onChange={handleChange}
          style={{ marginRight: 10 }}
        />
        <button onClick={handleAdd}>Thêm</button>
      </div>

      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th>Tiêu đề</th>
            <th>Ngày giờ</th>
            <th>Địa điểm</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {meetings.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                Chưa có cuộc họp nào.
              </td>
            </tr>
          ) : (
            meetings.map(({ id, title, datetime, location }) => (
              <tr key={id}>
                <td>{title}</td>
                <td>{new Date(datetime).toLocaleString()}</td>
                <td>{location}</td>
                <td>
                  <button
                    onClick={() => handleDelete(id)}
                    style={{ color: "red" }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CuocHop;
