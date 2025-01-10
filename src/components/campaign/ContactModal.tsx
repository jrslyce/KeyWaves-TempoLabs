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
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface ContactModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  publisherName?: string;
  campaignTitle?: string;
}

const ContactModal = ({
  open = true,
  onOpenChange = () => {},
  publisherName = "Game Publisher",
  campaignTitle = "Sample Campaign",
}: ContactModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contact {publisherName}</DialogTitle>
          <DialogDescription>
            Send a message regarding the campaign: {campaignTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter the subject of your message"
              defaultValue="Question about campaign requirements"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here"
              className="min-h-[150px]"
              defaultValue="I have a question about..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Send Message</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
