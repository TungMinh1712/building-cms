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
  const [documents, setDocuments] = useState(initialDocuments);
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

  // Cleanup URL objects khi documents thay đổi hoặc component unmount
  useEffect(() => {
    // Tạo URLs mới cho file trong documents
    const newFileURLs = {};
    documents.forEach((doc) => {
      if (doc.file) {
        newFileURLs[doc.id] = URL.createObjectURL(doc.file);
      }
    });
    // Giải phóng URL cũ
    Object.values(fileURLs).forEach((url) => URL.revokeObjectURL(url));
    setFileURLs(newFileURLs);

    // Cleanup khi component unmount
    return () => {
      Object.values(newFileURLs).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [documents]);

  const filteredDocs = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.type.toLowerCase().includes(search.toLowerCase())
  );

  const pagedDocs = filteredDocs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const resetForm = () =>
    setForm({ title: "", type: "", issuedDate: "", file: null });

  const handleAdd = () => {
    if (!form.title || !form.type || !form.issuedDate) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }
    const newId =
      documents.length > 0 ? Math.max(...documents.map((d) => d.id)) + 1 : 1;
    setDocuments([...documents, { id: newId, ...form }]);
    resetForm();
  };

  const handleEdit = (doc) => {
    setEditingId(doc.id);
    setForm({
      title: doc.title,
      type: doc.type,
      issuedDate: doc.issuedDate,
      file: doc.file || null,
    });
  };

  const handleSave = () => {
    if (!form.title || !form.type || !form.issuedDate) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }
    setDocuments(
      documents.map((d) =>
        d.id === editingId ? { id: editingId, ...form } : d
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

          {pagedDocs.map((doc) => (
            <tr
              key={doc.id}
              style={editingId === doc.id ? { backgroundColor: "#f0f0f0" } : {}}
            >
              <td>{doc.id}</td>
              <td>
                {editingId === doc.id ? (
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                ) : (
                  doc.title
                )}
              </td>
              <td>
                {editingId === doc.id ? (
                  <input
                    type="text"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  />
                ) : (
                  doc.type
                )}
              </td>
              <td>
                {editingId === doc.id ? (
                  <input
                    type="date"
                    value={form.issuedDate}
                    onChange={(e) =>
                      setForm({ ...form, issuedDate: e.target.value })
                    }
                  />
                ) : (
                  doc.issuedDate
                )}
              </td>
              <td>
                {editingId === doc.id ? (
                  <input type="file" onChange={handleFileChange} />
                ) : (
                  renderFileLink(doc)
                )}
              </td>
              <td>
                {editingId === doc.id ? (
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
                      onClick={() => handleEdit(doc)}
                      style={{ marginRight: 8 }}
                      title="Sửa"
                    >
                      ✏️ Sửa
                    </button>
                    <button onClick={() => handleDelete(doc.id)} title="Xóa">
                      🗑️ Xóa
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Thêm văn bản mới</h3>
      <div style={{ display: "flex", gap: 10, marginBottom: 40 }}>
        <input
          type="text"
          placeholder="Tiêu đề"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Loại văn bản"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        />
        <input
          type="date"
          value={form.issuedDate}
          onChange={(e) => setForm({ ...form, issuedDate: e.target.value })}
        />
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleAdd}>➕ Thêm</button>
      </div>
    </div>
  );
};

export default VanBanList;
