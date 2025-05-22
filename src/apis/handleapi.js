// src/apis/handleapi.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // chỉnh nếu cần

const callApi = async (endpoint, method = "GET", data = null) => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).token
    : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    method,
    url: `${BASE_URL}${endpoint}`,
    headers,
    data,
  };

  const res = await axios(config);
  return res.data;
};

export default callApi;
