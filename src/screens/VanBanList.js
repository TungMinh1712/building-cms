import React, { useState, useEffect } from "react";

const initialDocuments = [
  {
    id: 1,
    title: "Thông báo nghỉ lễ 30/4 - 1/5",
    type: "Thông báo",
    issuedDate: "2024-04-20",
    file: null,
  },

  {
    id: 2,
    title: "Nội quy chung cư",
    type: "Quy định",
    issuedDate: "2024-05-01",
    file: null,
  },
  {
    id: 3,
    title: "Kế hoạch bảo trì, bảo dưỡng định kỳ",
    type: "Kế hoạch",
    issuedDate: "2024-05-10",
    file: null,
  },
  {
    id: 4,
    title: "Thông báo sự kiện cộng đồng",
    type: "Thông báo",
    issuedDate: "2024-05-15",
    file: null,
  },
];

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
  const itemsPerPage = 3;

  // Tạo và dọn dẹp URL object cho file để hiển thị link download
  useEffect(() => {
    const newFileURLs = {};
    documents.forEach((doc) => {
      if (doc.file) {
        if (doc.file.data) {
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
  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocs = filteredDocs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const resetForm = () =>
    setForm({ title: "", type: "", issuedDate: "", file: null });

  // Chuyển file thành base64 để lưu vào localStorage
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
    const newDocuments = [
      ...documents,
      {
        id: newId,
        title: form.title,
        type: form.type,
        issuedDate: form.issuedDate,
        file: fileData,
      },
    ];
    setDocuments(newDocuments);
    setCurrentPage(Math.ceil(newDocuments.length / itemsPerPage)); // Chuyển tới trang cuối
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
        : null,
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
      const updatedDocuments = documents.filter((d) => d.id !== id);
      setDocuments(updatedDocuments);
      // Điều chỉnh trang hiện tại nếu cần
      const maxPage = Math.ceil(updatedDocuments.length / itemsPerPage);
      setCurrentPage((prev) => Math.min(prev, maxPage || 1));
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
    if (!url) return <i style={{ color: "gray" }}>Chưa có file</i>;
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
          setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
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
          {paginatedDocs.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", color: "gray" }}>
                Không có văn bản nào phù hợp.
              </td>
            </tr>
          )}

          {paginatedDocs.map((doc) =>
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
