import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  error?: string;
  timestamp?: string;
  path?: string;
}

export function handleHttpError(error: unknown): never {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const status = axiosError.response?.status;
    const message =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error;

    switch (status) {
      case 400:
        throw new Error(message || "Requisição inválida.");

      case 401:
        throw new Error("Sessão expirada. Faça login novamente.");

      case 403:
        throw new Error("Você não tem permissão para acessar este recurso.");

      case 404:
        throw new Error("Recurso não encontrado.");

      case 409:
        throw new Error(message || "Conflito de dados.");

      case 422:
        throw new Error(message || "Erro de validação.");

      case 500:
        throw new Error("Erro interno do servidor.");

      default:
        throw new Error(message || "Erro inesperado.");
    }
  }

  if (error instanceof Error) {
    throw new Error(error.message);
  }

  throw new Error("Erro desconhecido.");
}