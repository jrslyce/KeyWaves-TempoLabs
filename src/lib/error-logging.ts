import { supabase } from "./supabase";

interface ErrorLogData {
  error_message: string;
  error_code?: string;
  error_stack?: string;
  context?: Record<string, any>;
  user_id?: string;
}

export async function logError(error: unknown, context?: Record<string, any>) {
  try {
    const errorData: ErrorLogData = {
      error_message: error instanceof Error ? error.message : String(error),
      error_stack: error instanceof Error ? error.stack : undefined,
      context,
    };

    if ((error as any).code) {
      errorData.error_code = (error as any).code;
    }

    // Get current user if available
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      errorData.user_id = user.id;
    }

    // Log to Supabase
    await supabase.from("error_logs").insert(errorData);

    // Also log to console in development
    if (import.meta.env.DEV) {
      console.error("Error logged:", {
        ...errorData,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (loggingError) {
    // Fallback to console if logging fails
    console.error("Error logging failed:", loggingError);
    console.error("Original error:", error);
  }
}
