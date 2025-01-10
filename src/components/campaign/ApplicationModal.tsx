import React from "react";
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

interface ApplicationModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  status?: "pending" | "approved" | "rejected";
  campaignTitle?: string;
}

const ApplicationModal = ({
  isOpen = true,
  onClose = () => {},
  status = "pending",
  campaignTitle = "Sample Game Campaign",
}: ApplicationModalProps) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Campaign Application
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Apply for {campaignTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 my-4">
          <Badge
            className={`${statusConfig[status].color} text-white`}
            variant="secondary"
          >
            <StatusIcon className="w-4 h-4 mr-1" />
            {statusConfig[status].text}
          </Badge>
        </div>

        <Form>
          <div className="space-y-4">
            <FormField
              name="channelName"
              render={() => (
                <FormItem>
                  <FormLabel>Channel Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your channel name"
                      className="bg-gray-800"
                      defaultValue="Sample Channel"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="platformLinks"
              render={() => (
                <FormItem>
                  <FormLabel>Platform Links</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="YouTube, Twitch, or other platform links"
                      className="bg-gray-800"
                      defaultValue="https://youtube.com/sample"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="audienceSize"
              render={() => (
                <FormItem>
                  <FormLabel>Audience Size</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your total followers/subscribers"
                      className="bg-gray-800"
                      defaultValue="1000"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="proposal"
              render={() => (
                <FormItem>
                  <FormLabel>Content Proposal</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe how you plan to cover this game"
                      className="bg-gray-800 min-h-[100px]"
                      defaultValue="I plan to create an in-depth review and gameplay series..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={status !== "pending"}
          >
            Submit Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
