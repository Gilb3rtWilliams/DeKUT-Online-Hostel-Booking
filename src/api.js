import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Backend URL
});

// Automatically attach token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth APIs
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);

// Hostel APIs
export const getHostels = () => API.get("/hostels");

// Booking APIs
export const bookHostel = (data) => API.post("/bookings", data);
export const getBookings = () => API.get("/bookings");

// Complaints & Feedback
export const submitComplaint = (data) => API.post("/complaints", data);
export const submitFeedback = (data) => API.post("/feedback", data);

// Notifications
export const getNotifications = () => API.get("/notifications");
export const markNotificationAsRead = (id) => API.put(`/notifications/${id}`);

export default API;
