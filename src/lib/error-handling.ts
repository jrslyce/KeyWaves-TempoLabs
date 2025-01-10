import { PostgrestError } from "@supabase/supabase-js";
import { logError } from "./error-logging";

export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if ((error as PostgrestError).code) {
    const pgError = error as PostgrestError;
    switch (pgError.code) {
      case "23505":
        return "This record already exists.";
      case "23503":
        return "This operation references a record that doesn't exist.";
      case "42P01":
        return "The requested resource was not found.";
      default:
        return `Database error: ${pgError.message}`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

export async function handleApiError<T>(
  promise: Promise<T>,
  customErrorMessage?: string,
  context?: Record<string, any>,
): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    // Log the error with context
    await logError(error, {
      ...context,
      customErrorMessage,
    });

    const message = customErrorMessage || getErrorMessage(error);
    throw new ApiError(message);
  }
}
