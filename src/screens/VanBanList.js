import React, { useState, useEffect } from "react";

const initialDocuments = [
  {
    id: 1,
    title: "Quyết định số 01",
    type: "Quyết định",
    issuedDate: "2024-01-10",
    file: null,
  },
  {
    id: 2,
    title: "Thông báo nghỉ lễ",
    type: "Thông báo",
    issuedDate: "2025-02-15",
    file: null,
  },
  {
    id: 3,
    title: "Kế hoạch công tác năm 2025",
    type: "Kế hoạch",
    issuedDate: "2025-03-01",
    file: null,
  },
];

const PAGE_SIZE = 10;

const VanBanList = () => {
  // Khởi tạo documents từ localStorage hoặc fallback về initialDocuments
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem("vanBanDocuments");
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  // Lưu documents vào localStorage mỗi khi documents thay đổi
  useEffect(() => {
    localStorage.setItem("vanBanDocuments", JSON.stringify(documents));
  }, [documents]);

  const [form, setForm] = useState({
    title: "",
    type: "",
    issuedDate: "",
    file: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [fileURLs, setFileURLs] = useState({}); // id -> objectURL

  // Tạo và dọn dẹp URL object cho file để hiển thị link download
  useEffect(() => {
    const newFileURLs = {};
    documents.forEach((doc) => {
      if (doc.file) {
        // file trong localStorage không thể giữ được File object nguyên vẹn,
        // nên mình phải xử lý khác, mình sẽ serialize file thành base64 để đảm bảo.
        // Nhưng ở đây bạn đang lưu trực tiếp file object, React ko lưu được trong JSON.
        // Vì vậy ta cần xử lý lại file lưu trữ (xem phần giải thích dưới)
        if (doc.file.data) {
          // file được lưu dưới dạng base64 rồi
          const byteCharacters = atob(doc.file.data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: doc.file.type });
          newFileURLs[doc.id] = URL.createObjectURL(blob);
        }
      }
    });
    // Giải phóng url cũ
    Object.values(fileURLs).forEach((url) => URL.revokeObjectURL(url));
    setFileURLs(newFileURLs);

    // Cleanup khi unmount
    return () => {
      Object.values(newFileURLs).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [documents]);

  // Lọc theo search
  const filteredDocs = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.type.toLowerCase().includes(search.toLowerCase())
  );

  // Phân trang
  const pagedDocs = filteredDocs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const resetForm = () =>
    setForm({ title: "", type: "", issuedDate: "", file: null });

  // Chuyển file thành base64 để lưu vào localStorage (vì localStorage không lưu được object File)
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1]; // lấy phần base64
        resolve({
          name: file.name,
          type: file.type,
          data: base64Data,
        });
      };
      reader.onerror = (error) => reject(error);
    });

  const handleAdd = async () => {
    if (!form.title || !form.type || !form.issuedDate) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }
    let fileData = null;
    if (form.file) {
      try {
        fileData = await fileToBase64(form.file);
      } catch {
        alert("Lỗi xử lý file!");
        return;
      }
    }
    const newId =
      documents.length > 0 ? Math.max(...documents.map((d) => d.id)) + 1 : 1;
    setDocuments([
      ...documents,
      {
        id: newId,
        title: form.title,
        type: form.type,
        issuedDate: form.issuedDate,
        file: fileData,
      },
    ]);
    resetForm();
  };

  const handleEdit = (doc) => {
    setEditingId(doc.id);
    setForm({
      title: doc.title,
      type: doc.type,
      issuedDate: doc.issuedDate,
      file: doc.file
        ? new File([], doc.file.name, { type: doc.file.type })
        : null, // không tải lại file gốc được, chỉ giữ null hoặc tạo File rỗng
    });
  };

  const handleSave = async () => {
    if (!form.title || !form.type || !form.issuedDate) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }
    let fileData = null;
    if (form.file && form.file instanceof File) {
      try {
        fileData = await fileToBase64(form.file);
      } catch {
        alert("Lỗi xử lý file!");
        return;
      }
    } else if (form.file && form.file.data) {
      fileData = form.file; // giữ nguyên file đã lưu
    }
    setDocuments(
      documents.map((d) =>
        d.id === editingId
          ? {
              id: editingId,
              title: form.title,
              type: form.type,
              issuedDate: form.issuedDate,
              file: fileData,
            }
          : d
      )
    );
    setEditingId(null);
    resetForm();
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa văn bản này?")) {
      setDocuments(documents.filter((d) => d.id !== id));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Chỉ được tải lên file PDF, DOC, DOCX hoặc TXT!");
      e.target.value = null;
      return;
    }
    setForm({ ...form, file });
  };

  const renderFileLink = (doc) => {
    if (!doc.file) return <i style={{ color: "gray" }}>Chưa có file</i>;
    const url = fileURLs[doc.id];
    if (!url) return <i style={{ color: "gray" }}>Đang tải...</i>;
    return (
      <a href={url} download={doc.file.name} title="Tải xuống file văn bản">
        📄 {doc.file.name}
      </a>
    );
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <h2>Danh sách Văn Bản</h2>

      <input
        type="text"
        placeholder="🔍 Tìm theo tiêu đề hoặc loại văn bản..."
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
        style={{ width: "100%", marginBottom: 20 }}
      >
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Loại văn bản</th>
            <th>Ngày ban hành</th>
            <th>File văn bản</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {pagedDocs.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", color: "gray" }}>
                Không có văn bản nào phù hợp.
              </td>
            </tr>
          )}

          {pagedDocs.map((doc) =>
            editingId === doc.id ? (
              <tr key={doc.id} style={{ backgroundColor: "#ffeeba" }}>
                <td>{doc.id}</td>
                <td>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={form.issuedDate}
                    onChange={(e) =>
                      setForm({ ...form, issuedDate: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input type="file" onChange={handleFileChange} />
                  <div style={{ fontSize: 12, color: "#666" }}>
                    {form.file && form.file.name}
                  </div>
                </td>
                <td>
                  <button onClick={handleSave}>💾 Lưu</button>{" "}
                  <button onClick={handleCancel}>❌ Hủy</button>
                </td>
              </tr>
            ) : (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{doc.title}</td>
                <td>{doc.type}</td>
                <td>{doc.issuedDate}</td>
                <td>{renderFileLink(doc)}</td>
                <td>
                  <button onClick={() => handleEdit(doc)}>✏️ Sửa</button>{" "}
                  <button onClick={() => handleDelete(doc.id)}>🗑️ Xóa</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {/* Phân trang */}
      <div style={{ marginBottom: 20 }}>
        {Array.from(
          { length: Math.ceil(filteredDocs.length / PAGE_SIZE) },
          (_, i) => i + 1
        ).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              marginRight: 4,
              padding: "6px 12px",
              backgroundColor: currentPage === page ? "#007bff" : "#f0f0f0",
              color: currentPage === page ? "white" : "black",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Thêm mới */}
      {editingId === null && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: 12,
            borderRadius: 6,
            backgroundColor: "#fafafa",
          }}
        >
          <h3>Thêm Văn Bản Mới</h3>
          <div style={{ marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Tiêu đề"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Loại văn bản"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <input
              type="date"
              value={form.issuedDate}
              onChange={(e) => setForm({ ...form, issuedDate: e.target.value })}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <input type="file" onChange={handleFileChange} />
          </div>
          <button onClick={handleAdd} style={{ padding: "8px 16px" }}>
            ➕ Thêm mới
          </button>
        </div>
      )}
    </div>
  );
};

export default VanBanList;
