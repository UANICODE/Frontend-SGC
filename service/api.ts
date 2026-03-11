import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  withCredentials: true,
});

// 🔐 Interceptor de refresh automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ignora login e logout
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/login") &&
      !originalRequest.url?.includes("/logout")
    ) {
      originalRequest._retry = true;

      try {
        // Tenta refresh
        await api.post("/api/auth/refresh"); 
        return api(originalRequest);
      } catch {
        // Sem sessão ativa: força redirecionamento
        window.location.href = "/auth"; // ⚠️ usar rota de login
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;