import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "../ui/use-toast";
import { handleApiError } from "@/lib/error-handling";
import { Alert, AlertDescription } from "../ui/alert";

const applicationSchema = z.object({
  channelName: z.string().min(2, "Channel name must be at least 2 characters"),
  platformLinks: z.string().url("Must be a valid URL"),
  audienceSize: z.string().transform((val) => parseInt(val, 10)),
  proposal: z
    .string()
    .min(50, "Please provide a detailed proposal (min 50 characters)"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  status?: "pending" | "approved" | "rejected";
  campaignTitle?: string;
  campaignId?: string;
}

const ApplicationModal = ({
  open = true,
  onOpenChange = () => {},
  status = "pending",
  campaignTitle = "Sample Game Campaign",
  campaignId,
}: ApplicationModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      channelName: "",
      platformLinks: "",
      audienceSize: "",
      proposal: "",
    },
  });

  const statusConfig = {
    pending: {
      color: "bg-yellow-500",
      icon: AlertCircle,
      text: "Application Pending",
    },
    approved: {
      color: "bg-green-500",
      icon: CheckCircle2,
      text: "Application Approved",
    },
    rejected: {
      color: "bg-red-500",
      icon: XCircle,
      text: "Application Rejected",
    },
  };

  const StatusIcon = statusConfig[status].icon;

  const onSubmit = async (data: ApplicationFormData) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await handleApiError(
        supabase.from("applications").insert({
          campaign_id: campaignId,
          channel_name: data.channelName,
          platform_links: [data.platformLinks],
          audience_size: data.audienceSize,
          proposal: data.proposal,
          status: "pending",
        }),
        "Failed to submit application",
      );

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully.",
      });

      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Campaign Application
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Apply for {campaignTitle}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2 my-4">
          <Badge
            className={`${statusConfig[status].color} text-white`}
            variant="secondary"
          >
            <StatusIcon className="w-4 h-4 mr-1" />
            {statusConfig[status].text}
          </Badge>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="channelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your channel name"
                      className="bg-gray-800"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="platformLinks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your main platform URL (YouTube, Twitch, etc.)"
                      className="bg-gray-800"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="audienceSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audience Size</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your total followers/subscribers"
                      className="bg-gray-800"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proposal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Proposal</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe how you plan to cover this game"
                      className="bg-gray-800 min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                type="button"
                className="mr-2"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={status !== "pending" || isSubmitting}
                loading={isSubmitting}
              >
                Submit Application
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
