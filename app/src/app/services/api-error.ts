import { HttpErrorResponse } from '@angular/common/http';

interface ApiErrorBody {
  message?: string;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as ApiErrorBody | null;

    return body?.message ?? fallback;
  }

  return fallback;
}
