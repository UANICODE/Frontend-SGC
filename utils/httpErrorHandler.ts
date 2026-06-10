// utils/httpErrorHandler.ts
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  error?: string;
  timestamp?: string;
  path?: string;
}

// utils/httpErrorHandler.ts
export function handleHttpError(error: unknown): never {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    // 🔥 ADICIONE ESTE LOG PARA DEBUG
    console.log("=== ERROR DEBUG ===");
    console.log("Status:", axiosError.response?.status);
    console.log("Data:", axiosError.response?.data);
    console.log("Message:", axiosError.message);
    console.log("===================");

    if (!axiosError.response) {
      throw new Error(
        "Sem conexão com a internet. Verifique sua conexão e tente novamente."
      );
    }

    const status = axiosError.response.status;
    const message = axiosError.response.data?.message ||
                    axiosError.response.data?.error ||
                    "Oops! Houve um erro inesperado.";

    switch (status) {
      case 400:
        throw new Error(message);  // ✅ Mensagem original do backend

      case 401:
        throw new Error("Sessão expirada. Faça login novamente.");

      case 403:
        throw new Error("Você não tem permissão para acessar este recurso.");

      case 404:
        throw new Error("Recurso não encontrado.");

      case 409:
        throw new Error(message);

      case 422:
        throw new Error(message);

      case 500:
        throw new Error("Oops! Erro temporário. Tente novamente.");

      default:
        throw new Error(message);
    }
  }

  if (error instanceof Error) {
    throw new Error(error.message);
  }

  throw new Error("Erro desconhecido.");
}