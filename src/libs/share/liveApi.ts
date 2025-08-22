import axios, { AxiosError } from "axios";

export const getDataFromPayload = (data: any) => {
    if (data?.RESULT_DATA && data?.RESULT_CODE === "200") return data?.RESULT_DATA;
    return data;
};

const _BASE_URL_ = process.env.BASE_LIVE_API || "https://api.letsgostage.com";

// DEBUG
const isDebug = process.env.NODE_ENV !== "production";

const api = axios.create({
    timeout: 3000,
    baseURL: _BASE_URL_,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded;  charset=UTF-8"
    }
});

// Add a request interceptor
api.interceptors.request.use(
    function (config) {
        if (isDebug) {
            // can output log here
        }

        return config;
    },
    function (error) {
        // Handle the error
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    async function (response) {
        // Do something with the response data
        if (isDebug) {
            // can output log here
            // console.log('Response:', response);
        }

        return response;
    },
    async function (error: AxiosError) {
        return Promise.reject(error);
    }
);

export default api;
