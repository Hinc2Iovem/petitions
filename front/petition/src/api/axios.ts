import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const axiosCustomized = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});