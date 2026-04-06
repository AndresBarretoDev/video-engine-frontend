/**
 * OP Video Engine — API Error Handler
 *
 * Maps HTTP status codes to user-friendly messages.
 * Used by React Query hooks and components for error display.
 */

import type { ApiError } from './client';

export function handleApiError(error: unknown): string {
  if (error instanceof Error && 'status' in error) {
    const apiError = error as ApiError;

    switch (apiError.status) {
      case 400:
        return 'Datos de solicitud inválidos';
      case 401:
        return 'Sesión expirada, por favor inicia sesión de nuevo';
      case 403:
        return 'No tienes permisos para esta acción';
      case 404:
        return 'Recurso no encontrado';
      case 409:
        return 'Conflicto: el recurso ya existe';
      case 429:
        return 'Demasiadas solicitudes, intenta de nuevo más tarde';
      case 500:
      case 502:
      case 503:
        return 'Error del servidor, intenta de nuevo más tarde';
      default:
        return apiError.message || 'Ocurrió un error';
    }
  }

  return 'Ocurrió un error inesperado';
}
