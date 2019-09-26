import axios from "axios";

var api = axios.create({
  baseURL: "https://mainnet.staked.cloud/api",
  timeout: 1000000
});

api.defaults.headers.post["Content-Type"] = "application/json";

export default api;
