import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

let refreshPromise = null;

const refreshToken = async () => {
    if (!refreshPromise) {
        refreshPromise = api
            .post("/users/refresh-token")
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
};

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest) {
            return Promise.reject(error); 
        }

        const isAuthRoute =
            originalRequest.url?.includes("/users/login") ||
            originalRequest.url?.includes("/users/register") ||
            originalRequest.url?.includes("/users/refresh-token") ||
            originalRequest.url?.includes("/users/me");

        if ( error.response?.status === 401 &&  !originalRequest._retry && !isAuthRoute ) {
                originalRequest._retry = true;

                try {
                    await refreshToken();

                    return api(originalRequest);
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
        }

        return Promise.reject(error);
    }
);

export { api };