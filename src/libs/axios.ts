import axios from "axios";

const isDebug = process.env.NODE_ENV !== "production";

const axiosInstance = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json"
    }
});

axiosInstance.interceptors.request.use(
    function (config) {
        if (isDebug) {
            // can output log here
        }

        const token = localStorage.getItem("accessToken");

        config.headers.authorization = `Bearer ${token}` || "";

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (originalRequest.url.includes("/auth/login")) {
                return Promise.reject(error);
            }

            if (originalRequest.url.includes("/auth/refresh")) {
                alert("Your session has expired. Please log in again.");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");

                await axiosInstance.post("/auth/logout");
                window.location.reload();

                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                const { data } = await axiosInstance.post("/auth/refresh", {}, { withCredentials: true });

                localStorage.setItem("accessToken", data.data.token);
                originalRequest.headers.Authorization = `Bearer ${data.data.token}`;

                return axiosInstance(originalRequest);
            } catch (error) {
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
