import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Trophy, Clock } from "lucide-react";

interface CampaignDetailsProps {
  gameDescription?: string;
  requirements?: string[];
  eligibilityCriteria?: {
    followers: number;
    platform: string;
    contentType: string[];
  };
}

const CampaignDetails = ({
  gameDescription = "Experience an epic adventure in this groundbreaking open-world RPG. Forge your path through a richly detailed universe where your choices shape the story. Features stunning graphics, dynamic combat, and an immersive storyline that will keep you engaged for hours.",
  requirements = [
    "Create at least one video review of the game",
    "Share your content on your primary platform",
    "Include game key disclosure in content",
    "Publish within 14 days of receiving the key",
  ],
  eligibilityCriteria = {
    followers: 5000,
    platform: "YouTube/Twitch",
    contentType: ["Video Review", "Let's Play", "First Impressions"],
  },
}: CampaignDetailsProps) => {
  return (
    <div className="w-full max-w-[1000px] bg-background p-6 rounded-lg space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Game Description</h2>
        <p className="text-muted-foreground leading-relaxed">
          {gameDescription}
        </p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Creator Requirements</h2>
        </div>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          <ul className="space-y-4">
            {requirements.map((requirement, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-muted-foreground">{requirement}</span>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Eligibility Criteria</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Minimum Following</h3>
            <Badge variant="secondary" className="text-lg">
              {eligibilityCriteria.followers.toLocaleString()}+ Followers
            </Badge>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Accepted Platforms</h3>
            <Badge variant="secondary" className="text-lg">
              {eligibilityCriteria.platform}
            </Badge>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Content Types</h3>
            <div className="flex flex-wrap gap-2">
              {eligibilityCriteria.contentType.map((type, index) => (
                <Badge key={index} variant="outline">
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Response time: Within 48 hours</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CampaignDetails;
