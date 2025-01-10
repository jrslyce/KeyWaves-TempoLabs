import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  title?: string;
  publisher?: string;
  publisherLogo?: string;
  heroImage?: string;
  status?: "active" | "upcoming" | "ended";
  campaignType?: string;
}

const HeroSection = ({
  title = "Awesome Game Title",
  publisher = "Epic Games Studio",
  publisherLogo = "https://api.dicebear.com/7.x/avataaars/svg?seed=publisher",
  heroImage = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80",
  status = "active",
  campaignType = "Creator Campaign",
}: HeroSectionProps) => {
  return (
    <div className="relative w-full h-[400px] bg-background">
      {/* Hero Image Background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60" /> {/* Overlay */}
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
        {/* Status Badge */}
        <div className="mb-4">
          <Badge
            variant={
              status === "active"
                ? "default"
                : status === "upcoming"
                  ? "secondary"
                  : "destructive"
            }
            className="text-sm"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          <Badge variant="outline" className="ml-2 text-sm">
            {campaignType}
          </Badge>
        </div>

        {/* Publisher Info */}
        <div className="flex items-center mb-4">
          <img
            src={publisherLogo}
            alt={publisher}
            className="w-12 h-12 rounded-full bg-background"
          />
          <span className="ml-3 text-white text-lg font-medium">
            {publisher}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          {title}
        </h1>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button size="lg" variant="default">
            Apply Now
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
