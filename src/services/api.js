import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Function to get auth store (imported dynamically to avoid circular dependency)
let getAuthStore;
const initAuthStore = async () => {
    if (!getAuthStore) {
        const { useAuthStore } = await import('../stores/authStore');
        getAuthStore = () => useAuthStore.getState();
    }
    return getAuthStore();
};

// Request interceptor - add token to every request
api.interceptors.request.use(
    async (config) => {
        try {
            const authStore = await initAuthStore();
            const token = authStore.accessToken;
            if (token && token !== 'undefined' && token !== 'null') {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Failed to get auth token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors and token refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            // Handle token expiration
            if (error.response.status === 401 && !originalRequest._retry) {
                // Check if this is a login/register endpoint - don't redirect for these
                const isAuthEndpoint = originalRequest.url?.includes('/login') ||
                    originalRequest.url?.includes('/register');

                if (isAuthEndpoint) {
                    // For login/register endpoints, just reject the error
                    // Let the component handle it
                    return Promise.reject(error);
                }

                if (error.response.data?.code === 'TOKEN_EXPIRED' ||
                    error.response.data?.message?.includes('expired')) {

                    if (isRefreshing) {
                        // Wait for the refresh to complete
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject });
                        })
                            .then(token => {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                                return api(originalRequest);
                            })
                            .catch(err => {
                                return Promise.reject(err);
                            });
                    }

                    originalRequest._retry = true;
                    isRefreshing = true;

                    const authStore = await initAuthStore();
                    const refreshToken = authStore.refreshToken;

                    if (!refreshToken) {
                        // No refresh token, redirect to login
                        authStore.clearAuth();
                        window.location.href = '/login';
                        return Promise.reject(error);
                    }

                    try {
                        // Request new access token
                        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                            refreshToken
                        });

                        const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;

                        // Update stored tokens in Zustand
                        authStore.setAuth(
                            response.data.data.user,
                            accessToken,
                            newRefreshToken || refreshToken
                        );

                        // Update Authorization header
                        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                        processQueue(null, accessToken);

                        return api(originalRequest);
                    } catch (refreshError) {
                        processQueue(refreshError, null);
                        authStore.clearAuth();
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    } finally {
                        isRefreshing = false;
                    }
                }

                // Other 401 errors on protected routes - clear auth and redirect
                const authStore = await initAuthStore();
                authStore.clearAuth();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
