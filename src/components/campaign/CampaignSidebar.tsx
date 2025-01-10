import React from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar, Clock, Mail, MapPin, User } from "lucide-react";

interface CampaignSidebarProps {
  status?: "active" | "ended" | "upcoming";
  startDate?: string;
  endDate?: string;
  publisherName?: string;
  publisherEmail?: string;
  publisherLocation?: string;
  onContactClick?: () => void;
}

const CampaignSidebar = ({
  status = "active",
  startDate = "2024-03-01",
  endDate = "2024-04-01",
  publisherName = "Game Studio Inc.",
  publisherEmail = "contact@gamestudio.com",
  publisherLocation = "San Francisco, CA",
  onContactClick = () => {},
}: CampaignSidebarProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "ended":
        return "bg-red-500";
      case "upcoming":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-[380px] bg-background p-4 border-l border-border">
      <Card className="p-6 space-y-6">
        {/* Campaign Status */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Campaign Status</h3>
          <Badge className={`${getStatusColor(status)} text-white capitalize`}>
            {status}
          </Badge>
        </div>

        {/* Key Dates */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Key Dates</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Start: {startDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">End: {endDate}</span>
            </div>
          </div>
        </div>

        {/* Publisher Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Publisher Information</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm">{publisherName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{publisherEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{publisherLocation}</span>
            </div>
          </div>
        </div>

        {/* Contact Button */}
        <Button className="w-full" variant="outline" onClick={onContactClick}>
          Contact Publisher
        </Button>
      </Card>
    </div>
  );
};

export default CampaignSidebar;
