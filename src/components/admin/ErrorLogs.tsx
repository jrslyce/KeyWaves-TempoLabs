import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

interface ErrorLog {
  id: string;
  error_message: string;
  error_code?: string;
  error_stack?: string;
  context?: Record<string, any>;
  user_id?: string;
  created_at: string;
}

export default function ErrorLogs() {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<ErrorLog | null>(null);

  useEffect(() => {
    fetchLogs();
    setupSubscription();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("error_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupSubscription = () => {
    const subscription = supabase
      .channel("error_logs_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "error_logs" },
        (payload) => {
          setLogs((current) => [payload.new as ErrorLog, ...current]);
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Error Logs</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Error Message</TableHead>
              <TableHead>Error Code</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {format(new Date(log.created_at), "PPpp")}
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {log.error_message}
                </TableCell>
                <TableCell>{log.error_code || "N/A"}</TableCell>
                <TableCell>{log.user_id || "Anonymous"}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedLog(log)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Error Log Details</DialogTitle>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Timestamp</h3>
                <p>{format(new Date(selectedLog.created_at), "PPpp")}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Error Message</h3>
                <p className="text-red-500">{selectedLog.error_message}</p>
              </div>

              {selectedLog.error_code && (
                <div>
                  <h3 className="font-semibold mb-1">Error Code</h3>
                  <p>{selectedLog.error_code}</p>
                </div>
              )}

              {selectedLog.error_stack && (
                <div>
                  <h3 className="font-semibold mb-1">Stack Trace</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                    {selectedLog.error_stack}
                  </pre>
                </div>
              )}

              {selectedLog.context && (
                <div>
                  <h3 className="font-semibold mb-1">Context</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                    {JSON.stringify(selectedLog.context, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.user_id && (
                <div>
                  <h3 className="font-semibold mb-1">User ID</h3>
                  <p>{selectedLog.user_id}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
