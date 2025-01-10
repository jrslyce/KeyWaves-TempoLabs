import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface Application {
  id: string;
  campaign: { title: string };
  channel_name: string;
  audience_size: number;
  status: string;
  created_at: string;
}

interface ApplicationListProps {
  applications: Application[];
}

export default function ApplicationList({
  applications,
}: ApplicationListProps) {
  const { toast } = useToast();

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Application Updated",
        description: `Application has been ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Audience Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">
                {application.campaign.title}
              </TableCell>
              <TableCell>{application.channel_name}</TableCell>
              <TableCell>
                {application.audience_size.toLocaleString()}
              </TableCell>
              <TableCell>{getStatusBadge(application.status)}</TableCell>
              <TableCell>
                {format(new Date(application.created_at), "PP")}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {application.status === "pending" && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateApplicationStatus(application.id, "approved")
                        }
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateApplicationStatus(application.id, "rejected")
                        }
                      >
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
