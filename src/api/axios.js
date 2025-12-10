import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:4000/api",
  baseURL: import.meta.env.VITE_BASE_URL_BACKEND + "/api",

  withCredentials: true,
});

export default instance;
