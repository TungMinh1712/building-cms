// apis/handleapi.js (or a separate mock file for testing)
const mockAccounts = [
  {
    username: "bqt",
    password: "bqt123",
    role: "bqt",
    token: "mock_bqt_token_123",
    user: { id: 1, username: "bqt_user", role: "bqt" },
  },
  {
    username: "cudan",
    password: "cudan123",
    role: "cudan",
    token: "mock_cudan_token_456",
    user: { id: 2, username: "cudan_user", role: "cudan" },
  },
];

const callApi = async (url, method, data) => {
  if (url === "/login" && method === "POST") {
    const { username, password } = data;

    // Find matching account
    const account = mockAccounts.find(
      (acc) => acc.username === username && acc.password === password
    );

    if (account) {
      return {
        token: account.token,
        user: account.user,
      };
    } else {
      throw new Error("Invalid username or password");
    }
  }
  throw new Error("API endpoint not supported");
};

export default callApi;
