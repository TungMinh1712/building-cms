// src/apis/handleapi.js
const mockUsers = [];

const callApi = async (endpoint, method = "GET", data = null) => {
  await new Promise((res) => setTimeout(res, 500)); // giả lập delay mạng

  if (endpoint === "/register" && method === "POST") {
    const { username, password } = data;
    if (mockUsers.find((u) => u.username === username)) {
      return { success: false, message: "Tên đăng nhập đã tồn tại" };
    }
    mockUsers.push({ username, password, token: "fake-jwt-token" });
    return { success: true };
  }

  if (endpoint === "/login" && method === "POST") {
    const { username, password } = data;
    const user = mockUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) {
      return { success: false, message: "Sai tên đăng nhập hoặc mật khẩu" };
    }
    return { token: user.token, user: { username: user.username } };
  }

  return { success: false, message: "Endpoint không hợp lệ" };
};

export default callApi;
