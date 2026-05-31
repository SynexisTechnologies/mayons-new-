import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("AccessToken");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor to handle expired access tokens.
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // only handle 401 from the API
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      const message = error.response.data?.message || "";

      // If refresh endpoint indicated token expired or refresh missing, attempt refresh
      if (message === "Access Token Expired" || message === "Refresh Token missing" || message === "Invalid Access Token") {
        if (isRefreshing) {
          // queue the request until token is refreshed
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest._retry = true;
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // call refresh endpoint (cookie-based) using a plain axios instance
          const resp = await axios.post(
            `${baseURL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );

          const newToken = resp.data?.accessToken;
          if (newToken) {
            localStorage.setItem("AccessToken", newToken);
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            processQueue(null, newToken);
            return axiosInstance(originalRequest);
          }

          processQueue(new Error("Refresh failed"), null);
          return Promise.reject(error);
        } catch (err) {
          processQueue(err, null);
          // ensure logged out on refresh failure
          localStorage.removeItem("AccessToken");
          try {
            // notify user and redirect to login
            if (typeof window !== "undefined") {
              alert("Session expired. Please log in again.");
              window.location.href = "/login";
            }
          } catch (e) {
            /* ignore */
          }
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  }
);